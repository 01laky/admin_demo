import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminListWallTickets, adminApproveWallTicket } from '../wallTicketsAdminApi';

vi.mock('../../faceApiRouting', () => ({
	absoluteScopedUrl: (path: string) => `https://api.test/admin${path}`,
}));

const fetchMock = vi.fn();

describe('wallTicketsAdminApi', () => {
	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal('fetch', fetchMock);
	});

	it('lists wall tickets with bearer token and pagination', async () => {
		const payload = {
			items: [],
			page: 2,
			pageSize: 10,
			totalCount: 0,
			totalPages: 0,
		};
		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: async () => payload,
		});

		const result = await adminListWallTickets('tok', 5, 2, 10);

		expect(result).toBe(payload);
		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.test/admin/api/admin/faces/5/wall-tickets?page=2&pageSize=10',
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: 'Bearer tok',
				}),
			})
		);
	});

	it('throws parsed API error when list fails', async () => {
		fetchMock.mockResolvedValueOnce({
			ok: false,
			text: async () => JSON.stringify({ error: 'Forbidden' }),
		});

		await expect(adminListWallTickets('tok', 1)).rejects.toThrow('Forbidden');
	});

	it('POSTs approve endpoint', async () => {
		fetchMock.mockResolvedValueOnce({ ok: true, text: async () => '' });

		await adminApproveWallTicket('tok', 3, 99);

		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.test/admin/api/admin/faces/3/wall-tickets/99/approve',
			expect.objectContaining({ method: 'POST' })
		);
	});
});
