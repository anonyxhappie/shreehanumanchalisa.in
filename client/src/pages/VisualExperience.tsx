import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { verses } from "@/lib/hanumanChalisa";

const chapters = [
  { title: "A quiet beginning", subtitle: "Clear the mind; begin with humility.", sky: ["#d8f0ed", "#fff0dc"], world: "dawn" },
  { title: "A humble prayer", subtitle: "Strength, wisdom, and knowledge.", sky: ["#cde9f5", "#ffe2c6"], world: "temple" },
  { title: "An ocean of wisdom", subtitle: "Courage carries devotion beyond every shore.", sky: ["#b8e5ed", "#ffe6ce"], world: "ocean" },
  { title: "Rama's devoted messenger", subtitle: "A heart in service moves without fear.", sky: ["#d6e8f7", "#ffe1c2"], world: "dawn" },
  { title: "Strength in service", subtitle: "Power guided by compassion.", sky: ["#d6eee7", "#ffe6ca"], world: "forest" },
  { title: "The life-giving mountain", subtitle: "When hope is needed, carry it home.", sky: ["#d3edec", "#ffe3c6"], world: "mountain" },
  { title: "A promise of protection", subtitle: "Faith stands beside those in need.", sky: ["#d9e9fa", "#ffdfc4"], world: "temple" },
  { title: "Devotion without end", subtitle: "Let every action become an offering.", sky: ["#d5eee9", "#ffe8cf"], world: "dawn" },
];

const chapterFor = (index: number) => chapters[index % chapters.length];

function Cloud({ x, y, scale = 1, color, delay = 0, paused }: { x: number; y: number; scale?: number; color: string; delay?: number; paused: boolean }) {
  return <motion.g initial={{ x }} animate={paused ? { x } : { x: [x, x + 20, x] }} transition={{ duration: 12 + delay, repeat: Infinity, ease: "easeInOut", delay }} fill={color} opacity=".88">
    <g transform={`translate(0 ${y}) scale(${scale})`}>
      <path d="M-100 34 C-112 7 -88 -12 -63 -5 C-47 -50 8 -51 31 -14 C61 -29 91 -10 91 19 C122 16 137 39 126 55 L-92 55 C-104 51 -107 42 -100 34Z" />
    </g>
  </motion.g>;
}

