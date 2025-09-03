import authSlice, {
	initialState,
	setIsAuthChecked,
	setUserData,
	login,
	register,
	logout,
} from '@/services/slices/auth';
import { describe, expect, it } from 'vitest';

describe('testing authSlice', () => {
	it('should return initial state', () => {
		expect(authSlice.reducer(undefined, { type: '' })).toEqual(initialState);
	});

	it('should handle setIsAuthChecked', () => {
		expect(authSlice.reducer(undefined, setIsAuthChecked(true))).toEqual({
			...initialState,
			isAuthChecked: true,
		});
	});

	it('should handle setUserData', () => {
		expect(
			authSlice.reducer(
				undefined,
				setUserData({ email: 'test@mail.ru', name: 'Ivan', password: '123' })
			)
		).toEqual({
			...initialState,
			user: {
				email: 'test@mail.ru',
				name: 'Ivan',
				password: '123',
			},
		});
	});

	it('should handle login', () => {
		expect(
			authSlice.reducer(undefined, {
				type: login.fulfilled.type,
				payload: { email: 'test@mail.ru', password: '123456' },
			})
		).toEqual({
			...initialState,
			isAuthChecked: true,
		});
	});

	it('should handle register', () => {
		expect(
			authSlice.reducer(undefined, {
				type: register.fulfilled.type,
				payload: {
					email: 'test@mail.ru',
					name: 'Michael',
					password: '123456',
				},
			})
		).toEqual({
			...initialState,
			isAuthChecked: true,
		});
	});

	it('should handle logout', () => {
		expect(
			authSlice.reducer(undefined, { type: logout.fulfilled.type })
		).toEqual(initialState);
	});
});
