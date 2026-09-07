"use client";

import type { RoomId } from "@/lib/rooms";

type WorldProps = {
  progress: number;
  onOpen: (room: RoomId) => void;
};

export function World({ progress, onOpen }: WorldProps) {
  const forest = clamp(1 - progress * 2.1);
  const village = clamp(1 - Math.abs(progress - 0.42) * 2.4);
  const city = clamp((progress - 0.55) * 2.4);
  const inCity = progress > 0.68;

  return (
    <div className="world-layers">
      <div className="sky" />
      <div className="moon" style={{ opacity: 0.35 + forest * 0.45 }} />
      <div className="haze haze-far" />

      <div className="layer forest-far" style={{ opacity: forest, transform: `translateX(${progress * -40}px)` }}>
        <Ridge />
      </div>

      <div className="layer village-mid" style={{ opacity: village, transform: `translateX(${progress * -90}px)` }}>
        <Houses />
      </div>

      <div className="layer city-mid" style={{ opacity: city, transform: `translateX(${progress * -70}px)` }}>
        <Skyline />
      </div>

      <div className="ground" />
      <div className="path" />

      <div className="layer forest-near" style={{ opacity: Math.max(forest, 0.08), transform: `translateX(${progress * -160}px)` }}>
        <Trees />
      </div>

      <div className="fireflies" style={{ opacity: forest }} aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{ left: `${8 + i * 6}%`, animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      <div className={`city-doors ${inCity ? "is-lit" : ""}`}>
        <button type="button" onClick={() => onOpen("about")} disabled={!inCity}>
          <b>ABOUT</b>
          <span>The cottage</span>
        </button>
        <button type="button" onClick={() => onOpen("exp")} disabled={!inCity}>
          <b>EXP</b>
          <span>The archive</span>
        </button>
        <button type="button" onClick={() => onOpen("bomb")} disabled={!inCity}>
          <b>BOMB</b>
          <span>MentionX</span>
        </button>
        <button type="button" onClick={() => onOpen("contact")} disabled={!inCity}>
          <b>CONTACT</b>
          <span>The desk</span>
        </button>
      </div>
    </div>
  );
}

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

function Ridge() {
  return (
    <svg className="fill-layer" viewBox="0 0 1600 400" preserveAspectRatio="none">
      <path
        fill="#08140f"
        d="M0 260 C120 200 220 230 340 190 C480 140 560 210 720 170 C880 120 980 200 1140 160 C1280 128 1400 190 1600 150 V400 H0 Z"
      />
    </svg>
  );
}

function Trees() {
  const trunks = [40, 110, 190, 270, 360, 450, 540, 640, 740, 830, 920, 1020, 1120, 1220, 1320, 1450];
  return (
    <svg className="fill-layer trees" viewBox="0 0 1600 500" preserveAspectRatio="xMidYMax meet">
      {trunks.map((x, i) => {
        const h = 160 + ((i * 47) % 90);
        const w = 46 + ((i * 13) % 28);
        return (
          <g key={x} fill="#04110c">
            <path d={`M${x} 500 L${x + 8} ${500 - h * 0.35} L${x - 6} ${500 - h * 0.35} Z`} />
            <ellipse cx={x + 2} cy={500 - h} rx={w} ry={h * 0.55} />
            <ellipse cx={x - w * 0.25} cy={500 - h * 0.78} rx={w * 0.7} ry={h * 0.38} />
          </g>
        );
      })}
    </svg>
  );
}

function Houses() {
  return (
    <svg className="fill-layer" viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax meet">
      <g fill="#1a120d">
        <path d="M180 420 V300 L250 250 L320 300 V420 Z" />
        <path d="M360 420 V280 L470 210 L580 280 V420 Z" />
        <path d="M620 420 V310 L690 260 L760 310 V420 Z" />
        <path d="M900 420 V270 L1040 200 L1180 270 V420 Z" />
        <path d="M1240 420 V300 L1320 240 L1400 300 V420 Z" />
      </g>
      <g fill="#f0c27a">
        <rect x="220" y="330" width="18" height="22" opacity="0.85" />
        <rect x="270" y="330" width="18" height="22" opacity="0.55" />
        <rect x="420" y="320" width="20" height="26" opacity="0.9" />
        <rect x="500" y="320" width="20" height="26" opacity="0.45" />
        <rect x="660" y="340" width="16" height="20" opacity="0.8" />
        <rect x="980" y="310" width="22" height="28" opacity="0.75" />
        <rect x="1080" y="310" width="22" height="28" opacity="0.95" />
        <rect x="1290" y="330" width="18" height="22" opacity="0.65" />
      </g>
    </svg>
  );
}

function Skyline() {
  const blocks = [
    [80, 210],
    [160, 280],
    [240, 180],
    [320, 320],
    [410, 240],
    [500, 360],
    [590, 200],
    [670, 300],
    [760, 260],
    [850, 340],
    [940, 190],
    [1020, 310],
    [1110, 230],
    [1200, 350],
    [1290, 220],
    [1380, 290],
  ];
  return (
    <svg className="fill-layer" viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax meet">
      {blocks.map(([x, h], i) => (
        <g key={x}>
          <rect x={x} y={420 - h} width={64 + (i % 3) * 10} height={h} fill="#0b1220" />
          <rect x={x + 8} y={420 - h + 16} width={48} height={h - 28} fill="#f4e7c3" opacity={0.08 + (i % 5) * 0.03} />
        </g>
      ))}
    </svg>
  );
}
