"use client";

import { useEffect, useRef, useState } from "react";
import { ModuleShell } from "@/components/dossier/module-shell";
import { useExperience } from "@/components/dossier/providers";

const ROMANCE = ["Exponential Growth", "Disruption", "Founder Title", "Techstars Dream"];
const SHADOW = ["Operational Debt", "Relational Stress", "Zero Margin of Error"];

function zoneFor(bearing: number) {
  if (bearing < 42) return "romance";
  if (bearing > 138) return "shadow";
  return "transit";
}

function tickPoint(bearing: number, radius: number) {
  const rad = ((bearing - 180) * Math.PI) / 180;
  return {
    x: 120 + Math.cos(rad) * radius,
    y: 120 + Math.sin(rad) * radius,
  };
}

export function Helm() {
  const { latch } = useExperience();
  const [bearing, setBearing] = useState(18);
  const [clunk, setClunk] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const previousZone = useRef<string | null>(null);
  const mix = bearing / 180;
  const zone = zoneFor(bearing);

  useEffect(() => {
    if (previousZone.current !== null && previousZone.current !== zone) {
      latch();
      setClunk(true);
      const timer = window.setTimeout(() => setClunk(false), 180);
      previousZone.current = zone;
      return () => window.clearTimeout(timer);
    }
    previousZone.current = zone;
  }, [zone, latch]);

  const setFromClientX = (clientX: number, width: number, left: number) => {
    const next = ((clientX - left) / width) * 180;
    setBearing(Math.min(180, Math.max(0, next)));
  };

  return (
    <ModuleShell
      id="helm"
      index="01"
      kicker="0° the romance, before scaleup — 180° the shadow, the cold reality"
      title="The Divergence Helm"
    >
      <div
        className={`plate plate-corners p-4 sm:p-6 ${clunk ? "ring-1 ring-amber" : ""}`}
        style={{
          background: `linear-gradient(115deg, rgba(0,255,136,${0.08 * (1 - mix)}) 0%, #060B10 46%, rgba(255,51,102,${0.12 * mix}) 100%)`,
        }}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] lg:items-center">
          <div>
            <div className="flex items-end justify-between">
              <p className="text-[11px] tracking-[0.22em] text-titanium">BEARING</p>
              <p className="font-serif text-4xl tabular-nums text-[#f4fff8] sm:text-5xl">
                {bearing.toFixed(1)}
                <span className="text-2xl text-phosphor">°</span>
              </p>
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-amber">
              {zone === "romance" ? "The romance" : zone === "shadow" ? "The shadow" : "Mechanical transit"}
            </p>

            <div
              ref={wheelRef}
              className="relative mx-auto mt-4 aspect-square w-[min(100%,380px)] touch-none select-none"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                const rect = event.currentTarget.getBoundingClientRect();
                setFromClientX(event.clientX, rect.width, rect.left);
              }}
              onPointerMove={(event) => {
                if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
                const rect = event.currentTarget.getBoundingClientRect();
                setFromClientX(event.clientX, rect.width, rect.left);
              }}
            >
              <svg viewBox="0 0 240 240" className="h-full w-full">
                <circle cx="120" cy="120" r="108" fill="#070d12" stroke="rgba(148,163,184,0.35)" />
                <circle cx="120" cy="120" r="78" fill="none" stroke="rgba(0,255,136,0.18)" />
                {Array.from({ length: 19 }, (_, index) => {
                  const tickBearing = index * 10;
                  const outer = tickPoint(tickBearing, 100);
                  const inner = tickPoint(tickBearing, index % 3 === 0 ? 84 : 92);
                  const major = index % 3 === 0;
                  return (
                    <line
                      key={tickBearing}
                      x1={inner.x}
                      y1={inner.y}
                      x2={outer.x}
                      y2={outer.y}
                      stroke={major ? "#00FF88" : "rgba(148,163,184,0.7)"}
                      strokeWidth={major ? 1.6 : 1}
                    />
                  );
                })}
                <g style={{ transform: `rotate(${bearing - 90}deg)`, transformOrigin: "120px 120px" }}>
                  <line x1="120" y1="120" x2="120" y2="34" stroke="#FFB000" strokeWidth="2.4" />
                  <circle cx="120" cy="34" r="3.5" fill="#FFB000" />
                </g>
                <circle cx="120" cy="120" r="10" fill="#030708" stroke="#00FF88" />
                <text x="28" y="128" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, monospace">
                  0°
                </text>
                <text x="108" y="22" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, monospace">
                  90°
                </text>
                <text x="196" y="128" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, monospace">
                  180°
                </text>
              </svg>
            </div>

            <label className="mt-2 block text-[10px] tracking-[0.18em] text-titanium" htmlFor="helm-bearing">
              Drag the wheel or the helm slot
            </label>
            <input
              id="helm-bearing"
              className="machined-range"
              type="range"
              min={0}
              max={1800}
              value={Math.round(bearing * 10)}
              aria-valuemin={0}
              aria-valuemax={180}
              aria-valuenow={Math.round(bearing)}
              aria-label="Divergence helm bearing in degrees"
              onChange={(event) => setBearing(Number(event.target.value) / 10)}
            />
          </div>

          <div className="grid gap-4">
            <article
              className="border border-phosphor/30 p-4 sm:p-5"
              style={{ opacity: 0.28 + (1 - mix) * 0.72 }}
            >
              <p className="text-[11px] tracking-[0.22em] text-phosphor">0° THE ROMANCE</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-titanium">Before scaleup</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ROMANCE.map((word) => (
                  <li key={word} className="relative border border-phosphor/30 px-2 py-1 text-[11px] tracking-[0.08em] text-[#d9fff0]">
                    {word}
                    <span className="absolute left-1 right-1 top-1/2 h-px origin-left bg-caution" style={{ transform: `scaleX(${mix})` }} />
                  </li>
                ))}
              </ul>
              <blockquote className="mt-4 font-serif text-lg italic leading-snug text-[#f4fff8] sm:text-xl">
                “I used to think being a founder was about agency, the helm, and the cinema of building.”
              </blockquote>
            </article>

            <article
              className="border border-caution/40 p-4 sm:p-5"
              style={{ opacity: 0.28 + mix * 0.72 }}
            >
              <p className="text-[11px] tracking-[0.22em] text-caution">180° THE SHADOW</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-titanium">The cold reality</p>
              <ul className="mt-4 space-y-3">
                {SHADOW.map((metric) => (
                  <li key={metric}>
                    <div className="flex items-center justify-between text-[11px] tracking-[0.12em] text-[#ffd0db]">
                      <span>{metric}</span>
                      <span className="tabular-nums text-caution">{Math.round(mix * 100)}%</span>
                    </div>
                    <div className="mt-1 h-1 bg-white/10">
                      <div className="h-full bg-caution" style={{ width: `${mix * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <blockquote className="mt-4 font-serif text-lg italic leading-snug text-[#fff5f7] sm:text-xl">
                “Now I think founding is an extreme form of debt borrowed against yourself and the people waiting at home.”
              </blockquote>
            </article>

            <p className="text-[11px] tracking-[0.14em] text-titanium" style={{ opacity: Math.sin(mix * Math.PI) }}>
              TRANSIT {bearing.toFixed(0).padStart(3, "0")}° // ROMANCE DECAY {(mix * 100).toFixed(0)}% // SHADOW GAIN{" "}
              {(mix * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}
