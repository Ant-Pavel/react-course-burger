import { baseUrl } from './api.ts';

interface RegisterData {
	email: string;
	password: string;
	name: string;
}

type UpdateUserData = RegisterData;

interface LoginData {
	email: string;
	password: string;
}

interface ForgotPasswordData {
	email: string;
}

interface ResetPasswordData {
	password: string;
	token: string;
}

interface RegisterSuccessResponse {
	success: true;
	user: {
		email: string;
		name: string;
	};
	accessToken: string;
	refreshToken: string;
}
type LoginSuccessResponse = RegisterSuccessResponse;

interface GetUserSuccessResponse {
	success: true;
	user: {
		email: string;
		name: string;
	};
}

interface SuccessResponseSimple {
	success: true;
	message: string;
}

type LogoutSuccessResponse = SuccessResponseSimple;
type ForgotPasswordSuccessResponse = SuccessResponseSimple;

interface UpdateUserSuccessResponse {
	success: true;
	user: {
		email: string;
		name: string;
	};
}

interface FailResponse {
	success: false;
	message: string;
}

export const refreshToken = async () => {
	const response = await fetch(`${baseUrl}/api/auth/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			token: localStorage.getItem('refreshToken'),
		}),
	});

	const refreshData = await response.json();
	if (refreshData.success) {
		localStorage.setItem('refreshToken', refreshData.refreshToken);
		localStorage.setItem('accessToken', refreshData.accessToken);
	}

	return refreshData;
};

export const fetchWithRefresh = async (url: string, options: RequestInit) => {
	const res = await fetch(url, options);
	const responseResult = await res.json();
	console.log('fetchWithRefresh response', responseResult);
	if (res.ok && responseResult.success) {
		return responseResult;
	} else if (responseResult.message === 'jwt expired') {
		const refreshData = await refreshToken(); //обновляем токен
		if (refreshData.success) {
			console.log('refreshData ', refreshData);
			(options.headers as { Authorization?: string }).Authorization =
				refreshData.accessToken;
			const res = await fetch(url, options); //повторяем запрос
			const responseResult = await res.json();
			return responseResult;
		}
		return refreshData;
	}
	return responseResult;
};

export async function logIn(
	loginData: LoginData
): Promise<LoginSuccessResponse | FailResponse> {
	const resp = await fetch(`${baseUrl}/api/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(loginData),
	});

	const result = await resp.json();
	if (result.success) {
		localStorage.setItem('accessToken', result.accessToken);
		localStorage.setItem('refreshToken', result.refreshToken);
	}

	return result;
}

export async function logOut(): Promise<LogoutSuccessResponse | FailResponse> {
	const token = localStorage.getItem('refreshToken');
	const resp = await fetch(`${baseUrl}/api/auth/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ token }),
	});

	const result = await resp.json();
	if (result.success) {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
	}
	return result;
}

export async function register(
	registerData: RegisterData
): Promise<RegisterSuccessResponse | FailResponse> {
	const resp = await fetch(`${baseUrl}/api/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(registerData),
	});

	const result = await resp.json();

	if (result.success) {
		localStorage.setItem('accessToken', result.accessToken);
		localStorage.setItem('refreshToken', result.refreshToken);
	}

	return result;
}

export async function resetPassword(
	resetPassData: ForgotPasswordData
): Promise<ForgotPasswordSuccessResponse | FailResponse> {
	const resp = await fetch(`${baseUrl}/api/password-reset`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(resetPassData),
	});
	return await resp.json();
}

export async function resetPasswordVerification(
	resetPassData: ResetPasswordData
) {
	const resp = await fetch(`${baseUrl}/api/password-reset/reset`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(resetPassData),
	});
	const result = await resp.json();
	return result;
}

export async function getUserData(): Promise<
	GetUserSuccessResponse | FailResponse
> {
	try {
		const accessToken = localStorage.getItem('accessToken') as string;

		const fetchWithRefreshResult = await fetchWithRefresh(
			`${baseUrl}/api/auth/user`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: accessToken,
				},
			}
		);

		if (!fetchWithRefreshResult.success) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
		}

		return fetchWithRefreshResult;
	} catch (error) {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		throw error;
	}
}

export async function updateUserData(
	userData: UpdateUserData
): Promise<UpdateUserSuccessResponse | FailResponse> {
	try {
		const accessToken = localStorage.getItem('accessToken') as string;

		const fetchWithRefreshResult = await fetchWithRefresh(
			`${baseUrl}/api/auth/user`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: accessToken,
				},
				body: JSON.stringify(userData),
			}
		);

		if (!fetchWithRefreshResult.success) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
		}

		return fetchWithRefreshResult;
	} catch (error) {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		throw error;
	}
}
