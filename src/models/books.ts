import { Book as RDSBook } from '@ridi/web-ui';
import isAfter from 'date-fns/is_after';
import subDays from 'date-fns/sub_days';
import { types, getParentOfType } from 'mobx-state-tree';
import * as R from 'runtypes';

import { ROLE_DESCRIPTIONS } from 'constants/authorRole';

import { ItemStore } from './items';

function excerpt(names: string[], limit: number) {
  const baseNames = names.slice(0, limit).join(', ');
  return names.length > limit ? `${baseNames} 외 ${names.length - limit}명` : baseNames;
}

const RCategory = R.Record({
  id: R.Number,
  name: R.String,
  genre: R.String,
  sub_genre: R.String,
  is_series_category: R.Boolean,
});

const RPriceBase = R.Record({
  regular_price: R.Number,
  price: R.Number,
});

const RPriceItem = RPriceBase.And(
  R.Record({
    discount_percentage: R.Number,
  }),
);

const RSeriesPriceCount = R.Record({
  total_book_count: R.Number,
  free_book_count: R.Number,
});

const RSeriesPriceItem = RPriceBase.And(RSeriesPriceCount);

const RSeriesRentPriceItem = R.Record({
  rent_price: R.Number,
  rent_days: R.Union(R.Number, R.String), // wat
}).And(RSeriesPriceCount);

const RPriceInfo = R.Record({
  buy: RPriceItem,
}).And(
  R.Partial({
    rent: RPriceItem.And(R.Record({ rent_days: R.Number })),
  }),
);

const RSeriesPriceInfo = R.Record({
  buy: RSeriesPriceItem,
}).And(
  R.Partial({
    rent: RSeriesRentPriceItem,
  }),
);

const RSeries = R.Record({
  id: R.String,
  volume: R.Number,
  property: R.Record({
    last_volume_id: R.String,
    opened_last_volume_id: R.String,
    title: R.String.Or(R.Null),
    unit: R.String.Or(R.Null),
    opened_book_count: R.Number,
    total_book_count: R.Number,
    is_serial: R.Boolean,
    is_completed: R.Boolean,
    is_comic_hd: R.Boolean,
    is_serial_complete: R.Boolean,
    is_wait_free: R.Boolean,
  }),
}).And(
  R.Partial({
    price_info: RSeriesPriceInfo,
  }),
);

const RSeriesSimple = R.Record({
  property: R.Record({
    last_volume_id: R.String,
    opened_last_volume_id: R.String,
    title: R.String.Or(R.Null),
    unit: R.String.Or(R.Null),
    opened_book_count: R.Number,
    total_book_count: R.Number,
    is_serial: R.Boolean,
    is_completed: R.Boolean,
    is_comic_hd: R.Boolean,
    is_serial_complete: R.Boolean,
    is_wait_free: R.Boolean,
  }),
});

const RAuthor = R.Record({
  name: R.String,
  role: R.String,
}).And(
  R.Partial({
    id: R.Number,
  }),
);

export const RBookData = R.Record({
  id: R.String,
  title: R.Record({
    main: R.String,
  }),
  thumbnail: R.Record({
    small: R.String,
    large: R.String,
    xxlarge: R.String,
  }),
  categories: R.Array(RCategory).withConstraint(arr => arr.length > 0),
  price_info: RPriceInfo,
  file: R.Record({
    size: R.Number,
    format: R.String,
    is_drm_free: R.Boolean,
    is_comic: R.Boolean,
    is_webtoon: R.Boolean,
    is_manga: R.Boolean,
    is_comic_hd: R.Boolean,
  }).And(
    R.Partial({
      character_count: R.Number,
      page_count: R.Number,
    }),
  ),
  property: R.Record({
    is_novel: R.Boolean,
    is_magazine: R.Boolean,
    is_adult_only: R.Boolean,
    is_new_book: R.Boolean,
    is_open: R.Boolean,
    is_somedeal: R.Boolean,
    is_trial: R.Boolean,
    preview_rate: R.Number,
  }).And(
    R.Partial({
      review_display_id: R.String,
    }),
  ),
  support: R.Record({
    android: R.Boolean,
    ios: R.Boolean,
    mac: R.Boolean,
    paper: R.Boolean,
    windows: R.Boolean,
    web_viewer: R.Boolean,
  }),
  publish: R.Record({
    ridibooks_register: R.String,
  }).And(
    R.Partial({
      ebook_publish: R.String,
      paper_book_publish: R.String,
      ridibooks_publish: R.String,
    }),
  ),
  publisher: R.Record({
    name: R.String,
    cp_name: R.String,
  }).And(
    R.Partial({
      id: R.Number,
    }),
  ),
  last_modified: R.String,
}).And(
  R.Partial({
    authors_ordered: R.Array(RAuthor),
    series: RSeries,
  }),
);

