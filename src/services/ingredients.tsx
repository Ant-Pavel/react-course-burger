import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '../utils/types';
import { ingredientsUrl } from '@/utils/api';

interface IngredientsState {
	ingredients: TIngredient[];
	loading: boolean;
	error: string | null;
}

const initialState: IngredientsState = {
	ingredients: [],
	loading: false,
	error: null,
};

export const fetchIngredients = createAsyncThunk(
	'ingredients/fetchIngredients',
	async () => {
		const response = await fetch(ingredientsUrl);
		if (!response.ok) {
			throw new Error('Failed to fetch ingredients');
		}
		const data = await response.json();
		return data.data as TIngredient[];
	}
);

const ingredientsSlice = createSlice({
	name: 'ingredients',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIngredients.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchIngredients.fulfilled, (state, action) => {
				state.loading = false;
				state.ingredients = action.payload;
			})
			.addCase(fetchIngredients.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch ingredients';
			});
	},
});

export default ingredientsSlice.reducer;
