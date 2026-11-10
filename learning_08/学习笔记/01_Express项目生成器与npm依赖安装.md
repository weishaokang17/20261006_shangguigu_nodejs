# Express 项目生成器与 npm 依赖安装

本文整理自一次关于 `accounts` 项目初始化的学习问答，重点解释 `express -e accounts` 与 `npm i` 分别做了什么，以及两条命令为什么能够前后衔接。

文中的项目实例来自 [accounts 项目](../代码/accounts/)。当前项目已经包含课程中的业务代码，因此需要区分“生成器刚生成的项目”和“继续开发后的当前项目”。本文中的初始化命令用于说明流程，无须在现有项目中重新执行。

## 1. 原始问题

> 通过 `express -e accounts` 这个命令创建了 `accounts` 文件夹以后，这是 Express 定制的目录结构，对吗？相当于是一个快速创建各种目录结构的命令，是吧？
>
> 紧接着课程中就执行了 `npm -i` 这个命令。为什么紧接着就可以拉取各种包？是不是因为前面的命令创建好固定结构以后，在 `package.json` 里面也已经指定了要导入哪些包，所以紧接着就可以安装？

## 2. 先明确答案与命令写法

这两个理解的主要方向都是正确的：

1. `express -e accounts` 会调用 Express 项目生成器，生成项目目录、初始代码、模板文件和配置文件。
2. 生成的 `package.json` 已经声明了基础项目需要的依赖，因此进入项目目录后，执行 `npm i` 就能按照这份声明安装依赖。

其中有一个命令细节需要纠正：安装命令是 `npm i`，不是 `npm -i`。

```bash
npm i
```

它等价于：

```bash
npm install
```

