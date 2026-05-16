import { describe, expect, it } from 'vitest';
import {
	escapeHtmlForTextNode,
	formatModerationBodyPreview,
	formatModerationMediaPreview,
} from '../moderationPreview';

describe('moderationPreview (PI-8)', () => {
	it('escapeHtmlForTextNode neutralizes markup', () => {
		expect(escapeHtmlForTextNode('<script>x</script>')).not.toContain('<script');
	});

	it('formatModerationBodyPreview handles empty', () => {
		expect(formatModerationBodyPreview('  ')).toBe('No body preview.');
	});

	it('formatModerationMediaPreview trims empty', () => {
		expect(formatModerationMediaPreview(null)).toBeNull();
		expect(formatModerationMediaPreview(' https://cdn.test/v.mp4 ')).toBe('https://cdn.test/v.mp4');
	});
});
