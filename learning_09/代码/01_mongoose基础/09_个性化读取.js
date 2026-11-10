//1. 安装 mongoose
//2. 导入 mongoose
const mongoose = require('mongoose');

//设置 strictQuery 为 true
mongoose.set('strictQuery', true);

//3. 通过 SSH 隧道连接云服务器上的 MongoDB
// 本地 127.0.0.1:27018 由 SSH 转发到云服务器的 127.0.0.1:27017。
mongoose
  .connect('mongodb://127.0.0.1:27018/bilibili', {
    user: 'mongo_admin',
    pass: 'wskygx2025$',
    authSource: 'admin', // 用户在 admin 中认证，业务数据使用 bilibili 数据库
    serverSelectionTimeoutMS: 5000
  })
  .catch((err) => {
    console.error('初次连接 MongoDB 失败：', err.message);
    process.exitCode = 1;
  });

//4. 设置回调
// 设置连接成功的回调  once 一次   事件回调函数只执行一次
mongoose.connection.once('open', () => {
  //5. 创建文档的结构对象
  //设置集合中文档的属性以及属性值的类型
  let BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    price: Number,
    is_hot: Boolean
  });

  //6. 创建模型对象  对文档操作的封装对象    mongoose 会使用集合名称的复数, 创建集合
  let BookModel = mongoose.model('novel', BookSchema);

  //7. 设置字段        这里的select是选择的意思，这是name和author是1，表示查询出来的对象只显示name和author这两个属性。其他属性不需要展示出来。另外一点就是默认情况下ID会自动展示出来，如果一定要让ID不展示，那就必须显式指定 _id是0，这种情况下，ID才不会展示出来。但其实大多数情况下，ID都一定是要查询出来的。

  // BookModel.find().select({name: 1, author: 1, _id: 0}).exec((err, data) => {
  //   if(err) {
  //     console.log('查询失败~~');
  //     return;
  //   }
  //   console.log(data);
  // })

  //数据排序   这里是价格降序排列
  // BookModel.find().select({name: 1, price: 1, _id: 0}).sort({price: -1}).exec((err, data) => {
  //   if(err) {
  //     console.log('查询失败~~');
  //     return;
  //   }
  //   console.log(data);
  // })

  //数据的截取   这里是取排序中的第3～第5名，因为skip了前两个
  BookModel.find()
  .select({name: 1, price: 1, _id: 0})
  .sort({price: -1})
  .skip(2)
  .limit(3)
  .exec((err, data) => {
    if(err) {
      console.log('查询失败~~');
      return;
    }
    console.log(data);
  })

});

// 设置连接错误的回调
mongoose.connection.on('error', () => {
  console.log('连接失败');
});

//设置连接关闭的回调
mongoose.connection.on('close', () => {
  console.log('连接关闭');
});

