/** Scroll distance (px) for center → corner logo morph on home. */
export const HOME_MORPH_SCROLL_RANGE = 480;

/** Real navbar fades in from this progress through 1. */
export const HOME_NAVBAR_FADE_START_PROGRESS = 0.78;

/** Virtual logo reaches the left corner by this progress. */
export const HOME_VIRTUAL_LOGO_CORNER_END_PROGRESS = 0.88;

/** Virtual layer fades out from this progress to 1. */
export const HOME_VIRTUAL_LAYER_FADE_START_PROGRESS = 0.92;

export function homeMorphProgress(scrollY: number): number {
  return Math.min(1, Math.max(0, scrollY / HOME_MORPH_SCROLL_RANGE));
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
