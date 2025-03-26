import { IEvents } from "../base/events";
import { IOrder } from "../../types";

export class OrderFormView implements IOrder {
  formOrder: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formOrder = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.buttonAll = Array.from(this.formOrder.querySelectorAll('.button_alt'));
    this.buttonSubmit = this.formOrder.querySelector('.order__button');
    this.formErrors = this.formOrder.querySelector('.form__errors');


    //получение способа оплаты 
    this.buttonAll.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentSelect = button.name;
        events.emit('order:paymentSelection', button);
      });
    });

    this.formOrder.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const nameInput = target.name;
      const valueInput = target.value;
      this.events.emit('order:changeAddressInput', { nameInput, valueInput });
    });
    this.formOrder.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('formContact:open');
    });
  }

  //устанавливаем обводку вокруг выбранного метода оплаты
  set paymentSelect(paymentMethod: string) {
    this.buttonAll.forEach(item => {
      item.classList.toggle('button_alt-active', item.name === paymentMethod);
    })
  }
  toggleErrors(email?: string, phone?: string): void {
    this.formErrors.innerHTML = `
      <div>
        <div>${email || ''}</div>
        <div>${phone || ''}</div>
      </div>
    `;
  }

  render() {
    return this.formOrder
  }
}