//导入 express
const express = require('express');

//创建应用对象
const app = express();

//创建路由
app.get('/request', (req, res) => {
  //原生操作
  // console.log(req.method);
  // console.log(req.url);
  // console.log(req.httpVersion);
  // console.log(req.headers);



  // //express 操作
  //实际访问的完整URL是: http://localhost:3000/request?arg1=a&arg2=b

  console.log(req.path);//输出 /request
  console.log(req.query);//输出 { arg1: 'a', arg2: 'b' }
  // //获取 ip 
  console.log(req.ip); // 输出 ::1

  //获取请求头中的某一项
  console.log(req.get('host')); //输出 localhost:3000

  res.end('hello express');
});

//监听端口, 启动服务
app.listen(3000, () => {
  console.log('服务已经启动, 端口 3000 正在监听中....')
})