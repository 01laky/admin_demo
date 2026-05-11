import { describe, expect, it } from 'vitest';
import { getModerationQueueLabel, isSuperAdminFromToken } from '../contentModeration';

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
});
