"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GLOBE_NODES,
  ORBITING_ARTEFACTS,
  REGION_WORK,
  shouldUseGlobeFallback,
  type GlobeNodeId,
} from "@/lib/archive";
import dynamic from "next/dynamic";
import type { ProjectedMark } from "./GlobeCanvas";
import { GlobeFallback } from "./GlobeFallback";
import { facingRotation } from "./math";
import { StoryPanel } from "./StoryPanel";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas").then((mod) => mod.GlobeCanvas), {
  ssr: false,
  loading: () => <div className="globe__boot" />,
});

const POSE_KEY = "signal-field-pose";

type Pose = { x: number; y: number; node: GlobeNodeId | null };

function readPose(): Pose | null {
  try {
    const raw = sessionStorage.getItem(POSE_KEY);
    return raw ? (JSON.parse(raw) as Pose) : null;
  } catch {
    return null;
  }
}

export function GlobalSignalField({ home = false }: { home?: boolean }) {
  const router = useRouter();
  const nodeEls = useRef<Record<string, HTMLButtonElement | null>>({});
  const cardEls = useRef<Record<string, HTMLAnchorElement | null>>({});
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [fallback, setFallback] = useState(true);
  const [dense, setDense] = useState(false);
  const [hover, setHover] = useState<GlobeNodeId | null>(null);
  const [focus, setFocus] = useState<GlobeNodeId | null>(null);
  const [rotation, setRotation] = useState({ x: -0.22, y: 2.42 });
  const [dissolving, setDissolving] = useState(false);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hotCard, setHotCard] = useState<string | null>(null);

  useEffect(() => {
    const useFallback = shouldUseGlobeFallback();
    setFallback(useFallback);
    setDense(!useFallback && window.innerWidth >= 900 && (navigator.hardwareConcurrency || 4) >= 4);
    const stored = readPose();
    if (stored) {
      setRotation({ x: stored.x, y: stored.y });
      setFocus(stored.node);
      setLive(true);
    } else {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(() => setLive(true), reduce ? 0 : 720);
    }
    setReady(true);
  }, []);

  const highlighted = useMemo(() => {
    if (!hover && !focus) return new Set<string>();
    const region = (hover ?? focus) as GlobeNodeId;
    return new Set(REGION_WORK[region] ?? []);
  }, [focus, hover]);

  const persist = useCallback((next: Pose) => {
    try {
      sessionStorage.setItem(POSE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const focusNode = useCallback(
    (id: GlobeNodeId) => {
      const node = GLOBE_NODES.find((item) => item.id === id);
      if (!node) return;
      const facing = facingRotation(node.lat, node.lng);
      setRotation(facing);
      setFocus(id);
      persist({ ...facing, node: id });
      document.documentElement.style.setProperty("--field-tint", node.tint);
    },
    [persist],
  );

  const onProject = useCallback(
    (marks: ProjectedMark[]) => {
      marks.forEach((mark) => {
        const el = mark.kind === "node" ? nodeEls.current[mark.id] : cardEls.current[mark.id];
        if (!el) return;
        const behind = mark.z > 0.92;
        const revealed =
          mark.kind === "node"
            ? hover === mark.id || focus === mark.id
            : highlighted.has(mark.id) || hotCard === mark.id;
        const pull = highlighted.has(mark.id) ? 1.06 : 1;
        el.style.transform = `translate3d(${mark.x}px, ${mark.y}px, 0) translate(-50%, -50%) scale(${behind ? 0.8 : pull})`;
        el.style.opacity = behind || !revealed ? "0" : "1";
        el.style.zIndex = String(40 + Math.round((1 - mark.z) * 20));
        el.hidden = behind || !revealed;
        el.style.pointerEvents = behind || !revealed ? "none" : "auto";
      });
    },
    [focus, highlighted, hotCard, hover],
  );

  function pointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a, button, aside")) return;
    dragging.current = true;
    last.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const dx = event.clientX - last.current.x;
    const dy = event.clientY - last.current.y;
    last.current = { x: event.clientX, y: event.clientY };
    setRotation((prev) => {
      const next = {
        x: Math.max(-0.9, Math.min(0.9, prev.x + dy * 0.0045)),
        y: prev.y + dx * 0.0055,
      };
      persist({ ...next, node: focus });
      return next;
    });
  }

  function look(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    });
    if (dragging.current) pointerMove(event);
  }

  function pointerUp() {
    dragging.current = false;
  }

  function openArtefact(href: string) {
    persist({ ...rotation, node: focus });
    setDissolving(true);
    window.setTimeout(() => router.push(href), 520);
  }

  return (
    <section
      id="archive"
      className={`field-section${home ? " field-home" : ""}${live ? " is-live" : " is-booting"}${dissolving ? " is-dissolving" : ""}${focus ? ` is-${focus}` : ""}`}
    >
      <div
        className="globe"
        data-cursor="explore-signals"
        onPointerDown={pointerDown}
        onPointerMove={look}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
      >
        {home ? (
          <div className="field-home__lock">
            <p className="kicker">DIPUCK JONES / BERLIN / GROWTH SYSTEMS</p>
            <h1>
              <span>Find the signal</span>
              <span>inside broken systems.</span>
            </h1>
            <p className="field-home__after">Then I build what makes them move.</p>
          </div>
        ) : null}

        {ready && !fallback ? (
          <GlobeCanvas
            rotation={rotation}
            focus={focus}
            hover={hover}
            dense={dense}
            dissolving={dissolving}
            pointer={pointer}
            onProject={onProject}
          />
        ) : (
          <GlobeFallback
            rotation={rotation}
            focus={focus}
            hover={hover}
            onNode={focusNode}
            onHover={setHover}
          />
        )}

        {ready && !fallback
          ? GLOBE_NODES.map((node) => (
              <button
                key={node.id}
                type="button"
                className={`globe__label${hover === node.id || focus === node.id ? " is-on" : ""}`}
                ref={(el) => {
                  nodeEls.current[node.id] = el;
                }}
                data-cursor="explore-signals"
                onClick={() => focusNode(node.id)}
                onPointerEnter={() => setHover(node.id)}
                onPointerLeave={() => setHover(null)}
              >
                <small>{node.role}</small>
                {node.name}
              </button>
            ))
          : null}

        {ready && !fallback
          ? ORBITING_ARTEFACTS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`globe__card${highlighted.has(item.id) ? " is-hot" : ""}`}
                ref={(el) => {
                  cardEls.current[item.id] = el;
                }}
                data-cursor={item.cursor}
                onPointerEnter={() => setHotCard(item.id)}
                onPointerLeave={() => setHotCard(null)}
                onClick={(event) => {
                  event.preventDefault();
                  openArtefact(item.href);
                }}
              >
                <em>{item.number}</em>
                <strong>{item.name}</strong>
                <span>{item.category}</span>
              </a>
            ))
          : null}

        {focus ? <StoryPanel nodeId={focus} onClose={() => setFocus(null)} onOpen={openArtefact} /> : null}

        <div className="field-home__vignette" aria-hidden />
      </div>

      <div className="field-home__dock">
        <nav className="field-home__places" aria-label="Locations">
          {GLOBE_NODES.map((node) => (
            <button
              key={node.id}
              type="button"
              className={focus === node.id || hover === node.id ? "is-on" : undefined}
              data-cursor="explore-signals"
              onClick={() => focusNode(node.id)}
              onPointerEnter={() => setHover(node.id)}
              onPointerLeave={() => setHover(null)}
            >
              {node.name}
            </button>
          ))}
        </nav>
        <div className="sr-only">
          {ORBITING_ARTEFACTS.map((item) => (
            <Link key={item.id} href={item.href}>
              {item.name}
            </Link>
          ))}
        </div>
        {home ? (
          <a href="#system" className="field-home__descend">
            The system below
          </a>
        ) : null}
      </div>
    </section>
  );
}
