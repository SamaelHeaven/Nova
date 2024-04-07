export declare class LocalStorage {
    static getItem<T>(key: string): T | null;
    static setItem<T>(key: string, value: T, ttl?: number | undefined): void;
}
