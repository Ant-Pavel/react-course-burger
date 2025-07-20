import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
	getUserData,
	logIn,
	logOut,
	register as registerApi,
	updateUserData as updateUserDataApi,
} from '../utils/authApi';

export interface User {
	email: string;
	name: string;
	password?: string;
}

interface IAuthData {
	user: User | null;
	isAuthChecked: boolean;
}

const initialState: IAuthData = {
	user: null,
	isAuthChecked: false,
};

export const checkIfUserAuthed = createAsyncThunk(
	'auth/checkIfUserAuthed',
	async (_, { dispatch }) => {
		// No token means no user is authenticated
		if (!localStorage.getItem('accessToken')) {
			dispatch(setIsAuthChecked(true));
			return;
		}

		try {
			const result = await getUserData();
			if (result.success) {
				dispatch(setUserData(result.user));
			}
		} finally {
			dispatch(setIsAuthChecked(true));
		}
	}
);

export const login = createAsyncThunk(
	'auth/login',
	async (loginData: { email: string; password: string }, { dispatch }) => {
		const logInResult = await logIn(loginData);
		if (logInResult.success) {
			dispatch(
				setUserData({ ...logInResult.user, password: loginData.password })
			);
		}
		return logInResult;
	}
);

export const logout = createAsyncThunk('auth/logout', async () => {
	const response = await logOut();
	return response;
});

export const register = createAsyncThunk(
	'auth/register',
	async (
		registerData: { email: string; password: string; name: string },
		{ dispatch }
	) => {
		const result = await registerApi(registerData);
		if (result.success) {
			dispatch(setUserData(result.user));
		}
		return result;
	}
);

export const updateUserData = createAsyncThunk(
	'auth/updateUserData',
	async (userData: Required<User>, { dispatch }) => {
		const result = await updateUserDataApi(userData);
		if (result.success) {
			dispatch(setUserData(result.user));
		}
		return result;
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		setUserData: (state, action: PayloadAction<IAuthData['user']>) => {
			state.user = action.payload;
		},
		setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
			state.isAuthChecked = action.payload;
		},
	},
	selectors: {
		getUser: (state) => state.user,
		getIsAuthChecked: (state) => state.isAuthChecked,
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.fulfilled, (state) => {
				state.isAuthChecked = true;
			})
			.addCase(register.fulfilled, (state) => {
				state.isAuthChecked = true;
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
			});
	},
});

export const { setIsAuthChecked, setUserData } = authSlice.actions;
export const { getUser, getIsAuthChecked } = authSlice.selectors;
export default authSlice.reducer;
