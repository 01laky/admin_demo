import { describe, expect, it } from 'vitest';
import { appendUserChatMessage } from '../userChatMessageMerge';

describe('appendUserChatMessage', () => {
	const base = {
		id: 1,
		senderId: 'a',
		senderName: 'A',
		senderGlobalRole: null,
		isPlatformAdministrator: false,
		content: 'hi',
		sentAt: '2026-01-01T00:00:00Z',
		readAt: null,
	};

	it('appends new message', () => {
		const next = appendUserChatMessage([base], { ...base, id: 2, content: 'bye' });
		expect(next).toHaveLength(2);
	});

	it('dedupes by positive id', () => {
		const next = appendUserChatMessage([base], { ...base, id: 1, content: 'dup' });
		expect(next).toHaveLength(1);
		expect(next[0].content).toBe('hi');
	});
});
