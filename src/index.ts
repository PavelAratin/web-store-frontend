import './scss/styles.scss';
import { ensureElement } from './utils/utils';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { DataModel } from './components/model/DataModel';
import { ApiModel } from './components/model/ApiModel';
import { BasketModel } from './components/model/BasketModel';
import { FormModel } from './components/model/FormModel';
import { renderProductCards } from './components/utils/RenderProductCard';
import { CardPreview } from './components/view/CardPreview';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BasketView';
import { BasketItemView } from './components/view/BasketItemView';
import { OrderFormView } from './components/view/OrderView';
import { ContactsFormView } from './components/view/ContactFormView';
import { OrderSuccessView } from './components/view/OrderSuccessView';
import { IProductItem } from './types';
// Шаблоны
const templates = {
  cardCatalog: document.querySelector('#card-catalog') as HTMLTemplateElement,
  cardPreview: document.querySelector('#card-preview') as HTMLTemplateElement,
  basket: document.querySelector('#basket') as HTMLTemplateElement,
  basketItem: document.querySelector('#card-basket') as HTMLTemplateElement,
  order: document.querySelector('#order') as HTMLTemplateElement,
  contacts: document.querySelector('#contacts') as HTMLTemplateElement,
  successOrder: document.querySelector('#success') as HTMLTemplateElement,
};
// Инстансы классов
const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modalView = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new BasketView(templates.basket, events);
const basketModel = new BasketModel();
const orderFormView = new OrderFormView(templates.order, events);
const formModel = new FormModel(events);
const contactsFormView = new ContactsFormView(templates.contacts, events);
const successOrderFormView = new OrderSuccessView(templates.successOrder, events);

// Обработчики событий
events.on('productCards:receive', () => {
  renderProductCards(dataModel.productCards, events, templates.cardCatalog);
});
events.on('card:select', (item: IProductItem) => dataModel.setPreview(item));
events.on('modalCard:open', (item: IProductItem) => {
  const cardPreview = new CardPreview(templates.cardPreview, events, basketModel, modalView);
  modalView.content = cardPreview.render(item);
  modalView.render();
});
events.on('modal:open', () => { modalView.locked = true; });
events.on('modal:close', () => { modalView.locked = false; });
events.on('card:addBasket', () => {
  basketModel.setSelectedСard(dataModel.selectedСard);
  basketView.renderHeaderBasketCounter(basketModel.getCounter());
  const cardPreview = new CardPreview(templates.cardPreview, events, basketModel, modalView);
  cardPreview.updateButtonState(dataModel.selectedСard);
  modalView.close();
});
events.on('basket:open', () => {
  basketView.renderSumAllProducts(basketModel.getSumAllProducts());
  basketView.items = basketModel.basketProducts.map((item, index) => {
    const basketItem = new BasketItemView(templates.basketItem, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    return basketItem.render(item, index + 1);
  });
  modalView.content = basketView.render();
  modalView.render();
});
events.on('basket:basketItemRemove', (item: IProductItem) => {
  basketModel.deleteCardToBasket(item);
  basketView.renderHeaderBasketCounter(basketModel.getCounter());
  basketView.renderSumAllProducts(basketModel.getSumAllProducts());
  const cardPreview = new CardPreview(templates.cardPreview, events, basketModel, modalView);
  cardPreview.updateButtonState(item);
});
events.on('order:open', () => {
  modalView.content = orderFormView.render();
  modalView.render();
});
events.on('order:paymentSelection', (button: HTMLButtonElement) => {
  formModel.payment = button.name;
});
events.on('order:changeAddressInput', ({ nameInput, valueInput }: { nameInput: string, valueInput: string }) => {
  formModel.getAddress(nameInput, valueInput);
});
events.on('formContact:open', () => {
  if (formModel.validateAddressAndPayment()) {
    modalView.content = contactsFormView.render();
    modalView.render();
  }
});
events.on('formErrors:addressAndPayment', ({ address, payment }: { address: string, payment: string }) => {
  orderFormView.toggleErrors(address, payment);
});
events.on('formContact:changeInput', ({ inputName, inputvalue }: { inputName: string, inputvalue: string }) => {
  formModel.getEmailAndPhone(inputName, inputvalue);
});
events.on('formErrors:emailAndPhone', ({ email, phone }: { email: string, phone: string }) => {
  contactsFormView.toggleErrors(email, phone);
});
events.on('order:successOpen', () => {
  if (formModel.validateEmailAndPhone()) {
    // Обновляем сумму заказа в FormModel
    formModel.total = basketModel.getSumAllProducts();
    // Обновляем список товаров в FormModel
    formModel.items = basketModel.basketProducts.map(item => item.id);
    apiModel.postOrder(formModel.getOrderProd())
      .then((data) => {
        console.log('data', data); //ответ от сервера!
        modalView.content = successOrderFormView.render(basketModel.getSumAllProducts());
        modalView.render();
      })
      .catch(error => console.error('Ошибка при отправке заказа:', error));
  }
});
events.on('order:successClose', () => {
  modalView.close();
  basketModel.clearBasketProducts();
  basketView.renderHeaderBasketCounter(basketModel.getCounter());
});
// Получаем данные с сервера
apiModel.getListProductCard()
  .then(data => {
    dataModel.productCards = data;
  })
  .catch(error => console.error('Ошибка при получении товаров:', error));