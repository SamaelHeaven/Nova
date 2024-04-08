export declare namespace Format {
    function date(arg: Date | undefined | null | number | string | "today" | "tomorrow" | "yesterday", format: string): string;
    function titleCase(arg: any): string;
    function upperCase(arg: any): string;
    function lowerCase(arg: any): string;
    function percentage(arg: any, digits: number): string;
    function decimal(arg: any, digits: number): string;
    function currency(amount: number, currency?: string): string;
}
