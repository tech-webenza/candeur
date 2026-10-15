"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import {
  Check,
  CheckCircle,
  Leaf,
  MapPin,
  Plus,
  Train,
  GraduationCap,
  Heartbeat,
  Buildings,
  ShoppingBag,
  SwimmingPool,
  TennisBall,
  Users,
  Coffee,
  ShieldCheck,
} from "@phosphor-icons/react";
import GalleryCarousel from "@/components/carousel/GalleryCarousel";
import FloorPlanCarousel from "@/components/carousel/FloorPlanCarousel";
import TrustVisualCarousel from "@/components/carousel/TrustVisualCarousel";
import SiteHeader from "@/components/SiteHeader";
import { scanPendingWowElements } from "@/lib/wow/scrollAnimations";
import "./page.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ORIGIN = "17.4707404,78.4066345";

// Opened in a new tab after any enquiry form other than "Download Plan".
const BROCHURE = { url: "/candeur/pdfs/candeur-kukatpally-brochure.pdf" };





const amenities = [
  {
    name: "Nature & outdoors",
    icon: Leaf,
    image: "/candeur/images/figma/amenity-nature.webp",
    alt: "Illustrative photograph of sunlight through a green tree canopy",
    title: "Your Own Little Escape into Nature.",
    copy: " Discover thoughtfully planned green spaces that turn simple outdoor moments into something special.",
    items: [
      "4-acre forest-themed Central Park",
      "17-ft elevated canopy walkway",
      "Dedicated green spine connecting all towers",
      "Landscaped gardens and outdoor relaxation zones",
    ],
  },
  {
    name: "Family & community",
    icon: Users,
    image: "/candeur/images/figma/amenity-family.webp",
    alt: "Illustrative photograph of an Indian family outdoors",
    title: "Where Togetherness Finds More Room to Grow.",
    copy: " From playful afternoons to meaningful celebrations, discover spaces that bring families and neighbours closer.",
    items: [
      "Multi-tier children's play zones",
      "Community gathering and event spaces",
      "Dedicated senior citizen clubhouse",
      "Indoor recreation and leisure facilities",
    ],
  },
  {
    name: "Sports & fitness",
    icon: TennisBall,
    image: "/candeur/images/figma/amenity-sport.webp",
    alt: "Illustrative photograph of a racket and ball on a sunlit court",
    title: "More Ways to Play. More Reasons to Thrive.",
    copy: " Make room for the sports you love, new interests to explore and an active life that feels effortless.",
    items: [
      "Indoor badminton and squash courts",
      "Pickleball and tennis courts",
      "Rooftop box cricket",
      "Mini football and basketball courts",
      "Dedicated calisthenics zone",
      "Virtual golf experience",
    ],
  },
  {
    name: "Everyday convenience",
    icon: Coffee,
    image: "/candeur/images/figma/amenity-everyday.webp",
    alt: "Illustrative photograph of a woman working in a naturally lit lounge",
    title: "The Luxury of Having Everything Within Reach.",
    copy: " Thoughtfully planned conveniences that simplify everyday routines, leaving you with more time for what truly matters.",
    items: [
      "In-house supermarket and pharmacy",
      "On-site clinic and banking facilities",
      "Dedicated co-working spaces and meeting rooms",
      "Crèche and school bus waiting lounge",
    ],
  },
  {
    name: "Wellness",
    icon: SwimmingPool,
    image: "/candeur/images/figma/amenity-wellness.webp",
    alt: "Illustrative photograph of pool water, natural stone and soft daylight",
    title: "Where Every Day Finds Its Balance.",
    copy: " From moments of stillness to refreshing wellness rituals, embrace a lifestyle that nurtures your mind and body.",
    items: ["Temperature-controlled swimming pool", "Luxury spa and yoga studio", "Integrated meditation spaces", "Reflexology pathways", "Shaded gardens and quiet relaxation zones"],
  },
];

// Each entry: { name, distance, query? }. Leave distance empty to show "To be verified".
const placesFor = (places) =>
  places.map(({ name, distance = "", query = `${name} Kukatpally Hyderabad` }) => ({ name, distance, query }));

const neighbourhoods = [
  {
    name: "Metro",
    icon: Train,
    places: placesFor([
      { name: "Kukatpally Metro", distance: "Within 2 km", query: "Kukatpally Metro station Hyderabad" },
      { name: "Bharat Nagar Metro", distance: "Within 3 km", query: "Bharat Nagar Metro station Hyderabad" },
      { name: "Balanagar Metro", distance: "Within 3 km", query: "Balanagar Metro station Hyderabad" },
    ]),
  },
  {
    name: "Schools",
    icon: GraduationCap,
    places: placesFor([
      { name: "Meridian School", distance: "Within 6 km" },
      { name: "The Creek School", distance: "Within 2 km" },
      { name: "EuroSchool", distance: "Within 4 km" },
      { name: "Delhi Public School", distance: "Within 12 km" },
    ]),
  },
  {
    name: "Hospitals",
    icon: Heartbeat,
    places: placesFor([
      { name: "Yashoda Hospitals", distance: "Within 7 km", query: "Yashoda Hospitals Hitec City Hyderabad" },
      { name: "OMNI Hospitals", distance: "Within 3 km" },
      { name: "Remedy Hospitals", distance: "Within 5 km" },
      { name: "SINDHU Hospitals", distance: "Within 7 km" },
    ]),
  },
  {
    name: "Shopping",
    icon: ShoppingBag,
    places: placesFor([
      { name: "Lakeshore Mall", distance: "Within 3 km" },
      { name: "Forum Mall", distance: "Within 1 km" },
      { name: "Manjeera Mall", distance: "Within 6 km" },
      { name: "Ashoka One Mall", distance: "Within 3 km" },
    ]),
  },
];

