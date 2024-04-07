export var Validation;
(function (Validation) {
    function equals(value, expected) {
        return value === expected;
    }
    Validation.equals = equals;
    function notEquals(value, expected) {
        return value !== expected;
    }
    Validation.notEquals = notEquals;
    function email(email) {
        return !!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
    Validation.email = email;
    function phoneNumber(phoneNumber) {
        return !!phoneNumber.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im);
    }
    Validation.phoneNumber = phoneNumber;
    function date(date, expected) {
        return date.getTime() === expected.getTime();
    }
    Validation.date = date;
    function dateMin(date, minDate) {
        return date.getTime() >= minDate.getTime();
    }
    Validation.dateMin = dateMin;
    function dateMax(date, maxDate) {
        return date.getTime() <= maxDate.getTime();
    }
    Validation.dateMax = dateMax;
    function dateRange(date, minDate, maxDate) {
        return date.getTime() >= minDate.getTime() && date.getTime() <= maxDate.getTime();
    }
    Validation.dateRange = dateRange;
    function positiveInteger(value) {
        return !!value.match(/^\d+$/);
    }
    Validation.positiveInteger = positiveInteger;
    function negativeInteger(value) {
        return !!value.match(/^-\d+$/);
    }
    Validation.negativeInteger = negativeInteger;
    function integer(value) {
        return !!value.match(/^(-?\d+)$/);
    }
    Validation.integer = integer;
    function positiveNumeric(value) {
        return !!value.match(/^\d+(\.\d+)?$/);
    }
    Validation.positiveNumeric = positiveNumeric;
    function negativeNumeric(value) {
        return !!value.match(/^-\d+(\.\d+)?$/);
    }
    Validation.negativeNumeric = negativeNumeric;
    function numeric(value) {
        return !!value.match(/^(-?\d+(\.\d+)?)$/);
    }
    Validation.numeric = numeric;
    function numberMin(value, min) {
        return value >= min;
    }
    Validation.numberMin = numberMin;
    function numberMax(value, max) {
        return value <= max;
    }
    Validation.numberMax = numberMax;
    function numberRange(value, min, max) {
        return value >= min && value <= max;
    }
    Validation.numberRange = numberRange;
    function isString(value) {
        return typeof value === "string";
    }
    Validation.isString = isString;
    function isNumber(value) {
        return typeof value === "number";
    }
    Validation.isNumber = isNumber;
    function notNaN(value) {
        return !isNaN(value);
    }
    Validation.notNaN = notNaN;
    function isNan(value) {
        return isNaN(value);
    }
    Validation.isNan = isNan;
    function notInfinity(value) {
        return value !== Infinity && value !== -Infinity;
    }
    Validation.notInfinity = notInfinity;
    function isInfinity(value) {
        return value === Infinity || value === -Infinity;
    }
    Validation.isInfinity = isInfinity;
    function regex(value, regex) {
        return regex.test(value);
    }
    Validation.regex = regex;
    function length(value, expectedLength) {
        return value.length === expectedLength;
    }
    Validation.length = length;
    function lengthMin(value, minLength) {
        return value.length >= minLength;
    }
    Validation.lengthMin = lengthMin;
    function lengthMax(value, maxLength) {
        return value.length <= maxLength;
    }
    Validation.lengthMax = lengthMax;
    function lengthRange(value, minLength, maxLength) {
        return value.length >= minLength && value.length <= maxLength;
    }
    Validation.lengthRange = lengthRange;
    function isEmpty(value) {
        return value.length === 0;
    }
    Validation.isEmpty = isEmpty;
    function notEmpty(value) {
        return value.length > 0;
    }
    Validation.notEmpty = notEmpty;
    function isNull(value) {
        return value === null;
    }
    Validation.isNull = isNull;
    function notNull(value) {
        return value !== null;
    }
    Validation.notNull = notNull;
    function isUndefined(value) {
        return value === undefined;
    }
    Validation.isUndefined = isUndefined;
    function notUndefined(value) {
        return value !== undefined;
    }
    Validation.notUndefined = notUndefined;
    function notNullOrUndefined(value) {
        return value !== null && value !== undefined;
    }
    Validation.notNullOrUndefined = notNullOrUndefined;
    function isNullOrUndefined(value) {
        return value === null || value === undefined;
    }
    Validation.isNullOrUndefined = isNullOrUndefined;
    function notNullOrUndefinedOrEmpty(value) {
        return value !== null && value !== undefined && value.length > 0;
    }
    Validation.notNullOrUndefinedOrEmpty = notNullOrUndefinedOrEmpty;
    function isNullOrUndefinedOrEmpty(value) {
        return value === null || value === undefined || value.length <= 0;
    }
    Validation.isNullOrUndefinedOrEmpty = isNullOrUndefinedOrEmpty;
})(Validation || (Validation = {}));
