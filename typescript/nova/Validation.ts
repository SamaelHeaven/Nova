export namespace Validation {
    export function isEmail(email: string): boolean {
        return !!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    export function isPhoneNumber(phoneNumber: string): boolean {
        return !!phoneNumber.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im);
    }

    export function isDateEquals(date: Date, expected: Date): boolean {
        return date.getTime() === expected.getTime();
    }

    export function isDateAfter(date: Date, minDate: Date): boolean {
        return date.getTime() > minDate.getTime();
    }

    export function isDateBefore(date: Date, maxDate: Date): boolean {
        return date.getTime() < maxDate.getTime();
    }

    export function isDateBetween(date: Date, minDate: Date, maxDate: Date): boolean {
        return date.getTime() >= minDate.getTime() && date.getTime() <= maxDate.getTime();
    }

    export function isPositiveInteger(value: string): boolean {
        return !!value.match(/^\d+$/);
    }

    export function isNegativeInteger(value: string): boolean {
        return !!value.match(/^-\d+$/);
    }

    export function isInteger(value: string): boolean {
        return !!value.match(/^(-?\d+)$/);
    }

    export function isPositiveNumeric(value: string): boolean {
        return !!value.match(/^\d+(\.\d+)?$/);
    }

    export function isNegativeNumeric(value: string): boolean {
        return !!value.match(/^-\d+(\.\d+)?$/);
    }

    export function isNumeric(value: string): boolean {
        return !!value.match(/^(-?\d+(\.\d+)?)$/);
    }

    export function isInRange(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }

    export function isString(value: any): boolean {
        return typeof value === "string";
    }

    export function isNumber(value: any): boolean {
        return typeof value === "number";
    }

    export function isBoolean(value: any): boolean {
        return typeof value === "boolean";
    }

    export function isArray(value: any): boolean {
        return Array.isArray(value);
    }

    export function isJson(value: string): boolean {
        try {
            JSON.parse(value);
            return true;
        } catch (_) {
            return false;
        }
    }

    export function isFiniteNumber(value: any): boolean {
        return typeof value === "number" && isFinite(value);
    }

    export function isNan(value: number): boolean {
        return isNaN(value);
    }
    
    export function isInfinity(value: number): boolean {
        return value === Infinity || value === -Infinity;
    }

    export function isRegex(value: string, regex: RegExp): boolean {
        return regex.test(value);
    }

    export function isEmpty(value: { length: number }): boolean {
        return value.length === 0;
    }

    export function isNull(value: any): boolean {
        return value === null;
    }

    export function isUndefined(value: any): boolean {
        return value === undefined;
    }

    export function isNullOrUndefined(value: any): boolean {
        return value === null || value === undefined;
    }

    export function isNullOrUndefinedOrEmpty(value: null | undefined | { length: number }): boolean {
        return value === null || value === undefined || value.length <= 0;
    }
}