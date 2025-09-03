import { request, fetchWithRefresh, removeAuthTokens } from './httpApi.ts';
import type { FailResponse } from './httpApi.ts';

type RegisterData = {
	email: string;
	password: string;
	name: string;
};

type UpdateUserData = RegisterData;

type LoginData = {
	email: string;
	password: string;
};

type ForgotPasswordData = {
	email: string;
};

type ResetPasswordData = {
	password: string;
	token: string;
};

type RegisterSuccessResponse = {
	success: true;
	user: {
		email: string;
		name: string;
	};
	accessToken: string;
	refreshToken: string;
};
type LoginSuccessResponse = RegisterSuccessResponse;

type GetUserSuccessResponse = {
	success: true;
	user: {
		email: string;
		name: string;
	};
};

type SuccessResponseSimple = {
	success: true;
	message: string;
};

type LogoutSuccessResponse = SuccessResponseSimple;
type ForgotPasswordSuccessResponse = SuccessResponseSimple;

type UpdateUserSuccessResponse = {
	success: true;
	user: {
		email: string;
		name: string;
	};
};

export async function logIn(loginData: LoginData) {
	const result = await request<LoginSuccessResponse | FailResponse>(
		'api/auth/login',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginData),
		}
	);

	if (result.success) {
		localStorage.setItem('accessToken', result.accessToken);
		localStorage.setItem('refreshToken', result.refreshToken);
	}

	return result;
}

export async function logOut() {
	const token = localStorage.getItem('refreshToken');
	const result = await request<LogoutSuccessResponse | FailResponse>(
		'api/auth/logout',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token }),
		}
	);

	if (result.success) {
		removeAuthTokens();
	}

	return result;
}

export async function register(registerData: RegisterData) {
	const result = await request<RegisterSuccessResponse | FailResponse>(
		'api/auth/register',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(registerData),
		}
	);

	if (result.success) {
		localStorage.setItem('accessToken', result.accessToken);
		localStorage.setItem('refreshToken', result.refreshToken);
	}

	return result;
}

export async function resetPassword(resetPassData: ForgotPasswordData) {
	return request<ForgotPasswordSuccessResponse | FailResponse>(
		'api/password-reset',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(resetPassData),
		}
	);
}

export async function resetPasswordVerification(
	resetPassData: ResetPasswordData
) {
	return request('api/password-reset/reset', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(resetPassData),
	});
}

export async function getUserData() {
	const accessToken = localStorage.getItem('accessToken') as string;

	const fetchWithRefreshResult = (await fetchWithRefresh('api/auth/user', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: accessToken,
		},
	})) as GetUserSuccessResponse | FailResponse;

	if (!fetchWithRefreshResult.success) {
		removeAuthTokens();
	}

	return fetchWithRefreshResult;
}

export async function updateUserData(userData: UpdateUserData) {
	const accessToken = localStorage.getItem('accessToken') as string;

	const fetchWithRefreshResult = (await fetchWithRefresh('api/auth/user', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: accessToken,
		},
		body: JSON.stringify(userData),
	})) as UpdateUserSuccessResponse | FailResponse;

	if (!fetchWithRefreshResult.success) {
		removeAuthTokens();
	}

	return fetchWithRefreshResult;
}
