"use client";

import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";

const MENU_LINKS = [
  { label: "Amenities", href: "#amenities" },
  { label: "Location", href: "#location" },
  { label: "Master Plan", href: "#residences" },
  { label: "Legacy", href: "#candeur" },
  { label: "FAQs", href: "#faqs" },
];


export default function SiteHeader({ onBrochureClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);
  const openBrochure = (event) => {
    event.preventDefault();
    closeMenu();
    onBrochureClick?.();
  };

  useEffect(() => {
    document.body.classList.toggle("site-menu-open", menuOpen);
    return () => document.body.classList.remove("site-menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <div className="site-header__bar">
          <div className="delta-container site-header__inner">
            <div className="site-header__start">
              <button
                type="button"
                className="site-header__menu-btn"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                onClick={toggleMenu}
              >
                <span className="site-header__menu-icon" aria-hidden="true">
                  <img src="/images/Ham-menu.png" alt="Menu" width={24} height={24} />
                </span>
              </button>
              <a className="site-header__logo brand brand--light" href="#top" aria-label="Candeur home">
                <img src="/images/logo.png" alt="Candeur" width={175} height={44} />
              </a>
            </div>
            <a className="site-header__brochure cta" href="#" onClick={openBrochure} aria-haspopup="dialog">
              Get Priority Launch Access
            </a>
          </div>
        </div>
      </header>

      <div className={`site-menu-root${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        <button
          type="button"
          className="site-menu__backdrop"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={closeMenu}
        />
        <nav className="site-menu" id="site-menu" aria-label="Main menu" inert={!menuOpen ? true : undefined}>
          <button type="button" className="site-menu__close" aria-label="Close menu" onClick={closeMenu}>
            <X size={22} weight="regular" aria-hidden="true" />
          </button>
          <ul className="site-menu__list">
            {MENU_LINKS.map((item) => (
              <li key={item.href}>
                <a className="site-menu__link" href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="site-menu__brochure cta" href="#" onClick={openBrochure} aria-haspopup="dialog">
            Download Brochure
          </a>
        </nav>
      </div>
    </>
  );
}
