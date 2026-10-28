import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { verses } from "@/lib/hanumanChalisa";

type Character = "hanuman" | "ram";
type Action = "stand" | "pray" | "run" | "fly" | "victory" | "archer";
type Scene = { character: Character; action: Action; world: "dawn" | "temple" | "ocean" | "forest" | "mountain"; title: string; subtitle: string };

const scenes: Scene[] = [
  { character: "hanuman", action: "pray", world: "dawn", title: "A quiet beginning", subtitle: "Clear the mind; begin with humility." },
  { character: "hanuman", action: "stand", world: "temple", title: "A humble prayer", subtitle: "Strength, wisdom, and knowledge." },
  { character: "hanuman", action: "victory", world: "dawn", title: "Strength and wisdom", subtitle: "Let courage be guided by devotion." },
  { character: "hanuman", action: "run", world: "forest", title: "Strength in service", subtitle: "Move with purpose; serve with compassion." },
  { character: "ram", action: "archer", world: "temple", title: "The grace of Rama", subtitle: "Steadiness, virtue, and protection." },
  { character: "hanuman", action: "fly", world: "ocean", title: "Across the ocean", subtitle: "Devotion carries courage beyond every shore." },
  { character: "hanuman", action: "victory", world: "mountain", title: "The life-giving mountain", subtitle: "When hope is needed, carry it home." },
  { character: "hanuman", action: "pray", world: "dawn", title: "Devotion without end", subtitle: "Let every action become an offering." },
];

const sceneForVerse = (index: number): Scene => {
  // Explicit verse beats keep the story editable without touching the renderer.
  const beats: Record<number, number> = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 3, 5: 2, 6: 1, 7: 3, 8: 4, 9: 3,
    10: 5, 11: 2, 12: 3, 13: 5, 14: 5, 15: 3, 16: 3, 17: 2, 18: 1,
    19: 3, 20: 4, 21: 4, 22: 5, 23: 3, 24: 3, 25: 0, 26: 2, 27: 1,
    28: 0, 29: 1, 30: 2, 31: 0, 32: 4, 33: 0, 34: 1, 35: 2, 36: 1,
    37: 0, 38: 1, 39: 0, 40: 1, 41: 2, 42: 7,
  };
  return scenes[beats[index] ?? index % scenes.length];
};

const INK = "#314e50";
const INK_SOFT = "#527274";

function Cloud({ x, y, scale = 1, delay = 0, paused }: { x: number; y: number; scale?: number; delay?: number; paused: boolean }) {
  return <motion.g animate={paused ? { x } : { x: [x, x + 18, x] }} transition={{ duration: 15 + delay, repeat: Infinity, ease: "easeInOut", delay }} opacity=".28" fill="#fffdf6">
    <g transform={`translate(0 ${y}) scale(${scale})`}>
      <path d="M-100 34 C-112 7 -88 -12 -63 -5 C-47 -50 8 -51 31 -14 C61 -29 91 -10 91 19 C122 16 137 39 126 55 L-92 55 C-104 51 -107 42 -100 34Z" />
    </g>
  </motion.g>;
}

