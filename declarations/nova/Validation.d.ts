export declare namespace Validation {
    function equals(value: any, expected: any): boolean;
    function notEquals(value: any, expected: any): boolean;
    function email(email: string): boolean;
    function phoneNumber(phoneNumber: string): boolean;
    function date(date: Date, expected: Date): boolean;
    function dateMin(date: Date, minDate: Date): boolean;
    function dateMax(date: Date, maxDate: Date): boolean;
    function dateRange(date: Date, minDate: Date, maxDate: Date): boolean;
    function positiveInteger(value: string): boolean;
    function negativeInteger(value: string): boolean;
    function integer(value: string): boolean;
    function positiveNumeric(value: string): boolean;
    function negativeNumeric(value: string): boolean;
    function numeric(value: string): boolean;
    function numberMin(value: number, min: number): boolean;
    function numberMax(value: number, max: number): boolean;
    function numberRange(value: number, min: number, max: number): boolean;
    function isString(value: any): boolean;
    function isNumber(value: any): boolean;
    function notNaN(value: number): boolean;
    function isNan(value: number): boolean;
    function notInfinity(value: number): boolean;
    function isInfinity(value: number): boolean;
    function regex(value: string, regex: RegExp): boolean;
    function length(value: {
        length: number;
    }, expectedLength: number): boolean;
    function lengthMin(value: {
        length: number;
    }, minLength: number): boolean;
    function lengthMax(value: {
        length: number;
    }, maxLength: number): boolean;
    function lengthRange(value: {
        length: number;
    }, minLength: number, maxLength: number): boolean;
    function isEmpty(value: {
        length: number;
    }): boolean;
    function notEmpty(value: {
        length: number;
    }): boolean;
    function isNull(value: any): boolean;
    function notNull(value: any): boolean;
    function isUndefined(value: any): boolean;
    function notUndefined(value: any): boolean;
    function notNullOrUndefined(value: any): boolean;
    function isNullOrUndefined(value: any): boolean;
    function notNullOrUndefinedOrEmpty(value: null | undefined | {
        length: number;
    }): boolean;
    function isNullOrUndefinedOrEmpty(value: null | undefined | {
        length: number;
    }): boolean;
}
