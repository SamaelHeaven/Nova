import {Application} from "../nova/Application.js";
import {ButtonComponent} from "./ButtonComponent.js";
import {DatePickerComponent} from "./DatePickerComponent.js";
import {EmailInputComponent} from "./EmailInputComponent.js";
import {NumberInputComponent} from "./NumberInputComponent.js";

Application.launch([
    ButtonComponent,
    DatePickerComponent,
    EmailInputComponent,
    NumberInputComponent
]);