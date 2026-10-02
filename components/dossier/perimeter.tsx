"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ModuleShell } from "@/components/dossier/module-shell";
import { judgeEngineRoom, type EngineVerdict } from "@/dossier/engine-room";

const SHIELDS = [
  {
    id: "economics",
    index: "01",
    title: "Human unit economics",
    body: "I will not scale a deficit and call it ambition. Sacrificing physical health is bad engineering on human capital.",
  },
  {
    id: "family",
    index: "02",
    title: "The family citadel (Simran & Shamshir)",
    body: "I will not outsource the cost of my ambition to my family. The shadow doesn't land on the cap table—it lands on my wife, Simran, and my son, Shamshir. If the venture scales by abandoning them, it failed.",
  },
] as const;

export function Perimeter() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");
  const [verdict, setVerdict] = useState<EngineVerdict | null>(null);
  const [flash, setFlash] = useState(0);

  const toggle = (id: string) => {
    setOpen((current) => ({ ...current, [id]: !current[id] }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = judgeEngineRoom(draft);
    setVerdict(next);
    setFlash((value) => value + 1);
  };

  return (
    <ModuleShell id="perimeter" index="05" kicker="The perimeter: what I will not do" title="The Perimeter Shield">
      <div className="space-y-3">
        {SHIELDS.map((shield) => {
          const expanded = Boolean(open[shield.id]);
          return (
            <article key={shield.id} className="plate plate-corners">
              <button
                type="button"
                data-relay=""
                aria-expanded={expanded}
                onClick={() => toggle(shield.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left"
              >
                <span>
                  <span className="block text-[10px] tracking-[0.22em] text-phosphor">PERIMETER {shield.index}</span>
                  <span className="mt-1 block font-serif text-xl text-[#f4fff8] sm:text-2xl">{shield.title}</span>
                </span>
                <span className="text-[11px] tracking-[0.16em] text-amber">{expanded ? "COLLAPSE" : "EXPAND"}</span>
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden"
                  >
                    <p className="reading border-t border-white/10 px-4 py-4 text-base leading-relaxed text-[#e7f2ea] sm:text-lg">
                      {shield.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}

        <article className="plate plate-corners">
          <button
            type="button"
            data-relay=""
            aria-expanded={Boolean(open.engine)}
            onClick={() => toggle("engine")}
            className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left"
          >
            <span>
              <span className="block text-[10px] tracking-[0.22em] text-phosphor">PERIMETER 03</span>
              <span className="mt-1 block font-serif text-xl text-[#f4fff8] sm:text-2xl">The engine-room test</span>
            </span>
            <span className="text-[11px] tracking-[0.16em] text-amber">{open.engine ? "COLLAPSE" : "EXPAND"}</span>
          </button>
          <AnimatePresence initial={false}>
            {open.engine && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="overflow-hidden"
              >
                <form onSubmit={submit} className="border-t border-white/10 px-4 py-4">
                  <label htmlFor="engine-room" className="text-[11px] tracking-[0.16em] text-titanium">
                    Say the decision in one sentence
                  </label>
                  <textarea
                    id="engine-room"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={3}
                    className="mt-2 w-full resize-y border border-white/15 bg-black/50 px-3 py-3 text-sm text-phosphor outline-none focus:border-phosphor"
                    placeholder="Plain language a petty officer would accept."
                  />
                  <button
                    type="submit"
                    data-relay=""
                    className="mt-3 min-h-12 border border-phosphor px-4 text-[11px] uppercase tracking-[0.16em] text-phosphor hover:bg-phosphor hover:text-abyss"
                  >
                    Transmit to engine room
                  </button>
                  <div
                    key={flash}
                    role="status"
                    className={`mt-4 min-h-12 border border-white/10 px-3 py-3 text-sm tracking-[0.08em] ${
                      verdict?.status === "rejected" ? "ego-flash text-caution" : ""
                    } ${verdict?.status === "accepted" ? "accept-glow text-phosphor" : ""} ${
                      verdict?.status === "empty" ? "text-amber" : ""
                    }`}
                  >
                    {verdict?.status === "rejected" && (
                      <>
                        REJECTED: EGO DETECTED
                        <span className="mt-1 block text-[11px] text-titanium">Matched: {verdict.matches.join(", ")}</span>
                      </>
                    )}
                    {verdict?.status === "accepted" && "ACCEPTED: SUBMARINE CREW READY"}
                    {verdict?.status === "empty" && "TRANSMISSION EMPTY // NOT ACCEPTED"}
                    {!verdict && <span className="text-titanium">Awaiting a sentence. Empty input will not pass.</span>}
                  </div>
                  <p className="reading mt-4 text-sm leading-relaxed text-[#dbe7e1] sm:text-base">
                    If I cannot explain a decision in one sentence to a petty officer on my old submarine, it is ego, not
                    substance.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </article>
      </div>
    </ModuleShell>
  );
}
