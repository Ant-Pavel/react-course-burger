import burgerConstructorSlice, {
	initialState,
	setBun,
	removeBun,
	addIngredient,
	removeIngredient,
	moveIngredient,
	resetConstructor,
} from '@/services/slices/burgerConstructor';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it } from 'vitest';
import { ingredients } from '@/utils/ingredients';

describe('testing burgerConstructorSlice', () => {
	it('should return initial state', () => {
		expect(burgerConstructorSlice.reducer(undefined, { type: '' })).toEqual(
			initialState
		);
	});

	const [ingredient1, ingredient2, ingredient3] = ingredients;

	const [
		constructorIngredient1,
		constructorIngredient2,
		constructorIngredient3,
	] = [ingredient1, ingredient2, ingredient3].map((ingredient) => ({
		...ingredient,
		constructorId: uuidv4(),
	}));

	it('should handle setBun', () => {
		expect(
			burgerConstructorSlice.reducer(
				undefined,
				setBun({ ...constructorIngredient1 })
			)
		).toEqual({
			...initialState,
			bun: { ...constructorIngredient1 },
		});
	});

	it('should handle removeBun', () => {
		expect(
			burgerConstructorSlice.reducer(
				{
					...initialState,
					bun: { ...constructorIngredient1 },
				},
				removeBun()
			)
		).toEqual(initialState);
	});

	it('should handle addIngredient', () => {
		expect(
			burgerConstructorSlice.reducer(
				undefined,
				addIngredient({ ...constructorIngredient1 })
			)
		).toEqual({
			...initialState,
			ingredients: [{ ...constructorIngredient1 }],
		});
	});

	it('should handle removeIngredient', () => {
		expect(
			burgerConstructorSlice.reducer(
				{
					...initialState,
					ingredients: [{ ...constructorIngredient1 }],
				},
				removeIngredient(constructorIngredient1.constructorId)
			)
		).toEqual(initialState);
	});

	it('should handle not removeIngredient', () => {
		expect(
			burgerConstructorSlice.reducer(
				{
					...initialState,
					ingredients: [{ ...constructorIngredient1 }],
				},
				removeIngredient('')
			)
		).toEqual({
			...initialState,
			ingredients: [{ ...constructorIngredient1 }],
		});
	});

	it('should handle resetConstructor', () => {
		expect(
			burgerConstructorSlice.reducer(
				{
					...initialState,
					bun: { ...constructorIngredient1 },
					ingredients: [
						{ ...constructorIngredient2 },
						{ ...constructorIngredient3 },
					],
				},
				resetConstructor()
			)
		).toEqual(initialState);
	});

	it('should handle moveIngredient', () => {
		expect(
			burgerConstructorSlice.reducer(
				{
					...initialState,
					ingredients: [
						{ ...constructorIngredient2 },
						{ ...constructorIngredient3 },
					],
				},
				moveIngredient({ toIndex: 0, fromIndex: 1 })
			)
		).toEqual({
			...initialState,
			ingredients: [
				{ ...constructorIngredient3 },
				{ ...constructorIngredient2 },
			],
		});
	});
});
