import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '../utils/types';
import { WebSocketStatus } from '@/utils/types';
import {
	onClose,
	onError,
	onMessage,
	onOpen,
} from './actions/ordersUserSocketActions';

interface IOrdersState {
	orders: TOrder[];
	status: WebSocketStatus;
	error: string | null;
	gotFirstMessage: boolean;
}

const initialState: IOrdersState = {
	orders: [],
	status: WebSocketStatus.OFFLINE,
	error: null,
	gotFirstMessage: false,
};

const ordersUserSlice = createSlice({
	name: 'ordersUser',
	initialState,
	reducers: {},
	selectors: {
		getOrders: (state) => state.orders,
	},
	extraReducers: (builder) => {
		builder.addCase(onOpen, (state) => {
			state.status = WebSocketStatus.ONLINE;
		});
		builder.addCase(
			onMessage,
			(state, action: PayloadAction<{ orders: TOrder[] }>) => {
				state.gotFirstMessage = true;
				state.orders = action.payload.orders;
			}
		);
		builder.addCase(onError, (state, action) => {
			state.error = action.payload;
			state.status = WebSocketStatus.OFFLINE;
		});
		builder.addCase(onClose, (state) => {
			state.status = WebSocketStatus.OFFLINE;
		});
	},
});

export default ordersUserSlice;
export const { getOrders } = ordersUserSlice.selectors;
