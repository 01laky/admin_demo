/**
 * SHV2 PI-8: operator moderation preview helpers — always plain text, never `dangerouslySetInnerHTML`.
 */

/** Escapes HTML metacharacters so React text nodes cannot interpret untrusted markup. */
export function escapeHtmlForTextNode(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/** Normalizes API plain preview for display (backend already strips tags; this is defense in depth). */
export function formatModerationBodyPreview(bodyPreviewPlainText?: string | null): string {
	if (!bodyPreviewPlainText?.trim()) return 'No body preview.';
	return bodyPreviewPlainText.trim();
}

export function formatModerationMediaPreview(mediaUrlPreview?: string | null): string | null {
	const trimmed = mediaUrlPreview?.trim();
	return trimmed && trimmed.length > 0 ? trimmed : null;
}
