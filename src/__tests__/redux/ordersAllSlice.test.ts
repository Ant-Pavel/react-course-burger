import ordersAllSlice, { initialState } from '@/services/slices/ordersAll';
import { describe, expect, it } from 'vitest';
import {
	onClose,
	onError,
	onMessage,
	onOpen,
} from '@/services/actions/ordersAllSocketActions';
import { WebSocketStatus } from '@/utils/types';

describe('testing ordersAllSlice', () => {
	it('should return the initial state', () => {
		expect(ordersAllSlice.reducer(undefined, { type: '' })).toEqual(
			initialState
		);
	});

	describe('testing socket actions', () => {
		it('should handle onOpen', () => {
			expect(ordersAllSlice.reducer(undefined, onOpen())).toEqual({
				...initialState,
				status: WebSocketStatus.ONLINE,
			});
		});

		it('should handle onMessage', () => {
			const payload = {
				orders: [
					{
						_id: '1',
						name: 'starter burger',
						status: 'pending' as const,
						number: 123321,
						createdAt: '',
						updatedAt: '',
						ingredients: ['ingredientId1', 'ingredientId2', 'ingredientId3'],
					},
				],
				total: 0,
				totalToday: 0,
			};
			expect(
				ordersAllSlice.reducer(undefined, onMessage({ ...payload }))
			).toEqual({
				...initialState,
				orders: [...payload.orders],
				total: payload.total,
				totalToday: payload.totalToday,
				gotFirstMessage: true,
			});
		});

		it('should handle onError', () => {
			const payload = 'error';
			expect(ordersAllSlice.reducer(undefined, onError(payload))).toEqual({
				...initialState,
				error: payload,
				status: WebSocketStatus.OFFLINE,
			});
		});

		it('should handle onClose', () => {
			expect(ordersAllSlice.reducer(undefined, onClose())).toEqual({
				...initialState,
				status: WebSocketStatus.OFFLINE,
			});
		});
	});
});
