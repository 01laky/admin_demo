import { describe, expect, it } from 'vitest';
import { mapOperatorUserChatHubError } from '../operatorUserChatHubErrors';

const t = (key: string) => key;

describe('mapOperatorUserChatHubError', () => {
	it('maps known codes', () => {
		expect(mapOperatorUserChatHubError(t, 'rate_limited')).toBe(
			'pages.userChat.hub.errors.rate_limited'
		);
	});

	it('falls back for unknown', () => {
		expect(mapOperatorUserChatHubError(t, 'nope')).toBe('pages.userChat.hub.errors.unknown');
	});
});
