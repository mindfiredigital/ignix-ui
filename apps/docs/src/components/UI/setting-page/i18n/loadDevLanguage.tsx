type Dictionary = Record<string, string>;

const cache: Record<string, Dictionary> = {};

export async function loadDevLanguage(
  lang: string
): Promise<Dictionary> {
  if (cache[lang]) return cache[lang];

  try {
    const module = await import(`./demo/${lang}.json`);
    cache[lang] = module.default;
    return cache[lang];
  } catch (err) {
    console.warn(`[i18n] Missing translation for "${lang}"`);
    return {};
  }
}
