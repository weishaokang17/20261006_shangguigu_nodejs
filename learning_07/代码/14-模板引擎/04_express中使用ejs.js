//导入 express
const express = require('express');
//导入 path
const path = require('path');
//创建应用对象
const app = express();
//1. 设置模板引擎
app.set('view engine', 'ejs');// pug  twing
//2. 设置模板文件存放位置   模板文件: 具有模板语法内容的文件
app.set('views', path.resolve(__dirname, './views'));

//创建路由
app.get('/home', (req, res) => {
  //3. render 响应
  // res.render('模板的文件名', '数据');
  //声明变量
  let title = '尚硅谷 - 让天下没有难学的技术';
  res.render('home', {title:title});
  //4. 创建模板文件
});

//监听端口, 启动服务
app.listen(3000, () => {
  console.log('服务已经启动, 端口 3000 正在监听中....')
})
/*
 * Express 中使用 EJS：配置项、模板目录与扩展名学习笔记
 *
 * 本笔记整理自本次 AI 咨询，结合上方实际代码说明。
 * 以下示例全部位于多行注释内，不会作为程序代码执行。
 *
 * 一、app.set 的基本作用
 *
 *   app.set('配置项名称', 配置值);
 *
 * 可以理解为给 Express 应用保存一项配置。
 * 对于 Express 内置功能，需要使用它规定的配置项名称，
 * Express 才会在执行对应功能时读取这些配置。
 *
 * 当前两项配置：
 *
 *   app.set('view engine', 'ejs');
 *   app.set('views', path.resolve(__dirname, './views'));
 *
 *   'view engine'：设置默认模板引擎。
 *   'views'：设置查找模板文件的目录。
 *
 * 二、'view engine' 和 'views' 是固定写法吗？
 *
 * 是的。要配置上面这两项 Express 内置功能，就需要使用这些名称。
 * 它们是 Express 约定的配置项名称，不是 JavaScript 语言的关键字。
 * 注意 'view engine' 中间有一个空格，不能随意改成 'viewEngine'。
 *
 * 例如，下面虽然可以保存自定义配置，但不会自动配置相应的模板功能：
 *
 *   app.set('viewEngine', 'ejs');
 *   app.set('viewPath', 某个路径);
 *
 * 原因：Express 不会自动把这些自定义名称当作 'view engine' 和 'views'。
 * 能保存一个配置名称，不代表它会触发我们想要的 Express 内置功能。
 *
 * 三、第 8 行：设置默认模板引擎
 *
 *   app.set('view engine', 'ejs');
 *
 * 含义：把 EJS 设置为当前应用默认使用的模板引擎。
 *
 * 后面调用 res.render 时，如果模板名称没有扩展名，
 * Express 就根据这项配置使用 .ejs 扩展名来查找模板，并调用相应引擎渲染。
 *
 *   'view engine' 是固定的配置项名称。
 *   'ejs' 是当前选用的模板引擎名称，要与实际使用的模板引擎对应。
 *
 * 项目需要已经安装相应的模板引擎包。
 * 设置配置本身不会自动安装 npm 包。
 * 在当前这种集成方式下，Express 会在需要时加载 EJS，
 * 因此本文件不需要再手动写 const ejs = require('ejs')。
 *
 * 四、第 10 行：设置模板的查找目录
 *
 *   app.set('views', path.resolve(__dirname, './views'));
 *
 * 可以从项目组织角度理解为“指定模板文件存放在哪里”。
 * 更准确地说，它是在告诉 Express：“需要模板时，到这个目录中查找。”
 *
 * 这行代码不会自动创建目录，也不会把模板文件移动或保存到这个目录。
 * 目录和模板文件需要我们自己准备好。
 *
 * 分解右侧路径表达式：
 *
 *   __dirname
 *
 * 表示当前这个 JS 文件所在目录的绝对路径。在本例中就是：
 *
 *   ……/learning_07/代码/14-模板引擎
 *
 * 注意：这里指当前 JS 文件所在的目录，不是运行 node 命令时所在目录。
 *
 *   path.resolve(__dirname, './views')
 *
 * 将当前文件所在目录与 ./views 组合，得到绝对路径：
 *
 *   ……/learning_07/代码/14-模板引擎/views
 *
 * 因此，当前配置告诉 Express 到上面这个目录中查找模板。
 *
 * 五、同一行中两个 views 的含义不同
 *
 *   app.set('views', path.resolve(__dirname, './views'));
 *
 * 左边的 'views'：Express 固定的配置项名称。
 * 右边 './views' 中的 views：我们自己选择的文件夹名称。
 *
 * 它们虽然拼写相同，但只有左边的配置项名称需要按 Express 的约定填写。
 * 右边的目录名可以按项目需要修改。
 *
 * 例如，把模板实际放在 templates 文件夹中时，可以配置：
 *
 *   app.set('views', path.resolve(__dirname, './templates'));
 *
 * 此时配置项仍然叫 'views'，只是查找目录变成了 templates。
 * 需要同时确保模板文件确实放在这个目录中。
 *
 * 六、第 18 行可以省略 .ejs 扩展名吗？
 *
 * 当前写法：
 *
 *   res.render('home', {title: title});
 *
 * 可以省略。原因是前面已经设置了默认模板引擎：
 *
 *   app.set('view engine', 'ejs');
 *
 * 因此，在当前配置下，下面两种写法都可以：
 *
 *   res.render('home', {title: title});
 *   res.render('home.ejs', {title: title});
 *
 * 第一种省略扩展名，Express 根据默认引擎配置补充 .ejs。
 * 第二种明确写出扩展名。
 *
 * 如果没有设置默认 view engine，且模板名也没有扩展名，
 * Express 就无法从这两处确定使用哪个模板引擎，不能照搬省略扩展名的写法。
 *
 * 需要特别注意：省略的是 res.render 参数中的扩展名，
 * 磁盘上的实际模板文件仍然叫 home.ejs，不需要把文件改名为 home。
 *
 * 七、这三处代码怎样一起确定模板位置？
 *
 *   app.set('view engine', 'ejs');
 *   // 提供默认模板引擎及省略扩展名时使用的 .ejs 扩展名。
 *
 *   app.set('views', path.resolve(__dirname, './views'));
 *   // 提供模板的查找目录。
 *
 *   res.render('home', {title: title});
 *   // 提供本次要渲染的模板名称和数据。
 *
 * 当前项目的对应结构：
 *
 *   14-模板引擎/
 *   ├── 04_express中使用ejs.js
 *   └── views/
 *       └── home.ejs
 *
 * 三处信息结合后，本例会找到：
 *
 *   当前 JS 文件所在目录/views/home.ejs
 *
 * 八、路由地址 /home 和模板名称 home 是不同概念
 *
 *   app.get('/home', (req, res) => {
 *     let title = '尚硅谷 - 让天下没有难学的技术';
 *     res.render('home', {title: title});
 *   });
 *
 * '/home' 是浏览器请求的路由路径。
 * res.render 中的 'home' 是本次要渲染的模板名称。
 *
 * 两者在本例中看起来相似，但并不要求同名。
 * 具体使用哪个模板，由路由处理函数中调用 res.render 时传入的名称决定。
 *
 * 九、第二个参数 {title: title} 仍然是传给模板的数据对象
 *
 *   let title = '尚硅谷 - 让天下没有难学的技术';
 *   res.render('home', {title: title});
 *
 * 左边的 title：对象属性名，供模板通过 title 这个名称访问数据。
 * 右边的 title：当前 JavaScript 变量，读取它的值作为属性值。
 *
 * 模板可以使用 <%= title %> 输出传入的数据。
 * 因为属性名和变量名相同，也可以简写：
 *
 *   res.render('home', {title});
 *
 * 上方第 15 行注释中的 '数据' 只是示意文字。
 * 本例实际传入的是数据对象 {title: title}，不是字符串 '数据'。
 *
 * 十、与前面手动调用 ejs.render 的方式有什么区别？
 *
 * 前面的方式：
 *
 *   let html = fs.readFileSync('./02_西游.html').toString();
 *   let result = ejs.render(html, {xiyou: xiyou});
 *   console.log(result);
 *
 * 由我们读取模板字符串、调用 EJS 渲染，再处理返回的字符串。
 * console.log 只是把结果打印到终端。
 *
 * 当前 Express 的方式：
 *
 *   res.render('home', {title: title});
 *
 * 由 Express 根据配置查找模板，调用 EJS 渲染。
 * 在本例没有向 res.render 传回调函数的写法下，
 * Express 还会把生成的 HTML 作为响应发送给浏览器。
 *
 * 因此，这里不需要再手动调用 fs.readFileSync、ejs.render 或 res.send。
 *
 * 十一、完整流程与记忆要点
 *
 *   配置 view engine → 默认使用 EJS。
 *   配置 views → 指定模板查找目录。
 *   浏览器请求 /home → 执行路由处理函数。
 *   res.render('home', 数据对象) → 找到 views/home.ejs 并渲染。
 *   渲染完成 → 将生成的 HTML 响应给浏览器。
 *
 *   固定的是配置项名称 'view engine' 和 'views'。
 *   模板目录名称可以自己选，但配置路径要与实际位置对应。
 *   设置 views 是告诉 Express 去哪里查找，不是自动存放或移动模板。
 *   设置默认引擎为 ejs 后，res.render('home', ...) 可以省略 .ejs。
 *   实际模板文件仍然保留 .ejs 扩展名。
 *
 * 参考：Express 官方模板引擎说明
 * https://expressjs.com/en/guide/using-template-engines/
 */
