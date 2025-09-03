import orderSlice, {
	initialState,
	setOrderData,
	sendOrder,
} from '@/services/slices/order';
import { describe, expect, it } from 'vitest';

describe('testing orderSlice', () => {
	const order = {
		_id: '1',
		name: 'starter burger',
		status: 'pending' as const,
		number: 123321,
		createdAt: '',
		updatedAt: '',
		ingredients: ['ingredientId1', 'ingredientId2', 'ingredientId3'],
	};

	it('should return the initial state', () => {
		expect(orderSlice.reducer(undefined, { type: '' })).toEqual(initialState);
	});

	it('should handle setOrderData', () => {
		expect(orderSlice.reducer(undefined, setOrderData({ ...order }))).toEqual({
			...initialState,
			orderNumber: String(order.number),
			order: { ...order },
		});
	});

	it('should handle sendOrder.pending', () => {
		expect(
			orderSlice.reducer(undefined, { type: sendOrder.pending.type })
		).toEqual({
			...initialState,
			loading: true,
		});
	});

	it('should handle sendOrder.fulfilled', () => {
		expect(
			orderSlice.reducer(undefined, {
				type: sendOrder.fulfilled.type,
				payload: '123',
			})
		).toEqual({
			...initialState,
			loading: false,
			orderNumber: '123',
		});
	});

	it('should handle sendOrder.rejected', () => {
		expect(
			orderSlice.reducer(undefined, { type: sendOrder.rejected.type })
		).toEqual({
			...initialState,
			loading: false,
		});
	});
});
