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
          backgroundColor: "#07140f",
          color: "#F3EAD8",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: "#B7AA93" }}>FOREST · VILLAGE · CITY</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 0.95 }}>Dipuck Jones</div>
          <div style={{ marginTop: 18, fontSize: 30, color: "#F0C27A" }}>Scroll sideways. The land evolves.</div>
        </div>
        <div style={{ display: "flex", fontSize: 20 }}>ABOUT · EXP · BOMB · CONTACT</div>
      </div>
    ),
    size,
  );
}
