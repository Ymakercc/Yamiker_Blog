"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a,button,[role=button],input,textarea,select,label,[tabindex]";
// Cursor box is 28×28 — offset by half to center on pointer
const HALF = 14;

export default function PixelCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    el.style.display = "block";
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - HALF}px,${e.clientY - HALF}px)`;
    };

    const onOver = (e: MouseEvent) => {
      const over =
        e.target instanceof Element && !!e.target.closest(INTERACTIVE);
      el.dataset.hover = over ? "1" : "";
    };

    const onDown = () => { el.dataset.active = "1"; };
    const onUp   = () => { delete el.dataset.active; };
    const onLeave = () => { el.style.opacity = "0"; };
    const onEnter = () => { el.style.opacity = "1"; };

    document.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("mouseover",  onOver,  { passive: true });
    document.addEventListener("mousedown",  onDown);
    document.addEventListener("mouseup",    onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    // Four <i> = corner brackets  |  <span> = center dot
    <div id="px-cursor" aria-hidden="true" style={{ display: "none" }}>
      <i /><i /><i /><i />
      <span />
    </div>
  );
}
