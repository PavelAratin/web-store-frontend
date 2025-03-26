import { IEvents } from "../base/events";

export interface IContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
  toggleErrors(email?: string, phone?: string): void;
}

export class ContactsFormView implements IContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formContacts = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.inputAll = Array.from(this.formContacts.querySelectorAll('.form__input'));
    this.buttonSubmit = this.formContacts.querySelector('.button');
    this.formErrors = this.formContacts.querySelector('.form__errors');

    this.inputAll.forEach(item => {
      item.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const inputName = target.name;
        const inputvalue = target.value;
        this.events.emit('formContact:changeInput', { inputName, inputvalue });
      })
    })

    this.formContacts.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('order:successOpen');
    });
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
    return this.formContacts
  }
}