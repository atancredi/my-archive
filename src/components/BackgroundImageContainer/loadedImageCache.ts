class ImageLRUCache {
    private cache: Set<string>;
    private limit: number;

    constructor(limit: number) {
        this.cache = new Set();
        this.limit = limit;
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    add(key: string): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }

        this.cache.add(key);

        if (this.cache.size > this.limit) {
            const oldestKey = this.cache.values().next().value;
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
    }
}

export const loadedImageCache = new ImageLRUCache(20);