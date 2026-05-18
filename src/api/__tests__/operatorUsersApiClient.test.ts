import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	fetchOperatorUserDetail,
	patchOperatorFaceRole,
	postOperatorGlobalBan,
} from '../operatorUsersApiClient';

const mockRequest = vi.fn();
vi.mock('../core/request', () => ({
	__request: (...args: unknown[]) => mockRequest(...args),
}));
vi.mock('../core/OpenAPI', () => ({ OpenAPI: {} }));

describe('operatorUsersApiClient', () => {
	beforeEach(() => vi.clearAllMocks());

	it('fetchOperatorUserDetail calls operator detail endpoint', async () => {
		mockRequest.mockResolvedValue({ id: 'u1' });
		await fetchOperatorUserDetail('u1');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/api/operator-users/users/{id}/detail',
				path: { id: 'u1' },
			})
		);
	});

	it('postOperatorGlobalBan sends reason body', async () => {
		mockRequest.mockResolvedValue({ banned: true });
		await postOperatorGlobalBan('u1', 'policy violation reason');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/api/operator-users/users/{id}/global-ban',
				body: { reason: 'policy violation reason' },
			})
		);
	});

	it('patchOperatorFaceRole sends userRoleId', async () => {
		mockRequest.mockResolvedValue({});
		await patchOperatorFaceRole('u1', 5, 3);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PATCH',
				body: { userRoleId: 3 },
				path: { id: 'u1', faceId: 5 },
			})
		);
	});
});
