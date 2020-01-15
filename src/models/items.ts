import { Book as RDSBook } from '@ridi/web-ui';
import isAfter from 'date-fns/is_after';
import { flow, getEnv, types, getParentOfType, Instance } from 'mobx-state-tree';
import React from 'react';
import * as R from 'runtypes';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from 'constants/page';
import { ServiceType } from 'constants/serviceType';
import { BooksPageKind } from 'constants/urls';
import { getOrderParams } from 'utils/order';
import { calcOffset, calcPage } from 'utils/pagination';

import config from '../config';

import { Book } from './books';
import Env from './env';
import { Unit } from './units';
import { ListInstructions } from 'constants/listInstructions';

interface MainPageGroupOptions {
  kind: BooksPageKind.MAIN;
  orderBy: string;
  orderDirection: string;
  filter: number | string;
}

interface SearchPageGroupOptions {
  kind: BooksPageKind.SEARCH;
  keyword: string;
}

interface HiddenPageGroupOptions {
  kind: BooksPageKind.HIDDEN;
}

type PageGroupOptions = MainPageGroupOptions | SearchPageGroupOptions | HiddenPageGroupOptions;

const RItemData = R.Record({
  b_id: R.String,
  service_type: R.String,
  is_ridiselect: R.Boolean, // deprecated
  purchase_date: R.String,
  expire_date: R.String,
  remain_time: R.String,
  unit_id: R.String,
  unit_title: R.String,
  unit_type: R.String,
}).And(
  R.Partial({
    unit_count: R.Number,
  }),
);

const RItemCountData = R.Record({
  item_total_count: R.Number,
  unit_total_count: R.Number,
});

export const Item = types
  .model({
    book: types.reference(Book),
    unit: types.reference(Unit),
    serviceType: types.string,
    purchaseDate: types.Date,
    expireDate: types.Date,
    remainTime: types.string,
    bookCount: 0,
  })
  .views(self => ({
    get isRidiselect() {
      return self.serviceType === 'ridiselect';
    },
    get isNotAvailable() {
      return isAfter(new Date(), self.expireDate);
    },
    get bookCountNode(): React.ReactNode {
      if (self.bookCount === 0) {
        return null;
      }
      return React.createElement(RDSBook.UnitBookCount, { bookCount: self.bookCount, bookCountUnit: self.book.bookCountUnit });
    },
  }))
  .views(self => ({
    get isExpired() {
      return !self.isRidiselect && self.isNotAvailable;
    },
    get isRidiselectSingleUnit() {
      return self.isRidiselect && self.unit.isBook && self.bookCount === 1;
    },
  }));

export const Page = types.model({
  page: types.number,
  items: types.array(Item),
});

export const PageGroup = types
  .model({
    key: types.identifier,
    itemTotalCount: types.maybe(types.number),
    unitTotalCount: types.maybe(types.number),
    pages: types.map(Page),
  })
  .views(self => ({
    get isHidden() {
      return self.key === 'hidden';
    },
    get totalPages() {
      if (self.unitTotalCount == null) {
        return 0;
      }
      return calcPage(self.unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE);
    },
    listInstruction(page: number) {
      const pageNode = self.pages.get(String(page));
      if (pageNode == null) {
        return ListInstructions.SKELETON;
      }
      if (pageNode.items.length !== 0) {
        return ListInstructions.SHOW;
      }
      return ListInstructions.EMPTY;
    },
  }))
  .views(self => ({
    get baseOptions() {
      const params = new URLSearchParams();
      const [kind, filter, orderBy, orderDirection, keyword] = self.key.split(',');
      if (ServiceType.includes(filter)) {
        params.set('service_type', filter);
      } else {
        params.set('category', filter);
      }
      if (kind === BooksPageKind.MAIN) {
        const orderParams = getOrderParams(orderBy, orderDirection);
        orderParams.orderType && params.set('order_type', orderParams.orderType);
        orderParams.orderBy && params.set('order_by', orderParams.orderBy);
        orderParams.expiredBooksOnly && params.set('expired_books_only', String(orderParams.expiredBooksOnly));
      } else if (kind === BooksPageKind.SEARCH) {
        params.set('keyword', keyword);
      }

      const search = params.toString();
      if (search !== '') {
        return '?' + search;
      }
      return '';
    },
  }))
  .views(self => ({
    get itemsApiUrl() {
      const [kind] = self.key.split(',');
      const url = new URL(`/items/${kind}/`, config.LIBRARY_API_BASE_URL);
      url.search = self.baseOptions;
      return url;
    },
    get itemsCountApiUrl() {
      const [kind] = self.key.split(',');
      const url = new URL(`/items/${kind}/count/`, config.LIBRARY_API_BASE_URL);
      return url;
    },
  }))
  .actions(self => ({
    loadPage: flow(function* loadPage(page: number) {
      const itemStore = getParentOfType(self, ItemStore);
      const { privateApi } = getEnv<Env>(self);

      const itemsUrl = self.itemsApiUrl;
      const itemsCountUrl = self.itemsCountApiUrl;
      itemsUrl.searchParams.set('offset', String(calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE)));
      itemsUrl.searchParams.set('limit', String(LIBRARY_ITEMS_LIMIT_PER_PAGE));

      const [itemsResponse, itemsCountResponse] = yield Promise.all([
        privateApi.get(itemsUrl.toString()),
        privateApi.get(itemsCountUrl.toString()),
      ]);
      const items = R.Array(RItemData).check(itemsResponse.data.items);
      const itemsCount = RItemCountData.check(itemsCountResponse.data);
      self.itemTotalCount = itemsCount.item_total_count;
      self.unitTotalCount = itemsCount.unit_total_count;

      const bookIds = items.map(item => item.b_id);
      const unitIds = items.map(item => item.unit_id);
      const [books] = yield Promise.all([itemStore.loadBooks(bookIds), itemStore.loadUnits(unitIds)]);
      const lastBookIds = books.map((book: Instance<typeof Book>) => book.lastOpenVolumeId).filter((id: string | null) => id != null);
      itemStore.loadBooks(lastBookIds);
      const aliveItems = items
        .filter(item => itemStore.books.has(item.b_id) && itemStore.units.has(String(item.unit_id)))
        .map(item => ({
          book: item.b_id,
          unit: item.unit_id,
          serviceType: item.service_type,
          purchaseDate: new Date(item.purchase_date),
          expireDate: new Date(item.expire_date),
          remainTime: item.remain_time,
          bookCount: item.unit_count,
        }));
      const node = Page.create({
        page,
        items: aliveItems,
      });
      self.pages.set(String(page), node);
      return node;
    }),
  }));

