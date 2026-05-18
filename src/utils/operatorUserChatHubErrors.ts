import type { TFunction } from 'i18next';

const HUB_ERROR_KEYS: Record<string, string> = {
	not_super_admin: 'pages.userChat.hub.errors.not_super_admin',
	target_not_found: 'pages.userChat.hub.errors.target_not_found',
	cannot_message_super_admin: 'pages.userChat.hub.errors.cannot_message_super_admin',
	cannot_message_self: 'pages.userChat.hub.errors.cannot_message_self',
	message_too_long: 'pages.userChat.hub.errors.message_too_long',
	rate_limited: 'pages.userChat.hub.errors.rate_limited',
	empty_content: 'pages.userChat.hub.errors.empty_content',
	no_platform_thread: 'pages.userChat.hub.errors.no_platform_thread',
};

/** Maps stable hub error codes to admin i18n strings. */
export function mapOperatorUserChatHubError(t: TFunction, code: string | null | undefined): string {
	if (!code) return t('pages.userChat.hub.errors.unknown');
	const key = HUB_ERROR_KEYS[code];
	return key ? t(key) : t('pages.userChat.hub.errors.unknown');
}
