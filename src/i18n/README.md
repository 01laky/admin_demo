# i18n (admin)

This app uses **react-i18next** for UI copy and localized **admin routes** (`routes.*`).

## Canonical documentation

**Architecture, Mermaid diagrams, CMS vs static:**

- Monorepo: [`docs/guides/static-localization-and-i18n.md`](../../../docs/guides/static-localization-and-i18n.md)
- Conventions: [`docs/guides/i18n-conventions.md`](../../../docs/guides/i18n-conventions.md)

## Static UI (target)

| Piece                             | Role                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `config.ts`                       | i18next init from `GET /api/localization/admin` (async bootstrap in `main.tsx`) |
| `fetchLocalizationBundle.ts`      | Fetches bundle before render                                                    |
| `../utils/routeTranslations.ts`   | Localized path segments for React Router                                        |
| `../routes/useAdminRoutePaths.ts` | Builds multi-language route lists from `routes.*`                               |

**Source of truth:** `many_faces_backend/BeDemo.Api/Localization/Admin/*.resx` (no `locales/*.json` in this repo).

## CMS page route translations (database)

**Create Page** / **Edit Page** include **Route translations** fields (`en` / `sk` / `cz`). Those values are stored via `PUT /api/pages/{pageId}/translations` — **not** in the static localization API.

Hooks: `src/hooks/api/usePageRouteTranslationsApi.ts`.

## Usage in components

```tsx
import { useTranslation } from 'react-i18next';

function Example() {
	const { t } = useTranslation('common');
	return <h1>{t('pages.login.title')}</h1>;
}
```

## Adding or editing static copy

1. Edit **admin** `.resx` in `many_faces_backend`.
2. Restart backend; hard refresh admin SPA.
3. Keep `en` / `sk` / `cz` key parity (CI).

For **page URL slugs**, use the page form in the UI — see monorepo guide.
