//导入 http 模块
const http = require('http');
const fs = require('fs');

//创建服务对象
const server = http.createServer((request, response) => {
  //异步读取文件：等待期间不会阻塞 Node.js 处理其他请求
  fs.readFile(__dirname + '/10_table.html', (err, html) => {
    if (err) {
      console.error('读取文件失败:', err);
      response.statusCode = 500;
      response.end('Internal Server Error');
      return;
    }

    //文件读取完成后再响应；未指定编码时，html 是一个 Buffer
    response.end(html);
  });
 });

//监听端口, 启动服务
server.listen(9000, () => {
  console.log('服务已经启动....')
});
