export class ObjectURL {
    static table = new Map<Blob, { url: string, count: number }>();

    public readonly url: string;

    constructor(private blob: Blob) {
        const entity = ObjectURL.table.get(blob);
        if (entity) {
            this.url = entity.url;
            entity.count++;
        } else {
            this.url = URL.createObjectURL(blob);
            ObjectURL.table.set(blob, {
                count: 1,
                url: this.url,
            });
        }
    }

    destroy() {
        const entity = ObjectURL.table.get(this.blob);
        if (!entity) return;

        if (entity.count === 1) {
            ObjectURL.table.delete(this.blob);
            URL.revokeObjectURL(entity.url);
        } else {
            entity.count--;
        }
    }
}

Object.defineProperty(window, 'getObjectUrls', {
    value: () => Array.from(ObjectURL.table.values()),
});
