const generateValue = item => `${item.order_type}__${item.order_by}`;
const generateAndAttachValue = item => ({
  ...item,
  value: generateValue(item),
});

const OrderBy = {
  ASC: 'asc',
  DESC: 'desc',
};

export const OrderType = {
  PURCHASE_DATE: 'purchase_date',
  EXPIRE_DATE: 'expire_date',
  UNIT_TITLE: 'unit_title',
  BOOK_TITLE: 'book_title',
  UNIT_AUTHOR: 'unit_author',
  BOOK_AUTHOR: 'book_author',
  UNIT_ORDER: 'unit_order',
  RELEASE_DATE: 'release_date',
};

const expiredOrderOption = {
  title: '대여 만료 임박순',
  order_type: OrderType.EXPIRE_DATE,
  order_by: OrderBy.ASC,
};

const mainOrder = [
  {
    title: '최근 구매순',
    order_type: OrderType.PURCHASE_DATE,
    order_by: OrderBy.DESC,
  },
  expiredOrderOption,
  {
    title: '제목 가나다순',
    order_type: OrderType.UNIT_TITLE,
    order_by: OrderBy.ASC,
  },
  {
    title: '저자 가나다순',
    order_type: OrderType.UNIT_AUTHOR,
    order_by: OrderBy.ASC,
  },
];

const seriesOrder = [
  {
    title: '1권부터',
    order_type: OrderType.UNIT_ORDER,
    order_by: OrderBy.ASC,
  },
  {
    title: '마지막 권부터',
    order_type: OrderType.UNIT_ORDER,
    order_by: OrderBy.DESC,
  },
  {
    title: '최근 구매순',
    order_type: OrderType.PURCHASE_DATE,
    order_by: OrderBy.DESC,
  },
  expiredOrderOption,
];

const collectionOrder = [
  ...seriesOrder,
  {
    title: '제목순',
    order_type: OrderType.BOOK_TITLE,
    order_by: OrderBy.ASC,
  },
  {
    title: '저자순',
    order_type: OrderType.BOOK_AUTHOR,
    order_by: OrderBy.ASC,
  },
];

class BaseOrderOptions {
  static parse(option) {
    const _option = this.options.find(opt => opt.value === option);
    return {
      orderBy: _option.order_by,
      orderType: _option.order_type,
    };
  }

  static register(options) {
    this.options = options;
  }

  static get DEFAULT() {
    throw new Error('Need Implement Default');
  }

  static toList() {
    return this.options;
  }
}
BaseOrderOptions.options = [];

export class MainOrderOptions extends BaseOrderOptions {
  static get DEFAULT() {
    return this.options[0].value;
  }
}
MainOrderOptions.register(mainOrder.map(generateAndAttachValue));

// export const seriesOrderOptions = seriesOrder.map(generateAndAttachValue);
// export const collectionOrderOptions = collectionOrder.map(
//   generateAndAttachValue,
// );
