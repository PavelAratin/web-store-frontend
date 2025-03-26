import { IActions, IProductItem, ICard } from "../../types";
import { IEvents } from "../base/events";

export class CardView implements ICard {
  protected _cardElement: HTMLElement;
  protected _cardCategory: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this._cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
    this._cardCategory = this._cardElement.querySelector('.card__category');
    this._cardTitle = this._cardElement.querySelector('.card__title');
    this._cardImage = this._cardElement.querySelector('.card__image');
    this._cardPrice = this._cardElement.querySelector('.card__price');
    if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }


  protected setPrice(value: number | null): string {
    if (value === null) {
      return 'Дорого!'
    }
    return String(value) + ' синапсов'
  }

  render(data: IProductItem): HTMLElement {
    this._cardCategory.textContent = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(data.price);
    return this._cardElement;
  }
}