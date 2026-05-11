import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OpenAPI } from '../../api/core/OpenAPI';
import { request as __request } from '../../api/core/request';
import type {
	AiReviewStatus,
	ContentApprovalStatus,
	ModeratedContentType,
} from '../../utils/contentModeration';

export interface ModerationItem {
	contentType: ModeratedContentType;
	contentId: number;
	title: string;
	faceId: number;
	faceTitle: string;
	creatorId: string;
	creatorName: string;
	approvalStatus: ContentApprovalStatus;
	aiReviewStatus: AiReviewStatus;
	aiReviewDecision: string;
	aiReviewConfidence?: number | null;
	aiReviewRiskLevel: string;
	aiReviewFlagsJson?: string | null;
	aiReviewReason?: string | null;
	aiReviewUserMessage?: string | null;
	aiReviewModelVersion?: string | null;
	aiReviewTraceId?: string | null;
	submittedAtUtc?: string | null;
	humanReviewedAtUtc?: string | null;
	humanDecisionReason?: string | null;
	removedAtUtc?: string | null;
	removalReason?: string | null;
	createdAt: string;
}

export interface ModerationFilters {
	contentType?: ModeratedContentType;
	approvalStatus?: ContentApprovalStatus;
	aiReviewStatus?: AiReviewStatus;
	faceId?: number;
}

export interface ModerationDecision {
	reason?: string;
	userMessage?: string;
}

const moderationKeys = {
	all: ['contentModeration'] as const,
	list: (filters: ModerationFilters) => [...moderationKeys.all, 'list', filters] as const,
};

export async function fetchModerationItems(filters: ModerationFilters = {}) {
	return __request(OpenAPI, {
		method: 'GET',
		url: '/api/contentmoderation',
		query: filters,
	}) as Promise<ModerationItem[]>;
}

export async function applyModerationDecision(
	contentType: ModeratedContentType,
	contentId: number,
	action: 'approve' | 'reject' | 'remove',
	decision: ModerationDecision = {}
) {
	return __request(OpenAPI, {
		method: 'POST',
		url: `/api/contentmoderation/${contentType}/${contentId}/${action}`,
		body: decision,
	});
}

export function useModerationItems(filters: ModerationFilters = {}, enabled = true) {
	return useQuery({
		queryKey: moderationKeys.list(filters),
		queryFn: () => fetchModerationItems(filters),
		enabled,
		staleTime: 30_000,
	});
}

export function useModerationAction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			item,
			action,
			decision,
		}: {
			item: Pick<ModerationItem, 'contentType' | 'contentId'>;
			action: 'approve' | 'reject' | 'remove';
			decision?: ModerationDecision;
		}) => applyModerationDecision(item.contentType, item.contentId, action, decision),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: moderationKeys.all }),
	});
}
