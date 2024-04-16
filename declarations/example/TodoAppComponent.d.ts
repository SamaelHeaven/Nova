import { Component, ComponentDefinition, Events } from "../nova/lib.js";
export declare class TodoAppComponent extends Component {
    static readonly definition: ComponentDefinition;
    private _todos;
    private _newTodo;
    onInit(): void;
    onInput(event: Events.Input): void;
    onSubmit(event: Events.BaseEvent): void;
    render(): string;
}
