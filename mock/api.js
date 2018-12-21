const demoList = [
    { no: '1293281', name: '星巴克拿铁', amount: 36, status: 1 },
    { no: '1293282', name: '星巴克至臻手冲咖啡', amount: 46, status: 1 },
    { no: '1293283', name: '乡村基大鸡霸', amount: 28, status: 1 },
    { no: '1293284', name: '顺旺基', amount: 19, status: 2 },
    { no: '1293285', name: '阿尼玛', amount: 236, status: 1 },
];

export default {
    'POST /api/demo/list': {
        code: 0,
        total: demoList.length,
        data: demoList,
    },
    'POST /api/demo/detail': (req, res) => {
        const data = [];
        const found = demoList.find(item => req.body.no == item.no);
        if (found) data.push(found);
        res.send({
            code: 0,
            data,
        });
    },
    'POST /api/demo/insert': (req, res) => {
        if(!req.body)return res.send({
            code:'100',
            data:[],
            msg:'参数不能为空'
        });
        demoList.push({
            name:req.body.name,
            amount: req.body.amount,
            no: Date.now(),
            status:1
        });
        res.send({
            code:'0',
            data:demoList
        })
    },
    'POST /api/demo/update':(req,res)=>{
        const found = demoList.find(item => req.body.no == item.no);
        if(!found)return res.send({
            code:'101',
            data:[],
            msg:'数据不存在'
        });
        Object.assign(found,req.body);
        res.send({
            code:'0',
            data:demoList
        })
    }
};
