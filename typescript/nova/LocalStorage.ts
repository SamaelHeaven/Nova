type Item<T> = {
    value: T;
    expiry: number | undefined;
};

export namespace LocalStorage {
    export function getItem<T>(key: string): T | null {
        const itemString: string = localStorage.getItem(key);
        if (!itemString) {
            return null;
        }

        const item: Item<T> = JSON.parse(itemString);
        if (item.expiry !== undefined && item.expiry < new Date().getTime()) {
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    }

    export function setItem<T>(key: string, value: T, ttl: number | undefined = undefined): void {
        const item: Item<T> = {
            value,
            expiry: ttl !== undefined ? new Date().getTime() + ttl : undefined
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
}