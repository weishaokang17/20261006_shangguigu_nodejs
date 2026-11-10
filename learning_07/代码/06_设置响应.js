//导入 express
const express = require('express');

//创建应用对象
const app = express();

//创建路由
app.get('/response', (req, resp) => {
  //原生响应
  // resp.statusCode = 404;
  // resp.statusMessage = 'love';
  // resp.setHeader('xxx', 'yyy');
  // resp.write('hello express ')
  // resp.end('response');

  //express 响应
  // resp.status(500);
  // resp.set('aaa','bbb'); //响应头
  // resp.send('你好 Express');//响应体，写到页面上，类似于前面的resp.write('hello express ')
  
  resp.status(500).set('abc','def').send('这都是 OK 的');
  
});

//监听端口, 启动服务
app.listen(3000, () => {
  console.log('服务已经启动, 端口 3000 正在监听中....')
})