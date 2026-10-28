import { useEffect, useRef } from "react";

type SceneKind = "invocation" | "wisdom" | "hanuman" | "messenger" | "strength" | "golden";

type Props = {
  verseIndex: number;
  verseLabel: string;
  totalVerses: number;
  reducedMotion?: boolean;
  onNavigate: (nextIndex: number) => void;
};

const scenes: Array<{ kind: SceneKind; title: string; subtitle: string }> = [
  { kind: "invocation", title: "A quiet beginning", subtitle: "The mind becomes a clear mirror" },
  { kind: "wisdom", title: "A humble prayer", subtitle: "Strength, wisdom, and knowledge" },
  { kind: "hanuman", title: "Ocean of virtues", subtitle: "Jai Hanuman gyan gun sagar" },
  { kind: "messenger", title: "Rama’s messenger", subtitle: "Devotion made visible" },
  { kind: "strength", title: "Strength with purpose", subtitle: "Courage guided by wisdom" },
  { kind: "golden", title: "The radiant form", subtitle: "A presence full of light" },
];

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export default function VerseSceneCanvas({ verseIndex, verseLabel, totalVerses, reducedMotion = false, onNavigate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const scene = scenes[((verseIndex % scenes.length) + scenes.length) % scenes.length];

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !host || !ctx) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = reducedMotion || motionPreference.matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let start = performance.now();
    let visible = true;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      // Use a deliberate landscape composition; never derive canvas height from its own parent.
      height = Math.max(220, Math.min(360, rect.width * 0.56));
      host.style.height = `${height}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(performance.now());
    };

    const drawHanumanSilhouette = (time: number) => {
      const cx = width * 0.72;
      const cy = height * 0.58 + (reduced ? 0 : Math.sin(time * 0.0011) * 5);
      const scale = Math.min(width / 390, height / 290) * 1.15;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      const silhouetteGlow = ctx.createRadialGradient(0, -18, 4, 0, -18, 82);
      silhouetteGlow.addColorStop(0, "rgba(255, 205, 121, .22)");
      silhouetteGlow.addColorStop(1, "rgba(255, 205, 121, 0)");
      ctx.fillStyle = silhouetteGlow;
      ctx.beginPath();
      ctx.arc(0, -18, 82, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(55, 31, 26, .94)";
      ctx.strokeStyle = "rgba(55, 31, 26, .94)";
      ctx.lineWidth = 11;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // Tail, head, torso and gada are deliberately symbolic procedural shapes.
      ctx.beginPath();
      ctx.moveTo(-5, 30);
      const tailSway = reduced ? 0 : Math.sin(time * 0.0015) * 7;
      ctx.bezierCurveTo(-63, 15 + tailSway, -71 - tailSway, -34, -43, -54);
      ctx.bezierCurveTo(-17, -73, 3 + tailSway, -53, -9, -39);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 11, 32, 43, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-1, -30, 27, 29, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(30, 13);
      ctx.lineTo(53, -34);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(57, -43, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f5d49a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-7, -36);
      ctx.lineTo(-1, -24);
      ctx.lineTo(5, -36);
      ctx.stroke();
      ctx.strokeStyle = "#d66b2e";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(-21, -11);
      ctx.quadraticCurveTo(2, 5, 21, 38);
      ctx.stroke();
      ctx.restore();
    };

    const paint = (now: number) => {
      if (!width || !height) return;
      const t = reduced ? 0.45 : (now - start) / 1000;
      const w = width;
      const h = height;
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#192f42");
      bg.addColorStop(0.55, "#74432f");
      bg.addColorStop(1, "#d98443");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const sunX = w * (scene.kind === "invocation" ? 0.5 : 0.69);
      const sunY = h * (scene.kind === "invocation" ? 0.37 : 0.42);
      const sunRadius = Math.min(w, h) * (scene.kind === "hanuman" ? 0.25 : 0.21);
      const glow = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, sunRadius * 1.9);
      glow.addColorStop(0, "rgba(255, 222, 155, .74)");
      glow.addColorStop(0.35, "rgba(255, 177, 94, .22)");
      glow.addColorStop(1, "rgba(255, 177, 94, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.strokeStyle = "rgba(255, 220, 155, .26)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, sunRadius * (0.6 + i * 0.19) + (reduced ? 0 : Math.sin(t * 0.6 + i) * 2), 0, Math.PI * 2);
        ctx.stroke();
      }
      // Slowly rotating rays add depth to the halo.
      if (!reduced) {
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(t * 0.035);
        for (let ray = 0; ray < 18; ray++) {
          ctx.rotate((Math.PI * 2) / 18);
          ctx.strokeStyle = "rgba(255, 224, 166, .12)";
          ctx.lineWidth = ray % 3 === 0 ? 1.4 : 0.7;
          ctx.beginPath();
          ctx.moveTo(sunRadius * 0.78, 0);
          ctx.lineTo(sunRadius * (1.28 + (ray % 2) * 0.14), 0);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.restore();

      // Slow cloud veils create atmospheric parallax.
      for (let cloud = 0; cloud < 4; cloud++) {
        const drift = reduced ? 0 : t * (4 + cloud * 1.7);
        const x = ((cloud * w * 0.37 + drift) % (w + 180)) - 90;
        const y = h * (0.24 + cloud * 0.075);
        ctx.fillStyle = "rgba(255, 207, 155, .045)";
        ctx.beginPath();
        ctx.ellipse(x, y, w * 0.15, h * 0.035, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 24, y + 3, w * 0.1, h * 0.025, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(25, 39, 48, .78)";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      ctx.lineTo(w * 0.14, h * 0.52);
      ctx.lineTo(w * 0.27, h * 0.68);
      ctx.lineTo(w * 0.43, h * 0.49);
      ctx.lineTo(w * 0.59, h * 0.69);
      ctx.lineTo(w * 0.81, h * 0.5);
      ctx.lineTo(w, h * 0.7);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      if (scene.kind === "invocation" || scene.kind === "wisdom") {
        ctx.fillStyle = "rgba(22, 34, 42, .77)";
        ctx.fillRect(w * 0.13, h * 0.62, w * 0.26, h * 0.38);
        ctx.fillRect(w * 0.18, h * 0.53, w * 0.16, h * 0.1);
        ctx.beginPath();
        ctx.moveTo(w * 0.15, h * 0.54);
        ctx.lineTo(w * 0.26, h * 0.41);
        ctx.lineTo(w * 0.37, h * 0.54);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#f8c878";
        ctx.beginPath();
        ctx.ellipse(w * 0.26, h * 0.7, 4, 11 + (reduced ? 0 : Math.sin(t * 5) * 2), 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        drawHanumanSilhouette(now);
      }

      for (let i = 0; i < 58; i++) {
        const phase = i * 2.399;
        const drift = reduced ? 0 : t * (7 + (i % 4) * 2);
        const x = ((Math.sin(phase) * 0.5 + 0.5) * w + drift * (i % 2 ? 1 : -1) + w) % w;
        const yBase = (Math.cos(phase * 1.7) * 0.5 + 0.5) * h;
        const y = (yBase - drift * 0.7 + h) % h;
        ctx.fillStyle = `rgba(255, ${190 + (i % 3) * 18}, 128, ${0.2 + (i % 4) * 0.12})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.8 + (i % 4) * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      const vignette = ctx.createRadialGradient(w * 0.5, h * 0.45, h * 0.12, w * 0.5, h * 0.45, Math.max(w, h) * 0.72);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(9, 19, 27, .54)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // Reveal each new verse with a short, soft cinematic fade rather than a hard cut.
      const reveal = reduced ? 1 : Math.min(1, (now - start) / 900);
      if (reveal < 1) {
        ctx.fillStyle = `rgba(10, 20, 29, ${(1 - reveal) * 0.34})`;
        ctx.fillRect(0, 0, w, h);
      }

      const margin = Math.max(22, w * 0.065);
      const textWidth = Math.min(w * 0.43, 250);
      ctx.fillStyle = "rgba(255, 243, 220, .92)";
      ctx.font = "600 10px sans-serif";
      ctx.letterSpacing = "2px";
      ctx.fillText("SHREE HANUMAN CHALISA", margin, 28);
      ctx.fillStyle = "#fff0d2";
      ctx.font = `600 ${Math.min(29, Math.max(20, w * 0.052))}px Georgia, serif`;
      ctx.letterSpacing = "0px";
      const breakAt = scene.title.lastIndexOf(" ");
      const lines = scene.title.length > 17 && breakAt > 0 ? [scene.title.slice(0, breakAt), scene.title.slice(breakAt + 1)] : [scene.title];
      lines.forEach((line, i) => ctx.fillText(line, margin, h * 0.43 + i * 29, textWidth));
      ctx.fillStyle = "rgba(255, 238, 209, .76)";
      ctx.font = "12px sans-serif";
      ctx.fillText(scene.subtitle, margin, h * 0.43 + lines.length * 29 + 8, textWidth + 20);

      ctx.strokeStyle = "rgba(255, 228, 183, .45)";
      ctx.lineWidth = 1;
      roundedRect(ctx, 12, 12, w - 24, h - 24, 13);
      ctx.stroke();
    };

    const tick = (now: number) => {
      if (!visible || reduced) return;
      paint(now);
      raf = window.requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced && !raf) raf = window.requestAnimationFrame(tick);
      if (!visible && raf) { window.cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0.05, rootMargin: "120px 0px" });
    intersectionObserver.observe(host);

    resize();
    if (!reduced) raf = window.requestAnimationFrame(tick);
    const onMotionChange = () => {
      if (motionPreference.matches && raf) { window.cancelAnimationFrame(raf); raf = 0; paint(performance.now()); }
      else if (!motionPreference.matches && visible && !raf) { start = performance.now(); raf = window.requestAnimationFrame(tick); }
    };
    motionPreference.addEventListener("change", onMotionChange);
    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionPreference.removeEventListener("change", onMotionChange);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [verseIndex, reducedMotion, scene.kind, scene.title, scene.subtitle]);

  return (
    <div ref={hostRef} className="verse-scene relative isolate my-6 overflow-hidden rounded-2xl border border-[#b88a62]/45 shadow-[0_18px_48px_rgba(53,35,24,0.18)]" role="img" aria-label={`Animated illustration for verse ${verseLabel}: ${scene.title}. ${scene.subtitle}`}>
      <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: "16 / 9" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#172733]/95 via-[#172733]/65 to-transparent px-4 pb-3 pt-12 text-[#fff1d7] sm:px-5 sm:pb-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">Verse {verseLabel} of {totalVerses}</span>
          <span className="text-[10px] opacity-70">Scroll or navigate</span>
        </div>
        <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-[#f4c47e] transition-[width] duration-500" style={{ width: `${((verseIndex + 1) / Math.max(totalVerses, 1)) * 100}%` }} />
        </div>
        <div className="pointer-events-auto flex items-center justify-between gap-3">
          <button type="button" onClick={() => onNavigate(Math.max(0, verseIndex - 1))} disabled={verseIndex <= 0} aria-label="Previous verse scene" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#172733]/65 px-3 py-2 text-xs font-semibold text-[#fff1d7] backdrop-blur-sm transition hover:border-[#f4c47e] hover:bg-[#31424a] disabled:cursor-not-allowed disabled:opacity-35">
            <span aria-hidden="true">←</span><span>Previous</span>
          </button>
          <span className="text-[10px] tracking-[0.18em] text-[#f4d6a8]/80">{String(verseIndex + 1).padStart(2, "0")} / {String(totalVerses).padStart(2, "0")}</span>
          <button type="button" onClick={() => onNavigate(Math.min(totalVerses - 1, verseIndex + 1))} disabled={verseIndex >= totalVerses - 1} aria-label="Next verse scene" className="inline-flex items-center gap-2 rounded-full border border-[#f4c47e]/55 bg-[#d96b2b]/90 px-3 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-[#e47c3a] disabled:cursor-not-allowed disabled:opacity-35">
            <span>Next</span><span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
