import { Navigate, useParams } from 'react-router-dom';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

/** Legacy `/users/:id/edit` → operator user detail. */
export function UserEditRedirect() {
	const { id } = useParams<{ id: string }>();
	const getLocalizedPath = useLocalizedLink();
	if (!id) {
		return <Navigate to={getLocalizedPath('/users')} replace />;
	}
	return <Navigate to={getLocalizedPath(`/users/${id}`)} replace />;
}
