//导入 http 模块
const http = require('http');

//创建服务对象
const server = http.createServer((request, response) => {
  //实例化 URL 的对象
  let url_01 = new URL('http://www.xxx.com/search?a=100&b=120')
  console.log(url_01)

  // let url = new URL('/search?a=100&b=200', 'http://127.0.0.1:9000');
  let url = new URL(request.url, 'http://127.0.0.1'); 
  console.log(request.url) // 输出 /seabce?arg1=abc&arg2=efg， 运行这个文件的时候，浏览器中的完整请求是 http://127.0.0.1:9000/seabce?arg1=abc&arg2=efg

  //输出路径
  console.log(url.pathname); //  输出  /seabce
  //输出 keyword 查询字符串
  console.log(url.searchParams) // 输出   URLSearchParams { 'arg1' => 'abc', 'arg2' => 'efg' } 
  console.log(url.searchParams.get('arg1')); // 输出 abc 
  response.end('url new');
});

//监听端口, 启动服务
server.listen(9000, () => {
  console.log('服务已经启动....')
});

/*
学习问答整理：URL 参数、请求方法与请求体参数

一、05 和 06 这两个文件是不是主要针对 GET 请求？

问：这两个文件都是从 URL 中获取路径与查询字符串，是不是因为只有 GET
    才会把参数放在 URL 中，所以它们主要针对 GET？POST 等其他请求的
    参数获取方式，是不是要等后面的课程才会讲？

答：这两个文件确实都在讲“从 URL 中提取路径与查询参数”，但不限于 GET。
    - 05 使用 url.parse(request.url, true) 解析 URL，通过 pathname 获取
      路径，通过 query 获取查询参数。
    - 06 使用 new URL(request.url, 基础地址) 解析 URL，通过 pathname
      获取路径，通过 searchParams.get('参数名') 获取查询参数。
    两个文件都没有限制请求方法。POST 等请求的 URL 也可以带查询字符串，
    同样能用这些代码解析。

    GET 提交数据通常使用 URL 查询字符串，POST 提交数据通常使用请求体，
    但查询字符串不是 GET 专属。一个 POST 请求可以同时包含两处参数：

    POST /login?source=web HTTP/1.1
    Content-Type: application/x-www-form-urlencoded

    username=zhangsan&password=123456

    其中：
    - /login 是 URL 路径，可通过 url.pathname 获取。
    - source=web 是 URL 查询字符串，可通过
      url.searchParams.get('source') 获取 source 的值。
    - username=zhangsan&password=123456 是请求体，需要读取请求体后解析。
    URL 解析代码不会自动获取请求体中的参数。

二、获取 POST 请求体中的参数，是不是已经学过了？

问：既然 URL 参数并不限于 GET，那么获取 POST 请求体中的参数，前面几个
    文件是不是已经提到过了，可以认为这部分已经学过了？

答：已经学过“读取请求体的原始内容”，但要区分下面两个步骤：

    1. 读取整个请求体。
       04_提取HTTP报文的请求体.js 已经演示：通过 data 事件拼接数据，
       在 end 事件中拿到完整的 body，再打印它。
       配合 02_form.html 中的 POST 表单，得到的文本类似：

       username=zhangsan&password=123456

    2. 根据请求体的格式，解析出各个参数。
       04 文件只打印整个 body，还没有分别提取 username、password。
       对于上面的表单编码格式，可以在 end 回调中继续解析：

       let body = '';
       request.on('data', chunk => {
         body += chunk;
       });
       request.on('end', () => {
         const params = new URLSearchParams(body);
         const username = params.get('username'); // zhangsan
         const password = params.get('password'); // 123456
         response.end('Hello HTTP');
       });

       如果请求体是 JSON 格式，则使用 JSON.parse(body) 解析；实际处理时
       需要考虑 JSON 格式错误。不能对所有格式的请求体都使用同一种解析方式，
       应结合 Content-Type 判断，例如：
       - application/x-www-form-urlencoded：这里的表单格式，用 URLSearchParams。
       - application/json：JSON 格式，用 JSON.parse。

    所以可以认为：读取请求体已经学过；根据格式提取其中各个参数，
    是在读取之后继续进行的一步。05、06 则讲的是 URL 的解析。

三、GET 请求也可以把参数放在请求体中吗？

问：既然 POST 可以在 URL 中放参数，是不是 GET 也可以在 Body 中放参数？

答：需要加上限定：GET 请求体没有通用的语义，实际使用中可能不被支持
    或被忽略，不应把它当作通用的传参方式。学习和日常开发时，仍应按
    “GET 通常通过 URL 传参”来理解。

记忆要点：获取参数时，先看参数放在 URL 还是请求体，再看其编码格式，
          不能只根据 GET、POST 等请求方法判断。
*/
