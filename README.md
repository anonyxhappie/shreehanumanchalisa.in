# Shree Hanuman Chalisa

A calm, Hindi-first reading experience for the complete Hanuman Chalisa, with devotional artwork, multilingual script support, verified meaning editions, and synchronized recitation audio.

## What is included

The site presents the complete Hanuman Chalisa with the opening dohas, all 40 chaupais, and the closing doha. Hindi is the default reading language, with Roman transliteration and English meaning support. The language switcher also includes Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, and Romanized Hindi.

Marathi is provided as a dedicated Marathi meaning edition rather than Hindi text rendered in Devanagari. The remaining regional-script editions render the complete canonical text in the selected script and are clearly labeled while semantic translations receive further editorial review.

The reading desk includes a Meaning toggle, adjustable type size, verse bookmarks, copy action, and a recorded audio player. The player switches recordings with the selected language, supports play, pause, stop, previous and next verse navigation, playback speed, progress, automatic scrolling, and synchronized active-verse highlighting. Timing for regional tracks is currently calculated proportionally from measured recording durations; native-speaker review is recommended before public release.

## Supported audio editions

Recorded audio is available for Hindi, English, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, and Punjabi. Romanized Hindi uses the Hindi recitation because it is a pronunciation aid rather than a separate translation.

## Technology

This is a static React 19 frontend built with Vite, TypeScript, Tailwind CSS 4, shadcn/ui primitives, Wouter, Lucide icons, and the Indic Transliteration Sanscript package. Audio and artwork use persistent web project storage paths so large media files do not live in the repository.

## Local development

```bash
pnpm install
pnpm dev
```

The development server runs on the Vite default port. For validation and a production build:

```bash
pnpm check
pnpm build
```

## Content references

The canonical text and English meanings were cross-checked against [Vaidika Vignanam](https://vignanam.org/english/hanuman-chalisa.html) and [Art of Living](https://www.artofliving.org/in-en/culture/reads/hanuman-chalisa-lyrics-meaning). Regional script references include the corresponding [Vaidika Vignanam language editions](https://vignanam.org/). The Marathi meaning edition was cross-checked against [Hanuman Chalisa in Marathi](https://hanumanchalisainmarathi.com/), [Webdunia Marathi](https://marathi.webdunia.com/article/hinduism-marathi/shri-hanuman-chalisa-with-meaning-120091500007_1.html), and [Sant Sahitya](https://www.santsahitya.in/articles/hanuman-chalisa/).

## Project structure

```text
client/
  src/pages/Home.tsx              Main reading experience and audio controls
  src/lib/hanumanChalisa.ts       Canonical text, transliteration, and English meanings
  src/lib/marathiChalisa.ts       Marathi meaning edition
  src/index.css                   Manuscript-inspired visual system
content/
  marathi-audit.md                Marathi source audit and editorial notes
```

## Editorial and accessibility notes

The website is designed for quiet reading, devotional listening, keyboard-accessible controls, responsive layouts, and reduced-motion preferences. Audio pronunciation and the regional-language editions should be reviewed by native speakers before the site is presented as a definitive translation or recitation resource.

## License

Add the project license and any required attribution terms before publishing the repository publicly.
