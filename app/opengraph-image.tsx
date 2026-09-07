import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B0907",
          color: "#EFE6D4",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: "#8A7D6B" }}>RUSHES · 35MM</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 80, lineHeight: 0.95 }}>Dipuck Jones</div>
          <div style={{ marginTop: 16, fontSize: 32, color: "#F0C27A" }}>Thirteen years. One print. Scrub.</div>
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#FF3B2F" }}>SCENE 01 · TAKE 13 · BERLIN</div>
      </div>
    ),
    size,
  );
}
