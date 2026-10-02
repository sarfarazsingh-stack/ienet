"use client";

import { useEffect, useState } from "react";

const STATIONS = [
  { meters: 0, short: "000m", name: "Surface / The Romance" },
  { meters: 300, short: "300m", name: "Submarine Doctrine" },
  { meters: 1000, short: "1000m", name: "The Founder's Vacuum" },
];

function formatMeters(meters: number) {
  const rounded = Math.round(meters);
  if (rounded >= 1000) return "1000m";
  return `${String(rounded).padStart(3, "0")}m`;
}

function stationIndex(meters: number) {
  if (meters < 180) return 0;
  if (meters < 640) return 1;
  return 2;
}

function stationStyle(meters: number): React.CSSProperties {
  if (meters <= 0) return { top: 0 };
  if (meters >= 1000) return { top: "100%", transform: "translateY(-100%)" };
  return { top: `${meters / 10}%`, transform: "translateY(-50%)" };
}

export function DepthGauge() {
  const [meters, setMeters] = useState(0);

  useEffect(() => {
    let frame = 0;
    const scroller = document.querySelector<HTMLElement>("[data-scroll-root]");

    const update = () => {
      frame = 0;
      if (!scroller) return;
      const doctrine = document.getElementById("doctrine");
      const max = scroller.scrollHeight - scroller.clientHeight;
      const y = scroller.scrollTop;
      let doctrineTop = Math.max(max * 0.35, 1);
      if (doctrine) {
        const origin = scroller.getBoundingClientRect().top;
        doctrineTop = Math.max(doctrine.getBoundingClientRect().top - origin + y, 1);
      }
      let next = 0;
      if (max > 0) {
        if (y <= doctrineTop) next = (y / doctrineTop) * 300;
        else next = 300 + ((y - doctrineTop) / Math.max(max - doctrineTop, 1)) * 700;
      }
      setMeters(Math.max(0, Math.min(1000, next)));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scroller?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const active = stationIndex(meters);
  const depth = formatMeters(meters);
  const progress = meters / 10;

  return (
    <>
      <div className="shrink-0 border-b border-white/10 bg-[#04080c] px-4 py-2 md:hidden">
        <div className="flex items-baseline justify-between gap-3 text-[10px] tracking-[0.16em]">
          <span className="text-phosphor">{depth}</span>
          <span className="min-w-0 truncate text-titanium">{STATIONS[active].name}</span>
        </div>
        <div className="relative mt-1.5 h-1.5 bg-white/10">
          <div className="h-full bg-phosphor" style={{ width: `${progress}%` }} />
          {STATIONS.map((station) => (
            <span
              key={station.short}
              className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-amber"
              style={{ left: `${station.meters / 10}%` }}
            />
          ))}
        </div>
      </div>

      <aside className="hidden h-full w-44 shrink-0 flex-col border-r border-white/10 bg-[#04080c]/95 md:flex">
        <div className="shrink-0 border-b border-white/10 px-3 py-4">
          <p className="text-[10px] tracking-[0.22em] text-titanium/80">DEPTH</p>
          <p className="mt-1 font-mono text-lg tabular-nums text-phosphor">{depth}</p>
        </div>
        <div className="relative mx-3 my-5 min-h-0 flex-1">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-white/15">
            <div className="absolute inset-x-0 top-0 w-px bg-phosphor" style={{ height: `${progress}%` }} />
            <div
              className="absolute -left-[4px] h-2.5 w-2.5 rounded-full bg-phosphor shadow-[0_0_12px_#00FF88]"
              style={{ top: `calc(${progress}% - 5px)` }}
            />
          </div>
          <ul className="absolute bottom-0 left-4 right-0 top-0">
            {STATIONS.map((station, index) => (
              <li key={station.short} className="absolute left-0 right-0" style={stationStyle(station.meters)}>
                <span className={`block text-[10px] leading-tight tracking-[0.04em] ${index === active ? "text-phosphor" : "text-titanium/70"}`}>
                  {station.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
