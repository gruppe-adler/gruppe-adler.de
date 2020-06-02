import ResponseError from './ResponseError';

export const fetchJSON = async <T>(input: RequestInfo, init: RequestInit = {}): Promise<T> => {
    const response = await fetch(input, { credentials: 'include', ...init });

    if (!response.ok) throw new ResponseError(response);

    return await response.json();
};
