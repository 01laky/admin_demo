/** Typed REST client for OperatorUserChatController (admin face scope). */
import { request as __request } from './core/request';
import { OpenAPI } from './core/OpenAPI';

export type OperatorUserChatConversation = {
	otherUserId: string;
	otherUserEmail: string;
	otherUserDisplayName: string;
	lastMessagePreview: string;
	lastMessageAtUtc: string;
	lastMessageFromMe: boolean;
	unreadCount: number;
};

export type OperatorUserChatMessage = {
	id: number;
	senderId: string;
	senderName: string;
	senderGlobalRole: string | null;
	isPlatformAdministrator: boolean;
	content: string;
	sentAt: string;
	readAt: string | null;
};

export type OperatorUserChatHistoryPage = {
	items: OperatorUserChatMessage[];
	hasMore: boolean;
};

export type OperatorUserChatThreadExists = {
	hasThread: boolean;
	messageCount: number;
};

export async function fetchOperatorUserChatConversations() {
	return __request<OperatorUserChatConversation[]>(OpenAPI, {
		method: 'GET',
		url: '/api/operator-user-chat/conversations',
	});
}

export async function fetchOperatorUserChatHistory(
	targetUserId: string,
	params?: { limit?: number; beforeId?: number }
) {
	return __request<OperatorUserChatHistoryPage>(OpenAPI, {
		method: 'GET',
		url: '/api/operator-user-chat/with/{targetUserId}',
		path: { targetUserId },
		query: params,
	});
}

export async function fetchOperatorUserChatThreadExists(targetUserId: string) {
	return __request<OperatorUserChatThreadExists>(OpenAPI, {
		method: 'GET',
		url: '/api/operator-user-chat/with/{targetUserId}/exists',
		path: { targetUserId },
	});
}

export async function postOperatorUserChatRead(targetUserId: string) {
	return __request<{ count: number }>(OpenAPI, {
		method: 'POST',
		url: '/api/operator-user-chat/with/{targetUserId}/read',
		path: { targetUserId },
	});
}