这里的 `i` 是 `install` 子命令的别名，前面没有横线。相比之下，`express -e accounts` 中的 `-e` 才是一个带横线的选项。两者在命令中的角色不同。[npm install 官方文档](https://docs.npmjs.com/cli/v8/commands/npm-install/)

## 3. `express -e accounts` 到底是什么命令？

可以把它分成三部分理解：

| 命令部分 | 含义 |
| --- | --- |
| `express` | 调用 Express 应用生成器提供的命令 |
| `-e` | 选择 EJS 模板引擎 |
| `accounts` | 将项目生成到名为 `accounts` 的目录中 |

这类帮助开发者创建初始项目的工具，通常叫作“脚手架”。这里提供生成能力的工具名称是 `express-generator`。

课程中能够直接使用 `express` 命令，通常是因为之前已经安装过生成器，例如：

```bash
npm install -g express-generator
```

这是一种常见的准备方式。仅凭当前项目文件，不能确定课程环境当时具体通过什么方式安装了生成器。

Express 官方文档将生成器的用途描述为快速创建应用骨架，并列出了 `-e` / `--ejs` 选项。[Express 应用生成器官方文档](https://expressjs.com/en/starter/generator/)

### 3.1 `express-generator` 和 `express` 有什么区别？

这两个名称很像，但用途不同：

| 名称 | 职责 | 在本例中的作用 |
| --- | --- | --- |
| `express-generator` | 生成项目的工具 | 创建 `accounts` 的目录、文件和初始配置 |
| `express` | 项目运行时使用的 Web 框架 | 在应用代码中处理路由、中间件等逻辑 |

生成器可以帮你在 `package.json` 中写下项目需要 `express`，但“生成器已经能够运行”和“新项目的运行依赖已经安装”是两件事。这正是生成项目之后还要执行 `npm i` 的原因之一。

### 3.2 它生成的不只是空文件夹

一个使用 EJS 的生成器项目，主要结构可以概括为：

```text
accounts/
├── app.js
├── bin/
│   └── www
├── routes/
│   ├── index.js
│   └── users.js
├── views/
│   ├── index.ejs
│   └── error.ejs
├── public/
└── package.json
```

这是简化示意，省略了部分目录和文件；具体模板内容可能随生成器版本和选项有所不同。

| 文件或目录 | 主要职责 |
| --- | --- |
| `app.js` | 创建 Express 应用，配置模板引擎、中间件和路由 |
| `bin/www` | 创建 HTTP 服务、监听端口、处理启动相关事项 |
| `routes/` | 放置路由处理代码 |
| `views/` | 放置页面模板，选择 EJS 时使用 `.ejs` 文件 |
| `public/` | 放置需要对浏览器提供的静态资源 |
| `package.json` | 记录项目名称、脚本命令和依赖声明等信息 |

例如，当前项目的 [app.js](../代码/accounts/app.js) 中包含：

```js
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
```

这说明项目不仅有一个 `views` 文件夹，还已经有代码告诉 Express：到这个目录中寻找模板，并使用 EJS 处理模板。

因此，生成器同时完成了“创建文件结构”和“写入基础代码与配置”。

### 3.3 这是不是 Express 强制规定的唯一目录结构？

不是。更准确的说法是：生成器提供了一套预先设计好的项目组织方式，方便你快速开始。

你可以继续使用这套结构，也可以根据项目需要增加或调整目录。调整后，需要让相关的引用路径和配置与新结构保持一致。Express 官方也明确说明，生成器创建的结构只是组织 Express 应用的多种方式之一。[Express 应用生成器官方文档](https://expressjs.com/en/starter/generator/)

所以，“快速创建各种目录结构”可以进一步表述为：

> `express-generator` 主要用来生成 Express 应用的初始项目结构，并通过选项调整模板引擎等配置。

## 4. 为什么紧接着就可以执行 `npm i`？

因为生成器已经在项目中创建了 `package.json`，并声明了基础依赖。

当前项目的 [package.json](../代码/accounts/package.json) 中，依赖部分如下：

```json
"dependencies": {
  "cookie-parser": "~1.4.4",
  "debug": "~2.6.9",
  "ejs": "~2.6.1",
  "express": "~4.16.1",
  "http-errors": "~1.6.3",
  "lowdb": "^1.0.0",
  "morgan": "~1.9.1",
  "shortid": "^2.2.16"
}
```

注意，这是 `package.json` 中的一个片段，不是完整的独立 JSON 文件。

`dependencies` 可以理解为项目的“依赖清单”。每个键值对描述一个依赖：键是包名，值是版本要求。

例如：

```json
"express": "~4.16.1"
```

表示这个项目需要 `express` 包，并且对允许安装的版本有范围要求。

```json
"ejs": "~2.6.1"
```

表示项目需要 `ejs` 包，也指定了版本范围。理解当前流程时，先把 `~`、`^` 看成版本范围表达方式即可：它们意味着安装过程需要遵守版本约束，并不是随意下载任意版本。

### 4.1 当前依赖不一定全部来自生成器

当前的 `accounts` 已经包含记账相关的业务代码，不能把现在看到的所有依赖都归因于最初的生成命令。

- `express`、`ejs`、`cookie-parser`、`debug`、`http-errors`、`morgan` 属于这类生成器模板中的基础依赖。
- `lowdb`、`shortid` 不属于标准生成器默认提供的这组基础依赖，应是后续开发时加入的；当前文件不能证明具体是在课程哪一步添加的。

无论依赖是生成器写入的，还是后续开发时添加的，只要依赖清单已经声明了它们，npm 就能据此解析安装。

### 4.2 npm 如何知道要安装什么？

对于这个项目，执行 `npm i` 的主要过程可以理解为：

```text
读取项目的 package.json
    ↓
确定项目声明了哪些依赖、有哪些版本要求
    ↓
结合 package-lock.json 等已有信息解析具体依赖版本
    ↓
安装这些包，以及它们所依赖的其他包
    ↓
把安装结果放入项目的 node_modules
```

这个过程并不要求你在命令后面把每一个包名重新写一遍。安装时也可能复用已有缓存或已有安装结果，因此每次执行不一定都会重新从网络下载所有文件。[npm install 官方文档](https://docs.npmjs.com/cli/v8/commands/npm-install/)

## 5. 为什么 `node_modules` 中的包比清单中的条目多？

因为一个包本身也可能依赖其他包。

可以用下面的关系示意理解：

```text
你的项目
├── 直接依赖 A
│   ├── A 依赖的包 B
│   └── A 依赖的包 C
└── 直接依赖 D
    └── D 依赖的包 E
```

这张图表示依赖关系，不表示 `node_modules` 一定按这棵树原样嵌套存放。

你在自己的 `package.json` 中声明 A 和 D，npm 会继续处理 B、C、E 等间接依赖。由此可见，“清单里只有几个包”和“安装后出现很多包”并不矛盾。[npm install 官方文档](https://docs.npmjs.com/cli/v8/commands/npm-install/)

## 6. `package.json`、`package-lock.json` 和 `node_modules` 分别是什么？

| 名称 | 主要作用 | 可以怎样理解 |
| --- | --- | --- |
| `package.json` | 描述项目并声明所需依赖及版本范围 | 项目说明与依赖要求 |
| `package-lock.json` | 记录解析出的依赖树、具体版本等信息 | 具体安装方案的记录 |
| `node_modules/` | 存放安装到本地的依赖包文件 | 实际可供程序使用的代码 |

当前项目中已经存在 [package-lock.json](../代码/accounts/package-lock.json)。

当锁文件中的版本满足 `package.json` 的要求时，`npm install` 会使用锁文件记录的具体版本。如果两者不一致，npm 可能重新解析符合要求的版本并更新锁文件。因此，“按 `package.json` 安装依赖”是正确的基础理解，但安装结果还会受到锁文件的影响。[npm 关于锁文件的说明](https://docs.npmjs.com/cli/install/)

生成器写出了依赖声明，并不等于声明中的依赖包已经安装好了。这也解释了为什么生成项目之后仍然需要单独安装依赖。

## 7. 完整命令顺序中，别漏掉 `cd accounts`

从父目录开始创建一个新项目时，典型流程如下：

```bash
# 1. 创建项目骨架，选择 EJS 模板引擎
express -e accounts

# 2. 进入生成的项目目录
cd accounts

# 3. 安装这个项目声明的依赖
npm i
```

`express -e accounts` 创建子目录后，通常不会替你改变当前终端所在的目录。

假设执行第一条命令之前，终端位于：

```text
learning_08/代码/
```

创建完成后，项目位于：

```text
learning_08/代码/accounts/
```

但终端仍在父目录。执行 `cd accounts`，才能明确进入这个项目，再针对它安装依赖。

因此，课程中如果看起来“生成之后立刻安装”，可能是中间已经执行过切换目录的动作，或者终端已经通过其他操作进入项目目录；应以当时的终端工作目录为准。

## 8. 声明依赖、安装依赖、引入依赖，是三个不同动作

原问题中“`package.json` 已经指定了要导入哪些包”的理解很接近，术语上说“已经声明了需要安装哪些依赖包”更准确。

以 `express` 为例，可以把过程拆成三个步骤。

### 第一步：在配置中声明需要它

```json
"express": "~4.16.1"
```

这表达的是项目需求：这个项目需要 `express`，并且版本要符合要求。

### 第二步：把依赖安装到项目中

```bash
npm i
```

这一步准备好项目需要的依赖文件。

### 第三步：程序运行时加载并使用它

当前项目的 `app.js` 中写着：

```js
var express = require('express');
var app = express();
```

`require('express')` 负责加载 Express 模块，后面才能通过它创建应用。

`package.json` 中列出了一个包，不代表这个包已经被每个 JavaScript 文件自动引入；代码中写了 `require(...)`，也不等于 npm 会据此自动安装这个包。配置声明、包安装、运行时加载各有职责。

| 动作 | 出现的位置 | 解决的问题 |
| --- | --- | --- |
| 声明 | `package.json` | 项目需要什么？ |
| 安装 | 终端中的 `npm i` | 怎样把需要的依赖准备好？ |
| 引入 | JavaScript 中的 `require(...)` | 当前代码怎样使用已安装的模块？ |

## 9. 安装依赖与启动项目也要区分

`npm i` 的主要任务是准备依赖。启动应用通常使用项目定义的启动命令，例如：

```bash
npm start
```

当前项目的 `package.json` 中，启动脚本实际是：

```json
"scripts": {
  "start": "nodemon ./bin/www"
}
```

这表示 `npm start` 会按该脚本调用 `nodemon` 来运行 `bin/www`。`bin/www` 再加载 `app.js` 并启动 HTTP 服务。

这里补充一个与当前文件有关的观察：`scripts.start` 中出现了 `nodemon`，但当前 `package.json` 的依赖清单没有声明它。把一个命令写进 `scripts`，不会自动让 npm 把同名工具安装为项目依赖；这份启动脚本需要运行环境中已有可用的 `nodemon`。是否已在其他位置安装，需要检查环境才能确定。本文只整理配置与原理，没有执行安装或启动命令。

## 10. 用完整流程串起两个问题

```text
express-generator 提供 express 命令
    ↓
执行 express -e accounts
    ↓
创建目录、初始代码、EJS 模板和 package.json
    ↓
package.json 中已声明基础依赖
    ↓
进入 accounts 目录
    ↓
执行 npm i
    ↓
npm 根据依赖声明及锁文件等信息准备依赖
    ↓
依赖包文件出现在 node_modules 中
    ↓
启动项目时，代码通过 require(...) 加载并使用依赖
```

npm 能够安装这些包，关键在于项目已经具备依赖声明。`routes`、`views`、`public` 等目录用于组织项目代码和资源，它们本身并不告诉 npm 应该安装哪些包。

即使不用 Express 生成器，只要手动准备好有效的 `package.json` 并声明依赖，同样可以执行 `npm i` 安装。生成器的价值在于替你把初始项目文件和这份配置一起准备好。

与本篇相衔接的静态资源问题，见 [Express 静态资源配置与页面资源路径](02_Express静态资源配置与页面资源路径.md)。
