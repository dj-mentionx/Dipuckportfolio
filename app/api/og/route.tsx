import { ImageResponse } from "next/og";

export const runtime = "edge";

function clamp(value: string | null, fallback: string, max = 48): string {
  const next = (value || fallback).trim();
  return next.slice(0, max);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = clamp(searchParams.get("name"), "Untitled file");
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
          backgroundColor: "#EDE8DD",
          color: "#14120F",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex" }}>FILE OPENED</div>
          <div style={{ display: "flex", color: "#B23A2F" }}>{mentioned ? "MENTIONED" : "NOT NAMED"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05 }}>{name}</div>
          <div style={{ display: "flex", marginTop: 28, alignItems: "center" }}>
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 0 ? "#B23A2F" : "#D4CFC3", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 1 ? "#B23A2F" : "#D4CFC3", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 2 ? "#B23A2F" : "#D4CFC3", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 3 ? "#B23A2F" : "#D4CFC3", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 4 ? "#B23A2F" : "#D4CFC3", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 5 ? "#B23A2F" : "#D4CFC3", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 6 ? "#B23A2F" : "#D4CFC3", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 7 ? "#B23A2F" : "#D4CFC3", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 8 ? "#B23A2F" : "#D4CFC3", marginRight: 8 }} />
            <div style={{ display: "flex", width: 22, height: 28, backgroundColor: filled > 9 ? "#B23A2F" : "#D4CFC3", marginRight: 8 }} />
            <div style={{ display: "flex", marginLeft: 12, fontSize: 36 }}>{String(score)}</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#8C8578",
          }}
        >
          <div style={{ display: "flex" }}>AI VISIBILITY CARD</div>
          <div style={{ display: "flex" }}>scanned via dipuckjones.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
