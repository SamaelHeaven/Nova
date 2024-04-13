export declare namespace Format {
    function date(value: Date | number | string | undefined, format: string): string;
    function capitalize(value: string, lower?: boolean, trim?: boolean, words?: boolean): string;
    function upperCase(value: string, trim?: boolean): string;
    function lowerCase(value: string, trim?: boolean): string;
    function json(value: any): string;
    function percentage(value: number, digits?: number): string;
    function decimal(value: number, digits?: number): string;
    function currency(value: number, currency?: string): string;
}
