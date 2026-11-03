# Board Lab

Family game prototypes for [Board](https://board.fun), the tabletop console that tracks physical pieces on a 24" touchscreen. Built on the official [`@board.fun/web-sdk`](https://docs.dev.board.fun/web/getting-started/quick-start) (TypeScript + Vite).

## Run it (no Board needed)

```bash
npm install
npm run dev
```

Open the URL Vite prints. The **Piece Simulator** fakes Board input in the browser with the exact contact shape the SDK sends:

| Do | Control |
|---|---|
| Drop a piece with glyph id N | press `1`–`9` |
| Move | drag |
| Rotate | mouse wheel (`Shift` = fine) |
| Hand resting on piece (`isTouched`) | `H` |
| Lift a piece | right-click or `Backspace` |
| Finger touch | click empty space |
| Clear / hide help | `C` / `?` |

Games: `#night-lights` (default) · `#peek-park` · `#fizz-lab` · `#sandbox` (contact debugger).

| Game | Try it in the simulator |
|---|---|
| **Night Lights** — find critters in the dark | drop pieces (`1`–`9`) and scroll to turn their beams; owls need two beams |
| **Peek Park** — Where's Waldo with a magnifier | drop a piece and drag it over the park; centre a wanted character and hold |
| **Fizzwick's Lab** — mad-scientist discovery | drop `1` (water) next to `2` (fire), scroll over one to pour → steam |

## Run it on the Board

1. Download a **Piece Set Model** from the [developer portal](https://dev.board.fun) and save it as `public/model.tflite` (never committed).
2. Install Board Connect: `curl -fsSL https://dev.board.fun/connect/install | sh`
3. ```bash
   npm run pack                                  # → board-lab.webapp.zip
   board-connect pair <board-ip>                 # once; tap Approve on the Board
   board-connect install board-lab.webapp.zip --launch
   board-connect logs <appId> --follow           # appId is in board.config.json after first pack
   ```
On the device, switch prototypes from the pause menu.

## Layout

```
src/board/space.ts   1920×1080 board space, letterboxing, px-per-inch
src/board/sim.ts     desktop Piece Simulator
src/board/input.ts   one input source (device or sim) + placed/lifted/grabbed/released/tap events
src/engine/          the game engine: world, juice (fx), sound (sfx), seats, art kit + style cards
src/engine/verbs/    the verb library (beam, find, loupe, hunt, mix, …) — 11 built, 25 designed
src/engine/archetypes.ts   18 game archetypes: loop, Board hook, fun targets, littlest role, skeleton
src/recipes/         games built from verbs
src/games/           hand-written games (sandbox)
scripts/playtest.py  scripted headless playtest of every game (the start of the Studio check loop)
docs/GAME_IDEAS.md   35 ideas ranked by fun × Board fit × doability (from docs/ideas.json)
docs/DESIGN_CODEX.md taste + fun rules every game is reviewed against
docs/research/FUN_RESEARCH.md   what makes games fun — sources and findings
docs/PIECES_AND_PRINTING.md     custom pieces & 3D-printed shells
```

Add a game: write a recipe in `src/recipes/` (or a hand-written `Game` in `src/games/`) and register it in `GAMES` in `src/main.ts`. Check it with `python3 scripts/playtest.py`.