const poseByVerse: Record<number, { character: "hanuman" | "ram"; pose: string; width: number; height: number; x: number; y: number }> = {
  0: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  1: { character: "hanuman", pose: "prayer", width: 440, height: 420, x: 500, y: 300 },
  2: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  3: { character: "hanuman", pose: "running", width: 500, height: 450, x: 475, y: 275 },
  4: { character: "hanuman", pose: "running", width: 500, height: 450, x: 475, y: 275 },
  5: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  6: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  7: { character: "hanuman", pose: "running", width: 500, height: 450, x: 475, y: 275 },
  8: { character: "ram", pose: "standing", width: 310, height: 510, x: 570, y: 250 },
  9: { character: "hanuman", pose: "running", width: 500, height: 450, x: 475, y: 275 },
  10: { character: "hanuman", pose: "flying", width: 600, height: 470, x: 420, y: 245 },
  11: { character: "hanuman", pose: "victory", width: 430, height: 450, x: 500, y: 280 },
  12: { character: "hanuman", pose: "running", width: 500, height: 450, x: 475, y: 275 },
  13: { character: "hanuman", pose: "flying", width: 600, height: 470, x: 420, y: 245 },
  14: { character: "hanuman", pose: "flying", width: 600, height: 470, x: 420, y: 245 },
  15: { character: "hanuman", pose: "running-back", width: 470, height: 450, x: 490, y: 275 },
  16: { character: "hanuman", pose: "running", width: 500, height: 450, x: 475, y: 275 },
  17: { character: "hanuman", pose: "victory", width: 430, height: 450, x: 500, y: 280 },
  18: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  19: { character: "hanuman", pose: "running", width: 500, height: 450, x: 475, y: 275 },
  20: { character: "ram", pose: "archer", width: 460, height: 440, x: 490, y: 280 },
  21: { character: "ram", pose: "archer", width: 460, height: 440, x: 490, y: 280 },
  22: { character: "hanuman", pose: "flying", width: 600, height: 470, x: 420, y: 245 },
  23: { character: "hanuman", pose: "running", width: 500, height: 450, x: 475, y: 275 },
  24: { character: "hanuman", pose: "running-back", width: 470, height: 450, x: 490, y: 275 },
  25: { character: "hanuman", pose: "prayer", width: 440, height: 420, x: 500, y: 300 },
  26: { character: "hanuman", pose: "victory", width: 430, height: 450, x: 500, y: 280 },
  27: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  28: { character: "hanuman", pose: "prayer", width: 440, height: 420, x: 500, y: 300 },
  29: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  30: { character: "hanuman", pose: "victory", width: 430, height: 450, x: 500, y: 280 },
  31: { character: "hanuman", pose: "prayer", width: 440, height: 420, x: 500, y: 300 },
  32: { character: "ram", pose: "standing", width: 310, height: 510, x: 570, y: 250 },
  33: { character: "hanuman", pose: "prayer", width: 440, height: 420, x: 500, y: 300 },
  34: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  35: { character: "hanuman", pose: "victory", width: 430, height: 450, x: 500, y: 280 },
  36: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  37: { character: "hanuman", pose: "prayer", width: 440, height: 420, x: 500, y: 300 },
  38: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  39: { character: "hanuman", pose: "prayer", width: 440, height: 420, x: 500, y: 300 },
  40: { character: "hanuman", pose: "standing", width: 390, height: 440, x: 525, y: 280 },
  41: { character: "hanuman", pose: "victory", width: 430, height: 450, x: 500, y: 280 },
  42: { character: "hanuman", pose: "prayer", width: 440, height: 420, x: 500, y: 300 },
};

function CharacterPose({ index, paused }: { index: number; paused: boolean }) {
  const pose = poseByVerse[index] ?? poseByVerse[0];
  const asset = `/images/visual/${pose.character}-${pose.pose}.webp`;
  return <motion.image
    key={asset}
    href={asset}
    x={pose.x}
    y={pose.y}
    width={pose.width}
    height={pose.height}
    preserveAspectRatio="xMidYMid meet"
    initial={{ opacity: 0, y: pose.y + 18 }}
    animate={paused ? { opacity: 1, y: pose.y } : { opacity: 1, y: [pose.y, pose.y - 8, pose.y] }}
    transition={{ opacity: { duration: 0.45 }, y: { duration: 4.6, repeat: paused ? 0 : Infinity, ease: "easeInOut" } }}
    style={{ filter: "drop-shadow(0 18px 18px rgba(111, 69, 38, .12))" }}
  />;
}

