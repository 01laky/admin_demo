export type ContentApprovalStatus = 'PendingApproval' | 'Approved' | 'Rejected' | 'Removed';

export type AiReviewStatus =
	| 'NotQueued'
	| 'Queued'
	| 'InProgress'
	| 'RecommendedApprove'
	| 'RecommendedReject'
	| 'NeedsHumanReview'
	| 'Failed';

export type ModeratedContentType = 'Album' | 'Blog' | 'Reel';

export function isSuperAdminFromToken(token: string | null | undefined) {
	if (!token) return false;
	try {
		const payload = JSON.parse(atob(token.split('.')[1] ?? ''));
		const role =
			payload.role ??
			payload.roles ??
			payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
		if (Array.isArray(role)) {
			return role.includes('SUPER_ADMIN');
		}
		return role === 'SUPER_ADMIN';
	} catch {
		return false;
	}
}

export function getModerationQueueLabel(
	approvalStatus: ContentApprovalStatus,
	aiReviewStatus: AiReviewStatus
) {
	if (approvalStatus === 'PendingApproval' && aiReviewStatus === 'RecommendedApprove') {
		return 'AI recommended approval';
	}
	if (approvalStatus === 'PendingApproval' && aiReviewStatus === 'RecommendedReject') {
		return 'AI recommended rejection';
	}
	if (approvalStatus === 'PendingApproval' && aiReviewStatus === 'NeedsHumanReview') {
		return 'Needs human review';
	}
	return approvalStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
}