const gallerySlides = [
  { id: "g1", label: "Open Green Area", src: "/candeur/images/figma/gallery/Open-Green-Area.webp", alt: "Open green landscaped area" },
  { id: "g6", label: "Pool", src: "/candeur/images/figma/gallery/pool.webp", alt: "Swimming pool area" },
  { id: "g12", label: "Senior Citizen Clubhouse", src: "/candeur/images/figma/gallery/Senior-Citizen-Clubhouse.webp", alt: "Senior citizen clubhouse" },
  { id: "g3", label: "Community Space", src: "/candeur/images/figma/gallery/Community-Space.webp", alt: "Community outdoor space" },
  { id: "g5", label: "Sports Courts", src: "/candeur/images/figma/gallery/Sports-Courts.webp", alt: "Sports courts" },
  { id: "g7", label: "Kids Play Area", src: "/candeur/images/figma/gallery/Kids-Play-Area.webp", alt: "Kids play area" },
  { id: "g2", label: "Elevated Walkway", src: "/candeur/images/figma/gallery/Elevated-Walkway.webp", alt: "Elevated walkway through greenery" },
  // { id: "g4", label: "Golf", src: "/candeur/images/figma/gallery/Golf.png", alt: "Golf amenity illustration" },
  // { id: "g8", label: "10 ft Elevated Podium", src: "/candeur/images/figma/gallery/10ft-Elevated-Podium.png", alt: "Elevated podium landscape" },
  // { id: "g9", label: "Clubhouse", src: "/candeur/images/figma/gallery/Clubhouse.png", alt: "Clubhouse exterior" },
  // { id: "g10", label: "Rooftop", src: "/candeur/images/figma/gallery/Rooftop.png", alt: "Rooftop amenity" },
  // { id: "g11", label: "Central Courtyard", src: "/candeur/images/figma/gallery/Central-Courtyard.png", alt: "Central courtyard" },
  // { id: "g13", label: "EV Charging", src: "/candeur/images/figma/gallery/EV-Charging.png", alt: "EV charging area" },
  // { id: "g14", label: "Vehicle Free Zone", src: "/candeur/images/figma/gallery/Vehicle-Free-Zone.png", alt: "Vehicle free zone" },
];

const trustVisualSlides = [
  {
    id: "tv4",
    src: "/candeur/images/trust/candeur-40.webp",
    alt: "Candeur 40 community entrance",
    tag: "Candeur 40",
  },
  {
    id: "tv6",
    src: "/candeur/images/trust/candeur-crescent.webp",
    alt: "Candeur Crescent pool at dusk",
    tag: "Candeur Crescent",
  },
  {
    id: "tv1",
    src: "/candeur/images/trust/candeur-eternia.webp",
    alt: "Candeur Eternia main entrance",
    tag: "Candeur Eternia",
  },
  {
    id: "tv3",
    src: "/candeur/images/trust/clubhouse-view.webp",
    alt: "Green facade residential tower",
    tag: "Candeur Lakescape",
  },
  {
    id: "tv2",
    src: "/candeur/images/trust/candeur-skyline-entrance.webp",
    alt: "Candeur Skyline entrance arch",
    tag: "Candeur Skyline",
  },
  {
    id: "tv5",
    src: "/candeur/images/trust/rooftop-amenities.webp",
    alt: "Rooftop pool and amenities",
    tag: "Candeur Twins",
  },
  // {
  //   id: "tv7",
  //   src: "/candeur/images/trust/candeur-skyline-arch.jpg",
  //   alt: "Candeur Skyline gateway",
  //   tag: "Candeur Skyline",
  // },
];