function optionToKey(options: PageGroupOptions) {
  switch (options.kind) {
    case BooksPageKind.MAIN:
      return [options.kind, options.filter, options.orderBy, options.orderDirection].join(',');
    case BooksPageKind.SEARCH:
      return [options.kind, '', '', '', options.keyword].join(',');
    case BooksPageKind.HIDDEN:
      return 'hidden';
    default:
      throw new Error('');
  }
}

export const ItemStore = types
  .model({
    books: types.map(Book),
    units: types.map(Unit),
    pageGroups: types.map(PageGroup),
  })
  .views(self => ({
    pageGroupOf(options: PageGroupOptions): Instance<typeof PageGroup> | undefined {
      let key = optionToKey(options);
      return self.pageGroups.get(key);
    },
  }))
  .actions(self => ({
    getOrCreatePageGroup(options: PageGroupOptions) {
      let key = optionToKey(options);
      if (!self.pageGroups.has(key)) {
        self.pageGroups.put({
          key,
          pages: {},
        });
      }
      return self.pageGroups.get(key);
    },
    loadBooks: flow(function* loadBooks(bookIds: string[]) {
      const { privateApi } = getEnv<Env>(self);

      const booksToLoad = [...new Set(bookIds.filter(bookId => !self.books.has(bookId)))];
      if (booksToLoad.length === 0) {
        return [];
      }

      const requestUrl = new URL('/books', config.BOOK_API_BASE_URL);
      const params = new URLSearchParams([['b_ids', booksToLoad.join(',')]]);
      const response = yield privateApi.post(requestUrl.toString(), params.toString());
      const books: any[] = response.data.filter((book: any) => !book.is_deleted);

      const idSet = new Set(books.map(book => book.id));
      booksToLoad.forEach(bookId => {
        if (!idSet.has(bookId)) {
          console.error('Book requested but does not exist:', bookId);
        }
      });

      const bookNodes = [];
      books.forEach(book => {
        const node = Book.create({
          id: book.id,
          data: book,
        });
        self.books.put(node);
        bookNodes.push(node);
      });

      return bookNodes;
    }),
    loadUnits: flow(function* loadUnits(unitIds: string[]) {
      const { privateApi } = getEnv<Env>(self);

      const unitsToLoad = [...new Set(unitIds.filter(unitId => !self.units.has(unitId)))];
      if (unitsToLoad.length === 0) {
        return [];
      }

      const requestUrl = new URL('/books/units/', config.LIBRARY_API_BASE_URL);
      const response = yield privateApi.post(requestUrl.toString(), { unit_ids: unitsToLoad });
      const units: any[] = response.data.units;

      const idSet = new Set(units.map(unit => String(unit.id)));
      unitsToLoad.forEach(unitId => {
        if (!idSet.has(unitId)) {
          console.error('Unit requested but does not exist:', unitId);
        }
      });

      const unitNodes = [];
      units.forEach(unit => {
        const node = Unit.create({
          id: unit.id,
          data: unit,
        });
        self.units.put(node);
        unitNodes.push(node);
      });

      return unitNodes;
    }),
  }));

const ItemStoreContext = React.createContext<Instance<typeof ItemStore> | null>(null);
export const ItemStoreProvider = ItemStoreContext.Provider;

export function useItemStore(): Instance<typeof ItemStore> {
  const itemStore = React.useContext(ItemStoreContext);
  if (itemStore == null) {
    throw new Error('Item store not found.');
  }
  return itemStore;
}
