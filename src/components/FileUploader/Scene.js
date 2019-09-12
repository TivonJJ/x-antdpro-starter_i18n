// 上传场景，标识上传文件是用于什么的
export default {
    LZ_QR_LOGO : 1,// 静态二维码logo图片
    LZ_QR_BLANK : 2,// 静态二维码白码
    BUSINESS_LICENSE : {fileType:3,ocrType:1}, // 商户/代理商营业执照照片
    LEGAL_IDCARD : {fileType:4,ocrType:2}, // 法人证件照
    CERTIFICATE_OF_PUBLIC_ACCOUNT : 5, // 对公账户开户证明
    BANK_CARD: {fileType:6,ocrType:3}, //银行卡照片
    AUTHORIZER_IDCARD : {fileType:7,ocrType:2}, // 授权人身份证照片
    ATTORNEY4AUTHORIZED_SETTLEMENT: 8,//授权结算委托书
    SHOP_ENVIRONMENT :9,//店铺环境照片
    PARTNER_DISTRIBUTION_AGREEMENT:10,//合作伙伴合作/分润协议
    MER_ADDITIONAL_INFO:11, // 商户附加资料
    EXPENDITURE_BILL_ADJUSTMENT:12, //分润账单调差文件
}
