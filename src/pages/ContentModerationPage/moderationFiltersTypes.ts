import type {
	AiReviewRiskLevel,
	AiReviewStatus,
	ContentApprovalStatus,
	ModeratedContentType,
} from '@/utils/contentModeration';

export const APPROVAL_FILTERS: Array<ContentApprovalStatus | ''> = [
	'PendingApproval',
	'Approved',
	'Rejected',
	'Removed',
	'',
];

export const CONTENT_TYPES: Array<ModeratedContentType | ''> = ['Album', 'Blog', 'Reel', ''];
export const RISK_FILTERS: Array<AiReviewRiskLevel | ''> = ['High', 'Medium', 'Low', 'Unknown', ''];

export interface ModerationFilterState {
	contentType: ModeratedContentType | '';
	approvalStatus: ContentApprovalStatus | '';
	aiReviewStatus: AiReviewStatus | '';
	riskLevel: AiReviewRiskLevel | '';
	authorId: string;
	faceIdText: string;
	moderationVersionText: string;
	flagContains: string;
	minConfidenceText: string;
	maxConfidenceText: string;
	submittedFromUtc: string;
	submittedToUtc: string;
	reviewedByUserId: string;
	minQueueAgeHoursText: string;
}

export type ModerationFilterSetters = {
	[K in keyof ModerationFilterState]: (value: ModerationFilterState[K]) => void;
};
