export default class ResponseError extends Error {
    public readonly type = 'ResponseError';
    public response: Response;

    constructor (response: Response) {
        super(response.statusText);

        this.response = response;
    }

    public static is (val: unknown): val is ResponseError {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (val as any).type === 'ResponseError';
    }
}
