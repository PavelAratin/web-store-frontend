import { Card } from "./Card";
import { IActions, IProductItem, ICard } from "../../types";
import { IEvents } from "../base/events";
import { BasketModel } from "../model/BasketModel";
import { Modal } from "./Modal";
export class CardPreview extends Card implements ICard {
  text: HTMLElement;
  button: HTMLElement;
  private currentData: IProductItem; // Сохраняем текущие данные

  constructor(template: HTMLTemplateElement, protected events: IEvents, protected basketModel: BasketModel, protected modal: Modal, actions?: IActions) {
    super(template, events, actions);// Добавляем BasketModel
    this.text = this._cardElement.querySelector('.card__text');
    this.button = this._cardElement.querySelector('.card__button');
    this.button.addEventListener('click', () => {
      if (this.basketModel.checkProductInBasket(this.currentData)) {
        this.events.emit('basket:basketItemRemove', this.currentData); // Удалить из корзины
        this.modal.close()
      } else {
        this.events.emit('card:addBasket', this.currentData); // Добавить в корзину
      }
    });
  }

  // Обновляем состояние кнопки
  updateButtonState(data: IProductItem): void {
    if (this.basketModel.checkProductInBasket(data)) {
      this.button.textContent = 'Удалить из корзины';
      this.button.removeAttribute('disabled');
    } else if (data.price) {
      this.button.textContent = 'Купить';
      this.button.removeAttribute('disabled');
    } else {
      this.button.textContent = 'Не продается';
      this.button.setAttribute('disabled', 'true');
    }
  }

  render(data: IProductItem): HTMLElement {
    this._cardCategory.textContent = data.category;
    // this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    // this._cardPrice.textContent = this.setPrice(data.price);
    this.text.textContent = data.description;
    this.updateButtonState(data); // Обновляем текст кнопки
    this.currentData = data; // Сохраняем текущие данные
    return this._cardElement;
  }
}