import { ImageResponse } from "next/og";

export const runtime = "edge";

function clamp(value: string | null, fallback: string, max = 48): string {
  return (value || fallback).trim().slice(0, max);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = clamp(searchParams.get("name"), "Untitled");
  const score = Math.max(0, Math.min(99, Number(searchParams.get("score") || 0) || 0));
  const mentioned = searchParams.get("mentioned") === "1";
  const filled = Math.max(0, Math.min(10, Math.round(score / 10)));

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
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", fontSize: 20 }}>
          <div style={{ display: "flex" }}>ONE SHEET</div>
          <div style={{ display: "flex", color: "#FF4A2A" }}>{mentioned ? "NAMED" : "0 MENTIONS"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05 }}>{name}</div>
          <div style={{ display: "flex", marginTop: 28, alignItems: "center" }}>
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 0 ? "#FF4A2A" : "#2A2C33", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 1 ? "#FF4A2A" : "#2A2C33", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 2 ? "#FF4A2A" : "#2A2C33", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 3 ? "#FF4A2A" : "#2A2C33", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 4 ? "#FF4A2A" : "#2A2C33", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 5 ? "#FF4A2A" : "#2A2C33", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 6 ? "#FF4A2A" : "#2A2C33", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 7 ? "#FF4A2A" : "#2A2C33", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 8 ? "#FF4A2A" : "#2A2C33", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 9 ? "#FF4A2A" : "#2A2C33", marginRight: 8 }} />
            <div style={{ display: "flex", marginLeft: 12, fontSize: 36 }}>{String(score)}</div>
          </div>
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", fontSize: 20, color: "rgba(255,255,255,0.45)" }}>
          <div style={{ display: "flex" }}>UNPROMPTED</div>
          <div style={{ display: "flex" }}>scanned via dipuckjones.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
