/** @vitest-environment jsdom */

import { describe, expect, it, vi } from 'vitest';
import { contactCopy } from '../data/content';
import { pick } from './i18n';
import { contactFieldError, gateMailtoClick, messageValidity } from './contact-mail';

function mountForm() {
  document.body.innerHTML = `
    <form>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message"></textarea>
      <a href="mailto:info@anticobagliosiciliano.it">Apri in email</a>
    </form>
  `;
  const form = document.querySelector('form')!;
  const link = form.querySelector('a')!;
  const name = form.querySelector<HTMLInputElement>('[name="name"]')!;
  const email = form.querySelector<HTMLInputElement>('[name="email"]')!;
  const message = form.querySelector<HTMLTextAreaElement>('[name="message"]')!;
  return { form, link, name, email, message };
}

function clickMail(
  link: HTMLAnchorElement,
  dates: { checkIn: string; checkOut: string; datesUnavailable?: boolean },
  locale: 'it' | 'en' = 'it'
) {
  const preventDefault = vi.fn();
  let dateError = '';
  let fieldErrors: Record<string, string> = {};
  const allowed = gateMailtoClick(
    { preventDefault, currentTarget: link },
    {
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      requiredMessage: pick(contactCopy.fieldRequired, locale),
      datesUnavailable: dates.datesUnavailable,
      unavailableMessage: pick(contactCopy.occupancyBlocked, locale),
      fieldError: (el) =>
        contactFieldError(el, {
          required: pick(contactCopy.fieldRequired, locale),
          emailInvalid: pick(contactCopy.emailInvalid, locale),
          messageError: messageValidity(
            el instanceof HTMLTextAreaElement ? el.value : '',
            locale
          )
        }),
      setDateError: (msg) => {
        dateError = msg;
      },
      setFieldErrors: (next) => {
        fieldErrors = next;
      }
    }
  );
  return { allowed, preventDefault, dateError, fieldErrors };
}

describe('gateMailtoClick', () => {
  it('blocks an empty form and focuses the first invalid field', () => {
    const { link, name } = mountForm();
    const focus = vi.spyOn(name, 'focus');
    const result = clickMail(link, { checkIn: '', checkOut: '' });

    expect(result.allowed).toBe(false);
    expect(result.preventDefault).toHaveBeenCalledOnce();
    expect(focus).toHaveBeenCalledOnce();
    expect(result.fieldErrors.name).toBe('Compila questo campo.');
  });

  it('blocks a valid form when the stay dates are missing', () => {
    const { link, name, email } = mountForm();
    name.value = 'Maria';
    email.value = 'maria@example.com';
    const result = clickMail(link, { checkIn: '', checkOut: '' }, 'en');

    expect(result.allowed).toBe(false);
    expect(result.preventDefault).toHaveBeenCalledOnce();
    expect(result.dateError).toBe('Please fill in this field.');
    expect(result.fieldErrors).toEqual({});
  });

  it('blocks HTML in the message', () => {
    const { link, name, email, message } = mountForm();
    name.value = 'Maria';
    email.value = 'maria@example.com';
    message.value = '<img src=x>';
    const result = clickMail(link, { checkIn: '2026-08-20', checkOut: '2026-08-22' });

    expect(result.allowed).toBe(false);
    expect(result.preventDefault).toHaveBeenCalledOnce();
    expect(result.fieldErrors.message).toMatch(/HTML/);
  });

  it('lets a complete request through so the mailto link can open', () => {
    const { link, name, email } = mountForm();
    name.value = 'Maria';
    email.value = 'maria@example.com';
    const result = clickMail(link, { checkIn: '2026-08-20', checkOut: '2026-08-22' });

    expect(result.allowed).toBe(true);
    expect(result.preventDefault).not.toHaveBeenCalled();
    expect(result.dateError).toBe('');
    expect(result.fieldErrors).toEqual({});
  });

  it('blocks a stay that overlaps occupied nights', () => {
    const { link, name, email } = mountForm();
    name.value = 'Maria';
    email.value = 'maria@example.com';
    const result = clickMail(
      link,
      { checkIn: '2026-08-20', checkOut: '2026-08-22', datesUnavailable: true },
      'en'
    );

    expect(result.allowed).toBe(false);
    expect(result.preventDefault).toHaveBeenCalledOnce();
    expect(result.dateError).toBe(
      'These dates are unavailable. Choose another stay to request availability.'
    );
  });
});
