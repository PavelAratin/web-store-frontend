/***** типы карточки товара *****/
export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
/***** тип клика по карточке *****/
export interface IActions {
  onClick: (event: MouseEvent) => void;
}
// /***** типы для массива каточек товара полученных с сервера *****/
// export interface IDataModel {
//   productCards: IProductItem[];
//   selectedСard: IProductItem;
//   setPreview(item: IProductItem): void;
// }
/***** типы для метода вывода карточек на страницу *****/
export interface ICard {
  //типы для карточки на страницы и для превью в модальномс окне
  text?: HTMLElement;
  button?: HTMLElement;
  render(data: IProductItem): HTMLElement;
}
/***** типы для модального окна *****/
export interface IModal {
  open(): void;
  close(): void;
  render(): HTMLElement
}

export interface IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;
  renderHeaderBasketCounter(value: number): void;
  renderSumAllProducts(sumAll: number): void;
  render(): HTMLElement;
}

export interface IBasketItem {
  basketItem: HTMLElement;
  index: HTMLElement;
  title: HTMLElement;
  price: HTMLElement;
  buttonDelete: HTMLButtonElement;
  render(data: IProductItem, item: number): HTMLElement;
}

export interface IBasketModel {
  basketProducts: IProductItem[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  setSelectedСard(data: IProductItem): void;
  deleteCardToBasket(item: IProductItem): void;
  clearBasketProducts(): void
}

export interface IOrder {
  formOrder: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  paymentSelect: string;
  formErrors: HTMLElement;
  render(): HTMLElement;
}