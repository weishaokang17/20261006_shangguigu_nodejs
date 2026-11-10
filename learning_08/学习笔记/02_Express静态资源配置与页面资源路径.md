# Express 静态资源配置与页面资源路径

本文整理自关于 `accounts` 项目中静态文件、EJS 页面资源引用，以及相对路径和根相对路径的咨询记录。说明以当前项目源码为依据；文中的 `http://localhost:3000` 是便于理解的假设服务地址，实际访问时应使用项目运行时的地址和端口。

## 1. 原始问题整理

`public/js` 和 `public/css` 里面的文件是不是静态文件？

`views/create.ejs` 引入这些文件时，最开始使用了 `./css/bootstrap.css` 这样的相对路径，结果样式丢失、资源加载失败。后来改为 `/css/bootstrap.css` 这样的路径，资源就能正常访问了。

大致能理解，相对路径会受到当前页面 URL 的影响，从而请求到错误的位置。但仍有几个疑问：

- 为什么改成以 `/` 开头的路径后，就能访问 `public` 下面的 CSS 和 JavaScript 文件？
- 是不是项目已经把 `public` 配置成了静态资源目录？
- 具体在哪个文件、哪一行配置的？
- 页面 URL 与服务器磁盘上的 `public` 目录，是怎样对应起来的？

## 2. 先给出明确答案

**是的，这个项目把 `public` 配置成了静态资源目录。配置位于 [app.js](../代码/accounts/app.js) 第 20 行：**

```js
app.use(express.static(path.join(__dirname, 'public')));
```

因此，在当前配置下，资源地址与磁盘文件之间有下面的对应关系：

| 浏览器请求的 URL 路径 | Express 查找的磁盘文件 |
| --- | --- |
| `/css/bootstrap.css` | `accounts/public/css/bootstrap.css` |
| `/css/bootstrap-datepicker.css` | `accounts/public/css/bootstrap-datepicker.css` |
| `/js/jquery.min.js` | `accounts/public/js/jquery.min.js` |
| `/js/main.js` | `accounts/public/js/main.js` |

理解这一点，要分清两个环节：

1. **浏览器根据 HTML 中的 `href`、`src` 等属性，确定要请求哪个 URL。**
2. **服务器根据 Express 的配置，确定这个请求对应磁盘上的哪个文件。**

浏览器只知道请求 URL，并不知道项目在服务器磁盘上的实际目录。`public` 是服务器配置的一部分。

## 3. 什么是静态资源？

当前项目的 [public/js](../代码/accounts/public/js/) 和 [public/css](../代码/accounts/public/css/) 中，存放的是提供给浏览器使用的 JavaScript 和 CSS 文件。这些文件在这里作为静态资源提供。

“静态”主要描述服务器提供资源的方式：服务器从磁盘读取已有文件并返回，而不是先把它当作 EJS 模板渲染成页面。

常见静态资源包括：

- CSS 样式文件；
- 浏览器执行的 JavaScript 文件；
- 图片、字体、音频等文件；
- 直接提供的 HTML 文件。

JavaScript 文件可以在浏览器中执行，并使页面产生动态交互，但这不影响它以静态文件的方式从服务器下载。**“静态资源”与“页面有没有动态效果”是两个不同的概念。**

## 4. 把静态资源配置从里往外拆开

项目中的完整代码是：

```js
app.use(express.static(path.join(__dirname, 'public')));
```

### 4.1 `__dirname`：当前代码文件所在的目录

在当前项目使用的 CommonJS 模块中，`__dirname` 表示当前模块文件所在目录的绝对路径。

这行代码写在 `accounts/app.js` 中，因此这里的 `__dirname` 指向 `accounts` 目录。

它不表示浏览器 URL 中的目录，也不表示 `views/create.ejs` 所在的目录。

### 4.2 `path.join(__dirname, 'public')`：确定磁盘上的资源目录

`path.join` 用来连接路径片段。

```js
path.join(__dirname, 'public')
```

得到的是项目中 `accounts/public` 的完整磁盘路径。为了阅读方便，本文用省略前缀的形式表示：

```text
……/accounts/public
```

这也避免了简单写 `express.static('public')` 时，路径受 Node.js 进程启动目录影响的问题。使用当前代码文件的位置来定位 `public`，关系更加明确。

