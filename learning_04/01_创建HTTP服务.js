//1. 导入 http 模块
const http = require('http');

//2. 创建服务对象
const server = http.createServer((request, response) => {
  response.setHeader('content-type', 'text/html;charset=utf-8')//设置响应头 
  response.end('你好'); //设置响应体
})

//3. 监听端口, 启动服务
server.listen(9000, () => {
  console.log('服务已经启动....')
})

/*
 * http.createServer 的请求处理回调函数说明：
 *
 * 1. 当前传入的是一个函数，称为请求处理回调函数（requestListener）。
 *    Node.js 会将它注册为服务器的 'request' 事件监听器。
 *    收到请求时，Node.js 才会调用它；创建服务器时不会立即执行它。
 * 
 * 2. Node.js 调用这个函数时，会按固定顺序传入两个对象：
 *    第一个：请求对象（http.IncomingMessage），用于读取请求地址、方法、请求头等。
 *    第二个：响应对象（http.ServerResponse），用于设置响应头、发送内容、结束响应等。
 *
 * 3. 参数名称可以自定义，参数接收到的对象由位置决定。
 *    (request, response)、(req, res)、(a, b) 都可以。
 *    即使写成 (response, request)，第一个仍然接收请求对象，第二个仍然接收响应对象。
 *    通常使用 (req, res) 或 (request, response)，方便阅读。
 *
 * 4. 函数不必恰好声明两个参数。
 *    JavaScript 允许调用时传入的实参数量与函数声明的形参数量不同。
 *    声明零个、一个或两个参数，在语法上都可以。
 *    如果需要使用第二个响应对象，通常写成 (req, res)，不用 req 也可以保留它的位置。
 *    注意：只写 (res) 时，res 接收到的是第一个请求对象，而不是响应对象。
 *
 * 5. 箭头函数、普通函数、提前定义好的函数都可以作为回调函数。
 *    例如：
 *    function handleRequest(req, res) {
 *      res.end('你好');
 *    }
 *    const server = http.createServer(handleRequest);
 *    这里传入的是函数本身，不要写成 handleRequest()。
 *    handleRequest() 表示立即执行函数，再把执行结果传给 createServer。
 *
 * 6. 回调函数不需要返回特定的值。
 *    return '你好' 不会把文字发送给浏览器。
 *    应通过响应对象发送内容并结束响应，例如 response.end('你好')。
 *
 * 官方文档：https://nodejs.org/docs/latest-v24.x/api/http.html#httpcreateserveroptions-requestlistener
 */
