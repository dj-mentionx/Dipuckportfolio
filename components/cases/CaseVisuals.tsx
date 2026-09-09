export function AlignVisual() {
  return (
    <div className="case-visual case-visual--align" aria-hidden>
      <div className="case-visual__blocks">
        {["Paid", "SEO", "Report", "CRM", "Content", "Sales"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p>Fragmented blocks find one commercial map.</p>
    </div>
  );
}

export function BlueprintVisual() {
  return (
    <div className="case-visual case-visual--blueprint" aria-hidden>
      <svg viewBox="0 0 400 180">
        <rect x="8" y="8" width="384" height="164" />
        <path d="M24 40 H376 M24 90 H376 M24 140 H200" />
        <circle cx="80" cy="90" r="18" />
        <circle cx="200" cy="90" r="18" />
        <circle cx="320" cy="90" r="18" />
        <path d="M98 90 H182 M218 90 H302" />
      </svg>
      <p>A construction drawing becomes demand architecture.</p>
    </div>
  );
}

export function CurveVisual() {
  return (
    <div className="case-visual case-visual--curve" aria-hidden>
      <div className="case-visual__dust">
        {Array.from({ length: 48 }, (_, index) => (
          <i key={index} style={{ ["--i" as string]: index }} />
        ))}
      </div>
      <svg viewBox="0 0 400 160">
        <path d="M20 130 C 80 128, 120 110, 170 90 S 280 30, 380 22" />
      </svg>
      <p>Small signals converge into one growth curve.</p>
    </div>
  );
}

export function NetworkVisual() {
  return (
    <div className="case-visual case-visual--network" aria-hidden>
      <svg viewBox="0 0 400 180">
        {[
          [40, 40],
          [120, 70],
          [70, 130],
          [200, 40],
          [250, 120],
          [330, 50],
          [360, 140],
        ].map(([x, y], index) => (
          <g key={index}>
            <circle cx={x} cy={y} r="5" />
            <line x1={x} y1={y} x2="200" y2="90" />
          </g>
        ))}
        <circle cx="200" cy="90" r="10" />
      </svg>
      <p>Disconnected stores become one market signal.</p>
    </div>
  );
}

export function CollapseVisual() {
  return (
    <div className="case-visual case-visual--collapse" aria-hidden>
      <div className="case-visual__noise">
        {["Feature", "Price", "AI", "Suite", "All-in-one", "Platform"].map((word) => (
          <span key={word}>{word}</span>
        ))}
      </div>
      <strong>One clear decision path</strong>
    </div>
  );
}

export function RadarVisual() {
  return (
    <div className="case-visual case-visual--radar" aria-hidden>
      <div className="radar">
        <span className="radar__core">Brand</span>
        <span className="radar__ring" />
        <span className="radar__ring radar__ring--2" />
        <span className="radar__sweep" />
        <b className="is-a">Buyer prompts</b>
        <b className="is-b">ChatGPT</b>
        <b className="is-c">Gemini</b>
        <b className="is-d">Competitors</b>
        <b className="is-e">Sources</b>
        <b className="is-f">Actions</b>
      </div>
      <p>An AI radar: prompts, engines, competitors, sources, then a queue of actions.</p>
    </div>
  );
}

export function CaseVisual({ kind }: { kind: "align" | "blueprint" | "curve" | "network" | "collapse" | "radar" }) {
  if (kind === "align") return <AlignVisual />;
  if (kind === "blueprint") return <BlueprintVisual />;
  if (kind === "curve") return <CurveVisual />;
  if (kind === "network") return <NetworkVisual />;
  if (kind === "collapse") return <CollapseVisual />;
  return <RadarVisual />;
}
