import { request } from './httpApi.ts';
import type { TIngredient } from './types';

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

export const createOrder = async (data: CreateOrderData) => {
	return request<CreateOrderResponse>('api/oders', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
};
