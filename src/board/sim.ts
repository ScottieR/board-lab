import {
  BoardContactPhase,
  BoardContactType,
  type BoardContact,
} from "@board.fun/web-sdk";
import type { Space } from "./space";

// Desktop Piece Simulator
// -----------------------
// Board input only exists on the device, so this fakes it in a browser with
// the exact same per-frame snapshot shape the SDK delivers. Games never know
// the difference.
//
// Controls (shown in the on-screen help, toggle with ?):
//   1-9        drop a Piece with that glyphId under the mouse
//   drag       move a Piece (it reports isTouched=true while held)
//   wheel      rotate the Piece under the mouse (Shift = fine)
//   H          toggle "hand resting on" the Piece under the mouse
//   right-click / Backspace   lift the Piece under the mouse
//   click empty space         finger touch
//   C          clear the table

const PIECE_RADIUS = 84; // board px; matches the SDK sample's piece disc

interface SimPiece {
  contactId: number;
  glyphId: number;
  x: number;
  y: number;
  orientation: number;
  held: boolean; // toggled with H
  dragging: boolean;
  isNew: boolean;
  dirty: boolean;
}

export interface Simulator {
  /** Draw the simulator's ghost of each Piece (call after the game draws). */
  drawOverlay(ctx: CanvasRenderingContext2D): void;
}

