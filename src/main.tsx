import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './styles/main.scss';
import { initI18n } from './i18n/config';
import { configureApiClient } from './api/config';
import { setupAxiosInterceptors } from './api/interceptors';
import { validateEnv, logEnvConfig, env } from './config/env';
import { logger } from './utils/logger';
import { QueryProvider } from './providers/QueryProvider';
import App from './App.tsx';

validateEnv();
logEnvConfig();

async function bootstrap() {
	try {
		await initI18n();
		configureApiClient();
		setupAxiosInterceptors();

		logger.info('Frontend application started', {
			AppName: env.appName,
			AppVersion: env.appVersion,
			Environment: env.environment,
		});

		createRoot(document.getElementById('root')!).render(
			<StrictMode>
				<QueryProvider>
					<App />
				</QueryProvider>
			</StrictMode>
		);
	} catch (err) {
		logger.error('Failed to bootstrap application', err);
		const root = document.getElementById('root');
		if (root) {
			root.innerHTML =
				'<div style="padding:2rem;font-family:system-ui">' +
				'<h1>Could not load translations</h1>' +
				'<p>Check API at <code>' +
				env.apiUrl +
				'</code> and refresh.</p></div>';
		}
	}
}

void bootstrap();
