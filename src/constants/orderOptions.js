export const OrderDirection = {
  ASC: 'asc',
  DESC: 'desc',
};

export const OrderBy = {
  PURCHASE_DATE: 'purchase_date',
  EXPIRE_DATE: 'expire_date',
  EXPIRED_BOOKS_ONLY: 'expired_books_only',
  SHELF_CREATED: 'created',
  SHELF_NAME: 'name',
  SHELF_BOOK_REVISION: 'revision',
  SHELF_BOOK_TITLE: 'title',
  SHELF_BOOK_AUTHOR: 'author',
  UNIT_TITLE: 'unit_title',
  BOOK_TITLE: 'book_title',
  UNIT_AUTHOR: 'unit_author',
  BOOK_AUTHOR: 'book_author',
  UNIT_ORDER: 'unit_order',
  RELEASE_DATE: 'release_date',
};

const applyUnitOfCount = (order, unitOfCount) => ({
  ...order,
  title: order.titleTemplate(unitOfCount),
});

class BaseOrderOptions {
  static parse(key) {
    return this.toList().find(value => value.key === key);
  }

  static equal(a, b) {
    return a.key === b.key;
  }

  static toKey(orderBy, orderDirection) {
    const option = this.toList().find(value => value.orderBy === orderBy && value.orderDirection === orderDirection);
    return option.key;
  }

  static toList() {
    throw new Error('Need Implement toList');
  }

  static get DEFAULT() {
    throw new Error('Need Implement Default');
  }
}

export class OrderOptions extends BaseOrderOptions {
  static toMainList() {
    return [this.PURCHASE_DATE, this.UNIT_TITLE, this.UNIT_AUTHOR, this.EXPIRE_DATE, this.EXPIRED_BOOKS_ONLY];
  }

  static toSeriesList(unitOfCount) {
    return [
      this.UNIT_ORDER_DESC,
      applyUnitOfCount(this.UNIT_ORDER_ASC, unitOfCount),
      this.PURCHASE_DATE,
      this.EXPIRE_DATE,
      this.EXPIRED_BOOKS_ONLY,
    ];
  }

  static toCollectionList(unitOfCount) {
    return [
      applyUnitOfCount(this.UNIT_ORDER_DESC, unitOfCount),
      applyUnitOfCount(this.UNIT_ORDER_ASC, unitOfCount),
      this.PURCHASE_DATE,
      this.EXPIRE_DATE,
      this.EXPIRED_BOOKS_ONLY,
      this.BOOK_TITLE,
      this.BOOK_AUTHOR,
    ];
  }

  static toShelves() {
    return [this.SHELF_CREATED, this.SHELF_NAME];
  }

  static toShelfList() {
    return [this.SHELF_BOOK_REVISION, this.SHELF_BOOK_TITLE, this.SHELF_BOOK_AUTHOR];
  }

  static toList() {
    return [
      this.PURCHASE_DATE,
      this.UNIT_TITLE,
      this.UNIT_AUTHOR,
      this.EXPIRE_DATE,
      this.EXPIRED_BOOKS_ONLY,
      this.SHELF_CREATED,
      this.SHELF_NAME,
      this.SHELF_BOOK_REVISION,
      this.SHELF_BOOK_TITLE,
      this.SHELF_BOOK_AUTHOR,
      this.UNIT_ORDER_DESC,
      this.UNIT_ORDER_ASC,
      this.BOOK_TITLE,
      this.BOOK_AUTHOR,
    ];
  }

  static get DEFAULT() {
    return this.PURCHASE_DATE;
  }

  static get SHELF_BOOK_DEFAULT() {
    return this.SHELF_BOOK_REVISION;
  }

  static get SHELF_CREATED() {
    return {
      key: 'SHELF_CREATED',
      title: '최근 생성순',
      orderBy: OrderBy.SHELF_CREATED,
      orderDirection: OrderDirection.DESC,
    };
  }

  static get SHELF_NAME() {
    return {
      key: 'SHELF_NAME',
      title: '이름 가나다순',
      orderBy: OrderBy.SHELF_NAME,
      orderDirection: OrderDirection.ASC,
    };
  }

  static get SHELF_BOOK_REVISION() {
    return {
      key: 'SHELF_BOOK_REVISION',
      title: '최근 추가순',
      orderBy: OrderBy.SHELF_BOOK_REVISION,
    };
  }

  static get SHELF_BOOK_TITLE() {
    return {
      key: 'SHELF_BOOK_TITLE',
      title: '제목 가나다순',
      orderBy: OrderBy.SHELF_BOOK_TITLE,
    };
  }

  static get SHELF_BOOK_AUTHOR() {
    return {
      key: 'SHELF_BOOK_AUTHOR',
      title: '작가 가나다순',
      orderBy: OrderBy.SHELF_BOOK_AUTHOR,
    };
  }

  static get UNIT_LIST_DEFAULT() {
    return this.UNIT_ORDER_DESC;
  }

  static get PURCHASE_DATE() {
    return {
      key: 'PURCHASE_DATE',
      title: '최근 구매순',
      orderBy: OrderBy.PURCHASE_DATE,
      orderDirection: OrderDirection.DESC,
    };
  }

  static get EXPIRE_DATE() {
    return {
      key: 'EXPIRE_DATE',
      title: '대여 만료 임박순',
      orderBy: OrderBy.EXPIRE_DATE,
      orderDirection: OrderDirection.ASC,
    };
  }

  static get UNIT_TITLE() {
    return {
      key: 'UNIT_TITLE',
      title: '제목 가나다순',
      orderBy: OrderBy.UNIT_TITLE,
      orderDirection: OrderDirection.ASC,
    };
  }

  static get UNIT_AUTHOR() {
    return {
      key: 'UNIT_AUTHOR',
      title: '저자 가나다순',
      orderBy: OrderBy.UNIT_AUTHOR,
      orderDirection: OrderDirection.ASC,
    };
  }

  static get EXPIRED_BOOKS_ONLY() {
    return {
      key: 'EXPIRED_BOOKS_ONLY',
      title: '만료 도서만 보기',
      orderBy: OrderBy.EXPIRED_BOOKS_ONLY,
      orderDirection: OrderDirection.DESC,
    };
  }

  static get UNIT_ORDER_DESC() {
    return {
      titleTemplate: unitOfCount => `마지막 ${unitOfCount || '권'}부터`,

      key: 'UNIT_ORDER_DESC',
      title: '최근 업데이트순',
      orderBy: OrderBy.UNIT_ORDER,
      orderDirection: OrderDirection.DESC,
    };
  }

  static get UNIT_ORDER_ASC() {
    return {
      titleTemplate: unitOfCount => `1${unitOfCount || '권'}부터`,

      key: 'UNIT_ORDER_ASC',
      title: '1권부터',
      orderBy: OrderBy.UNIT_ORDER,
      orderDirection: OrderDirection.ASC,
    };
  }

  static get BOOK_TITLE() {
    return {
      key: 'BOOK_TITLE',
      title: '제목순',
      orderBy: OrderBy.BOOK_TITLE,
      orderDirection: OrderDirection.ASC,
    };
  }

  static get BOOK_AUTHOR() {
    return {
      key: 'BOOK_AUTHOR',
      title: '저자순',
      orderBy: OrderBy.BOOK_AUTHOR,
      orderDirection: OrderDirection.ASC,
    };
  }
}
