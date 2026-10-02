/**
 * Horizontal scrolling that works in both directions. In right-to-left pages browsers report
 * `scrollLeft` from 0 (start, on the right) down to negative values, so edge checks use its
 * absolute value and "forward" deltas are flipped.
 */

/** Whether the scroller is at its start / end edge (tolerance in px). */
export function scrollEdges(el: HTMLElement, tolerance = 4) {
  const pos = Math.abs(el.scrollLeft);
  return { start: pos <= tolerance, end: pos + el.clientWidth >= el.scrollWidth - tolerance };
}

/** +1 in left-to-right, −1 in right-to-left: multiply a "towards the end" scroll delta by this. */
export const inlineSign = (el: HTMLElement) => (getComputedStyle(el).direction === "rtl" ? -1 : 1);
