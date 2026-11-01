import type { LanguageCode } from '@/i18n';
import { hotelNavigationMessages } from '@/data/hotelNavigationTranslations';
import { SITE_MESSAGES } from './messages';

type LegacyMessages = Record<string, Record<LanguageCode, string>>;
const columns: Record<LanguageCode, number> = { uz: 0, en: 1, ru: 2, fr: 3, de: 4 };
const normalize = (text: string) => text.trim().replace(/[‘’ʻʼ`]/g, "'").replace(/\s+/g, ' ').toLocaleLowerCase();
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cache = new WeakMap<LegacyMessages, Map<LanguageCode, { messages: Map<string, string>; phrases: RegExp }>>();

function dictionary(locale: LanguageCode, legacy: LegacyMessages) {
  let locales = cache.get(legacy);
  if (!locales) { locales = new Map(); cache.set(legacy, locales); }
  let result = locales.get(locale);
  if (!result) {
    const messages = new Map<string, string>();
    for (const values of Object.values(legacy)) if (values.uz && values[locale]) messages.set(normalize(values.uz), values[locale]);
    for (const row of [...hotelNavigationMessages, ...SITE_MESSAGES]) messages.set(normalize(row[0]), row[columns[locale]]);
    const patterns = [...messages.keys()].sort((a, b) => b.length - a.length).map((key) => escape(key).replaceAll("'", "['‘’ʻʼ]").replaceAll(' ', '\\s+'));
    result = { messages, phrases: new RegExp(`(?<![\\p{L}\\p{N}_'‘’ʻʼ\\x60])(?:${patterns.join('|')})(?![\\p{L}\\p{N}_'‘’ʻʼ\\x60])`, 'giu') };
    locales.set(locale, result);
  }
  return result;
}

function casing(source: string, translated: string) {
  return /\p{L}/u.test(source) && source === source.toLocaleUpperCase() ? translated.toLocaleUpperCase() : translated;
}

export function translateSiteText(value: string, locale: LanguageCode, legacy: LegacyMessages): string {
  if (locale === 'uz') return value === 'Close' ? 'Yopish' : value;
  // URLs, email addresses and personal identifiers must remain intact.
  if (/^(https?:|mailto:|tel:)/i.test(value) || /^[^\s@]+@[^\s@]+$/.test(value.trim())) return value;
  const match = value.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  const [, leading, core, trailing] = match;
  if (!core || !/\p{L}/u.test(core)) return value;
  const { messages, phrases } = dictionary(locale, legacy);
  let translated = messages.get(normalize(core));
  if (translated !== undefined) return leading + casing(core, translated) + trailing;
  const punctuation = core.match(/^(.*?)([.:!?])$/);
  if (punctuation) {
    const label = messages.get(normalize(punctuation[1]));
    if (label !== undefined) return leading + casing(punctuation[1], label) + punctuation[2] + trailing;
  }
  translated = core.replace(/(\d[\d\s.,]*)\s+so['‘’ʻʼ]?m\b/gu, (_whole, amount: string) => {
    const number = Number(amount.replace(/[\s,]/g, ''));
    const unit = locale === 'ru' ? 'сум' : 'UZS';
    return Number.isFinite(number) ? `${new Intl.NumberFormat(locale).format(number)} ${unit}` : `${amount} ${unit}`;
  });
  // Compose dynamic labels (room counts, dates, aria labels and result summaries)
  // from the same phrase dictionary without changing stored values or identifiers.
  translated = translated.replace(phrases, (phrase) => casing(phrase, messages.get(normalize(phrase)) ?? phrase));
  return leading + translated + trailing;
}
