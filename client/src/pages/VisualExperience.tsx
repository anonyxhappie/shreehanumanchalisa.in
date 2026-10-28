import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { verses } from "@/lib/hanumanChalisa";

const sceneTitles = [
  "Begin with a clear mind",
  "Ask for strength and wisdom",
  "The ocean of wisdom",
  "The messenger of Rama",
  "Courage guided by goodness",
  "A radiant golden presence",
  "Devotion without fear",
  "The power to protect",
  "Wisdom in every action",
  "A heart devoted to Rama",
  "Strength beyond measure",
  "A light across the worlds",
];

const palettes = [
  ["#081b2a", "#25485a", "#d88a4c", "#f5d6a0"],
  ["#101f35", "#55405a", "#d57a43", "#f6d9a1"],
  ["#091e31", "#245a63", "#e0a15a", "#ffe5b2"],
  ["#101a31", "#3b345b", "#c86c42", "#f8c985"],
  ["#10202b", "#5c3b2d", "#e09a50", "#ffe0a0"],
  ["#141a2b", "#6b3e37", "#f0a35c", "#ffe8b9"],
];

function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  index: number,
  alpha: number,
  reduced: boolean,
) {
  const palette = palettes[index % palettes.length];
  ctx.save();
  ctx.globalAlpha = alpha;
  const bg = ctx.createLinearGradient(0, 0, w * 0.8, h);
  bg.addColorStop(0, palette[0]);
  bg.addColorStop(0.52, palette[1]);
  bg.addColorStop(1, palette[2]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const drift = reduced ? 0 : time;
  const sx = w * (0.64 + Math.sin(drift * 0.12 + index) * 0.035);
  const sy = h * (0.38 + Math.cos(drift * 0.1 + index) * 0.025);
  const radius = Math.min(w, h) * 0.2;
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 2.4);
  glow.addColorStop(0, palette[3] + "d9");
  glow.addColorStop(0.24, palette[2] + "66");
  glow.addColorStop(1, palette[2] + "00");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(reduced ? 0 : drift * 0.025);
  for (let ray = 0; ray < 72; ray++) {
    const angle = (Math.PI * 2 * ray) / 72;
    const inner = radius * (0.72 + (ray % 4) * 0.035);
    const outer = radius * (1.1 + (ray % 3) * 0.12);
    ctx.strokeStyle = palette[3] + (ray % 3 === 0 ? "35" : "18");
    ctx.lineWidth = ray % 6 === 0 ? 1.5 : 0.7;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    ctx.stroke();
  }
  for (let ring = 0; ring < 7; ring++) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * (0.48 + ring * 0.14) + (reduced ? 0 : Math.sin(drift * 0.6 + ring) * 3), 0, Math.PI * 2);
    ctx.strokeStyle = palette[3] + (ring === 0 ? "66" : "25");
    ctx.lineWidth = ring === 0 ? 1.5 : 0.8;
    ctx.stroke();
  }
  ctx.restore();

  // Layered hills move at different speeds to create depth.
  for (let layer = 0; layer < 3; layer++) {
    const y = h * (0.67 + layer * 0.105);
    const offset = reduced ? 0 : Math.sin(drift * (0.12 + layer * 0.04) + index) * 22;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, y);
    for (let point = 0; point <= 8; point++) {
      const x = (w / 8) * point;
      const peak = y - ((point + layer + index) % 3 === 0 ? h * (0.11 + layer * 0.02) : h * 0.025);
      ctx.lineTo(x + offset, peak);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = ["#091823d9", "#0b1b27cc", "#08141fc9"][layer];
    ctx.fill();
  }

  // Opening verses: a small temple and diya. Later verses: a symbolic, glowing figure.
  if (index < 2) {
    const tx = w * 0.27;
    const base = h * 0.82;
    ctx.fillStyle = "#09151ee8";
    ctx.fillRect(tx - w * 0.08, base - h * 0.15, w * 0.16, h * 0.15);
    ctx.fillRect(tx - w * 0.055, base - h * 0.24, w * 0.11, h * 0.1);
    ctx.beginPath();
    ctx.moveTo(tx - w * 0.075, base - h * 0.24);
    ctx.lineTo(tx, base - h * 0.36);
    ctx.lineTo(tx + w * 0.075, base - h * 0.24);
    ctx.closePath();
    ctx.fill();
    const flame = reduced ? 0 : Math.sin(drift * 4.5) * 4;
    ctx.fillStyle = palette[3];
    ctx.beginPath();
    ctx.ellipse(tx, base - h * 0.11, 4, 10 + flame, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = palette[3];
    ctx.shadowBlur = 26;
    ctx.beginPath();
    ctx.arc(tx, base - h * 0.11, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    const cx = w * 0.72;
    const cy = h * 0.66 + (reduced ? 0 : Math.sin(drift * 0.8) * 7);
    const scale = Math.min(w / 1100, h / 650) * 1.2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.shadowColor = palette[3];
    ctx.shadowBlur = 28;
    ctx.fillStyle = "#120f16e8";
    ctx.strokeStyle = "#120f16e8";
    ctx.lineWidth = 13;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-12, 55);
    ctx.bezierCurveTo(-105, 35, -116, -52, -63, -78);
    ctx.bezierCurveTo(-22, -103, 13, -69, -18, -51);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 20, 52, 75, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-2, -75, 42, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(42, 17);
    ctx.lineTo(77, -55);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(84, -71, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = palette[3];
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-12, -86);
    ctx.lineTo(-2, -67);
    ctx.lineTo(8, -86);
    ctx.stroke();
    ctx.restore();
  }

  // Foreground fireflies use stable paths so the motion feels continuous.
  for (let i = 0; i < 90; i++) {
    const phase = i * 2.399;
    const speed = 5 + (i % 5) * 2;
    const x0 = (Math.sin(phase) * 0.5 + 0.5) * w;
    const y0 = (Math.cos(phase * 1.73) * 0.5 + 0.5) * h;
    const x = (x0 + (reduced ? 0 : Math.sin(drift * 0.16 + phase) * 20 + drift * speed * (i % 2 ? 1 : -1)) + w * 4) % w;
    const y = (y0 - (reduced ? 0 : drift * speed * 0.22) + h * 4) % h;
    const pulse = reduced ? 0.6 : 0.4 + (Math.sin(drift * 1.4 + phase) + 1) * 0.3;
    ctx.fillStyle = palette[3] + (pulse > 0.72 ? "bb" : "66");
    ctx.beginPath();
    ctx.arc(x, y, i % 11 === 0 ? 2.1 : 0.8 + (i % 3) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.12, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(3,10,17,.52)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export default function VisualExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const activeRef = useRef(0);
  const previousRef = useRef(0);
  const transitionStartRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const navigateTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(verses.length - 1, index));
    sectionsRef.current[next]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    setActiveIndex(next);
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let last = performance.now();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const frame = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.04);
      last = now;
      if (!pausedRef.current && !motion.matches) time += delta;
      const current = activeRef.current;
      const previous = previousRef.current;
      const transition = Math.min(1, (now - transitionStartRef.current) / 1100);
      ctx.clearRect(0, 0, width, height);
      if (previous !== current && transition < 1) {
        drawScene(ctx, width, height, time, previous, 1 - transition, motion.matches);
        drawScene(ctx, width, height, time, current, transition, motion.matches);
      } else {
        drawScene(ctx, width, height, time, current, 1, motion.matches);
      }
      if (!motion.matches) raf = window.requestAnimationFrame(frame);
    };
    const resizeObserver = () => resize();
    resize();
    window.addEventListener("resize", resizeObserver);
    const onMotionChange = () => {
      if (raf) window.cancelAnimationFrame(raf);
      last = performance.now();
      raf = window.requestAnimationFrame(frame);
    };
    motion.addEventListener("change", onMotionChange);
    raf = window.requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("resize", resizeObserver);
      motion.removeEventListener("change", onMotionChange);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const best = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (!best) return;
      const next = Number(best.target.getAttribute("data-scene-index") ?? 0);
      if (next !== activeRef.current) {
        previousRef.current = activeRef.current;
        activeRef.current = next;
        transitionStartRef.current = performance.now();
        setActiveIndex(next);
      }
    }, { threshold: [0.25, 0.55, 0.8] });
    sectionsRef.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative isolate min-h-screen overflow-clip bg-[#081b2a] text-[#fff3dc]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061522]/80 via-[#061522]/35 to-transparent" />
      </div>

      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="pointer-events-auto inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to reading
        </Link>
        <div className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white/55 sm:flex"><Sparkles className="h-3.5 w-3.5" /> The living Chalisa</div>
        <button type="button" onClick={() => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); }} className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-md transition hover:bg-black/35" aria-label={paused ? "Resume animation" : "Pause animation"}>
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}{paused ? "Resume" : "Pause"}
        </button>
      </header>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 flex items-end justify-between gap-4 px-5 pb-5 sm:px-8 lg:px-12">
        <div className="pointer-events-auto max-w-[min(82vw,700px)]">
          <AnimatePresence mode="wait">
            <motion.div key={activeIndex} initial={{ opacity: 0, y: 22, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(4px)" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mb-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#f3c987]">
                <span>{String(activeIndex + 1).padStart(2, "0")}</span><span className="h-px w-8 bg-[#f3c987]/55" /><span>Verse {verses[activeIndex]?.n}</span>
              </div>
              <p className="whitespace-pre-line font-serif text-2xl leading-relaxed drop-shadow-lg sm:text-3xl lg:text-4xl">{verses[activeIndex]?.hi}</p>
              <p className="mt-3 max-w-2xl text-xs leading-5 text-white/65 sm:text-sm">{verses[activeIndex]?.en}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="pointer-events-auto flex shrink-0 items-center gap-2 pb-1">
          <button type="button" onClick={() => navigateTo(activeIndex - 1)} disabled={activeIndex <= 0} aria-label="Previous verse" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-30"><ArrowLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => navigateTo(activeIndex + 1)} disabled={activeIndex >= verses.length - 1} aria-label="Next verse" className="grid h-11 w-11 place-items-center rounded-full bg-[#e18b48] text-[#171c20] transition hover:bg-[#f0a25e] disabled:opacity-30"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
        <span className="mb-2 text-[10px] font-bold tracking-[0.2em] text-white/50 [writing-mode:vertical-rl]">SCROLL TO EXPERIENCE</span>
        <div className="h-36 w-px overflow-hidden bg-white/20"><div className="w-full bg-[#f0a25e] transition-[height] duration-700" style={{ height: `${((activeIndex + 1) / verses.length) * 100}%` }} /></div>
        <span className="mt-2 text-[10px] tabular-nums text-white/60">{String(activeIndex + 1).padStart(2, "0")} / {String(verses.length).padStart(2, "0")}</span>
      </div>

      {verses.map((verse, index) => (
        <section key={index} ref={(node) => { sectionsRef.current[index] = node; }} data-scene-index={index} className="relative z-10 flex min-h-[100svh] items-center px-5 pb-64 pt-24 sm:px-8 lg:px-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061522]/30 via-transparent to-[#061522]/10" />
          <div className="relative max-w-xl opacity-0" aria-hidden="true">
            <p>{verse.hi}</p>
          </div>
          {index === 0 && <div className="pointer-events-none absolute bottom-32 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/55 md:flex"><ArrowDown className="h-3.5 w-3.5 animate-bounce" /> Scroll slowly</div>}
        </section>
      ))}
    </main>
  );
}
