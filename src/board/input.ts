import { Board, BoardContactPhase, type BoardContact } from "@board.fun/web-sdk";
import { startSimulator, type Simulator } from "./sim";
import type { Space } from "./space";

// One input source for every game: real Board contacts on the device, the
// desktop Piece Simulator everywhere else. On top of the raw per-frame
// snapshot it computes the edge events games actually want, so nobody has to
// hand-roll contactId diffing again.

export interface PieceEvent {
  contact: BoardContact;
}

export interface InputFrame {
  /** Every active contact this frame (Ended contacts removed). */
  contacts: BoardContact[];
  /** Pieces (glyphId > 0) only. */
  pieces: BoardContact[];
  /** Fingers (glyphId === 0) only. */
  fingers: BoardContact[];
  placed: BoardContact[]; // piece set down on the board
  lifted: BoardContact[]; // piece picked up off the board
  grabbed: BoardContact[]; // hand touched a resting piece
  released: BoardContact[]; // hand let go of a piece
  taps: BoardContact[]; // finger down
}

export interface InputSource {
  latest: InputFrame;
  simulator: Simulator | null;
  onFrame(cb: (f: InputFrame) => void): void;
}

const EMPTY: InputFrame = {
  contacts: [], pieces: [], fingers: [],
  placed: [], lifted: [], grabbed: [], released: [], taps: [],
};

export function startInput(space: Space): InputSource {
  const listeners: ((f: InputFrame) => void)[] = [];
  const prevTouched = new Map<number, boolean>();

  const handle = (snapshot: ReadonlyArray<BoardContact>): void => {
    const f: InputFrame = {
      contacts: [], pieces: [], fingers: [],
      placed: [], lifted: [], grabbed: [], released: [], taps: [],
    };
    const seen = new Set<number>();
    for (const c of snapshot) {
      const isPiece = c.glyphId > 0;
      const gone = c.phase === BoardContactPhase.Ended || c.phase === BoardContactPhase.Canceled;
      const known = prevTouched.has(c.contactId);
      if (gone) {
        if (isPiece) f.lifted.push(c);
        prevTouched.delete(c.contactId);
        continue;
      }
      seen.add(c.contactId);
      f.contacts.push(c);
      (isPiece ? f.pieces : f.fingers).push(c);
      if (!known) {
        if (isPiece) f.placed.push(c);
        else f.taps.push(c);
      } else if (isPiece) {
        const was = prevTouched.get(c.contactId)!;
        if (c.isTouched && !was) f.grabbed.push(c);
        if (!c.isTouched && was) f.released.push(c);
      }
      prevTouched.set(c.contactId, c.isTouched);
    }
    // Contacts that vanished without an Ended frame count as lifted.
    for (const id of [...prevTouched.keys()]) {
      if (!seen.has(id)) prevTouched.delete(id);
    }
    source.latest = f;
    for (const l of listeners) l(f);
  };

  const source: InputSource = {
    latest: EMPTY,
    simulator: null,
    onFrame(cb) {
      listeners.push(cb);
    },
  };

  if (Board.isOnDevice) {
    Board.input.subscribe(handle);
  } else {
    source.simulator = startSimulator(space, handle);
  }
  return source;
}
