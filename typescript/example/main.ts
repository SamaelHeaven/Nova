import {Application} from "../nova/Application.js";
import {ButtonComponent} from "./ButtonComponent.js";
import {DatePickerComponent} from "./DatePickerComponent.js";
import {EmailInputComponent} from "./EmailInputComponent.js";
import {NumberInputComponent} from "./NumberInputComponent.js";

Application.launch([
    {name: "button-component", class: ButtonComponent},
    {name: "date-picker-component", class: DatePickerComponent},
    {name: "email-input-component", class: EmailInputComponent},
    {name: "number-input-component", class: NumberInputComponent}
]);