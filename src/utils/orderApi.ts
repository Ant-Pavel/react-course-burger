import { fetchWithRefresh, request, removeAuthTokens } from './httpApi.ts';
import type { FailResponse } from './httpApi.ts';
import type { TIngredient, TOrder } from './types';

type CreateOrderResponse = {
	name: string;
	order: {
		number: number;
	};
	success: boolean;
};

type CreateOrderData = {
	ingredients: TIngredient['_id'][];
};

type GetOrderResponse = {
	success: boolean;
	orders: [TOrder];
};

export const createOrder = async (data: CreateOrderData) => {
	const accessToken = localStorage.getItem('accessToken') as string;
	return request<CreateOrderResponse>('api/orders', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: accessToken,
		},
		body: JSON.stringify(data),
	});
};

export const loadOrder = async (number: number) => {
	const accessToken = localStorage.getItem('accessToken') as string;

	const fetchWithRefreshResult = (await fetchWithRefresh(
		`api/orders/${number}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: accessToken,
			},
		}
	)) as GetOrderResponse | FailResponse;

	if (!fetchWithRefreshResult.success) {
		removeAuthTokens();
	}

	return fetchWithRefreshResult;
};
