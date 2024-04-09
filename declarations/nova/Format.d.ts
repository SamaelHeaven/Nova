export declare namespace Format {
    function date(value: Date | number | string | undefined, format: string): string;
    function titleCase(value: string): string;
    function upperCase(value: string): string;
    function lowerCase(value: string): string;
    function json(value: object): string;
    function percentage(value: number, digits?: number): string;
    function decimal(value: number, digits?: number): string;
    function currency(value: number, currency?: string): string;
}
