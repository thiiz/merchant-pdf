import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function darkenColor(hex: string, percent: number): string {
  // Ensure hex is valid
  if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) return hex;

  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = Math.floor(r * (100 - percent) / 100);
  g = Math.floor(g * (100 - percent) / 100);
  b = Math.floor(b * (100 - percent) / 100);

  r = (r < 0) ? 0 : r;
  g = (g < 0) ? 0 : g;
  b = (b < 0) ? 0 : b;

  const rr = ((r.toString(16).length === 1) ? "0" + r.toString(16) : r.toString(16));
  const gg = ((g.toString(16).length === 1) ? "0" + g.toString(16) : g.toString(16));
  const bb = ((b.toString(16).length === 1) ? "0" + b.toString(16) : b.toString(16));

  return "#" + rr + gg + bb;
}
