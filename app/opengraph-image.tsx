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
          backgroundColor: "#080808",
          color: "#F5F2EC",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: "#FF2A1A" }}>
          DIPUCK JONES — THE LOT
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 0.95, letterSpacing: -2 }}>
            I find the signal inside broken growth systems.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: "#FF2A1A" }}>
          BERLIN · GROWTH SYSTEMS · MENTIONX
        </div>
      </div>
    ),
    size,
  );
}
