import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SensitiveText extends PureComponent {
    static propTypes={
        content: PropTypes.string
    };

    render() {
        const {content=''} = this.props;
        if(!content)return null;
        return `${content.substr(0,3)  }******${  content.substr(content.length-3,3)}`;
    }
}

export default SensitiveText;
