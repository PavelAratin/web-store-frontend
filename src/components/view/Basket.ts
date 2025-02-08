// import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IBasket } from "../../types";

export class Basket implements IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.button = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');
    this.headerBasketButton = document.querySelector('.header__basket');
    this.headerBasketCounter = document.querySelector('.header__basket-counter');
    this.button.addEventListener('click', () => { this.events.emit('order:open') });
    this.headerBasketButton.addEventListener('click', () => { this.events.emit('basket:open') });
  }

  render() {
    this.title.textContent = 'Корзина';
    return this.basket;
  }
}