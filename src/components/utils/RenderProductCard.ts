import { CardView } from '../../components/view/CardView';
import { IProductItem } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../../components/base/events';
export const renderProductCards = (productCards: IProductItem[], events: EventEmitter, template: HTMLTemplateElement) => {
  const gallery = ensureElement<HTMLElement>('.gallery');
  gallery.innerHTML = ''; // Очистка предыдущих карточек, если необходимо
  productCards.forEach(item => {
    const card = new CardView(template, events, { onClick: () => events.emit('card:select', item) });
    gallery.append(card.render(item));
  });
};