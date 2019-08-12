import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from "classnames";
import controllable from "@/components/react-controllables";
import Editor from 'wangeditor';
require('./style.less');

const emotions = [
    {
        title: '新浪',
        type: 'image',
        content: [{"alt":"[草泥马]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/shenshou_thumb.gif"},{"alt":"[神马]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/60/horse2_thumb.gif"},{"alt":"[浮云]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/fuyun_thumb.gif"},{"alt":"[给力]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c9/geili_thumb.gif"},{"alt":"[围观]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/wg_thumb.gif"},{"alt":"[威武]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/vw_thumb.gif"},{"alt":"[熊猫]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/panda_thumb.gif"},{"alt":"[兔子]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/81/rabbit_thumb.gif"},{"alt":"[奥特曼]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/otm_thumb.gif"},{"alt":"[囧]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/15/j_thumb.gif"},{"alt":"[互粉]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/hufen_thumb.gif"},{"alt":"[礼物]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c4/liwu_thumb.gif"},{"alt":"[呵呵]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ac/smilea_thumb.gif"},{"alt":"[嘻嘻]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0b/tootha_thumb.gif"},{"alt":"[哈哈]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/laugh.gif"},{"alt":"[可爱]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/14/tza_thumb.gif"},{"alt":"[可怜]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/kl_thumb.gif"},{"alt":"[挖鼻屎]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a0/kbsa_thumb.gif"},{"alt":"[吃惊]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f4/cj_thumb.gif"},{"alt":"[害羞]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/shamea_thumb.gif"},{"alt":"[挤眼]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c3/zy_thumb.gif"},{"alt":"[闭嘴]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/29/bz_thumb.gif"},{"alt":"[鄙视]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/71/bs2_thumb.gif"},{"alt":"[爱你]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/lovea_thumb.gif"},{"alt":"[泪]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9d/sada_thumb.gif"},{"alt":"[偷笑]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/19/heia_thumb.gif"},{"alt":"[亲亲]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8f/qq_thumb.gif"},{"alt":"[生病]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b6/sb_thumb.gif"},{"alt":"[太开心]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/mb_thumb.gif"},{"alt":"[懒得理你]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/17/ldln_thumb.gif"},{"alt":"[右哼哼]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/98/yhh_thumb.gif"},{"alt":"[左哼哼]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/zhh_thumb.gif"},{"alt":"[嘘]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a6/x_thumb.gif"},{"alt":"[衰]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/cry.gif"},{"alt":"[委屈]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/73/wq_thumb.gif"},{"alt":"[吐]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9e/t_thumb.gif"},{"alt":"[打哈欠]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f3/k_thumb.gif"},{"alt":"[抱抱]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/27/bba_thumb.gif"},{"alt":"[怒]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7c/angrya_thumb.gif"},{"alt":"[疑问]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/5c/yw_thumb.gif"},{"alt":"[馋嘴]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a5/cza_thumb.gif"},{"alt":"[拜拜]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/88_thumb.gif"},{"alt":"[思考]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e9/sk_thumb.gif"},{"alt":"[汗]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/24/sweata_thumb.gif"},{"alt":"[困]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7f/sleepya_thumb.gif"},{"alt":"[睡觉]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6b/sleepa_thumb.gif"},{"alt":"[钱]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/90/money_thumb.gif"},{"alt":"[失望]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0c/sw_thumb.gif"},{"alt":"[酷]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/cool_thumb.gif"},{"alt":"[花心]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8c/hsa_thumb.gif"},{"alt":"[哼]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/49/hatea_thumb.gif"},{"alt":"[鼓掌]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/36/gza_thumb.gif"},{"alt":"[晕]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/dizzya_thumb.gif"},{"alt":"[悲伤]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1a/bs_thumb.gif"},{"alt":"[抓狂]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/62/crazya_thumb.gif"},{"alt":"[黑线]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/h_thumb.gif"},{"alt":"[阴险]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/yx_thumb.gif"},{"alt":"[怒骂]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/nm_thumb.gif"},{"alt":"[心]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/hearta_thumb.gif"},{"alt":"[伤心]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ea/unheart.gif"},{"alt":"[猪头]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/pig.gif"},{"alt":"[ok]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d6/ok_thumb.gif"},{"alt":"[耶]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/ye_thumb.gif"},{"alt":"[good]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/good_thumb.gif"},{"alt":"[不要]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c7/no_thumb.gif"},{"alt":"[赞]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d0/z2_thumb.gif"},{"alt":"[来]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/come_thumb.gif"},{"alt":"[弱]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/sad_thumb.gif"},{"alt":"[蜡烛]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/lazu_thumb.gif"},{"alt":"[蛋糕]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/cake.gif"},{"alt":"[钟]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d3/clock_thumb.gif"},{"alt":"[话筒]","src":"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1b/m_thumb.gif"}]
    },
    {
        title: 'emoji',
        type: 'emoji',
        content: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "😊", "😇", "🙂", "🙃", "😉", "😓", "😪", "😴", "🙄", "🤔", "😬", "🤐"]
    }
];

