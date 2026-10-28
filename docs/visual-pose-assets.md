# Visual experience pose assets

The visual experience uses transparent WebP character poses served from `/images/visual/`.

## Install the generated asset pack

Extract `hanuman-ram-visual-assets.zip` into this directory so the files land at:

```text
client/public/images/visual/hanuman-standing.webp
client/public/images/visual/hanuman-running.webp
client/public/images/visual/hanuman-flying.webp
client/public/images/visual/hanuman-prayer.webp
client/public/images/visual/hanuman-running-back.webp
client/public/images/visual/hanuman-victory.webp
client/public/images/visual/ram-standing.webp
client/public/images/visual/ram-running.webp
client/public/images/visual/ram-archer.webp
client/public/images/visual/ram-prayer.webp
client/public/images/visual/ram-running-back.webp
client/public/images/visual/ram-victory.webp
```

The pack contains optimized transparent WebP crops from the user-provided pose sheets. It is not a rigged animation file; Framer Motion animates the pose as a whole and the scene's environmental layers separately. Check edge halos and character framing in the real browser before merging.

The repository's GitHub connector can write text files but does not expose a binary asset commit operation. The generated pack is therefore supplied separately and must be copied into the repository before the new character poses can load. A fallback illustration remains active if a pose file is missing.
