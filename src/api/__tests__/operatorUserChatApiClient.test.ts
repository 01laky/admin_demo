import { describe, expect, it, vi } from 'vitest';

vi.mock('../core/request', () => ({
	request: vi.fn(),
}));

import { request } from '../core/request';
import {
	fetchOperatorUserChatConversations,
	fetchOperatorUserChatHistory,
	postOperatorUserChatRead,
} from '../operatorUserChatApiClient';

describe('operatorUserChatApiClient', () => {
	it('lists conversations under operator-user-chat prefix', async () => {
		vi.mocked(request).mockResolvedValue([]);
		await fetchOperatorUserChatConversations();
		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/api/operator-user-chat/conversations',
			})
		);
	});

	it('loads history with target user path', async () => {
		vi.mocked(request).mockResolvedValue({ items: [], hasMore: false });
		await fetchOperatorUserChatHistory('user-1', { limit: 20, beforeId: 5 });
		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/api/operator-user-chat/with/{targetUserId}',
				path: { targetUserId: 'user-1' },
				query: { limit: 20, beforeId: 5 },
			})
		);
	});

	it('marks thread read via POST', async () => {
		vi.mocked(request).mockResolvedValue({ count: 1 });
		await postOperatorUserChatRead('user-2');
		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/api/operator-user-chat/with/{targetUserId}/read',
				path: { targetUserId: 'user-2' },
			})
		);
	});
});
