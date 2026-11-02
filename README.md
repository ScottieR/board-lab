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

Prototypes: `#night-lights` (default) · `#sandbox` (contact debugger).

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
src/games/           one file per prototype, each implements Game { update, draw }
docs/GAME_IDEAS.md   the game backlog
docs/PIECES_AND_PRINTING.md   custom pieces & 3D-printed shells
```

Add a game: create `src/games/<name>.ts` exporting a `Game`, register it in `GAMES` in `src/main.ts`.
