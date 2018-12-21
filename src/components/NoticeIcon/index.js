import React, { PureComponent } from 'react';
import { Popover, Icon, Badge } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import NoticeList from './NoticeList';


export default class NoticeIcon extends PureComponent {
  static defaultProps = {
    onPopupVisibleChange: () => {},
  };
  static List = NoticeList;
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { className, count, popupAlign, onPopupVisibleChange,children,trigger='click',icon='bell' } = this.props;
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = children;
    const triggerIcon = (
      <span className={noticeButtonClass}>
        <Badge count={count} className={styles.badge}>
          <Icon type={icon} className={styles.icon} />
        </Badge>
      </span>
    );
    if (!notificationBox) {
      return triggerIcon;
    }
    const popoverProps = {};
    if ('popupVisible' in this.props) {
      popoverProps.visible = this.props.popupVisible;
    }
    return (
      <Popover
        placement="bottomRight"
        content={notificationBox}
        popupClassName={styles.popover}
        trigger={trigger}
        arrowPointAtCenter
        popupAlign={popupAlign}
        onVisibleChange={onPopupVisibleChange}
        {...popoverProps}
      >
        {triggerIcon}
      </Popover>
    );
  }
}
