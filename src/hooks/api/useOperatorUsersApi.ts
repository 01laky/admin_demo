import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { __request } from '../../api/core/request';
import { OpenAPI } from '../../api/core/OpenAPI';

export interface OperatorUserFaceRow {
	faceId: number;
	faceIndex: string;
	faceTitle: string;
	userRoleId: number;
	roleName: string;
	isActiveParticipant: boolean;
	isFaceBanned: boolean;
}

export interface OperatorUserDetail {
	id: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	createdAt?: string;
	globalRole: { userRoleId: number; name: string };
	badges: {
		isGloballyBanned: boolean;
		activeFaceBanCount: number;
		emailConfirmed: boolean;
		accessTokenVersion: number;
	};
	faces: OperatorUserFaceRow[];
}

export interface FaceRoleOption {
	id: number;
	name: string;
}

const operatorUserDetailKey = (id: string) => ['operator-user-detail', id] as const;

export function useOperatorUserDetail(userId: string) {
	return useQuery({
		queryKey: operatorUserDetailKey(userId),
		queryFn: async () => {
			const response = await __request(OpenAPI, {
				method: 'GET',
				url: '/api/operator-users/users/{id}/detail',
				path: { id: userId },
			});
			return response as OperatorUserDetail;
		},
		enabled: !!userId,
	});
}

export function useFaceRoles() {
	return useQuery({
		queryKey: ['face-roles'],
		queryFn: async () => {
			const response = await __request(OpenAPI, {
				method: 'GET',
				url: '/api/faces/face-roles',
			});
			return response as FaceRoleOption[];
		},
		staleTime: 10 * 60 * 1000,
	});
}

export function useOperatorUserMutations(userId: string) {
	const queryClient = useQueryClient();

	const invalidate = () =>
		queryClient.invalidateQueries({ queryKey: operatorUserDetailKey(userId) });

	const globalBan = useMutation({
		mutationFn: (reason: string) =>
			__request(OpenAPI, {
				method: 'POST',
				url: '/api/operator-users/users/{id}/global-ban',
				path: { id: userId },
				body: { reason },
			}),
		onSuccess: invalidate,
	});

	const globalUnban = useMutation({
		mutationFn: () =>
			__request(OpenAPI, {
				method: 'DELETE',
				url: '/api/operator-users/users/{id}/global-ban',
				path: { id: userId },
			}),
		onSuccess: invalidate,
	});

	const faceBan = useMutation({
		mutationFn: ({ faceId, reason }: { faceId: number; reason: string }) =>
			__request(OpenAPI, {
				method: 'POST',
				url: '/api/operator-users/users/{id}/faces/{faceId}/ban',
				path: { id: userId, faceId },
				body: { reason },
			}),
		onSuccess: invalidate,
	});

	const faceUnban = useMutation({
		mutationFn: (faceId: number) =>
			__request(OpenAPI, {
				method: 'DELETE',
				url: '/api/operator-users/users/{id}/faces/{faceId}/ban',
				path: { id: userId, faceId },
			}),
		onSuccess: invalidate,
	});

	const setFaceRole = useMutation({
		mutationFn: ({ faceId, userRoleId }: { faceId: number; userRoleId: number }) =>
			__request(OpenAPI, {
				method: 'PATCH',
				url: '/api/operator-users/users/{id}/faces/{faceId}/role',
				path: { id: userId, faceId },
				body: { userRoleId },
			}),
		onSuccess: invalidate,
	});

	const sendMessage = useMutation({
		mutationFn: (content: string) =>
			__request(OpenAPI, {
				method: 'POST',
				url: '/api/operator-users/users/{id}/platform-messages',
				path: { id: userId },
				body: { content },
			}),
	});

	return { globalBan, globalUnban, faceBan, faceUnban, setFaceRole, sendMessage };
}
