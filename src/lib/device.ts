let renderer: string | null | undefined;

function gpuName() {
  if (renderer !== undefined || typeof document === 'undefined') return renderer ?? '';
  renderer = '';
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) return (renderer = null);
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    renderer = '';
  }
  return renderer;
}

let software: boolean | null = null;

/** True when there is no GPU behind WebGL (or no WebGL at all). The 3D scenes
 *  are swapped for still images then, so the page stays usable. */
export function isSoftwareGL() {
  if (software !== null) return software;
  if (typeof document === 'undefined') return false;
  if (new URLSearchParams(location.search).has('full3d')) return (software = false);
  if (new URLSearchParams(location.search).has('lite')) return (software = true);
  const name = gpuName();
  return (software = name === null || /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name));
}

export function isPhone() {
  return window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
}

export function isLowEnd() {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (nav.deviceMemory ?? 8) <= 2 || !!nav.connection?.saveData || isSoftwareGL();
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Camera at z=10 with a 45° lens sees 8.28 world units vertically. Under 7.5
 *  units of width there is no room for the desk-push story, so the hero is short. */
export const VIEW_UNITS = 8.2842712474619;
export function isNarrowStage(w = window.innerWidth, h = window.innerHeight) {
  return (w / h) * VIEW_UNITS < 7.5;
}
