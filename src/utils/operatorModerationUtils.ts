export const BAN_REASON_MIN_LENGTH = 10;

export function isBanReasonValid(reason: string): boolean {
	return reason.trim().length >= BAN_REASON_MIN_LENGTH;
}

export function buildSetFaceRoleBody(userRoleId: number): { userRoleId: number } {
	return { userRoleId };
}
