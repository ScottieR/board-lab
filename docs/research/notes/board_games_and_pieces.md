# Board (board.fun) games and how creatively they use their physical pieces

Research date: 2026-11-02. Note: board.fun product pages (board.fun/products/the-heist, /board-tabletop) and GitHub were blocked by the fetch allowlist; the board.fun homepage, /pages/games, /products/spycraft, the help center, and docs.dev.board.fun were reachable.

## Q1. What games exist on Board and which piece set does each use?

### Takeaway
As of Nov 2026 the official library lists about 23 entries. They include a free bundled "Arcade" family (ships and robots) plus Chop Chop, and about 15 paid titles at roughly $30–35 each, each with its own piece set. The latest wave (Fall 2026) adds Signal & Switch, Ants Go Marching (November), and The Magic Shop (December). Stowaway is "Coming Winter" and Board Tabletop (D&D) is in beta.

### Cited Findings
**Full catalog from board.fun/pages/games** (prices reflect a 15% Black Friday sale, $29.71 down from $34.95) — [Board games page](https://board.fun/pages/games); [Board homepage](https://board.fun/)

| Game | What it is | Pieces / set | Status |
|---|---|---|---|
| Board Arcade / Retro Arcade Collection | 5–6 reimagined arcade classics, included with the console | Arcade set (ships and robots) | Included |
| Space Rocks | Asteroids-style shooter: blast asteroids, collect minerals | Ships | Included |
| Starfire | Pinball/air-hockey-style space arena battle | Ships | Included |
| Snek | Robot guides a snake to fruit while dodging rivals | Robots | Included |
| Cosmic Crush | Competitive match-3: robots push aliens into sets | Robots | Included |
| Astrofort | Brick-breaker fort defense, with multi-ball | Robots | Included |
| Pinboard | Build a pinball table from ships and robots (a "community game") | Arcade set | Included |
| Chop Chop | Co-op Overcooked-style kitchen | Knives, spoons, spice grinder or mill, sponge, Little Chef | Included |
| Save The Bloogs | Lemmings-style puzzler | Cannons, stairs, shapeshifter ring, blocks | $29.71 |
| Bloogs Blitz | New Bloogs levels, team or versus play | Image only (presumably the Bloogs set) | $29.71, Summer Collection |
| The Heist | Laser-chess-style game: redirect security lasers with mirrors | Mirrors, laser splitters, thief | $29.71, Summer Collection |
| Board Sports | Golf, Pool, Bowling (3 games), "only possible on Board" | Not stated | $38.21 |
| Strata & Daily Build | Territory stacking ("Tetris meets Chess") plus 3 daily 3D puzzles | 3D pentomino blocks ("Board Blocks") | $38.21 bundle |
| Spycraft | Escape-room-style spy mystery set in New York, Tokyo, and London | 7-piece Spy Kit | $29.71 |
| Thrasos | Risk-style conquest with Olympian gods | God pieces | $29.71 |
| Mushka | Virtual pet | Toy bag, brush, wand, etc. | $29.71 |
| Omakase | Sushi head-to-head duel | Chopsticks | $29.71 |
| Signal & Switch | Rush-hour city strategy (Rush Hour / Mini Metro-like) | Own set | New release, Fall Collection |
| Ants Go Marching | Tower defense protecting a picnic | Own set | November |
| The Magic Shop | Brew potions, craft items, run a shop | Own set | December |
| Stowaway | Space-themed social deduction | Not stated | Coming Winter |
| Board Tabletop | D&D VTT using Foundry VTT and "Board Bases" for minis | Tabletop set / Board Bases | Beta |

- Bundles: Signature Collection (Save the Bloogs, Spycraft, Strata & Daily Build, Mushka, Omakase), Summer Collection (The Heist, Bloogs Blitz, Board Sports), Fall Collection (Signal & Switch, Ants Go Marching, The Magic Shop) — [Board games page](https://board.fun/pages/games)
- Launch (Oct 2025): 12 original titles, each with a unique piece set; price $499 limited-time, $699 regular. Designed by Brynn Putnam with ex-World of Warcraft exec Seth Sivac — [Engadget](https://www.engadget.com/gaming/board-is-a-500-board-game-console-with-12-original-titles-223313978.html)
- Board funded the development of the twelve launch titles. Spycraft was made by State of Play. Omakase was designed by Bruno Cathala — [Wargamer preview](https://www.wargamer.com/board/game-console-preview)
- Spycraft launched in late January 2026, after the initial batch. Thrasos components shipped in the box but the game was not yet playable at launch — [Meeple Mountain review](https://www.meeplemountain.com/reviews/board-fun-device/). Thrasos pieces "went unused for nearly nine months" before release (Summer 2026) — [Meeple Mountain Summer 2026](https://www.meeplemountain.com/articles/the-quarterly-board-meeting-summer-2026/)
- "Spacefire" in Wargamer's preview is the Asteroids-like game (triangular ship pieces auto-fire), which ships as Space Rocks — [Wargamer preview](https://www.wargamer.com/board/game-console-preview)

**Mapping to developer-portal piece-set models (inference partly)**
- Docs confirm piece sets are "trained together for recognition", only one set is active at a time, and each has its own Piece Set Model selected through the SDK — [Docs: Pieces](https://docs.dev.board.fun/learn/pieces)
- Likely mapping: Board Arcade → all arcade games plus Pinboard. Chop Chop → Chop Chop. Mushka → Mushka. Omakase → Omakase. Save the Bloogs → Save the Bloogs and Bloogs Blitz. Heist → The Heist. Thrasos → Thrasos. Board Bases → Board Tabletop. The combined models (Chop Chop+Mushka, Thrasos+Arcade) suggest some games use two sets at once. (Inference; no source ties each game to a model.)

### Inferences
- No portal model appears for Spycraft, Strata, Board Sports, Signal & Switch, Ants, or Magic Shop in the list the user gave. Strata's blocks are non-capacitive, per the docs (see Q4). Spycraft may use its own model that isn't public, or one I couldn't see. Unverified.
- "Thrasos+Arcade" may exist because Thrasos or a later game reuses arcade pieces. This is speculation.

### Gaps
- No source gives exact piece counts per set. Bags are labeled with counts, but reviewers didn't list them.
- No piece details for Board Sports, Signal & Switch, Ants Go Marching, The Magic Shop, or Stowaway.

## Q2. "The spy game printed piece where you move the dials": is it Heist? What is it, and how do the dials work?

### Takeaway
The spy game is **Spycraft** (by State of Play), not The Heist. Spycraft's 7-piece "Spy Kit" includes a **dial** and a **slider**, plus white frames and black inner pieces you assemble into different tools (screwdriver, codebreaker, safe cracker, magnifier/zoom, X-ray). **The Heist** is a separate laser-and-mirror game with no dials. No source explains how the console senses the dial or slider state.

### Cited Findings
- Spycraft's kit: "a seven-component 'spy kit'—a dial, a slider, squares with cutouts for circular components—which can be mixed and matched based on the needs of the game" — [Meeple Mountain review](https://www.meeplemountain.com/reviews/board-fun-device/)
- Uses described in that review: "dismantling power boxes with a screwdriver", "using a codebreaking device to encrypt room keys", "using a piece of the spy kit to zoom in on clues from a hotel window in New York City", and "opening a briefcase to analyze various clues." The reviewer says Spycraft "does the best job of showing off the platform's potential" and is the only game with occasional glitches, none game-breaking — [Meeple Mountain review](https://www.meeplemountain.com/reviews/board-fun-device/)
- Official description: "Each piece can be assembled into different combinations to create new tools", used to tap phone-line connectors, decode ciphers, crack safes, and piece together audio recordings. Solo or co-op, ages 6+, $35 — [board.fun Spycraft](https://board.fun/products/spycraft)
- Modular tools act as "a magnifying glass, X-ray, or safe cracker" — [Wargamer preview](https://www.wargamer.com/board/game-console-preview)
- Assembly rules: 7 pieces; each puzzle needs a specific assembly, shown on screen beforehand. A Spy Kit icon re-shows the configuration. "All pieces (including the black inner pieces) must lie completely flat on the display"; if a piece isn't fully touching, "the Board won't recognize it"; "Make sure white frames are not upside down" — [Spycraft FAQs](https://board.gorgias.help/en-US/spycraft-faqs-4317832); [Spycraft instructions](https://board.gorgias.help/en-US/spycraft-instructions-4317832)
- One reviewer: Spycraft "uses pieces in a different way from Strata and The Heist", is "genuinely clever", and takes real thinking — [The Tabletop Family](https://thetabletopfamily.com/board-tabletop-console-review/)
- The Heist, for contrast: up to 6 mirror pieces and up to 2 laser splitters, plus a thief moved between checkpoints. Players place mirrors to redirect red beam tripwires so thieves can grab loot and escape within a time limit. About two dozen maps at launch; solo play; prone to quarterbacking — [Meeple Mountain Summer 2026](https://www.meeplemountain.com/articles/the-quarterly-board-meeting-summer-2026/). The console tracks how the light bounces off placed pieces — [The Tabletop Family](https://thetabletopfamily.com/board-tabletop-console-review/)

### Inferences
- **How the dial and slider are likely sensed (not confirmed; marked as inference).** The FAQ stresses that the black inner pieces must lie flat on the display, and that frames have a right-side-up. That suggests each inner part (dial disc, slider insert) is its own glyph-bearing piece touching the glass inside a frame's cutout. The screen would then read the inner piece's own position and rotation relative to the frame piece. A "dial" would be an inner disc rotated in a circular cutout, read via the ~1° orientation reporting. A "slider" would be an insert that translates within a slot, read via relative position. This fits the docs' general model, which reports identity, position, rotation, and touch per contact, with no mention of mechanical encoding. It also fits the docs' suggestion that rotation makes good "dials and combination locks" (see Q4).
- The alternative, a mechanism that swaps which glyph faces the screen, isn't supported by any source. The docs never mention multi-state pieces.
- The user's memory of "printed" pieces is probably the white frames with printed or graphic faces. Their material is unknown.

### Gaps
- No teardown, photos with captions, or video transcript of the Spy Kit. The YouTube trailer (youtube.com/watch?v=Vv_yY3tILsI) couldn't be fetched. Individual piece names, sizes, and the exact dial/slider mechanism remain unconfirmed.
- No details on how The Heist's mirrors are oriented (presumably by piece rotation) or what a laser splitter looks like.

## Q3. What are "Board Bases"?

### Takeaway
Board Bases are generic glyph bases made for **Board Tabletop**, the D&D virtual-tabletop beta. Six one-size bases accept standard 25mm minis, so a regular miniature becomes a tracked Board piece synced with Foundry VTT, including fog-of-war reveal and effects. That makes them the official "bring your own topper" pattern.

### Cited Findings
- The Board Tabletop pack includes "six special bases" into which you slot regular 25mm-scale D&D minis. They come in one size, so larger minis need "some jury-rigging." The Board detects identity, position, and rotation, which can trigger visual effects and reveal fog of war as you move a mini. It works with a Foundry VTT subscription, with Board as a PC-connected peripheral. Status: open beta — [Wargamer D&D VTT](https://www.wargamer.com/board/dnd-virtual-tabletop)
- The games page lists Board Tabletop as a beta that "uses Foundry VTT and Board Bases to transform minis"; join by email — [Board games page](https://board.fun/pages/games)
- Foundry module "board-tabletop" (v1.1.548, Foundry v14) "brings Foundry to Board"; source at github.com/Board-fun/foundryvtt-board-tabletop — [Foundry package](https://foundryvtt.com/packages/board-tabletop)

### Inferences
- Since "Board Bases" is a portal piece-set model, third-party developers can likely target the same six base glyphs for custom toppers. That directly supports the user's 3D-printed shell plan: print toppers that slot into Board Bases, the way minis do. Likely, but not officially documented.

### Gaps
- No base diameter or height. "25mm minis" implies a socket of about 1 inch, but the outer size is unknown. No price, no info on whether bases are sold separately, and no info on whether the touch state passes through a mini. The GitHub README couldn't be fetched.

## Q4. Which pieces have mechanical or moving parts, and how is that state sensed?

### Takeaway
Officially, pieces are passive plastic with conductive material, and the screen only knows each contact's glyph ID, position, rotation (~1°), touched state, and phase. Any mechanical state must therefore show up as the relative position or rotation of separately glyphed parts, or as gestures. The only clearly mechanical pieces found are Spycraft's dial and slider, plus Mushka's "wind-up carousel" (and Bloogs bricks that "pull apart").

### Cited Findings
- Pieces "have no batteries, sensors, or electronics", are "made from a blend of plastic and conductive material", and are detected "purely through capacitive interaction with the display" via on-device ML. A hand completes a circuit through the conductive body to signal touch — [Docs: Pieces](https://docs.dev.board.fun/learn/pieces)
- Contact data: contact ID, position at 1920×1080, orientation at ~1° (radians in Unity, degrees in Godot/Web), glyph ID, touched state, and phase (began, moved, stationary, ended, canceled) — [Docs: Pieces](https://docs.dev.board.fun/learn/pieces); [Docs: Touch system](https://docs.dev.board.fun/learn/touch-system)
- No artificial contact limit: about 170 Board Arcade pieces at once. Contact types are Finger and Glyph — [Docs: Touch system](https://docs.dev.board.fun/learn/touch-system)
- The design guide recommends rotation for "dials and combination locks" (Piece as a physical knob), turret angles, and a quarter-turn mode toggle. A 5° tolerance on a 90° snap "reads as forgiving" and 1° "reads as broken". "Twist" is a discrete gesture; "Shake" is detected from velocity reversals. Hold-to-confirm takes about 200 ms; over 1.5 s "feels like a stuck button". Touch has no edge event, so you diff the flag per frame. Piece taxonomy: Pawns (characters), Actions (stateless tools), Reactions (terrain) — [Docs: Piece Interaction Design](https://docs.dev.board.fun/guides/piece-interaction-design)
- Strata blocks "are not capacitive, so they never report touched"; "almost all" other pieces carry the capacitive coating — [Docs: Piece Interaction Design](https://docs.dev.board.fun/guides/piece-interaction-design)
- Mushka includes a "wind-up night-time carousel" that players wind. Bloogs lets players pull two bricks apart to create a rope — [Wargamer review](https://www.wargamer.com/board/games-console-review)
- Spycraft dial and slider — see Q2 — [Meeple Mountain review](https://www.meeplemountain.com/reviews/board-fun-device/)
- Pinboard obstacles change with robot orientation; flippers use on-screen buttons — [Meeple Mountain Summer 2026](https://www.meeplemountain.com/articles/the-quarterly-board-meeting-summer-2026/)
- The ML model was trained by a robot placing pieces in every position and orientation — [Wargamer preview](https://www.wargamer.com/board/game-console-preview)

### Inferences
- The Mushka carousel "winding" is most likely a rotation or twist gesture on a single piece, not internal mechanics. Bloogs "pulling bricks apart" is likely two separate pieces whose distance makes the rope. (Inferred from the docs' contact model.)

### Gaps
- No official statement on whether any piece changes its glyph mechanically. No docs page on multi-part pieces.

## Q5. What do reviewers find most delightful, and what do they criticize?

### Takeaway
Praise centers on tools that mimic real actions (Chop Chop's cleaver, pepper-mill twist, and shared spoon; Mushka's washing and brushing), Strata's standing and stacking of 3D blocks, Spycraft's modular kit, The Heist's laser bounces, and Starfire's ammo sweeping. Criticism covers occasional glyph detection faults on specific pieces, paint chipping, irreplaceable pieces, and the need to re-register pieces.

### Cited Findings
- Chop Chop: a cleaver with a chopping motion, a pepper mill (twist), and a Little Chef piece; kids spontaneously divide roles. Strata: three pentominoes per turn, laid flat or stood on end to bridge, with a second player physically holding unbalanced pieces while the other confirms. Bloogs: two stairs, two large bricks, a small cannon, and a circle; bricks block spike pits or form a rope. Mushka: watering can, brush, hair dryer, wind-up carousel, bubble wand, sleepdust sprinkler, toy bag. Starfire: sweep your ship over loose pellets to reload. Omakase: a 35-tile hex grid and a chopstick controller moving in straight lines. Four robot pieces in the arcade — [Wargamer review](https://www.wargamer.com/board/games-console-review)
- Criticisms in the same review: one robot piece "not always fully detected" (suspected production flaw), with the note that a similar fault on Little Chef "could be game breaking"; lost pieces can't be substituted with household items and the replacement cost policy is unclear; paint chips from edges; Board Arcade sometimes needs players to re-register pieces; pieces are "chunky plastic" that "appears to be painted" — [Wargamer review](https://www.wargamer.com/board/games-console-review)
- Tracking "borders on magic"; pieces "sized for kids' hands, yet chunky enough for adults"; Chop Chop's shared spoon creates "real-world body choreography"; Strata blocks feel "satisfyingly heavy"; labeled resealable pouches; only faint scratches — [Co-Optimus review](https://www.co-optimus.com/blog/article-poster/3279/board-review-2026-does-the-tabletop-console-deliver-on-its-social-play-promise.html)
- No tracking failures in about a dozen hours of play. Bags are labeled with game title and piece count. Pieces have "small contacts on the bottom" — [Meeple Mountain review](https://www.meeplemountain.com/reviews/board-fun-device/)
- Strata "could not exist as a physical board game", though Wargamer's preview disagreed and thought it could be made analog. "Every game finds its own way to use them" — [The Tabletop Family](https://thetabletopfamily.com/board-tabletop-console-review/); [Wargamer preview](https://www.wargamer.com/board/game-console-preview)
- Docs design cues from shipped games: Chop Chop stations show which tool to use and turn a tile red for the wrong piece; Omakase shows a chopstick-position icon and petal confirmation; Bloogs has a rotation selector; Cosmic Crush uses slide then hold to confirm a robot — [Docs: Piece Interaction Design](https://docs.dev.board.fun/guides/piece-interaction-design)

### Inferences
- The most "creative" designs are Spycraft (composable multi-part tool), Strata (3D stacking with a non-capacitive body), and The Heist (rotation as an optical angle). Most others use one piece as one tool or character.

### Gaps
- No Reddit, BoardGameGeek, or Hacker News threads were reached within budget. The Verge and Wired reviews weren't fetched.

## Q6. Physical dimensions

### Takeaway
Console dimensions are documented; piece dimensions are not published anywhere I found.

### Cited Findings
- Console: 25.7" × 13.9" × 1.5"; 23.8" 1920×1080 60 Hz optically bonded capacitive display; MediaTek Genio 700, 4 GB RAM, 64 GB storage plus SD; 19V/45W wall power; IP4X; removable wood-finish faceplate; USB-C and HDMI — [Docs: Hardware](https://docs.dev.board.fun/learn/hardware)
- Board Bases fit 25mm minis, one size only — [Wargamer D&D VTT](https://www.wargamer.com/board/dnd-virtual-tabletop)

### Inferences
- About 92.6 px per inch at 1080p on 23.8" (computed), useful for mapping a measured piece footprint to screen pixels.

### Gaps
- No diameter, height, or weight for any piece, and no glyph geometry. Measure with calipers.
