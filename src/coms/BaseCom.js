// BaseCom.js   component的基类方法

import React from 'react';
import isEqual from 'lodash.isequal';

class BaseCom extends React.Component {
  constructor(props, context, updater) {
    super(props, context, updater);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const thisProps = this.props || {};
    const thisState = this.state || {};
    nextState = nextState || {};
    nextProps = nextProps || {};

    if (
      Object.keys(thisProps).length !== Object.keys(nextProps).length
        || Object.keys(thisState).length !== Object.keys(nextState).length
    ) {
      return true;
    }

    for (const key in nextProps) {
      if (!isEqual(thisProps[key], nextProps[key])) {
        return true;
      }
    }

    for (const key in nextState) {
      if (!isEqual(thisState[key], nextState[key])) {
        return true;
      }
    }
    return false;
  }
}

export default BaseCom;
