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


/* const server = http.createServer((request, response) => {
  //获取请求url的路径
  let {pathname} = new URL(request.url, 'http://127.0.0.1');
  if(pathname === '/'){
    //读取文件内容
    let html = fs.readFileSync(__dirname + '/10_table.html');
    response.end(html); //设置响应体
  }else if(pathname === '/index.css'){
    //读取文件内容
    let css = fs.readFileSync(__dirname + '/index.css');
    response.end(css); //设置响应体
  }else if(pathname === '/index.js'){
    //读取文件内容
    let js = fs.readFileSync(__dirname + '/index.js');
    response.end(js); //设置响应体
  }else{
    response.statusCode = 404;
    response.end('<h1>404 Not Found</h1>')
  }
  
}); */

//监听端口, 启动服务
server.listen(9000, () => {
  console.log('服务已经启动....')
});
