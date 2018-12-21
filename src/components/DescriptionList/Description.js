import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col } from 'antd';
import styles from './index.less';
import responsive from './responsive';

const Description = ({ small,term, column, className, children,emptyContent='--', ...restProps }) => {
  const clsString = classNames(styles.description, className);
  return (
    <Col className={clsString} {...responsive[column]} {...restProps}>
      {term && <div style={{paddingBottom:small?6:16}} className={styles.term}>{term}</div>}
      <div style={{paddingBottom:small?6:16}} className={styles.detail}>{children||emptyContent}</div>
    </Col>
  );
};

Description.defaultProps = {
  term: '',
};

Description.propTypes = {
  term: PropTypes.node,
};

export default Description;
