// Board space: the device reports contacts in display pixels on a 1920x1080
// landscape surface (Y-down, top-left origin). Games draw in board space and
// this helper letterboxes it into whatever window we're in, so the same code
// runs on the Board (where the window *is* 1920x1080) and in a desktop browser.

export const BOARD_W = 1920;
export const BOARD_H = 1080;

/** Physical size of the Board's display, for rough real-world sizing. */
export const BOARD_DIAGONAL_IN = 23.8;
/** ~92.6 px per inch on a 23.8" 1080p panel. */
export const PX_PER_INCH = Math.hypot(BOARD_W, BOARD_H) / BOARD_DIAGONAL_IN;

export interface Space {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /** Board px -> canvas px multiplier. */
  scale: number;
  offsetX: number;
  offsetY: number;
  /** Convert a pointer position (clientX/Y) into board coordinates. */
  toBoard(clientX: number, clientY: number): { x: number; y: number };
  /** Reset the transform so drawing calls use board coordinates. */
  begin(): void;
}

export function createSpace(canvas: HTMLCanvasElement): Space {
  const ctx = canvas.getContext("2d")!;
  const space: Space = {
    canvas,
    ctx,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    toBoard(clientX, clientY) {
      const dpr = window.devicePixelRatio || 1;
      return {
        x: (clientX * dpr - space.offsetX) / space.scale,
        y: (clientY * dpr - space.offsetY) / space.scale,
      };
    },
    begin() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(space.scale, 0, 0, space.scale, space.offsetX, space.offsetY);
    },
  };

  const resize = (): void => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    space.scale = Math.min(canvas.width / BOARD_W, canvas.height / BOARD_H);
    space.offsetX = (canvas.width - BOARD_W * space.scale) / 2;
    space.offsetY = (canvas.height - BOARD_H * space.scale) / 2;
  };
  resize();
  window.addEventListener("resize", resize);
  return space;
}
