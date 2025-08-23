import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import * as orderApi from '../utils/orderApi';
import { TOrder } from '@/utils/types';

interface OrderState {
	orderNumber: string;
	order: TOrder | null;
	loading: boolean;
}

const initialState: OrderState = {
	orderNumber: '',
	order: null,
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

		const response = await orderApi.createOrder({
			ingredients: ingredientsIds,
		});
		return String(response.order.number);
	}
);

export const loadOrder = createAsyncThunk(
	'order/getOrder',
	async (number: number, { dispatch }) => {
		const getOrderResult = await orderApi.loadOrder(number);
		if (getOrderResult.success) {
			dispatch(setOrderData(getOrderResult.orders[0]));
		}
		return getOrderResult;
	}
);

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		setOrderData: (state, action: PayloadAction<TOrder>) => {
			state.order = action.payload;
			state.orderNumber = String(action.payload.number);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(sendOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(sendOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.orderNumber = action.payload;
			})
			.addCase(sendOrder.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default orderSlice;
const { setOrderData } = orderSlice.actions;