const floorPlans = [
  {
    id: "fp1",
    src: "/candeur/images/figma/floor-plan-export.png",
    alt: "1,552 sq. ft. 3 BHK floor plan preview",
    title: "Floor plans",
    detail: "1550 - 2150 sq. ft. spaces",
    file: { url: "/candeur/pdfs/plans/3bhk-1550-sqft.pdf", fileName: "Candeur-Kukatpally-3BHK-1550-sqft.pdf", save: true },
    // detail: "2 toilets | 2 balconies | 1 utility",
  },
  {
    id: "fp2",
    src: "/candeur/images/figma/floor-plan-export.png",
    alt: "Alternate 3 BHK floor plan preview",
    title: "Master plans",
    detail: "",
    file: { url: "/candeur/pdfs/plans/3bhk-1565-sqft.pdf", fileName: "Candeur-Kukatpally-3BHK-1565-sqft.pdf", save: true },
    // detail: "3 toilets | 2 balconies | 1 utility",
  },
  // {
  //   id: "fp3",
  //   src: "/candeur/images/figma/floor-plan-export.png",
  //   alt: "Alternate 3 BHK floor plan preview",
  //   title: "1,575 sq. ft. 3bhk",
  //   file: { url: "/candeur/pdfs/plans/3bhk-1575-sqft.pdf", fileName: "Candeur-Kukatpally-3BHK-1575-sqft.pdf", save: true },
  //   // detail: "3 toilets | 2 balconies | 1 utility",
  // },
  // {
  //   id: "fp4",
  //   src: "/candeur/images/figma/floor-plan-export.png",
  //   alt: "Alternate 3 BHK floor plan preview",
  //   title: "1,585 sq. ft. 3bhk",
  //   file: { url: "/candeur/pdfs/plans/3bhk-1585-sqft.pdf", fileName: "Candeur-Kukatpally-3BHK-1585-sqft.pdf", save: true },
  //   // detail: "3 toilets | 2 balconies | 1 utility",
  // },
  // {
  //   id: "fp5",
  //   src: "/candeur/images/figma/floor-plan-export.png",
  //   alt: "Alternate 3 BHK floor plan preview",
  //   title: "1,830 sq. ft. 3bhk",
  //   file: { url: "/candeur/pdfs/plans/3bhk-1830-sqft.pdf", fileName: "Candeur-Kukatpally-3BHK-1830-sqft.pdf", save: true },
  //   // detail: "3 toilets | 2 balconies | 1 utility",
  // },
  // {
  //   id: "fp6",
  //   src: "/candeur/images/figma/floor-plan-export.png",
  //   alt: "Alternate 3 BHK floor plan preview",
  //   title: "1,880 sq. ft. 3bhk",
  //   file: { url: "/candeur/pdfs/plans/3bhk-1880-sqft.pdf", fileName: "Candeur-Kukatpally-3BHK-1880-sqft.pdf", save: true },
  //   // detail: "3 toilets | 2 balconies | 1 utility",
  // },
  // {
  //   id: "fp7",
  //   src: "/candeur/images/figma/floor-plan-export.png",
  //   alt: "Alternate 3 BHK floor plan preview",
  //   title: "2,150 sq. ft. 3bhk",
  //   file: { url: "/candeur/pdfs/plans/3bhk-2150-sqft.pdf", fileName: "Candeur-Kukatpally-3BHK-2150-sqft.pdf", save: true },
  //   // detail: "3 toilets | 2 balconies | 1 utility",
  // },
  // {
  //   id: "fp8",
  //   src: "/candeur/images/figma/floor-plan-export.png",
  //   alt: "Alternate 3 BHK floor plan preview",
  //   title: "2,050 sq. ft. 3bhk",
  //   file: { url: "/candeur/pdfs/plans/3bhk-2050-sqft.pdf", fileName: "Candeur-Kukatpally-3BHK-2050-sqft.pdf", save: true },
  //   // detail: "3 toilets | 2 balconies | 1 utility",
  // },
];

const faqs = [
  [
    "What is the project location?",
    "The project is in Kukatpally, Hyderabad, with three metro stations within 2 km (Kukatpally, Bharat Nagar and Y Junction) and Hitech City about 4 km away. Leading hospitals, including Yashoda, OMNI, Remedy and Sindhu, are close by.",
  ],
  [
    "What is the total land area of the project?",
    "The project spans 20 acres, with 75% left as open space and only 25% built on. It has 13 towers of 25 floors each.",
  ],
  [
    "What are the available home sizes?",
    "The project offers 3 BHK residences from 1,550 sq. ft. to 2,205 sq. ft.",
  ],
  [
    "What is the price range of the proposed apartments?",
    "Prices start from ₹1.3 Cr onwards. Register your interest to know more.",
  ],
  [
    "What amenities are planned?",
    "At the heart of the project is a 4-acre forest-themed central park. Amenities include:",
    [
      "A 1.35 lakh sq. ft. clubhouse with a temperature-controlled swimming pool",
      "Two 35-seater theatres and a virtual golf zone",
      "Tennis, volleyball, basketball and pickleball courts, plus rooftop tennis and box cricket",
      "An open maidan for community events and a separate football area",
      "A dedicated space in the clubhouse for senior citizens",
      "A kids’ play area and a waiting lounge for school buses",
      "A vehicle-free ground level and a full basement floor with provision for EV charging",
    ],
  ],
  [
    "What does priority launch access include?",
    "Registering for priority launch access gives you:",
    [
      "Exclusive early access to available flats",
      "Attractive pre-launch pricing and first choice of premium units",
      "A 50% waiver on corner charges",
    ],
  ],
  [
    "When will the masterplan and floor plans be available?",
    "The masterplan and floor plans are available now. Register your interest to receive them or to speak with our team.",
  ],
  [
    "Are these photographs of the project?",
    "Yes, these are photographs of the project.",
  ],
];

const PRICE_RANGES = [
  "₹1.3 Cr – ₹1.6 Cr",
  "₹1.6 Cr – ₹2 Cr",
  "₹2 Cr – ₹2.5 Cr",
  "₹2.5 Cr+",
];

function Brand({ light = false }) {
  return (
    <a className={`brand ${light ? "brand--light" : ""}`} href="#top" aria-label="Candeur home">
      <img src="/candeur/images/logo.png" alt="Candeur Home" />
    </a>
  );
}



