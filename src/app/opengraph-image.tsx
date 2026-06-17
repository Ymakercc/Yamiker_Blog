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
          background: "#0E0C0A",
          color: "#E8DCC8",
          fontFamily: "monospace",
          border: "8px solid #2A241C",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#5FD7D7" }}>
          $ guest@yamiker:~
        </div>
        <div style={{ marginTop: 28, fontSize: 86, fontWeight: 800, color: "#FFA51F" }}>
          Yamiekr_Home
        </div>
        <div style={{ marginTop: 24, maxWidth: 850, fontSize: 34, lineHeight: 1.35, color: "#8A7F6D" }}>
          Developer · Writer · Explorer / 开发者 · 写作者 · 探索者
        </div>
      </div>
    ),
    size,
  );
}
