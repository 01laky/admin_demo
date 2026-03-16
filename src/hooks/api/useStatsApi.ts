import { useQuery } from '@tanstack/react-query';
import { OpenAPI } from '../../api/core/OpenAPI';
import { request as __request } from '../../api/core/request';

export interface Stats {
	usersCount: number;
	friendRequestsCount: number;
	messagesCount: number;
}

const fetchStats = async (): Promise<Stats> => {
	const response = await __request(OpenAPI, {
		method: 'GET',
		url: '/api/Stats',
	});
	return response as Stats;
};

export function useStats() {
	return useQuery({
		queryKey: ['stats'],
		queryFn: fetchStats,
	});
}
