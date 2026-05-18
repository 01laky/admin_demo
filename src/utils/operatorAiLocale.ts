import type { TFunction } from 'i18next';
import type { UiChatMessage, UiChatRole } from './operatorAiChatUtils';

export function formatLocaleBadge(t: TFunction, responseLocale: string | null | undefined): string {
	if (!responseLocale) return t('pages.chat.localeUnknown');
	const key = `pages.chat.localeBadge.${responseLocale.toLowerCase()}`;
	const translated = t(key);
	if (translated !== key) return translated;
	return responseLocale.toUpperCase();
}

export function formatMessageHeader(
	t: TFunction,
	msg: UiChatMessage,
	viewerLanguage: string
): string {
	const localeBadge = formatLocaleBadge(t, msg.responseLocale);
	const timestamp = msg.createdAt
		? new Intl.DateTimeFormat(viewerLanguage, {
				dateStyle: 'medium',
				timeStyle: 'short',
			}).format(new Date(msg.createdAt))
		: '';

	const parts: string[] = [];
	if (msg.role === 'user') {
		parts.push(msg.authorEmail?.trim() || t('pages.chat.you'));
	} else {
		parts.push(t('pages.chat.ai'));
	}
	if (timestamp) parts.push(timestamp);
	if (localeBadge && localeBadge !== t('pages.chat.localeUnknown')) parts.push(localeBadge);

	return parts.join(' · ');
}

export function roleLabel(t: TFunction, role: UiChatRole): string {
	return role === 'user' ? t('pages.chat.you') : t('pages.chat.ai');
}
