//导入 http 模块
const http = require('http');
//1. 导入 url 模块
const url = require('url');

//创建服务对象
const server = http.createServer((request, response) => {
  //2. 解析 request.url 
  console.log(request.url); //输出 ：  /serarch?arg1=a&arg2=b
  let res = url.parse(request.url, true);
  // let res = url.parse(request.url);
  console.log(res)
  /* 输出：
  Url {
    protocol: null,
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: '?arg1=a&arg2=b',
    query: [Object: null prototype] { arg1: 'a', arg2: 'b' },
    pathname: '/serarch',
    path: '/serarch?arg1=a&arg2=b',
    href: '/serarch?arg1=a&arg2=b'
  }
  */
  console.log(res.query)
  /* 输出：
  [Object: null prototype] { arg1: 'a', arg2: 'b' }
  */

  //路径
  let pathname = res.pathname;
  
  console.log(pathname)
  /* 输出：
    /serarch
  */

  //查询字符串
  let keyword = res.query.arg1;

  console.log(keyword)
  /* 输出：
  a
  */


  response.end('url');
});

//监听端口, 启动服务
server.listen(9000, () => {
  console.log('服务已经启动....')
});
