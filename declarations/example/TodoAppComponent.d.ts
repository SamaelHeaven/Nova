import { Component, ComponentDefinition, Events } from "../nova/lib.js";
export declare class TodoAppComponent extends Component {
    static readonly definition: ComponentDefinition;
    private _todos;
    private _newTodo;
    onInit(): void;
    onInput(event: Events.Input<HTMLInputElement>): void;
    onSubmit(event: Events.Base): void;
    render(): string;
}
