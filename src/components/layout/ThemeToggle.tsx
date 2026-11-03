"use client";

import { useEffect, useState } from "react";

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

// "icon" sits in the navbar, "menu" is a full row inside the phone menu
export default function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "menu" }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const read = () => setDark(document.documentElement.getAttribute("data-theme") === "kindred-dark");
    read();
    // there can be two toggles on the page, so follow the html attribute instead of local state only
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const next = document.documentElement.getAttribute("data-theme") === "kindred-dark" ? "kindred" : "kindred-dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("kindred-theme", next);
    } catch {}
  }

  const label = dark ? "Switch to light theme" : "Switch to dark theme";

  if (variant === "menu") {
    return (
      <button type="button" onClick={toggle} aria-label={label}>
        {dark ? <SunIcon /> : <MoonIcon />}
        {dark ? "Light mode" : "Dark mode"}
      </button>
    );
  }

  return (
    <button type="button" onClick={toggle} className="btn btn-ghost btn-circle" aria-label={label} title={dark ? "Light mode" : "Dark mode"}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
