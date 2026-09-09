import Link from "next/link";
import { FOOTER_LINKS, PERSON } from "@/lib/archive";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <strong>DIPUCK JONES</strong>
        <span>GROWTH SYSTEMS FOR THE AI ERA</span>
      </div>
      <nav aria-label="Footer">
        {FOOTER_LINKS.map((item) =>
          "external" in item && item.external ? (
            <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ) : (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ),
        )}
      </nav>
      <p className="site-footer__status">{PERSON.statusShort}</p>
    </footer>
  );
}
