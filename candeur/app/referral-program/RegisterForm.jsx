"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { submitToSheet } from "./submitToSheet";

const EMPTY = {
  fullName: "",
  phone: "",
  email: "",
  unitNo: "",
  refName: "",
  refPhone: "",
  relationship: "",
  consent: false,
  website: "", // honeypot: hidden from users, must stay empty
};

// Same pattern the Apps Script enforces on the server.
const NAME_RE = /^[A-Za-z][A-Za-z .'-]{1,59}$/;
const PHONE_RE = /^[6-9]\d{9}$/;

// Listed in page order: the first invalid field is the one that receives focus.
const VALIDATORS = {
  fullName(value) {
    const v = value.trim();
    if (!v) return "Please enter your full name.";
    if (!NAME_RE.test(v)) return "Please enter a valid name (letters only, 2-60 characters).";
    return "";
  },
  phone(value) {
    if (!value) return "Please enter your phone number.";
    if (!PHONE_RE.test(value)) return "Please enter a valid 10-digit Indian mobile number.";
    return "";
  },
  email(value) {
    const v = value.trim();
    if (!v) return "Please enter your email address.";
    if (v.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
    return "";
  },
  unitNo(value) {
    const v = value.trim();
    if (!v) return "Please enter your tower / unit number or booking ID.";
    if (v.length > 50) return "Please keep this under 50 characters.";
    return "";
  },
  refName(value) {
    const v = value.trim();
    if (!v) return "Please enter the referee's full name.";
    if (!NAME_RE.test(v)) return "Please enter a valid name (letters only, 2-60 characters).";
    return "";
  },
  refPhone(value, all) {
    if (!value) return "Please enter the referee's phone number.";
    if (!PHONE_RE.test(value)) return "Please enter a valid 10-digit Indian mobile number.";
    if (value === all.phone) return "The referee's number can't be the same as yours.";
    return "";
  },
  relationship(value) {
    // Optional field
    if (value.trim().length > 50) return "Please keep this under 50 characters.";
    return "";
  },
  consent(value) {
    if (!value) return "Please confirm the referee has agreed to be contacted.";
    return "";
  },
};

const FIELDS = Object.keys(VALIDATORS);

export default function RegisterForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [ready, setReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const success = useRef(null);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (submittedName) success.current?.focus();
  }, [submittedName]);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    let next = type === "checkbox" ? checked : value;
    if (name === "phone" || name === "refPhone") next = value.replace(/\D/g, "");

    const updated = { ...values, [name]: next };
    setValues(updated);

    // Don't interrupt first-time typing; only update messages that are already showing.
    setErrors((current) => {
      const out = { ...current };
      if (current[name] !== undefined && current[name] !== "") out[name] = VALIDATORS[name](next, updated);
      // Referee phone depends on your phone.
      if (name === "phone" && current.refPhone) out.refPhone = VALIDATORS.refPhone(updated.refPhone, updated);
      return out;
    });
  }

  function handleBlur(e) {
    const { name } = e.target;
    setErrors((current) => ({ ...current, [name]: VALIDATORS[name](values[name], values) }));
  }

  async function submit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors = {};
    for (const field of FIELDS) nextErrors[field] = VALIDATORS[field](values[field], values);
    setErrors(nextErrors);
    setFormError("");

    const firstInvalid = FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`referral-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const fullName = values.fullName.trim();
      const result = await submitToSheet({
        full_name: fullName,
        phone: values.phone,
        email: values.email.trim(),
        unit_no: values.unitNo.trim(),
        referee_name: values.refName.trim(),
        referee_phone: values.refPhone,
        relationship: values.relationship.trim(),
        website: values.website,
      });

      if (!result.success) {
        if (result.duplicate) {
          setErrors((current) => ({ ...current, refPhone: result.message }));
          document.getElementById("referral-refPhone")?.focus();
        } else {
          setFormError(result.message || "Failed to submit your details.");
        }
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "candeur_referral_form_submission",
        form_name: "Referral Program",
        button_name: "Submit",
      });

      setSubmittedName(fullName);
    } catch (error) {
      console.error("Referral error:", error);
      setFormError("Unable to submit your details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedName) {
    return (
      <div className="register__panel">
        <div className="register__success">
          <CheckCircle size={38} weight="light" />
          <h1 ref={success} tabIndex={-1}>
            Thank you {submittedName.split(" ")[0]}.
          </h1>
          <p>Your referral has been successfully submitted. Our team will connect with your referee shortly.</p>
        </div>
      </div>
    );
  }

  function fieldProps(field) {
    return {
      id: `referral-${field}`,
      name: field,
      value: values[field],
      onChange: handleChange,
      onBlur: handleBlur,
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": errors[field] ? `referral-${field}-error` : undefined,
    };
  }

  return (
    <div className="register__panel">
      <form onSubmit={submit} aria-labelledby="referral-title" noValidate>
        <fieldset disabled={!ready}>
          <h1 id="referral-title">Referral Program</h1>

          <div className="register__section">
            <h2>Your details</h2>
            <div className="register__fields">
              <div>
                <label htmlFor="referral-fullName">Full Name*</label>
                <input
                  {...fieldProps("fullName")}
                  className="register__input"
                  required
                  autoComplete="name"
                  maxLength={60}
                  placeholder="Full Name"
                />
                <FieldError field="fullName" message={errors.fullName} />
              </div>
              <div>
                <label htmlFor="referral-phone">Phone Number*</label>
                <div className={`register__phone ${errors.phone ? "register__phone--invalid" : ""}`}>
                  <span>+91</span>
                  <input
                    {...fieldProps("phone")}
                    className="register__input"
                    required
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder="[ Mobile Number ]"
                  />
                </div>
                <FieldError field="phone" message={errors.phone} />
              </div>
              <div>
                <label htmlFor="referral-email">Email Address*</label>
                <input
                  {...fieldProps("email")}
                  className="register__input"
                  required
                  type="email"
                  autoComplete="email"
                  maxLength={100}
                  placeholder="Enter your email address"
                />
                <FieldError field="email" message={errors.email} />
              </div>
              <div>
                <label htmlFor="referral-unitNo">Tower / Unit No. (or Booking ID)*</label>
                <input
                  {...fieldProps("unitNo")}
                  className="register__input"
                  required
                  maxLength={50}
                  placeholder="Enter tower / unit no. or booking ID"
                />
                <FieldError field="unitNo" message={errors.unitNo} />
              </div>
            </div>
          </div>

          <div className="register__section">
            <h2>Referee&rsquo;s details</h2>
            <div className="register__fields">
              <div>
                <label htmlFor="referral-refName">Referee&rsquo;s Full Name*</label>
                <input
                  {...fieldProps("refName")}
                  className="register__input"
                  required
                  maxLength={60}
                  placeholder="Referee's Full Name"
                />
                <FieldError field="refName" message={errors.refName} />
              </div>
              <div>
                <label htmlFor="referral-refPhone">Referee&rsquo;s Phone Number*</label>
                <div className={`register__phone ${errors.refPhone ? "register__phone--invalid" : ""}`}>
                  <span>+91</span>
                  <input
                    {...fieldProps("refPhone")}
                    className="register__input"
                    required
                    type="tel"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={10}
                    placeholder="[ Mobile Number ]"
                  />
                </div>
                <FieldError field="refPhone" message={errors.refPhone} />
              </div>
              <div>
                <label htmlFor="referral-relationship">Relationship to Referee</label>
                <input
                  {...fieldProps("relationship")}
                  className="register__input"
                  maxLength={50}
                  placeholder="e.g. Friend, Colleague, Relative"
                />
                <FieldError field="relationship" message={errors.relationship} />
              </div>
            </div>
          </div>

          <div className="register__consent">
            <label className="register__checkbox" htmlFor="referral-consent">
              <input
                {...fieldProps("consent")}
                checked={values.consent}
                value={undefined}
                type="checkbox"
                required
              />
              <span>I confirm the referee has agreed to be contacted by the Candeur Arbora team.*</span>
            </label>
            <FieldError field="consent" message={errors.consent} />
          </div>

          {/* Honeypot: hidden from people and assistive tech; bots fill it, the script discards the entry. */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="referral-website">Website</label>
            <input
              id="referral-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange}
            />
          </div>

          {formError && (
            <p className="register__form-error" role="alert">
              {formError}
            </p>
          )}
          <button className="register__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </fieldset>
      </form>
    </div>
  );
}

function FieldError({ field, message }) {
  if (!message) return null;
  return (
    <p className="register__error" id={`referral-${field}-error`}>
      {message}
    </p>
  );
}