import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchPublicStatsSnapshot } from '../usePublicStatsApi';

vi.mock('../../../api/faceApiRouting', () => ({
	absolutePublicFaceUrl: (path: string) => `https://api.test/public${path}`,
}));

const fetchMock = vi.fn();

describe('fetchPublicStatsSnapshot', () => {
	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal('fetch', fetchMock);
	});

	it('GETs public stats without auth header', async () => {
		const snapshot = { usersCount: 1, facesCount: 2 };
		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: async () => snapshot,
		});

		await expect(fetchPublicStatsSnapshot()).resolves.toEqual(snapshot);
		expect(fetchMock).toHaveBeenCalledWith('https://api.test/public/api/Stats/public', {
			method: 'GET',
			headers: { Accept: 'application/json' },
		});
	});

	it('throws with HTTP status when response is not ok', async () => {
		fetchMock.mockResolvedValueOnce({ ok: false, status: 503 });

		await expect(fetchPublicStatsSnapshot()).rejects.toThrow('Public stats HTTP 503');
	});
});
