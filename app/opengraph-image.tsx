import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#EDE8DD",
          color: "#14120F",
          padding: "64px 72px",
          fontFamily: "Georgia, Times New Roman, serif",
        }}
      >
        <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 20, color: "#8C8578" }}>
          FILE NO. DJ–2012–2026
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 1.05 }}>Dipuck Jones</div>
          <div style={{ marginTop: 16, fontSize: 32, maxWidth: 820 }}>
            The file the models already keep. Drag to declassify.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 20,
            color: "#B23A2F",
          }}
        >
          <span>DECLASSIFIED</span>
          <span>dipuckjones.com</span>
        </div>
      </div>
    ),
    size,
  );
}
