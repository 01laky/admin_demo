import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildAdminMessengerHubConnection } from '../buildAdminMessengerHubConnection';

const mockWithUrl = vi.fn().mockReturnThis();
const mockWithAutomaticReconnect = vi.fn().mockReturnThis();
const mockBuild = vi.fn(() => ({ id: 'admin-messenger-hub' }));

vi.mock('@microsoft/signalr', () => ({
	HubConnectionBuilder: class MockHubConnectionBuilder {
		withUrl(...args: unknown[]) {
			mockWithUrl(...args);
			return this;
		}
		withAutomaticReconnect() {
			mockWithAutomaticReconnect();
			return this;
		}
		build() {
			return mockBuild();
		}
	},
}));

vi.mock('../../../config/env', () => ({
	env: { apiUrl: 'https://api.test', defaultFacePrefix: 'admin' },
}));

describe('buildAdminMessengerHubConnection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('targets admin messenger hub with access token factory', () => {
		const conn = buildAdminMessengerHubConnection(() => 'jwt');
		expect(conn).toEqual({ id: 'admin-messenger-hub' });
		expect(mockWithUrl).toHaveBeenCalledWith(
			'https://api.test/admin/hubs/messenger',
			expect.objectContaining({ accessTokenFactory: expect.any(Function) })
		);
	});
});
