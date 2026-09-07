import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          backgroundColor: "#07080c",
          color: "#F4F1EA",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 18, letterSpacing: 6, color: "rgba(255,255,255,0.45)" }}>
          UNPROMPTED
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 1.05 }}>Ask the field.</div>
          <div style={{ marginTop: 16, fontSize: 28, color: "rgba(255,255,255,0.6)", maxWidth: 800 }}>
            Four models. One question. Then ask about yourself.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#FF4A2A", fontSize: 20 }}>
          <div style={{ display: "flex" }}>dipuckjones.com</div>
          <div style={{ display: "flex" }}>LIVE</div>
        </div>
      </div>
    ),
    size,
  );
}
