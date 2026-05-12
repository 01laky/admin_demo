import { describe, expect, it } from 'vitest';
import {
	formatOptionalDate,
	getModerationQueueLabel,
	isSuperAdminFromToken,
	parseModerationFlags,
} from '../contentModeration';

function makeToken(payload: Record<string, unknown>) {
	return `header.${btoa(JSON.stringify(payload))}.signature`;
}

describe('admin content moderation helpers', () => {
	it('detects SUPER_ADMIN role from token role claim', () => {
		expect(isSuperAdminFromToken(makeToken({ role: 'SUPER_ADMIN' }))).toBe(true);
		expect(isSuperAdminFromToken(makeToken({ role: 'ADMIN' }))).toBe(false);
		expect(isSuperAdminFromToken(makeToken({ roles: ['USER', 'SUPER_ADMIN'] }))).toBe(true);
		expect(isSuperAdminFromToken('not-a-jwt')).toBe(false);
	});

	it.each([
		['PendingApproval', 'RecommendedApprove', 'AI recommended approval'],
		['PendingApproval', 'RecommendedReject', 'AI recommended rejection'],
		['PendingApproval', 'NeedsHumanReview', 'Needs human review'],
		['Approved', 'Queued', 'Approved'],
		['Removed', 'Failed', 'Removed'],
	] as const)('maps %s/%s to queue label', (approvalStatus, aiReviewStatus, expected) => {
		expect(getModerationQueueLabel(approvalStatus, aiReviewStatus)).toBe(expected);
	});

	it('parses moderation flags safely', () => {
		expect(parseModerationFlags('["spam","adult",1]')).toEqual(['spam', 'adult']);
		expect(parseModerationFlags('not-json')).toEqual([]);
		expect(parseModerationFlags(null)).toEqual([]);
	});

	it('formats optional dates without throwing', () => {
		expect(formatOptionalDate(null)).toBe('Not set');
		expect(formatOptionalDate('not-date')).toBe('Invalid date');
		expect(formatOptionalDate('2026-05-12T10:00:00Z')).toContain('2026');
	});
});
