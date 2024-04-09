export var Format;
(function (Format) {
    function date(value, format) {
        let date;
        if (value instanceof Date) {
            date = value;
        }
        else if (!value) {
            date = new Date();
        }
        else {
            date = new Date(value);
        }
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return format.replace(/(d{1,4}|m{1,4}|y{2,4}|h{1,2}|H{1,2}|M{1,2}|s{1,2}|l|L|t{1,2}|T{1,2}'[^']*'|"[^"]*")/g, function (match) {
            switch (match) {
                case "d":
                    return date.getDate().toString();
                case "dd":
                    return date.getDate().toString().padStart(2, "0");
                case "ddd":
                    return dayNames[date.getDay()].slice(0, 3);
                case "dddd":
                    return dayNames[date.getDay()];
                case "m":
                    return (date.getMonth() + 1).toString();
                case "mm":
                    return String(date.getMonth() + 1).padStart(2, "0");
                case "mmm":
                    return monthNames[date.getMonth()].slice(0, 3);
                case "mmmm":
                    return monthNames[date.getMonth()];
                case "yy":
                    return String(date.getFullYear()).slice(-2);
                case "yyyy":
                    return date.getFullYear().toString();
                case "h":
                    return (date.getHours() % 12 || 12).toString();
                case "hh":
                    return String(date.getHours() % 12 || 12).padStart(2, "0");
                case "H":
                    return date.getHours().toString();
                case "HH":
                    return String(date.getHours()).padStart(2, "0");
                case "M":
                    return date.getMinutes().toString();
                case "MM":
                    return String(date.getMinutes()).padStart(2, "0");
                case "s":
                    return date.getSeconds().toString();
                case "ss":
                    return String(date.getSeconds()).padStart(2, "0");
                case "l":
                    return String(date.getMilliseconds()).padStart(3, "0");
                case "L":
                    return String(date.getMilliseconds()).padStart(3, "0").substring(0, 2);
                case "t":
                    return date.getHours() < 12 ? "a" : "p";
                case "tt":
                    return date.getHours() < 12 ? "am" : "pm";
                case "T":
                    return date.getHours() < 12 ? "A" : "P";
                case "TT":
                    return date.getHours() < 12 ? "AM" : "PM";
                default:
                    return match.slice(1, -1);
            }
        });
    }
    Format.date = date;
    function capitalize(value, lower = true, trim = true, type = "string") {
        const str = trim ? value.trim() : value;
        if (type === "string") {
            return str.replace(/(?:^|\s|["'([{])+\S/, match => (lower ? match.toLowerCase() : match.toUpperCase()));
        }
        return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
    }
    Format.capitalize = capitalize;
    function upperCase(value, trim = true) {
        const str = trim ? value.trim() : value;
        return str.toUpperCase();
    }
    Format.upperCase = upperCase;
    function lowerCase(value, trim = true) {
        const str = trim ? value.trim() : value;
        return str.toLowerCase();
    }
    Format.lowerCase = lowerCase;
    function json(value) {
        return JSON.stringify(value);
    }
    Format.json = json;
    function percentage(value, digits = 2) {
        return value.toFixed(digits) + "%";
    }
    Format.percentage = percentage;
    function decimal(value, digits = 2) {
        return value.toFixed(digits);
    }
    Format.decimal = decimal;
    function currency(value, currency = "USD") {
        return value.toLocaleString(undefined, {
            style: 'currency',
            currency: currency
        });
    }
    Format.currency = currency;
})(Format || (Format = {}));
