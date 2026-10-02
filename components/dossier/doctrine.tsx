"use client";

import { useEffect, useState } from "react";
import { ModuleShell } from "@/components/dossier/module-shell";

const REJECTIONS = [
  "AUTOMATED REJECTION // PIPELINE CLOSED",
  "AUTOMATED REJECTION // NO HUMAN REVIEW",
  "AUTOMATED REJECTION // TEMPLATE RESPONSE",
  "AUTOMATED REJECTION // DO NOT REPLY",
];

function polar(deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: 100 + Math.cos(rad) * radius, y: 100 + Math.sin(rad) * radius };
}

export function Doctrine() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = window.setInterval(() => setTick((value) => value + 1), 1600);
    return () => window.clearInterval(id);
  }, []);

  const active = tick % REJECTIONS.length;
  const needle = polar(200 + (30 / 40) * 140, 58);

  return (
    <ModuleShell
      id="doctrine"
      index="02"
      kicker="Subsurface operations against early-stage deep tech"
      title="Doctrine vs the Vacuum"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="plate plate-corners p-4 sm:p-6">
          <p className="text-[11px] tracking-[0.22em] text-phosphor">SUBSURFACE OPERATIONS // 300 METERS DEPTH</p>
          <div className="mt-4 grid items-center gap-4 sm:grid-cols-[200px_minmax(0,1fr)]">
            <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-[220px]" role="img" aria-label="Pressure hull gauge at 30 atmospheres">
              <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(0,255,136,0.18)" strokeWidth="8" />
              <circle className="hull-pulse" cx="100" cy="100" r="86" fill="none" stroke="#00FF88" strokeWidth="2" />
              {Array.from({ length: 5 }, (_, index) => {
                const value = index * 10;
                const angle = 200 + (value / 40) * 140;
                const outer = polar(angle, 74);
                const inner = polar(angle, 64);
                const label = polar(angle, 52);
                return (
                  <g key={value}>
                    <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#94A3B8" strokeWidth="1.4" />
                    <text x={label.x} y={label.y} fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">
                      {value}
                    </text>
                  </g>
                );
              })}
              <line x1="100" y1="100" x2={needle.x} y2={needle.y} stroke="#00FF88" strokeWidth="2.2" />
              <circle cx="100" cy="100" r="5" fill="#030708" stroke="#00FF88" />
              <text x="100" y="128" textAnchor="middle" fill="#00FF88" fontSize="26" fontFamily="ui-monospace, monospace">
                30
              </text>
              <text x="100" y="144" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, monospace">
                ATM
              </text>
            </svg>
            <ul className="space-y-3 text-[12px] leading-relaxed tracking-[0.06em] text-[#d7eee4] sm:text-sm">
              <li>Pressure hull holding at 30 ATM.</li>
              <li>Weight shared across 80 crew.</li>
              <li>Century-tested emergency operating procedures.</li>
              <li>03:00 alarm: written casualty drill for reactor scram or flooding.</li>
              <li className="text-phosphor">Safety net: naval doctrine.</li>
            </ul>
          </div>
        </article>

        <article className="plate plate-corners border-caution/30 p-4 sm:p-6">
          <p className="text-[11px] tracking-[0.22em] text-caution">EARLY-STAGE DEEP TECH // ANTERVID</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="border border-phosphor/25 bg-black/30 p-3">
              <p className="text-[10px] tracking-[0.18em] text-phosphor">CONTRACT CHANNEL</p>
              <p className="mt-3 font-serif text-2xl text-[#f4fff8]">Indian Railways</p>
              <p className="mt-2 text-[12px] tracking-[0.12em] text-phosphor">STATUS: SIGNED</p>
              <p className="mt-3 text-[11px] leading-relaxed text-titanium">The work has a counterparty. The signature is real. The net under it is not.</p>
            </div>
            <div className="border border-caution/30 bg-black/40 p-3">
              <p className="text-[10px] tracking-[0.18em] text-caution">INBOX // LIVE</p>
              <ul className="mt-3 space-y-2">
                {REJECTIONS.map((line, index) => (
                  <li
                    key={line}
                    className={`text-[10px] leading-snug tracking-[0.06em] sm:text-[11px] ${
                      index === active ? "text-amber" : "text-titanium/80"
                    }`}
                  >
                    {index === active ? "> " : "  "}
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-[11px] tracking-[0.12em]">
            <div className="border border-white/10 p-3">
              <dt className="text-titanium">WEIGHT</dt>
              <dd className="mt-1 text-[#fff1f4]">100% on co-founders</dd>
            </div>
            <div className="border border-white/10 p-3">
              <dt className="text-titanium">PROTOCOL</dt>
              <dd className="mt-1 text-caution">VOID</dd>
            </div>
          </dl>
          <p className="reading mt-4 text-sm leading-relaxed text-titanium">
            Dissonance: contract signed on one side, automated corporate rejections on the other.
          </p>
        </article>
      </div>

      <blockquote className="mt-4 border border-amber/50 bg-amber/10 px-4 py-4 font-serif text-xl leading-snug text-[#fff6df] sm:px-6 sm:text-2xl">
        This is not the phase before the process. This IS the process.
      </blockquote>
    </ModuleShell>
  );
}
