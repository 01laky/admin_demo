/** React Query hooks for super-admin user chat REST (/api/operator-user-chat/*). Gated on SUPER_ADMIN JWT. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	fetchOperatorUserChatConversations,
	fetchOperatorUserChatHistory,
	fetchOperatorUserChatThreadExists,
	postOperatorUserChatRead,
} from '@/api/operatorUserChatApiClient';
import { isSuperAdminFromToken } from '@/utils/contentModeration';
import { useAuth } from '@/contexts/AuthContext';

export const operatorUserChatConversationsKey = ['operatorUserChat', 'conversations'] as const;
const messagesKey = (userId: string) => ['operatorUserChat', 'messages', userId] as const;
const existsKey = (userId: string) => ['operatorUserChat', 'exists', userId] as const;

export function useOperatorUserChatConversations() {
	const { token } = useAuth();
	return useQuery({
		queryKey: operatorUserChatConversationsKey,
		queryFn: () => fetchOperatorUserChatConversations(),
		enabled: Boolean(token) && isSuperAdminFromToken(token),
	});
}

export function useOperatorUserChatMessages(targetUserId: string | null, enabled: boolean) {
	const { token } = useAuth();
	return useQuery({
		queryKey: targetUserId ? messagesKey(targetUserId) : ['operatorUserChat', 'messages', 'none'],
		queryFn: () => fetchOperatorUserChatHistory(targetUserId!, { limit: 40 }),
		enabled: Boolean(token) && isSuperAdminFromToken(token) && enabled && Boolean(targetUserId),
		staleTime: 0,
		refetchOnMount: 'always',
	});
}

export function useOperatorUserChatThreadExists(targetUserId: string, enabled: boolean) {
	const { token } = useAuth();
	return useQuery({
		queryKey: existsKey(targetUserId),
		queryFn: () => fetchOperatorUserChatThreadExists(targetUserId),
		enabled: Boolean(token) && isSuperAdminFromToken(token) && enabled,
	});
}

export function useMarkOperatorUserChatRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (targetUserId: string) => postOperatorUserChatRead(targetUserId),
		onSuccess: (_data, targetUserId) => {
			void queryClient.invalidateQueries({ queryKey: messagesKey(targetUserId) });
			void queryClient.invalidateQueries({ queryKey: operatorUserChatConversationsKey });
		},
	});
}

export { messagesKey as operatorUserChatMessagesKey };
