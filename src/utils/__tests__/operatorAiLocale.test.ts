import { describe, expect, it } from 'vitest';
import { formatLocaleBadge, formatMessageHeader } from '../operatorAiLocale';

const t = (key: string) => {
	if (key === 'pages.chat.you') return 'You';
	if (key === 'pages.chat.ai') return 'AI';
	if (key === 'pages.chat.localeUnknown') return '—';
	if (key.startsWith('pages.chat.localeBadge.')) return key.split('.').pop()!.toUpperCase();
	return key;
};

describe('operatorAiLocale', () => {
	it('formatLocaleBadge returns uppercase fallback', () => {
		expect(formatLocaleBadge(t, 'en')).toBe('EN');
	});

	it('formatMessageHeader for user includes email and locale', () => {
		const header = formatMessageHeader(
			t,
			{
				id: 1,
				role: 'user',
				content: 'Hi',
				authorEmail: 'admin@admin.com',
				responseLocale: 'en',
				createdAt: '2026-05-18T15:00:00.000Z',
			},
			'en'
		);
		expect(header).toContain('admin@admin.com');
		expect(header).toContain('EN');
	});

	it('formatMessageHeader for assistant uses AI label', () => {
		const header = formatMessageHeader(
			t,
			{
				id: 2,
				role: 'ai',
				content: 'Hello',
				responseLocale: 'sk',
				createdAt: '2026-05-18T15:01:00.000Z',
			},
			'en'
		);
		expect(header.startsWith('AI')).toBe(true);
		expect(header).toContain('SK');
	});
});
