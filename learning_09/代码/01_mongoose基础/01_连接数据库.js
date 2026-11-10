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
// 设置连接成功的回调  once 一次   事件回调函数只执行一次(例如中间mongoDB掉线了，但后面又连上，那么once只执行一次，但on会再执行一次，这种情况，最好使用once只执行一次，例如如果方法中有listen监听端口的方法，这时会监听多次)
mongoose.connection.once('open', () => { //注意，这一行代码是once，不是on
  console.log('连接成功');
  // app.listen(8080);
});

// 设置连接错误的回调
mongoose.connection.on('error', () => {
  console.log('连接失败');
}); 

//设置连接关闭的回调
mongoose.connection.on('close', () => {
  console.log('连接关闭');
}); 

//关闭 mongodb 的连接
setTimeout(() => {
  mongoose.disconnect();
}, 2000)
