import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '../utils/types';
import { getIngredients } from '@/utils/ingredientsApi';

interface IngredientsState {
	ingredients: TIngredient[];
	loading: boolean;
}

const initialState: IngredientsState = {
	ingredients: [],
	loading: false,
};

export const fetchIngredients = createAsyncThunk(
	'ingredients/fetchIngredients',
	async (_, { dispatch }) => {
		const response = await getIngredients();
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
		getIngredientById: (state, id: string) =>
			state.ingredients.find((ingredient) => ingredient._id === id),
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

export default ingredientsSlice.reducer;
const { setIngredients } = ingredientsSlice.actions;
export const { getIngredientById } = ingredientsSlice.selectors;
