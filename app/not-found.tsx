import Link from "next/link";
import { SiteChrome } from "@/components/archive/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <article className="lost">
        <p className="kicker">404 / SIGNAL LOST</p>
        <h1>This artefact is not in the archive.</h1>
        <p className="lede">The route does not resolve. Return to the field and follow a live signal.</p>
        <Link href="/" className="btn" data-cursor="explore-signals">
          RETURN TO THE ARCHIVE
        </Link>
      </article>
    </SiteChrome>
  );
}
