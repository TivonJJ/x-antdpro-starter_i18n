/* eslint-disable react/no-multi-comp */
import React, { Fragment } from 'react';
import { Button, Icon, message, Modal, Spin, Upload } from 'antd';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { FormattedMessage,formatMessage } from 'umi/locale';
import { joinPath } from '@/utils';
import classnames from 'classnames';
import styles from './index.less';
import controllable from "@/components/react-controllables";

// 上传场景，标识上传文件是用于什么的
const Scene = {
    LZ_QR_LOGO : 1,// 立招二维码logo图片
    LZ_QR_BLANK : 2,// 立招二维码白码
    BUSINESS_LICENSE : {fileType:3,ocrType:1}, // 商户/代理商营业执照照片
    LEGAL_IDCARD : {fileType:4,ocrType:2}, // 法人证件照
    CERTIFICATE_OF_PUBLIC_ACCOUNT : 5, // 对公账户开户证明
    BANK_CARD: {fileType:6,ocrType:3}, // 银行卡照片
    AUTHORIZER_IDCARD : {fileType:7,ocrType:2}, // 授权人身份证照片
    ATTORNEY4AUTHORIZED_SETTLEMENT: 8,// 授权结算委托书
    SHOP_ENVIRONMENT :9,// 店铺环境照片
    PARTNER_DISTRIBUTION_AGREEMENT:10,// 合作伙伴合作/分润协议
    MER_ADDITIONAL_INFO:11, // 商户附加资料
    EXPENDITURE_BILL_ADJUSTMENT:12, // 分润账单调差文件
};

@controllable(['value'])
class FileUploader extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        scene : PropTypes.oneOfType([PropTypes.number,PropTypes.string,PropTypes.object]),
        allowFileExt : PropTypes.array,
        maxFileSize : PropTypes.number,
        action: PropTypes.string,
        autoUpload: PropTypes.bool,
        wrappedComponentRef: PropTypes.func,
        showLoading: PropTypes.bool,
        onFileSelect: PropTypes.func,
        onError: PropTypes.func,
        showUploadList: PropTypes.bool
    };

    static defaultProps = {
        name : 'file_data',
        onError : (err) =>{message.error(err.message);},
        action: 'basis/file/upload',
        autoUpload: true,
        showLoading: true,
        showUploadList: false,
        onFileSelect(){},
        wrappedComponentRef:null,
        maxFileSize:null,
        allowFileExt:null,
        scene:undefined
    };

    state = {
        uploading : false,
        file:null
    };

    componentDidMount() {
        if(this.props.wrappedComponentRef)this.props.wrappedComponentRef(this)
    }

    beforeUpload = () =>{
        const {autoUpload,onError} = this.props;
        if(autoUpload){
            setTimeout(()=>{
                this.upload().catch(({error})=>{
                    onError(error)
                });
            })
        }
        return false;
    };

    handleChange=({file,fileList})=>{
        const {onFileSelect} = this.props;
        this.setState({file});
        if(onFileSelect)onFileSelect(file,fileList);
    };

    check=()=>{
        const {allowFileExt, maxFileSize} = this.props;
        const {file} = this.state;
        if(!file)throw new Error('无待上传文件');
        if (maxFileSize && file.size/1024 > maxFileSize) {
            throw new Error(formatMessage({ id : 'Validator.fileSize' },{ size : `${maxFileSize/1024}M` }));
        }
        if(allowFileExt){
            const {name=''} = file;
            const extName = name.substring(name.lastIndexOf('.')+1,name.length);
            const isAllowFile = allowFileExt.find(item=>item.toLowerCase()===extName);
            if (!isAllowFile) {
                throw new Error(formatMessage({
                    id : 'Validator.limitFileTypes',
                },{ types : allowFileExt.join(',') }));
            }
        }
    };

    upload=()=>{
        const {file} = this.state;
        const {onChange,action,beforeUpload,afterUpload, responseInValue, name, scene, data} = this.props;
        try{
            this.check();
        }catch (error) {
            const err = {error,file};
            return Promise.reject(err);
        }
        let sceneCode = scene;
        if(typeof sceneCode === 'object'){
            sceneCode = scene.fileType;
        }
        const params = {...data};
        if(sceneCode != null){
            params.file_id = sceneCode;
        }
        const formData = new FormData();
        Object.keys(params).forEach(key =>{
            formData.append(key, params[key]);
        });
        formData.append(name,file);
        beforeUpload && beforeUpload(file,formData);
        this.setState({ uploading : true });
        return new Promise((resolve, reject) => {
            request.post(action, formData).then(res =>{
                const response = res.data[0] || {};
                onChange && onChange(responseInValue ? response : response.file_key);
                afterUpload && afterUpload(file,formData,res);
                file.status = 'done';
                resolve(response);
            }, error =>{
                file.status = 'error';
                file.response = error.message;
                const err= {error,file};
                reject(err)
            }).finally(() =>{
                this.setState({ uploading : false });
            });
        });
    };

    handleRemove=()=>{
        if(this.state.file){
            this.setState({file:null})
        }else {
            this.props.onChange('');
        }
    };

    render(){
        const { children,onChange,showLoading, ...restProps } = this.props;
        const { uploading,file } = this.state;
        const fileList = [];
        if (file) {
            fileList.push(file);
        } else if (restProps.value) {
            fileList.push({
                uid: restProps.value,
                status: 'done',
                // url: joinPath(FileUploader.BaseUrlPath,restProps.value),
                name: restProps.value,
            });
        }
        return (
            <Upload
                {...restProps}
                fileList={fileList}
                onChange={this.handleChange}
                onRemove={this.handleRemove}
                beforeUpload={this.beforeUpload}
            >
                {children?
                    <Spin spinning={showLoading&&uploading}>{children}</Spin>
                    :
                    null
                }
            </Upload>
        )
    }
}

