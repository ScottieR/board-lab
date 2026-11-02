# Game ideas for Board Lab

What makes Board different from an iPad flat on a table — design for these, not around them:

| Board superpower | What the SDK gives us | Design use |
|---|---|---|
| **Physical pieces with identity** | `glyphId` per piece | Each kid *owns* a piece/character; pieces can be tools (lantern, magnet, shovel) |
| **Rotation** | `orientation` (≈1° precision) | Aim, steer, dial, compass, valve, beam |
| **Hand on / hand off** | `isTouched` | "Holding = moving/visible, letting go = hiding/locked in"; turn-commit without a button |
| **Placing & lifting** | began / ended phases | Drop to plant/build/dig; lift to "jump" or to remove from the world |
| **A 24" table everyone surrounds** | 1920×1080, any number of contacts | Home zones on each side, text that faces each player, reaching across = co-op moments |
| **Fingers too** | `glyphId === 0` | Littlest player can always join with a finger (TK-friendly) |

One Piece Set is active per game (one `.tflite` model per bundle), so every game below works with any single official set: we map *glyph ids → roles* in our own table.

---

## 1. Night Lights ✅ prototype built
Co-op flashlight hide-and-seek. Each piece is a lantern; **rotating it sweeps a beam** across a dark garden. Hold light on a hidden critter to find it. Shy owls need **two beams crossing** on them, so siblings have to coordinate from opposite sides. Fingers make a small glow.
- Ages: all three (TK with a finger) · Build: done, ~300 lines
- Next: critters that scurry when lit by only one beam; sound; a "night map" that persists across rounds via `Board.save`

## 2. Campground Caper — *Sneaky Sasquatch–style stealth heist*
You're a sneaky forest creature raiding a campground for snacks. Ranger AI walks patrols with **visible vision cones** on screen. The twist uses `isTouched`:
- **Hand on your piece = you're moving and can be seen.** Let go and you freeze into a bush-disguise.
- Slide your critter between cover; grab the cooler; get back to your den at your side of the table.
- Co-op roles: one sibling's piece is the sneaker, another *taps* (finger) to make a distracting noise that turns the ranger's head.
- Ages: 1st–4th grade lead, TK as the distraction-maker · Build: medium (pathing + cone checks, reuses Night Lights' beam math)

## 3. Island Friends — *Hello Kitty Island Adventure–style cozy island*
A persistent island lives on the table. Each kid's piece is their character and has a **home corner** facing their seat. Walk your piece to places to gather (shells, fruit, flowers), bring gifts to island friends to raise friendship, unlock new areas.
- Board twist: **put two kids' pieces next to each other to "craft together"** (adjacency recipes), and gifts only work when the friend's house is reached physically.
- `Board.save` keeps the island growing across days — a once-a-night ritual.
- Ages: all · Build: biggest (content-heavy); start with one meadow + 3 friends + 5 items

## 4. Bounce Lab — marble-run puzzle
Each piece is a bumper/ramp; **its rotation sets the deflection angle**. Tap to launch a marble from a start pad; route it through stars to a goal. Rearrange and re-aim between shots, like a physical Incredible Machine.
- Ages: 4th grader solo puzzles; little ones love just launching · Build: small (2D reflection physics)

## 5. Treasure Tides — compass treasure hunt
One piece is a **spyglass**: rotate it and a far-off clue appears only in the direction it faces. A second piece is the **shovel**: place it to dig. Clues are relative ("3 steps from the palm, toward the whale"), so the table argues about where to aim.
- Ages: 1st–4th · Build: small-medium

## 6. Sun & Sprout — rotate the sun
A garden grows over real time. Place the **sun piece and rotate it** to move shadows; place the **watering can** and lift it to pour. Plants need the right mix. Light/shadow math reuses Night Lights.
- Ages: TK–1st · Build: small; great first "make your own" for the 4th grader

## 7. Pet Parade — rhythm & dial music
Pieces are instruments; **rotation is a dial** (pitch/tempo) and hand-on means "playing." Each kid's side of the table is their lane. Loop builder rather than a scoring game — perfect "noodle around" toy.
- Ages: all · Build: small with WebAudio

## 8. Sumo Bots — quick reflex party game
Two to four pieces are bumper bots in a ring; **aim with rotation, release your hand to dash**. Last bot standing. Short rounds for when attention spans are short.
- Ages: all · Build: small

### Suggested order
1. **Night Lights** (done) — proves pieces, rotation, multi-player co-op
2. **Bounce Lab** or **Sun & Sprout** — tiny, satisfying, good to build *with* the 4th grader
3. **Campground Caper** — the "wow, we made this" stealth game
4. **Island Friends** — the long-running cozy world, once the toolkit is mature
