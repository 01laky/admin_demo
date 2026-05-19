/** Pure gating for wall-ticket moderation actions in admin UI (status from API string). */
export function wallTicketActionsForStatus(status: string) {
	const s = status.toLowerCase();
	return {
		canApprove: s === 'active',
		canDeny: s === 'active',
		canDeleteTicket: true,
		canAddComment: s === 'active',
		canDeleteComment: true,
	};
}

export type WallTicketStatusFilter = '' | 'active' | 'approved' | 'denied';

export function statusFilterToQuery(status: WallTicketStatusFilter): string | undefined {
	return status === '' ? undefined : status;
}
