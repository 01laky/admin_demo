/** Mirror of backend `PublicStatsSnapshotDto` (camelCase JSON). */
export interface PublicStatsSnapshot {
	usersCount: number;
	facesCount: number;
	pagesCount: number;
	friendshipsCount: number;
	friendRequestsPendingCount: number;
	messagesCount: number;
	albumsCount: number;
	blogsCount: number;
	reelsCount: number;
	storiesCount: number;
	storyViewsCount: number;
	faceWallTicketsCount: number;
	faceChatRoomsCount: number;
	faceChatRoomMessagesCount: number;
}
