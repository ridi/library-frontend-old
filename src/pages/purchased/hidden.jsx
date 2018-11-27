import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';

import EditingBar from '../../components/EditingBar';
import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook';
import Paginator from '../../components/Paginator';
import LNBHiddenTitleBar from '../base/LNB/LNBHiddenTitleBar';
import Responsive from '../base/Responsive';

import { getBooks } from '../../services/book/selectors';
import { loadPurchasedHiddenItems } from '../../services/purchased/hidden/actions';
import { getItemsByPage, getPageInfo, getItemTotalCount } from '../../services/purchased/hidden/selectors';
import { PAGE_COUNT } from '../../constants/page';

import { toFlatten } from '../../utils/array';
import { URLMap } from '../../constants/urls';

class Hidden extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadPurchasedHiddenItems());
  }

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };

    this.toggleEditingMode = this.toggleEditingMode.bind(this);
  }

  toggleEditingMode() {
    const { isEditing } = this.state;

    if (isEditing === true) {
      // 현재 Editing 모드면 나가면서 선택해둔 것들 클리어
    }

    this.setState({ isEditing: !isEditing });
  }

  renderBooks() {
    const { items, books } = this.props;
    return (
      <BookList>
        {items.map(item => (
          <LibraryBook key={item.b_id} item={item} book={books[item.b_id]} />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages },
    } = this.props;

    return <Paginator currentPage={currentPage} totalPages={totalPages} pageCount={PAGE_COUNT} pathname="/purchased/hidden/" query={{}} />;
  }

  render() {
    const { isEditing } = this.state;
    const { itemTotalCount } = this.props;
    return (
      <>
        <Head>
          <title>리디북스 - 숨김목록</title>
        </Head>
        {isEditing ? (
          <EditingBar totalSelectedCount={0} onClickSuccessButton={this.toggleEditingMode} />
        ) : (
          <LNBHiddenTitleBar
            title="숨긴 도서 목록"
            hiddenTotalCount={itemTotalCount}
            onClickEditingMode={this.toggleEditingMode}
            href={URLMap.main.href}
            as={URLMap.main.as}
          />
        )}
        <main>
          <Responsive>
            {this.renderBooks()}
            {this.renderPaginator()}
          </Responsive>
        </main>
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const itemTotalCount = getItemTotalCount(state);
  return {
    pageInfo,
    items,
    books,
    itemTotalCount,
  };
};

export default connect(mapStateToProps)(Hidden);
