import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { env } from '../../config/env';

/** Builds the admin AI chat SignalR hub (JWT via `accessTokenFactory`). */
export function buildAdminAiChatHubConnection(accessToken: string): HubConnection {
	const hubUrl = `${env.apiUrl}/hubs/chat`;
	return new HubConnectionBuilder()
		.withUrl(hubUrl, {
			accessTokenFactory: () => accessToken,
		})
		.withAutomaticReconnect()
		.build();
}
