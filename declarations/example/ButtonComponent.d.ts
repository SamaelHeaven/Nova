import { Component, Events } from "../nova/lib.js";
export declare class ButtonComponent extends Component {
    private _content;
    private _count;
    onInit(): void;
    onClick(_: Events.Mouse): void;
    render(): string;
}
