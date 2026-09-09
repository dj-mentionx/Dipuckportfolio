import { SiteChrome } from "@/components/archive/SiteChrome";
import "../archive.css";

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
