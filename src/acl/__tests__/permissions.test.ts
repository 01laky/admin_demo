import { describe, expect, it } from 'vitest';
import { ACL_PERMISSION_KEYS } from '../aclPermissionKeys';
import { canPlatformAdmin, parseMeCapabilities } from '../permissions';

/** Same contract as fe_demo: safe parsing of GET /api/me/capabilities JSON (security-hardening prompt). */
describe('parseMeCapabilities', () => {
	it('returns null for invalid payloads', () => {
		expect(parseMeCapabilities(null)).toBeNull();
		expect(
			parseMeCapabilities({
				globalRole: 'X',
				requestFaceId: NaN,
				isAdminFaceScope: true,
				permissions: [],
			})
		).toBeNull();
	});

	it('parses a valid admin-scope payload', () => {
		const caps = parseMeCapabilities({
			globalRole: 'ADMIN',
			requestFaceId: 2,
			requestFaceIndex: 'admin',
			isAdminFaceScope: true,
			myFaceRoleName: null,
			permissions: [ACL_PERMISSION_KEYS.platformAdmin, ACL_PERMISSION_KEYS.tenantSession],
		});
		expect(caps?.isAdminFaceScope).toBe(true);
		expect(canPlatformAdmin(caps)).toBe(true);
	});
});
