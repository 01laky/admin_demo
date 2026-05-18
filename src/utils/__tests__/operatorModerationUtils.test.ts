import { describe, it, expect } from 'vitest';
import {
	BAN_REASON_MIN_LENGTH,
	buildSetFaceRoleBody,
	isBanReasonValid,
} from '../operatorModerationUtils';

describe('operatorModerationUtils', () => {
	it('requires ban reason at least BAN_REASON_MIN_LENGTH trimmed chars', () => {
		expect(BAN_REASON_MIN_LENGTH).toBe(10);
		expect(isBanReasonValid('short')).toBe(false);
		expect(isBanReasonValid('   tenchars  ')).toBe(false);
		expect(isBanReasonValid('1234567890')).toBe(true);
		expect(isBanReasonValid('  valid reason  ')).toBe(true);
	});

	it('buildSetFaceRoleBody sends userRoleId key expected by API', () => {
		expect(buildSetFaceRoleBody(3)).toEqual({ userRoleId: 3 });
	});
});
