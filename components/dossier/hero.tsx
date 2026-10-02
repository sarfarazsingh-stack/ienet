"use client";

import { motion } from "framer-motion";
import { useExperience } from "@/components/dossier/providers";
import { RadarCanvas } from "@/components/dossier/radar-canvas";

const HEADLINE = "The Founder’s Shadow: Scaling an Obsession, Not a Deficit.";

const TELEMETRY = [
  "IE TOWER, MADRID // 40.4789° N, 3.6883° W",
  "RESTRICTED // SCALEUP MASTERCLASS // QUESTION 05",
  "TARGET: PROFESSOR JOE HASLAM",
  "AUTHOR: SARFARAZ SINGH WAHAD (EX-SUBMARINE OFFICER, FOUNDER ANTERVID)",
];

export function Hero() {
  const { mode, setMode } = useExperience();
  const words = HEADLINE.split(" ");

  const goBriefing = () => {
    document.getElementById("helm")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="surface" className="scroll-mt-4 pb-8 pt-2 sm:pt-4">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-12">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.34em] text-amber">DEPTH TO DEFECT // Q05</p>
          <h1 className="mt-4 font-serif text-[clamp(2.35rem,6.4vw,5.35rem)] leading-[0.9] tracking-[-0.03em] text-[#f3faf6]">
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="mr-[0.28em] inline-block"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <p className="reading mt-6 max-w-xl text-sm leading-relaxed text-titanium sm:text-base">
            A declassified memorandum for Professor Joe Haslam. Eleven years in the Indian Navy’s
            submarine technical branch, then PwC’s Generative AI lead, now founder of AnterVid.
            The descent is from romance at the surface to the defect at depth.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-2 min-[520px]:grid-cols-2 xl:grid-cols-2">
            <button
              type="button"
              data-relay=""
              onClick={goBriefing}
              className="min-h-12 border border-phosphor bg-phosphor px-3 py-2 text-left text-[11px] uppercase tracking-[0.16em] text-abyss sm:text-xs"
            >
              Initialize mission briefing
            </button>
            <button
              type="button"
              data-relay=""
              aria-pressed={mode === "telemetry"}
              onClick={() => setMode("telemetry")}
              className={`min-h-12 border px-3 py-2 text-left text-[11px] uppercase tracking-[0.16em] sm:text-xs ${
                mode === "telemetry"
                  ? "border-phosphor bg-phosphor/15 text-phosphor"
                  : "border-white/15 text-titanium hover:border-phosphor/50"
              }`}
            >
              Tactical telemetry mode
            </button>
            <button
              type="button"
              data-relay=""
              aria-pressed={mode === "memo"}
              onClick={() => setMode("memo")}
              className={`min-h-12 border px-3 py-2 text-left text-[11px] uppercase tracking-[0.16em] sm:text-xs ${
                mode === "memo"
                  ? "border-amber bg-amber/15 text-amber"
                  : "border-white/15 text-titanium hover:border-amber/50"
              }`}
            >
              Clean memo view
            </button>
            <button
              type="button"
              data-relay=""
              onClick={() => window.print()}
              className="min-h-12 border border-white/20 px-3 py-2 text-left text-[11px] uppercase tracking-[0.16em] text-[#edf6f0] hover:border-phosphor/60 sm:text-xs"
            >
              Download PDF dossier
            </button>
          </div>
        </div>

        <div className="plate plate-corners scanlines min-w-0 p-4 sm:p-5">
          <div className="flex items-center justify-between text-[10px] tracking-[0.22em] text-titanium">
            <span>CIC RADAR</span>
            <span className="hud-extra text-phosphor">SWEEP LIVE</span>
          </div>
          <div className="relative mx-auto mt-3 aspect-square w-full max-w-[460px]">
            <RadarCanvas className="h-full w-full" />
          </div>
          <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-[11px] leading-relaxed tracking-[0.08em] text-[#d5e4dc] sm:text-xs">
            {TELEMETRY.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
