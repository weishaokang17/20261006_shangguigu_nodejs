//1. 安装 mongoose
//2. 导入 mongoose
const mongoose = require('mongoose');

//设置 strictQuery 为 true
mongoose.set('strictQuery', true);

//3. 通过 SSH 隧道连接云服务器上的 MongoDB
// 本地 127.0.0.1:27018 由 SSH 转发到云服务器的 127.0.0.1:27017。
mongoose
  .connect('mongodb://127.0.0.1:27018/bilibili', {
    user: 'mongo_admin',
    pass: 'wskygx2025$',
    authSource: 'admin', // 用户在 admin 中认证，业务数据使用 bilibili 数据库
    serverSelectionTimeoutMS: 5000
  })
  .catch((err) => {
    console.error('初次连接 MongoDB 失败：', err.message);
    process.exitCode = 1;
  });

//4. 设置回调
// 设置连接成功的回调  once 一次   事件回调函数只执行一次
mongoose.connection.once('open', () => {
  //5. 创建文档的结构对象
  //设置集合中文档的属性以及属性值的类型
  let BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    price: Number,
    is_hot: Boolean,
    tags: Array,
    pub_time: Date,
    test: mongoose.Schema.Types.Mixed // 文档 ID
  });

  //6. 创建模型对象  对文档操作的封装对象
  let BookModel = mongoose.model('books', BookSchema);

  //7. 新增
  BookModel.create({
    name: '封神演义',
    author: '许仲琳',
    price: 29.9,
    is_hot: true,
    tags: ['鬼怪','励志','社会'],
    pub_time: new Date(),
    test: new Date()
  }, (err, data) => {
    //判断是否有错误
    if(err) {
      console.log(err);
      return;
    }
    //如果没有出错, 则输出插入后的文档对象
    console.log(data);
    //8. 关闭数据库连接 (项目运行过程中, 不会添加该代码)
    mongoose.disconnect();
  });


});

// 设置连接错误的回调
mongoose.connection.on('error', () => {
  console.log('连接失败');
}); 

//设置连接关闭的回调
mongoose.connection.on('close', () => {
  console.log('连接关闭');
}); 

