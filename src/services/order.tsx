import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
import { ordersUrl } from '@/utils/api';
import type { RootState } from './store';

interface OrderState {
	orderCode: string;
	loading: boolean;
	error: string | null;
}

const initialState: OrderState = {
	orderCode: '',
	loading: false,
	error: null,
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

		const response = await fetch(ordersUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				ingredients: ingredientsIds,
			}),
		});
		if (!response.ok) {
			throw new Error('Failed to send order');
		}
		const data = await response.json();
		return String(data.order.number);
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
				state.error = null;
			})
			.addCase(sendOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.orderCode = action.payload;
			})
			.addCase(sendOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to send order';
			});
	},
});

export default ingredientsSlice.reducer;
