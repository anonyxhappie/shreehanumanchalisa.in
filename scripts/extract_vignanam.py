from pathlib import Path
import json
import re
import requests
from bs4 import BeautifulSoup

LANGS = {
    "mr": "marathi",
    "bn": "bengali",
    "ta": "tamil",
    "te": "telugu",
    "gu": "gujarati",
    "kn": "kannada",
    "ml": "malayalam",
    "pa": "punjabi",
}

out = {}
for code, slug in LANGS.items():
    url = f"https://vignanam.org/{slug}/hanuman-chalisa.html"
    html = requests.get(url, timeout=30, headers={"User-Agent": "Mozilla/5.0"}).text
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text("\n", strip=True)
    # Keep the canonical body between the page title and the trailing related-content section.
    start = text.find("**")
    if start == -1:
        start = text.find("दोहा")
    end = text.find("Browse Related Categories")
    body = text[start:end if end != -1 else None].strip()
    out[code] = {"source": url, "raw": body}

Path("/home/ubuntu/hanuman-chalisa/content").mkdir(parents=True, exist_ok=True)
Path("/home/ubuntu/hanuman-chalisa/content/vignanam-regional-raw.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"saved {len(out)} regional source pages")
