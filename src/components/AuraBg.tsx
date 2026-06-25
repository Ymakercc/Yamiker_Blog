// Server component — no hooks, no JS, pure CSS animation.
// Three blurred radial-gradient orbs that slowly drift — all amber phosphor
// (single-hue, monochrome CRT atmosphere):
//   · large bright amber  (primary warmth, left-center)
//   · medium deep amber   (secondary warmth, top-right)
//   · small bright amber  (secondary warmth, bottom-center)
// All at z-index: -1 so they sit above body's dot-grid but below content.
// The existing body::after vignette naturally frames them at the edges.

export default function AuraBg() {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      {/* ── Orb 1: large amber — drifts from left into center ── */}
      <div
        style={{
          position: "fixed",
          zIndex: -1,
          left: "-15vw",
          top: "18vh",
          width: "68vw",
          height: "58vh",
          background:
            "radial-gradient(ellipse at center, rgba(255,176,0,0.30) 0%, transparent 72%)",
          filter: "blur(130px)",
          animation: "aura-drift-1 34s ease-in-out infinite",
        }}
      />

      {/* ── Orb 2: medium deep amber — upper-right, drifts down-left ── */}
      <div
        style={{
          position: "fixed",
          zIndex: -1,
          left: "62vw",
          top: "-12vh",
          width: "50vw",
          height: "46vh",
          background:
            "radial-gradient(ellipse at center, rgba(224,154,43,0.18) 0%, transparent 70%)",
          filter: "blur(150px)",
          animation: "aura-drift-2 42s ease-in-out infinite",
        }}
      />

      {/* ── Orb 3: small amber — lower area, subtle pulse ── */}
      <div
        style={{
          position: "fixed",
          zIndex: -1,
          left: "30vw",
          top: "65vh",
          width: "44vw",
          height: "40vh",
          background:
            "radial-gradient(ellipse at center, rgba(255,176,0,0.18) 0%, transparent 70%)",
          filter: "blur(110px)",
          animation: "aura-drift-3 27s ease-in-out infinite",
        }}
      />
    </div>
  );
}