export const RBookDataSimple = R.Record({
  id: R.String,
  title: R.Record({
    main: R.String,
  }),
  thumbnail: R.Record({
    small: R.String,
    large: R.String,
    xxlarge: R.String,
  }),
  categories: R.Array(RCategory).withConstraint(arr => arr.length > 0),
  file: R.Record({
    size: R.Number,
    format: R.String,
    is_drm_free: R.Boolean,
    is_comic: R.Boolean,
    is_webtoon: R.Boolean,
    is_manga: R.Boolean,
    is_comic_hd: R.Boolean,
  }).And(
    R.Partial({
      character_count: R.Number,
      page_count: R.Number,
    }),
  ),
  property: R.Record({
    is_novel: R.Boolean,
    is_magazine: R.Boolean,
    is_adult_only: R.Boolean,
    is_new_book: R.Boolean,
    is_open: R.Boolean,
    is_somedeal: R.Boolean,
    is_trial: R.Boolean,
  }),
  support: R.Record({
    android: R.Boolean,
    ios: R.Boolean,
    mac: R.Boolean,
    paper: R.Boolean,
    windows: R.Boolean,
    web_viewer: R.Boolean,
  }),
  publish: R.Record({
    ridibooks_register: R.String,
  }).And(
    R.Partial({
      ridibooks_publish: R.String,
    }),
  ),
  last_modified: R.String,
}).And(
  R.Partial({
    authors_ordered: R.Array(RAuthor),
    series: RSeriesSimple,
  }),
);

export interface BookData extends R.Static<typeof RBookData> {}
export interface BookDataSimple extends R.Static<typeof RBookDataSimple> {}

export const Book = types
  .model({
    id: types.identifier,
    data: types.custom<object, BookDataSimple & { $instance: true }>({
      name: 'BookData',
      fromSnapshot(snapshot) {
        return {
          ...(snapshot as BookDataSimple),
          $instance: true,
        };
      },
      toSnapshot(value) {
        const snapshot = { ...value };
        delete snapshot['$instance'];
        return snapshot;
      },
      isTargetType(value) {
        return '$instance' in value;
      },
      getValidationMessage(snapshot) {
        const fullValidationResult = RBookData.validate(snapshot);
        if (fullValidationResult.success === true) {
          return '';
        }
        console.groupCollapsed('Book full validation error');
        console.log('Data:', snapshot);
        console.table({
          message: fullValidationResult.message,
          key: fullValidationResult.key,
        });
        console.groupEnd();

        const simpleValidationResult = RBookDataSimple.validate(snapshot);
        if (simpleValidationResult.success === true) {
          return '';
        }
        if (simpleValidationResult.key != null) {
          return `At ${simpleValidationResult.key}: ${simpleValidationResult.message}`;
        }
        return simpleValidationResult.message;
      },
    }),
  })
  .views(self => ({
    get lastOpenVolumeId() {
      const id = self.data.series?.property.opened_last_volume_id;
      return id || null;
    },
    get title() {
      return self.data.title.main;
    },
    get bookCountUnit() {
      return (self.data.series?.property.unit as RDSBook.BookCountUnit) || RDSBook.BookCountUnit.Single;
    },
    get isAdultOnly() {
      return self.data.property.is_adult_only;
    },
    get thumbnailUrl() {
      const url = new URL(self.data.thumbnail.large);
      url.searchParams.set('dpi', 'xhdpi');
      return url.toString();
    },
    get authors() {
      const LIMIT = 2;
      const { authors_ordered: authorsOrdered } = self.data;
      if (!authorsOrdered) return null;

      // 같은 역할끼리 묶기
      const authorsGrouped: { authors: { name: string; id: number }[]; role: string }[] = [];
      authorsOrdered.forEach(author => {
        const ongoingGroup = authorsGrouped[authorsGrouped.length - 1];
        if (ongoingGroup == null || ongoingGroup.role !== author.role) {
          authorsGrouped.push({
            authors: [
              {
                name: author.name,
                id: author.id,
              },
            ],
            role: author.role,
          });
        } else {
          ongoingGroup.authors.push({
            name: author.name,
            id: author.id,
          });
        }
      });

      return authorsGrouped.map(group => {
        const names = excerpt(
          group.authors.map(author => author.name),
          LIMIT,
        );
        return `${names} ${ROLE_DESCRIPTIONS[group.role]}`;
      });
    },
    get authorsSimple() {
      const LIMIT = 2;
      const { authors_ordered: authorsOrdered } = self.data;
      if (!authorsOrdered) return null;

      return excerpt(
        authorsOrdered.map(author => author.name),
        LIMIT,
      );
    },
    get genre() {
      return self.data.categories[0].genre;
    },
    get isRecentlyUpdated() {
      const publishDateRaw = self.data.publish.ridibooks_publish;
      if (publishDateRaw == null) {
        return false;
      }
      const publishDate = new Date(publishDateRaw);
      return isAfter(publishDate, subDays(new Date(), 3));
    },
  }))
  .views(self => ({
    get lastOpenVolume() {
      const id = self.lastOpenVolumeId;
      return getParentOfType(self, ItemStore).books.get(id);
    },
  }));
