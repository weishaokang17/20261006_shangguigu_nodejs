//导入 http 模块
const http = require('http');

//创建服务对象
const server = http.createServer((request, response) => {
  //1. 设置响应状态码   响应状态码是响应头的一部分
  response.statusCode = 203;
  // response.statusCode = 404;
  //2. 响应状态的描述     这个属性平时较少使用，平时响应状态码的描述和响应码一一对应
  response.statusMessage = 'iloveyou';
  //3. 响应头
  response.setHeader('content-type', 'text/html;charset=utf-8');
  response.setHeader('Server', 'Node.js');
  response.setHeader('myHeader', 'test test test');
  response.setHeader('test', ['a','b','c']); // 这种情况并不是请求头里面有一个test， test的值是一个数组，并不是这样的，而是有三个key都是test的请求头中的键值对，只不过值并不相同，分别是a、 b、 c。

  //4. 响应体的设置    
  response.write('love');
  response.write('love');
  response.write('love');
  response.write('love');
  response.end('love'); //设置响应体
  // response.end('xxx'); //设置响应体
  /*
   * response.write() 和 response.end() 的区别
   *
   * 一、它们的功能是不是基本类似？
   * 两个方法都可以向响应体写入内容，但作用并不完全相同：
   * 1. response.write(内容)：追加一段响应体内容，不结束本次响应。
   * 2. response.end(可选内容)：可以追加最后一段内容，然后结束本次响应。
   * 因此，write() 负责“继续写”，end() 负责“写完并收尾”。
   * 这里的“结束响应”不等于关闭服务器，也不一定关闭底层 TCP 连接；
   * 如果连接可以复用，后续请求仍然可以使用同一条连接。
   *
   * 二、write() 可以调用多少次？
   * 对于同一次响应，write() 可以调用 0 次、1 次或多次，
   * 但写入操作必须发生在响应结束之前。
   * 多次调用时，内容会按写入顺序追加，不会覆盖前面的内容，
   * 也不会自动添加空格或换行。
   *
   * 例如本文件上面的代码：
   *   response.write('love');
   *   response.write('love');
   *   response.write('love');
   *   response.write('love');
   *   response.end('love');
   * 最终响应体是：lovelovelovelovelove
   *
   * 也可以完全不调用 write()，直接写：
   *   response.end('lovelovelovelovelove');
   * 如果只看最终响应体，这两种写法的效果相同。
   *
   * 三、end() 可以不传内容吗？
   * 可以。end() 的内容参数是可选的，它最关键的作用是结束响应。
   * 下面两种写法在响应内容和结束效果上等价：
   *
   * 写法一：
   *   response.write('你好');
   *   response.end();
   *
   * 写法二：
   *   response.end('你好');
   *
   * 如果不需要返回响应体，也可以直接调用：
   *   response.end();
   * 这表示响应体为空，本次响应正常结束，并不是没有响应。
   *
   * 四、end() 可以调用 0 次吗？
   * 要区分“代码中没有显式调用”和“响应始终没有结束”。
   *
   * 1. 当前这种手动写响应的普通场景：不能省略结束操作。
   *    要正常完成本次响应，就应该最终调用一次 end()。
   *    如果只写 response.write('你好')，之后一直不结束响应，
   *    数据可能已经发送出去，但本次响应仍然没有完成，
   *    客户端通常会继续等待后续数据，直到超时或连接断开。
   *    请求处理回调执行完毕，不会自动替你调用 response.end()。
   *
   * 2. 由其他方法自动结束响应的场景：代码中可以没有显式的 end()。
   *    例如 readableStream.pipe(response)，默认会在可读流正常结束时
   *    自动结束 response，因此不需要再手动调用一次 end()。
   *    这是其他机制替你完成了结束操作，并不是响应不需要结束。
   *
   * 3. 持续推送数据的长时间响应：可以暂时不调用 end()。
   *    例如服务器需要持续向客户端推送消息时，会有意保持响应未结束，
   *    后续继续写入数据；需要正常结束这次响应时，再执行结束操作。
   *
   * 五、end() 可以调用多次吗？
   * 同一个 response 的正常用法是只结束一次，结束后不要再写入内容。
   *
   * 错误示例：
   *   response.end('第一次');
   *   response.end('第二次'); // 已经结束后又尝试写入内容，会产生错误
   *
   * 同样，end() 之后再调用 write() 写入内容也是错误用法。
   * 重复调用不带内容的 end()，在某些情况下可能被忽略，
   * 但不应该依赖这种行为，也不能把它当作可以重复结束响应的理由。
   * 上面的次数都是针对“同一次请求对应的同一个 response”而言；
   * 不同请求会有各自的 response，分别结束各自的响应。
   *
   * 记忆方式：write() 写零次或多次，最后用一次 end() 收尾；
   * end() 自己也可以携带最后一段响应体内容。
   *
   * 官方文档：https://nodejs.org/api/http.html#responseenddata-encoding-callback
   *
   * 六、end() 执行以后，后面还可以有其他代码吗？
   * 可以。response.end() 结束的是“本次 HTTP 响应”，
   * 不会结束当前函数的执行，后面的普通 JavaScript 代码仍然会继续运行。
   *
   * 例如：
   *   response.end('你好');
   *   console.log('这句话仍然会打印');
   *   const result = 1 + 2;
   *   console.log(result); // 3
   *
   * 浏览器收到的是“你好”，console.log() 的输出出现在服务器终端，
   * 不会被追加到浏览器收到的响应体中。
   *
   * 七、end() 后面可以执行哪些操作？
   * 1. 打印日志、计算数据、操作变量。
   * 2. 调用其他函数。
   * 3. 写文件、记录日志、操作数据库等，但仍需要处理这些操作自身的错误。
   * 4. 读取 response 的状态，并不是 end() 后就完全不能使用 response 对象。
   *
   * 例如：
   *   response.end('处理完成');
   *   console.log('请求路径：', request.url);
   *   console.log(response.writableEnded); // true，表示已经调用过 end()
   *
   * 注意：如果某个操作的结果会影响返回给客户端的内容，
   * 应先完成该操作，再根据结果调用 end()。
   * 如果已经发送“处理成功”，后面的操作却失败了，
   * 就无法再把同一次响应修改成“处理失败”。
   *
   * 八、end() 后面不能再执行哪些响应操作？
   * 主要限制：不能继续给同一个响应添加内容，
   * 也不能再修改已经发送的响应头。
   *
   * 以下各行分别展示错误用法，不要当作正常代码一起执行：
   *   response.end('处理完成');
   *   response.write('补充内容'); // 错误：结束后继续写响应体
   *   response.end('再补充一点'); // 错误：结束后再次通过 end() 写响应体
   *   response.setHeader('Content-Type', 'text/plain'); // 错误：修改已发送的响应头
   *   response.removeHeader('Content-Type'); // 错误：删除已发送的响应头
   *   response.writeHead(500); // 错误：再次写入响应头
   *
   * 这些操作会产生相应错误，例如写入已结束的流，或修改已发送的响应头。
   *
   * 还要区分“不报错”和“能改变客户端收到的响应”：
   *   response.end('处理完成');
   *   response.statusCode = 500;
   *
   * 上面的 statusCode 赋值本身通常不会报错，
   * 但已经无法改变客户端收到的状态码，因为响应头早已确定并发送。
   * 同样，之后修改 response.statusMessage 也不能改变这次响应。
   *
   * 注意：修改响应头的截止时间往往比 end() 更早。
   * 第一次 write() 通常就会触发响应头的发送，
   * 因此状态码、状态描述和响应头应该在写入响应体之前设置好。
   *
   * 九、如果希望后面的代码不再执行，应该怎么做？
   * 使用 return 退出当前函数。end() 和 return 各自负责不同的事情：
   *   response.end()：结束本次响应。
   *   return：退出当前函数，跳过函数中后面的普通语句。
   *
   * 例如：
   *   const server = http.createServer((request, response) => {
   *     if (request.url === '/test') {
   *       response.end('这是 test 页面');
   *       return; // 退出当前请求处理函数
   *     }
   *     response.end('这是其他页面');
   *   });
   *
   * 如果上面的分支里没有 return，请求 /test 时，
   * 程序就会继续走到下面的另一个 end()，造成重复响应。
   *
   * 也经常把 end() 和 return 合并成一句：
   *   if (request.url === '/test') {
   *     return response.end('这是 test 页面');
   *   }
   * 这句会先执行 end()，再退出当前函数；
   * 让函数退出的是 return，而不是 end() 本身。
   * return 只退出它所在的函数，不会停止服务器，
   * 也不会自动取消之前已经安排好的异步任务。
   *
   * 十、end() 返回，是否代表浏览器已经收到全部数据？
   * 不代表。end() 表示服务端不再追加本次响应的内容，
   * 返回时仍可能有缓冲数据等待发送。
   * response.writableEnded 为 true 也只表示调用过 end()，
   * 不能据此判断浏览器已经收到或显示了全部内容。
   *
   * 补充文档：
   * https://nodejs.org/api/http.html#responsesetheadername-value
   * https://nodejs.org/api/http.html#responsewritableended
   */
});

//监听端口, 启动服务
server.listen(9000, () => {
  console.log('服务已经启动....')
});
