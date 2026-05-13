import { describe, expect, it } from 'vitest';
import { prependFaceBeforeApi, scopePathForPublicFace } from '../faceApiRouting';

describe('faceApiRouting — public face path helpers', () => {
	it('scopePathForPublicFace prefixes api paths with public face', () => {
		expect(scopePathForPublicFace('/api/Stats/public')).toBe('/public/api/Stats/public');
	});

	it('scopePathForPublicFace leaves oauth paths exempt', () => {
		expect(scopePathForPublicFace('/api/oauth2/token')).toBe('/api/oauth2/token');
	});

	it('scopePathForPublicFace does not double-prefix', () => {
		expect(scopePathForPublicFace('/public/api/Stats/public')).toBe('/public/api/Stats/public');
	});

	it('prependFaceBeforeApi uses arbitrary face prefix', () => {
		expect(prependFaceBeforeApi('/api/Stats/public', 'koncept')).toBe('/koncept/api/Stats/public');
	});

	it('scopePathForPublicFace supports query strings on api paths', () => {
		expect(scopePathForPublicFace('/api/Stats/public?x=1')).toBe('/public/api/Stats/public?x=1');
	});
});
