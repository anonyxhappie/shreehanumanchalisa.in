/* Quiet Indian Manuscript direction: reading-first layout, warm paper, diya saffron, ink-blue type, restrained devotional motion. */
import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, ChevronDown, Copy, Download, Languages, Mail, MessageCircle, Minus, Music2, Pause, Play, Plus, Share2, SkipBack, SkipForward, Sparkles, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { verses, verseCount } from "@/lib/hanumanChalisa";
import { marathiMeanings } from "@/lib/marathiChalisa";
import Sanscript from "@indic-transliteration/sanscript";

const assetUrl = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;

const audioSources: Record<string, string> = {
  hi: assetUrl("hanuman-chalisa-hindi-recitation.mp3"),
  roman: assetUrl("hanuman-chalisa-hindi-recitation.mp3"),
  en: assetUrl("hanuman-chalisa-en.mp3"),
  mr: assetUrl("hanuman-chalisa-mr.mp3"),
  bn: assetUrl("hanuman-chalisa-bn.mp3"),
  ta: assetUrl("hanuman-chalisa-ta.mp3"),
  te: assetUrl("hanuman-chalisa-te.mp3"),
  gu: assetUrl("hanuman-chalisa-gu.mp3"),
  kn: assetUrl("hanuman-chalisa-kn.mp3"),
  ml: assetUrl("hanuman-chalisa-ml.mp3"),
  pa: assetUrl("hanuman-chalisa-pa.mp3"),
};

const correctionAudioSources: Record<string, string> = {
  hi: assetUrl("hanuman-correction-hi.mp3"), roman: assetUrl("hanuman-correction-roman.mp3"), en: assetUrl("hanuman-correction-en.mp3"), mr: assetUrl("hanuman-correction-mr.mp3"), bn: assetUrl("hanuman-correction-bn.mp3"), ta: assetUrl("hanuman-correction-ta.mp3"), te: assetUrl("hanuman-correction-te.mp3"), gu: assetUrl("hanuman-correction-gu.mp3"), kn: assetUrl("hanuman-correction-kn.mp3"), ml: assetUrl("hanuman-correction-ml.mp3"), pa: assetUrl("hanuman-correction-pa.mp3"),
};

const audioDurations: Record<string, number> = { hi: 269.48, roman: 269.48, en: 257.92, mr: 262.4, bn: 289.4, ta: 326.08, te: 319.68, gu: 226.92, kn: 222.64, ml: 311.12, pa: 239.24 };

const track = (event: string, data?: Record<string, string | number>) => {
  if (typeof window === "undefined" || window.localStorage.getItem("chalisa-analytics") === "off") return;
  const analytics = (window as Window & { umami?: { track: (name: string, payload?: Record<string, string | number>) => void } }).umami;
  analytics?.track(event, data);
};

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

const feedbackTemplates = [
  { label: "Translation correction", title: "Translation correction", body: "Language: [choose a language]\nVerse or section: [add verse]\nSuggested correction:\nSource or context:" },
  { label: "Audio correction", title: "Audio correction", body: "Language: [choose a language]\nTimestamp or verse: [add timestamp]\nWhat needs attention:" },
  { label: "Feature suggestion", title: "Feature suggestion", body: "What would make the daily reading experience better?" },
];

const languages = [
  { id: "hi", label: "हिन्दी", native: "देवनागरी", note: "मूल पाठ" },
  { id: "en", label: "English", native: "Latin", note: "Translation" },
  { id: "mr", label: "मराठी", native: "देवनागरी", note: "Marathi meaning" },
  { id: "bn", label: "বাংলা", native: "বাংলা", note: "Regional script" },
  { id: "ta", label: "தமிழ்", native: "தமிழ்", note: "Regional script" },
  { id: "te", label: "తెలుగు", native: "తెలుగు", note: "Regional script" },
  { id: "gu", label: "ગુજરાતી", native: "ગુજરાતી", note: "Regional script" },
  { id: "kn", label: "ಕನ್ನಡ", native: "ಕನ್ನಡ", note: "Regional script" },
  { id: "ml", label: "മലയാളം", native: "മലയാളം", note: "Regional script" },
  { id: "pa", label: "ਪੰਜਾਬੀ", native: "ਗੁਰਮੁਖੀ", note: "Regional script" },
  { id: "roman", label: "Romanized", native: "Latin", note: "उच्चारण" },
];

