import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '../utils/types';
import { ingredientsUrl } from '@/utils/api';

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
		const response = await fetch(ingredientsUrl);
		const data = await response.json();
		if (response.ok) {
			dispatch(setIngredients(data.data as TIngredient[]));
		}
		return data;
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
			.addCase(fetchIngredients.fulfilled, (state) => {
				state.loading = false;
			});
	},
});

export default ingredientsSlice.reducer;
const { setIngredients } = ingredientsSlice.actions;
export const { getIngredientById } = ingredientsSlice.selectors;
