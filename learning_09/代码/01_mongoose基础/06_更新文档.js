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

  //7. 更新文档 更新一条   第一个参数是条件  第二个参数是修改的字段以及字段的新内容
  // BookModel.updateOne({name: '红楼梦'}, {price: 9.9}, (err, data) => {
  //   //判断 err 
  //   if(err){
  //     console.log('更新失败~~');
  //     return;
  //   }
  //   //输出 data
  //   console.log(data);
  // });

  //批量更新    第一个参数是条件  第二个参数是修改的字段以及字段的新内容
  BookModel.updateMany({author: '余华'}, {is_hot: true}, (err, data) => {
    //判断 err 
    if(err){
      console.log('更新失败~~');
      return;
    }
    //输出 data
    console.log(data);
  });

});

// 设置连接错误的回调
mongoose.connection.on('error', () => {
  console.log('连接失败');
});

//设置连接关闭的回调
mongoose.connection.on('close', () => {
  console.log('连接关闭');
});

