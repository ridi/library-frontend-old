const OrderBy = {
  ASC: 'asc',
  DESC: 'desc',
};

const OrderType = {
  PURCHASE_DATE: 'purchase_date',
  EXPIRE_DATE: 'expire_date',
  UNIT_TITLE: 'unit_title',
  BOOK_TITLE: 'book_title',
  UNIT_AUTHOR: 'unit_author',
  BOOK_AUTHOR: 'book_author',
  UNIT_ORDER: 'unit_order',
  RELEASE_DATE: 'release_date',
};

// const seriesOrder = [
//   {
//     title: '1권부터',
//     order_type: OrderType.UNIT_ORDER,
//     order_by: OrderBy.ASC,
//   },
//   {
//     title: '마지막 권부터',
//     order_type: OrderType.UNIT_ORDER,
//     order_by: OrderBy.DESC,
//   },
//   {
//     title: '최근 구매순',
//     order_type: OrderType.PURCHASE_DATE,
//     order_by: OrderBy.DESC,
//   },
//   {
//     title: '대여 만료 임박순',
//     order_type: OrderType.EXPIRE_DATE,
//     order_by: OrderBy.ASC,
//   },
// ];

// const collectionOrder = [
//   ...seriesOrder,
//   {
//     title: '제목순',
//     order_type: OrderType.BOOK_TITLE,
//     order_by: OrderBy.ASC,
//   },
//   {
//     title: '저자순',
//     order_type: OrderType.BOOK_AUTHOR,
//     order_by: OrderBy.ASC,
//   },
// ];

class BaseOrderOptions {
  static parse(index) {
    const _option = this.toList()[index];
    return {
      orderType: _option.order_type,
      orderBy: _option.order_by,
    };
  }

  static toIndex(orderType, orderBy) {
    const index = this.toList().findIndex(value => value.order_type === orderType && value.order_by === orderBy);

    return index;
  }

  static toList() {
    throw new Error('Need Implement Default');
  }

  static get DEFAULT() {
    throw new Error('Need Implement Default');
  }
}

export class MainOrderOptions extends BaseOrderOptions {
  static toList() {
    return [this.PURCHASE_DATE, this.EXPIRE_DATE, this.UNIT_TITLE, this.UNIT_AUTHOR];
  }

  static get DEFAULT() {
    return this.PURCHASE_DATE;
  }

  static get PURCHASE_DATE() {
    return {
      title: '최근 구매순',
      order_type: OrderType.PURCHASE_DATE,
      order_by: OrderBy.DESC,
    };
  }

  static get EXPIRE_DATE() {
    return {
      title: '대여 만료 임박순',
      order_type: OrderType.EXPIRE_DATE,
      order_by: OrderBy.ASC,
    };
  }

  static get UNIT_TITLE() {
    return {
      title: '제목 가나다순',
      order_type: OrderType.UNIT_TITLE,
      order_by: OrderBy.ASC,
    };
  }

  static get UNIT_AUTHOR() {
    return {
      title: '저자 가나다순',
      order_type: OrderType.UNIT_AUTHOR,
      order_by: OrderBy.ASC,
    };
  }
}

// export const seriesOrderOptions = seriesOrder.map(generateAndAttachValue);
// export const collectionOrderOptions = collectionOrder.map(
//   generateAndAttachValue,
// );
