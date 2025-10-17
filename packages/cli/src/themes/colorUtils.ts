export class ColorUtils {
  static clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
  }

  static hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '').trim();
    const v =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h;
    const r = parseInt(v.slice(0, 2), 16);
    const g = parseInt(v.slice(2, 4), 16);
    const b = parseInt(v.slice(4, 6), 16);
    return [r, g, b];
  }

  static rgbToHex(r: number, g: number, b: number): string {
    const toHex = (c: number) => {
      const h = this.clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0');
      return h;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Hex -> HSL
  static hexToHsl(hex: string): [number, number, number] {
    const [r8, g8, b8] = this.hexToRgb(hex);
    const r = r8 / 255;
    const g = g8 / 255;
    const b = b8 / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;
    const d = max - min;

    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  // HSL -> Hex
  static hslToHex(h: number, s: number, l: number): string {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return this.rgbToHex(r * 255, g * 255, b * 255);
  }

  // WCAG relative luminance
  static getLuminance(hex: string): number {
    const [r8, g8, b8] = this.hexToRgb(hex);
    const chan = [r8, g8, b8].map((c) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
  }

  static getContrastRatio(color1: string, color2: string): number {
    const L1 = this.getLuminance(color1);
    const L2 = this.getLuminance(color2);
    const bright = Math.max(L1, L2);
    const dark = Math.min(L1, L2);
    return (bright + 0.05) / (dark + 0.05);
  }

  static isAccessible(
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA',
    isLargeText = false
  ): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    const requirement = level === 'AAA' ? (isLargeText ? 4.5 : 7) : isLargeText ? 3 : 4.5;
    return ratio >= requirement;
  }

  static adjustLightness(hex: string, amount: number): string {
    const [h, s, l] = this.hexToHsl(hex);
    const newL = this.clamp(l + amount, 0, 100);
    return this.hslToHex(h, s, newL);
  }

  static adjustSaturation(hex: string, amount: number): string {
    const [h, s, l] = this.hexToHsl(hex);
    const newS = this.clamp(s + amount, 0, 100);
    return this.hslToHex(h, newS, l);
  }

  static adjustHue(hex: string, degrees: number): string {
    const [h, s, l] = this.hexToHsl(hex);
    const newH = (h + degrees + 360) % 360;
    return this.hslToHex(newH, s, l);
  }

  static getComplementary(hex: string): string {
    return this.adjustHue(hex, 180);
  }

  static getAnalogous(hex: string): [string, string] {
    return [this.adjustHue(hex, 30), this.adjustHue(hex, -30)];
  }

  static getTriadic(hex: string): [string, string] {
    return [this.adjustHue(hex, 120), this.adjustHue(hex, 240)];
  }
}
