//导入 express
const express = require('express');

//创建应用对象
const app = express();

//创建路由   
app.get('/:id.html', (req, res) => {
  //获取 URL 路由参数    这次测试时浏览器完整url: http://localhost:3000/479.html
  console.log(req.params.id);//输出 479
  res.setHeader('content-type','text/html;charset=utf-8');
  res.end('商品详情');
});


//监听端口, 启动服务
app.listen(3000, () => {
  console.log('服务已经启动, 端口 3000 正在监听中....')
})