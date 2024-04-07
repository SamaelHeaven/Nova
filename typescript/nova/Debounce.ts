export class Debounce {
    /** @internal */
    private readonly _callback: (...args: any[]) => void;
    /** @internal */
    private _timeoutId: number | null;

    constructor(callback: Function, wait: number) {
        this._timeoutId = null;
        this._callback = (...args: any[]): void => {
            window.clearTimeout(this._timeoutId);
            this._timeoutId = window.setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        };
    }

    public call(...args: any[]): void {
        this._callback.apply(this, args);
    }
}