import ordersUserSlice, { initialState } from '@/services/slices/ordersUser';
import { describe, expect, it } from 'vitest';
import {
	onClose,
	onError,
	onMessage,
	onOpen,
} from '@/services/actions/ordersUserSocketActions';
import { WebSocketStatus } from '@/utils/types';

describe('testing ordersUserSlice', () => {
	it('should return the initial state', () => {
		expect(ordersUserSlice.reducer(undefined, { type: '' })).toEqual(
			initialState
		);
	});

	describe('testing socket actions', () => {
		it('should handle onOpen', () => {
			expect(ordersUserSlice.reducer(undefined, onOpen())).toEqual({
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
				ordersUserSlice.reducer(undefined, onMessage({ ...payload }))
			).toEqual({
				...initialState,
				orders: [...payload.orders],
				gotFirstMessage: true,
			});
		});

		it('should handle onError', () => {
			const payload = 'error';
			expect(ordersUserSlice.reducer(undefined, onError(payload))).toEqual({
				...initialState,
				error: payload,
				status: WebSocketStatus.OFFLINE,
			});
		});

		it('should handle onClose', () => {
			expect(ordersUserSlice.reducer(undefined, onClose())).toEqual({
				...initialState,
				status: WebSocketStatus.OFFLINE,
			});
		});
	});
});
