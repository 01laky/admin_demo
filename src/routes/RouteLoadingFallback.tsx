import { useTranslation } from 'react-i18next';

/** Minimal shell while lazy admin route chunks load. */
export function RouteLoadingFallback() {
	const { t } = useTranslation('common');
	return (
		<div className="admin-route-loading" role="status" aria-live="polite">
			{t('common.loading') || 'Loading…'}
		</div>
	);
}
