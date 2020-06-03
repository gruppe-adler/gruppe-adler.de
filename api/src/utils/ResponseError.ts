export default class ReponseError extends Error {
    public static readonly type = 'ResponseError';

    public status: number;

    constructor(status: number, msg?: string) {
        super(msg);
        this.status = status;
    }
}
