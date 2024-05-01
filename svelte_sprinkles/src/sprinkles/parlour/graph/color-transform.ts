export function hsvToRgb(obj: { h: number, s: number, v: number }): number;
export function hsvToRgb(h: number, s: number, v: number): number;

export function hsvToRgb(h: number | { h: number, s: number, v: number }, s?: number, v?: number) {
  let r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;
  if (typeof h === 'object') {
    s = h.s; v = h.v; h = h.h;
  } else {
    s = s as number;
    v = v as number;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v; g = t; b = p;
      break;
    case 1:
      r = q; g = v; b = p;
      break;
    case 2:
      r = p; g = v; b = t;
      break;
    case 3:
      r = p; g = q; b = v;
      break;
    case 4:
      r = t; g = p; b = v;
      break;
    case 5:
      r = v; g = p; b = q;
      break;
    default:
      throw Error('Modulo went wrong');
  }
  return Math.round(r * 255) << 16 | Math.round(g * 255) << 8 | Math.round(b * 255);
}

export function hsvToRgbString(h: number, s: number, v: number) {
  return `#${hsvToRgb(h, s, v).toString(16)}`;
}
