import ingredientsSlice, {
	initialState,
	setIngredients,
	fetchIngredients,
} from '@/services/slices/ingredients';
import { describe, expect, it } from 'vitest';
import { ingredients } from '@/utils/ingredients';

describe('testing ingredientsSlice', () => {
	it('should return the initial state', () => {
		expect(ingredientsSlice.reducer(undefined, { type: '' })).toEqual(
			initialState
		);
	});

	it('should handle setIngredients', () => {
		expect(
			ingredientsSlice.reducer(undefined, setIngredients([...ingredients]))
		).toEqual({
			...initialState,
			ingredients: [...ingredients],
		});
	});

	it('should handle fetchIngredients.pending', async () => {
		expect(
			ingredientsSlice.reducer(undefined, {
				type: fetchIngredients.pending.type,
			})
		).toEqual({
			...initialState,
			loading: true,
		});
	});

	it('should handle fetchIngredients.fulfilled', async () => {
		expect(
			ingredientsSlice.reducer(undefined, {
				type: fetchIngredients.fulfilled.type,
				payload: { data: [...ingredients] },
			})
		).toEqual({
			...initialState,
			loading: false,
			ingredients: [...ingredients],
		});
	});

	it('should handle fetchIngredients.rejected', async () => {
		expect(
			ingredientsSlice.reducer(undefined, {
				type: fetchIngredients.rejected.type,
			})
		).toEqual({
			...initialState,
			loading: false,
		});
	});
});
