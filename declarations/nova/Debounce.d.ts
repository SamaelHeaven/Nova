export declare class Debounce {
    private readonly _callback;
    private _timeoutId;
    constructor(callback: Function, wait: number);
    call(...args: any[]): void;
}
