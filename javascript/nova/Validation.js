export var Validation;
(function (Validation) {
    function isEmail(email) {
        return !!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
    Validation.isEmail = isEmail;
    function isPhoneNumber(phoneNumber) {
        return !!phoneNumber.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im);
    }
    Validation.isPhoneNumber = isPhoneNumber;
    function isDateEquals(date, expected) {
        return date.getTime() === expected.getTime();
    }
    Validation.isDateEquals = isDateEquals;
    function isDateAfter(date, minDate) {
        return date.getTime() > minDate.getTime();
    }
    Validation.isDateAfter = isDateAfter;
    function isDateBefore(date, maxDate) {
        return date.getTime() < maxDate.getTime();
    }
    Validation.isDateBefore = isDateBefore;
    function isDateBetween(date, minDate, maxDate) {
        return date.getTime() >= minDate.getTime() && date.getTime() <= maxDate.getTime();
    }
    Validation.isDateBetween = isDateBetween;
    function isPositiveInteger(value) {
        return !!value.match(/^\d+$/);
    }
    Validation.isPositiveInteger = isPositiveInteger;
    function isNegativeInteger(value) {
        return !!value.match(/^-\d+$/);
    }
    Validation.isNegativeInteger = isNegativeInteger;
    function isInteger(value) {
        return !!value.match(/^(-?\d+)$/);
    }
    Validation.isInteger = isInteger;
    function isPositiveNumeric(value) {
        return !!value.match(/^\d+(\.\d+)?$/);
    }
    Validation.isPositiveNumeric = isPositiveNumeric;
    function isNegativeNumeric(value) {
        return !!value.match(/^-\d+(\.\d+)?$/);
    }
    Validation.isNegativeNumeric = isNegativeNumeric;
    function isNumeric(value) {
        return !!value.match(/^(-?\d+(\.\d+)?)$/);
    }
    Validation.isNumeric = isNumeric;
    function isInRange(value, min, max) {
        return value >= min && value <= max;
    }
    Validation.isInRange = isInRange;
    function isString(value) {
        return typeof value === "string";
    }
    Validation.isString = isString;
    function isNumber(value) {
        return typeof value === "number";
    }
    Validation.isNumber = isNumber;
    function isFiniteNumber(value) {
        return typeof value === "number" && isFinite(value);
    }
    Validation.isFiniteNumber = isFiniteNumber;
    function isBoolean(value) {
        return typeof value === "boolean";
    }
    Validation.isBoolean = isBoolean;
    function isArray(value) {
        return Array.isArray(value);
    }
    Validation.isArray = isArray;
    function isNull(value) {
        return value === null;
    }
    Validation.isNull = isNull;
    function isUndefined(value) {
        return value === undefined;
    }
    Validation.isUndefined = isUndefined;
    function isNullOrUndefined(value) {
        return value === null || value === undefined;
    }
    Validation.isNullOrUndefined = isNullOrUndefined;
    function isNullOrUndefinedOrEmpty(value) {
        return value === null || value === undefined || value.length <= 0;
    }
    Validation.isNullOrUndefinedOrEmpty = isNullOrUndefinedOrEmpty;
    function isJson(value) {
        try {
            JSON.parse(value);
            return true;
        }
        catch (_) {
            return false;
        }
    }
    Validation.isJson = isJson;
    function isNan(value) {
        return isNaN(value);
    }
    Validation.isNan = isNan;
    function isInfinity(value) {
        return value === Infinity || value === -Infinity;
    }
    Validation.isInfinity = isInfinity;
    function isRegex(value, regex) {
        return regex.test(value);
    }
    Validation.isRegex = isRegex;
    function isEmpty(value) {
        return value.length === 0;
    }
    Validation.isEmpty = isEmpty;
})(Validation || (Validation = {}));
