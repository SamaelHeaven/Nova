import {Validation} from "./Validation.js";

export namespace Format {
    export function date(arg: Date | undefined | null | number | string | "today" | "tomorrow" | "yesterday", format: string): string {
        let date: Date;
        if (arg instanceof Date) {
            date = arg;
        } else if (arg === "today" || Validation.isNumber(arg) || Validation.isNullOrUndefinedOrEmpty(arg as string)) {
            date = new Date();
        } else if (arg === "tomorrow") {
            date = new Date();
            date.setDate(date.getDate() + 1);
        } else if (arg === "yesterday") {
            date = new Date();
            date.setDate(date.getDate() - 1);
        } else {
            date = new Date(arg);
        }

        const monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        return format.replace(/(d{1,4}|m{1,4}|y{2,4}|h{1,2}|H{1,2}|M{1,2}|s{1,2}|l|L|t{1,2}|T{1,2}'[^']*'|"[^"]*")/g, function (match: string): string {
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

    export function titleCase(arg: any): string {
        const str: string = String(arg).trim();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    export function upperCase(arg: any): string {
        const str: string = String(arg).trim();
        return str.toUpperCase();
    }

    export function lowerCase(arg: any): string {
        const str: string = String(arg).trim();
        return str.toLowerCase();
    }

    export function percentage(arg: any, digits: number): string {
        const value: number = Number(arg);
        return (value).toFixed(digits) + "%";
    }

    export function decimal(arg: any, digits: number): string {
        const value: number = Number(arg);
        return value.toFixed(digits);
    }

    export function currency(amount: number, code: string = "USD"): string {
        return amount.toLocaleString(undefined, {
            style: 'currency',
            currency: code
        });
    }
}