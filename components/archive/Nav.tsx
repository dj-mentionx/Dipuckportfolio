"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, PERSON, POSITIONING } from "@/lib/archive";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <>
      <header className="nav">
        <Link href="/" className="nav__mark" data-cursor="open-signal">
          <span>DIPUCK JONES</span>
          <small>SIGNAL ARCHIVE</small>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "is-on" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="nav__status">{PERSON.status}</p>

        <button
          type="button"
          className={`nav__toggle${open ? " is-open" : ""}`}
          aria-expanded={open}
          aria-controls="archive-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? "Close" : "Menu"}</span>
        </button>
      </header>

      <div id="archive-menu" className={`nav__screen${open ? " is-open" : ""}`} hidden={!open}>
        <div className="nav__line" aria-hidden />
        <p className="nav__screen-kicker">{POSITIONING.kicker}</p>
        <nav>
          {NAV.map((item, index) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <em>0{index + 1}</em>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="nav__screen-status">{PERSON.status}</p>
      </div>
    </>
  );
}
