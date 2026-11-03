# Custom pieces & 3D-printed shells

> **Updated after research (Nov 2026):** see `docs/research/PIECES_AND_CONTROLS.md` for the full report —
> existing games' pieces (the dial spy game is **Spycraft**), SDK limits, eight reusable piece mechanisms, a
> game-by-game custom piece catalog and a day-one hardware test plan. Short version: we can't make new
> recognized pieces (only Board can, via a publishing deal or the announced Board Studio), but **Board Bases**
> (generic bases for 25mm minis, with a public model) plus printed sockets, collars, cranks and windows give us
> nearly everything we want.

## How Board sees a piece
- Pieces are passive: no batteries or electronics. Each has a **conductive pattern on its base (the Glyph)**; an on-device ML model (`model.tflite`) recognizes it and reports `glyphId`, position, rotation, and whether a hand is touching it.
- The model is trained per **official Piece Set** (e.g. Mushka, Chop Chop, Board Arcade). Only one set's model is active per game.
- `isTouched` works because the piece **body is conductive and connected to the glyph**, so your hand changes the signal.

## What this means for printing
**We can't invent new glyphs** — a printed base with a made-up pattern won't be recognized as a piece. The plan instead:

1. **Shells / toppers over official pieces (recommended).** Pick one Piece Set for the lab, then print characters that slip over or press-fit onto those pieces, leaving the glyph base flat on the screen. Our game maps each glyph id to the character on top.
   - Keep the base **unobstructed and flat**; the shell must not add plastic under or around the glyph.
   - A plain PLA/PETG shell will **insulate your hand** from the piece's conductive body, which can break `isTouched`. Options to test: leave a grip window where fingers touch the original piece, or run a strip of **conductive filament** from the grip to the piece body.
   - Mark a **facing direction** on every shell (nose, arrow, lantern spout) so rotation feels obvious — the game uses it.
2. **Plain conductive tokens (to test).** The SDK has a `Blob` contact type for unclassified contacts. A token printed in conductive filament *might* register as a Blob — position only, no identity or rotation. Useful for things like coins or "walls" if it works. Unverified until the Board arrives.

## To measure when the Board arrives
- [ ] Which Piece Set(s) we have, how many pieces, and their glyph ids (use `#sandbox`)
- [ ] Piece base diameter and height (calipers) → shell inner dimensions + ~0.2 mm tolerance
- [ ] Does `isTouched` still work through a PLA shell? With a conductive strip?
- [ ] Does a conductive-filament disc show up as a `Blob`?
- [ ] Rotation stability with a tall/heavy topper

Screen math for layout: 1920×1080 on 23.8" ≈ **92.6 px per inch** (`PX_PER_INCH` in `src/board/space.ts`).
