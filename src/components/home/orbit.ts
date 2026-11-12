/** Shared between the DOM (drag) and the 3D ring (spin). Plain mutable state. */
export const orbit = {
  /** extra spin from dragging, radians per second */
  velocity: 0,
  dragging: false,
};
