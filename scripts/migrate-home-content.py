from pathlib import Path
import re
p = Path('/home/ubuntu/hanuman-chalisa/client/src/pages/Home.tsx')
s = p.read_text(encoding='utf-8')
s = s.replace('import { toast } from "sonner";\n', 'import { toast } from "sonner";\nimport { verses, verseCount } from "@/lib/hanumanChalisa";\n')
s = re.sub(r'\nconst verses = \[.*?\n\];\n\nexport default function Home', '\nexport default function Home', s, flags=re.S)
s = s.replace('const displayVerses = useMemo(() => verses, []);', 'const displayVerses = useMemo(() => verses, []);')
s = s.replace(' · 13 selected passages', ' · {verseCount} chaupais')
p.write_text(s, encoding='utf-8')
