import React, { Component } from 'react';

class MultilineText extends Component {
    render() {
        let {text,children,className,style} = this.props;
        if(text===undefined)text = children;
        const lines = text.split(/\n/);
        return (
            <div className={className} style={style}>
                {lines.map((text,index)=>(
                    <div key={index}>{text}</div>
                ))}
            </div>
        );
    }
}

export default MultilineText;
