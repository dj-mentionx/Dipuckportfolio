import { CookieConsent } from "./CookieConsent";
import { CustomCursor } from "./CustomCursor";
import { Footer } from "./Footer";
import { JsonLd } from "./JsonLd";
import { Nav } from "./Nav";
import { SmoothScroll } from "./SmoothScroll";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <CustomCursor>
      <JsonLd />
      <SmoothScroll />
      <Nav />
      <main className="archive">{children}</main>
      <Footer />
      <CookieConsent />
    </CustomCursor>
  );
}
