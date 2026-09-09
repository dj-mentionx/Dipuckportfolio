"use client";

import { GLOBE_NODES, ORBITING_ARTEFACTS, type GlobeNodeId } from "@/lib/archive";

export function StoryPanel({
  nodeId,
  onClose,
  onOpen,
}: {
  nodeId: GlobeNodeId;
  onClose: () => void;
  onOpen?: (href: string) => void;
}) {
  const node = GLOBE_NODES.find((item) => item.id === nodeId);
  if (!node) return null;
  const related = ORBITING_ARTEFACTS.filter((item) => node.related.includes(item.id));

  return (
    <aside className="story-panel" aria-live="polite">
      <p className="story-panel__kicker">
        {node.name.toUpperCase()} / {node.role.toUpperCase()}
      </p>
      <h3>{node.story}</h3>
      <ul>
        {related.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              data-cursor={item.cursor}
              onClick={() => onOpen?.(item.href)}
            >
              <span>{item.number}</span>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="story-panel__hold" onClick={onClose}>
        Hold position
      </button>
    </aside>
  );
}
