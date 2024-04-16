var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
import { Component, LocalStorage, State } from "../nova/lib.js";
export class TodoAppComponent extends Component {
    constructor() {
        super(...arguments);
        this.todos = [];
        this.todo = "";
    }
    onInit() {
        this.todos = LocalStorage.getItem("todos") || this.todos;
    }
    render() {
        return "div".html()
            .append("ul".html()
            .attribute("style", "word-break: break-all;")
            .appendForEach(this.todos, todo => "li".html().append(todo)), "form".html()
            .class("d-flex gap-3")
            .append("input".html()
            .class("form-control")
            .attributes(["type", "text"], ["name", "Todo"], ["placeholder", "Todo..."], ["value", this.todo])
            .on("input", event => this.todo = event.target.value), "button".html()
            .class("btn btn-primary")
            .attributeIf(this.todo.trim() === "", "disabled", "")
            .attribute("type", "submit")
            .append("Add"))
            .on("submit", event => {
            event.preventDefault();
            this.todos = this.todos.concat(this.todo.trim());
            this.todo = "";
            LocalStorage.setItem("todos", this.todos);
        }));
    }
}
_a = TodoAppComponent;
TodoAppComponent.definition = { tag: "todo-app-component", ctor: _a };
__decorate([
    State,
    __metadata("design:type", Array)
], TodoAppComponent.prototype, "todos", void 0);
__decorate([
    State,
    __metadata("design:type", String)
], TodoAppComponent.prototype, "todo", void 0);
