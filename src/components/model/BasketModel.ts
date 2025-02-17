import { IProductItem } from "../../types";
import { IBasketModel } from "../../types";

export class BasketModel implements IBasketModel {
  protected _basketProducts: IProductItem[]; // список карточек товара в корзине

  constructor() {
    this._basketProducts = [];
  }

  set basketProducts(data: IProductItem[]) {
    this._basketProducts = data;
  }

  get basketProducts() {
    return this._basketProducts;
  }

  // количество товара в корзине
  getCounter() {
    return this.basketProducts.length;
  }

  // сумма всех товаров в корзине
  getSumAllProducts() {
    let sumAll = 0;
    this.basketProducts.forEach(item => {
      sumAll = sumAll + item.price;
    });
    return sumAll;
  }

  // добавить карточку товара в корзину
  setSelectedСard(data: IProductItem) {
    this._basketProducts.push(data);
  }

  // удалить карточку товара из корзины
  deleteCardToBasket(item: IProductItem) {
    this._basketProducts = this._basketProducts.filter((card) => card.id !== item.id);
  }
  checkProductInBasket(item: IProductItem) {
    const isProductIncart = this._basketProducts.find((card) => card.id === item.id);
    return isProductIncart;
  }

  clearBasketProducts() {
    this.basketProducts = []
  }
}