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
          backgroundColor: "#050507",
          color: "#F4F4F0",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 8, color: "#C8F542" }}>COMPOSE · LIVE LOCKUP</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 0.9, fontWeight: 800, letterSpacing: -3 }}>DIPUCK JONES</div>
          <div style={{ marginTop: 18, fontSize: 28, color: "rgba(244,244,240,0.7)" }}>
            Conduct the field. The type follows.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: "#C8F542" }}>ABOUT · WORK · MENTIONX · CONTACT</div>
      </div>
    ),
    size,
  );
}
