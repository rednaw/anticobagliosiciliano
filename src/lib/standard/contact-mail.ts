import { contactCopy, housesSource, site } from '$lib/data/content';
import { pick, ui, type Locale } from '$lib/standard/i18n';

export const MESSAGE_MAX_LENGTH = 500;

const DISALLOWED_CHARS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/;
const HTML_MARKUP = /<\s*\/?\s*[a-zA-Z!?]/;

export type MailtoFields = {
  locale: Locale;
  name: string;
  email: string;
  houseSlug: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  message: string;
};

/** Known house from `?casa=`, otherwise empty (no preference). */
export function acceptedHouseSlug(requested: string): string {
  return housesSource.some((house) => house.slug === requested) ? requested : '';
}

export function messageValidity(value: string, locale: Locale): string {
  if (value.length > MESSAGE_MAX_LENGTH) return pick(contactCopy.messageTooLong, locale);
  if (DISALLOWED_CHARS.test(value) || HTML_MARKUP.test(value)) {
    return pick(contactCopy.messageUnsafe, locale);
  }
  return '';
}

export function contactFieldError(
  el: HTMLInputElement | HTMLTextAreaElement,
  copy: { required: string; emailInvalid: string; messageError: string }
): string {
  if (el.validity.valueMissing) return copy.required;
  if (el.validity.typeMismatch) return copy.emailInvalid;
  if (el.name === 'message') return copy.messageError;
  return '';
}

/**
 * Translated validity, then either allow the mailto link or cancel it.
 * Dates are not native inputs, so they are checked separately from `form.checkValidity()`.
 */
export function gateMailtoClick(
  event: { preventDefault: () => void; currentTarget: EventTarget | null },
  options: {
    checkIn: string;
    checkOut: string;
    requiredMessage: string;
    datesUnavailable?: boolean;
    unavailableMessage?: string;
    fieldError: (el: HTMLInputElement | HTMLTextAreaElement) => string;
    setDateError: (message: string) => void;
    setFieldErrors: (errors: Record<string, string>) => void;
  }
): boolean {
  const target = event.currentTarget;
  if (!(target instanceof Element)) return true;
  const form = target.closest('form');
  if (!form) return true;

  const fieldErrors: Record<string, string> = {};
  for (const el of form.elements) {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) continue;
    const message = options.fieldError(el);
    el.setCustomValidity(message);
    if (message && el.name) fieldErrors[el.name] = message;
  }

  const dateError =
    !options.checkIn || !options.checkOut
      ? options.requiredMessage
      : options.datesUnavailable
        ? (options.unavailableMessage ?? options.requiredMessage)
        : '';
  options.setDateError(dateError);
  options.setFieldErrors(fieldErrors);

  const valid = form.checkValidity();
  if (valid && !dateError) return true;

  event.preventDefault();
  const firstInvalid = [...form.elements].find(
    (el) =>
      (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && !el.validity.valid
  );
  if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
  return false;
}

function houseName(slug: string): string {
  return housesSource.find((house) => house.slug === slug)?.name ?? slug;
}

function joinHouseNames(slugs: readonly string[], locale: Locale): string {
  const names = slugs.map(houseName);
  if (names.length <= 1) return names[0] ?? '';
  const last = names.at(-1)!;
  const rest = names.slice(0, -1).join(', ');
  return locale === 'it' ? `${rest} e ${last}` : `${rest} and ${last}`;
}

export function housesFreeHint(locale: Locale, slugs: readonly string[]): string {
  if (!slugs.length) return '';
  return pick(contactCopy.housesFreeHint, locale).replace('{houses}', joinHouseNames(slugs, locale));
}

export function buildMailtoHref(fields: MailtoFields): string {
  const t = (key: keyof typeof contactCopy) => pick(contactCopy[key], fields.locale);
  const heading = pick(ui.requestAvailability, fields.locale);
  const selectedHouse = housesSource.find((house) => house.slug === fields.houseSlug);
  const houseLabel = selectedHouse?.name ?? t('mailNoHouse');
  const subject = encodeURIComponent(
    selectedHouse
      ? `${heading} — ${selectedHouse.name} — ${fields.name || t('mailGuest')}`
      : `${heading} — ${fields.name || t('mailGuest')}`
  );
  const lines = [
    `${t('mailName')}: ${fields.name}`,
    `${t('mailEmail')}: ${fields.email}`,
    `${t('mailHouse')}: ${houseLabel}`,
    `${t('checkIn')}: ${fields.checkIn}`,
    `${t('checkOut')}: ${fields.checkOut}`,
    `${t('adults')}: ${fields.adults}`,
    `${t('children')}: ${fields.children}`,
    '',
    fields.message || t('mailNoMessage')
  ];
  const body = encodeURIComponent(lines.join('\n').replace(/\r\n|\n|\r/g, '\r\n'));
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}
