"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROOMS, type RoomId } from "@/lib/rooms";

type ProjectorProps = {
  roomId: RoomId;
  onClose: () => void;
};

export function Projector({ roomId, onClose }: ProjectorProps) {
  const room = ROOMS.find((item) => item.id === roomId);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setSlide(0);
  }, [roomId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setSlide((n) => Math.min((room?.slides.length ?? 1) - 1, n + 1));
      if (event.key === "ArrowLeft") setSlide((n) => Math.max(0, n - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, room?.slides.length]);

  if (!room) return null;
  const current = room.slides[slide];
  const last = slide === room.slides.length - 1;

  return (
    <motion.div className="room" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="room-dark" onClick={onClose} />
      <div className="beam" aria-hidden />
      <div className="screen-wrap">
        <p className="room-label">
          {room.house} · {room.door} · {slide + 1}/{room.slides.length}
        </p>
        <AnimatePresence mode="wait">
          <motion.article
            key={`${room.id}-${slide}`}
            className="screen"
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 0.45 }}
          >
            <p className="screen-kicker">{current.kicker}</p>
            {current.figure ? <p className="screen-figure">{current.figure}</p> : null}
            <h2>{current.title}</h2>
            <p className="screen-body">{current.body}</p>
            {room.id === "contact" && slide === 0 ? (
              <p className="screen-links">
                <a href="mailto:rush2dipuck@gmail.com">Email</a>
                <a href="https://www.linkedin.com/in/dipuckjones/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </p>
            ) : null}
          </motion.article>
        </AnimatePresence>
        <div className="screen-nav">
          <button type="button" onClick={() => setSlide((n) => Math.max(0, n - 1))} disabled={slide === 0}>
            Prev
          </button>
          <button
            type="button"
            onClick={() => (last ? onClose() : setSlide((n) => n + 1))}
          >
            {last ? "Leave room" : "Next reel"}
          </button>
          <button type="button" className="ghost" onClick={onClose}>
            Exit
          </button>
        </div>
      </div>
    </motion.div>
  );
}
