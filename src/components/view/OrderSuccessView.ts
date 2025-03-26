import { IEvents } from "../base/events";
import { ISuccessForm } from "../../types";

export class OrderSuccessView implements ISuccessForm {
  successForm: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.successForm = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
    this.description = this.successForm.querySelector('.order-success__description');
    this.button = this.successForm.querySelector('.order-success__close');

    this.button.addEventListener('click', () => { events.emit('order:successClose') });
  }

  render(total: number) {
    this.description.textContent = String(`Списано ${total} синапсов`);
    return this.successForm;
  }
}