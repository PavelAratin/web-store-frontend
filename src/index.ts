import './scss/styles.scss';
/***** базовые утилиты *****/
import { ensureElement } from './utils/utils';
import { CDN_URL, API_URL } from './utils/constants';
/***** базовые api и events *****/
import { EventEmitter } from './components/base/events';
/***** модель логики *****/
import { DataModel } from './components/model/DataModel';
import { ApiModel } from './components/model/ApiModel';
import { BasketModel } from './components/model/BasketModel';
import { FormModel } from './components/model/FormModel';
/***** модель представления *****/
import { Card } from './components/view/Card';
import { CardPreview } from './components/view/CardPreview';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { BasketItem } from './components/view/BasketItem';
import { Order } from './components/view/Order';
/***** типы *****/
import { IProductItem } from './types';

/***** HTML-шаблоны *****/
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;



/***** инстансы классов *****/
const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const basketModel = new BasketModel();
const order = new Order(orderTemplate, events);
const formModel = new FormModel(events);


/***** Отображение карточек товара на странице *****/
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  });
});

/***** Получить объект данных "IProductItem" карточки по которой кликнули ****/
events.on('card:select', (item: IProductItem) => {
  dataModel.setPreview(item)
});

/***** Открываем модальное окно карточки товара *****/
events.on('modalCard:open', (item: IProductItem) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events, basketModel, modal)
  modal.content = cardPreview.render(item);
  modal.render();
});

/*** Блокируем прокрутку страницы при открытие модального окна ***/
events.on('modal:open', () => {
  modal.locked = true;
});

/*** Разблокируем прокрутку страницы при закрытие модального окна ***/
events.on('modal:close', () => {
  modal.locked = false;
});



/**** Добавление карточки товара в корзину ****/
events.on('card:addBasket', () => {
  basketModel.setSelectedСard(dataModel.selectedСard); // добавить карточку товара в корзину
  basket.renderHeaderBasketCounter(basketModel.getCounter());
  const cardPreview = new CardPreview(cardPreviewTemplate, events, basketModel, modal)
  cardPreview.updateButtonState(dataModel.selectedСard); // Обновить кнопку
  modal.close();
});


/**** Открытие модального окна корзины ***/
events.on('basket:open', () => {
  basket.renderSumAllProducts(basketModel.getSumAllProducts());  // отобразить сумма всех продуктов в корзине
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    i = i + 1;
    return basketItem.render(item, i);
  })
  modal.content = basket.render();
  modal.render();
});


/*** Удаление карточки товара из корзины ***/
events.on('basket:basketItemRemove', (item: IProductItem) => {
  basketModel.deleteCardToBasket(item);
  basket.renderHeaderBasketCounter(basketModel.getCounter()); // отобразить количество товара на иконке корзины
  basket.renderSumAllProducts(basketModel.getSumAllProducts()); // отобразить сумма всех продуктов в корзине
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    i = i + 1;
    return basketItem.render(item, i);
  })
  const cardPreview = new CardPreview(cardPreviewTemplate, events, basketModel, modal)
  cardPreview.updateButtonState(item); // Обновить кнопку
});

/*** Открытие модального окна "способа оплаты" и "адреса доставки" ***/
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
  formModel.items = basketModel.basketProducts.map(item => item.id); // передаём список id товаров которые покупаем
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => { formModel.payment = button.name }) // передаём способ оплаты - получили из order
/*** Отслеживаем изменение в поле в вода "адреса доставки" и передача полученнго в formModel ***/
events.on('order:changeAddress', (data: { nameInput: string, valueInput: string }) => {
  formModel.getOrderAddress(data.nameInput, data.valueInput);
});


/***** Получаем данные с сервера *****/
apiModel.getListProductCard()
  .then(function (data: IProductItem[]) {
    dataModel.productCards = data;
  })
  .catch(error => console.log(error))