"use client";

import { useEffect, useRef } from "react";

const BLIPS = [
  { angle: 0.7, radius: 0.42 },
  { angle: 2.15, radius: 0.68 },
  { angle: 3.55, radius: 0.33 },
  { angle: 5.1, radius: 0.56 },
];

export function RadarCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let running = true;

    const paint = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = Math.max(rect.width, 1);
      const pixels = Math.floor(size * dpr);
      if (canvas.width !== pixels || canvas.height !== pixels) {
        canvas.width = pixels;
        canvas.height = pixels;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.38;

      ctx.strokeStyle = "rgba(0,255,136,0.2)";
      ctx.lineWidth = 1;
      for (let ring = 1; ring <= 4; ring += 1) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius * ring) / 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(148,163,184,0.22)";
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      for (let tick = 0; tick < 72; tick += 1) {
        const angle = (tick / 72) * Math.PI * 2;
        const inner = radius + 3;
        const outer = radius + (tick % 6 === 0 ? 12 : 7);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.strokeStyle = tick % 6 === 0 ? "rgba(0,255,136,0.55)" : "rgba(148,163,184,0.35)";
        ctx.stroke();
      }

      const sweep = reduce ? -Math.PI / 3 : ((now / 1000) * 1.15) % (Math.PI * 2);
      if (!reduce) {
        for (let step = 0; step < 28; step += 1) {
          const start = sweep - step * 0.045;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, radius, start - 0.045, start);
          ctx.closePath();
          ctx.fillStyle = `rgba(0,255,136,${0.16 * (1 - step / 28)})`;
          ctx.fill();
        }
      }

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweep) * radius, cy + Math.sin(sweep) * radius);
      ctx.strokeStyle = "#00FF88";
      ctx.shadowColor = "#00FF88";
      ctx.shadowBlur = 14;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      BLIPS.forEach((blip, index) => {
        const pulse = reduce ? 0.8 : 0.45 + 0.55 * Math.sin(now / 380 + index);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,176,0,${0.35 + pulse * 0.65})`;
        ctx.arc(
          cx + Math.cos(blip.angle) * radius * blip.radius,
          cy + Math.sin(blip.angle) * radius * blip.radius,
          2.4 + pulse,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      ctx.beginPath();
      ctx.fillStyle = "#00FF88";
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();

      if (!reduce && running) frame = window.requestAnimationFrame(paint);
    };

    const paintOnce = (now: number) => {
      const previous = running;
      running = false;
      paint(now);
      running = previous;
    };
    const observer = new ResizeObserver(() => paintOnce(performance.now()));
    observer.observe(canvas);
    if (reduce) paint(performance.now());
    else frame = window.requestAnimationFrame(paint);
    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
