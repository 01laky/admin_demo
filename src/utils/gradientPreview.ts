import type { CSSProperties } from 'react';

/** Static CSS background for tables/detail (no keyframe animation). */
export function gradientPreviewStyle(raw: string | null | undefined): CSSProperties {
	if (!raw) return { background: '#e9ecef' };
	try {
		const p = JSON.parse(raw) as { type?: string; colors?: string[]; angle?: number };
		const colors = Array.isArray(p.colors) && p.colors.length >= 2 ? p.colors : null;
		if (!colors) return { background: '#e9ecef' };
		const t = p.type === 'radial' ? 'radial' : 'linear';
		const angle = typeof p.angle === 'number' ? p.angle : 135;
		const bg =
			t === 'radial'
				? `radial-gradient(circle, ${colors.join(', ')})`
				: `linear-gradient(${angle}deg, ${colors.join(', ')})`;
		return { background: bg };
	} catch {
		return { background: '#e9ecef' };
	}
}
