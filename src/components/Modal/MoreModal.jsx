import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, ModalButtonItem, ModalItemGroup, ModalLinkItem } from '.';
import { URLMap } from '../../constants/urls';
import ViewType from '../../constants/viewType';
import { confirmHideAllExpiredBooks } from '../../services/purchased/common/actions';
import { setViewType } from '../../services/ui/actions';
import { makeLinkProps } from '../../utils/uri';

const MoreModal = ({
  order,
  orderOptions,
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
              title="표지만 보기"
              isSelected={viewType === ViewType.PORTRAIT}
              onClick={() => {
                onClickModalBackground();
                dispatchSetViewType(ViewType.PORTRAIT);
              }}
              replace
            />
          </li>
          <li>
            <ModalButtonItem
              title="목록 보기"
              isSelected={viewType === ViewType.LANDSCAPE}
              onClick={() => {
                onClickModalBackground();
                dispatchSetViewType(ViewType.LANDSCAPE);
              }}
              replace
            />
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
                <ModalLinkItem title={option.title} isSelected={option.key === order} to={to} replace />
              </li>
            );
          })}
        </ul>
      </ModalItemGroup>
    ) : null}
    {showHidden ? (
      <ModalItemGroup groupTitle="숨김 메뉴">
        <ModalButtonItem
          title="만료 도서 모두 숨기기"
          onClick={() => {
            onClickModalBackground();
            dispatchConfirmHideAllExpiredBooks();
          }}
          replace
        />
        <ModalLinkItem
          title="숨긴 도서 목록"
          to={{
            pathname: URLMap.hidden.as,
            state: {
              backLocation: location,
            },
          }}
        />
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
