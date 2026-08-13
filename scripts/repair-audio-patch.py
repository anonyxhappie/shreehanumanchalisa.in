from pathlib import Path
p = Path('/home/ubuntu/hanuman-chalisa/client/src/pages/Home.tsx')
s = p.read_text(encoding='utf-8')
s = s.replace('\\n', '\n')
s = s.replace('const displayVerses = useMemo(() => verses, []);\\n\\n  const speakVerse', 'const displayVerses = useMemo(() => verses, []);\n\n  const speakVerse')
p.write_text(s, encoding='utf-8')
