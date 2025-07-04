import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';

interface IIngredientDetailsState {
	ingredientDetails: null | Pick<
		TIngredient,
		'image' | 'name' | 'proteins' | 'fat' | 'carbohydrates' | 'calories'
	>;
}

const initialState: IIngredientDetailsState = {
	ingredientDetails: null,
};

const ingredientDetailsSlice = createSlice({
	name: 'ingredientDetails',
	initialState: initialState,
	reducers: {
		setIngredientDetails: (
			state,
			action: PayloadAction<{
				image: string;
				name: string;
				proteins: number;
				fat: number;
				carbohydrates: number;
				calories: number;
			}>
		) => {
			state.ingredientDetails = action.payload;
		},
		clearIngredientDetails: (state) => {
			state.ingredientDetails = null;
		},
	},
});

export const { setIngredientDetails, clearIngredientDetails } =
	ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;
