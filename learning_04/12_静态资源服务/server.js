/**
 * 创建一个 HTTP 服务，端口为 9000，满足如下需求
 * GET  /index.html        响应  page/index.html 的文件内容
 * GET  /css/app.css       响应  page/css/app.css 的文件内容
 * GET  /images/logo.png   响应  page/images/logo.png 的文件内容
 */
//导入 http 模块
const http = require('http');
const fs = require('fs');
const path = require('path');
//声明一个变量
let mimes = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  json: 'application/json'
}

//创建服务对象
const server = http.createServer((request, response) => {
  if(request.method !== 'GET'){
    response.statusCode = 405;
    response.end('<h1>405 Method Not Allowed</h1>');
    return;
  }
  //获取请求url的路径
  let {pathname} = new URL(request.url, 'http://127.0.0.1');
  //声明一个变量  网站根目录
  let root = __dirname + '/page';
  // let root = __dirname + '/../';
  //拼接文件路径
  let filePath = root + pathname;
  //读取文件 fs 异步 API
  fs.readFile(filePath, (err, data) => {
    if(err){
      console.log(err);
      //设置字符集
      response.setHeader('content-type','text/html;charset=utf-8');
      //判断错误的代号
      switch(err.code){
        case 'ENOENT':
          response.statusCode = 404;
          response.end('<h1>404 Not Found</h1>');
        case 'EPERM':
          response.statusCode = 403;
          response.end('<h1>403 Forbidden</h1>');
        default:
          response.statusCode = 500;
          response.end('<h1>Internal Server Error</h1>');
      }
      
      return;
    }


    //获取文件的后缀名
    let ext = path.extname(filePath).slice(1);
    //获取对应的类型
    let type = mimes[ext];
    if(type){
      //匹配到了                          text/html;charset=utf-8
      if(ext === 'html'){
        response.setHeader('content-type', type + ';charset=utf-8');
      }else{
        response.setHeader('content-type', type);
      }
    }else{
      //没有匹配到
      response.setHeader('content-type', 'application/octet-stream');
    }
    //响应文件内容
    response.end(data);
  })
  
})

//监听端口, 启动服务
server.listen(9000, () => {
  console.log('服务已经启动....')
});
/*
 * 问题：为什么扩展名没有在 mimes 中匹配到时，
 * 要固定把 Content-Type 设置为 application/octet-stream？
 *
 * 1. “没有匹配到”不等于文件不存在，而是类型表里没有对应的记录。
 *    执行到这里时，文件已经成功读取。例如 readme.txt 确实存在，
 *    但当前 mimes 没有配置 txt，所以 mimes['txt'] 得到 undefined，
 *    程序就会进入 else 分支。没有扩展名的文件也会进入这个分支。
 *
 * 2. application/octet-stream 是约定好的通用 MIME 类型，作为兜底使用。
 *    octet 表示 8 位数据（一个字节），stream 表示流。
 *    它表达的是：“这是一些字节数据，但我目前无法确定它的具体格式。”
 *    因此，这里固定的是“类型未知时的处理规则”，并不是随意指定类型。
 *
 * 3. 不知道具体类型，仍然可以发送文件内容。
 *    fs.readFile 未指定编码时，读取结果 data 是保存原始字节的 Buffer。
 *    Content-Type 只是告诉浏览器如何理解内容，response.end(data) 才发送内容。
 *    设置响应头不会转换文件格式，也不会改变文件的原始字节。
 *
 * 4. 为什么不统一设置成 text/plain 或 text/html？
 *    因为未匹配的文件也可能是 图片、压缩包等，不能直接认定它是文本或网页。
 *    使用 application/octet-stream，可以在未知具体格式时提供通用描述。
 *    如果已知文件类型，应补充正确的映射，例如在 mimes 中添加 txt: 'text/plain'，
 *    之后请求 .txt 文件就能匹配成功，不再使用这个兜底类型。
 *
 * 5. 浏览器直接访问这种类型的资源时，通常会将它作为下载处理。
 *    但具体行为还与请求场景、浏览器和其他响应头有关，不能理解为一定强制下载。
 *    这里的核心目的，是为无法确定类型的文件设置一个通用的 Content-Type。
 */