const languageSeo: Record<string, { htmlLang: string; title: string; description: string; locale: string }> = {
  hi: { htmlLang: "hi", title: "Hanuman Chalisa in Hindi | श्री हनुमान चालीसा", description: "पूरी हनुमान चालीसा हिंदी में पढ़ें और सुनें, अर्थ, रोमन उच्चारण, सिंक्रोनाइज़्ड ऑडियो और ऑफलाइन सुविधा के साथ।", locale: "hi_IN" },
  en: { htmlLang: "en", title: "Hanuman Chalisa in English with Meaning | Shree Hanuman Chalisa", description: "Read the complete Hanuman Chalisa with English meaning, synchronized recitation, transliteration, and offline support.", locale: "en_IN" },
  mr: { htmlLang: "mr", title: "हनुमान चालीसा मराठीत अर्थासह | Shree Hanuman Chalisa", description: "हनुमान चालीसा मराठी अर्थासह वाचा आणि ऐका. हिंदी, रोमन उच्चारण आणि इतर भारतीय भाषाही उपलब्ध आहेत.", locale: "mr_IN" },
  bn: { htmlLang: "bn", title: "হনুমান চালিসা বাংলায় | Shree Hanuman Chalisa", description: "বাংলা লিপিতে সম্পূর্ণ হনুমান চালিসা পড়ুন ও শুনুন, সঙ্গে সিঙ্ক্রোনাইজড পাঠ এবং অফলাইন সুবিধা।", locale: "bn_IN" },
  ta: { htmlLang: "ta", title: "அனுமன் சாலிசா தமிழில் | Shree Hanuman Chalisa", description: "தமிழில் முழுமையான அனுமன் சாலிசாவை வாசித்து கேளுங்கள்; ஒத்திசைக்கப்பட்ட பாராயணம் மற்றும் ஆஃப்லைன் வசதியுடன்.", locale: "ta_IN" },
  te: { htmlLang: "te", title: "హనుమాన్ చాలీసా తెలుగులో | Shree Hanuman Chalisa", description: "తెలుగులో పూర్తి హనుమాన్ చాలీసాను చదవండి, వినండి; సమకాలీకరించిన ఆడియో మరియు ఆఫ్‌లైన్ పఠనంతో.", locale: "te_IN" },
  gu: { htmlLang: "gu", title: "હનુમાન ચાલીસા ગુજરાતીમાં | Shree Hanuman Chalisa", description: "ગુજરાતીમાં સંપૂર્ણ હનુમાન ચાલીસા વાંચો અને સાંભળો, અર્થ અને સિંક્રનાઇઝ્ડ ઓડિયો સાથે.", locale: "gu_IN" },
  kn: { htmlLang: "kn", title: "ಹನುಮಾನ್ ಚಾಲೀಸಾ ಕನ್ನಡದಲ್ಲಿ | Shree Hanuman Chalisa", description: "ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ ಸಂಪೂರ್ಣ ಹನುಮಾನ್ ಚಾಲೀಸಾವನ್ನು ಓದಿ ಮತ್ತು ಆಲಿಸಿ, ಸಿಂಕ್ರೊನೈಸ್ ಮಾಡಿದ ಪಠಣದೊಂದಿಗೆ.", locale: "kn_IN" },
  ml: { htmlLang: "ml", title: "ഹനുമാൻ ചാലിസ മലയാളത്തിൽ | Shree Hanuman Chalisa", description: "മലയാളത്തിൽ പൂർണ്ണ ഹനുമാൻ ചാലിസ വായിക്കുകയും കേൾക്കുകയും ചെയ്യുക, സമന്വയിപ്പിച്ച ഓഡിയോയോടൊപ്പം.", locale: "ml_IN" },
  pa: { htmlLang: "pa", title: "ਹਨੂਮਾਨ ਚਾਲੀਸਾ ਪੰਜਾਬੀ ਵਿੱਚ | Shree Hanuman Chalisa", description: "ਪੰਜਾਬੀ ਲਿਪੀ ਵਿੱਚ ਪੂਰੀ ਹਨੂਮਾਨ ਚਾਲੀਸਾ ਪੜ੍ਹੋ ਅਤੇ ਸੁਣੋ, ਸਮਕਾਲੀ ਆਡੀਓ ਪਾਠ ਦੇ ਨਾਲ।", locale: "pa_IN" },
  roman: { htmlLang: "en-Latn", title: "Hanuman Chalisa Romanized for Easy Pronunciation", description: "Read the complete Hanuman Chalisa in Romanized Hindi for pronunciation, with Hindi text, meanings, and recorded audio.", locale: "en_IN" },
};