function EnquireLink({
  children = "Get priority launch access",
  className = "",
  onClick,
}) {
  return (
    <a
      className={`cta ${className}`}
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      aria-haspopup="dialog"
    >
      {children}
    </a>
  );
}



function Tabs({ label, entries, selected, onSelect, prefix, variant = "default" }) {
  return (
    <div className={`tab-row tab-row--${variant}`} role="tablist" aria-label={label}>
      {entries.map((item, i) => (
        <button
          key={item.name || item.label}
          type="button"
          role="tab"
          id={`${prefix}-tab-${i}`}
          aria-controls={`${prefix}-panel`}
          aria-selected={selected === i}
          tabIndex={selected === i ? 0 : -1}
          className="wow fadeInUp"
          data-wow-delay={`${0.2 + i * 0.1}s`}
          onClick={() => onSelect(i)}
          onKeyDown={(e) => {
            const n =
              e.key === "ArrowRight"
                ? (i + 1) % entries.length
                : e.key === "ArrowLeft"
                  ? (i - 1 + entries.length) % entries.length
                  : e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? entries.length - 1
                      : null;
            if (n !== null) {
              e.preventDefault();
              onSelect(n);
              e.currentTarget.parentElement.children[n].focus();
            }
          }}
        >
          {item.icon && <item.icon size={19} weight="light" aria-hidden="true" />}
          {item.name || item.label}
        </button>
      ))}
    </div>
  );
}

// Opens the file in a new tab, or saves it directly when `save` is set.
function deliverFile({ url, fileName, save }) {
  if (save) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } else {
    window.open(url, "_blank", "noopener");
  }
}

function LeadForm({ file = BROCHURE, id = "enquire" }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const success = useRef(null);
  const [ready, setReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (submitted) success.current?.focus();
  }, [submitted]);

  async function submit(e) {
  e.preventDefault();

  if (name.trim().length < 2 || !/^[6-9]\d{9}$/.test(phone)) {
    setError("Enter your name and a valid 10-digit Indian mobile number.");
    return;
  }

  if (!priceRange) {
    setError("Please select a price range.");
    return;
  }

  if (!consent) {
    setError("Please provide consent to continue.");
    return;
  }

  setIsSubmitting(true)

  try {
    const response = await fetch("/candeur/api/salesforce-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        phone,
        priceRange,
        email,
      }),
    });

    const result = await response.json();

    // Stop if Salesforce submission fails
    if (!response.ok || !result.success) {
      setError(result.message || "Failed to submit your enquiry.");
      setIsSubmitting(false)
      return;
    }

    // Only execute when Salesforce submission succeeds
    setError("");
    setSubmitted(true);
    setIsSubmitting(false)
    // deliverFile(file);

  } catch (error) {
    console.error("Lead submission error:", error);
    setError("Unable to submit your enquiry. Please try again.");
    setIsSubmitting(false)
  }
}

  return (
    <div className="lead-panel" id={id} tabIndex={-1}>
      {!submitted ? (
        <form onSubmit={submit} aria-label="Priority launch access">
          <fieldset disabled={!ready}>
            <h2 className="wow fadeInUp" data-wow-delay="0.2s">
              Get the first look.
            </h2>
            <div className="form-fields">
              <div>
                <label htmlFor="lead-name">Your Name*</label>
                <input
                  id="lead-name"
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lead-phone">Mobile Number*</label>
                <div className="phone-field">
                  <span>+91</span>
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    pattern="[6-9][0-9]{9}"
                    required
                    maxLength={10}
                    placeholder="[ Mobile Number ]"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lead-email">Email Address</label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lead-price">Price Range*</label>
                <div className="select-field">
                  <select
                    id="lead-price"
                    name="priceRange"
                    required
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="">Select price range</option>
                    {PRICE_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I authorize company representatives to Call, SMS, Email or WhatsApp me about its
                  products and offers. This consent overrides any registration for DNC/NDNC
                </span>
              </label>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className={`cta submit ${isSubmitting && "disabled-btn" }`} type="submit">
              Get priority launch access
            </button>
          </fieldset>
        </form>
      ) : (
        <div className="form-success">
          <CheckCircle size={38} weight="light" />
          <h2 ref={success} tabIndex={-1}>
            Thank you, {name.trim().split(" ")[0]}.
          </h2>
          <p>
            {file.save ? "Your download has started." : "The brochure has opened in a new tab."}{" "}
            <a href={file.url} target="_blank" rel="noopener noreferrer" download={file.save ? file.fileName : undefined}>
              Didn’t get it? Click here.
            </a>
          </p>
          <button className="text-button" onClick={() => setSubmitted(false)}>
            Back to enquiry
          </button>
        </div>
      )}
      {/* <p className="demo-note">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>
          Concept preview · no details sent or saved.
          <br /> Demo verification code: 1234.
        </span>
      </p> */}
    </div>
  );
}

