import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function devHttps(): { key: Buffer; cert: Buffer } | true {
	const envDir = process.env.VITE_DEV_CERT_DIR?.trim();
	const tryLoad = (dir: string) => {
		const keyPath = path.join(dir, 'localhost-key.pem');
		const certPath = path.join(dir, 'localhost.pem');
		if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
			return { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
		}
		return null;
	};
	if (envDir) {
		const loaded = tryLoad(envDir);
		if (loaded) return loaded;
	}
	const repoCerts = path.join(__dirname, '..', 'dev', 'certs');
	const fromRepo = tryLoad(repoCerts);
	if (fromRepo) return fromRepo;
	return true;
}

const httpsOpt = devHttps();
const useBasicSslPlugin = httpsOpt === true;
const httpsServer = useBasicSslPlugin ? true : httpsOpt;

export default defineConfig({
	plugins: [react(), ...(useBasicSslPlugin ? [basicSsl()] : [])],
	server: {
		port: Number(process.env.VITE_DEV_PORT) || 8082,
		host: true,
		https: httpsServer as import('vite').ServerOptions['https'],
	},
	resolve: {
		extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
	},
	define: {
		__APP_NAME__: JSON.stringify(process.env.VITE_APP_NAME || 'Be Demo Frontend'),
		__APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION || '1.0.0'),
	},
});
