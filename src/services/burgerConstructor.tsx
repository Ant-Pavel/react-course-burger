import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';
import type { RootState, AppDispatch } from './store';

export interface TConstructorIngredient extends TIngredient {
	construcrorId: string;
}

interface IBurgerConstructorState {
	bun: TIngredient | null;
	ingredients: TConstructorIngredient[];
}

const initialState: IBurgerConstructorState = {
	bun: null,
	ingredients: [],
};

export const addIngredientById =
	(ingredientId: string) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();
		const ingredient = state.ingredients.ingredients.find(
			(ing) => ing._id === ingredientId
		);

		if (!ingredient) {
			console.error('Ingredient not found');
			return;
		}

		if (ingredient.type === 'bun') {
			dispatch(setBun({ ...ingredient, construcrorId: uuidv4() }));
		} else {
			dispatch(addIngredient({ ...ingredient, construcrorId: uuidv4() }));
		}
	};

const burgerConstructorSlice = createSlice({
	name: 'burgerConstructor',
	initialState,
	reducers: {
		setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
			state.bun = action.payload;
		},
		removeBun: (state) => {
			state.bun = null;
		},
		addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
			state.ingredients.push(action.payload);
		},
		removeIngredient: (state, action: PayloadAction<string>) => {
			state.ingredients = state.ingredients.filter(
				(ingredient) => ingredient.construcrorId !== action.payload
			);
		},
		moveIngredient: (
			state,
			action: PayloadAction<{ toIndex: number; fromIndex: number }>
		) => {
			const { toIndex, fromIndex } = action.payload;
			const ingredients = [...state.ingredients];
			ingredients.splice(toIndex, 0, ingredients.splice(fromIndex, 1)[0]);
			state.ingredients = ingredients;
		},
	},
});

const selectBurgerConstructor = (state: RootState) => state.burgerConstructor;

export const selectBun = createSelector(
	[selectBurgerConstructor],
	(burgerConstructor) => burgerConstructor.bun
);

export const selectIngredients = createSelector(
	[selectBurgerConstructor],
	(burgerConstructor) => burgerConstructor.ingredients
);
export const getTotalPriceSelector = createSelector(
	[selectBun, selectIngredients],
	(bun, ingredients) => {
		if (!bun || !ingredients.length) return 0;
		return (
			bun.price * 2 + ingredients.reduce((acc, { price }) => acc + price, 0)
		);
	}
);

export const selectIngredientsCount = createSelector(
	[selectBun, selectIngredients],
	(bun, ingredients) => {
		const res = {} as Record<string, number>;
		if (bun) {
			res[bun._id] = 2;
		}
		ingredients.forEach((ingredient) => {
			if (!res[ingredient._id]) res[ingredient._id] = 0;
			res[ingredient._id]++;
		});

		return res;
	}
);

export const {
	setBun,
	removeBun,
	addIngredient,
	removeIngredient,
	moveIngredient,
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
