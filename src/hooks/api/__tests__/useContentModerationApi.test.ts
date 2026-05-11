import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyModerationDecision, fetchModerationItems } from '../useContentModerationApi';

const mockRequest = vi.fn();

vi.mock('../../../api/core/request', () => ({
	request: (...args: unknown[]) => mockRequest(...args),
}));

vi.mock('../../../api/core/OpenAPI', () => ({
	OpenAPI: {
		BASE: 'http://localhost:8000',
		TOKEN: null,
	},
}));

describe('useContentModerationApi requests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('fetches moderation items with filters', async () => {
		mockRequest.mockResolvedValue([]);

		await fetchModerationItems({ contentType: 'Album', approvalStatus: 'PendingApproval' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/api/contentmoderation',
				query: { contentType: 'Album', approvalStatus: 'PendingApproval' },
			})
		);
	});

	it('posts superadmin moderation decisions', async () => {
		mockRequest.mockResolvedValue({ approvalStatus: 'Approved' });

		await applyModerationDecision('Blog', 12, 'approve', { reason: 'Looks good' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/api/contentmoderation/Blog/12/approve',
				body: { reason: 'Looks good' },
			})
		);
	});
});
