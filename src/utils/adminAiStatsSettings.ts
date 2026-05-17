export type AdminAiPublicStatsMode = 'off' | 'inline' | 'live';

const STORAGE_KEY = 'admin_ai_public_stats_mode';

const VALID: ReadonlySet<AdminAiPublicStatsMode> = new Set(['off', 'inline', 'live']);

export function getAdminAiPublicStatsMode(): AdminAiPublicStatsMode {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)?.trim().toLowerCase();
		if (raw && VALID.has(raw as AdminAiPublicStatsMode)) return raw as AdminAiPublicStatsMode;
	} catch {
		/* ignore */
	}
	return 'inline';
}

export function setAdminAiPublicStatsMode(mode: AdminAiPublicStatsMode): void {
	try {
		localStorage.setItem(STORAGE_KEY, mode);
	} catch {
		/* ignore */
	}
}
