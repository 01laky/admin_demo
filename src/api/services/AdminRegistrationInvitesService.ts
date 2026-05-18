/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCreateRegistrationInviteDto } from '../models/AdminCreateRegistrationInviteDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminRegistrationInvitesService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAdminRegistrationInvites({
        skip,
        take,
    }: {
        skip?: number,
        take?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/registration-invites',
            query: {
                'Skip': skip,
                'Take': take,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiAdminRegistrationInvites({
        requestBody,
    }: {
        requestBody?: AdminCreateRegistrationInviteDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/registration-invites',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiAdminRegistrationInvitesRevoke({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/registration-invites/{id}/revoke',
            path: {
                'id': id,
            },
        });
    }
}
