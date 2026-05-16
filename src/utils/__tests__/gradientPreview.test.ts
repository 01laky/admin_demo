import { describe, expect, it } from 'vitest';
import { gradientPreviewStyle } from '../gradientPreview';

describe('gradientPreviewStyle', () => {
	it('returns default gray when raw is empty', () => {
		expect(gradientPreviewStyle(null)).toEqual({ background: '#e9ecef' });
		expect(gradientPreviewStyle(undefined)).toEqual({ background: '#e9ecef' });
	});

	it('builds linear gradient from valid JSON', () => {
		const style = gradientPreviewStyle(
			JSON.stringify({ type: 'linear', colors: ['#111', '#222'], angle: 90 })
		);
		expect(style.background).toBe('linear-gradient(90deg, #111, #222)');
	});

	it('builds radial gradient when type is radial', () => {
		const style = gradientPreviewStyle(JSON.stringify({ type: 'radial', colors: ['red', 'blue'] }));
		expect(style.background).toBe('radial-gradient(circle, red, blue)');
	});

	it('falls back when colors array is too short', () => {
		const style = gradientPreviewStyle(JSON.stringify({ type: 'linear', colors: ['#111'] }));
		expect(style.background).toBe('#e9ecef');
	});

	it('falls back on invalid JSON', () => {
		expect(gradientPreviewStyle('{bad')).toEqual({ background: '#e9ecef' });
	});

	it('uses default angle when angle is not a number', () => {
		const style = gradientPreviewStyle(
			JSON.stringify({ type: 'linear', colors: ['#a', '#b'], angle: 'wide' })
		);
		expect(style.background).toBe('linear-gradient(135deg, #a, #b)');
	});
});
