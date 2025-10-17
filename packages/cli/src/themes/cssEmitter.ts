import type { ThemeConfig } from '../types/theme';
import { mapToIgnixTokens } from './mapToTokens';

export function toCssVars(theme: ThemeConfig): string {
  const light = mapToIgnixTokens(theme.colors);
  const lightLines = Object.entries(light).map(([k, v]) => `  ${k}: ${v};`);
  let css = `:root {\n${lightLines.join('\n')}\n}\n`;

  if (theme.dark) {
    const dark = mapToIgnixTokens(theme.dark);
    const darkLines = Object.entries(dark).map(([k, v]) => `  ${k}: ${v};`);
    css += `.dark {\n${darkLines.join('\n')}\n}\n`;
  }
  return css;
}
