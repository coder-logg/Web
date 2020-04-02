import { backendHost } from '../config';

export function backendApi(
    method: string,
    httpMethod: string = 'GET',
    data: { [key: string]: any } = {},
    headers: { [key: string]: any } = {},
    init: object = {}
): Promise<Response> {
    const dataArray: string[] = [];

    for (const key in data) {
        dataArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }

    return fetch(`${backendHost}/api/v1/${method}`, {
        ...init,

        method: httpMethod,
        body: ['GET', 'HEAD'].includes(httpMethod.toUpperCase()) ? undefined : dataArray.join('&'),
        headers: {
            ...headers,

            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    });
}

export function authorizedBackendApi(
    method: string,
    session: string,
    httpMethod: string = 'GET',
    data: { [key: string]: any } = {},
    headers: { [key: string]: any } = {},
    init: object = {}
) {
    return backendApi(method, httpMethod, data, {
        ...headers,

        'Authorization': `Basic ${session}`
    }, init);
}
