import { describe, it, expect } from 'vitest';
import { buildPasswordGrantTokenRequest } from '../authTokenRequest';

describe('buildPasswordGrantTokenRequest', () => {
	const base = {
		username: 'user@test.com',
		password: 'secret',
		clientId: 'cid',
		clientSecret: 'csec',
	};

	it('sets rememberMe true only when argument is strictly true', () => {
		expect(buildPasswordGrantTokenRequest({ ...base, rememberMe: true }).rememberMe).toBe(true);
		expect(buildPasswordGrantTokenRequest({ ...base, rememberMe: false }).rememberMe).toBe(false);
		expect(buildPasswordGrantTokenRequest({ ...base }).rememberMe).toBe(false);
	});

	it('builds password grant body', () => {
		const req = buildPasswordGrantTokenRequest(base);
		expect(req.grantType).toBe('password');
		expect(req.username).toBe(base.username);
		expect(req.password).toBe(base.password);
		expect(req.clientId).toBe(base.clientId);
		expect(req.clientSecret).toBe(base.clientSecret);
	});
});