@controllable(['value'])
class RichTextEditor extends Component {
    static propTypes = {
        onInput: PropTypes.func,
        onChange: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        viewMode: PropTypes.bool,
        onInit: PropTypes.func,
    };

    static defaultProps = {
        viewMode: false
    };

    state={
        active:false
    };

    editor = null;

    componentDidMount() {
        const editor = new Editor(this.container);
        this.editor = editor;
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = this.onChange;
        // editor.customConfig.onfocus = this.onFocus;
        // editor.customConfig.onblur = this.onBlur;
        editor.customConfig.colors = [
            '#000000',
            '#eeece0',
            '#1c487f',
            '#4d80bf',
            '#1890ff',
            '#c24f4a',
            '#f44444',
            '#8baa4a',
            '#7b5ba1',
            '#46acc8',
            '#f9963b',
            '#ffd829',
            '#ffffff'
        ];
        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            'video',  // 插入视频
            // 'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ];
        editor.customConfig.emotions = emotions;
        editor.customConfig.zIndex = 10;
        editor.customConfig.pasteFilterStyle = false;
        editor.create();
        editor.$inputElem = editor.$textElem[0];
        editor.$inputElem.addEventListener('focus',this.onFocus);
        editor.$inputElem.addEventListener('blur',this.onBlur);
        this.setContent(this.props.value);
        this.setDisabled(this.props.disabled);
        editor.getData = ()=>this.getValue();
        if(this.props.onInit){
            this.props.onInit(editor);
        }
    }

    componentWillReceiveProps(nextProps) {
        if('value' in nextProps && this.props.value !== nextProps.value){
            this.setContent(nextProps.value);
        }
        if('disabled' in nextProps){
            this.setDisabled(nextProps.disabled);
        }
    }

    componentWillUnmount() {
        this.editor.$inputElem.removeEventListener('focus',this.onFocus);
        this.editor.$inputElem.removeEventListener('blur',this.onBlur);
        this.editor.txt.html('');
    }

    setContent=(html)=>{
        this.editor.txt.html(html);
    };

    setDisabled=(disabled)=>{
        this.editor.$textElem.attr('contenteditable', !disabled)
    };

    onFocus=()=>{
        this.setState({
            active:true
        });
        const {onFocus} = this.props;
        onFocus && onFocus();
    };

    onChange=(html)=>{
        const {onInput} = this.props;
        onInput && onInput(html);
    };

    onBlur=()=>{
        this.setState({
            active:false
        });
        const {onBlur,onChange} = this.props;
        onBlur && onBlur();
        onChange && onChange(this.getValue());
    };

    getValue=()=>{
        let value = this.editor.txt.html();
        const txt = this.editor.txt.text();
        if(!txt)value = '';
        return value;
    };

    render() {
        const {className,style,viewMode} = this.props;
        const cls = classnames(
            'comp-RichText comp-RichTextEditor',
            {'active':this.state.active},
            {'in-view_mode':viewMode},
            className
        );
        return (
            <div
                className={cls}
                style={style}
                ref={ref=>{this.container=ref}}
            />
        );
    }
}

export default RichTextEditor;
