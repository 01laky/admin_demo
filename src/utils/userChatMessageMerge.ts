import type { OperatorUserChatMessage } from '@/api/operatorUserChatApiClient';

export type UiUserChatMessage = OperatorUserChatMessage & { pending?: boolean };

/** Appends a hub or optimistic message without duplicating by id. */
export function appendUserChatMessage(
	messages: UiUserChatMessage[],
	incoming: UiUserChatMessage
): UiUserChatMessage[] {
	if (messages.some((m) => m.id === incoming.id && incoming.id > 0)) return messages;
	return [...messages, incoming];
}
