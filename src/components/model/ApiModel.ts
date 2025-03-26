import { ApiListResponse, Api } from '../base/api'
import { IProductItem, IOrderPost, IOrderResult } from '../../types';

//возможно потом понадобиться - можно будет вынести в файл types.ts
// export interface IApiModel {
//   cdn: string;
//   items: IProductItem[];
//   getListProductCard: () => Promise<IProductItem[]>;
//   // postOrderLot: (order: IOrderLot) => Promise<IOrderResult>;
// }

export class ApiModel extends Api {
  cdn: string;
  items: IProductItem[];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }


  // получаем массив объектов(карточек) с сервера
  getListProductCard(): Promise<IProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  //получаем ответ от сервера по сделанному заказу
  postOrder(order: IOrderPost): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}