# Hanuman Chalisa — Design Direction

## Three initial directions

### Theme Name: Quiet Indian Manuscript
Very Brief Intro: A warm, tactile reading experience inspired by temple manuscripts, handmade paper, and saffron pigment. It treats the Chalisa as a daily ritual rather than a content feed.
Probability: 0.06

### Theme Name: Marigold Courtyard
Very Brief Intro: A bright, welcoming visual system built around courtyard light, marigold garlands, and terracotta architecture. It feels open, familial, and morning-oriented.
Probability: 0.03

### Theme Name: Night Aarti
Very Brief Intro: A contemplative evening mode with ink-blue backgrounds, diya light, and restrained copper accents. It makes reading feel like a quiet pause after sunset.
Probability: 0.08

## Selected approach: Quiet Indian Manuscript

### Design Movement
Contemporary Indian editorial design with references to handwritten devotional manuscripts, block printing, and archival stationery.

### Core Principles
1. Reading is the primary ritual: text receives the strongest hierarchy and generous breathing room.
2. Material warmth over digital gloss: paper grain, ink, pigment, and soft shadows replace generic gradients.
3. Devotion feels grounded and approachable: the artwork is reverent but never theatrical.
4. Every interaction should feel like turning a page or lighting a diya: clear, calm, and lightly tactile.

### Color Philosophy
Warm ivory is the visual ground, evoking handmade paper and allowing Devanagari text to breathe. Saffron is the ownable action color: it signals energy, reverence, and the warmth of a diya. Deep ink blue replaces black for softness and legibility. Terracotta and maroon provide grounded secondary emphasis, while antique gold is used sparingly for sacred details.

### Layout Paradigm
An asymmetric reading desk: the opening hero is split between a text-led left side and a quiet artwork-led right side, followed by a two-column reading area with a sticky ritual rail. On mobile, the rail becomes a compact horizontal control strip above the text.

### Signature Elements
- A hand-drawn temple-arch motif used as a small section marker.
- Fine saffron rules and page-number-like verse markers.
- A soft paper texture and marigold-petal ornament used with restraint.

### Interaction Philosophy
Language, font size, and reading mode should be obvious without feeling like a control panel. The user can switch language, adjust type, mark a verse, and share the page with minimal friction. Active controls use saffron fill and a slight press response; secondary controls remain quiet and outlined.

### Animation
Use short 180–260ms ease-out transitions for controls. On initial load, reveal the hero copy and artwork with a subtle upward drift and opacity fade. Verse rows may stagger by 30ms, but motion must stop under prefers-reduced-motion. Avoid decorative looping motion.

### Typography System
Display: Cormorant Garamond, 600–700, used for English headings and compact editorial labels. Body: Noto Serif Devanagari for Hindi and Noto Serif for Latin scripts, with generous line-height. Romanized helper text is smaller, muted, and never competes with the original script.

### Brand Essence
A calm digital prayer book for anyone who wants to read, listen to, or carry the Hanuman Chalisa across languages. Personality: reverent, warm, quietly confident.

### Brand Voice
Headlines are concise and devotional without being grandiose. CTAs sound like invitations to a ritual, not software commands.
Examples: “Begin with the opening doha.” and “Keep this prayer close.”

### Wordmark & Logo
The mark is a compact emblem combining a temple arch, rising sun, and simplified gada silhouette. It appears beside the wordmark “Chalisa” in a high-contrast serif, with the small descriptor “हनुमान” as a Devanagari seal.

### Signature Brand Color
Diya Saffron — #D96B2B. It is warm, unmistakable, and active without becoming loud.

## Content structure

The first release includes the complete Hindi Hanuman Chalisa as the default reading experience, plus language options for English, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, and Romanized Hindi. The interface keeps the same verse structure across languages, with each verse available as a selectable reading row. A clearly labeled “More languages” affordance can be extended later without changing the reading model.

## Style Decisions

- Hero imagery stays quiet and manuscript-like, using warm paper framing and reduced contrast rather than a full-bleed cinematic devotional poster.
- The temple-arch / rising-sun / gada emblem is the primary brand mark; Om is reserved for devotional copy rather than the main logo.
- Controls and the ritual rail use ruled paper, marginalia, and stamped-label cues, with rounded shapes kept subordinate to the reading experience.
