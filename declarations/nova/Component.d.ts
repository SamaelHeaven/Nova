import { Html } from "./Html.js";
export declare abstract class Component {
    readonly element: HTMLElement;
    constructor(element: HTMLElement);
    render(): Html;
    onInit(): void | Promise<void>;
    onAppear(): void;
    onUpdate(): void;
    onDestroy(): void;
    onMorph(toElement: HTMLElement): void;
    onAttributeChanged(attribute: string, oldValue: string, newValue: string): void;
    update(state: object): void;
    queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
    getKeys(): string[];
}
