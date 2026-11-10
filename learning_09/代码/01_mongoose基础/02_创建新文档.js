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
  //设置集合里面 文档的属性以及属性值的类型
  let bookSchema = new mongoose.Schema({
    name: String,
    author: String,
    price: Number
  });

  //6. 创建模型对象  对文档操作的封装对象   对文档进行增删改查操作  下面这行代码中的第一个入参，也就是books是MongoDB中的一个Collection的名称。
  let bookModel = mongoose.model('books', bookSchema);

  //7. 新增
  bookModel.create({
    name: '西游记',
    author: '吴承恩',
    price: 19.9
  }, (err, data) => {
    //判断是否有错误
    if(err) {
      console.log(err);
      return;
    }
    //如果没有出错, 则输出插入后的文档对象
    console.log(data);
    //8. 关闭数据库连接 (项目运行过程中, 不会添加该代码)
    mongoose.disconnect();
  });


});

// 设置连接错误的回调
mongoose.connection.on('error', () => {
  console.log('连接失败');
}); 

//设置连接关闭的回调
// mongoose.connection.on('close', () => {
//   console.log('连接关闭');
// }); 

