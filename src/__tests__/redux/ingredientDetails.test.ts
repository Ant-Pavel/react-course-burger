import ingredientDetailsSlice, {
	initialState,
	setIngredientDetails,
	clearIngredientDetails,
} from '@/services/slices/ingredientDetails';
import { describe, expect, it } from 'vitest';

describe('testing ingredientDetailsSlice', () => {
	const ingredientDetails = {
		image: 'https://code.s3.yandex.net/react/code/bun-02.png',
		name: 'Ingredient 1',
		proteins: 420,
		fat: 142,
		carbohydrates: 242,
		calories: 4242,
	};

	it('should return the initial state', () => {
		expect(ingredientDetailsSlice.reducer(undefined, { type: '' })).toEqual(
			initialState
		);
	});

	it('should handle setIngredientDetails', () => {
		expect(
			ingredientDetailsSlice.reducer(
				undefined,
				setIngredientDetails({ ...ingredientDetails })
			)
		).toEqual({
			...initialState,
			ingredientDetails: { ...ingredientDetails },
		});
	});

	it('should handle clearIngredientDetails', () => {
		expect(
			ingredientDetailsSlice.reducer(
				{
					ingredientDetails: { ...ingredientDetails },
				},
				clearIngredientDetails()
			)
		).toEqual(initialState);
	});
});
