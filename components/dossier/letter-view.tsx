import { letterMeta, letterParagraphs, letterSignOff } from "@/dossier/letter";

export function Signature({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 460 92" className="h-16 w-full max-w-sm text-current" aria-hidden="true">
        <path
          d="M18 58c14-30 42-36 54-10 6 16-16 24-14 8 6-22 34-24 48-4 10 14 2 24-10 18 16-8 34-26 56-18 16 6 12 26-4 30 18-14 30-36 52-24 14 8 8 22-6 20 18-6 36-20 56-8 12 8 6 20-8 18 22-8 40-24 64-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 78h250" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.55" className="signature-rule" />
      </svg>
      <p className="font-serif text-2xl text-current">Sarfaraz Singh Wahad</p>
    </div>
  );
}

export function LetterBody() {
  return (
    <article className="letter-body">
      <p className="letter-kicker text-[11px] tracking-[0.28em] text-amber">{letterMeta.classification}</p>
      <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.1rem)] leading-[0.95] text-current">
        {letterMeta.document}
      </h1>
      <p className="letter-meta mt-4 text-[11px] uppercase tracking-[0.16em] text-titanium">
        {letterMeta.course}
        <br />
        {letterMeta.place}
      </p>
      <dl className="letter-meta mt-6 space-y-1 text-[12px] tracking-[0.08em] text-current/80">
        <div>To: {letterMeta.to}</div>
        <div>From: {letterMeta.from}</div>
        <div>Subject: {letterMeta.subject}</div>
      </dl>
      <div className="mt-8 font-serif text-[1.05rem] leading-[1.65] sm:text-lg">
        {letterParagraphs.map((paragraph) => (
          <p key={paragraph.id} className={paragraph.lede ? "lede" : undefined}>
            {paragraph.text}
          </p>
        ))}
      </div>
      <p className="mt-8 font-serif text-lg italic">Respectfully,</p>
      <Signature className="mt-2" />
      <ul className="letter-meta mt-4 space-y-1 text-[11px] tracking-[0.12em] text-titanium">
        {letterSignOff.slice(1).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </article>
  );
}