### 4.3 `express.static(...)`：创建静态资源中间件

```js
express.static(path.join(__dirname, 'public'))
```

创建的中间件会在配置的目录中寻找请求对应的文件。对于本例这样的普通文件路径，如果找到了文件，就可以将文件内容作为响应返回给浏览器。

例如，请求路径为：

```text
/css/bootstrap.css
```

中间件就在配置的资源根目录下查找：

```text
css/bootstrap.css
```

对应到磁盘上就是：

```text
accounts/public/css/bootstrap.css
```

### 4.4 `app.use(...)`：让应用使用这个中间件

```js
app.use(express.static(...));
```

把静态资源中间件注册到 Express 应用中，使其能够参与请求处理。

这里没有显式传入挂载路径，默认挂载在 `/`。对于这项配置，可以把它理解为：

```js
app.use('/', express.static(path.join(__dirname, 'public')));
```

默认挂载在 `/`，不表示只有请求首页 `/` 时才会执行。像 `/css/bootstrap.css`、`/js/main.js` 这样的请求，也会经过它。

同样，这也不意味着所有 URL 都必须对应静态文件：找不到对应文件时，这个中间件默认会继续把请求交给后续处理逻辑。因此，静态资源处理和业务路由能够同时存在。

## 5. 为什么资源 URL 不需要写 `public`？

当前配置已经把 `public` 指定为静态文件的查找根目录：

```js
app.use(express.static(path.join(__dirname, 'public')));
```

在这个中间件处理请求时，可以把普通路径的映射关系理解为：

```text
资源根目录：accounts/public
请求路径：  /css/bootstrap.css

查找文件：  accounts/public/css/bootstrap.css
```

因此，页面中应该写：

```html
<link href="/css/bootstrap.css" rel="stylesheet" />
```

如果写成：

```html
<link href="/public/css/bootstrap.css" rel="stylesheet" />
```

这个静态资源中间件就会尝试寻找：

```text
accounts/public/public/css/bootstrap.css
```

多出来的 `public` 会使文件路径不符合当前目录结构。

**文件夹名字叫 `public`，不代表它天然就能被浏览器访问。真正建立映射的是 `express.static` 的配置。** 如果改为把其他目录配置成静态资源目录，Express 就会从那个目录中提供资源。

