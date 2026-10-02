"use client";

import { useEffect, useRef, useState } from "react";
import { ModuleShell } from "@/components/dossier/module-shell";

const DEFECT = 0.68;
const WINDOW = 0.03;
const INSET = 0.08;

function heatFor(position: number) {
  const distance = Math.abs(position - DEFECT);
  if (distance <= WINDOW) return 1;
  if (distance >= 0.09) return 0;
  return 1 - (distance - WINDOW) / (0.09 - WINDOW);
}

function fitCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function paintRail(canvas: HTMLCanvasElement, position: number) {
  const fitted = fitCanvas(canvas);
  if (!fitted) return;
  const { ctx, width, height } = fitted;
  const heat = heatFor(position);
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#071016");
  gradient.addColorStop(1, "#030708");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const left = width * INSET;
  const right = width * (1 - INSET);
  const span = right - left;
  const railY = height * 0.58;

  ctx.fillStyle = "rgba(148,163,184,0.05)";
  ctx.fillRect(left, railY - 28, span, 70);

  for (let index = 0; index <= 26; index += 1) {
    const x = left + (span * index) / 26;
    ctx.fillStyle = index % 2 === 0 ? "#152028" : "#10181e";
    ctx.fillRect(x, railY - 22, Math.max(6, width * 0.012), 52);
  }

  ctx.fillStyle = "rgba(148,163,184,0.28)";
  ctx.fillRect(left + 10, railY - 48, span - 20, 7);
  ctx.fillStyle = "#24313b";
  ctx.fillRect(left, railY + 2, span, 16);

  const head = ctx.createLinearGradient(0, railY - 12, 0, railY + 6);
  head.addColorStop(0, "#9aabba");
  head.addColorStop(0.45, "#e7eef4");
  head.addColorStop(1, "#5d6d7c");
  ctx.fillStyle = head;
  ctx.fillRect(left, railY - 10, span, 12);

  const crackX = left + span * DEFECT;
  ctx.save();
  ctx.translate(crackX, railY - 4);
  ctx.strokeStyle = heat > 0.85 ? "#FF3366" : "#FFB000";
  ctx.lineWidth = heat > 0.85 ? 2.4 : 1.5;
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 8 + heat * 16;
  ctx.beginPath();
  ctx.moveTo(-8, -12);
  ctx.lineTo(-1, -3);
  ctx.lineTo(-9, 7);
  ctx.lineTo(4, 16);
  ctx.stroke();
  ctx.restore();

  const puckX = left + span * position;
  const puckColor = heat > 0.85 ? "#FF3366" : heat > 0.15 ? "#FFB000" : "#00FF88";
  ctx.save();
  ctx.shadowColor = puckColor;
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#060B10";
  ctx.strokeStyle = puckColor;
  ctx.lineWidth = 2;
  roundRect(ctx, puckX - 18, railY - 42, 36, 24, 3);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(puckX, railY - 18);
  ctx.lineTo(puckX, railY - 8);
  ctx.stroke();
  ctx.fillStyle = puckColor;
  ctx.beginPath();
  ctx.arc(puckX, railY - 30, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintWave(canvas: HTMLCanvasElement, position: number, time: number, reduce: boolean) {
  const fitted = fitCanvas(canvas);
  if (!fitted) return;
  const { ctx, width, height } = fitted;
  const heat = heatFor(position);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#04090d";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(0,255,136,0.12)";
  ctx.lineWidth = 1;
  for (let y = 20; y < height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.strokeStyle = "rgba(148,163,184,0.25)";
  ctx.stroke();

  const color = heat > 0.85 ? "#FF3366" : heat > 0.15 ? "#FFB000" : "#00FF88";
  ctx.beginPath();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  for (let x = 0; x <= width; x += 2) {
    const t = x / width;
    const base =
      Math.sin(t * 18 + time * 3) * 0.22 +
      Math.sin(t * 47 + time * 5.2) * 0.07 +
      Math.sin(t * 9 - time * 1.4) * 0.08;
    const local = Math.exp(-((t - position) ** 2) * 30);
    const spike = heat * local * (0.85 * Math.sin(t * 80 + time * 22) + 0.35 * Math.sin(time * 40));
    const y = height / 2 - (base * (0.35 + heat * 0.2) + spike) * (height * 0.42);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, reduce ? y : y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function RailScanner() {
  const railRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef<HTMLCanvasElement>(null);
  const positionRef = useRef(0.12);
  const [position, setPosition] = useState(0.12);
  const [announcement, setAnnouncement] = useState("");
  const wasCritical = useRef(false);
  const heat = heatFor(position);
  const critical = heat >= 1;

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (critical && !wasCritical.current) {
      setAnnouncement("CRITICAL DEFECT DETECTED: SUB-SURFACE RAIL FRACTURE // CYCLIC FATIGUE");
    }
    wasCritical.current = critical;
  }, [critical]);

  useEffect(() => {
    const rail = railRef.current;
    const wave = waveRef.current;
    if (!rail || !wave) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let running = true;

    const draw = (now: number) => {
      paintRail(rail, positionRef.current);
      paintWave(wave, positionRef.current, reduce ? 0 : now / 1000, reduce);
    };
    const loop = (now: number) => {
      if (!running) return;
      draw(now);
      if (!reduce) frame = window.requestAnimationFrame(loop);
    };

    const observer = new ResizeObserver(() => draw(performance.now()));
    observer.observe(rail);
    observer.observe(wave);
    loop(performance.now());
    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    const wave = waveRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce || !rail || !wave) return;
    paintRail(rail, position);
    paintWave(wave, position, 0, true);
  }, [position]);

  const dragTo = (clientX: number, element: HTMLCanvasElement) => {
    const rect = element.getBoundingClientRect();
    const left = rect.width * INSET;
    const span = rect.width * (1 - INSET * 2);
    const next = (clientX - rect.left - left) / span;
    setPosition(Math.min(1, Math.max(0, next)));
  };

  const status = critical ? "CRITICAL" : heat > 0.15 ? "ANOMALY BUILDING" : "NOMINAL";
  const statusColor = critical ? "text-caution" : heat > 0.15 ? "text-amber" : "text-phosphor";

  return (
    <ModuleShell
      id="rail"
      index="03"
      kicker="Drag the sensor puck along the rail. Cyclic fatigue does not announce itself."
      title="Acoustic Rail Fracture Scanner"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.8fr)]">
        <div className="plate plate-corners min-w-0 p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-3 text-[10px] tracking-[0.18em]">
            <span className="text-titanium">RAIL SECTION // SENSOR CARRIAGE</span>
            <span className={statusColor}>{status}</span>
          </div>
          <canvas
            ref={railRef}
            data-testid="rail-canvas"
            className="h-[230px] w-full touch-none sm:h-[300px] lg:h-[340px]"
            aria-label="Railway section. Drag horizontally to move the sensor puck."
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              dragTo(event.clientX, event.currentTarget);
            }}
            onPointerMove={(event) => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
              dragTo(event.clientX, event.currentTarget);
            }}
          />
          <label className="mt-2 block text-[10px] tracking-[0.16em] text-titanium" htmlFor="sensor-position">
            Sensor position along the rail
          </label>
          <input
            id="sensor-position"
            data-testid="sensor-range"
            className="machined-range"
            type="range"
            min={0}
            max={1000}
            value={Math.round(position * 1000)}
            aria-label="Sensor position along the rail"
            onChange={(event) => setPosition(Number(event.target.value) / 1000)}
          />
          <div className="flex justify-between text-[10px] tracking-[0.14em] text-titanium">
            <span>0% SOUND STEEL</span>
            <span className="text-amber">68% DEFECT</span>
            <span>100%</span>
          </div>
        </div>

        <div className="plate plate-corners min-w-0 p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between text-[10px] tracking-[0.18em] text-titanium">
            <span>STRUCTURAL VIBRATION</span>
            <span className="tabular-nums text-[#edf6f0]">X: {(position * 100).toFixed(1)}%</span>
          </div>
          <canvas ref={waveRef} className="h-[150px] w-full sm:h-[180px]" aria-hidden="true" />
          <p className={`mt-3 text-[11px] tracking-[0.16em] ${statusColor}`}>
            {critical ? "WAVEFORM SPIKE // LOCKED" : heat > 0.15 ? "HARMONIC RISE" : "OSCILLOSCOPE // STEADY"}
          </p>
        </div>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {critical && (
        <p
          data-testid="defect-banner"
          className="mt-4 border border-caution bg-caution/10 px-4 py-3 text-[12px] tracking-[0.14em] text-caution sm:text-sm"
        >
          CRITICAL DEFECT DETECTED: SUB-SURFACE RAIL FRACTURE // CYCLIC FATIGUE
        </p>
      )}

      <blockquote
        data-testid="rail-callout"
        className={`reading mt-4 border px-4 py-5 font-serif text-lg leading-snug sm:px-6 sm:text-[1.45rem] ${
          critical ? "border-caution text-[#fff4f6]" : "border-white/15 text-[#e7f3ec]"
        }`}
      >
        A railway track fractures silently under load and nobody sees it until the train derails. That is an
        unglamorous, safety-critical problem I understand from naval engineering. I would rather scale that than any
        idea that merely sounds good in a pitch.
      </blockquote>
    </ModuleShell>
  );
}
