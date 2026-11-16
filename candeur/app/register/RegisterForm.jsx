"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { submitToSheet } from "./submitToSheet";

const EMPTY = { name: "", email: "", phone: "", company: "" };

// Listed in page order: the first invalid field is the one that receives focus.
const VALIDATORS = {
  name(value) {
    const name = value.trim();
    if (!name) return "Please enter your name.";
    if (name.length < 2 || !/^\p{L}[\p{L}\p{M} .'-]*$/u.test(name)) return "Please enter a valid name.";
    return "";
  },
  email(value) {
    const email = value.trim();
    if (!email) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Please enter a valid email address.";
    return "";
  },
  phone(value) {
    if (!value) return "Please enter your mobile number.";
    if (!/^[6-9]\d{9}$/.test(value)) return "Please enter a valid 10-digit Indian mobile number.";
    return "";
  },
  company(value) {
    const company = value.trim();
    if (!company) return "Please enter your company name.";
    if (company.length < 2) return "Please enter a valid company name.";
    return "";
  },
};

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
    const { name, value } = e.target;
    const next = name === "phone" ? value.replace(/\D/g, "") : value;

    setValues((current) => ({ ...current, [name]: next }));
    // Don't interrupt first-time typing; only update a message that is already showing.
    if (errors[name]) setErrors((current) => ({ ...current, [name]: VALIDATORS[name](next) }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setErrors((current) => ({ ...current, [name]: VALIDATORS[name](values[name]) }));
  }

  async function submit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors = {};
    for (const field of Object.keys(VALIDATORS)) {
      nextErrors[field] = VALIDATORS[field](values[field]);
    }
    setErrors(nextErrors);
    setFormError("");

    const firstInvalid = Object.keys(VALIDATORS).find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`register-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const name = values.name.trim();
      const result = await submitToSheet({
        name,
        mobile: values.phone,
        email: values.email.trim(),
        company: values.company.trim(),
      });

      if (!result.success) {
        setFormError(result.message || "Failed to submit your details.");
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "candeur_register_form_submission",
        form_name: "Register",
        button_name: "Submit",
      });

      setSubmittedName(name);
    } catch (error) {
      console.error("Registration error:", error);
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
          <p>Your details have been successfully submitted. Our team will connect with you shortly.</p>
        </div>
      </div>
    );
  }

  function fieldProps(field) {
    return {
      id: `register-${field}`,
      name: field,
      value: values[field],
      required: true,
      onChange: handleChange,
      onBlur: handleBlur,
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": errors[field] ? `register-${field}-error` : undefined,
    };
  }

  return (
    <div className="register__panel">
      <form onSubmit={submit} aria-labelledby="register-title" noValidate>
        <fieldset disabled={!ready}>
          <h1 id="register-title">Register with us.</h1>
          <div className="register__fields">
            <div>
              <label htmlFor="register-name">Your Name*</label>
              <input
                {...fieldProps("name")}
                className="register__input"
                autoComplete="name"
                maxLength={100}
                placeholder="Full Name"
              />
              <FieldError field="name" message={errors.name} />
            </div>
            <div>
              <label htmlFor="register-email">Email Address*</label>
              <input
                {...fieldProps("email")}
                className="register__input"
                type="email"
                autoComplete="email"
                maxLength={254}
                placeholder="Enter your email address"
              />
              <FieldError field="email" message={errors.email} />
            </div>
            <div>
              <label htmlFor="register-phone">Mobile Number*</label>
              <div className={`register__phone ${errors.phone ? "register__phone--invalid" : ""}`}>
                <span>+91</span>
                <input
                  {...fieldProps("phone")}
                  className="register__input"
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
              <label htmlFor="register-company">Company Name*</label>
              <input
                {...fieldProps("company")}
                className="register__input"
                autoComplete="organization"
                maxLength={120}
                placeholder="Enter your company name"
              />
              <FieldError field="company" message={errors.company} />
            </div>
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
    <p className="register__error" id={`register-${field}-error`}>
      {message}
    </p>
  );
}
