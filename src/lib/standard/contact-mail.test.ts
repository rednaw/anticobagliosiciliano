import { describe, expect, it } from 'vitest';
import { site } from '../data/content';
import {
	MESSAGE_MAX_LENGTH,
	acceptedHouseSlug,
	buildMailtoHref,
	housesFreeHint,
	messageValidity,
	type MailtoFields
} from './contact-mail';

function parseMailto(href: string) {
	const match = href.match(/^mailto:([^?]+)\?subject=([^&]+)&body=(.*)$/);
	if (!match) throw new Error(`not a mailto href: ${href}`);
	return {
		to: match[1],
		subject: decodeURIComponent(match[2]),
		body: decodeURIComponent(match[3])
	};
}

function draft(overrides: Partial<MailtoFields> = {}): MailtoFields {
	return {
		locale: 'it',
		name: 'Maria Rossi',
		email: 'maria@example.com',
		houseSlug: '',
		checkIn: '2026-08-20',
		checkOut: '2026-08-22',
		adults: '2',
		children: '1',
		message: 'Lettino per il bambino',
		...overrides
	};
}

describe('acceptedHouseSlug', () => {
	it('keeps a real house and ignores junk', () => {
		expect(acceptedHouseSlug('casa-2')).toBe('casa-2');
		expect(acceptedHouseSlug('casa-99')).toBe('');
		expect(acceptedHouseSlug('')).toBe('');
		expect(acceptedHouseSlug('../etc')).toBe('');
	});
});

describe('messageValidity', () => {
	it('accepts a plain note', () => {
		expect(messageValidity('Arrivo verso le 16', 'it')).toBe('');
	});

	it('rejects HTML-ish markup and hidden characters', () => {
		expect(messageValidity('<script', 'en')).toBe(
			'Please use plain text only — no HTML or hidden special characters.'
		);
		expect(messageValidity('ok </div>', 'it')).toMatch(/HTML/);
		expect(messageValidity('hide\u200Bden', 'it')).toMatch(/HTML/);
		expect(messageValidity('rtl\u202E', 'en')).toMatch(/plain text/);
	});

	it('rejects a note over the character cap', () => {
		expect(messageValidity('x'.repeat(MESSAGE_MAX_LENGTH), 'it')).toBe('');
		expect(messageValidity('x'.repeat(MESSAGE_MAX_LENGTH + 1), 'en')).toBe(
			'The message can be at most 500 characters.'
		);
	});
});

describe('buildMailtoHref', () => {
	it('writes Italian labels, CRLF body lines, and the baglio address', () => {
		const href = buildMailtoHref(draft());
		expect(href).toContain('%0D%0A');

		const mail = parseMailto(href);
		expect(mail.to).toBe(site.email);
		expect(mail.subject).toBe('Richiesta disponibilità — Maria Rossi');
		expect(mail.body.split('\r\n')).toEqual([
			'Nome: Maria Rossi',
			'Email: maria@example.com',
			'Alloggio: (nessuna preferenza)',
			'Check-in: 2026-08-20',
			'Check-out: 2026-08-22',
			'Adulti: 2',
			'Bambini: 1',
			'',
			'Lettino per il bambino'
		]);
	});

	it('names the house in the subject and body, and uses English copy', () => {
		const mail = parseMailto(
			buildMailtoHref(
				draft({
					locale: 'en',
					houseSlug: 'casa-1',
					message: ''
				})
			)
		);
		expect(mail.subject).toBe('Request availability — Casa 1 — Maria Rossi');
		expect(mail.body).toContain('Accommodation: Casa 1');
		expect(mail.body).toContain('(no message)');
		expect(mail.body).toContain('Adults: 2');
	});

	it('falls back to Guest when the name is empty', () => {
		const mail = parseMailto(buildMailtoHref(draft({ name: '', locale: 'en' })));
		expect(mail.subject).toBe('Request availability — Guest');
		expect(mail.body.startsWith('Name: \r\n')).toBe(true);
	});

	it('names free houses for the form when dates are set, and not for the mailto', () => {
		expect(housesFreeHint('en', ['casa-3', 'casa-4'])).toBe(
			'These dates are free for Casa 3 and Casa 4.'
		);
		expect(housesFreeHint('it', ['casa-3', 'casa-4'])).toBe(
			'In queste date sono libere Casa 3 e Casa 4.'
		);
		expect(housesFreeHint('it', [])).toBe('');

		const mail = parseMailto(
			buildMailtoHref(
				draft({
					houseSlug: '',
					checkIn: '2026-08-24',
					checkOut: '2026-08-26'
				})
			)
		);
		expect(mail.body).not.toMatch(/libere|free for/);
	});

	it('keeps spaces and accents through encoding', () => {
		const href = buildMailtoHref(draft({ name: 'Niccolò Bianchi' }));
		expect(href).toContain(encodeURIComponent('Niccolò Bianchi'));
		expect(parseMailto(href).subject).toContain('Niccolò Bianchi');
	});
});