function CharacterArt({ character, action, paused }: { character: Character; action: Action; paused: boolean }) {
  const still = paused;
  const isHanuman = character === "hanuman";
  const flying = action === "fly";
  const running = action === "run";
  const praying = action === "pray";
  const victorious = action === "victory";
  const archer = action === "archer";
  const float = still ? {} : { y: [0, -7, 0] };
  const floatTransition = { duration: 3.8, repeat: still ? 0 : Infinity, ease: "easeInOut" as const };
  return <motion.g initial={false} animate={{ ...float, rotate: flying ? -9 : running ? -4 : [0, 1, 0] }} transition={floatTransition}>
    {/* Tail is a simple stroke, not a baked image; its shape belongs to the character. */}
    {isHanuman && <motion.path d={flying ? "M135 236 C220 235 230 150 183 126 C153 110 132 131 149 149" : "M135 240 C205 257 222 202 191 178 C170 162 153 178 169 191"} fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" animate={still ? {} : { rotate: [-2, 3, -2] }} style={{ transformOrigin: "135px 236px" }} transition={{ duration: 3, repeat: still ? 0 : Infinity, ease: "easeInOut" }} />}
    {/* Legs pivot at the hips, with a deliberately limited one-ink silhouette. */}
    <motion.g style={{ transformOrigin: "145px 260px" }} animate={running || flying ? { rotate: [-17, 17, -17] } : { rotate: 0 }} transition={{ duration: running ? .72 : 1.6, repeat: running && !still ? Infinity : 0, ease: "easeInOut" }}>
      <path d="M126 246 Q111 275 99 304 L82 321" fill="none" stroke={INK} strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M82 321 Q66 328 52 319" fill="none" stroke={INK} strokeWidth="17" strokeLinecap="round" />
    </motion.g>
    <motion.g style={{ transformOrigin: "165px 260px" }} animate={running || flying ? { rotate: [18, -16, 18] } : { rotate: 0 }} transition={{ duration: running ? .72 : 1.6, repeat: running && !still ? Infinity : 0, ease: "easeInOut" }}>
      <path d="M165 247 Q184 274 197 302 L217 315" fill="none" stroke={INK} strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M217 315 Q232 324 244 313" fill="none" stroke={INK} strokeWidth="17" strokeLinecap="round" />
    </motion.g>
    {/* Dhoti / lower garment. */}
    <path d="M108 218 Q147 234 185 216 L179 270 Q146 286 111 266Z" fill={INK} />
    <path d="M145 232 L151 276" stroke="#f7f3e9" strokeWidth="3" opacity=".65" />
    {/* Torso and chest jewellery are cut from the same solid colour. */}
    <path d="M113 135 Q143 117 176 136 L190 207 Q171 231 145 230 Q118 228 101 207Z" fill={INK} />
    <path d="M119 149 Q145 174 171 149" fill="none" stroke="#f7f3e9" strokeWidth="3.5" strokeLinecap="round" opacity=".8" />
    <path d="M125 159 Q145 188 165 159 L145 201Z" fill="none" stroke="#f7f3e9" strokeWidth="3" opacity=".8" />
    {/* Arms are separate moving groups so the same drawing can pray, fly or celebrate. */}
    <motion.g style={{ transformOrigin: "118px 151px" }} animate={praying ? { rotate: -28 } : flying ? { rotate: -48 } : victorious ? { rotate: -62 } : archer ? { rotate: -18 } : running ? { rotate: [-36, 32, -36] } : { rotate: -8 }} transition={{ duration: running ? .72 : .55, repeat: running && !still ? Infinity : 0, ease: "easeInOut" }}>
      <path d="M119 151 Q96 163 83 143 L74 119" fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="74" cy="117" r="10" fill={INK} />
    </motion.g>
    <motion.g style={{ transformOrigin: "176px 151px" }} animate={praying ? { rotate: 28 } : flying ? { rotate: 45 } : victorious ? { rotate: 45 } : archer ? { rotate: 62 } : running ? { rotate: [30, -35, 30] } : { rotate: 8 }} transition={{ duration: running ? .72 : .55, repeat: running && !still ? Infinity : 0, ease: "easeInOut" }}>
      <path d="M176 151 Q199 163 211 143 L221 119" fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="221" cy="117" r="10" fill={INK} />
    </motion.g>
    {/* Prayer hands overlap at the chest; the pose remains readable at small sizes. */}
    {praying && <g stroke={INK} strokeWidth="9" strokeLinecap="round"><path d="M135 150 L145 126 L153 150" fill="none" /><path d="M145 126 L145 151" /></g>}
    {/* Head, muzzle, tilak and crown. */}
    <path d="M129 114 L127 101 L162 101 L161 119Z" fill={INK} />
    <ellipse cx="145" cy="82" rx={isHanuman ? 37 : 31} ry="39" fill={INK} />
    {isHanuman && <path d="M118 84 Q145 66 172 84 Q166 108 145 109 Q124 108 118 84Z" fill="#f7f3e9" />}
    <path d="M131 79 Q136 73 140 79 M151 79 Q156 73 160 79" fill="none" stroke="#f7f3e9" strokeWidth="4" strokeLinecap="round" />
    <path d="M145 61 L145 88 M139 68 L145 77 L151 68" stroke="#f7f3e9" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M112 54 L108 29 L125 40 L136 12 L147 37 L160 10 L169 40 L184 29 L179 55 Q145 65 112 54Z" fill={INK} />
    <path d="M119 49 Q145 38 174 49" fill="none" stroke="#f7f3e9" strokeWidth="3" opacity=".8" />
    {/* Gada for Hanuman; bow for Rama. Both are simple strokes and can be animated independently. */}
    {isHanuman && <motion.g style={{ transformOrigin: "225px 153px" }} animate={victorious ? { rotate: -28 } : flying ? { rotate: -22 } : { rotate: 0 }} transition={{ duration: .6 }}>
      <path d="M226 110 L245 202" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M224 105 Q243 89 257 106 L260 121 Q247 134 230 123Z" fill={INK} />
      <path d="M234 202 L245 213 L256 207" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    </motion.g>}
    {archer && <g fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round"><path d="M221 91 Q274 148 221 205" /><path d="M221 91 L221 205" /><path d="M205 148 L261 148" /></g>}
  </motion.g>;
}

function IllustratedWorld({ scene, paused }: { scene: Scene; paused: boolean }) {
  return <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={`Minimal animated scene: ${scene.title}`}>
    <defs><linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dce9e4" /><stop offset="1" stopColor="#f5e8d2" /></linearGradient><radialGradient id="glow"><stop stopColor="#fffdf2" stopOpacity=".95" /><stop offset="1" stopColor="#fffdf2" stopOpacity="0" /></radialGradient></defs>
    <rect width="1440" height="900" fill="url(#paper)" />
    <circle cx="735" cy="330" r="280" fill="url(#glow)" />
    <motion.circle cx="735" cy="330" r="178" fill="none" stroke={INK} strokeWidth="2" opacity=".12" animate={paused ? { r: 178 } : { r: [168, 184, 168] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
    <Cloud x={130} y={150} scale={1.1} delay={1} paused={paused} /><Cloud x={1150} y={180} scale={.9} delay={3} paused={paused} />
    {scene.world === "mountain" && <g fill={INK} opacity=".12"><path d="M0 720 L190 500 L350 690 L510 450 L700 700 L900 490 L1110 705 L1290 510 L1440 675 V900 H0Z" /><path d="M0 790 Q220 740 440 790 T880 785 T1320 780 L1440 800 V900 H0Z" /></g>}
    {scene.world === "temple" && <g fill={INK} opacity=".13"><path d="M80 750 V625 H130 V585 H165 V625 H220 V750Z" /><path d="M55 625 L150 550 L245 625Z" /><path d="M1190 750 V630 H1240 V590 H1275 V630 H1330 V750Z" /><path d="M1160 630 L1260 560 L1360 630Z" /></g>}
    {scene.world === "ocean" && <g fill="none" stroke={INK} strokeWidth="5" opacity=".15"><path d="M0 700 Q90 670 180 700 T360 700 T540 700 T720 700 T900 700 T1080 700 T1260 700 T1440 700" /><path d="M0 750 Q90 720 180 750 T360 750 T540 750 T720 750 T900 750 T1080 750 T1260 750 T1440 750" /></g>}
    {scene.world === "forest" && <g fill={INK} opacity=".12">{Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${i * 145 - 25} 790 l58 -175 l58 175Z`} />)}</g>}
    <path d="M0 790 Q220 730 440 790 T880 785 T1320 780 L1440 800 V900 H0Z" fill={INK} opacity=".09" />
    <motion.g key={scene.character + scene.action} transform={scene.action === "fly" ? "translate(560 175) scale(1.16)" : "translate(555 245) scale(1.12)"} animate={scene.action === "fly" && !paused ? { x: [0, 28, 0] } : { x: 0 }} transition={{ duration: 5, repeat: paused ? 0 : Infinity, ease: "easeInOut" }}>
      <CharacterArt character={scene.character} action={scene.action} paused={paused} />
    </motion.g>
    <g fill={INK} opacity=".22"><circle cx="430" cy="355" r="4" /><circle cx="1010" cy="410" r="5" /><circle cx="960" cy="275" r="3" /></g>
  </svg>;
}

export default function VisualExperience() {
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const navigateTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(verses.length - 1, index));
    sectionsRef.current[next]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    setActiveIndex(next);
  }, [reducedMotion]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      setActiveIndex(Number(visible.target.getAttribute("data-scene-index") ?? 0));
    }, { threshold: [0.2, 0.4, 0.6, 0.8] });
    sectionsRef.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scene = sceneForVerse(activeIndex);
  const reduced = Boolean(reducedMotion);
  return <main className="relative isolate min-h-screen overflow-clip bg-[#e7eee6] text-[#263f40]">
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0"><IllustratedWorld scene={scene} paused={paused || reduced} /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#f5e8d2]/35 via-transparent to-white/5" />
    </div>
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
      <Link href="/" className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#fffdf6]/70 px-4 py-2 text-sm font-semibold text-[#314e50] backdrop-blur-md transition hover:bg-[#fffdf6]"><ArrowLeft className="h-4 w-4" /> Back to reading</Link>
      <div className="hidden items-center gap-2 rounded-full bg-[#fffdf6]/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#314e50] backdrop-blur-md sm:flex"><Sparkles className="h-3.5 w-3.5" /> The living Chalisa</div>
      <button type="button" onClick={() => setPaused((value) => !value)} className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#fffdf6]/75 px-4 py-2 text-xs font-semibold text-[#314e50] backdrop-blur-md transition hover:bg-white" aria-label={paused ? "Resume animation" : "Pause animation"}>{paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}{paused ? "Resume" : "Pause"}</button>
    </header>
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 flex items-end justify-between gap-4 px-5 pb-5 sm:px-8 sm:pb-8 lg:px-12">
      <div className="pointer-events-auto max-w-[min(82vw,760px)] rounded-2xl border border-white/50 bg-[#fffdf6]/80 p-4 shadow-[0_10px_40px_rgba(49,78,80,.08)] backdrop-blur-lg sm:p-6">
        <AnimatePresence mode="wait"><motion.div key={activeIndex} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .35 }}>
          <div className="mb-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.22em] text-[#527274]"><span>{String(activeIndex + 1).padStart(2, "0")}</span><span className="h-px w-7 bg-[#527274]/45" /><span>{scene.title}</span></div>
          <p className="whitespace-pre-line font-serif text-xl leading-relaxed text-[#263f40] sm:text-2xl lg:text-3xl">{verses[activeIndex]?.hi}</p>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-[#527274] sm:text-sm">{verses[activeIndex]?.en || scene.subtitle}</p>
        </motion.div></AnimatePresence>
      </div>
      <div className="pointer-events-auto flex shrink-0 items-center gap-2 pb-1">
        <button type="button" onClick={() => navigateTo(activeIndex - 1)} disabled={activeIndex <= 0} aria-label="Previous verse" className="grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-[#fffdf6]/80 text-[#314e50] shadow-sm backdrop-blur-md transition hover:bg-white disabled:opacity-30"><ArrowLeft className="h-4 w-4" /></button>
        <button type="button" onClick={() => navigateTo(activeIndex + 1)} disabled={activeIndex >= verses.length - 1} aria-label="Next verse" className="grid h-11 w-11 place-items-center rounded-full bg-[#314e50] text-[#fffdf6] shadow-sm transition hover:bg-[#527274] disabled:opacity-30"><ArrowRight className="h-4 w-4" /></button>
      </div>
    </div>
    <div className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
      <span className="mb-2 text-[10px] font-bold tracking-[.2em] text-[#314e50]/65 [writing-mode:vertical-rl]">SCROLL TO EXPERIENCE</span>
      <div className="h-36 w-px overflow-hidden bg-[#314e50]/20"><div className="w-full bg-[#527274] transition-[height] duration-700" style={{ height: `${((activeIndex + 1) / verses.length) * 100}%` }} /></div>
      <span className="mt-2 text-[10px] tabular-nums text-[#314e50]/70">{String(activeIndex + 1).padStart(2, "0")} / {String(verses.length).padStart(2, "0")}</span>
    </div>
    {verses.map((verse, index) => <section key={index} ref={(node) => { sectionsRef.current[index] = node; }} data-scene-index={index} className="relative z-10 flex min-h-[100svh] items-end px-5 pb-56 pt-24 sm:px-8 sm:pb-60 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#f5e8d2]/10" />
      <div className="relative max-w-xl opacity-0" aria-hidden="true"><p>{verse.hi}</p></div>
      {index === 0 && <div className="pointer-events-none absolute bottom-40 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[.25em] text-[#314e50]/65 md:flex"><ArrowDown className="h-3.5 w-3.5 animate-bounce" /> Scroll slowly</div>}
    </section>)}
  </main>;
}
