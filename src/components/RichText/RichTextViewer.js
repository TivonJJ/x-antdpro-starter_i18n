import React, {Component} from 'react';
import RichTextEditor from './RichTextEditor';

class RichTextViewer extends Component {

    render() {
        return (
            <div {...this.props}>
                <RichTextEditor
                    value={this.props.value}
                    viewMode
                    disabled
                    className={'no-toolbar'}
                />
            </div>
        );
    }
}

export default RichTextViewer;
