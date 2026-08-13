/* Quiet Indian Manuscript direction: reading-first layout, warm paper, diya saffron, ink-blue type, restrained devotional motion. */
import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, ChevronDown, Copy, Languages, Minus, Music2, Pause, Play, Plus, Share2, SkipBack, SkipForward, Sparkles, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { verses, verseCount } from "@/lib/hanumanChalisa";
import Sanscript from "@indic-transliteration/sanscript";

const languages = [
  { id: "hi", label: "हिन्दी", native: "देवनागरी", note: "मूल पाठ" },
  { id: "en", label: "English", native: "Latin", note: "Translation" },
  { id: "mr", label: "मराठी", native: "देवनागरी", note: "Regional script" },
  { id: "bn", label: "বাংলা", native: "বাংলা", note: "Regional script" },
  { id: "ta", label: "தமிழ்", native: "தமிழ்", note: "Regional script" },
  { id: "te", label: "తెలుగు", native: "తెలుగు", note: "Regional script" },
  { id: "gu", label: "ગુજરાતી", native: "ગુજરાતી", note: "Regional script" },
  { id: "kn", label: "ಕನ್ನಡ", native: "ಕನ್ನಡ", note: "Regional script" },
  { id: "ml", label: "മലയാളം", native: "മലയാളം", note: "Regional script" },
  { id: "pa", label: "ਪੰਜਾਬੀ", native: "ਗੁਰਮੁਖੀ", note: "Regional script" },
  { id: "roman", label: "Romanized", native: "Latin", note: "उच्चारण" },
];

