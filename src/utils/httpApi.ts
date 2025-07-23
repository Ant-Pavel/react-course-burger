export const baseUrl = 'https://norma.nomoreparties.space';

interface IResponseBody {
	success: boolean;
	[key: string]: unknown;
}

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
