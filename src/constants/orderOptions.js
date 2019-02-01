export const OrderBy = {
  ASC: 'asc',
  DESC: 'desc',
};

export const OrderType = {
  PURCHASE_DATE: 'purchase_date',
  EXPIRE_DATE: 'expire_date',
  EXPIRED_BOOKS_ONLY: 'expired_books_only',
  UNIT_TITLE: 'unit_title',
  BOOK_TITLE: 'book_title',
  UNIT_AUTHOR: 'unit_author',
  BOOK_AUTHOR: 'book_author',
  UNIT_ORDER: 'unit_order',
  RELEASE_DATE: 'release_date',
};

class BaseOrderOptions {
  static parse(index) {
    const _option = this.toList()[index];
    return {
      orderType: _option.orderType,
      orderBy: _option.orderBy,
    };
  }

  static toIndex(orderType, orderBy) {
    return this.toList().findIndex(value => value.orderType === orderType && value.orderBy === orderBy);
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
    return [this.PURCHASE_DATE, this.UNIT_TITLE, this.UNIT_AUTHOR, this.EXPIRE_DATE, this.EXPIRED_BOOKS_ONLY];
  }

  static get DEFAULT() {
    return this.PURCHASE_DATE;
  }

  static get PURCHASE_DATE() {
    return {
      title: '최근 구매순',
      orderType: OrderType.PURCHASE_DATE,
      orderBy: OrderBy.DESC,
    };
  }

  static get EXPIRE_DATE() {
    return {
      title: '대여 만료 임박순',
      orderType: OrderType.EXPIRE_DATE,
      orderBy: OrderBy.ASC,
    };
  }

  static get UNIT_TITLE() {
    return {
      title: '제목 가나다순',
      orderType: OrderType.UNIT_TITLE,
      orderBy: OrderBy.ASC,
    };
  }

  static get UNIT_AUTHOR() {
    return {
      title: '저자 가나다순',
      orderType: OrderType.UNIT_AUTHOR,
      orderBy: OrderBy.ASC,
    };
  }

  static get EXPIRED_BOOKS_ONLY() {
    return {
      title: '만료 도서만 보기',
      orderType: OrderType.EXPIRED_BOOKS_ONLY,
      orderBy: OrderBy.DESC,
    };
  }
}

export class UnitOrderOptions extends BaseOrderOptions {
  static toSeriesList() {
    return [this.UNIT_ORDER_DESC, this.UNIT_ORDER_ASC, this.PURCHASE_DATE, this.EXPIRE_DATE, this.EXPIRED_BOOKS_ONLY];
  }

  static toShelfList() {
    return [...this.toSeriesList(), this.BOOK_TITLE, this.BOOK_AUTHOR];
  }

  static toList() {
    return this.toShelfList();
  }

  static get DEFAULT() {
    return this.UNIT_ORDER_DESC;
  }

  static get UNIT_ORDER_DESC() {
    return {
      title: '최신순',
      orderType: OrderType.UNIT_ORDER,
      orderBy: OrderBy.DESC,
    };
  }

  static get UNIT_ORDER_ASC() {
    return {
      title: '1권부터',
      orderType: OrderType.UNIT_ORDER,
      orderBy: OrderBy.ASC,
    };
  }

  static get PURCHASE_DATE() {
    return {
      title: '최근 구매순',
      orderType: OrderType.PURCHASE_DATE,
      orderBy: OrderBy.DESC,
    };
  }

  static get BOOK_TITLE() {
    return {
      title: '제목순',
      orderType: OrderType.BOOK_TITLE,
      orderBy: OrderBy.ASC,
    };
  }

  static get BOOK_AUTHOR() {
    return {
      title: '저자순',
      orderType: OrderType.BOOK_AUTHOR,
      orderBy: OrderBy.ASC,
    };
  }

  static get EXPIRE_DATE() {
    return {
      title: '대여 만료 임박순',
      orderType: OrderType.EXPIRE_DATE,
      orderBy: OrderBy.ASC,
    };
  }

  static get EXPIRED_BOOKS_ONLY() {
    return {
      title: '만료 도서만 보기',
      orderType: OrderType.EXPIRED_BOOKS_ONLY,
      orderBy: OrderBy.DESC,
    };
  }
}
