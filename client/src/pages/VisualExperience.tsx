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

function Cloud({ x, y, scale = 1, color, delay = 0 }: { x: number; y: number; scale?: number; color: string; delay?: number }) {
  return <motion.g initial={{ x }} animate={{ x: [x, x + 20, x] }} transition={{ duration: 12 + delay, repeat: Infinity, ease: "easeInOut", delay }} transform={`translate(0 ${y}) scale(${scale})`} fill={color} opacity=".88">
    <path d="M-100 34 C-112 7 -88 -12 -63 -5 C-47 -50 8 -51 31 -14 C61 -29 91 -10 91 19 C122 16 137 39 126 55 L-92 55 C-104 51 -107 42 -100 34Z" />
  </motion.g>;
}

function FlyingHanuman() {
  return <motion.g initial={false} animate={{ y: [0, -10, 0], rotate: [-1, 1.2, -1] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }} transform="translate(720 435)">
    {/* Tail: a long, expressive silhouette behind the body */}
    <motion.path d="M-145 35 C-255 18 -246 -95 -165 -165 C-110 -213 -54 -181 -88 -143" fill="none" stroke="#a94b2b" strokeWidth="31" strokeLinecap="round" animate={{ d: ["M-145 35 C-255 18 -246 -95 -165 -165 C-110 -213 -54 -181 -88 -143", "M-145 35 C-249 4 -238 -103 -158 -166 C-103 -210 -53 -176 -87 -143", "M-145 35 C-255 18 -246 -95 -165 -165 C-110 -213 -54 -181 -88 -143"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
    <path d="M-155 24 C-251 5 -235 -93 -165 -151" fill="none" stroke="#e99b54" strokeWidth="14" strokeLinecap="round" />
    {/* rear arm and gada */}
    <path d="M-120 -4 L-226 62 L-293 104" fill="none" stroke="#c8753e" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M-120 -4 L-226 62 L-293 104" fill="none" stroke="#e8a05c" strokeWidth="27" strokeLinecap="round" strokeLinejoin="round" />
    <g transform="translate(-319 119) rotate(-35)">
      <rect x="-10" y="-84" width="20" height="119" rx="9" fill="#d18b24" stroke="#f8c84e" strokeWidth="5" />
      <circle cy="52" r="49" fill="#ffbd32" stroke="#e38b18" strokeWidth="7" />
      <path d="M-34 32 Q0 7 34 32 M-37 55 Q0 78 37 55 M0 8 V95" fill="none" stroke="#e58a16" strokeWidth="5" strokeLinecap="round" />
      <path d="M-31 82 L-47 97 L-19 93 M31 82 L47 97 L19 93" fill="#f7b52d" stroke="#e58a16" strokeWidth="5" strokeLinejoin="round" />
    </g>
    {/* legs and flowing saffron dhoti */}
    <path d="M-84 78 C-121 132 -185 178 -226 222 C-243 241 -223 260 -205 245 L-117 194 C-78 174 -41 142 -22 103Z" fill="#c9753c" />
    <path d="M-75 74 C-111 123 -170 168 -209 211 C-219 223 -210 235 -197 226 L-109 177 C-75 156 -42 127 -25 95Z" fill="#f7a51c" />
    <path d="M-46 94 C-29 139 -8 174 24 192 C40 202 59 187 47 172 L9 117 L9 77Z" fill="#c9753c" />
    <path d="M-38 91 C-21 132 -2 161 24 177 C37 184 47 174 37 163 L5 112 L5 77Z" fill="#ffb52b" />
    <path d="M-184 206 Q-170 194 -154 198 M-206 224 l-10 14 M-193 226 l-7 15 M25 178 l-7 14 M36 176 l-3 14" stroke="#a94d2a" strokeWidth="5" strokeLinecap="round" />
    <path d="M-116 24 Q-63 5 -13 23 L45 90 Q6 132 -61 103 L-134 70Z" fill="#e63f35" />
    <path d="M-114 33 Q-66 17 -18 33 L33 91 Q2 109 -28 96 L-126 64Z" fill="#f04e3e" />
    <path d="M-115 59 Q-67 82 -37 71 L-20 91 Q-66 116 -128 78Z" fill="#ffca42" />
    <path d="M-61 39 Q-46 71 -55 104" stroke="#ffcf4c" strokeWidth="7" fill="none" />
    {/* torso */}
    <path d="M-130 -32 Q-105 -72 -50 -59 Q-3 -55 21 -17 L-5 52 Q-50 73 -112 38Z" fill="#c9753c" />
    <path d="M-126 -35 Q-96 -65 -55 -54 Q-17 -50 5 -18 L-13 36 Q-54 51 -104 28Z" fill="#efa15d" />
    <path d="M-94 -43 Q-60 -22 -30 -44" fill="none" stroke="#f8c77c" strokeWidth="8" strokeLinecap="round" />
    {/* leading arm reaching forward */}
    <path d="M-34 -37 Q30 -58 91 -91 L164 -123" fill="none" stroke="#c8753c" strokeWidth="39" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M-32 -39 Q31 -58 90 -89 L164 -120" fill="none" stroke="#efa15d" strokeWidth="27" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M153 -129 Q177 -144 200 -155 L236 -163 Q247 -162 242 -153 L212 -138 L245 -147 Q258 -146 250 -137 L216 -120 Q199 -112 179 -117 L158 -109Z" fill="#efa15d" stroke="#c8753c" strokeWidth="4" strokeLinejoin="round" />
    <path d="M88 -79 Q101 -94 116 -83" fill="none" stroke="#ffc54a" strokeWidth="12" strokeLinecap="round" />
    <path d="M-3 -45 Q8 -33 5 -14" fill="none" stroke="#ffc54a" strokeWidth="13" strokeLinecap="round" />
    {/* neck, face and ears */}
    <path d="M-85 -78 L-65 -42 L-31 -54 L-39 -91Z" fill="#d27a43" />
    <ellipse cx="-73" cy="-103" rx="62" ry="66" fill="#a64f32" />
    <ellipse cx="-74" cy="-108" rx="53" ry="57" fill="#d9864d" />
    <ellipse cx="-119" cy="-103" rx="17" ry="24" fill="#bd623e" />
    <ellipse cx="-121" cy="-103" rx="8" ry="13" fill="#f2a16d" />
    <ellipse cx="-27" cy="-102" rx="16" ry="23" fill="#bd623e" />
    <ellipse cx="-27" cy="-102" rx="8" ry="12" fill="#f2a16d" />
    <ellipse cx="-72" cy="-77" rx="36" ry="26" fill="#f3b079" />
    <ellipse cx="-89" cy="-108" rx="14" ry="19" fill="#fff8e9" />
    <ellipse cx="-50" cy="-108" rx="14" ry="19" fill="#fff8e9" />
    <ellipse cx="-86" cy="-106" rx="8" ry="12" fill="#33221e" />
    <ellipse cx="-47" cy="-106" rx="8" ry="12" fill="#33221e" />
    <circle cx="-83" cy="-111" r="3.5" fill="white" /><circle cx="-44" cy="-111" r="3.5" fill="white" />
    <path d="M-72 -99 Q-60 -86 -72 -77 Q-82 -71 -92 -79" fill="none" stroke="#a94d36" strokeWidth="4" strokeLinecap="round" />
    <path d="M-98 -68 Q-73 -48 -48 -68" fill="none" stroke="#9e3d2e" strokeWidth="5" strokeLinecap="round" />
    <path d="M-95 -64 Q-73 -53 -51 -64" fill="none" stroke="#fff0ce" strokeWidth="3" strokeLinecap="round" />
    {/* crown with layered gold, jewels and tilak */}
    <path d="M-126 -143 L-133 -175 L-111 -164 L-99 -197 L-77 -173 L-58 -207 L-40 -170 L-20 -179 L-24 -143 Q-73 -127 -126 -143Z" fill="#ffbf2e" stroke="#df8418" strokeWidth="6" strokeLinejoin="round" />
    <path d="M-119 -146 Q-73 -165 -29 -146 L-35 -132 Q-72 -144 -113 -132Z" fill="#ffdc63" />
    <path d="M-91 -178 L-77 -194 L-64 -178" fill="#ffdf6a" stroke="#e48b1d" strokeWidth="4" />
    <ellipse cx="-72" cy="-151" rx="10" ry="13" fill="#e94342" stroke="#fff0a6" strokeWidth="4" />
    <path d="M-73 -132 L-73 -103" stroke="#fff0c4" strokeWidth="6" strokeLinecap="round" />
    <path d="M-80 -130 L-73 -118 L-66 -130" fill="#d83d36" />
    {/* earrings, armlets and necklaces */}
    <circle cx="-123" cy="-78" r="11" fill="none" stroke="#ffc83f" strokeWidth="7" />
    <path d="M-109 -49 Q-69 -17 -34 -49" fill="none" stroke="#ffca3f" strokeWidth="9" strokeLinecap="round" />
    <path d="M-104 -44 Q-70 -1 -39 -44" fill="none" stroke="#f5d56b" strokeWidth="6" strokeLinecap="round" />
    <path d="M-87 -24 L-72 -8 L-57 -24 L-72 -40Z" fill="#e7473d" stroke="#ffc83f" strokeWidth="6" />
    <path d="M-129 -21 L-113 -15 M-18 -48 L-4 -43" stroke="#ffc83f" strokeWidth="11" strokeLinecap="round" />
    <circle cx="-112" cy="0" r="10" fill="#ffca3f" /><circle cx="-4" cy="-17" r="10" fill="#ffca3f" />
  </motion.g>;
}

function IllustratedWorld({ index }: { index: number }) {
  const chapter = chapterFor(index);
  return <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={`Animated devotional illustration: ${chapter.title}`}>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={chapter.sky[0]} /><stop offset="1" stopColor={chapter.sky[1]} /></linearGradient>
      <radialGradient id="halo"><stop offset="0" stopColor="#fff7c6" stopOpacity=".98" /><stop offset=".62" stopColor="#fff4c5" stopOpacity=".55" /><stop offset="1" stopColor="#fff4c5" stopOpacity="0" /></radialGradient>
      <linearGradient id="saffron" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffd04d" /><stop offset="1" stopColor="#f28a19" /></linearGradient>
    </defs>
    <rect width="1440" height="900" fill="url(#sky)" />
    <circle cx="730" cy="330" r="255" fill="url(#halo)" />
    <motion.circle cx="730" cy="330" r="170" fill="none" stroke="#fff8da" strokeWidth="2" opacity=".55" animate={{ r: [160, 190, 160], opacity: [.3, .65, .3] }} transition={{ duration: 6, repeat: Infinity }} />
    <Cloud x={130} y={130} scale={1.2} color="#9fc6ee" delay={1} /><Cloud x={300} y={180} scale={.72} color="#ffc78f" delay={3} />
    <Cloud x={1160} y={130} scale={1.05} color="#ffa88f" delay={2} /><Cloud x={1260} y={220} scale={.58} color="#8ecad9" delay={4} />
    <path d="M0 555 Q230 490 430 560 T850 550 T1440 520 L1440 900 L0 900Z" fill="#fff5e7" opacity=".46" />
    {chapter.world === "mountain" && <g><path d="M0 700 L180 500 L300 625 L470 430 L630 660 L790 485 L1000 680 L1200 490 L1440 670 V900 H0Z" fill="#7cae9e" opacity=".55" /><path d="M380 534 L470 430 L550 555 L492 528 L470 548 L449 524Z" fill="#fff5e7" opacity=".9" /><path d="M1090 600 L1200 490 L1302 605 L1230 573 L1200 590 L1174 566Z" fill="#fff5e7" opacity=".9" /></g>}
    {chapter.world === "temple" && <g fill="#d99a61" opacity=".38"><path d="M70 760 V625 H135 V575 H170 V625 H235 V760Z" /><path d="M45 625 L152 550 L260 625Z" /><path d="M1180 760 V630 H1240 V580 H1275 V630 H1340 V760Z" /><path d="M1150 630 L1260 555 L1370 630Z" /></g>}
    {chapter.world === "ocean" && <g fill="none" stroke="#76bdc8" strokeWidth="8" opacity=".5"><path d="M0 665 Q90 635 180 665 T360 665 T540 665 T720 665 T900 665 T1080 665 T1260 665 T1440 665" /><path d="M0 720 Q90 690 180 720 T360 720 T540 720 T720 720 T900 720 T1080 720 T1260 720 T1440 720" /></g>}
    {chapter.world === "forest" && <g fill="#4c9b7f" opacity=".4">{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 155 - 20} 780 l55 -160 l55 160Z`} />)}</g>}
    <motion.g animate={{ x: [-5, 5, -5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}><FlyingHanuman /></motion.g>
    <g fill="#f4a34e" opacity=".9"><circle cx="500" cy="280" r="7" /><circle cx="965" cy="270" r="5" /><circle cx="1050" cy="520" r="7" /><circle cx="350" cy="480" r="5" /></g>
    <g fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".8"><path d="M235 405 Q310 450 374 400 Q340 465 260 460" /><path d="M980 560 Q1055 500 1100 525 Q1060 565 1030 585" /></g>
    <path d="M0 785 Q200 730 400 790 T800 780 T1200 770 T1440 790 V900 H0Z" fill="#e6a2a0" opacity=".52" />
    <Cloud x={70} y={780} scale={1.65} color="#83c8d6" delay={2} /><Cloud x={1240} y={800} scale={1.9} color="#ff9f9f" delay={1} />
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
      <div className="absolute inset-0" style={{ opacity: paused ? .92 : 1 }}><IllustratedWorld index={activeIndex} /></div>
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
