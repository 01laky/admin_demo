import type { OperatorUserDetail } from '@/hooks/api/useOperatorUsersApi';
import { isBanReasonValid } from './operatorModerationUtils';

export function canSubmitGlobalBan(reason: string): boolean {
	return isBanReasonValid(reason);
}

export function canSubmitFaceBan(reason: string | undefined): boolean {
	return isBanReasonValid(reason ?? '');
}

export function getUserDetailBadgeI18nKeys(badges: OperatorUserDetail['badges']): string[] {
	const keys: string[] = [];
	if (badges.isGloballyBanned) keys.push('pages.userDetail.badgeGlobalBan');
	if (badges.activeFaceBanCount > 0) keys.push('pages.userDetail.badgeFaceBans');
	keys.push(
		badges.emailConfirmed
			? 'pages.userDetail.badgeEmailConfirmed'
			: 'pages.userDetail.badgeEmailUnconfirmed'
	);
	return keys;
}

export function getFaceStatusI18nKey(face: OperatorUserDetail['faces'][number]): string {
	if (face.isFaceBanned) return 'pages.userDetail.faceBanned';
	if (face.isActiveParticipant) return 'pages.userDetail.faceActive';
	return '';
}
