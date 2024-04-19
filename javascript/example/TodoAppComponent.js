var _a;
import { Component, escapeHTML, LocalStorage } from "../nova/lib.js";
export class TodoAppComponent extends Component {
    constructor() {
        super(...arguments);
        this._todos = [];
        this._newTodo = "";
    }
    onInit() {
        this._todos = LocalStorage.getItem("todos") || this._todos;
    }
    onInput(event) {
        this._newTodo = event.target.value;
        this.update();
    }
    onSubmit(event) {
        event.preventDefault();
        this._todos.push(this._newTodo);
        this._newTodo = "";
        LocalStorage.setItem("todos", this._todos);
        this.update();
    }
    render() {
        return `
            <ul style="word-break: break-all">
                ${this._todos.map((todo) => `<li>${escapeHTML(todo)}</li>`).join("")}
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
_a = TodoAppComponent;
TodoAppComponent.definition = _a.define("todo-app-component");
