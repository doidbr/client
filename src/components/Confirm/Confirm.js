import React from 'react';
import classNames from 'classnames';
import { string, func, node } from 'prop-types';
import { noop } from 'lodash';

import Modal from '../Modal';
import Button from '../Forms/Button';
import defaultImage from '../../images/modal-request-icon.png';
import styles from './Confirm.scss';

export default class Confirm extends React.Component {
  static propTypes = {
    className: string,
    children: node,
    title: string.isRequired,
    image: string,
    confirmLabel: string,
    cancelLabel: string,
    onConfirm: func,
    onCancel: func
  };

  static defaultProps = {
    className: null,
    children: null,
    image: defaultImage,
    confirmLabel: 'OK',
    cancelLabel: 'Cancel',
    onConfirm: noop,
    onCancel: noop
  };

  componentDidMount() {
    this.confirm.focus();
  }

  render() {
    const {
      className,
      image,
      title,
      confirmLabel,
      cancelLabel,
      onConfirm,
      onCancel,
      children
    } = this.props;

    return (
      <Modal className={classNames(styles.confirm, className)}>
        <div className={styles.media}>
          <img src={image} width="200" alt="Icon" />
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            {title}
          </div>
          <div className={styles.body}>
            {children}
          </div>
          <div className={styles.actions}>
            <Button className={styles.action} ref={this.registerRef('confirm')} onClick={onConfirm}>
              {confirmLabel}
            </Button>
            <Button className={classNames(styles.action, styles.cancel)} onClick={onCancel}>
              {cancelLabel}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  registerRef = (name) => {
    return (el) => { this[name] = el; };
  }
}
