export const baseUrl = 'https://norma.nomoreparties.space';
export const wsOrdersAllUrl = 'wss://norma.nomoreparties.space/orders/all';
export const wsOrdersUserUrl = 'wss://norma.nomoreparties.space/orders';

interface IResponseBody {
	success: boolean;
	[key: string]: unknown;
}

type RefreshTokenResponse = {
	success: boolean;
	accessToken: string;
	refreshToken: string;
};

export type FailResponse = {
	success: false;
	message: string;
};

export function checkResponse(response: Response) {
	if (response.ok) {
		return response.json();
	} else {
		return response.json().then((res) => {
			return Promise.reject(res);
		});
	}
}

export async function request<T extends IResponseBody>(
	endpoint: string,
	options?: RequestInit
): Promise<T> {
	const response = await fetch(`${baseUrl}/${endpoint}`, options);
	return checkResponse(response) as Promise<T>;
}

export async function refreshToken() {
	const refreshData = await request<RefreshTokenResponse>('api/auth/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			token: localStorage.getItem('refreshToken'),
		}),
	});

	if (refreshData.success) {
		localStorage.setItem('refreshToken', refreshData.refreshToken);
		localStorage.setItem('accessToken', refreshData.accessToken);
	}

	return refreshData;
}

export async function fetchWithRefresh(endpoint: string, options: RequestInit) {
	try {
		return await request(endpoint, options);
	} catch (error) {
		if ((error as { message: string }).message === 'jwt expired') {
			await refreshToken();
			return request(endpoint, options);
		}
		return Promise.reject(error);
	}
}

export function removeAuthTokens() {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
}
