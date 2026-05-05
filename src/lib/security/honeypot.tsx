"use client";
import React, { useRef } from "react";

// A visually hidden field that real users never fill — bots do.
// Name is intentionally attractive to bots ("website" / "url").
// CSS-hidden rather than display:none so most bots still see it in the DOM.

export function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}
      tabIndex={-1}
    >
      <label htmlFor="__hp_website">Website</label>
      <input
        id="__hp_website"
        name="website"
        type="text"
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  );
}

// Hook to read honeypot value from the form ref and detect bots
export function useHoneypot(formRef: React.RefObject<HTMLFormElement | null>) {
  const isBot = (): boolean => {
    if (!formRef.current) return false;
    const field = formRef.current.elements.namedItem("website") as HTMLInputElement | null;
    return !!(field && field.value.trim().length > 0);
  };
  return { isBot };
}