export function startSimulator(
  space: Space,
  onFrame: (contacts: ReadonlyArray<BoardContact>) => void,
): Simulator {
  let nextId = 1000;
  const pieces: SimPiece[] = [];
  const ended: BoardContact[] = [];
  let finger: { contactId: number; x: number; y: number; isNew: boolean; dirty: boolean } | null = null;
  let mouse = { x: BOARD_CENTER.x, y: BOARD_CENTER.y };
  let drag: { piece: SimPiece; dx: number; dy: number } | null = null;

  const hit = (x: number, y: number): SimPiece | undefined => {
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      if (Math.hypot(p.x - x, p.y - y) <= PIECE_RADIUS) return p;
    }
    return undefined;
  };

  const toContact = (p: SimPiece, phase: BoardContactPhase): BoardContact =>
    ({
      contactId: p.contactId,
      type: BoardContactType.Glyph,
      glyphId: p.glyphId,
      x: p.x,
      y: p.y,
      orientation: p.orientation,
      phase,
      isTouched: p.held || p.dragging,
    }) as BoardContact;

  const lift = (p: SimPiece): void => {
    pieces.splice(pieces.indexOf(p), 1);
    ended.push(toContact(p, BoardContactPhase.Ended));
    if (drag?.piece === p) drag = null;
  };

  const canvas = space.canvas;
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  canvas.addEventListener("pointerdown", (e) => {
    const b = space.toBoard(e.clientX, e.clientY);
    const p = hit(b.x, b.y);
    if (e.button === 2) {
      if (p) lift(p);
      return;
    }
    if (p) {
      drag = { piece: p, dx: p.x - b.x, dy: p.y - b.y };
      p.dragging = true;
      p.dirty = true;
      // bring to front
      pieces.splice(pieces.indexOf(p), 1);
      pieces.push(p);
    } else {
      finger = { contactId: nextId++, x: b.x, y: b.y, isNew: true, dirty: true };
    }
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", (e) => {
    mouse = space.toBoard(e.clientX, e.clientY);
    if (drag) {
      drag.piece.x = mouse.x + drag.dx;
      drag.piece.y = mouse.y + drag.dy;
      drag.piece.dirty = true;
    } else if (finger) {
      finger.x = mouse.x;
      finger.y = mouse.y;
      finger.dirty = true;
    }
  });

  const release = (): void => {
    if (drag) {
      drag.piece.dragging = false;
      drag.piece.dirty = true;
      drag = null;
    }
    if (finger) {
      ended.push({
        contactId: finger.contactId,
        type: BoardContactType.Finger,
        glyphId: 0,
        x: finger.x,
        y: finger.y,
        orientation: 0,
        phase: BoardContactPhase.Ended,
        isTouched: false,
      } as BoardContact);
      finger = null;
    }
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  canvas.addEventListener(
    "wheel",
    (e) => {
      const p = drag?.piece ?? hit(mouse.x, mouse.y);
      if (!p) return;
      e.preventDefault();
      const step = e.shiftKey ? 3 : 15;
      p.orientation = (((p.orientation + Math.sign(e.deltaY) * step) % 360) + 360) % 360;
      p.dirty = true;
    },
    { passive: false },
  );

  window.addEventListener("keydown", (e) => {
    if (e.key >= "1" && e.key <= "9") {
      pieces.push({
        contactId: nextId++,
        glyphId: Number(e.key),
        x: mouse.x,
        y: mouse.y,
        orientation: 0,
        held: false,
        dragging: false,
        isNew: true,
        dirty: true,
      });
    } else if (e.key === "h" || e.key === "H") {
      const p = hit(mouse.x, mouse.y);
      if (p) {
        p.held = !p.held;
        p.dirty = true;
      }
    } else if (e.key === "Backspace" || e.key === "Delete") {
      const p = hit(mouse.x, mouse.y);
      if (p) lift(p);
    } else if (e.key === "c" || e.key === "C") {
      [...pieces].forEach(lift);
    } else if (e.key === "?") {
      help.hidden = !help.hidden;
    }
  });

  const help = document.createElement("div");
  help.className = "sim-help";
  help.innerHTML = `<b>Piece Simulator</b> (desktop only · <kbd>?</kbd> to hide)<br>
    <kbd>1</kbd>–<kbd>9</kbd> drop Piece with that glyph id &nbsp;·&nbsp; drag to move<br>
    wheel rotate (<kbd>Shift</kbd> fine) &nbsp;·&nbsp; <kbd>H</kbd> hand on/off<br>
    right-click / <kbd>⌫</kbd> lift &nbsp;·&nbsp; click empty = finger &nbsp;·&nbsp; <kbd>C</kbd> clear`;
  document.body.appendChild(help);

  // Emit one snapshot per animation frame, like the device (~60fps).
  const tick = (): void => {
    const frame: BoardContact[] = [...ended];
    ended.length = 0;
    for (const p of pieces) {
      const phase = p.isNew
        ? BoardContactPhase.Began
        : p.dirty
          ? BoardContactPhase.Moved
          : BoardContactPhase.Stationary;
      frame.push(toContact(p, phase));
      p.isNew = false;
      p.dirty = false;
    }
    if (finger) {
      frame.push({
        contactId: finger.contactId,
        type: BoardContactType.Finger,
        glyphId: 0,
        x: finger.x,
        y: finger.y,
        orientation: 0,
        phase: finger.isNew
          ? BoardContactPhase.Began
          : finger.dirty
            ? BoardContactPhase.Moved
            : BoardContactPhase.Stationary,
        isTouched: true,
      } as BoardContact);
      finger.isNew = false;
      finger.dirty = false;
    }
    onFrame(frame);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  return {
    drawOverlay(ctx) {
      for (const p of pieces) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.orientation * Math.PI) / 180);
        ctx.beginPath();
        ctx.arc(0, 0, PIECE_RADIUS, 0, Math.PI * 2);
        ctx.strokeStyle = p.held || p.dragging ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)";
        ctx.lineWidth = p.held || p.dragging ? 5 : 3;
        ctx.setLineDash([10, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
        // facing notch
        ctx.beginPath();
        ctx.moveTo(PIECE_RADIUS - 18, -12);
        ctx.lineTo(PIECE_RADIUS + 6, 0);
        ctx.lineTo(PIECE_RADIUS - 18, 12);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();
        ctx.rotate(-(p.orientation * Math.PI) / 180);
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.font = "bold 20px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`#${p.glyphId}`, 0, PIECE_RADIUS + 22);
        ctx.restore();
      }
    },
  };
}

const BOARD_CENTER = { x: 960, y: 540 };
