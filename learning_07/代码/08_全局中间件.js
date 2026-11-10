/**
 * 记录每个请求的 url 与 IP 地址
 */
//导入 express
const express = require('express');
const fs = require('fs');
const path = require('path');

//创建应用对象
const app = express();

//声明中间件函数
function recordMiddleware(req, res, next){
  //获取 url 和 ip
  let {url, ip} = req;
  //将信息保存在文件中 access.log
  fs.appendFileSync(path.resolve(__dirname, './access.log'), `${url}  ${ip}\r\n`);
  //调用 next
  next();
}

//使用中间件函数
app.use(recordMiddleware);

//创建路由
app.get('/home', (req, res) => {
  res.send('前台首页');
});

app.get('/admin', (req, res) => {
  res.send('后台首页');
});

app.all('*',(req, res) => {
  res.send('<h1>404 Not Found</h1>')
})

//监听端口, 启动服务
app.listen(3000, () => {
  console.log('服务已经启动, 端口 3000 正在监听中....')
})

/*
===============================================================================
全局中间件学习笔记：recordMiddleware、next、参数传递与 Express 调用规则
===============================================================================

这份笔记整理自本文件的学习问答。先区分三个层次：
  1. JavaScript 语言本身如何传递参数、调用函数。
  2. 为理解原理而编写的简化中间件模型。
  3. 真实 Express 如何注册、筛选和调用中间件。

本项目中，本文件实际加载的是“代码/node_modules/express”下的 Express 4.18.2。
下面关于 Express 形参数量判断的说明，已经对照该版本源码核实：
  代码/node_modules/express/lib/router/layer.js
  handle_request：处理正常请求。
  handle_error：处理错误。

本注释中的示例只用于阅读，不会作为本文件的程序执行。
不要把教学模型当作 Express 的完整源码；模型省略了路由匹配、错误处理等机制。

一、最核心的结论：next 的功能来自传入的值，不来自它的名字
-------------------------------------------------------------------------------

原文件中的函数：

  function recordMiddleware(req, res, next) {
    let { url, ip } = req;
    fs.appendFileSync(
      path.resolve(__dirname, './access.log'),
      url + '  ' + ip + '\r\n'
    );
    next();
  }

它始终是一个普通的 JavaScript 函数。
“中间件”描述的是它在框架中的用途，不是一种特殊的 JavaScript 函数类型。

定义函数时，req、res、next 是形参。
收到请求后，Express 调用这个函数，把三个值按顺序传入：
  第一个值：当前请求对象。
  第二个值：当前响应对象。
  第三个值：用于继续推进请求处理流程的函数。

因此，next 能够被调用，是因为它接收到的值恰好是函数。
它不是关键字，不是因为名字叫 next 就自动获得功能，也不是自动生成的全局变量。

二、形参、实参和参数名称：传递的是值，按位置对应
-------------------------------------------------------------------------------

  function greet(name) {
    console.log(name);
  }

  const username = '张三';
  greet(username);

这里：
  name 是定义函数时的形参。
  username 是调用位置使用的变量，实际传入的是它保存的值“张三”。
  调用者的变量名 username 不必与被调用者的形参名 name 相同。

函数作为参数时也一样：

  function continueProcessing() {
    console.log('继续处理');
  }

  function test(callback) {
    callback();
  }

  test(continueProcessing);

callback 接收到 continueProcessing 函数，所以 callback() 调用的是那个函数。
并不要求两边都叫 continueProcessing，也不要求形参必须叫 callback。

对应到中间件，下面的写法同样可以工作：

  function recordMiddleware(request, response, goOn) {
    console.log(request.url);
    goOn();
  }

  app.use(recordMiddleware);

第三个形参叫 goOn，就通过 goOn() 调用接收到的函数。
req、res、next 是便于大家理解的命名约定，推荐保留，但不是名字匹配规则。

错误示例：

  function recordMiddleware(req, res, goOn) {
    next();
  }

这里接收函数的变量叫 goOn；如果当前可访问作用域中没有 next，
执行 next() 会产生 ReferenceError。
Express 不会因为你注册了中间件，就额外在函数内部创建一个 next 变量。

三、为什么没有 function middleware()，却能调用 middleware(...)？
-------------------------------------------------------------------------------

JavaScript 中，函数可以作为值赋给变量，也可以放进数组。

  function sayHello() {
    console.log('你好');
  }

  const abc = sayHello;

  abc();                         // 输出“你好”
  console.log(abc === sayHello);  // true

这里没有声明一个新的“abc 函数”，而是让 abc 指向已有的 sayHello 函数。
因此，abc() 和 sayHello() 调用的是同一个函数。

注意有无括号的区别：

  const a = sayHello;    // 保存函数引用，没有执行 sayHello
  const b = sayHello();  // 立即执行，并把返回值赋给 b

sayHello 没有显式 return，所以第二种写法中 b 是 undefined，不能再调用 b()。

数组也可以保存函数：

  const middlewares = [recordMiddleware, homeMiddleware];
  const middleware = middlewares[0];

  middleware(req, res, next);

由于数组第 0 项是 recordMiddleware，变量 middleware 指向它。
所以这次 middleware(...) 调用的就是 recordMiddleware(...)。

不必存在“function middleware()”这样的声明。
要判断 middleware(...) 在调用谁，需要查看 middleware 此刻保存的是哪个函数。

四、app.use(recordMiddleware) 做了什么？
-------------------------------------------------------------------------------

  app.use(recordMiddleware);

这行代码把函数本身交给 Express，注册到请求处理流程中。
可以理解为：“以后请求执行到这个位置时，请按照中间件约定调用这个函数。”

它不是立即执行 recordMiddleware，也没有改变该函数的 JavaScript 类型。

不要混淆：

  app.use(recordMiddleware);    // 传递函数，进行注册
  app.use(recordMiddleware());  // 先执行函数，再把返回值交给 app.use

对于本文件的 recordMiddleware，第二种写法并不合适。
它会在没有传入 req、res、next 的情况下立即执行，无法按预期处理请求。

如果没有 app.use，也没有通过路由等其他方式注册，Express 不会自动调用它。
但你仍然可以把它当普通函数手动调用，传入什么值由你决定。

五、一个完整的教学模型：展示“保存函数、取出函数、传入 next”
-------------------------------------------------------------------------------

下面的 demoApp 是教学模型，不是真实 Express，也不会创建 HTTP 服务器。

  const demoApp = {
    middlewares: [],

    use(fn) {
      this.middlewares.push(fn);
    },

    handle(req, res) {
      let index = 0;
      const middlewares = this.middlewares;

      function next() {
        const middleware = middlewares[index];
        index += 1;

        if (!middleware) {
          return;
        }

        middleware(req, res, next);
      }

      next();
    }
  };

  function logger(req, res, next) {
    console.log('1. 记录日志：', req.url);
    next();
  }

  function home(req, res, next) {
    console.log('2. 处理首页请求');
  }

  demoApp.use(logger);
  demoApp.use(home);

  demoApp.handle({ url: '/home' }, {});

输出：
  1. 记录日志： /home
  2. 处理首页请求

这里 handle 的 req、res 只是手动传入的普通对象。
home 只是打印文字，没有真实发送 HTTP 响应。

六、逐步执行教学模型，理解 next 是怎么传进去的
-------------------------------------------------------------------------------

1. 执行 demoApp.use(logger)。

   use 的形参 fn 接收到 logger。
   在 demoApp.use(...) 这种调用方式下，this 指向 demoApp。
   this.middlewares.push(fn) 把 logger 保存到数组中，没有执行 logger。

2. 执行 demoApp.use(home)。

   数组成为：
     [logger, home]

3. 执行 demoApp.handle({ url: '/home' }, {})。

   req 接收到请求示例对象，res 接收到空对象。
   index 初始化为 0。
   局部变量 middlewares 指向已有数组，不是复制一份新数组。

4. handle 最后的 next() 启动第一次处理。

   const middleware = middlewares[0];

   这一次局部变量 middleware 指向 logger。
   index 随后增加到 1。
   修改 index 不会让已经取出的 middleware 自动变成 home。

   middleware(req, res, next);

   这次调用相当于：
     logger(req, res, next);

   第三个实参是 handle 内部定义的 next 函数。

5. logger 收到三个实参，打印日志，再调用它的第三个形参 next。

   为了看清楚，logger 可以改写为：

     function logger(req, res, continueRequest) {
       console.log('1. 记录日志：', req.url);
       continueRequest();
     }

   continueRequest 接收到的就是 handle 中的 next。
   名称不同，不影响调用同一个函数。

6. 第二次进入 next，此时 index 已经是 1。

   const middleware = middlewares[1];

   这次局部变量 middleware 指向 home。
   index 增加到 2。
   middleware(req, res, next) 于是调用 home。

7. home 打印内容，没有调用 next，调用开始逐层返回。

   如果 home 也调用 next，第三次进入 next 时会取 middlewares[2]。
   数组不存在第 2 项，得到 undefined。
   if (!middleware) return 会结束这次调用，避免调用 undefined。

补充两个容易混淆的点：

  A. 每次进入 next，都有这一次调用自己的 const middleware。
     第二次取出 home，不是修改第一次调用里的 const 变量。

  B. index 定义在 handle 里，不在 next 里。
     本次 handle 内的多次 next 调用访问的是同一个 index。
     next 能访问定义时的外层变量，并在被传入别的函数后保持这种访问关系，
     这就是这里用到的闭包。

     再次调用 demoApp.handle(...)，才会创建新的 index，从 0 重新开始。

七、JavaScript 不要求“声明的形参数量”等于“传入的实参数量”
-------------------------------------------------------------------------------

情况 A：声明两个形参，调用时传三个实参。

  function show(a, b) {
    console.log(a, b);
  }

  show(10, 20, 30);

不会因为数量不一致报错。
a 接收到 10，b 接收到 20，第三个值没有对应的命名形参。

“没有命名形参接收”不等于“这个值不存在、永远不能使用”。
普通函数可以通过 arguments 访问实际传入的值：

  function show(a, b) {
    console.log(arguments[2]); // 30
  }

  show(10, 20, 30);

这里说的是普通函数；箭头函数没有自己的 arguments。

情况 B：声明五个普通形参，调用时只传三个实参。

  function show(a, b, c, d, e) {
    console.log(d); // undefined
    console.log(e); // undefined
  }

  show(10, 20, 30);

第四、第五个形参仍然是可以使用的局部变量。
只是没有对应实参，所以这里的初始值是 undefined。

读取 undefined 不会报错；把 undefined 当作函数调用则会报错：

  function show(a, b, c, d) {
    d();
  }

  show(10, 20, 30); // TypeError: d is not a function

报错原因是调用了一个不是函数的值，不是“声明和传入的数量不一致”。

八、教学模型和真实 Express 对四个、五个形参的处理不同
-------------------------------------------------------------------------------

教学模型直接执行：

  middleware(req, res, next);

它不检查 middleware.length。

所以在教学模型中，声明：

  function example(a, b, c, d, e) {
    console.log(d, e);
    c();
  }

会执行函数体，d、e 是 undefined。

但是，真实 Express 4.18.2 在正常请求流程中，会先检查函数的 length。
源码中的关键逻辑是：

  var fn = this.handle;

  if (fn.length > 3) {
    return next();
  }

  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }

对于没有默认参数、没有剩余参数的常规声明，
fn.length 就是声明的形参数量。

因此，超过三个形参时会先执行 return next()，跳过整个函数。
不会再执行后面的 fn(req, res, next)。

真实 Express 正常请求流程中：

  function example(a, b, c, d, e) {
    console.log('进入函数了');
    console.log(d, e);
  }

这个函数会被跳过，连“进入函数了”都不会输出。
不能描述成“前三个可以使用，第四、第五个是 undefined”；
因为这次正常分派根本没有调用它，函数体一行也不执行。

同时，跳过不等于报错。
Express 并不是因为声明了四个或五个形参，就抛出“参数数量错误”。

九、四个形参有明确用途：错误处理中间件
-------------------------------------------------------------------------------

Express 的错误处理分派逻辑是：

  var fn = this.handle;

  if (fn.length !== 4) {
    return next(error);
  }

  try {
    fn(error, req, res, next);
  } catch (err) {
    next(err);
  }

错误流程会调用恰好声明四个常规形参的函数，并传入四个值：

  function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).send('服务器发生错误');
  }

  app.use(errorHandler);

错误处理中间件一般放在需要处理的中间件和路由之后。
即使函数体没有使用 next，也要保留四形参声明，供框架识别。

名称仍然不重要，位置才决定收到什么：

  function errorHandler(a, b, c, d) {
    // a：错误对象
    // b：请求对象
    // c：响应对象
    // d：继续处理的函数
  }

这里第四个参数 d 不是 undefined，它就是框架传入的继续处理函数。

不要给普通中间件随意加第四个参数：

  function wrong(req, res, next, extra) {
    next();
  }

它会被当作错误处理中间件。
当错误流程调用它时，名字和实际收到的值会错位：
  req   实际收到错误对象。
  res   实际收到请求对象。
  next  实际收到响应对象。
  extra 实际收到继续处理的函数。

因此 next() 会尝试调用响应对象，产生错误。
原因是使用了错误位置的值，不是四形参本身非法。

在本项目版本中，对常规声明总结如下：
  0～3 个形参：正常请求分派可以调用；错误分派会跳过。
  4 个形参：正常请求分派跳过；错误分派可以调用。
  5 个及以上：这两种分派都会跳过，不会仅因数量而报错。

以上以执行到相应层、满足路径等其他条件为前提。
“全局”不会绕过这些分派规则。
四形参函数并非没有意义，它承担的是错误处理职责。

进阶补充：Express 实际判断的是 fn.length，不是简单数源码里的逗号。
默认参数和剩余参数会改变 length 的计算：

  function a(req, res, next) {}
  function b(req, res, next = null) {}
  function c(...args) {}

  a.length === 3;
  b.length === 2;
  c.length === 0;

默认参数之前的形参计入 length，剩余参数不计入。
学习阶段建议使用清晰的常规签名，尤其错误处理中间件保持
(err, req, res, next)，避免影响框架识别。
上述“0～3、4、5 及以上”的表格不能机械套用到有默认参数等特殊声明的函数。

十、什么时候可以只声明两个形参？
-------------------------------------------------------------------------------

你声明：

  function handler(req, res) {
    res.send('处理完成');
  }

并不代表 Express 只传两个值。
正常调用时 Express 仍然传 req、res、next，只是你没有用第三个命名形参接收。

如果当前中间件负责完成响应，不需要继续执行后续处理函数，
只声明 req、res 是非常正常的写法，不要求必须写满三个形参。

如果当前中间件只做日志记录，后面还要执行路由，就通常写：

  function logger(req, res, next) {
    console.log(req.url);
    next();
  }

“声明了 next”和“调用了 next”也不相同：

  app.use((req, res, next) => {
    console.log('执行了');
  });

虽然声明了三个形参，但没有调用 next，也没有完成响应，
后续处理不会自动执行，请求会停在这里等待。
这里假设后续没有其他异步逻辑负责完成响应或继续处理。

因此，要按职责判断，而不是只看形参数量：
  调用 next()：继续交给后面的处理流程。
  res.send()、res.end() 等完成响应：可以在当前处理函数结束请求。
  两件事都不做，也没有安排后续处理：请求会停留在这里。

十一、“最后一个全局中间件”不等于可以什么都不做
-------------------------------------------------------------------------------

即使你注册的最后一个全局中间件已经执行完，
如果既不结束响应，也不调用 next，请求仍然不会自动完成。

JavaScript 函数返回，不等于 HTTP 响应结束。
console.log 打印文字，也不等于向浏览器发送响应。

而且“最后一个 app.use 注册的全局中间件”后面，可能还有 app.get 等路由：

  app.use(recordMiddleware);

  app.get('/home', (req, res) => {
    res.send('前台首页');
  });

recordMiddleware 即使是最后一个全局中间件，也需要继续让请求进入路由。
本文件的日志中间件不负责发送响应，所以这里应该调用 next()。

如果处理流程真的到末尾还没有响应，调用 next() 仍可让 Express
走到后续兜底处理；默认情况下，未处理的普通请求会得到 404。
Express 不能在你当前中间件停住、未交回控制权时自动替你完成这一过程。

不要因为已经 res.send()，又机械地追加 next()。
如果后面的函数再次尝试发送响应，可能造成重复响应相关错误。
是否继续执行应由处理流程明确决定。

十二、不使用前面的参数，也不能直接删掉它的位置
-------------------------------------------------------------------------------

错误示例：只想用响应对象，于是只写一个叫 res 的形参。

  app.use((res) => {
    res.send('完成');
  });

第一个位置收到的是请求对象，名字叫 res 也不会改变它。
正确写法是保留第一位：

  app.use((_req, res) => {
    res.send('完成');
  });

如果只需要 next，应保留前两个位置：

  app.use((_req, _res, next) => {
    next();
  });

不能写：

  app.use((next) => {
    next();
  });

也不能因为不用 res，就写：

  app.use((req, next) => {
    next();
  });

前者的 next 实际收到请求对象，后者的 next 实际收到响应对象。

下划线只是“当前没有使用这个参数”的命名习惯，不是特殊语法。
对普通的位置形参来说：
  不使用的末尾形参可以省略。
  要接收后面的值，就需要保留前面的位置。

十三、next() 是一次函数调用，不等于 return，也不自动结束当前函数
-------------------------------------------------------------------------------

  app.use((req, res, next) => {
    console.log('A');
    next();
    console.log('C');
  });

  app.get('/home', (req, res) => {
    console.log('B');
    res.send('首页');
  });

对于这个同步示例，请求 /home 时输出：
  A
  B
  C

调用 next() 后，后续同步调用返回，当前中间件仍会执行后面的 console.log。
如果希望这次调用后不再执行当前函数后面的普通语句，可以写：

  return next();

next() 负责推进处理流程，return 负责返回当前函数。
不要把 next 理解成“跳转后当前函数永远不再回来”。

这个 A、B、C 顺序针对给出的同步代码。
涉及定时器、Promise、异步读写时，要结合实际调度分析；
next() 返回也不代表后面的所有异步工作或 HTTP 响应已经结束。

另外，next 本身通常是框架的分派函数，
不要简单认为它就是数组里的下一个业务中间件函数。
它会负责推进流程、进行匹配，或进入错误处理等。

十四、这些约定不只适用于全局中间件
-------------------------------------------------------------------------------

普通处理函数可以出现在：
  app.use(fn)
  app.use('/admin', fn)
  app.get('/home', fn)
  router.use(fn)
  router.get('/home', fn)

这些普通处理函数按位置接收 req、res、next。
全局、指定路径、指定路由影响的是匹配和执行范围，
不会让普通处理函数的第三个实参按名字重新分配。

“全局中间件”也不是说它无条件总会执行。
是否走到它，还取决于注册顺序、前面的处理函数是否继续、
以及当前是否处于错误处理流程等。

如果完全由你手动调用函数，则参数由你自己提供：

  recordMiddleware(
    { url: '/test', ip: '127.0.0.1' },
    {},
    () => console.log('手动传入的继续处理函数')
  );

对本文件函数而言，上述调用会尝试写入日志；
写入成功后，执行你手动提供的第三个函数。

函数的名字、是否曾经注册过，都不会让手动调用自动获得 Express 参数。

十五、与 Java Servlet Filter 的对应关系
-------------------------------------------------------------------------------

Java 的过滤器常见形式是：

  doFilter(request, response, chain)

其中 chain 由 Servlet 容器调用过滤器时传入，
然后通过 chain.doFilter(request, response) 继续处理。

Express 则由框架调用中间件，并直接把继续处理的函数作为参数传入。
Java 示例中传的是带方法的对象；JavaScript 可以直接传函数。

两者共同点是“调用方提供继续处理的能力”。
不是因为形参名字叫 chain 或 next，它就自动具有特定功能。
但不要把 Java 的方法签名匹配规则照搬到 JavaScript 的普通函数调用上。

十六、回到本文件：一次 /home 请求的处理过程
-------------------------------------------------------------------------------

本文件先注册 recordMiddleware，再注册 /home、/admin 和兜底路由。

一次正常的 GET /home 请求大致经历：
  1. Express 让请求进入 recordMiddleware。
  2. req、res、next 分别接收框架传来的三个值。
  3. 从 req 中读取 url、ip。
  4. 将它们追加到本目录的 access.log。
  5. 调用 next()，继续后续匹配和处理。
  6. /home 路由通过 res.send('前台首页') 完成响应。

这里的 next() 不是可有可无的装饰：
日志中间件本身没有发送响应，需要把请求交给后面的路由。

如果同步写日志时抛出异常，后面的 next() 不会执行；
Express 会捕获同步异常并转入错误处理流程。

本文件兜底路由虽然发送的 HTML 中写着“404 Not Found”，
但 res.send(...) 不会仅根据正文自动设置 HTTP 状态码 404。
如需实际返回 404 状态，应显式使用 res.status(404).send(...)。
此处仅说明现有代码行为，本次笔记没有修改原有业务代码。

十七、容易记错的结论对照
-------------------------------------------------------------------------------

错误：“第三个参数必须叫 next。”
正确：名称可以改变，位置和传入的值决定含义。

错误：“app.use 把普通函数变成了特殊类型的函数。”
正确：它注册函数，框架之后按约定调用；函数仍是普通 JavaScript 函数。

错误：“没有声明 function middleware，就不能调用 middleware()。”
正确：只要变量 middleware 保存的是函数，就可以调用。

错误：“声明两个形参，Express 就只传两个实参。”
正确：普通分派仍传三个，只是没有第三个命名形参接收。

错误：“不使用 res，可以把 (req, res, next) 改成 (req, next)。”
正确：这样第二个参数接到的是响应对象，不能省掉中间位置。

错误：“参数数量不一致，JavaScript 会直接报错。”
正确：数量不一致本身不导致普通调用报错；错误使用收到的值才可能报错。

错误：“多出来的第四、第五个形参不能在函数体里使用。”
正确：在普通调用中，它们是合法变量；缺少实参时通常为 undefined。
      但真实 Express 还会先筛选函数，不能直接套用这个普通调用结论。

错误：“Express 会执行五形参函数，只是后两个参数为 undefined。”
正确：本项目版本的正常分派会跳过整个函数，函数体不会执行。

错误：“声明四个、五个形参，Express 就会因为数量报错。”
正确：四形参用于错误处理；五形参及以上会被两种分派跳过。
      这里以没有默认参数、剩余参数的常规声明为前提。

错误：“最后一个全局中间件不需要 next，也不需要响应。”
正确：最后一个不等于请求完成；仍需要完成响应或继续交回处理流程。

错误：“调用 next() 就等于结束当前函数。”
正确：next 是函数调用，后面的语句仍可能执行；需要返回时写 return next()。

进一步核对可阅读：
  https://expressjs.com/en/guide/writing-middleware/
  https://expressjs.com/en/guide/using-middleware/
  https://expressjs.com/en/guide/error-handling/

===============================================================================
*/