@controllable(['value'])
class Image extends React.Component {
    state = {
        previewVisible: false,
        OCRScanning: false,
        fileList: []
    };

    static propTypes = {
        scene : PropTypes.oneOfType([PropTypes.number,PropTypes.string,PropTypes.object]).isRequired,
        allowFileExt : PropTypes.array,
        maxFileSize : PropTypes.number,
        action: PropTypes.string,
        showAllowFileTypes:PropTypes.bool,
        ocr: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
            callback: PropTypes.func,// 回调
            type: PropTypes.number,// 图片识别类
            isBack: PropTypes.bool,// 是否背面
            buttonText: PropTypes.string,// 识别按钮的文字
            extraRequestData: PropTypes.object,// 额外的请求参数
            hidden: PropTypes.bool,// 是否隐藏识别按钮
            disabled: PropTypes.bool,// 是否禁用识别按钮
        })]),
    };

    static defaultProps={
        maxFileSize:null,
        allowFileExt:['jpg','jpeg','png'],
        showAllowFileTypes:false,
        action:undefined,
        ocr:null
    };

    /* isImage=(path)=>{
        if(!path)return false;
        const ext = path.substr(path.lastIndexOf('.')+1).toLowerCase();
        return ['jpg','jpeg','png','bmp','ico'].indexOf(ext) !== -1;
    }; */
    handleChange = (resp) =>{
        this.props.onChange(resp.file_key);
    };

    handleRemove=()=>{
        this.setState({fileList:[]});
        this.props.onChange('');
    };

    handlePreview = (/*file*/) => {
        // if(!this.isImage(file.url)){
        //     window.open(file.url)
        // }else {
            this.setState({
                previewVisible: true,
            });
        // }
    };

    closePreview=()=>{
        this.setState({
            previewVisible: false,
        });
    };

    OCRScan=()=>{
        const {scene} = this.props;
        let {ocr} = this.props;
        if(typeof ocr==='function'){
            ocr = {callback:ocr};
        }
        const {
            type=scene.ocrType,
            extraRequestData,
            isBack,
            callback=()=>{},
        } = ocr;
        this.setState({OCRScanning:true});
        const params = {
            file_key: this.props.value,
            image_type:type,
            is_font: isBack?0:1,
            ...extraRequestData,
        };
        return request.post('basis/ocr/paper',params).then(res=>{
            const data = res.data[0] || {};
            Object.keys(data).forEach(key=>{
                if(!data[key] || data[key] === '无'){
                    delete data[key]
                }
            });
            callback(null,data,params);
        },err=>{
            callback(err,null,params)
        }).finally(()=>{
            this.setState({OCRScanning:false});
        });
    };

    handleFileSelect=(file)=>{
        this.setState({fileList:[file]})
    };

    render(){
        const { value,ocr,scene,showAllowFileTypes,className } = this.props;
        const {previewVisible,OCRScanning} = this.state;
        let {fileList} = this.state;
        if(!scene)return null;
        let preview = '';
        if(value){
            preview = joinPath(FileUploader.BaseUrlPath,value);
            fileList = [{
                uid: '0',
                status: 'done',
                url: preview,
            }]
        }
        const showOCRButton = ocr && value && !ocr.hidden;
        const disabled = !!preview || this.props.disabled;
        return (
            <Fragment>
                <FileUploader
                    {...this.props}
                    className={classnames(styles.imgUploader,{[styles.disabled]:disabled},className)}
                    responseInValue
                    onChange={this.handleChange}
                    onRemove={this.handleRemove}
                    onPreview={this.handlePreview}
                    onFileSelect={this.handleFileSelect}
                    disabled={disabled}
                    listType={"picture-card"}
                >
                    {preview ?
                        <div className={styles.previewBox}>
                            <a
                                className={styles.thumbnail}
                                href={preview}
                                target={'_blank'}
                                // ref={'noopener noreferrer'}
                            >
                                <img alt={''} src={preview}/>
                            </a>
                            <div className={styles.actions}>
                                <a
                                    target={'_blank'}
                                    title={'预览文件'}
                                    onClick={()=>this.handlePreview(fileList[0])}
                                >
                                    <Icon type={'eye-o'}/>
                                </a>
                                <a
                                    target={'_blank'}
                                    title={'删除文件'}
                                    onClick={()=>this.handleRemove(fileList[0])}
                                >
                                    <Icon type={'delete'}/>
                                </a>
                            </div>
                        </div>
                        :
                        <div>
                            <Icon type={"plus"} style={{ fontSize: 32, color: '#999' }}/>
                            <div className={"ant-upload-text"}><FormattedMessage id={'Common.message.upload'}/></div>
                        </div>
                    }
                </FileUploader>
                <div style={{clear:'both'}}>
                    {showAllowFileTypes&&
                    <div className={styles.fileTypeTip}>
                        <FormattedMessage
                            id={'Component.fileUploader.allowTypes'}
                            values={{types:this.props.allowFileExt.join(',')}}
                        />
                    </div>
                    }
                    {showOCRButton &&
                    <div>
                        <Button
                            type={'button'}
                            loading={OCRScanning}
                            disabled={ocr.disabled}
                            onClick={this.OCRScan}
                        >{ocr.label||'图片信息识别'}
                        </Button>
                    </div>
                    }
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.closePreview}>
                    <img alt={''} style={{ width: '100%' }} src={preview} />
                </Modal>
            </Fragment>
        );
    }
}

FileUploader.BaseUrlPath = request.getAbsUrl('basis/file/download/');
FileUploader.Image = Image;
FileUploader.Scene = Scene;


export default FileUploader;
