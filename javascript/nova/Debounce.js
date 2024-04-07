export class Debounce {
    constructor(callback, wait) {
        this._timeoutId = null;
        this._callback = (...args) => {
            window.clearTimeout(this._timeoutId);
            this._timeoutId = window.setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        };
    }
    call(...args) {
        this._callback.apply(this, args);
    }
}
