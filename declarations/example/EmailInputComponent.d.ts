import { Component, ComponentDefinition, Events } from "../nova/lib.js";
export declare class EmailInputComponent extends Component {
    static readonly definition: ComponentDefinition;
    email: string;
    onSubmit(event: Events.Base): void;
    render(): string;
    private get _valid();
}
