//1. 导入 http 模块
const http = require('http');

//2. 创建服务对象
const server = http.createServer((request, response) => {
  //1. 声明一个变量
  let body = '';
  //2. 绑定 data 事件
  request.on('data', chunk => {
    body += chunk;
  })
  //3. 绑定 end 事件
  request.on('end', () => {
    console.log(body); // username=&password=
    //响应
    response.end('Hello HTTP');
  });
});

//3. 监听端口, 启动服务
server.listen(9000, () => {
  console.log('服务已经启动....')
});

/*
学习笔记：request 的 data 事件与 end 事件

一、我的第一个疑问

当前文件中的 data 事件和 end 事件分别是什么？
它们都是 request 对象上的事件，分别代表什么含义？
什么时候触发 data，什么时候触发 end？为什么需要同时监听它们？

核心回答：
- data：请求流把一块请求体数据交给程序读取，可以触发多次。
- end：当前请求的请求体已经全部读取完毕，后面没有更多数据了。
- 当前代码用 data 逐块收集请求体，用 end 处理最终收集到的完整内容。

二、为什么 request 对象会有这两个事件？

http.createServer((request, response) => { ... }) 中：
- request 表示当前这一次 HTTP 请求。
- response 用来向客户端发送这一次请求对应的 HTTP 响应。

request 是形参名；这个对象的实际类型是 http.IncomingMessage。
它继承了可读流 Readable，因此可以通过 data、end 等流事件读取请求体。
“可读流”可以理解为：数据可以陆续到达，程序可以一部分一部分地读取。

例如，浏览器提交表单时，一个 HTTP 请求可能是：

  POST /login HTTP/1.1
  Host: localhost:9000
  Content-Type: application/x-www-form-urlencoded
  Content-Length: 28

  username=zhangsan&password=123

空行下面的 username=zhangsan&password=123 才是请求体。
当前代码通过 request 的 data 事件读取的是请求体数据。
请求方法、请求地址和请求头则可以通过以下属性访问：

  request.method   // 例如 POST
  request.url      // 例如 /login
  request.headers  // 请求头

进入 createServer 的请求处理回调时，已经可以访问这些请求信息，
但请求体可能还没有全部到达，因此需要继续读取请求体。
每次新请求都有自己的 request 对象，也有自己这一次的读取过程。

三、data 事件什么时候触发？chunk 是什么？

当前代码：

  request.on('data', chunk => {
    body += chunk;
  });

含义：每当请求流向程序提供一块请求体数据，就执行这个回调，
并把本次提供的数据块作为参数传给 chunk。

在当前代码中，添加 data 监听器后，请求流开始以流动模式读取数据。
默认情况下，chunk 是 Buffer，也就是一块字节数据。
由于 body 是字符串，body += chunk 会把 Buffer 隐式转成字符串再追加。

一次请求不一定只对应一次 data 事件。
例如，请求体是：

  username=zhangsan&password=123

假设它被分成三块交给程序，那么可能发生：

  初始：         body = ''
  第一次 data： chunk 的内容是 'username=zhang'
                 body = 'username=zhang'
  第二次 data： chunk 的内容是 'san&password='
                 body = 'username=zhangsan&password='
  第三次 data： chunk 的内容是 '123'
                 body = 'username=zhangsan&password=123'

这里的分块只是为了说明原理，不是固定的分块方式。
实际分块的大小、次数、位置没有固定保证，也不会按表单字段划分。
一次 data 也不能简单理解成一个 TCP 网络包，或客户端的一次 write 调用。
这么短的请求体很可能一次就读完，只触发一次 data，这是正常现象。

为什么写 body += chunk，而不是 body = chunk？
- += 会把本次数据追加到已有内容后面，逐步拼出完整请求体。
- = 会覆盖已有内容；如果有多块数据，最终只会留下最后一块。

四、end 事件什么时候触发？

当前代码：

  request.on('end', () => {
    console.log(body);
    response.end('Hello HTTP');
  });

含义：当前请求的请求体已经读取完毕，不会再有后续数据时，执行回调。
此时，body 中才是前面通过 data 事件拼接得到的完整请求体。

更准确地说，end 需要等流中的数据全部被消费后才会触发。
当前 data 回调的读取过程就在消费数据。
如果只监听 end，却既不读取数据，也不让流开始流动，不能指望它自动触发。

end 回调不会把“完整请求体”作为参数传进来。
完整请求体是我们自己用 body 变量收集的，end 只负责通知读取结束。

五、当前代码的执行顺序，以及 .on() 的含义

.on() 是注册事件监听器：告诉 Node.js，事件发生时执行哪个回调。
执行到 request.on('data', ...) 这一行，不会停在这里等待请求体收完，
而是注册回调后继续执行后面的代码，包括注册 end 回调。

当前代码正常处理一个请求时，可以这样理解：

  进入 createServer 的请求处理回调
    → 创建本次请求自己的 body = ''
    → 注册 data 监听器
    → 注册 end 监听器
    → data：读取一块数据，追加到 body
    → data：读取下一块数据，追加到 body
    → ……可能还有更多块……
    → end：请求体全部读取完成
    → console.log(body)：打印完整请求体
    → response.end('Hello HTTP')：写入响应内容并结束本次响应

下面这种写法无法等待完整请求体：

  let body = '';
  request.on('data', chunk => {
    body += chunk;
  });
  console.log(body); // 这里只是注册完监听器，还没有等到请求体读取完成

因此，需要使用完整请求体的操作应放到 end 回调中。
例如，接收 JSON 文本时，通常先拼接所有数据，再在 end 中尝试 JSON.parse；
不能假定每个 chunk 都恰好是一段完整、可解析的 JSON。

六、request 的 end 事件与 response.end() 有什么区别？

  request.on('end', () => {
    response.end('Hello HTTP');
  });

虽然两处都出现 end，但它们代表不同的事情：
- request.on('end', ...)：监听事件，等待“请求体读取完毕”的通知。
- response.end('Hello HTTP')：主动调用方法，写入响应内容并结束本次响应。

当前代码的安排是：先完整接收客户端提交的内容，再回复客户端。
request 的 end 表示当前请求体读取结束，不表示服务器关闭，
也不表示底层 TCP 连接一定断开；连接可能保持并用于后续请求。

七、我的第二个疑问：data 可以触发多次，那么 end 是否只触发一次？

回答：对于同一个 request 对象，正常读取完请求体后，end 只触发一次。
请求体可以分多次读取，但“全部读取完成”只发生一次。

同一个请求的正常事件顺序可能是：

  data → data → data → end

也可能是：

  data → end

在当前这种正常消费请求流的写法中，如果请求体为空，还可能是：

  end

即没有 data，直接触发 end，此时 body 仍是空字符串。
end 触发后，这个请求流不会再提供后续 data 数据。

要注意两个边界：
1. 不同请求分别计数。
   第二次请求有新的 request 对象，可以再次触发它自己的 data 和 end。
   “end 只触发一次”指同一个 request，并不是整个服务器运行期间只有一次。
2. 异常中断可能没有 end。
   如果请求在读取完成之前中断，不能保证触发表示正常读取结束的 end。

准确表述：在 Node.js 正常的请求流生命周期中，同一个请求的 end 最多
触发一次；正常读取完成时触发一次，异常中断时可能不触发。

八、处理中文等 UTF-8 文本时的补充

原代码的 body += chunk 会把每块 Buffer 分别转换成字符串。
如果一个中文字符的多个字节恰好分布在两个 chunk 中，分别转换可能产生乱码。
读取 UTF-8 文本请求体时，可以先设置：

  request.setEncoding('utf8');

再监听 data。这样 chunk 就是字符串，Node.js 会处理跨数据块的字符边界。
这个设置适用于已知为 UTF-8 的文本请求体；二进制文件数据应保留 Buffer。

下面是便于观察事件的示例，仅作为注释中的参考，不会执行：

  const server = http.createServer((request, response) => {
    let body = '';
    let count = 0;

    request.setEncoding('utf8');

    request.on('data', chunk => {
      count++;
      console.log(`第 ${count} 次 data，本次内容：`, chunk);
      body += chunk;
    });

    request.on('end', () => {
      console.log('end：请求体读取完毕');
      console.log('完整请求体：', body);
      response.end('Hello HTTP');
    });
  });

用短表单测试时，看到一次 data 然后一次 end，也是完全正常的。

相关官方文档：
- IncomingMessage：https://nodejs.org/api/http.html#class-httpincomingmessage
- data 事件：https://nodejs.org/api/stream.html#event-data
- end 事件：https://nodejs.org/api/stream.html#event-end
- setEncoding：https://nodejs.org/api/stream.html#readablesetencodingencoding
*/
