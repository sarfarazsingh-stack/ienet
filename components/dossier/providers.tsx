"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SonarAudio } from "@/dossier/sonar-audio";

export type ViewMode = "telemetry" | "memo";

type Experience = {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  audioOn: boolean;
  toggleAudio: () => void;
  click: () => void;
  latch: () => void;
};

const ExperienceContext = createContext<Experience | null>(null);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<SonarAudio | null>(null);
  const [mode, setModeState] = useState<ViewMode>("telemetry");
  const [audioOn, setAudioOn] = useState(false);

  useEffect(() => {
    const audio = new SonarAudio();
    audioRef.current = audio;
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const relay = target?.closest?.("[data-relay]");
      if (!relay) return;
      const related = event.relatedTarget as Node | null;
      if (related && relay.contains(related)) return;
      audio.click();
    };
    document.addEventListener("pointerover", onOver);
    return () => {
      document.removeEventListener("pointerover", onOver);
      audio.dispose();
      audioRef.current = null;
    };
  }, []);

  const setMode = useCallback((next: ViewMode) => {
    setModeState(next);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioOn((current) => {
      const next = !current;
      void audioRef.current?.setEnabled(next);
      return next;
    });
  }, []);

  const click = useCallback(() => audioRef.current?.click(), []);
  const latch = useCallback(() => audioRef.current?.latch(), []);

  const value = useMemo(
    () => ({ mode, setMode, audioOn, toggleAudio, click, latch }),
    [mode, setMode, audioOn, toggleAudio, click, latch]
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used within ExperienceProvider");
  return ctx;
}
