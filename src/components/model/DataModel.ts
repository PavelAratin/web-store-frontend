import { IProductItem } from "../../types";
import { IEvents } from "../base/events";

//вынес в файл типов
export interface IDataModel {
  productCards: IProductItem[];
  selectedСard: IProductItem;
  setPreview(item: IProductItem): void;
}

export class DataModel implements IDataModel {
  // удалил protected _productCards:
  _productCards: IProductItem[];
  selectedСard: IProductItem;

  constructor(protected events: IEvents) {
    this._productCards = []
  }

  set productCards(data: IProductItem[]) {
    this._productCards = data;
    this.events.emit('productCards:receive');
  }

  get productCards() {
    return this._productCards;
  }
  // для превью
  setPreview(item: IProductItem) {
    this.selectedСard = item;
    this.events.emit('modalCard:open', item)
  }
}