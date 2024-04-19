import {Component, ComponentDefinition, escapeHTML, Events, LocalStorage} from "../nova/lib.js";

export class TodoAppComponent extends Component {
    public static readonly definition: ComponentDefinition = this.define("todo-app-component");
    private _todos: string[] = [];
    private _newTodo: string = "";

    public override onInit(): void {
        this._todos = LocalStorage.getItem("todos") || this._todos;
    }

    public override onInput(event: Events.Input<HTMLInputElement>): void {
        this._newTodo = event.target.value;
        this.update();
    }

    public override onSubmit(event: Events.Base): void {
        event.preventDefault();
        this._todos.push(this._newTodo);
        this._newTodo = "";
        LocalStorage.setItem("todos", this._todos);
        this.update();
    }

    public override render(): string {
        return `
            <ul style="word-break: break-all">
                ${this._todos.map((todo: string): string => `<li>${escapeHTML(todo)}</li>`).join("")}
            </ul>
            <form class="d-flex gap-3">
                <input class="form-control" type="text" name="Todo" placeholder="Todo..." value="${escapeHTML(this._newTodo)}">
                <button class="btn btn-primary" type="submit" ${this._newTodo.trim() === "" ? "disabled" : ""}>
                    Add
                </button>
            </form>
        `;
    }
}