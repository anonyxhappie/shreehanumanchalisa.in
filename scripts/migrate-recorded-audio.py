from pathlib import Path
import re

p = Path('/home/ubuntu/hanuman-chalisa/client/src/pages/Home.tsx')
s = p.read_text(encoding='utf-8')
s = s.replace('import { useEffect, useMemo, useRef, useState } from "react";', 'import { useEffect, useMemo, useRef, useState } from "react";')
s = s.replace('  const [showLanguages, setShowLanguages] = useState(false);\n  const [audioIndex, setAudioIndex] = useState(0);\n  const [audioRate, setAudioRate] = useState(1);\n  const [isSpeaking, setIsSpeaking] = useState(false);\n  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);\n  const continueRef = useRef(false);', '  const [showLanguages, setShowLanguages] = useState(false);\n  const [audioIndex, setAudioIndex] = useState(0);\n  const [audioRate, setAudioRate] = useState(1);\n  const [isSpeaking, setIsSpeaking] = useState(false);\n  const [audioTime, setAudioTime] = useState(0);\n  const [audioDuration, setAudioDuration] = useState(269.48);\n  const audioRef = useRef<HTMLAudioElement | null>(null);')
start = s.index('  const speakVerse = (index: number) => {')
end = s.index('  const toggleSaved = (index: number) => {')
new_block = '''  const segmentDurations = [96.84, 81.08, 42.72, 36.8, 12.04];
  const segmentStarts = [0, 14, 28, 36, 42];

  const getVerseIndexAtTime = (time: number) => {
    let segment = 0;
    let elapsed = 0;
    for (let i = 0; i < segmentDurations.length; i += 1) {
      if (time >= elapsed + segmentDurations[i] && i < segmentDurations.length - 1) elapsed += segmentDurations[i];
      else { segment = i; break; }
    }
    const start = segmentStarts[segment];
    const end = segment === segmentStarts.length - 1 ? verses.length : segmentStarts[segment + 1];
    const segmentTime = Math.max(0, time - elapsed);
    const entries = verses.slice(start, end);
    const weights = entries.map((verse) => Math.max(verse.hi.replace(/\\s/g, "").length, 1));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let cursor = 0;
    for (let i = 0; i < weights.length; i += 1) {
      const next = cursor + (weights[i] / totalWeight) * segmentDurations[segment];
      if (segmentTime <= next || i === weights.length - 1) return start + i;
      cursor = next;
    }
    return start;
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
    if (audio.paused) audio.play().catch(() => toast("Tap play again to begin the Hindi recitation."));
    else audio.pause();
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
    const segment = segmentStarts.reduce((acc, start, index) => start <= next ? index : acc, 0);
    const start = segmentStarts[segment];
    const end = segment === segmentStarts.length - 1 ? verses.length : segmentStarts[segment + 1];
    const entries = verses.slice(start, end);
    const weights = entries.map((verse) => Math.max(verse.hi.replace(/\\s/g, "").length, 1));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const offset = weights.slice(0, next - start).reduce((sum, weight) => sum + weight, 0);
    const before = segmentDurations.slice(0, segment).reduce((sum, duration) => sum + duration, 0);
    const target = before + (offset / totalWeight) * segmentDurations[segment] + 0.05;
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
    return () => { audio.removeEventListener("play", onPlay); audio.removeEventListener("pause", onPause); audio.removeEventListener("ended", onEnded); };
  }, []);

  useEffect(() => {
    const active = document.querySelector(`[data-verse-index="${audioIndex}"]`);
    if (isSpeaking && active) active.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [audioIndex, isSpeaking]);
'''
s = s[:start] + new_block + s[end:]
s = s.replace('''  return (\n    <div className="min-h-screen''', '''  return (\n    <div className="min-h-screen''')
p.write_text(s, encoding='utf-8')
