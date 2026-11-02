import { Board } from "@board.fun/web-sdk";
import { startInput } from "./board/input";
import { createSpace } from "./board/space";
import { createNightLights } from "./games/night-lights";
import { createSandbox } from "./games/sandbox";
import type { Game } from "./games/types";

// Board Lab — a host for quick game prototypes.
// Pick a prototype with the URL hash in the browser (#sandbox, #night-lights)
// or with the pause menu's custom buttons on the device.

const GAMES: Record<string, () => Game> = {
  "night-lights": createNightLights,
  sandbox: createSandbox,
};
const DEFAULT_GAME = "night-lights";

const space = createSpace(document.getElementById("game") as HTMLCanvasElement);
const input = startInput(space);

let game: Game = load(location.hash.slice(1));

function load(id: string): Game {
  return (GAMES[id] ?? GAMES[DEFAULT_GAME])();
}
window.addEventListener("hashchange", () => {
  game = load(location.hash.slice(1));
});

input.onFrame((f) => {
  // Update on each input frame; drawing happens on animation frames below.
  pending = f;
});
let pending = input.latest;

let last = performance.now();
function loop(now: number): void {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  game.update(pending, dt);
  // Edge events (placed/lifted/...) are one-shot; don't replay them next frame.
  pending = { ...pending, placed: [], lifted: [], grabbed: [], released: [], taps: [] };
  space.begin();
  game.draw(space.ctx);
  input.simulator?.drawOverlay(space.ctx);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

if (Board.isOnDevice) {
  Board.pause.setContext({
    gameName: "Board Lab",
    offerSaveOption: false,
    customButtons: Object.keys(GAMES).map((id) => ({
      id,
      title: GAMES[id]().name,
      icon: "",
    })),
  });
  Board.pause.onResult((result) => {
    if (result.action === "custom_button" && result.customButtonId) {
      game = load(result.customButtonId);
    } else if (result.action === "quit" || result.action === "save_and_quit") {
      Board.application.quit();
    }
  });
}
