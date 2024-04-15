import { Component, ComponentDefinition, Html } from "../nova/lib.js";
export declare class TodoAppComponent extends Component {
    static readonly definition: ComponentDefinition;
    private todos;
    private todo;
    onInit(): void;
    render(): Html;
}
