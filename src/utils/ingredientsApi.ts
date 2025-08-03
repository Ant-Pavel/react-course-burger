import { request } from './httpApi.ts';
import type { TIngredient } from './types';

type GetIngredientsResponse = {
	success: boolean;
	data: TIngredient[];
};

export const getIngredients = async () => {
	return request<GetIngredientsResponse>('api/ingredients');
};
