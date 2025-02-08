import './scss/styles.scss';
/***** базовые утилиты *****/
import { ensureElement } from './utils/utils';
import { CDN_URL, API_URL } from './utils/constants';
/***** базовые api и events *****/
import { EventEmitter } from './components/base/events';
/***** модель логики *****/
import { DataModel } from './components/model/DataModel';
import { ApiModel } from './components/model/ApiModel';
/***** модель представления *****/
import { Card } from './components/view/Card';
import { CardPreview } from './components/view/CardPreview';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
// import { BasketItem } from './components/View/BasketItem';
/***** типы *****/
import { IProductItem } from './types';

/***** HTML-шаблоны *****/
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;



/***** инстансы классов *****/
const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);


/***** Отображение карточек товара на странице *****/
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  });
});

/********** Получить объект данных "IProductItem" карточки по которой кликнули **********/
// с начала вывести в консоль item
events.on('card:select', (item: IProductItem) => {
  dataModel.setPreview(item)
});

/***** Открываем модальное окно карточки товара *****/
events.on('modalCard:open', (item: IProductItem) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events)
  modal.content = cardPreview.render(item);
  modal.render();
});

/********** Блокируем прокрутку страницы при открытие модального окна **********/
events.on('modal:open', () => {
  modal.locked = true;
});

/********** Разблокируем прокрутку страницы при закрытие модального окна **********/
events.on('modal:close', () => {
  modal.locked = false;
});


/********** Открытие модального окна корзины **********/
events.on('basket:open', () => {
  modal.content = basket.render();
  modal.render();
});

/***** Получаем данные с сервера *****/
apiModel.getListProductCard()
  .then(function (data: IProductItem[]) {
    dataModel.productCards = data;
  })
  .catch(error => console.log(error))