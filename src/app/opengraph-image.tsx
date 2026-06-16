import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Yamiekr_Home";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          color: "white",
          background:
            "radial-gradient(circle at 20% 20%, #38bdf8 0, transparent 32%), radial-gradient(circle at 80% 10%, #8b5cf6 0, transparent 30%), linear-gradient(135deg, #020617 0%, #0f172a 52%, #111827 100%)",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, color: "#7dd3fc" }}>
          YAMIKER.CLOUD
        </div>
        <div style={{ marginTop: 28, fontSize: 86, fontWeight: 800 }}>
          Yamiekr_Home
        </div>
        <div style={{ marginTop: 24, maxWidth: 850, fontSize: 34, lineHeight: 1.35, color: "#cbd5e1" }}>
          Developer · Writer · Explorer / 开发者 · 写作者 · 探索者
        </div>
      </div>
    ),
    size,
  );
}