Express 官方文档也说明，静态资源目录的名称不需要出现在这种配置下的 URL 中。参见 [Express 静态文件文档](https://expressjs.com/en/starter/static-files/)。

## 6. 为什么 `./css/bootstrap.css` 会失败？

### 6.1 先找到页面本身的 URL

项目的 [routes/index.js](../代码/accounts/routes/index.js) 第 20 行定义了添加记录页面的路由：

```js
router.get('/account/create', function(req, res, next) {
  res.render('create');
});
```

而 `app.js` 中的路由挂载代码是：

```js
app.use('/', indexRouter);
```

因此，该页面的访问路径是：

```text
/account/create
```

假设服务地址为 `http://localhost:3000`，访问页面的完整地址就是：

```text
http://localhost:3000/account/create
```

### 6.2 相对路径不是简单追加到完整 URL 后面

如果页面中写的是：

```html
<link href="./css/bootstrap.css" rel="stylesheet" />
```

在当前页面没有 `<base>` 标签改变基准 URL 的情况下，浏览器会按照当前文档 URL 解析这个相对地址。

对于：

```text
http://localhost:3000/account/create
```

因为路径末尾没有 `/`，相对路径的基准目录是：

```text
http://localhost:3000/account/
```

所以，`./css/bootstrap.css` 被解析为：

```text
http://localhost:3000/account/css/bootstrap.css
```

这里不能机械理解成把 `./css/bootstrap.css` 直接接在整个 `/account/create` 后面。浏览器会按照 URL 解析规则处理最后一段路径、`.`、`..` 等内容。

### 6.3 服务器于是查找到了错误的位置

浏览器请求的是：

```text
/account/css/bootstrap.css
```

静态资源中间件就会尝试查找：

```text
accounts/public/account/css/bootstrap.css
```

但实际文件位于：

```text
accounts/public/css/bootstrap.css
```

两者之间多了一个 `account` 目录，因此文件查找失败。

根据当前源码，这个请求也不匹配已有的业务路由，之后会进入 `app.js` 中的 404 处理。浏览器未能获得所需 CSS，页面就无法应用这份样式。JavaScript 路径写错时，也是同样的请求地址与文件路径不匹配问题。

以上是根据源码和路径解析规则说明的过程，不表示本次整理笔记时实际运行了服务器或抓取了网络请求。

### 6.4 页面 URL 末尾的 `/` 也会影响结果

下面仍假设没有 `<base>` 标签修改基准：

| 当前页面路径 | 页面中的资源引用 | 最终请求路径 |
| --- | --- | --- |
| `/account/create` | `./css/bootstrap.css` | `/account/css/bootstrap.css` |
| `/account/create/` | `./css/bootstrap.css` | `/account/create/css/bootstrap.css` |
| `/account` | `./css/bootstrap.css` | `/css/bootstrap.css` |
| `/account/` | `./css/bootstrap.css` | `/account/css/bootstrap.css` |

这也解释了一种常见现象：同样的相对路径，在某个页面恰好能用，换到更深层的页面就失效。决定解析结果的是页面的 URL 结构。

## 7. 为什么改成 `/css/bootstrap.css` 就可以？

当前 [create.ejs](../代码/accounts/views/create.ejs) 中的 CSS 引用是：

```html
<link href="/css/bootstrap.css" rel="stylesheet" />
<link href="/css/bootstrap-datepicker.css" rel="stylesheet" />
```

JavaScript 引用是：

```html
<script src="/js/jquery.min.js"></script>
<script src="/js/bootstrap.min.js"></script>
<script src="/js/bootstrap-datepicker.min.js"></script>
<script src="/js/bootstrap-datepicker.zh-CN.min.js"></script>
<script src="/js/main.js"></script>
```

以 `/` 开头的路径从当前站点的 URL 根路径开始解析，因此不会附加页面当前所在的 `/account/` 等路径层级。

在本文的示例服务地址下：

```text
页面：http://localhost:3000/account/create
引用：/css/bootstrap.css

请求：http://localhost:3000/css/bootstrap.css
```

服务器随后把 `/css/bootstrap.css` 映射到 `public/css/bootstrap.css`，于是能找到正确文件。

更准确地说，`/css/bootstrap.css` 叫作**根相对路径**。课程中也可能把它叫“绝对路径”，但它并不包含完整的协议、主机和端口，也不是操作系统中的绝对文件路径。

| 写法 | 含义 |
| --- | --- |
| `./css/bootstrap.css` | 相对于当前文档 URL 的目录解析 |
| `css/bootstrap.css` | 在本例中与上面的相对路径写法效果相同 |
| `/css/bootstrap.css` | 从当前站点的 URL 根路径解析 |
| `http://localhost:3000/css/bootstrap.css` | 包含协议、主机、端口的完整 URL |

在当前项目的配置下，使用 `/css/...`、`/js/...` 能避免资源路径随页面路由层级变化而变化。若以后为静态资源增加了挂载前缀，则需要按新配置调整引用。

## 8. EJS 文件的磁盘位置，不是浏览器解析资源路径的基准

模板文件位于：

```text
accounts/views/create.ejs
```

这不意味着浏览器会从 `views` 目录开始查找 CSS，也不意味着必须在 HTML 中写 `../public/css/bootstrap.css`。

执行过程是：

```text
浏览器请求 /account/create
    ↓
Express 的业务路由执行 res.render('create')
    ↓
服务器找到 views/create.ejs，并渲染为 HTML
    ↓
浏览器收到 HTML
    ↓
浏览器根据 HTML 中的资源地址发起新的 HTTP 请求
```

浏览器得到的是渲染后的 HTML，并不会获知这个 HTML 在服务器上由哪个磁盘文件生成。因此，它使用页面 URL 解析资源地址，而不是使用 `create.ejs` 的磁盘路径。

当前模板没有 `<base>` 标签，所以上面的解释直接适用于这个页面。

## 9. `views` 配置和静态资源配置各管什么？

在 `app.js` 中，可以看到两组相关但职责不同的配置：

```js
// 指定服务器在哪里查找页面模板，以及使用哪种模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 指定服务器从哪里提供静态文件
app.use(express.static(path.join(__dirname, 'public')));
```

| 配置 | 用途 | 当前项目中的例子 |
| --- | --- | --- |
| `app.set('views', ...)` | 指定模板查找目录 | `res.render('create')` 查找 `views/create.ejs` |
| `app.set('view engine', 'ejs')` | 指定模板引擎 | 使用 EJS 将模板渲染为 HTML |
| `app.use(express.static(...))` | 注册静态文件服务 | 请求 `/css/bootstrap.css` 时查找 `public/css/bootstrap.css` |

**设置了模板目录，不等于把模板目录直接作为静态资源目录公开。** 当前项目通过业务路由渲染 EJS 页面，通过静态资源中间件提供 CSS、JavaScript 等文件。

## 10. 如果静态资源挂载到 `/static`，会有什么变化？

下面是为了说明映射关系的假设示例，**不是当前项目的配置，也不需要为了理解本笔记而修改代码**。

假设改成：

```js
app.use('/static', express.static(path.join(__dirname, 'public')));
```

那么 URL 前缀就变成 `/static`，对应关系为：

```text
浏览器请求 /static/css/bootstrap.css
    ↓
匹配挂载前缀 /static
    ↓
静态资源中间件处理剩余路径 /css/bootstrap.css
    ↓
查找 accounts/public/css/bootstrap.css
```

页面引用需要配套写成：

```html
<link href="/static/css/bootstrap.css" rel="stylesheet" />
<script src="/static/js/jquery.min.js"></script>
```

这里并不需要真的创建 `public/static` 目录。`/static` 是 URL 的挂载前缀，`public` 是磁盘上的资源根目录，二者由配置关联起来。

同样，如果明确配置为：

```js
app.use('/public', express.static(path.join(__dirname, 'public')));
```

才会使用 `/public/css/bootstrap.css` 这样的地址。URL 里是否出现 `public`，取决于挂载配置，而不只取决于磁盘文件夹的名字。

## 11. 遇到样式或脚本加载失败时，怎样定位？

可以按下面的顺序检查。它们是以后调试时可执行的步骤，本笔记并未替你启动服务或操作浏览器。

1. **看页面的真实 URL。** 注意路径层级以及末尾有没有 `/`。
2. **看模板中的资源引用。** 分清 `./css/...` 与 `/css/...`，不要把模板的磁盘位置作为计算基准。
3. **在浏览器开发者工具的 Network 面板中查看资源请求。** 重点看实际请求 URL、状态码和返回内容，确认是否请求到了 `/account/css/...` 等错误地址。
4. **检查 `app.js` 的静态资源配置。** 确认资源根目录和 URL 挂载前缀。
5. **按照映射关系核对磁盘文件。** 例如 `/css/bootstrap.css` 在当前配置下应对应 `public/css/bootstrap.css`。
6. **检查中间件顺序。** 当前项目先注册静态资源中间件，再注册业务路由，最后是 404 处理；如果请求提前被其他处理逻辑结束，后面的静态资源中间件就没有机会响应。

本例中最关键的对应关系是：

```text
错误引用：./css/bootstrap.css
页面地址：/account/create
请求路径：/account/css/bootstrap.css
查找文件：public/account/css/bootstrap.css

正确引用：/css/bootstrap.css
页面地址：/account/create
请求路径：/css/bootstrap.css
查找文件：public/css/bootstrap.css
```

真正决定结果的是两条规则共同起作用：**浏览器怎样解析资源 URL，以及 Express 怎样把请求路径映射到磁盘文件。**

## 12. 相关代码与阅读资料

- [配套笔记：Express 项目生成器与 npm 依赖安装](01_Express项目生成器与npm依赖安装.md)
- [app.js：模板引擎、静态资源、路由及错误处理配置](../代码/accounts/app.js)
- [routes/index.js：添加记录页面路由](../代码/accounts/routes/index.js)
- [views/create.ejs：CSS 和 JavaScript 引用](../代码/accounts/views/create.ejs)
- [public/css：样式文件目录](../代码/accounts/public/css/)
- [public/js：脚本文件目录](../代码/accounts/public/js/)
- [Express 官方文档：提供静态文件](https://expressjs.com/en/starter/static-files/)
