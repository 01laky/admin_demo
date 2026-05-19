import { describe, expect, it } from 'vitest';
import { statusFilterToQuery, wallTicketActionsForStatus } from '../wallTicketModeration';

describe('wallTicketActionsForStatus', () => {
	it('allows approve/deny/comment only when active', () => {
		expect(wallTicketActionsForStatus('active')).toMatchObject({
			canApprove: true,
			canDeny: true,
			canAddComment: true,
		});
		expect(wallTicketActionsForStatus('approved')).toMatchObject({
			canApprove: false,
			canDeny: false,
			canAddComment: false,
			canDeleteTicket: true,
		});
	});

	it('treats unknown status as non-active for moderation', () => {
		expect(wallTicketActionsForStatus('UNKNOWN').canApprove).toBe(false);
	});
});

describe('statusFilterToQuery', () => {
	it('omits query when filter is all', () => {
		expect(statusFilterToQuery('')).toBeUndefined();
	});
	it('passes status value', () => {
		expect(statusFilterToQuery('denied')).toBe('denied');
	});
});
