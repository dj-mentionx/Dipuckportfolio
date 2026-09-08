import { ImageResponse } from "next/og";

export const runtime = "nodejs";

function clamp(value: string | null, fallback: string, max = 48): string {
  return (value || fallback).trim().slice(0, max);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = clamp(searchParams.get("name"), "Untitled");
  const score = Math.max(0, Math.min(99, Number(searchParams.get("score") || 0) || 0));
  const mentioned = searchParams.get("mentioned") === "1";

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
          padding: 48,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 6, color: "#C8F542" }}>
          <div style={{ display: "flex" }}>COMPOSE · LOCK {String(score)}</div>
          <div style={{ display: "flex" }}>{mentioned ? "IN FRAME" : "OUT OF FRAME"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: -3 }}>{name}</div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 28, color: "rgba(244,244,240,0.7)" }}>
            MentionX pull · dipuckjones.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
