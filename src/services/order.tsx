import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { createOrder } from '../utils/orderApi';

interface OrderState {
	orderCode: string;
	loading: boolean;
}

const initialState: OrderState = {
	orderCode: '',
	loading: false,
};

export const sendOrder = createAsyncThunk(
	'order/sendOrder',
	async (_, { getState }) => {
		const state = getState() as RootState;
		const { bun, ingredients } = state.burgerConstructor;
		if (!bun) {
			throw new Error('Bun is required to create an order');
		}

		if (ingredients.length === 0) {
			throw new Error('At least one ingredient is required to create an order');
		}

		const ingredientsIds = [
			bun._id,
			...ingredients.map((ingredient) => ingredient._id),
			bun._id,
		];

		const response = await createOrder({ ingredients: ingredientsIds });
		return String(response.order.number);
	}
);

const ingredientsSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(sendOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(sendOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.orderCode = action.payload;
			})
			.addCase(sendOrder.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default ingredientsSlice.reducer;
