"use client";

import { useRef, useState } from "react";
import { ModuleShell } from "@/components/dossier/module-shell";
import { useExperience } from "@/components/dossier/providers";

const STATIONS = [
  {
    name: "Alex MacDonald",
    freq: 142.4,
    lesson: "Eradication of founder vanity. The unglamorous mechanics of building from scratch.",
  },
  {
    name: "Ines Sanchez-Castillo Velge",
    freq: 158.1,
    lesson: "Operators who last are anchored to the defect, not the prospective liquidity event.",
  },
  {
    name: "Jeff Weinstein",
    freq: 172.9,
    lesson: "Scaling is unvarnished daily plumbing. Fixing broken leaks under pressure.",
  },
];

const MIN = 140;
const MAX = 180;

export function Channels() {
  const { click } = useExperience();
  const rulerRef = useRef<HTMLDivElement>(null);
  const freqRef = useRef(STATIONS[0].freq);
  const [freq, setFreq] = useState(STATIONS[0].freq);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const setLiveFreq = (value: number) => {
    const next = Math.min(MAX, Math.max(MIN, value));
    freqRef.current = next;
    setFreq(next);
  };

  const nearest = (value: number) =>
    STATIONS.reduce(
      (best, station, index) => {
        const distance = Math.abs(station.freq - value);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Infinity }
    );

  const live = dragging ? nearest(freq).distance < 1.1 ? nearest(freq).index : -1 : active;
  const percent = ((freq - MIN) / (MAX - MIN)) * 100;

  const tune = (index: number, fromDrag: boolean) => {
    setActive(index);
    setLiveFreq(STATIONS[index].freq);
    if (fromDrag && index !== active) click();
  };

  return (
    <ModuleShell
      id="channels"
      index="04"
      kicker="Guest speakers, tuned as frequency channels"
      title="The Plumbing Dossier"
    >
      <div className="plate plate-corners p-4 sm:p-6">
        <div className="flex items-end justify-between gap-3">
          <p className="text-[11px] tracking-[0.2em] text-titanium">RECEIVER</p>
          <p className="font-serif text-3xl tabular-nums text-phosphor sm:text-4xl">{freq.toFixed(1)} MHz</p>
        </div>

        <div
          ref={rulerRef}
          className="relative mt-6 h-16 touch-none border-y border-white/10"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
            const rect = event.currentTarget.getBoundingClientRect();
            setLiveFreq(MIN + ((event.clientX - rect.left) / rect.width) * (MAX - MIN));
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            const rect = event.currentTarget.getBoundingClientRect();
            setLiveFreq(MIN + ((event.clientX - rect.left) / rect.width) * (MAX - MIN));
          }}
          onPointerUp={() => {
            setDragging(false);
            tune(nearest(freqRef.current).index, true);
          }}
          onPointerCancel={() => {
            setDragging(false);
            tune(nearest(freqRef.current).index, true);
          }}
        >
          {STATIONS.map((station) => (
            <span
              key={station.freq}
              className="absolute top-0 h-full w-px bg-amber/70"
              style={{ left: `${((station.freq - MIN) / (MAX - MIN)) * 100}%` }}
            />
          ))}
          <span
            className="absolute top-1/2 h-9 w-4 -translate-x-1/2 -translate-y-1/2 border border-phosphor bg-abyss shadow-[0_0_16px_rgba(0,255,136,0.45)]"
            style={{ left: `${percent}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] tracking-[0.14em] text-titanium">
          <span>140 MHz</span>
          <span>DRAG TO TUNE</span>
          <span>180 MHz</span>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {STATIONS.map((station, index) => {
            const selected = live === index;
            return (
              <button
                key={station.name}
                type="button"
                data-relay=""
                aria-pressed={selected}
                onClick={() => tune(index, false)}
                className={`min-h-28 border p-4 text-left backdrop-blur-md transition-colors ${
                  selected
                    ? "border-phosphor/70 bg-phosphor/10 shadow-[0_0_30px_rgba(0,255,136,0.08)]"
                    : "border-white/15 bg-white/[0.03] hover:border-phosphor/40"
                }`}
              >
                <p className="text-[10px] tracking-[0.18em] text-amber">{station.freq.toFixed(1)} MHz</p>
                <p className="mt-2 font-serif text-xl leading-tight text-[#f4fff8]">{station.name}</p>
                <p className="mt-3 text-[12px] leading-relaxed text-titanium">{selected ? station.lesson : "Channel armed. Select to open."}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-5 border border-white/10 bg-black/25 p-4">
          <p className="text-[10px] tracking-[0.2em] text-phosphor">
            {live >= 0 ? `LOCKED // ${STATIONS[live].name.toUpperCase()}` : "OFF STATION // NO CARRIER"}
          </p>
          <p className="reading mt-2 text-sm leading-relaxed text-[#e5f3eb] sm:text-base">
            {live >= 0 ? STATIONS[live].lesson : "The receiver is between speakers. Settle on a marked frequency."}
          </p>
        </div>
      </div>

      <blockquote className="mt-4 border-l-2 border-phosphor pl-4 font-serif text-xl leading-snug text-[#f4fff8] sm:text-2xl">
        The founders who survive the grinder are not in love with the title; they are pathologically obsessed with a
        specific, stubborn problem.
      </blockquote>
    </ModuleShell>
  );
}
