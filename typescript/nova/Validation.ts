export namespace Validation {
    export function equals(value: any, expected: any): boolean {
        return value === expected;
    }

    export function notEquals(value: any, expected: any): boolean {
        return value !== expected;
    }

    export function email(email: string): boolean {
        return !!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    export function phoneNumber(phoneNumber: string): boolean {
        return !!phoneNumber.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im);
    }

    export function date(date: Date, expected: Date): boolean {
        return date.getTime() === expected.getTime();
    }

    export function dateMin(date: Date, minDate: Date): boolean {
        return date.getTime() >= minDate.getTime();
    }

    export function dateMax(date: Date, maxDate: Date): boolean {
        return date.getTime() <= maxDate.getTime();
    }

    export function dateRange(date: Date, minDate: Date, maxDate: Date): boolean {
        return date.getTime() >= minDate.getTime() && date.getTime() <= maxDate.getTime();
    }

    export function positiveInteger(value: string): boolean {
        return !!value.match(/^\d+$/);
    }

    export function negativeInteger(value: string): boolean {
        return !!value.match(/^-\d+$/);
    }

    export function integer(value: string): boolean {
        return !!value.match(/^(-?\d+)$/);
    }

    export function positiveNumeric(value: string): boolean {
        return !!value.match(/^\d+(\.\d+)?$/);
    }

    export function negativeNumeric(value: string): boolean {
        return !!value.match(/^-\d+(\.\d+)?$/);
    }

    export function numeric(value: string): boolean {
        return !!value.match(/^(-?\d+(\.\d+)?)$/);
    }

    export function numberMin(value: number, min: number): boolean {
        return value >= min;
    }

    export function numberMax(value: number, max: number): boolean {
        return value <= max;
    }

    export function numberRange(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }

    export function isString(value: any): boolean {
        return typeof value === "string";
    }

    export function isNumber(value: any): boolean {
        return typeof value === "number";
    }

    export function notNaN(value: number): boolean {
        return !isNaN(value);
    }

    export function isNan(value: number): boolean {
        return isNaN(value);
    }

    export function notInfinity(value: number): boolean {
        return value !== Infinity && value !== -Infinity;
    }

    export function isInfinity(value: number): boolean {
        return value === Infinity || value === -Infinity;
    }

    export function regex(value: string, regex: RegExp): boolean {
        return regex.test(value);
    }

    export function length(value: { length: number }, expectedLength: number): boolean {
        return value.length === expectedLength;
    }

    export function lengthMin(value: { length: number }, minLength: number): boolean {
        return value.length >= minLength;
    }

    export function lengthMax(value: { length: number }, maxLength: number): boolean {
        return value.length <= maxLength;
    }

    export function lengthRange(value: { length: number }, minLength: number, maxLength: number): boolean {
        return value.length >= minLength && value.length <= maxLength;
    }

    export function isEmpty(value: { length: number }): boolean {
        return value.length === 0;
    }

    export function notEmpty(value: { length: number }): boolean {
        return value.length > 0;
    }

    export function isNull(value: any): boolean {
        return value === null;
    }

    export function notNull(value: any): boolean {
        return value !== null;
    }

    export function isUndefined(value: any): boolean {
        return value === undefined;
    }

    export function notUndefined(value: any): boolean {
        return value !== undefined;
    }

    export function notNullOrUndefined(value: any): boolean {
        return value !== null && value !== undefined;
    }

    export function isNullOrUndefined(value: any): boolean {
        return value === null || value === undefined;
    }

    export function notNullOrUndefinedOrEmpty(value: null | undefined | { length: number }): boolean {
        return value !== null && value !== undefined && value.length > 0;
    }

    export function isNullOrUndefinedOrEmpty(value: null | undefined | { length: number }): boolean {
        return value === null || value === undefined || value.length <= 0;
    }
}