function IllustratedWorld({ index, paused }: { index: number; paused: boolean }) {
  const chapter = chapterFor(index);
  return <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={`Animated devotional illustration: ${chapter.title}`}>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={chapter.sky[0]} /><stop offset="1" stopColor={chapter.sky[1]} /></linearGradient>
      <radialGradient id="halo"><stop offset="0" stopColor="#fff7c6" stopOpacity=".98" /><stop offset=".62" stopColor="#fff4c5" stopOpacity=".55" /><stop offset="1" stopColor="#fff4c5" stopOpacity="0" /></radialGradient>
      <linearGradient id="saffron" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffd04d" /><stop offset="1" stopColor="#f28a19" /></linearGradient>
    </defs>
    <rect width="1440" height="900" fill="url(#sky)" />
    <circle cx="730" cy="330" r="255" fill="url(#halo)" />
    <motion.circle cx="730" cy="330" r="170" fill="none" stroke="#fff8da" strokeWidth="2" opacity=".55" animate={paused ? { r: 170, opacity: .45 } : { r: [160, 190, 160], opacity: [.3, .65, .3] }} transition={{ duration: 6, repeat: Infinity }} />
    <Cloud x={130} y={130} scale={1.2} color="#9fc6ee" delay={1} paused={paused} /><Cloud x={300} y={180} scale={.72} color="#ffc78f" delay={3} paused={paused} />
    <Cloud x={1160} y={130} scale={1.05} color="#ffa88f" delay={2} paused={paused} /><Cloud x={1260} y={220} scale={.58} color="#8ecad9" delay={4} paused={paused} />
    <path d="M0 555 Q230 490 430 560 T850 550 T1440 520 L1440 900 L0 900Z" fill="#fff5e7" opacity=".46" />
    {chapter.world === "mountain" && <g><path d="M0 700 L180 500 L300 625 L470 430 L630 660 L790 485 L1000 680 L1200 490 L1440 670 V900 H0Z" fill="#7cae9e" opacity=".55" /><path d="M380 534 L470 430 L550 555 L492 528 L470 548 L449 524Z" fill="#fff5e7" opacity=".9" /><path d="M1090 600 L1200 490 L1302 605 L1230 573 L1200 590 L1174 566Z" fill="#fff5e7" opacity=".9" /></g>}
    {chapter.world === "temple" && <g fill="#d99a61" opacity=".38"><path d="M70 760 V625 H135 V575 H170 V625 H235 V760Z" /><path d="M45 625 L152 550 L260 625Z" /><path d="M1180 760 V630 H1240 V580 H1275 V630 H1340 V760Z" /><path d="M1150 630 L1260 555 L1370 630Z" /></g>}
    {chapter.world === "ocean" && <g fill="none" stroke="#76bdc8" strokeWidth="8" opacity=".5"><path d="M0 665 Q90 635 180 665 T360 665 T540 665 T720 665 T900 665 T1080 665 T1260 665 T1440 665" /><path d="M0 720 Q90 690 180 720 T360 720 T540 720 T720 720 T900 720 T1080 720 T1260 720 T1440 720" /></g>}
    {chapter.world === "forest" && <g fill="#4c9b7f" opacity=".4">{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 155 - 20} 780 l55 -160 l55 160Z`} />)}</g>}
    <CharacterPose index={index} paused={paused} />
    <g fill="#f4a34e" opacity=".9"><circle cx="500" cy="280" r="7" /><circle cx="965" cy="270" r="5" /><circle cx="1050" cy="520" r="7" /><circle cx="350" cy="480" r="5" /></g>
    <g fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".8"><path d="M235 405 Q310 450 374 400 Q340 465 260 460" /><path d="M980 560 Q1055 500 1100 525 Q1060 565 1030 585" /></g>
    <path d="M0 785 Q200 730 400 790 T800 780 T1200 770 T1440 790 V900 H0Z" fill="#e6a2a0" opacity=".52" />
    <Cloud x={70} y={780} scale={1.65} color="#83c8d6" delay={2} paused={paused} /><Cloud x={1240} y={800} scale={1.9} color="#ff9f9f" delay={1} paused={paused} />
  </svg>;
}

export default function VisualExperience() {
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const activeRef = useRef(0);

  const navigateTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(verses.length - 1, index));
    sectionsRef.current[next]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    setActiveIndex(next);
    activeRef.current = next;
  }, [reducedMotion]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const next = Number(visible.target.getAttribute("data-scene-index") ?? 0);
      activeRef.current = next;
      setActiveIndex(next);
    }, { threshold: [0.2, 0.4, 0.6, 0.8] });
    sectionsRef.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const chapter = chapterFor(activeIndex);
  return <main className="relative isolate min-h-screen overflow-clip bg-[#d9eeeb] text-[#34251e]">
    {/* One persistent illustrated SVG stage; only its verse-driven world changes. */}
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="false">
      <div className="absolute inset-0" style={{ opacity: paused ? .92 : 1 }}><IllustratedWorld index={activeIndex} paused={paused} /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#f9d8c0]/55 via-transparent to-white/5" />
    </div>

    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
      <Link href="/" className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/45 px-4 py-2 text-sm font-semibold text-[#3c4e51] backdrop-blur-md transition hover:bg-white/70"><ArrowLeft className="h-4 w-4" /> Back to reading</Link>
      <div className="hidden items-center gap-2 rounded-full bg-white/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#415457] backdrop-blur-md sm:flex"><Sparkles className="h-3.5 w-3.5" /> The living Chalisa</div>
      <button type="button" onClick={() => setPaused((value) => !value)} className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 text-xs font-semibold text-[#3c4e51] backdrop-blur-md transition hover:bg-white/80" aria-label={paused ? "Resume animation" : "Pause animation"}>{paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}{paused ? "Resume" : "Pause"}</button>
    </header>

    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 flex items-end justify-between gap-4 px-5 pb-5 sm:px-8 sm:pb-8 lg:px-12">
      <div className="pointer-events-auto max-w-[min(82vw,760px)] rounded-2xl bg-[#fff9ee]/70 p-4 shadow-[0_10px_40px_rgba(87,62,45,.08)] backdrop-blur-lg sm:p-6">
        <AnimatePresence mode="wait"><motion.div key={activeIndex} initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -10 }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mb-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.22em] text-[#a64c2d]"><span>{String(activeIndex + 1).padStart(2, "0")}</span><span className="h-px w-7 bg-[#a64c2d]/45" /><span>{chapter.title}</span></div>
          <p className="whitespace-pre-line font-serif text-xl leading-relaxed text-[#3a2921] sm:text-2xl lg:text-3xl">{verses[activeIndex]?.hi}</p>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-[#69564a] sm:text-sm">{verses[activeIndex]?.en || chapter.subtitle}</p>
        </motion.div></AnimatePresence>
      </div>
      <div className="pointer-events-auto flex shrink-0 items-center gap-2 pb-1">
        <button type="button" onClick={() => navigateTo(activeIndex - 1)} disabled={activeIndex <= 0} aria-label="Previous verse" className="grid h-11 w-11 place-items-center rounded-full bg-white/65 text-[#49372d] shadow-sm backdrop-blur-md transition hover:bg-white disabled:opacity-30"><ArrowLeft className="h-4 w-4" /></button>
        <button type="button" onClick={() => navigateTo(activeIndex + 1)} disabled={activeIndex >= verses.length - 1} aria-label="Next verse" className="grid h-11 w-11 place-items-center rounded-full bg-[#f6a32b] text-[#38271e] shadow-sm transition hover:bg-[#ffc04a] disabled:opacity-30"><ArrowRight className="h-4 w-4" /></button>
      </div>
    </div>

    <div className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
      <span className="mb-2 text-[10px] font-bold tracking-[.2em] text-[#3f575b]/65 [writing-mode:vertical-rl]">SCROLL TO EXPERIENCE</span>
      <div className="h-36 w-px overflow-hidden bg-[#46686a]/25"><div className="w-full bg-[#e98c2b] transition-[height] duration-700" style={{ height: `${((activeIndex + 1) / verses.length) * 100}%` }} /></div>
      <span className="mt-2 text-[10px] tabular-nums text-[#3f575b]/70">{String(activeIndex + 1).padStart(2, "0")} / {String(verses.length).padStart(2, "0")}</span>
    </div>

    {verses.map((verse, index) => <section key={index} ref={(node) => { sectionsRef.current[index] = node; }} data-scene-index={index} className="relative z-10 flex min-h-[100svh] items-end px-5 pb-56 pt-24 sm:px-8 sm:pb-60 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#f5d8c4]/10" />
      <div className="relative max-w-xl opacity-0" aria-hidden="true"><p>{verse.hi}</p></div>
      {index === 0 && <div className="pointer-events-none absolute bottom-40 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[.25em] text-[#40575a]/65 md:flex"><ArrowDown className="h-3.5 w-3.5 animate-bounce" /> Scroll slowly</div>}
    </section>)}
  </main>;
}
