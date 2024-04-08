export declare namespace Validation {
    function isEmail(email: string): boolean;
    function isPhoneNumber(phoneNumber: string): boolean;
    function isDateEquals(date: Date, expected: Date): boolean;
    function isDateAfter(date: Date, minDate: Date): boolean;
    function isDateBefore(date: Date, maxDate: Date): boolean;
    function isDateBetween(date: Date, minDate: Date, maxDate: Date): boolean;
    function isPositiveInteger(value: string): boolean;
    function isNegativeInteger(value: string): boolean;
    function isInteger(value: string): boolean;
    function isPositiveNumeric(value: string): boolean;
    function isNegativeNumeric(value: string): boolean;
    function isNumeric(value: string): boolean;
    function isInRange(value: number, min: number, max: number): boolean;
    function isString(value: any): boolean;
    function isNumber(value: any): boolean;
    function isBoolean(value: any): boolean;
    function isArray(value: any): boolean;
    function isJson(value: string): boolean;
    function isFiniteNumber(value: any): boolean;
    function isNan(value: number): boolean;
    function isInfinity(value: number): boolean;
    function isRegex(value: string, regex: RegExp): boolean;
    function isEmpty(value: {
        length: number;
    }): boolean;
    function isNull(value: any): boolean;
    function isUndefined(value: any): boolean;
    function isNullOrUndefined(value: any): boolean;
    function isNullOrUndefinedOrEmpty(value: null | undefined | {
        length: number;
    }): boolean;
}
