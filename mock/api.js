import Mock from 'mockjs';

const demoList = [
    { no: '1293281', name: '星巴克拿铁', amount: 36, status: 1 },
    { no: '1293282', name: '星巴克至臻手冲咖啡', amount: 46, status: 1 },
    { no: '1293283', name: '乡村基大鸡霸', amount: 28, status: 1 },
    { no: '1293284', name: '顺旺基', amount: 19, status: 2 },
    { no: '1293285', name: '阿尼玛', amount: 236, status: 1 },
];
for(let i=0;i<300;i++){
    demoList.push({
        no: Mock.Random.natural(1000,9999999),
        name: Mock.Random.cparagraph(1),
        amount: Mock.Random.float(1,1000),
        status: Mock.Random.integer(1,2)
    })
}

export default {
    'POST /api/demo/list': (req,res)=>{
        const {page_size,page_num} = req.body;
        const total = demoList.length,
            start = (page_num - 1) * page_size,
            end = start + page_size;
        res.send({
            code: 0,
            total,
            data: demoList.slice(start,end),
        })
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
        if(!req.body){
            res.send({
                code:'100',
                data:[],
                msg:'参数不能为空'
            });
            return;
        }
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
        if(!found){
            res.send({
                code:'101',
                data:[],
                msg:'数据不存在'
            });
            return;
        }
        Object.assign(found,req.body);
        res.send({
            code:'0',
            data:demoList
        })
    }
};
