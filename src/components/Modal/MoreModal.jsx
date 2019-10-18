import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, ModalButtonItem, ModalItemGroup, ModalLinkItem } from '.';
import { URLMap } from '../../constants/urls';
import ViewType from '../../constants/viewType';
import { confirmHideAllExpiredBooks } from '../../services/purchased/common/actions';
import { setViewType } from '../../services/ui/actions';
import { makeLinkProps } from '../../utils/uri';

const MoreModal = ({
  orderOptions,
  orderType,
  orderBy,
  isActive,
  query,
  onClickModalBackground,
  viewType,
  dispatchSetViewType,
  dispatchConfirmHideAllExpiredBooks,
  showViewType,
  showOrder,
  showHidden,
  location,
}) => (
  <Modal isActive={isActive} a11y="옵션" onClickModalBackground={onClickModalBackground}>
    {showViewType ? (
      <ModalItemGroup groupTitle="보기 방식">
        <ul>
          <li>
            <ModalButtonItem
              isSelected={viewType === ViewType.PORTRAIT}
              onClick={() => {
                onClickModalBackground();
                dispatchSetViewType(ViewType.PORTRAIT);
              }}
            >
              표지만 보기
            </ModalButtonItem>
          </li>
          <li>
            <ModalButtonItem
              isSelected={viewType === ViewType.LANDSCAPE}
              onClick={() => {
                onClickModalBackground();
                dispatchSetViewType(ViewType.LANDSCAPE);
              }}
            >
              목록 보기
            </ModalButtonItem>
          </li>
        </ul>
      </ModalItemGroup>
    ) : null}
    {showOrder ? (
      <ModalItemGroup groupTitle="정렬 순서">
        <ul>
          {orderOptions.map(option => {
            const { to } = makeLinkProps({}, URLMap.main.as, { ...query, orderType: option.orderType, orderBy: option.orderBy });
            return (
              <li key={option.key}>
                <ModalLinkItem isSelected={option.orderType === orderType && option.orderBy === orderBy} to={to} replace>
                  {option.title}
                </ModalLinkItem>
              </li>
            );
          })}
        </ul>
      </ModalItemGroup>
    ) : null}
    {showHidden ? (
      <ModalItemGroup groupTitle="숨김 메뉴">
        <ModalButtonItem
          onClick={() => {
            onClickModalBackground();
            dispatchConfirmHideAllExpiredBooks();
          }}
        >
          만료 도서 모두 숨기기
        </ModalButtonItem>
        <ModalLinkItem
          to={{
            pathname: URLMap.hidden.as,
            state: {
              backLocation: location,
            },
          }}
        >
          숨긴 도서 목록
        </ModalLinkItem>
      </ModalItemGroup>
    ) : null}
  </Modal>
);

const mapStateToProps = state => ({
  viewType: state.ui.viewType,
});

const mapDispatchToProps = {
  dispatchSetViewType: setViewType,
  dispatchConfirmHideAllExpiredBooks: confirmHideAllExpiredBooks,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(MoreModal),
);
