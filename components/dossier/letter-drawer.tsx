"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";
import { letterToPlainText } from "@/dossier/letter";
import { LetterBody } from "@/components/dossier/letter-view";

export function LetterControls({ onOpen, prominent = false }: { onOpen: () => void; prominent?: boolean }) {
  return (
    <button
      type="button"
      data-relay=""
      onClick={onOpen}
      className={
        prominent
          ? "min-h-12 max-w-full whitespace-normal border border-amber bg-amber px-4 text-center text-[11px] uppercase leading-snug tracking-[0.16em] text-abyss"
          : "min-h-12 w-full max-w-full whitespace-normal border border-amber/80 bg-[#120e09] px-3 text-center text-[11px] uppercase leading-snug tracking-[0.14em] text-amber sm:w-auto sm:px-4"
      }
    >
      Open full declassified letter
    </button>
  );
}

export function LetterDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const scroller = document.querySelector<HTMLElement>("[data-scroll-root]");
    const previousScroller = scroller?.style.overflow ?? "";
    document.body.style.overflow = "hidden";
    if (scroller) scroller.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      if (scroller) scroller.style.overflow = previousScroller;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const copy = async () => {
    const text = letterToPlainText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close declassified letter"
            className="fixed inset-0 z-[70] bg-black/75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-title"
            data-testid="letter-drawer"
            className="letter-parchment fixed inset-y-0 right-0 z-[80] w-full overflow-y-auto sm:max-w-xl md:max-w-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-amber/20 bg-[#120f0c]/90 px-4 py-3 backdrop-blur">
              <p className="text-[10px] tracking-[0.2em] text-amber">DECLASSIFIED // FULL TEXT</p>
              <button
                type="button"
                data-relay=""
                onClick={onClose}
                className="inline-flex min-h-11 min-w-11 items-center justify-center border border-white/15 text-[#eadcc8]"
                aria-label="Close letter"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-6 sm:px-8">
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  data-relay=""
                  data-testid="copy-letter"
                  onClick={() => void copy()}
                  className="inline-flex min-h-11 items-center gap-2 border border-phosphor/50 px-3 text-[11px] uppercase tracking-[0.14em] text-phosphor"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy letter"}
                </button>
                <button
                  type="button"
                  data-relay=""
                  onClick={() => window.print()}
                  className="min-h-11 border border-white/20 px-3 text-[11px] uppercase tracking-[0.14em] text-[#eadcc8]"
                >
                  Print / save as PDF
                </button>
              </div>
              <div id="letter-title">
                <LetterBody />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
