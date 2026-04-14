#!/usr/bin/env node
/**
 * Vite 8 expects Node 20.19+ or 22.12+. Align local/CI with `admin_demo/.nvmrc`.
 * Run: `yarn check-node` (optional before `yarn build`).
 */
const m = /^v(\d+)\.(\d+)/.exec(process.version);
if (!m) process.exit(0);
const major = Number(m[1]);
const minor = Number(m[2]);
const ok =
	major > 22 || (major === 22 && minor >= 12) || (major === 20 && minor >= 19);
if (!ok) {
	console.error(
		`[admin_demo] Node ${process.version} is below Vite 8 supported range (20.19+ or 22.12+). Use: cd admin_demo && nvm use`
	);
	process.exit(1);
}
console.log(`[admin_demo] Node ${process.version} OK for Vite 8`);
