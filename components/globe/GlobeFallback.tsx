"use client";

import { GLOBE_NODES, ORBITING_ARTEFACTS, type GlobeNodeId } from "@/lib/archive";

export function GlobeFallback({
  rotation,
  focus,
  hover,
  onNode,
  onHover,
}: {
  rotation: { x: number; y: number };
  focus: GlobeNodeId | null;
  hover: GlobeNodeId | null;
  onNode: (id: GlobeNodeId) => void;
  onHover: (id: GlobeNodeId | null) => void;
}) {
  return (
    <div className="globe-fallback" aria-hidden={false}>
      <div
        className="globe-fallback__sphere"
        style={{ transform: `rotateX(${12 + rotation.x * 18}deg) rotateY(${rotation.y * 18}deg)` }}
      >
        <span className="globe-fallback__contour" />
        <span className="globe-fallback__contour" />
        <span className="globe-fallback__contour" />
        <span className="globe-fallback__pulse" />
        {GLOBE_NODES.map((node) => (
          <button
            key={node.id}
            type="button"
            className={`globe-fallback__node is-${node.id}${hover === node.id || focus === node.id ? " is-on" : ""}`}
            onClick={() => onNode(node.id)}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            data-cursor="explore-signals"
          >
            {node.name}
          </button>
        ))}
      </div>
      <ul className="globe-fallback__list">
        {ORBITING_ARTEFACTS.map((item) => (
          <li key={item.id}>
            <a href={item.href} data-cursor={item.cursor}>
              <em>{item.number}</em>
              <strong>{item.name}</strong>
              <span>{item.impact}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