/*
 * 学习笔记：Mongoose 字段类型、JavaScript 构造函数与 TypeScript 声明文件
 *
 * 一、先明确结论：上面的 Schema 配置是普通 JavaScript
 *
 *   new mongoose.Schema({
 *     name: String,
 *     author: String,
 *     price: Number,
 *     is_hot: Boolean,
 *     tags: Array,
 *     pub_time: Date,
 *     test: mongoose.Schema.Types.Mixed
 *   });
 *
 * 这段代码没有使用 TypeScript 的类型标注语法。
 * String、Number、Boolean、Array、Date 都是 JavaScript 自带的内置构造函数。
 * mongoose.Schema.Types.Mixed 则是 Mongoose 提供的字段类型配置。
 *
 * 必须区分三个层次：
 *   1. JavaScript 语法：创建对象，把函数等值赋给对象属性。
 *   2. Mongoose 约定：读取这个对象，把这些值解释为字段的类型规则。
 *   3. TypeScript 类型声明：供编辑器和类型检查工具理解代码。
 *
 * “代码里描述了字段类型”不等于“代码使用了 TypeScript 语法”。
 *
 * 二、这些字段具体表示什么？
 *
 *   name: String
 *     书名按字符串字段处理，例如 '封神演义'。
 *
 *   author: String
 *     作者按字符串字段处理，例如 '许仲琳'。
 *
 *   price: Number
 *     价格按数字字段处理，例如 29.9、100。
 *     这里的 Number 不是“仅允许整数”，也不是专门的高精度十进制金额类型。
 *
 *   is_hot: Boolean
 *     是否热门，按布尔值字段处理，例如 true、false。
 *
 *   tags: Array
 *     标签按数组字段处理，例如 ['鬼怪', '励志', '社会']。
 *     这种写法没有限定数组元素的具体类型，相当于 Mixed 元素数组。
 *     如果需要字符串数组，可以写 tags: [String]。
 *
 *   pub_time: Date
 *     发布时间按日期字段处理，例如 new Date()。
 *     Date 是 JavaScript 自带的构造函数，不是 TypeScript 专属功能。
 *
 *   test: mongoose.Schema.Types.Mixed
 *     不把这个字段限定为某一种具体类型。
 *     可以放字符串、数字、对象、数组、日期等可存储的数据。
 *     “不限定具体类型”不表示数据库可以保存任意 JavaScript 运行时资源。
 *
 * 注意：上方 test 字段旁边原有的“文档 ID”注释不准确。
 * Mixed 表示混合类型，不是 ObjectId 类型；本笔记只说明这一点，未更改原配置。
 * 如果要配置 ObjectId 字段，写法是：
 *
 *   test: mongoose.Schema.Types.ObjectId
 *
 * Mongoose 通常会自动为文档添加 _id 字段，不需要用 test 代替它。
 * Schema.Types.ObjectId 用于配置字段；创建具体 ID 值通常使用：
 *
 *   new mongoose.Types.ObjectId()
 *
 * 三、为什么 name: String 是 JavaScript，而不是 TypeScript？
 *
 * 在这里，冒号属于对象字面量语法，表示“属性名: 属性值”。
 *
 *   const config = {
 *     name: String
 *   };
 *
 * 这段代码表示：创建一个对象，它的 name 属性保存 String 函数本身。
 * 并不是给某个名为 name 的变量添加 TypeScript 类型标注。
 *
 * JavaScript 中，函数也可以作为值传递、保存到变量或对象属性中：
 *
 *   function sayHello() {
 *     console.log('你好');
 *   }
 *
 *   const actions = {
 *     handler: sayHello
 *   };
 *
 *   actions.handler(); // 输出：你好
 *
 * handler: sayHello 与 name: String 在语法层面是同样的道理。
 * 前者保存自定义函数，后者保存 JavaScript 内置函数。
 *
 *   const config = { name: String };
 *   console.log(typeof String);          // 'function'
 *   console.log(config.name === String); // true
 *   console.log(config.name(123));        // '123'
 *
 * 注意以下三种写法的区别：
 *
 *   String          // 引用函数本身，没有调用
 *   String(123)     // 调用函数，得到字符串基本值 '123'
 *   new String(123) // 通过构造调用创建字符串包装对象
 *
 * Schema 中使用的是第一种写法：把 String 函数本身作为配置值传入。
 *
 * 四、Mongoose 如何理解这个普通对象？
 *
 *   const config = {
 *     name: String,
 *     price: Number
 *   };
 *
 *   const schema = new mongoose.Schema(config);
 *
 * JavaScript 负责创建 config 对象；Mongoose 负责解释 config 的含义。
 * Mongoose 识别到 String、Number 后，会为对应路径建立 SchemaType 配置，
 * 用于运行时的类型转换、验证以及其他字段行为。
 *
 * 简写与展开写法如下：
 *
 *   name: String
 *
 *   name: { type: String }
 *
 * 对这个简单字段而言，两者都表示字符串字段。
 * 展开后可以继续配置 required、default 等选项，例如：
 *
 *   name: { type: String, required: true }
 *
 * type、required 等含义来自 Mongoose 的 API 约定，仍然不是 TS 语法。
 * 仅写 name: String 并不意味着字段必填；必填需要另外设置 required。
 * 这些 Schema 规则由 Mongoose 执行，不会自动变成数据库端的集合验证规则。
 *
 * 五、大写 String、小写 string 与“包装类型”的关系
 *
 * JavaScript 的字符串基本值：
 *
 *   const a = '你好';
 *   console.log(typeof a); // 'string'
 *
 * JavaScript 内置 String 函数进行转换：
 *
 *   const b = String(123);
 *   console.log(b);        // '123'
 *   console.log(typeof b); // 'string'
 *
 * JavaScript 字符串包装对象：
 *
 *   const c = new String('你好');
 *   console.log(typeof c); // 'object'
 *
 * 包装对象机制本来就是 JavaScript 的功能，并不是 TypeScript 发明的。
 * Number、Boolean 也存在类似的基本值与包装对象区别。
 * 日常保存字符串、数字、布尔值时，通常直接使用基本值即可。
 * Array 和 Date 虽然也是内置构造函数，但不应统称为这些基本值的包装类型。
 *
 * 在 typeof a 的结果中，'string' 是一个字符串标签。
 * 在 TypeScript 的 let a: string 中，string 是类型标注。
 * 不要仅凭名称相同，就把不同语法位置的含义混在一起。
 *
 * 上面的 name: String 没有执行 new String()，
 * 也不表示书名会被 Mongoose 保存成字符串包装对象。
 *
 * 六、真正的 TypeScript 类型语法是什么样的？
 *
 * 下面是 TypeScript 示例，放在注释中用于对照：
 *
 *   interface Book {
 *     name: string;
 *     author: string;
 *     price: number;
 *     is_hot: boolean;
 *     tags: string[];
 *     pub_time: Date;
 *     test: unknown;
 *   }
 *
 *   const book: Book = {
 *     name: '封神演义',
 *     author: '许仲琳',
 *     price: 29.9,
 *     is_hot: true,
 *     tags: ['鬼怪', '励志'],
 *     pub_time: new Date(),
 *     test: { remark: '附加信息' }
 *   };
 *
 * interface Book、const book: Book 才涉及 TypeScript 的类型语法。
 * 上例 test: unknown 是静态类型设计示例，不是 Mixed 的语法替代品。
 * unknown 允许接收各种值，但使用这个值前通常需要先缩小类型范围。
 *
 * TypeScript 中标注普通基本值，通常使用小写：
 *
 *   let title: string = '封神演义';
 *   let price: number = 29.9;
 *   let hot: boolean = true;
 *
 * 不应使用大写 String、Number、Boolean 来标注普通基本值。
 * Date 类型仍写 Date；数组可写 string[] 或 Array<string>。
 * “类型名一律小写”也不是正确规则，需要区分具体类型。
 *
 * 七、Mongoose 字段规则与 TypeScript 类型检查的作用时间不同
 *
 * Mongoose Schema：
 *   程序运行时生效，会按字段配置尝试转换数据，并进行相应验证。
 *
 * TypeScript 类型标注：
 *   在编辑器或类型检查阶段帮助发现问题。
 *   类型标注本身不会在运行时自动转换数据，也不是运行时验证器。
 *
 * 假设 Mongoose 配置了 price: Number：
 *
 *   const book = new BookModel({ price: '29.9' });
 *   console.log(book.price);        // 29.9
 *   console.log(typeof book.price); // 'number'
 *
 * 这里由 Mongoose 把可转换的字符串 '29.9' 转成了数字。
 * 项目安装的 Mongoose 6.9.2 已用不连接数据库的示例验证过这一行为。
 * 这不代表任何字符串都能成功转换；无法转换的值会导致转换/验证错误。
 *
 * 对照 TypeScript：
 *
 *   let price: number = '29.9'; // 静态类型检查报错
 *
 * : number 不会把右侧字符串自动变成数字。
 * 如果确实需要转换，应显式调用 Number(...) 并根据业务需要检查结果。
 *
 * 八、tags: Array 与 tags: [String] 的区别
 *
 *   tags: Array
 *     只配置为数组，不限定元素具体类型。
 *     例如 ['鬼怪', 123, { label: '社会' }] 可作为混合元素数组。
 *
 *   tags: [String]
 *     配置为字符串数组，Mongoose 会按字符串规则处理数组中的元素。
 *     这里可能发生类型转换，不等于“传入任何非字符串都立即报错”。
 *
 * [String] 本身也是合法 JavaScript：一个数组，其中放着 String 函数。
 * Mongoose 再赋予它“字符串数组字段配置”的含义。
 *
 * Mixed 还有一个使用细节：如果修改已加载文档中 Mixed 对象的内部内容，
 * Mongoose 不一定能自动追踪这种变化，保存前可能需要显式标记：
 *
 *   book.test.someKey = '新值'; // 假设 test 当前是一个对象
 *   book.markModified('test');
 *   await book.save();
 *
 * 九、为什么 Command 点击这些名称，会跳到 .ts 文件？
 *
 * 即使当前文件是 .js，Command 点击 String、Number、Date 等，
 * 也经常会跳转到 lib.es5.d.ts 等文件。这是正常的编辑器导航行为。
 *
 * 请注意完整后缀是 .d.ts：
 *   d 表示 declaration（声明）。
 *   .d.ts 是 TypeScript 类型声明文件，主要描述类型和已有值的形状。
 *   它不提供这些函数的运行时实现。
 *
 * 可以把它理解为“给编辑器和类型检查工具看的 API 说明书”。
 *
 * 以 VS Code 为例，其 JavaScript 智能功能也使用 TypeScript 语言服务。
 * 编辑器通过推断、JSDoc、.d.ts 等信息理解 JavaScript，提供：
 *   - 自动补全；
 *   - 参数与返回值提示；
 *   - 悬停说明；
 *   - 定义导航等功能；
 *   - 在启用相应检查时提供类型诊断。
 *
 * 因此，JavaScript 文件获得 TS 语言服务的帮助，
 * 不等于这个 JavaScript 文件本身使用了 TS 类型标注语法。
 *
 * 十、String 在 .d.ts 中的声明应该怎样理解？
 *
 * 下面是关键结构的简化示例：
 *
 *   interface StringConstructor {
 *     new (value?: any): String;
 *     (value?: any): string;
 *     readonly prototype: String;
 *   }
 *
 *   declare var String: StringConstructor;
 *
 * 逐行理解：
 *
 *   new (value?: any): String;
 *     描述 new String(...) 这种构造调用，返回字符串包装对象。
 *
 *   (value?: any): string;
 *     描述 String(...) 这种普通调用，返回字符串基本值。
 *
 *   readonly prototype: String;
 *     描述构造函数的 prototype 属性及其类型。
 *
 *   declare var String: StringConstructor;
 *     告诉类型系统：运行环境中存在 String，其形状符合上述接口。
 *     declare 不会创建 String，也不会实现字符串转换功能。
 *
 * 所以，跳转后的文件确实可以使用 TypeScript 声明语法；
 * 但原文件中的 name: String 仍然只是 JavaScript 对象属性赋值。
 * 两个文件用途不同，不存在矛盾。
 *
 * 十一、“编辑器跳转目标”与“运行时实现”要分开理解
 *
 * 对于当前代码 name: String：
 *
 *   编辑阶段：
 *     编辑器读取 .d.ts 中的描述，知道 String 是什么，并提供导航和提示。
 *
 *   运行阶段：
 *     Node.js 使用 JavaScript 引擎提供的真实内置 String 函数。
 *     Mongoose 读取这个函数值，建立字符串字段规则。
 *
 * Node.js 不需要执行 lib.es5.d.ts 才能获得 String。
 * 即使没有这些编辑器声明文件，JavaScript 运行环境依然提供 String。
 * 受到影响的主要是编辑器理解代码、提示和检查代码的能力。
 *
 * 十二、为什么 Mongoose 的 API 也会跳转到 .d.ts？
 *
 * 第三方库也可以附带类型声明，帮助 JavaScript 和 TypeScript 使用者。
 * 当前项目安装的 Mongoose 在 package.json 中声明了：
 *
 *   "types": "./types/index.d.ts"
 *
 * 它告诉类型工具：这个库的类型声明入口在哪里。
 * 因此点击 mongoose.Schema、mongoose.Schema.Types.Mixed 等名称时，
 * 可能会进入 Mongoose 提供的 .d.ts 文件。
 * 这些声明服务于代码理解，不能据此判断当前调用代码使用了 TS 语法。
 *
 * 但“Command 点击任何名称都会跳到 TS 文件”不是通用规则：
 *   - JavaScript 内置名称：常见目标是 lib.es5.d.ts 等声明文件。
 *   - 提供类型声明的库 API：可能进入对应的 .d.ts 文件。
 *   - 自己在 .js 中定义的函数：通常进入自己的 .js 源码。
 *   - 提供合适源码导航信息的 TS 库：也可能进入 .ts 源码。
 *
 * 实际目标取决于编辑器、项目配置、库文件和使用的导航功能。
 * .ts 源码与 .d.ts 声明文件也需要区分，不能只看最后两个字母。
 *
 * 十三、复习时可以用下面几个问题自查
 *
 * 问：name: String 中的冒号是什么？
 * 答：普通 JavaScript 对象中，属性名与属性值之间的分隔符。
 *
 * 问：String 在这里是一个 TS 类型标注吗？
 * 答：不是，这里引用的是运行时存在的 JavaScript 内置函数。
 *
 * 问：是谁赋予它“这个字段按字符串处理”的含义？
 * 答：Mongoose 的 Schema 配置约定。
 *
 * 问：new String('你好') 返回什么？
 * 答：JavaScript 字符串包装对象；而 String('你好') 返回字符串基本值。
 *
 * 问：跳到 lib.es5.d.ts 是否说明当前文件使用了 TS 语法？
 * 答：不能说明。它说明编辑器可以通过 TS 声明理解这个名称。
 *
 * 问：类型声明文件会实现 String，或自动转换实际数据吗？
 * 答：不会。它描述类型；实际行为来自运行时实现或 Mongoose 等库的逻辑。
 *
 * 问：Mixed 是文档 ID 类型吗？
 * 答：不是。ObjectId 与 Mixed 是不同的字段配置。
 *
 * 参考文档：
 *   Mongoose 6.x SchemaTypes：
 *   https://mongoosejs.com/docs/6.x/docs/schematypes.html
 *   TypeScript 常用类型：
 *   https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
 *   TypeScript 类型声明文件：
 *   https://www.typescriptlang.org/docs/handbook/2/type-declarations.html
 *   VS Code 对 JavaScript 的支持：
 *   https://code.visualstudio.com/docs/nodejs/working-with-javascript
 */
