import { IEvents } from '../base/events';
import { IFormErrors } from '../../types/index';

export interface IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  getAddress(nameInput: string, valueInput: string): void;
  validateAddressAndPayment(): boolean;
  getEmailAndPhone(nameInput: string, valueInput: string): void;
  validateEmailAndPhone(): boolean;
  getOrderProd(): {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
  };
}

export class FormModel implements IFormModel {
  payment = '';
  email = '';
  phone = '';
  address = '';
  total = 0;
  items: string[] = [];
  formErrors: IFormErrors = {};
  constructor(protected events: IEvents) { }

  getAddress(nameInput: string, valueInput: string): void {
    if (nameInput === 'address') {
      this.address = valueInput;
    }
  }

  validateAddressAndPayment(): boolean {
    const errors: IFormErrors = {};

    if (!this.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:addressAndPayment', this.formErrors);

    return Object.keys(this.formErrors).length === 0;
  }

  getEmailAndPhone(nameInput: string, valueInput: string): void {
    if (nameInput === 'email') {
      this.email = valueInput;
    } else if (nameInput === 'phone') {
      this.phone = valueInput;
    }
  }

  validateEmailAndPhone(): boolean {
    const errors: IFormErrors = {};

    if (!this.email) {
      errors.email = 'Укажите email';
    }
    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:emailAndPhone', this.formErrors);

    return Object.keys(this.formErrors).length === 0;
  }

  getOrderProd() {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    };
  }
}