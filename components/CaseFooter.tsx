export function CaseFooter() {
  return (
    <footer className="hairline-t py-12">
      <p className="font-mono text-[10px] text-ink-muted">Contact</p>
      <p className="mt-3 font-serif text-2xl">Dipuck Jones</p>
      <p className="mt-2 max-w-md font-serif text-[1.05rem] leading-[1.6]">
        Demand generation and pipeline growth for B2B SaaS. Berlin. Available immediately.
      </p>
      <ul className="mt-6 space-y-2 font-mono text-[12px]">
        <li>
          <a className="underline decoration-from-font underline-offset-4" href="mailto:rush2dipuck@gmail.com">
            rush2dipuck@gmail.com
          </a>
        </li>
        <li>
          <a
            className="underline decoration-from-font underline-offset-4"
            href="https://www.linkedin.com/in/dipuckjones/"
            target="_blank"
            rel="noreferrer"
          >
            linkedin.com/in/dipuckjones
          </a>
        </li>
      </ul>
      <p className="mt-10 font-mono text-[10px] text-ink-muted">
        Cached model answers refresh on a daily cron. Nothing on this page is a live query except
        the optional file you open yourself.
      </p>
    </footer>
  );
}
