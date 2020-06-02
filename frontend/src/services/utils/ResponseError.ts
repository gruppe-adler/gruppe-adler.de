export default class ResponseError extends Error {
    public readonly type = 'ResponseError';
    public response: Response;

    constructor (response: Response) {
        super(response.statusText);

        this.response = response;
    }
}
