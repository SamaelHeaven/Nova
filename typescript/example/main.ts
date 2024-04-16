import {Application} from "../nova/lib.js";
import {ButtonComponent} from "./ButtonComponent.js";
import {DatePickerComponent} from "./DatePickerComponent.js";
import {EmailInputComponent} from "./EmailInputComponent.js";
import {NumberInputComponent} from "./NumberInputComponent.js";
import {TodoAppComponent} from "./TodoAppComponent.js";

Application.launch([
    ButtonComponent.definition,
    DatePickerComponent.definition,
    EmailInputComponent.definition,
    NumberInputComponent.definition,
    TodoAppComponent.definition
]);