import {Component, ComponentDefinition, Html, LocalStorage, State} from "../nova/lib.js";

export class TodoAppComponent extends Component {
    public static readonly definition: ComponentDefinition = {tag: "todo-app-component", ctor: this}
    @State private todos: string[] = [];
    @State private todo: string = "";

    public override onInit(): void {
        this.todos = LocalStorage.getItem("todos") || this.todos;
    }

    public override render(): Html {
        return "div".html()
            .append(
                "ul".html()
                    .attribute("style", "word-break: break-all;")
                    .appendForEach(this.todos, todo => "li".html().append(todo)),

                "form".html()
                    .class("d-flex gap-3")
                    .append(
                        "input".html()
                            .class("form-control")
                            .attributes(["type", "text"], ["name", "Todo"], ["placeholder", "Todo..."], ["value", this.todo])
                            .on("input", event => this.todo = (event.target as HTMLInputElement).value),

                        "button".html()
                            .class("btn btn-primary")
                            .attributeIf(this.todo.trim() === "", "disabled", "")
                            .attribute("type", "submit")
                            .append("Add")
                    )
                    .on("submit", event => {
                        event.preventDefault();
                        this.todos = this.todos.concat(this.todo.trim());
                        this.todo = "";
                        LocalStorage.setItem("todos", this.todos)
                    })
            );
    }
}