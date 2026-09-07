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
          backgroundColor: "#0B0907",
          color: "#EFE6D4",
          padding: 48,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", height: 28 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ display: "flex", width: 28, height: 18, backgroundColor: "#1B1712" }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", padding: "20px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#8A7D6B" }}>
            <div style={{ display: "flex" }}>RUSHES · TAKE {String(score)}</div>
            <div style={{ display: "flex", color: "#FF3B2F" }}>{mentioned ? "IN SYNC" : "WILD SOUND"}</div>
          </div>
          <div style={{ display: "flex", fontSize: 72, marginTop: 24 }}>{name}</div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 28, color: "#F0C27A" }}>
            {mentioned ? "HIT" : "MISS"} · scanned via dipuckjones.com
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", height: 28 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ display: "flex", width: 28, height: 18, backgroundColor: "#1B1712" }} />
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
