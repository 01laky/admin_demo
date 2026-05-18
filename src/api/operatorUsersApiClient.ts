import { request as __request } from './core/request';
import { OpenAPI } from './core/OpenAPI';
import { buildSetFaceRoleBody } from '@/utils/operatorModerationUtils';

export async function fetchOperatorUserDetail(userId: string) {
	return __request(OpenAPI, {
		method: 'GET',
		url: '/api/operator-users/users/{id}/detail',
		path: { id: userId },
	});
}

export async function postOperatorGlobalBan(userId: string, reason: string) {
	return __request(OpenAPI, {
		method: 'POST',
		url: '/api/operator-users/users/{id}/global-ban',
		path: { id: userId },
		body: { reason },
	});
}

export async function deleteOperatorGlobalBan(userId: string) {
	return __request(OpenAPI, {
		method: 'DELETE',
		url: '/api/operator-users/users/{id}/global-ban',
		path: { id: userId },
	});
}

export async function postOperatorFaceBan(userId: string, faceId: number, reason: string) {
	return __request(OpenAPI, {
		method: 'POST',
		url: '/api/operator-users/users/{id}/faces/{faceId}/ban',
		path: { id: userId, faceId },
		body: { reason },
	});
}

export async function deleteOperatorFaceBan(userId: string, faceId: number) {
	return __request(OpenAPI, {
		method: 'DELETE',
		url: '/api/operator-users/users/{id}/faces/{faceId}/ban',
		path: { id: userId, faceId },
	});
}

export async function patchOperatorFaceRole(userId: string, faceId: number, userRoleId: number) {
	return __request(OpenAPI, {
		method: 'PATCH',
		url: '/api/operator-users/users/{id}/faces/{faceId}/role',
		path: { id: userId, faceId },
		body: buildSetFaceRoleBody(userRoleId),
	});
}

export async function postOperatorPlatformMessage(userId: string, content: string) {
	return __request(OpenAPI, {
		method: 'POST',
		url: '/api/operator-users/users/{id}/platform-messages',
		path: { id: userId },
		body: { content },
	});
}
