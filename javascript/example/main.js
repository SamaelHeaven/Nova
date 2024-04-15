import { Application } from "../nova/lib.js";
import { ButtonComponent } from "./ButtonComponent.js";
import { TodoAppComponent } from "./TodoAppComponent.js";
Application.launch([
    ButtonComponent.definition,
    TodoAppComponent.definition
]);
