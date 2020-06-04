import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';

export class UploadService {
    private static instance: UploadService|null = null;
    public static readonly UPLOADS_BASE_PATH = 'data/uploads';

    private static readonly MINE_TYPES = new Map<string, string>([
        ['image/gif', 'gif'],
        ['image/jpeg', 'jpeg'],
        ['image/png', 'png'],
        ['image/webp', 'webp'],
        ['image/svg+xml', 'svg'],
        ['image/bmp', 'bmp']
    ]);

    public static get ALLOWED_MIME_TYPES(): string[] {
        return Array.from(this.MINE_TYPES.keys());
    }

    private constructor() {
        // create directory if it doesn't exist already
        if (!existsSync(UploadService.UPLOADS_BASE_PATH)) {
            mkdirSync(UploadService.UPLOADS_BASE_PATH);
        }
    }

    public static getInstance(): UploadService {
        if (this.instance === null) {
            this.instance = new UploadService();
        }

        return this.instance;
    }

    public saveFile(buffer: Buffer, mimeType: string): string {
        if (!UploadService.MINE_TYPES.has(mimeType.toLowerCase())) throw new Error(`MIME type '${mimeType}' is not allowed`);

        const fileEnding: string = UploadService.MINE_TYPES.get(mimeType.toLowerCase());

        // generate random name
        let name = UploadService.randomName();
        while (existsSync(`${UploadService.UPLOADS_BASE_PATH}/${name}.${fileEnding}`)) name = UploadService.randomName();

        writeFileSync(`${UploadService.UPLOADS_BASE_PATH}/${name}.${fileEnding}`, buffer);

        return `${name}.${fileEnding}`;
    }

    public removeFile(name: string): void {
        if (!existsSync(`${UploadService.UPLOADS_BASE_PATH}/${name}`)) return;

        unlinkSync(`${UploadService.UPLOADS_BASE_PATH}/${name}`);
    }

    private static randomName(): string {
        return (Math.random().toString(36).substr(2)) + (Math.random().toString(36).substr(2));
    }
}
