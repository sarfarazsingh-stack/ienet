"use client";

import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { ExperienceProvider, useExperience } from "@/components/dossier/providers";
import { DepthGauge } from "@/components/dossier/depth-gauge";
import { Hero } from "@/components/dossier/hero";
import { Helm } from "@/components/dossier/helm";
import { Doctrine } from "@/components/dossier/doctrine";
import { RailScanner } from "@/components/dossier/rail-scanner";
import { Channels } from "@/components/dossier/channels";
import { Perimeter } from "@/components/dossier/perimeter";
import { ModuleShell } from "@/components/dossier/module-shell";
import { LetterBody } from "@/components/dossier/letter-view";
import { LetterControls, LetterDrawer } from "@/components/dossier/letter-drawer";

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(`${new Date().toISOString().slice(11, 19)}Z`);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="hud-extra hidden tabular-nums tracking-[0.16em] text-titanium md:inline">{time}</span>;
}

function Shell() {
  const { mode, audioOn, toggleAudio } = useExperience();
  const [letterOpen, setLetterOpen] = useState(false);

  return (
    <div data-mode={mode} className="abyss-grid min-h-screen text-titanium">
      <a
        href="#surface"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-16 focus:z-[90] focus:bg-phosphor focus:px-3 focus:py-2 focus:text-abyss"
      >
        Skip to memorandum
      </a>
      <div className="grain" aria-hidden="true" />
      <header className="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between gap-3 border-b border-white/10 bg-abyss/85 px-3 backdrop-blur-md md:px-4">
        <div className="min-w-0 text-[10px] tracking-[0.18em] text-phosphor sm:text-[11px]">
          <span className="sm:hidden">FS-05 // RESTRICTED</span>
          <span className="hidden sm:inline">RESTRICTED // SCALEUP MASTERCLASS // QUESTION 05</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock />
          <button
            type="button"
            data-relay=""
            aria-pressed={audioOn}
            onClick={toggleAudio}
            className="inline-flex min-h-11 items-center gap-2 border border-white/15 px-3 text-[10px] uppercase tracking-[0.16em] text-[#edf6f0]"
          >
            {audioOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
            {audioOn ? "Audio live" : "Muted"}
          </button>
        </div>
      </header>

      <DepthGauge />

      <main className="relative px-4 pb-28 pt-28 sm:px-6 md:pl-48 md:pr-8 md:pt-20">
        <div className="mx-auto w-full max-w-[88rem]">
          <Hero />
          <Helm />
          <Doctrine />
          <RailScanner />
          <Channels />
          <Perimeter />
          <ModuleShell
            id="letter"
            index="06"
            kicker="The full memorandum, shared by the drawer, the copy action, and the print view"
            title="Declassified Letter"
          >
            <div className="plate plate-corners flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="max-w-xl">
                <p className="text-[11px] tracking-[0.2em] text-amber">FOR PROFESSOR JOE HASLAM</p>
                <p className="reading mt-3 text-sm leading-relaxed text-titanium sm:text-base">
                  The drawer holds the complete letter. Copy it, or print it to a white editorial page. The same source
                  feeds every view.
                </p>
              </div>
              <LetterControls prominent onOpen={() => setLetterOpen(true)} />
            </div>
          </ModuleShell>
        </div>
      </main>

      <div className="fixed bottom-4 left-4 right-4 z-[65] flex justify-end md:left-auto md:right-6">
        <LetterControls onOpen={() => setLetterOpen(true)} />
      </div>
      <LetterDrawer open={letterOpen} onClose={() => setLetterOpen(false)} />
    </div>
  );
}

export function DossierApp() {
  return (
    <MotionConfig reducedMotion="user">
      <ExperienceProvider>
        <div className="no-print">
          <Shell />
        </div>
        <div id="print-dossier" className="print-dossier hidden bg-white text-black">
          <LetterBody />
        </div>
      </ExperienceProvider>
    </MotionConfig>
  );
}