function Amenities() {
  const [selected, select] = useState(0);
  const [expanded, expand] = useState(false);
  const a = amenities[selected];

  useEffect(() => {
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      scanPendingWowElements();
    }, 450);
    return () => clearTimeout(t);
  }, [selected, expanded]);

  return (
    <section className="amenities section-pad" id="amenities">
      <div className="delta-container">
        <div className="section-heading section-heading--stack">
          <h2 className="desktop-view">
            <div style={{ overflow: "hidden" }}>
              <div className="wow fadeInUpLessRotate" data-wow-delay="0.2s">
                A World of Experiences. <em>Right at Home. </em>
              </div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div className="wow fadeInUpLessRotate" data-wow-delay="0.3s">

              </div>
            </div>
          </h2>
          <h2 className="mobile-view wow fadeInUp" data-wow-delay="0.2s">
            A World of Experiences. <em>Right at Home. </em>
          </h2>
          <p className="wow fadeInUp" data-wow-delay="0.4s">
            A 1,35,000 sq. ft. clubhouse. 40+ outdoor amenities.
            <br /> Every reason to look forward to coming home.
          </p>
        </div>
        <Tabs
          label="Explore amenities"
          entries={amenities}
          selected={selected}
          onSelect={select}
          prefix="amenity"
        />
        <div
          className="amenity-panel"
          role="tabpanel"
          id="amenity-panel"
          aria-labelledby={`amenity-tab-${selected}`}
        >
          <div className="amenity-photograph">
            <img key={a.image} src={a.image} alt={a.alt} width="1536" height="1024" loading="lazy" />
            <span>Illustrative lifestyle image. Not the actual amenity.</span>
          </div>
          <div className="amenity-copy" key={selected}>
            <a.icon size={30} weight="light" aria-hidden="true" />
            <h3 className="wow fadeInUp" data-wow-delay="0.2s">
              {a.title}
            </h3>
            <p className="wow fadeInUp" data-wow-delay="0.3s">
              {a.copy}
            </p>
            <ul>
              {a.items.map((item, i) => (
                <li key={item} className="wow fadeInUp" data-wow-delay={`${0.4 + i * 0.1}s`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#23382D" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* <div className="amenity-bottom">
          <p className="wow fadeInUp" data-wow-delay="0.2s">
            Nature, activity and everyday essentials, thoughtfully connected.
          </p>
          <button
            className="text-button wow fadeInUp"
            data-wow-delay="0.3s"
            aria-expanded={expanded}
            aria-controls="all-amenities"
            onClick={() => expand(!expanded)}
          >
            {expanded ? "Hide complete amenity list" : "View all amenities"}
            <Plus className={expanded ? "rotated" : ""} size={19} />
          </button>
        </div> */}
        {expanded && (
          <div className="all-amenities" id="all-amenities">
            {amenities.map((g) => (
              <div key={g.name}>
                <h3>{g.name}</h3>
                <ul>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Neighbourhood() {
  const [category, setCategory] = useState(0);
  const [place, setPlace] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const group = neighbourhoods[category];
  const selected = group.places[place];
  const directions = `https://www.google.com/maps/dir/?api=1&origin=${ORIGIN}&destination=${encodeURIComponent(selected.query)}&travelmode=driving`;

  return (
    <section className="neighbourhood section-pad" id="location">
      <div className="neighbourhood__bg" aria-hidden="true">
        <img src="/candeur/images/figma/neighbourhood/topo-bg.png" alt="" />
      </div>
      <div className="delta-container">
        <div className="section-heading section-heading--split">
          <h2 className="desktop-view">
            <div style={{ overflow: "hidden" }}>
              <div className="wow fadeInUpLessRotate" data-wow-delay="0.2s">
                Close to the City.
              </div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div className="wow fadeInUpLessRotate" data-wow-delay="0.3s">
                <em>Connected to Life.</em>
              </div>
            </div>
          </h2>
          <h2 className="mobile-view wow fadeInUp" data-wow-delay="0.2s">
            Close to the City. <em>Connected to Life.</em>
          </h2>
          <Tabs
            label="Neighbourhood categories"
            entries={neighbourhoods}
            selected={category}
            onSelect={(i) => {
              setCategory(i);
              setPlace(0);
            }}
            prefix="location"
            variant="light"
          />
        </div>
        <div
          className="neighbourhood-layout"
          role="tabpanel"
          id="location-panel"
          aria-labelledby={`location-tab-${category}`}
          style={{ "--place": place }}
        >
          <div className="map-and-detail">
            <div className="map-stage">
              {mapLoaded ? (
                <iframe
                  key={selected.query}
                  title={`Map search for ${selected.name}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selected.query)}&z=14&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="map-start">
                  <MapPin size={38} weight="light" aria-hidden="true" />
                  <h3>Explore {selected.name}.</h3>
                  <p>Open the interactive Google map to see your selected destination.</p>
                  <button type="button" className="outline-button" onClick={() => setMapLoaded(true)}>
                    Load interactive map
                  </button>
                  <small>Loads a third-party map from Google.</small>
                </div>
              )}
            </div>
            <div className="destination-detail" aria-live="polite">
              <div>
                <span className="detail-label wow fadeInUp" data-wow-delay="0.2s">
                  FROM THE PROJECT
                </span>
                <h3 className="wow fadeInUp" data-wow-delay="0.3s">
                  {selected.name}
                </h3>
              </div>
              <div className="distance">
                <strong className="wow fadeInUp" data-wow-delay="0.2s">
                  {selected.distance || "To be verified"}
                </strong>
                <span className="wow fadeInUp" data-wow-delay="0.3s">
                  {selected.distance ? "Indicative distance*" : "Road distance"}
                </span>
              </div>
              {/* <p className="wow fadeInUp" data-wow-delay="0.4s">
                {selected.note ||
                  "Exact branch and road distance are being verified. Use directions to explore the route from the supplied project pin."}
              </p> */}
              {/* <a
                className="text-link wow fadeInUp"
                data-wow-delay="0.5s"
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
              >
                View route & current distance
              </a> */}
            </div>
          </div>
          <div className="place-list" aria-label={`${group.name} destinations`}>
            {group.places.map((p, i) => (
              <button
                key={p.name}
                type="button"
                aria-pressed={place === i}
                className="wow fadeInUp"
                data-wow-delay={`${0.2 + i * 0.1}s`}
                style={{ "--i": i }}
                onClick={() => setPlace(i)}
              >
                <span>{p.name}</span>
                {place === i ? <MapPin size={19} weight="fill" /> : <Plus size={17} />}
              </button>
            ))}
          </div>
        </div>
        {/* <p className="section-note wow fadeInUp" data-wow-delay="0.2s">
          *Supplied estimates, not verified driving distances. Map results may include multiple
          branches.{" "}
          <a href="https://maps.app.goo.gl/eoUU3CUNsuw12gAc7" target="_blank" rel="noopener noreferrer">
            View the supplied project location
          </a>
          .
        </p> */}
      </div>
    </section>
  );
}

function Plans({ onDownloadClick }) {
  return (
    <section className="plans section-pad" id="residences">
      <div className="delta-container">
        <div className="section-heading section-heading--split">
          <h2 className="desktop-view">
            <div style={{ overflow: "hidden" }}>
              <div className="wow fadeInUpLessRotate" data-wow-delay="0.2s">
                Designed for Space.
              </div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div className="wow fadeInUpLessRotate" data-wow-delay="0.3s">
                <em>Planned for Life.</em>
              </div>
            </div>
          </h2>
          <h2 className="mobile-view wow fadeInUp" data-wow-delay="0.2s">
            Designed for Space. <em>Planned for Life.</em>
          </h2>
          <p className="wow fadeInUp" data-wow-delay="0.4s">
            Thoughtfully designed 3 BHK residences with expansive layouts, natural light and privacy, set within a carefully planned 20-acre community.
          </p>
        </div>
        <div className="project-strip">
          <div>
            <strong className="wow fadeInUp" data-wow-delay="0.2s">
              20
            </strong>
            <span className="wow fadeInUp" data-wow-delay="0.3s">
              acres
            </span>
          </div>
          <div>
            <strong className="wow fadeInUp" data-wow-delay="0.3s">
              13
            </strong>
            <span className="wow fadeInUp" data-wow-delay="0.4s">
              towers
            </span>
          </div>
          <div>
            <strong className="wow fadeInUp" data-wow-delay="0.4s">
              25
            </strong>
            <span className="wow fadeInUp" data-wow-delay="0.5s">
              floors, up to
            </span>
          </div>
        </div>
        <div className="plan-preview">
          <div className="plan-preview-copy">
            <h3 className="wow fadeInUp" data-wow-delay="0.2s">
              The Big Picture.<br />  The Finer Details.
            </h3>
            <p className="wow fadeInUp" data-wow-delay="0.3s">
              Explore the 20-acre master plan and discover 3 BHK residences with layouts designed for light, ventilation and privacy.
            </p>
          </div>
          <FloorPlanCarousel plans={floorPlans} onDownloadClick={onDownloadClick} />
        </div>

      </div>
      <div className="gallery-block">
        <GalleryCarousel slides={gallerySlides} />
      </div>
    </section>
  );
}

export default function Home() {
  const root = useRef(null);
  const canvas = useRef(null);
  const [faq, setFaq] = useState(null);
  // File the enquiry modal delivers on submit; null while the modal is closed.
  const [enquiryFile, setEnquiryFile] = useState(null);

  useEffect(() => {
    const panel = root.current.querySelector("#enquire");
    const observer = new IntersectionObserver(
      ([entry]) => root.current?.classList.toggle("form-in-view", entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const stage = canvas.current;
      const ctx = stage.getContext("2d", { alpha: false });
      const frames = [];
      let target = 0;
      let disposed = false;

      function draw() {
        const image = frames[target]?.naturalWidth
          ? frames[target]
          : frames.find((f) => f?.naturalWidth);
        if (!image || !ctx) return;
        const rect = stage.getBoundingClientRect();
        const ratio = Math.min(devicePixelRatio || 1, 1.5);
        const w = Math.round(rect.width * ratio);
        const h = Math.round(rect.height * ratio);
        if (!w || !h) return;
        if (stage.width !== w || stage.height !== h) {
          stage.width = w;
          stage.height = h;
        }
        const scale = Math.max(w / image.width, h / image.height);
        ctx.drawImage(
          image,
          (w - image.width * scale) / 2,
          (h - image.height * scale) / 2,
          image.width * scale,
          image.height * scale
        );
        stage.dataset.frame = String(frames.indexOf(image) + 1);
      }

      const load = (i) =>
        new Promise((resolve) => {
          const image = new Image();
          frames[i] = image;
          image.onload = () => {
            if (!disposed && (i === target || i === 0)) draw();
            resolve();
          };
          image.onerror = resolve;
          image.src = `/candeur/media/hero-frames/frame-${String(i + 1).padStart(3, "0")}.webp`;
        });

      load(0);
      const resize = new ResizeObserver(draw);
      resize.observe(stage);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lenis = new Lenis({
          lerp: 0.085,
          smoothWheel: true,
          syncTouch: false,
          anchors: { offset: -30 },
        });
        lenis.on("scroll", () => {
          ScrollTrigger.update();
          scanPendingWowElements();
        });
        const tick = (t) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        let next = 1;
        const loader = async () => {
          while (!disposed && next < 56) await load(next++);
        };
        Promise.all(Array.from({ length: 4 }, loader));
        ScrollTrigger.create({
          trigger: ".hero-scroll",
          start: "top top",
          end: "bottom 70%",
          onUpdate: ({ progress }) => {
            const frame = Math.round(progress * 55);
            if (frame !== target) {
              target = frame;
              draw();
            }
          },
        });
        gsap.from(".hero-intro > *", {
          y: 18,
          opacity: 0.3,
          duration: 0.85,
          stagger: 0.09,
          ease: "power3.out",
        });
        gsap.utils.toArray(".section-heading").forEach((el) =>
          gsap.from(el, {
            y: 24,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          })
        );
        return () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      });

      mm.add(
        "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(".nature-story", { autoAlpha: 0, y: 35, visibility: "hidden" });
          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".hero-scroll",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.45,
                invalidateOnRefresh: true,
              },
            })
            .to(".hero-intro", { autoAlpha: 0, y: -40, duration: 0.35, ease: "none" }, 0.12)
            .to(".nature-story", { autoAlpha: 1, y: 0, visibility: "visible", duration: 0.4, ease: "none" }, 0.47)
            .to({}, { duration: 0.13 });
        }
      );

      document.fonts.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
      return () => {
        disposed = true;
        resize.disconnect();
        mm.revert();
        frames.forEach((image) => {
          image.onload = null;
          image.onerror = null;
        });
      };
    },
    { scope: root }
  );

  return (
    <div ref={root} className="site">
      <SiteHeader onBrochureClick={() => setEnquiryFile(BROCHURE)} />
      <main>
        <section
          className="hero-scroll"
          id="top"
          aria-label="Candeur’s new address in Kukatpally"
        >
          <div className="hero-stage">
            <div className="hero-film">
              <canvas
                ref={canvas}
                role="img"
                aria-label="Illustrative nature film that progresses with scrolling"
              />
              <div className="hero-shade" />
            </div>
            <div className="hero-layout delta-container">
              <div className="hero-copy">
                <div className="hero-intro">
                  <p className="hero-location">
                    <MapPin size={17} aria-hidden="true" />
                    Kukatpally, Hyderabad
                  </p>
                  <h1 className="desktop-view">
                    In the Heart of Kukatpally.
                    <br />
                    <em>Rooted in Nature.</em>
                  </h1>
                  <h1 className="mobile-view">
                    In the Heart of Kukatpally.
                    <br />
                    <em>Rooted in Nature.</em>
                  </h1>
                  <p className="hero-description">
                    A new chapter of expansive living.
                    <br /> Coming soon. .
                  </p>
                  <div className="hero-stats">
                    <div>
                      <strong>20</strong>
                      <span>acres</span>
                    </div>
                    <div>
                      <strong>3 BHK</strong>
                      <span>residences</span>
                    </div>
                    <div>
                      <strong>₹1.3 Cr</strong>
                      <span>onwards</span>
                    </div>
                  </div>
                </div>
                <div className="nature-story hero-intro">
                  <Leaf size={32} weight="thin" />
                  <h1>
                    A Little More Room for Nature.
                    <br /> <em>A Lot More Room for Life. </em>
                  </h1>
                  <div className="space-stat">
                    <strong>
                      75<span>%</span>
                    </strong>
                    <p>
                      open space
                    </p>
                  </div>
                  <div className="space-stat">
                    <strong>
                      4<span>Acre</span>
                    </strong>
                    <p>
                      forest-themed central park
                    </p>
                  </div>
                </div>
              </div>
              <LeadForm />
            </div>
            {/* <p className="film-caption">Concept film. Not the actual development.</p> */}
          </div>
        </section>

        <Amenities />
        <Neighbourhood />
        <Plans onDownloadClick={(plan) => setEnquiryFile(plan.file)} />

        <section className="trust section-pad" id="candeur">
          <div className="delta-container">
            <h2 className="desktop-view trust-headline">
              <div style={{ overflow: "hidden" }}>
                <div className="wow fadeInUpLessRotate" data-wow-delay="0.2s">
                  Candeur Group - Creating Landmarks.
                </div>
              </div>
              <div style={{ overflow: "hidden" }}>
                <div className="wow fadeInUpLessRotate" data-wow-delay="0.3s">
                  <em>Inspiring Generations. </em>
                </div>
              </div>
            </h2>
            <h2 className="mobile-view trust-headline wow fadeInUp" data-wow-delay="0.2s">
              Candeur Group builds homes and communities across Hyderabad and Bengaluru.
            </h2>
            <TrustVisualCarousel slides={trustVisualSlides} />
            <div className="trust-figures">
              <div>
                <strong className="wow fadeInUp" data-wow-delay="0.2s">
                  16<span>+</span>
                </strong>
                <p className="wow fadeInUp" data-wow-delay="0.3s">
                  years of legacy
                </p>
              </div>
              <div>
                <strong className="wow fadeInUp" data-wow-delay="0.3s">
                  14,000<span>+</span>
                </strong>
                <p className="wow fadeInUp" data-wow-delay="0.4s">
                  happy residents
                </p>
              </div>
              <div>
                <strong className="wow fadeInUp" data-wow-delay="0.4s">
                  5.5<span>M+</span>
                </strong>
                <p className="wow fadeInUp" data-wow-delay="0.5s">
                  sq. ft. delivered
                </p>
              </div>
              <div>
                <strong className="wow fadeInUp" data-wow-delay="0.5s">
                  12.8<span>M+</span>
                </strong>
                <p className="wow fadeInUp" data-wow-delay="0.6s">
                  sq. ft. under development
                </p>
              </div>
            </div>
            <div className="track-record">
              <div>
                <span className="detail-label wow fadeInUp" data-wow-delay="0.2s">
                  Landmark Developments
                </span>
                <h3 className="wow fadeInUp" data-wow-delay="0.3s">
                  Across Two Cities.
                </h3>
              </div>
              <p className="wow fadeInUp" data-wow-delay="0.4s">
                <span>Bengaluru</span>
                Rise · Carlisle · Landmark · Signature · Sunshine
              </p>
              <p className="wow fadeInUp" data-wow-delay="0.5s">
                <span>Hyderabad</span>
                Candeur 40 · Crescent
              </p>
              <EnquireLink onClick={() => setEnquiryFile(BROCHURE)} className="wow fadeInUp" />


              {enquiryFile && (
                <div
                  className="enquiry-overlay"
                  onClick={() => setEnquiryFile(null)}
                >
                  <div
                    className="enquiry-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Priority launch access"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="enquiry-close"
                      aria-label="Close enquiry form"
                      onClick={() => setEnquiryFile(null)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                      >
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>

                    <LeadForm file={enquiryFile} id="enquire-modal" />
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        <section className="faq section-pad" id="faqs">
          <div className="delta-container">
            <div className="faq-layout">
              <div className="faq-intro">
                <h2 className="desktop-view">
                  <div style={{ overflow: "hidden" }}>
                    <div className="wow fadeInUpLessRotate" data-wow-delay="0.2s">
                      The Details Behind
                    </div>
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <div className="wow fadeInUpLessRotate" data-wow-delay="0.3s">
                      <em>Your Next Big Move.</em>
                    </div>
                  </div>
                </h2>
                <h2 className="mobile-view wow fadeInUp" data-wow-delay="0.2s">
                  The Details Behind <em>Your Next Big Move.</em>
                </h2>
                <p className="wow fadeInUp" data-wow-delay="0.4s">
                  Find answers to the questions that matter as you explore your future home.
                </p>
              </div>
              <div>

                {faqs.map(([question, answer, listItems], i) => (
                  <div
                    key={question}
                    className={`faq-item ${faq === i ? "is-open" : ""}`}
                  >
                    <h3>
                      <button
                        className="wow fadeInUp"
                        data-wow-delay={`${0.2 + i * 0.1}s`}
                        onClick={() => setFaq(faq === i ? null : i)}
                        aria-expanded={faq === i}
                        aria-controls={`answer-${i}`}
                      >
                        {question}
                        <Plus size={21} aria-hidden="true" />
                      </button>
                    </h3>

                    <div
                      id={`answer-${i}`}
                      className="faq-answer"
                      inert={faq !== i ? true : undefined}
                    >
                      <div>
                        <p>{answer}</p>

                        {listItems && (
                          <ul className="faq-list">
                            {listItems.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="delta-container">
          <div className="footer-top">
            <Brand light />
            <p className="wow fadeInUp" data-wow-delay="0.2s">
              Rooted in nature.
              <br /> <em>Reaching for life.</em>
            </p>
          </div>
          <div className="footer-bottom">
            <div className="footer-links">
              <a className="" data-wow-delay="0.2s" href="#">
                Terms and Conditions
              </a>
              <a className="" data-wow-delay="0.3s" href="#">
                Privacy Policy
              </a>
            </div>
            {/* <p className="wow fadeInUp" data-wow-delay="0.4s">
              Concept preview. All film and lifestyle imagery is illustrative, not the actual
              development. Amenities and configurations are based on supplied project information and
              are subject to final approval. Price ₹1.3 Cr onwards; applicable charges and terms to
              be confirmed. RERA registration number and approved disclosures awaited for this
              preview.
            </p> */}
            <span>© 2026 Candeur</span>
          </div>
        </div>
      </footer>

      {/* <div className="mobile-action">
        <span>
          ₹1.3 Cr
          <small>onwards</small>
        </span>
        <EnquireLink />
      </div> */}
    </div>
  );
}
