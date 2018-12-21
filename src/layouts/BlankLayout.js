import React from 'react';
import BaseLayout from './BaseLayout';

export default class BlankLayout extends BaseLayout {
    render() {
        return this.props.children
    }
}