export default function Home() {
  const [language, setLanguage] = useState("hi");
  const [fontSize, setFontSize] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [showLanguages, setShowLanguages] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0);
  const [audioRate, setAudioRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const continueRef = useRef(false);
  const activeLanguage = languages.find((item) => item.id === language) ?? languages[0];

  const getText = (verse: typeof verses[number]) => {
    if (language === "en") return verse.en;
    if (language === "roman") return verse.roman;
    const schemes: Record<string, string> = { bn: "bengali", ta: "tamil", te: "telugu", gu: "gujarati", kn: "kannada", ml: "malayalam", pa: "gurmukhi" };
    return schemes[language] ? Sanscript.t(verse.hi, "devanagari", schemes[language]) : verse.hi;
  };

  const displayVerses = useMemo(() => verses, []);

  const speakVerse = (index: number) => {
    if (!("speechSynthesis" in window)) {
      toast("Hindi audio is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(verses[index].hi);
    utterance.lang = "hi-IN";
    utterance.rate = audioRate;
    utterance.pitch = 1;
    utterance.onstart = () => { setAudioIndex(index); setIsSpeaking(true); };
    utterance.onend = () => {
      if (continueRef.current && index < verses.length - 1) {
        speakVerse(index + 1);
      } else {
        continueRef.current = false;
        setIsSpeaking(false);
      }
    };
    utterance.onerror = () => { continueRef.current = false; setIsSpeaking(false); };
    utteranceRef.current = utterance;
    setAudioIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const togglePlayback = () => {
    if (!("speechSynthesis" in window)) { toast("Hindi audio is not supported in this browser."); return; }
    if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); setIsSpeaking(true); return; }
    if (isSpeaking) { window.speechSynthesis.pause(); setIsSpeaking(false); return; }
    continueRef.current = true;
    speakVerse(audioIndex);
  };

  const stopPlayback = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    continueRef.current = false;
    setIsSpeaking(false);
  };

  const moveAudio = (direction: number) => {
    const next = Math.min(verses.length - 1, Math.max(0, audioIndex + direction));
    continueRef.current = true;
    speakVerse(next);
  };

  useEffect(() => {
    const active = document.querySelector(`[data-verse-index="${audioIndex}"]`);
    if (isSpeaking && active) active.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [audioIndex, isSpeaking]);

  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  const toggleSaved = (index: number) => {
    setSaved((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
    toast(saved.includes(index) ? "Verse removed from your quiet shelf." : "Verse saved to your quiet shelf.");
  };

  const copyPage = async () => {
    await navigator.clipboard?.writeText(verses.map((verse) => verse.hi).join("\\n\\n"));
    toast("Hindi Chalisa copied to your clipboard.");
  };

  return (
    <div className="min-h-screen bg-[#f4efe5] text-[#182c3c] selection:bg-[#f0c8a3] selection:text-[#182c3c]">
      <header className="relative z-20 border-b border-[#d9cbb8]/70 bg-[#f8f4eb]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <a href="#top" className="group flex items-center gap-3" aria-label="Hanuman Chalisa home">
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-[#d96b2b]/35 bg-[#fff9ee] shadow-[0_6px_18px_rgba(119,70,37,0.08)]"><img src="/manus-storage/hanuman-mark_da3fe331.png" alt="Chalisa emblem" className="h-8 w-8 object-contain" />
              
              
            </span>
            <span className="leading-none"><span className="block font-serif text-lg font-bold tracking-tight text-[#263d4d]">Chalisa</span><span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a66d4d]">हनुमान · prayer book</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#56656c] md:flex"><a href="#read" className="transition-colors hover:text-[#a94725]">Read</a><a href="#about" className="transition-colors hover:text-[#a94725]">About the prayer</a><button onClick={() => toast("Audio guide is coming soon.")} className="inline-flex items-center gap-2 transition-colors hover:text-[#a94725]"><Volume2 className="h-4 w-4" /> Listen</button></nav>
          <button onClick={() => setShowLanguages((value) => !value)} className="relative inline-flex items-center gap-2 rounded-full border border-[#cdbda9] bg-[#fffaf1] px-3.5 py-2 text-sm font-semibold text-[#344c58] shadow-sm transition hover:border-[#d96b2b]/60 hover:text-[#a94725] active:scale-[0.97]"><Languages className="h-4 w-4 text-[#d96b2b]" /> {activeLanguage.label} <ChevronDown className="h-3.5 w-3.5" />
            {showLanguages && <div className="absolute right-0 top-12 z-30 w-56 rounded-2xl border border-[#dbcdbb] bg-[#fffaf1] p-2 text-left shadow-[0_20px_60px_rgba(87,53,30,0.18)]"><p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a66d4d]">Choose a language</p>{languages.map((item) => <button key={item.id} onClick={() => { setLanguage(item.id); setShowLanguages(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${language === item.id ? "bg-[#f2dfcd] text-[#9f4223]" : "text-[#3e5159] hover:bg-[#f6ede2]"}`}><span className="font-medium">{item.label}</span><span className="text-xs text-[#8c8277]">{item.note}</span></button>)}</div>}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b border-[#d9cbb8] bg-[#f4efe5] text-[#243b49]">
          <div className="absolute inset-0 bg-[url('/manus-storage/hanuman-hero_0796f0c9.png')] bg-cover bg-center opacity-35 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f4efe5]/95 via-[#f4efe5]/55 to-transparent" />
          <div className="relative mx-auto grid min-h-[550px] max-w-7xl items-center px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-28">
            <div className="max-w-xl animate-[rise_700ms_cubic-bezier(.23,1,.32,1)_both]">
              <div className="mb-8 flex items-center gap-3 text-[#b45a31]"><span className="h-px w-10 bg-[#d96b2b]" /><span className="text-xs font-bold uppercase tracking-[0.32em]">A daily prayer in every tongue</span></div>
              <p className="mb-4 font-serif text-xl text-[#a94725]">श्री हनुमान चालीसा</p>
              <h1 className="max-w-lg font-serif text-5xl font-semibold leading-[0.97] tracking-[-0.04em] text-[#243b49] sm:text-7xl">Keep this prayer<br /><em className="font-normal text-[#b45a31]">close.</em></h1>
              <p className="mt-7 max-w-md text-base leading-7 text-[#687577]">Read the Hanuman Chalisa in Hindi, or find the words in the language that feels most like home.</p>
              <div className="mt-9 flex flex-wrap items-center gap-3"><a href="#read" className="inline-flex items-center gap-2 rounded-full bg-[#d96b2b] px-5 py-3 text-sm font-bold text-[#fffaf1] shadow-[0_8px_25px_rgba(217,107,43,0.3)] transition hover:-translate-y-0.5 hover:bg-[#e27b3a] active:scale-[0.97]">Begin reading <Sparkles className="h-4 w-4" /></a><button onClick={togglePlayback} className="inline-flex items-center gap-2 rounded-full border border-[#cdbda9] bg-[#fffaf1] px-5 py-3 text-sm font-bold text-[#52656b] transition hover:bg-[#fffaf1]/20 active:scale-[0.97]">{isSpeaking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {isSpeaking ? "Pause recitation" : "Listen to the prayer"}</button></div>
            </div>
            <div className="hidden lg:block" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f4efe5] to-transparent opacity-80" />
        </section>

        <section id="read" className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#d7caba] pb-8 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-3 text-[#b45a31]"><span className="text-lg">✦</span><span className="text-xs font-bold uppercase tracking-[0.28em]">The reading desk</span></div><h2 className="font-serif text-4xl font-semibold tracking-[-0.03em] text-[#243b49] sm:text-5xl">Hanuman Chalisa</h2><p className="mt-2 text-sm text-[#6d787a]">{activeLanguage.note} · {verseCount} chaupais</p>{!['hi','en','roman'].includes(language) && <p className="mt-2 max-w-xl text-xs leading-5 text-[#9a8f82]">This edition keeps the complete canonical text while the regional-script translation is being editorially verified. Source edition: Vaidika Vignanam.</p>}</div><div className="flex items-center gap-2"><button onClick={() => setFontSize(Math.max(.88, fontSize - .08))} aria-label="Decrease text size" className="grid h-9 w-9 place-items-center rounded-full border border-[#cdbda9] bg-[#fffaf1] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><Minus className="h-4 w-4" /></button><span className="min-w-12 text-center text-xs font-bold text-[#6d787a]">Aa</span><button onClick={() => setFontSize(Math.min(1.22, fontSize + .08))} aria-label="Increase text size" className="grid h-9 w-9 place-items-center rounded-full border border-[#cdbda9] bg-[#fffaf1] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><Plus className="h-4 w-4" /></button><button onClick={copyPage} aria-label="Copy Hindi text" className="ml-2 grid h-9 w-9 place-items-center rounded-full border border-[#cdbda9] bg-[#fffaf1] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><Copy className="h-4 w-4" /></button></div></div>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="max-w-3xl">
              {displayVerses.map((verse, index) => <article key={index} data-verse-index={index} className={`group relative border-b border-[#dfd2c2] py-7 first:pt-0 ${index === 0 || index === displayVerses.length - 1 ? "bg-[#fbf7ef]/45" : ""} ${isSpeaking && audioIndex === index && language === "hi" ? "bg-[#f3dfcb]/70" : ""}`}><div className="flex gap-5"><span className="mt-1 w-8 shrink-0 font-serif text-sm font-bold text-[#b87452]">{verse.n}</span><div className="min-w-0 flex-1"><p style={{ fontSize: `${fontSize}rem` }} className={`whitespace-pre-line font-serif leading-[1.8] ${language === "hi" || language === "roman" ? "text-[#203c4d]" : "text-[#344c58]"}`}>{getText(verse)}</p>{language === "hi" && <p className="mt-3 whitespace-pre-line text-xs leading-6 text-[#9a8f82]">{verse.roman}</p>}</div><button onClick={() => toggleSaved(index)} aria-label={saved.includes(index) ? "Remove bookmark" : "Save verse"} className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${saved.includes(index) ? "bg-[#f1d4bd] text-[#a94725]" : "text-[#bcae9d] opacity-0 group-hover:opacity-100 hover:bg-[#f1e4d7] hover:text-[#a94725]"}`}><Bookmark className="h-4 w-4" fill={saved.includes(index) ? "currentColor" : "none"} /></button></div></article>)}
            </div>
            <aside className="h-fit lg:sticky lg:top-8">
              <div className="border-y border-[#d8c7b4] bg-[#fffaf1]/70 p-6"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b45a31]">A small ritual</p><div className="mt-5 border-y border-[#e0d1bf] py-4"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c787a]">Hindi recitation</span><span className="font-serif text-sm text-[#b45a31]">{audioIndex === 0 ? "Opening doha" : audioIndex <= 40 ? `Verse ${audioIndex}` : "Closing doha"}</span></div><div className="mt-4 flex items-center gap-2"><button onClick={() => moveAudio(-1)} aria-label="Previous verse" className="grid h-8 w-8 place-items-center rounded-full border border-[#cdbda9] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><SkipBack className="h-3.5 w-3.5" /></button><button onClick={togglePlayback} aria-label={isSpeaking ? "Pause recitation" : "Play recitation"} className="grid h-10 w-10 place-items-center rounded-full bg-[#d96b2b] text-[#fffaf1] shadow-[0_6px_16px_rgba(217,107,43,0.22)] transition hover:bg-[#e27b3a] active:scale-[0.96]">{isSpeaking ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}</button><button onClick={stopPlayback} aria-label="Stop recitation" className="grid h-8 w-8 place-items-center rounded-full border border-[#cdbda9] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><Square className="h-3 w-3" fill="currentColor" /></button><button onClick={() => moveAudio(1)} aria-label="Next verse" className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-[#cdbda9] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><SkipForward className="h-3.5 w-3.5" /></button></div><div className="mt-4 h-1 overflow-hidden rounded-full bg-[#e8ddcf]"><div className="h-full bg-[#d96b2b] transition-[width] duration-200" style={{ width: `${((audioIndex + 1) / verses.length) * 100}%` }} /></div><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-[#9a8f82]">Verse {Math.min(audioIndex + 1, verses.length)} of {verses.length}</span><select value={audioRate} onChange={(event) => setAudioRate(Number(event.target.value))} aria-label="Playback speed" className="bg-transparent text-[11px] font-bold text-[#a94725] outline-none"><option value={0.8}>0.8×</option><option value={1}>1×</option><option value={1.2}>1.2×</option></select></div></div><h3 className="mt-3 font-serif text-2xl font-semibold text-[#294454]">Read it your way.</h3><p className="mt-3 text-sm leading-6 text-[#6c787a]">Choose a script, settle into the rhythm, and let the words take their own time.</p><div className="mt-6 space-y-3"><button onClick={togglePlayback} className="flex w-full items-center justify-between rounded-2xl bg-[#f1e2d3] px-4 py-3 text-left text-sm font-semibold text-[#994321] transition hover:bg-[#ecd5c2]"><span className="flex items-center gap-3"><Music2 className="h-4 w-4" /> {isSpeaking ? "Pause audio" : "Listen softly"}</span><span className="text-xs text-[#b4775a]">Soon</span></button><button onClick={() => toast(saved.length ? `${saved.length} verse${saved.length > 1 ? "s" : ""} saved.` : "Tap a bookmark beside any verse to save it.")} className="flex w-full items-center justify-between rounded-2xl border border-[#ddcdbb] px-4 py-3 text-left text-sm font-semibold text-[#4b6067] transition hover:border-[#d96b2b] hover:text-[#a94725]"><span className="flex items-center gap-3"><Bookmark className="h-4 w-4" /> Quiet shelf</span><span className="text-xs text-[#9b8e81]">{saved.length}</span></button></div></div>
              <div className="relative mt-7 border-l-2 border-[#d96b2b] pl-5 before:absolute before:-left-[7px] before:-top-1 before:h-3 before:w-3 before:rounded-full before:border-2 before:border-[#f4efe5] before:bg-[#d96b2b]"><p className="font-serif text-lg italic leading-7 text-[#5b676a]">“जहाँ सुमिरन करि हनुमत, मंगल होय अपार।”</p><p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#aa765a]">Remembering brings auspiciousness</p></div>
            </aside>
          </div>
        </section>

        <section id="about" className="border-t border-[#d9cbb8] bg-[#ece3d5] px-5 py-16 lg:px-10"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center"><div className="overflow-hidden rounded-[2rem] bg-[#3c3030] shadow-[0_20px_60px_rgba(87,53,30,0.14)]"><img src="/manus-storage/hanuman-meditation_48d74d5b.png" alt="A devotional illustration of Hanuman in prayer" className="h-full w-full object-cover" /></div><div className="max-w-xl"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b45a31]">About this prayer</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#263f4d]">A prayer carried<br /><em className="font-normal text-[#ad512a]">across generations.</em></h2><p className="mt-5 text-base leading-8 text-[#627176]">The Hanuman Chalisa is a devotional hymn of forty verses in praise of Hanuman. This small reading space is made for returning: before the day begins, after it ends, or whenever a steady word is needed.</p><div className="mt-7 flex flex-wrap gap-3"><span className="rounded-full border border-[#cdbda9] bg-[#f6eee4] px-4 py-2 text-xs font-bold text-[#5e6c6d]">Hindi first</span><span className="rounded-full border border-[#cdbda9] bg-[#f6eee4] px-4 py-2 text-xs font-bold text-[#5e6c6d]">11 languages</span><span className="rounded-full border border-[#cdbda9] bg-[#f6eee4] px-4 py-2 text-xs font-bold text-[#5e6c6d]">Made for quiet reading</span></div></div></div></section>
      </main>
      <footer className="border-t border-[#d9cbb8] bg-[#f8f4eb] px-5 py-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-[#7f8580] sm:flex-row sm:items-center"><p>श्री हनुमते नमः · With reverence, for every home.</p><div className="flex items-center gap-5"><button onClick={() => toast("Share link copied soon.")} className="inline-flex items-center gap-2 hover:text-[#a94725]"><Share2 className="h-3.5 w-3.5" /> Share</button><span>Chalisa · 2026</span></div></div></footer>
    </div>
  );
}
