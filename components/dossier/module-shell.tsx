"use client";

import { motion } from "framer-motion";

export function ModuleShell({
  id,
  index,
  kicker,
  title,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-6 py-16 sm:py-24"
    >
      <header className="mb-8 flex items-start justify-between gap-4 sm:mb-10">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.32em] text-phosphor">MODULE {index}</p>
          <h2 className="mt-2 font-serif text-[clamp(1.9rem,4.4vw,3.35rem)] leading-[0.95] text-[#edf6f0]">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-[11px] uppercase tracking-[0.14em] text-titanium sm:text-xs">{kicker}</p>
        </div>
        <span className="hud-extra hidden shrink-0 pt-2 text-[10px] tracking-[0.22em] text-titanium/70 sm:block">
          FS-{index}
        </span>
      </header>
      {children}
    </motion.section>
  );
}
