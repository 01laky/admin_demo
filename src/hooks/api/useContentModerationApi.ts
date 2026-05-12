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

export interface ModerationEvent {
	id: number;
	contentType: ModeratedContentType;
	contentId: number;
	faceId: number;
	oldApprovalStatus?: ContentApprovalStatus | null;
	newApprovalStatus?: ContentApprovalStatus | null;
	oldAiReviewStatus?: AiReviewStatus | null;
	newAiReviewStatus?: AiReviewStatus | null;
	actorType: string;
	actorUserId?: string | null;
	reason?: string | null;
	userMessage?: string | null;
	aiTraceId?: string | null;
	aiModelVersion?: string | null;
	createdAtUtc: string;
}

export interface ModerationMetrics {
	pendingSubmissions: number;
	aiQueuedJobs: number;
	aiProcessingJobs: number;
	aiFailedJobs: number;
	oldestPendingSubmissionUtc?: string | null;
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
	events: (contentType: ModeratedContentType, contentId: number) =>
		[...moderationKeys.all, 'events', contentType, contentId] as const,
	metrics: () => [...moderationKeys.all, 'metrics'] as const,
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

export async function fetchModerationEvents(contentType: ModeratedContentType, contentId: number) {
	return __request(OpenAPI, {
		method: 'GET',
		url: `/api/contentmoderation/${contentType}/${contentId}/events`,
	}) as Promise<ModerationEvent[]>;
}

export async function fetchModerationMetrics() {
	return __request(OpenAPI, {
		method: 'GET',
		url: '/api/contentmoderation/metrics',
	}) as Promise<ModerationMetrics>;
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

export function useModerationEvents(
	item: Pick<ModerationItem, 'contentType' | 'contentId'> | null
) {
	return useQuery({
		queryKey: item
			? moderationKeys.events(item.contentType, item.contentId)
			: [...moderationKeys.all, 'events', 'none'],
		queryFn: () => fetchModerationEvents(item!.contentType, item!.contentId),
		enabled: Boolean(item),
		staleTime: 15_000,
	});
}

export function useModerationMetrics(enabled = true) {
	return useQuery({
		queryKey: moderationKeys.metrics(),
		queryFn: fetchModerationMetrics,
		enabled,
		staleTime: 30_000,
	});
}