export default function Home() {
  const [language, setLanguage] = useState("hi");
  const [fontSize, setFontSize] = useState(1);

  const [saved, setSaved] = useState<number[]>([]);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0);
  const [audioRate, setAudioRate] = useState(1.5);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(audioDurations.hi);
  const [feedbackChoice, setFeedbackChoice] = useState<string | null>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(() => typeof window === "undefined" || window.localStorage.getItem("chalisa-analytics") !== "off");
  const [shareIndex, setShareIndex] = useState<number | null>(null);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== "undefined" && !navigator.onLine);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const correctionAudioRef = useRef<HTMLAudioElement | null>(null);
  const [correctionPlaying, setCorrectionPlaying] = useState(false);
  const activeLanguage = languages.find((item) => item.id === language) ?? languages[0];
  const audioSrc = audioSources[language] ?? audioSources.hi;
  const correctionAudioSrc = correctionAudioSources[language] ?? correctionAudioSources.hi;
  const feedbackTemplate = feedbackTemplates.find((item) => item.label === feedbackChoice) ?? feedbackTemplates[2];
  const feedbackHref = `https://github.com/anonyxhappie/shreehanumanchalisa.in/issues/new?title=${encodeURIComponent(feedbackTemplate.title)}&body=${encodeURIComponent(feedbackTemplate.body)}`;

  const getText = (verse: typeof verses[number]) => {
    if (language === "en") return verse.en;
    if (language === "mr") return marathiMeanings[verses.indexOf(verse)] ?? verse.hi;
    if (language === "roman") return verse.roman;
    const schemes: Record<string, string> = { bn: "bengali", ta: "tamil", te: "telugu", gu: "gujarati", kn: "kannada", ml: "malayalam", pa: "gurmukhi" };
    return schemes[language] ? Sanscript.t(verse.hi, "devanagari", schemes[language]) : verse.hi;
  };

  const displayVerses = useMemo(() => verses, []);

  const getVerseWeights = () => verses.map((verse, index) => Math.max((language === "mr" ? (marathiMeanings[index] ?? verse.hi) : language === "en" ? verse.en : verse.hi).replace(/\s/g, "").length, 1));

  const getVerseTimings = () => {
    const weights = getVerseWeights();
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let cursor = 0;
    return weights.map((weight) => {
      const start = (cursor / totalWeight) * audioDuration;
      cursor += weight;
      return { start, end: (cursor / totalWeight) * audioDuration };
    });
  };

  const getVerseIndexAtTime = (time: number) => {
    const timings = getVerseTimings();
    return Math.max(0, timings.findIndex((timing, index) => time <= timing.end || index === timings.length - 1));
  };

  const onAudioTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioTime(audio.currentTime);
    setAudioIndex(getVerseIndexAtTime(audio.currentTime));
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      track("recitation_play", { language });
      audio.play().catch(() => toast(`Tap play again to begin the ${activeLanguage.label} recitation.`));
    } else audio.pause();
  };

  const playCorrection = () => {
    const correction = correctionAudioRef.current;
    if (!correction) return;
    audioRef.current?.pause();
    correction.currentTime = 0;
    correction.play().catch(() => toast("Tap again to hear the corrected verse."));
  };

  const stopPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setAudioTime(0);
    setAudioIndex(0);
  };

  const moveAudio = (direction: number) => {
    const next = Math.min(verses.length - 1, Math.max(0, audioIndex + direction));
    const timings = getVerseTimings();
    const target = (timings[next]?.start ?? 0) + 0.05;
    if (audioRef.current) { audioRef.current.currentTime = target; audioRef.current.play().catch(() => undefined); }
    setAudioIndex(next);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsSpeaking(true);
    const onPause = () => setIsSpeaking(false);
    const onEnded = () => { setIsSpeaking(false); setAudioIndex(verses.length - 1); };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    const correction = correctionAudioRef.current;
    const onCorrectionPlay = () => setCorrectionPlaying(true);
    const onCorrectionStop = () => setCorrectionPlaying(false);
    correction?.addEventListener("play", onCorrectionPlay);
    correction?.addEventListener("pause", onCorrectionStop);
    correction?.addEventListener("ended", onCorrectionStop);
    return () => { audio.removeEventListener("play", onPlay); audio.removeEventListener("pause", onPause); audio.removeEventListener("ended", onEnded); correction?.removeEventListener("play", onCorrectionPlay); correction?.removeEventListener("pause", onCorrectionStop); correction?.removeEventListener("ended", onCorrectionStop); };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("chalisa-analytics", analyticsEnabled ? "on" : "off");
  }, [analyticsEnabled]);

  useEffect(() => {
    const onInstall = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPromptEvent); };
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("beforeinstallprompt", onInstall); window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setAudioTime(0);
    setAudioIndex(0);
    setIsSpeaking(false);
    setAudioDuration(audioDurations[language] ?? audioDurations.hi);
    audio.load();
  }, [language]);

  useEffect(() => {
    const seo = languageSeo[language] ?? languageSeo.hi;
    document.documentElement.lang = seo.htmlLang;
    document.title = seo.title;
    const setMeta = (selector: string, attribute: string, content: string) => {
      const element = document.head.querySelector<HTMLMetaElement>(selector);
      if (element) element.setAttribute(attribute, content);
    };
    setMeta('meta[name="description"]', "content", seo.description);
    setMeta('meta[property="og:title"]', "content", seo.title);
    setMeta('meta[property="og:description"]', "content", seo.description);
    setMeta('meta[property="og:locale"]', "content", seo.locale);
    setMeta('meta[name="twitter:title"]', "content", seo.title);
    setMeta('meta[name="twitter:description"]', "content", seo.description);
  }, [language]);

  useEffect(() => {
    const active = document.querySelector(`[data-verse-index="${audioIndex}"]`);
    if (isSpeaking && active) active.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [audioIndex, isSpeaking]);
  const toggleSaved = (index: number) => {
    setSaved((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
    toast(saved.includes(index) ? "Verse removed from your quiet shelf." : "Verse saved to your quiet shelf.");
  };

  const copyPage = async () => {
    await navigator.clipboard?.writeText(verses.map((verse) => verse.hi).join("\\n\\n"));
    track("text_copied", { language });
    toast("Hindi Chalisa copied to your clipboard.");
  };

  const shareVerse = async (verse: typeof verses[number], index: number) => {
    setShareIndex(index);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1500;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#f4efe5";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#d96b2b";
    context.fillRect(80, 100, 1040, 8);
    context.fillStyle = "#243b49";
    context.font = "600 46px Georgia, serif";
    context.fillText("Hanuman Chalisa", 80, 190);
    context.fillStyle = "#a94725";
    context.font = "700 28px sans-serif";
    context.fillText(`VERSE ${verse.n}`, 80, 255);
    context.fillStyle = "#203c4d";
    context.font = "48px serif";
    const words = verse.hi.split(" ");
    let line = "";
    let y = 390;
    words.forEach((word) => {
      const candidate = `${line}${line ? " " : ""}${word}`;
      if (context.measureText(candidate).width > 1000) { context.fillText(line, 80, y); line = word; y += 82; } else line = candidate;
    });
    if (line) context.fillText(line, 80, y);
    context.fillStyle = "#667477";
    context.font = "28px sans-serif";
    const meaningWords = verse.en.split(" ");
    let meaningLine = "";
    let meaningY = y + 190;
    meaningWords.forEach((word) => {
      const candidate = `${meaningLine}${meaningLine ? " " : ""}${word}`;
      if (context.measureText(candidate).width > 1000) { context.fillText(meaningLine, 80, meaningY); meaningLine = word; meaningY += 48; } else meaningLine = candidate;
    });
    if (meaningLine) context.fillText(meaningLine, 80, meaningY);
    context.fillStyle = "#a66d4d";
    context.font = "700 24px sans-serif";
    context.fillText("shreehanumanchalisa.in", 80, 1360);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return;
    const file = new File([blob], `hanuman-chalisa-verse-${verse.n}.png`, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) await navigator.share({ title: `Hanuman Chalisa · Verse ${verse.n}`, files: [file] });
    else { const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = file.name; link.click(); URL.revokeObjectURL(link.href); toast("Verse card downloaded."); }
    track("verse_card_shared", { verse: index + 1, language });
    setShareIndex(null);
  };

  const installApp = async () => {
    if (!installPrompt) { toast("To read offline, use your browser’s Add to Home Screen option."); return; }
    await installPrompt.prompt();
    track("pwa_install_prompt", { outcome: (await installPrompt.userChoice).outcome });
    setInstallPrompt(null);
  };

  return (
    <div className="min-h-screen bg-[#f4efe5] text-[#182c3c] selection:bg-[#f0c8a3] selection:text-[#182c3c]">
      <header className="relative z-20 border-b border-[#d9cbb8]/70 bg-[#f8f4eb]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <a href="#top" className="group flex items-center gap-3" aria-label="Hanuman Chalisa home">
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-[#d96b2b]/35 bg-[#fff9ee] shadow-[0_6px_18px_rgba(119,70,37,0.08)]"><img src={assetUrl("hanuman-mark.png")} alt="Chalisa emblem" className="h-8 w-8 object-contain" />
              
              
            </span>
            <span className="leading-none"><span className="block font-serif text-lg font-bold tracking-tight text-[#263d4d]">Chalisa</span><span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a66d4d]">हनुमान · prayer book</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#56656c] md:flex"><a href="#read" className="transition-colors hover:text-[#a94725]">Read</a><a href="#about" className="transition-colors hover:text-[#a94725]">About the prayer</a><a href="#feedback" className="transition-colors hover:text-[#a94725]">Feedback</a><button onClick={() => toast("Audio guide is coming soon.")} className="inline-flex items-center gap-2 transition-colors hover:text-[#a94725]"><Volume2 className="h-4 w-4" /> Listen</button></nav>
          <button onClick={() => setShowLanguages((value) => !value)} className="relative inline-flex items-center gap-2 rounded-full border border-[#cdbda9] bg-[#fffaf1] px-3.5 py-2 text-sm font-semibold text-[#344c58] shadow-sm transition hover:border-[#d96b2b]/60 hover:text-[#a94725] active:scale-[0.97]"><Languages className="h-4 w-4 text-[#d96b2b]" /> {activeLanguage.label} <ChevronDown className="h-3.5 w-3.5" />
            {showLanguages && <div className="absolute right-0 top-12 z-30 w-56 rounded-2xl border border-[#dbcdbb] bg-[#fffaf1] p-2 text-left shadow-[0_20px_60px_rgba(87,53,30,0.18)]"><p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a66d4d]">Choose a language</p>{languages.map((item) => <button key={item.id} onClick={(event) => { event.stopPropagation(); track("language_changed", { language: item.id }); setLanguage(item.id); setShowLanguages(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${language === item.id ? "bg-[#f2dfcd] text-[#9f4223]" : "text-[#3e5159] hover:bg-[#f6ede2]"}`}><span className="font-medium">{item.label}</span><span className="text-xs text-[#8c8277]">{item.note}</span></button>)}</div>}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b border-[#d9cbb8] bg-[#f4efe5] text-[#243b49]">
          <div className="absolute inset-0 bg-[url('/media/hanuman-hero.png')] bg-cover bg-center opacity-35 mix-blend-multiply" />
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

        <section id="read" className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20"><audio ref={audioRef} src={audioSrc} preload="metadata" onTimeUpdate={onAudioTimeUpdate} onLoadedMetadata={(event) => setAudioDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : (audioDurations[language] ?? audioDurations.hi))} /><audio ref={correctionAudioRef} src={correctionAudioSrc} preload="none" />
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#d7caba] pb-8 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-3 text-[#b45a31]"><span className="text-lg">✦</span><span className="text-xs font-bold uppercase tracking-[0.28em]">The reading desk</span></div><h2 className="font-serif text-4xl font-semibold tracking-[-0.03em] text-[#243b49] sm:text-5xl">Hanuman Chalisa</h2><p className="mt-2 text-sm text-[#6d787a]">{activeLanguage.note} · {verseCount} chaupais</p>{!['hi','en','roman','mr'].includes(language) && <p className="mt-2 max-w-xl text-xs leading-5 text-[#9a8f82]">This edition keeps the complete canonical Hanuman Chalisa in the selected script. The audio is a dedicated regional-language recitation; semantic translations are being editorially verified.</p>}{language === 'mr' && <p className="mt-2 max-w-xl text-xs leading-5 text-[#9a8f82]">This is a dedicated Marathi meaning edition, cross-checked against Marathi devotional sources.</p>}</div><div className="flex flex-wrap items-center gap-2"><button onClick={() => { const next = !showMeaning; setShowMeaning(next); track("meaning_toggled", { visible: next ? 1 : 0, language }); }} aria-pressed={showMeaning} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${showMeaning ? "border-[#d96b2b] bg-[#f1e2d3] text-[#994321]" : "border-[#cdbda9] bg-[#fffaf1] text-[#49616a] hover:border-[#d96b2b] hover:text-[#a94725]"}`}>Meaning {showMeaning ? "on" : "off"}</button><button onClick={() => setFontSize(Math.max(.88, fontSize - .08))} aria-label="Decrease text size" className="grid h-9 w-9 place-items-center rounded-full border border-[#cdbda9] bg-[#fffaf1] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><Minus className="h-4 w-4" /></button><span className="min-w-12 text-center text-xs font-bold text-[#6d787a]">Aa</span><button onClick={() => setFontSize(Math.min(1.22, fontSize + .08))} aria-label="Increase text size" className="grid h-9 w-9 place-items-center rounded-full border border-[#cdbda9] bg-[#fffaf1] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><Plus className="h-4 w-4" /></button><button onClick={copyPage} aria-label="Copy Hindi text" className="ml-2 grid h-9 w-9 place-items-center rounded-full border border-[#cdbda9] bg-[#fffaf1] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><Copy className="h-4 w-4" /></button></div></div>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="max-w-3xl">
              {displayVerses.map((verse, index) => <article key={index} data-verse-index={index} className={`group relative border-b border-[#dfd2c2] py-7 first:pt-0 ${index === 0 || index === displayVerses.length - 1 ? "bg-[#fbf7ef]/45" : ""} ${isSpeaking && audioIndex === index ? "bg-[#f3dfcb]/70" : ""}`}><div className="flex gap-5"><span className="mt-1 w-8 shrink-0 font-serif text-sm font-bold text-[#b87452]">{verse.n}</span><div className="min-w-0 flex-1"><p style={{ fontSize: `${fontSize}rem` }} className={`whitespace-pre-line font-serif leading-[1.8] ${language === "hi" || language === "roman" ? "text-[#203c4d]" : "text-[#344c58]"}`}>{getText(verse)}</p>{verse.n === "६" && <button onClick={playCorrection} className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d96b2b]/40 bg-[#fffaf1] px-3 py-2 text-[11px] font-bold text-[#a94725] transition hover:border-[#d96b2b] hover:bg-[#f1e2d3]"><Volume2 className="h-3.5 w-3.5" /> {correctionPlaying ? "Playing corrected line" : "Hear corrected line"}</button>}{showMeaning && <p className="mt-4 max-w-2xl border-l-2 border-[#d96b2b]/55 pl-4 text-sm leading-6 text-[#667477]"><span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#b87452]">Meaning</span>{verse.en}</p>}</div><div className="mt-1 flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100"><button onClick={() => shareVerse(verse, index)} aria-label="Share verse card" className="grid h-8 w-8 place-items-center rounded-full text-[#bcae9d] transition hover:bg-[#f1e4d7] hover:text-[#a94725]">{shareIndex === index ? <Download className="h-4 w-4 animate-pulse" /> : <Share2 className="h-4 w-4" />}</button><button onClick={() => toggleSaved(index)} aria-label={saved.includes(index) ? "Remove bookmark" : "Save verse"} className={`grid h-8 w-8 place-items-center rounded-full transition ${saved.includes(index) ? "bg-[#f1d4bd] text-[#a94725]" : "text-[#bcae9d] hover:bg-[#f1e4d7] hover:text-[#a94725]"}`}><Bookmark className="h-4 w-4" fill={saved.includes(index) ? "currentColor" : "none"} /></button></div></div></article>)}
            </div>
            <aside className="h-fit lg:sticky lg:top-8">
              <div className="border-y border-[#d8c7b4] bg-[#fffaf1]/70 p-6"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b45a31]">A small ritual</p><div className="mt-5 border-y border-[#e0d1bf] py-4"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c787a]">{activeLanguage.label} recitation</span><span className="font-serif text-sm text-[#b45a31]">{audioIndex === 0 ? "Opening doha" : audioIndex <= 40 ? `Verse ${audioIndex}` : "Closing doha"}</span></div><div className="mt-4 flex items-center gap-2"><button onClick={() => moveAudio(-1)} aria-label="Previous verse" className="grid h-8 w-8 place-items-center rounded-full border border-[#cdbda9] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><SkipBack className="h-3.5 w-3.5" /></button><button onClick={togglePlayback} aria-label={isSpeaking ? "Pause recitation" : "Play recitation"} className="grid h-10 w-10 place-items-center rounded-full bg-[#d96b2b] text-[#fffaf1] shadow-[0_6px_16px_rgba(217,107,43,0.22)] transition hover:bg-[#e27b3a] active:scale-[0.96]">{isSpeaking ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}</button><button onClick={stopPlayback} aria-label="Stop recitation" className="grid h-8 w-8 place-items-center rounded-full border border-[#cdbda9] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><Square className="h-3 w-3" fill="currentColor" /></button><button onClick={() => moveAudio(1)} aria-label="Next verse" className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-[#cdbda9] text-[#49616a] transition hover:border-[#d96b2b] hover:text-[#a94725]"><SkipForward className="h-3.5 w-3.5" /></button></div><div className="mt-4 h-1 overflow-hidden rounded-full bg-[#e8ddcf]"><div className="h-full bg-[#d96b2b] transition-[width] duration-200" style={{ width: `${Math.min(100, (audioTime / audioDuration) * 100)}%` }} /></div><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-[#9a8f82]">Verse {Math.min(audioIndex + 1, verses.length)} of {verses.length}</span><select value={audioRate} onChange={(event) => { const rate = Number(event.target.value); setAudioRate(rate); if (audioRef.current) audioRef.current.playbackRate = rate; }} aria-label="Playback speed" className="bg-transparent text-[11px] font-bold text-[#a94725] outline-none"><option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.2}>1.2×</option><option value={1.5}>1.5×</option><option value={2}>2×</option><option value={2.5}>2.5×</option><option value={3}>3×</option></select></div></div><h3 className="mt-3 font-serif text-2xl font-semibold text-[#294454]">Read it your way.</h3><p className="mt-3 text-sm leading-6 text-[#6c787a]">Choose a script, settle into the rhythm, and let the words take their own time.</p><div className="mt-6 space-y-3"><button onClick={togglePlayback} className="flex w-full items-center justify-between rounded-2xl bg-[#f1e2d3] px-4 py-3 text-left text-sm font-semibold text-[#994321] transition hover:bg-[#ecd5c2]"><span className="flex items-center gap-3"><Music2 className="h-4 w-4" /> {isSpeaking ? "Pause audio" : "Listen softly"}</span><span className="text-xs text-[#b4775a]">Recorded</span></button><button onClick={() => toast(saved.length ? `${saved.length} verse${saved.length > 1 ? "s" : ""} saved.` : "Tap a bookmark beside any verse to save it.")} className="flex w-full items-center justify-between rounded-2xl border border-[#ddcdbb] px-4 py-3 text-left text-sm font-semibold text-[#4b6067] transition hover:border-[#d96b2b] hover:text-[#a94725]"><span className="flex items-center gap-3"><Bookmark className="h-4 w-4" /> Quiet shelf</span><span className="text-xs text-[#9b8e81]">{saved.length}</span></button></div></div>
              <div className="relative mt-7 border-l-2 border-[#d96b2b] pl-5 before:absolute before:-left-[7px] before:-top-1 before:h-3 before:w-3 before:rounded-full before:border-2 before:border-[#f4efe5] before:bg-[#d96b2b]"><p className="font-serif text-lg italic leading-7 text-[#5b676a]">“जहाँ सुमिरन करि हनुमत, मंगल होय अपार।”</p><p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#aa765a]">Remembering brings auspiciousness</p></div>
            </aside>
          </div>
        </section>

        <section id="feedback" className="border-t border-[#d9cbb8] bg-[#ece3d5] px-5 py-14 lg:px-10 lg:py-18">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[#b45a31]"><MessageCircle className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-[0.28em]">A small listening desk</span></div>
              <h2 className="font-serif text-4xl font-semibold tracking-[-0.03em] text-[#243b49] sm:text-5xl">Help us keep this space <em className="font-normal text-[#ad512a]">useful.</em></h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#687577]">Tell us what felt clear, what needs correction, or what would make daily reading gentler. Feedback opens a public GitHub issue so the conversation stays visible and accountable.</p>
              <p className="mt-3 text-xs leading-5 text-[#8c8277]">No personal details are collected by this page. Anonymous, privacy-conscious usage analytics may record broad interaction events such as language choice and playback.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#d5c5b1] bg-[#f8f4eb] p-5 shadow-[0_18px_50px_rgba(87,53,30,0.08)] sm:p-7">
              <div className="grid gap-3 sm:grid-cols-3">
                {feedbackTemplates.map((template) => <button key={template.label} onClick={() => { setFeedbackChoice(template.label); track("feedback_choice", { choice: template.label }); }} className={`min-h-14 rounded-xl border px-3 py-3 text-left text-xs font-bold leading-5 transition ${feedbackChoice === template.label ? "border-[#d96b2b] bg-[#f1e2d3] text-[#994321]" : "border-[#d8c9b7] bg-[#fffaf1] text-[#52656b] hover:border-[#d96b2b] hover:text-[#a94725]"}`}>{template.label}</button>)}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3"><a href={feedbackHref} target="_blank" rel="noreferrer" onClick={() => track("feedback_opened", { choice: feedbackChoice ?? "none" })} className="inline-flex items-center gap-2 rounded-full bg-[#d96b2b] px-5 py-3 text-sm font-bold text-[#fffaf1] shadow-[0_8px_25px_rgba(217,107,43,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e27b3a] active:scale-[0.97]"><Mail className="h-4 w-4" /> Open issue template</a><button onClick={installApp} className="inline-flex items-center gap-2 rounded-full border border-[#cdbda9] bg-[#fffaf1] px-4 py-3 text-xs font-bold text-[#52656b] transition hover:border-[#d96b2b] hover:text-[#a94725]"><Download className="h-4 w-4" /> {isOffline ? "Offline mode" : "Read offline"}</button></div><div className="mt-5 flex items-center justify-between gap-3 border-t border-[#dfd2c2] pt-4"><div><p className="text-xs font-bold text-[#52656b]">Optional interaction analytics</p><p className="mt-1 text-[11px] leading-5 text-[#8c8277]">{analyticsEnabled ? "On · broad events only" : "Off on this device"}</p></div><button onClick={() => setAnalyticsEnabled((value) => !value)} aria-pressed={analyticsEnabled} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${analyticsEnabled ? "border-[#d96b2b] bg-[#f1e2d3] text-[#994321]" : "border-[#cdbda9] bg-[#fffaf1] text-[#52656b]"}`}>{analyticsEnabled ? "Turn off" : "Turn on"}</button></div>
            </div>
          </div>
        </section>
        <section id="languages" aria-labelledby="languages-heading" className="border-t border-[#d9cbb8] bg-[#f8f4eb] px-5 py-14 lg:px-10 lg:py-20"><div className="mx-auto max-w-7xl"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b45a31]">One prayer, many scripts</p><h2 id="languages-heading" className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-[#263f4d] sm:text-5xl">Hanuman Chalisa in Hindi and regional languages.</h2><p className="mt-5 max-w-3xl text-base leading-8 text-[#627176]">Read the complete Hanuman Chalisa in Hindi, English, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, or Romanized Hindi. Choose a language above to change the script, meaning, and recorded recitation.</p><div className="mt-8 flex flex-wrap gap-2">{languages.map((item) => <span key={item.id} lang={item.id === "roman" ? "en" : item.id} className="rounded-full border border-[#d8c7b4] bg-[#fffaf1] px-3.5 py-2 text-sm font-semibold text-[#4b6067]">{item.label}</span>)}</div></div></section>
        <section id="about" className="border-t border-[#d9cbb8] bg-[#ece3d5] px-5 py-16 lg:px-10"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center"><div className="overflow-hidden rounded-[2rem] bg-[#3c3030] shadow-[0_20px_60px_rgba(87,53,30,0.14)]"><img src={assetUrl("hanuman-meditation.png")} alt="A devotional illustration of Hanuman in prayer" className="h-full w-full object-cover" /></div><div className="max-w-xl"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b45a31]">About this prayer</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#263f4d]">A prayer carried<br /><em className="font-normal text-[#ad512a]">across generations.</em></h2><p className="mt-5 text-base leading-8 text-[#627176]">The Hanuman Chalisa is a devotional hymn of forty verses in praise of Hanuman. This small reading space is made for returning: before the day begins, after it ends, or whenever a steady word is needed.</p><div className="mt-7 flex flex-wrap gap-3"><span className="rounded-full border border-[#cdbda9] bg-[#f6eee4] px-4 py-2 text-xs font-bold text-[#5e6c6d]">Hindi first</span><span className="rounded-full border border-[#cdbda9] bg-[#f6eee4] px-4 py-2 text-xs font-bold text-[#5e6c6d]">11 languages</span><span className="rounded-full border border-[#cdbda9] bg-[#f6eee4] px-4 py-2 text-xs font-bold text-[#5e6c6d]">Made for quiet reading</span></div></div></div></section>
      </main>
      <footer className="border-t border-[#d9cbb8] bg-[#f8f4eb] px-5 py-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-[#7f8580] sm:flex-row sm:items-center"><p>श्री हनुमते नमः · With reverence, for every home.</p><div className="flex items-center gap-5"><button onClick={() => toast("Share link copied soon.")} className="inline-flex items-center gap-2 hover:text-[#a94725]"><Share2 className="h-3.5 w-3.5" /> Share</button><span>Chalisa · 2026</span></div></div></footer>
    </div>
  );
}
