import { describe, expect, it } from 'vitest';
import {
	buildMetricTiles,
	metricScaleMax,
	normalizeMetricValue,
	pickMetricTileChartKind,
	readSummaryMetric,
	syntheticSparklinePoints,
} from '../dashboardMetricTiles';
import type { AdminDashboardSummary } from '@/types/adminDashboardStats';

const minimalSummary = {
	usersCount: 10,
	facesCount: 2,
	pagesCount: 3,
	pageComponentsCount: 0,
	pageRouteTranslationsCount: 0,
	friendRequestsCount: 0,
	friendRequestsAcceptedCount: 1,
	friendRequestsRejectedCount: 0,
	friendshipsCount: 0,
	userFollowsCount: 0,
	userBlocksCount: 0,
	messagesCount: 5,
	messagesPendingRequestCount: 0,
	notificationsCount: 0,
	albumsCount: 0,
	blogsCount: 0,
	reelsCount: 0,
	storiesCount: 0,
	storyViewsCount: 0,
	faceChatRoomsCount: 0,
	faceChatRoomMembersCount: 0,
	faceChatRoomMessagesCount: 0,
	faceChatRoomJoinRequestsPendingCount: 0,
	faceWallTicketsCount: 0,
	faceWallTicketsByStatus: { Open: 2, Closed: 1 },
	faceWallTicketCommentsCount: 0,
	faceWallTicketLikesCount: 0,
	userFaceProfilesCount: 0,
	userFaceProfileLikesCount: 0,
	userFaceProfileCommentsCount: 0,
	userFaceProfileReviewsCount: 0,
	albumCommentsCount: 0,
	blogCommentsCount: 0,
	reelCommentsCount: 0,
	storyCommentsCount: 0,
	albumLikesCount: 0,
	blogLikesCount: 0,
	reelLikesCount: 0,
	storyLikesCount: 0,
	aiReviewJobsCount: 0,
	contentModerationEventsCount: 0,
	oauthClientsCount: 0,
} satisfies AdminDashboardSummary;

describe('dashboardMetricTiles', () => {
	it('rotates chart kinds across five variants', () => {
		expect(pickMetricTileChartKind(0)).toBe('radial');
		expect(pickMetricTileChartKind(4)).toBe('horizontal');
		expect(pickMetricTileChartKind(5)).toBe('radial');
	});

	it('builds one tile per metric row', () => {
		const tiles = buildMetricTiles(minimalSummary);
		expect(tiles.length).toBeGreaterThan(40);
		expect(tiles[0]?.id).toBe('usersCount');
		expect(tiles[0]?.value).toBe(10);
	});

	it('computes scale max from values', () => {
		expect(metricScaleMax([0, 5, 100])).toBe(100);
		expect(metricScaleMax([])).toBe(1);
	});

	it('sparkline is deterministic', () => {
		const a = syntheticSparklinePoints(12, 'messagesCount');
		const b = syntheticSparklinePoints(12, 'messagesCount');
		expect(a).toEqual(b);
		expect(a.length).toBe(8);
	});

	it('normalizeMetricValue treats missing values as zero', () => {
		expect(normalizeMetricValue(undefined)).toBe(0);
		expect(normalizeMetricValue('42')).toBe(42);
		expect(
			readSummaryMetric(
				{ ...minimalSummary, oauthClientsCount: undefined as unknown as number },
				'oauthClientsCount'
			)
		).toBe(0);
	});
});
