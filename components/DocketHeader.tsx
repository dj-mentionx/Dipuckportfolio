import { Stamp } from "./Stamp";

type DocketHeaderProps = {
  source: "supabase" | "seed";
};

export function DocketHeader({ source }: DocketHeaderProps) {
  return (
    <header className="relative hairline-b pb-10 pt-4">
      <div className="mb-4 flex justify-end sm:hidden">
        <Stamp />
      </div>
      <div className="hidden sm:block">
        <Stamp />
      </div>
      <p className="font-mono text-[10px] text-ink-muted">File no. DJ–2012–2026</p>
      <h1 className="mt-5 max-w-xl pr-0 font-serif text-[2.35rem] leading-[1.1] sm:pr-36 sm:text-5xl">
        Dipuck Jones
      </h1>
      <p className="mt-3 max-w-md font-serif text-lg leading-relaxed text-ink">
        Senior growth and performance marketing. B2B SaaS. Berlin.
      </p>
      <dl className="mt-8 grid max-w-xl gap-3 font-mono text-[11px] sm:grid-cols-2">
        <div>
          <dt className="text-ink-muted">Classification</dt>
          <dd>Open — available immediately</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Theatre</dt>
          <dd>Paid · lifecycle · SEO / AEO / GEO</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Pull</dt>
          <dd>{source === "seed" ? "Seeded case file" : "Cached model pull"}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Desk</dt>
          <dd>dipuckjones.com</dd>
        </div>
      </dl>
      <p className="mt-10 max-w-xl font-serif text-[1.05rem] leading-[1.6]">
        The machines already keep a file on operators like this. Below is the one they keep on
        me — four models, six buyer questions, cached so the verdict is a record, not a live
        performance. Drag to declassify.
      </p>
    </header>
  );
}
