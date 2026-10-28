# Code-driven visual experience

The visual experience is designed around editable SVG character shapes rather than external pose images.

## Design principles

- **Single-colour artwork:** Hanuman and Rama use the same deep-teal ink colour, with paper-coloured negative space for facial and jewellery details.
- **Code-owned characters:** body, arms, legs, tail, crown, gada, and bow are SVG paths and groups in `client/src/pages/VisualExperience.tsx`.
- **Reusable motion:** Framer Motion animates the character's limbs and body. Actions are `stand`, `pray`, `run`, `fly`, `victory`, and `archer`.
- **Verse-driven story:** `sceneForVerse()` maps verse indices to entries in the `scenes` data array. Edit the beat map or scene data to change the story without changing the renderer.
- **One persistent stage:** the illustrated world remains fixed behind the verse-scrolling interface. Background environment changes by scene.
- **No character asset downloads:** the page no longer relies on external WebP pose sheets or a fallback illustration.

## Extending the system

1. Add or refine SVG paths in `CharacterArt` to change a character's design.
2. Add an action to the `Action` type and implement its limb/body motion in `CharacterArt`.
3. Add a scene to `scenes`, then map verse indices in `sceneForVerse()`.
4. Keep motion subtle and respect the page's pause and reduced-motion behavior.
5. Verify the result at mobile and desktop sizes before merging.

This is intentionally a lightweight 2D system, not a cinematic rig. For more complex motion later, keep the same scene data model and replace only the character renderer.
