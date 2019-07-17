/* eslint-disable react/no-multi-comp */
import React, {Component, Fragment} from 'react';
import Viewer from 'react-viewer';
import PropTypes from 'prop-types';
import 'react-viewer/dist/index.css';

class Item extends React.Component {
    static propTypes = {
        src: PropTypes.string,
        alt: PropTypes.string,
        downloadUrl: PropTypes.string,
        defaultSize: PropTypes.object,
    };

    static contextTypes = {
        photoViewerGroup: PropTypes.any,
    };

    $key = Date.now() + Math.random();

    componentWillMount() {
        const {context,props} = this;
        const {photoViewerGroup} = context;
        if(photoViewerGroup){
            photoViewerGroup.add({
                src:props.src,
                alt:props.alt,
                downloadUrl:props.downloadUrl,
                defaultSize:props.defaultSize,
                $key:this.$key
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.src !== nextProps.src
            || this.props.alt !== nextProps.alt
            || this.props.downloadUrl !== nextProps.downloadUrl
            || this.props.defaultSize !== nextProps.defaultSize){
            const {photoViewerGroup} = this.context;
            if(photoViewerGroup){
                photoViewerGroup.set({
                    src:nextProps.src,
                    alt:nextProps.alt,
                    downloadUrl:nextProps.downloadUrl,
                    defaultSize:nextProps.defaultSize,
                    $key:this.$key
                })
            }
        }
    }

    componentWillUnmount() {
        const {photoViewerGroup} = this.context;
        if(photoViewerGroup){
            photoViewerGroup.remove(this.$key)
        }
    }

    onClick=(...args)=>{
        const {onClick} = this.props;
        const {photoViewerGroup} = this.context;
        if(photoViewerGroup){
            photoViewerGroup.showViewer(this.$key)
        }
        if(onClick)onClick(...args)
    };

    render() {
        const {src,children,...resetProps} = this.props;
        if(children && (src==null || src===''))return children;
        return <img alt={''} src={src} {...resetProps} onClick={this.onClick}/>
    }
}

class PhotoViewer extends Component {
    state={
        visible:false,
        activeIndex:0,
        images:[],
    };

    static childContextTypes = {
        photoViewerGroup: PropTypes.any,
    };

    getChildContext() {
        return {
            photoViewerGroup: {
                add:(image)=>{
                    const {images} = this.state;
                    images.push(image);
                    this.setState({images:[...images]})
                },
                remove:(key)=>{
                    const index = this.state.images.findIndex(item=>item.$key===key);
                    const {images} = this.state;
                    images.splice(index,1);
                    this.setState({images:[...images]})
                },
                set:(image)=>{
                    const index = this.state.images.findIndex(item=>item.$key===image.$key);
                    if(index<0)return;
                    const {images} = this.state;
                    images[index] = {...images[index],...image};
                    this.setState({images:[...images]});
                },
                showViewer:(key)=>{
                    let index = 0;
                    if(key)index = this.state.images.findIndex(item=>item.$key===key);
                    if(this.props.beforeOpen){
                        this.props.beforeOpen(index,key);
                    }
                    setTimeout(()=>{
                        this.openViewer(Math.max(0,index));
                        if(this.props.afterOpen){
                            this.props.afterOpen(index,key);
                        }
                    })
                }
            },
        };
    }

    openViewer=(index)=>{
        this.setState({visible:true,activeIndex:index})
    };

    closeViewer=()=>{
        this.setState({visible:false})
    };

    onViewerMounted=(instance)=>{
        const {className} = this.props;
        if(instance && className){
            const container = instance.container || instance.defaultContainer;
            if(container)container.className += ` ${className}`
        }
    };

    render() {
        const {children,...resetProps} = this.props;
        return (
            <Fragment>
                {children}
                <Viewer
                    visible={this.state.visible}
                    activeIndex={this.state.activeIndex}
                    onClose={this.closeViewer}
                    images={this.state.images}
                    ref={this.onViewerMounted}
                    {...resetProps}
                />
            </Fragment>
        );
    }
}

PhotoViewer.Item = Item;
export default PhotoViewer;
