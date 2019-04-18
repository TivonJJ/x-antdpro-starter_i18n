'use strict';
import React, { Fragment } from 'react';
import { Button, Icon, message, Modal, Spin, Upload } from 'antd';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { FormattedMessage,formatMessage } from 'umi/locale';
import { joinPath } from '@/utils';
import styles from './index.less';
import controllable from "@/components/react-controllables";

// 上传场景，标识上传文件是用于什么的
const Scene = {
    LZ_QR_LOGO : 1,// 立招二维码logo图片
    LZ_QR_BLANK : 2,// 立招二维码白码
    BUSINESS_LICENSE : {fileType:3,ocrType:1}, // 商户/代理商营业执照照片
    LEGAL_IDCARD : {fileType:4,ocrType:2}, // 法人证件照
    CERTIFICATE_OF_PUBLIC_ACCOUNT : 5, // 对公账户开户证明
    BANK_CARD: {fileType:6,ocrType:3}, //银行卡照片
    AUTHORIZER_IDCARD : {fileType:7,ocrType:2}, // 授权人身份证照片
    ATTORNEY4AUTHORIZED_SETTLEMENT: 8,//授权结算委托书
    SHOP_ENVIRONMENT :9,//店铺环境照片
    PARTNER_DISTRIBUTION_AGREEMENT:10,//合作伙伴合作/分润协议
};

@controllable(['value'])
class FileUploader extends React.Component {
    state = {
        uploading : false,
    };

    static propTypes = {
        scene : PropTypes.oneOfType([PropTypes.number,PropTypes.object]),
        allowFileExt : PropTypes.array,
        maxFileSize : PropTypes.number,
        action: PropTypes.string
    };

    static defaultProps = {
        name : 'file_data',
        onError : (err) =>{message.error(err.message);},
        action: 'basis/file/upload'
    };

    beforeUpload = (file) =>{
        const { onChange,action,beforeUpload,afterUpload, responseInValue, allowFileExt, maxFileSize, name, scene, data, onError } = this.props;
        if (maxFileSize && file.size/1024 > maxFileSize) {
            onError(new Error(formatMessage({ id : 'Validator.fileSize' },{ size : (maxFileSize/1024)+'M' })));
            return false;
        }
        if(allowFileExt){
            const {name=''} = file;
            const extName = name.substring(name.lastIndexOf('.')+1,name.length);
            const isAllowFile = allowFileExt.find(item=>item.toLowerCase()===extName);
            if (!isAllowFile) {
                onError(new Error(formatMessage({
                    id : 'Validator.limitFileTypes',
                },{ types : allowFileExt.join(',') })));
                return false;
            }
        }
        let sceneCode = scene;
        if(typeof sceneCode === 'object'){
            sceneCode = scene.fileType;
        }
        this.setState({ uploading : true });
        const params = {
            ...data,
            [name] : file,
        };
        if(null != sceneCode){
            params.file_id = sceneCode;
        }
        const formData = new FormData();
        Object.keys(params).map(key =>{
            formData.append(key, params[key]);
        });
        beforeUpload && beforeUpload(file,formData);
        request.post(action, formData).then(res =>{
            onChange && onChange(responseInValue ? res.data[0] : res.data[0].file_key);
            afterUpload && afterUpload(file,formData,res);
            return res.data[0];
        }, err =>{
            onError && onError(err,file);
        }).finally(() =>{
            this.setState({ uploading : false });
        });
        return false;
    };


    render(){
        const { children,onChange, ...restProps } = this.props;
        const { uploading } = this.state;
        return <Upload {...restProps} beforeUpload={this.beforeUpload}>
            {children?
                <Spin spinning={uploading}>{children}</Spin>
                :
                null
            }
        </Upload>;
    }
}

@controllable(['value'])
class ImageUploader extends React.Component {
    state = {
        previewVisible: false,
        OCRScanning:false
    };
    static propTypes = {
        scene : PropTypes.oneOfType([PropTypes.number,PropTypes.object]).isRequired,
        allowFileExt : PropTypes.array,
        maxFileSize : PropTypes.number,
        action: PropTypes.string,
        showAllowFileTypes:PropTypes.bool,
        ocr: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
            callback: PropTypes.func,//回调
            type: PropTypes.number,//图片识别类
            isBack: PropTypes.bool,//是否背面
            buttonText: PropTypes.string,//识别按钮的文字
            extraRequestData: PropTypes.object,//额外的请求参数
            hidden: PropTypes.bool,//是否隐藏识别按钮
            disabled: PropTypes.bool,//是否禁用识别按钮
        })]),
    };
    static defaultProps={
        allowFileExt:['jpg','jpeg','png'],
        showAllowFileTypes:false
    };
    /*isImage=(path)=>{
        if(!path)return false;
        const ext = path.substr(path.lastIndexOf('.')+1).toLowerCase();
        return ['jpg','jpeg','png','bmp','ico'].indexOf(ext) !== -1;
    };*/
    handleChange = (resp,a) =>{
        this.props.onChange(resp.file_key);
    };
    handleRemove=()=>{
        this.props.onChange('');
    };
    handlePreview = (file) => {
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
        let {ocr,scene} = this.props;
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
            Object.keys(data).map(key=>{
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
    render(){
        const { value,ocr,scene,showAllowFileTypes } = this.props;
        const {previewVisible,OCRScanning} = this.state;
        if(!scene)return null;
        const fileList = [];
        let preview = '';
        if(value)preview = joinPath(FileUploader.BaseUrlPath,value);
        if(preview)fileList.push({
            uid: '0',
            status: 'done',
            url: preview,
        });
        const showOCRButton = ocr && value && !ocr.hidden;
        return <Fragment>
            <FileUploader
                {...this.props}
                responseInValue
                onChange={this.handleChange}
                onRemove={this.handleRemove}
                onPreview={this.handlePreview}
                fileList={fileList}
                listType="picture-card"
            >
                {preview ? null:
                    <div>
                        <Icon type="plus" style={{ fontSize : 32, color : '#999' }}/>
                        <div className="ant-upload-text"><FormattedMessage id={'Common.message.upload'}/></div>
                    </div>
                }
            </FileUploader>
            <div style={{clear:'both'}}>
                {showAllowFileTypes&&
                <div className={styles.fileTypeTip}>
                    <FormattedMessage id={'Component.fileUploader.allowTypes'}
                                      values={{types:this.props.allowFileExt.join(',')}}/>
                </div>
                }
                {showOCRButton &&
                <div>
                    <Button type={'button'}
                            loading={OCRScanning}
                            disabled={ocr.disabled}
                            onClick={this.OCRScan}>{ocr.label||'图片信息识别'}</Button>
                </div>
                }
            </div>
            <Modal visible={previewVisible} footer={null} onCancel={this.closePreview}>
                <img style={{ width: '100%' }} src={preview} />
            </Modal>
        </Fragment>;
    }
}

FileUploader.BaseUrlPath = request.getAbsUrl('basis/file/download/');
FileUploader.Image = ImageUploader;
FileUploader.Scene = Scene;


export default FileUploader;
