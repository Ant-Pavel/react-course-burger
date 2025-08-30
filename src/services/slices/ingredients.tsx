import {
	createSlice,
	createAsyncThunk,
	PayloadAction,
	createSelector,
} from '@reduxjs/toolkit';
import type { TIngredient } from '../../utils/types';
import * as ingredientsApi from '@/utils/api/ingredientsApi';
import { RootState } from '../store';

interface IngredientsState {
	ingredients: TIngredient[];
	loading: boolean;
}

export const initialState: IngredientsState = {
	ingredients: [],
	loading: false,
};

export const fetchIngredients = createAsyncThunk(
	'ingredients/fetchIngredients',
	async (_, { dispatch }) => {
		const response = await ingredientsApi.getIngredients();
		if (response.success) {
			dispatch(setIngredients(response.data as TIngredient[]));
		}
		return response;
	}
);

const ingredientsSlice = createSlice({
	name: 'ingredients',
	initialState,
	reducers: {
		setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
			state.ingredients = action.payload;
		},
	},
	selectors: {
		getIngredients: (state) => state.ingredients,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIngredients.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchIngredients.fulfilled, (state, action) => {
				state.loading = false;
				state.ingredients = action.payload.data;
			})
			.addCase(fetchIngredients.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default ingredientsSlice;
export const { setIngredients } = ingredientsSlice.actions;
export const { getIngredients } = ingredientsSlice.selectors;

export const getIngredientsDict = createSelector(
	[getIngredients],
	(ingredients: TIngredient[]) =>
		ingredients.reduce(
			(acc, ingredient) => {
				acc[ingredient._id] = ingredient;
				return acc;
			},
			{} as Record<TIngredient['_id'], TIngredient>
		)
);

export const getIngredientById = createSelector(
	[getIngredients, (_state: RootState, id: string) => id],
	(ingredients: TIngredient[], id: string) =>
		ingredients.find((ingredient) => ingredient._id === id)
);
