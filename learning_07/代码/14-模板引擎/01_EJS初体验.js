//1. 安装 EJS
//2. 导入 EJS
const ejs = require('ejs');
const fs = require('fs');

//字符串
let china_01 = '中国';
// let str = `我爱你 ${china}`;
let weather = '今天天气不错~';

//声明变量
let str = fs.readFileSync('./01_html.html').toString();

//使用 ejs 渲染
let result = ejs.render(str, {china: china_01, weather});

console.log(result);

/*
 * EJS 初体验：模板数据、对象属性与属性简写学习笔记
 *
 * 本笔记整理自本次 AI 咨询中的两次解释，并结合当前代码中的 china_01 命名说明。
 * 以下示例全部位于多行注释中，只用于阅读，不会执行。
 *
 * 一、先看当前代码中的数据是怎样传入 EJS 的
 *
 * 当前 JavaScript 代码的关键部分：
 *
 *   let china_01 = '中国';
 *   let weather = '今天天气不错~';
 *   let str = fs.readFileSync('./01_html.html').toString();
 *   let result = ejs.render(str, {china: china_01, weather});
 *
 * 对应的 01_html.html 模板内容：
 *
 *   <h2>我爱你 <%= china %></h2>
 *   <p><%= weather %></p>
 *
 * 在当前调用中，ejs.render 的两个参数分别是：
 *   第一个参数 str：要渲染的模板字符串，即从 HTML 文件中读出的内容。
 *   第二个参数对象：提供给模板使用的数据。
 *
 * 可以先把第二个参数的简写展开，便于观察：
 *
 *   let result = ejs.render(str, {
 *     china: china_01,
 *     weather: weather
 *   });
 *
 * EJS 根据模板中的表达式读取传入的数据，生成渲染后的字符串。
 * 本例生成的 HTML 中，相应部分为：
 *
 *   <h2>我爱你 中国</h2>
 *   <p>今天天气不错~</p>
 *
 * 二、对象中冒号左边和右边分别是什么意思？
 *
 * JavaScript 对象属性的基本写法是：
 *
 *   { 属性名: 提供属性值的表达式 }
 *
 * 例如：
 *
 *   { china: china_01 }
 *
 *   左边的 china：对象的属性名，也叫键名。
 *   右边的 china_01：变量名，JavaScript 会读取这个变量当前的值。
 *   最终的属性值：字符串 '中国'。
 *
 * 因为前面定义了：
 *
 *   let china_01 = '中国';
 *
 * 所以在当前情况下，下面两种写法提供的数据相同：
 *
 *   { china: china_01 }
 *   { china: '中国' }
 *
 * 注意：写 china_01 时，保存到属性中的是变量的值 '中国'，
 * 不是变量名这个字符串 'china_01'。
 *
 *   { china: china_01 }     // 读取变量的值，结果为 '中国'
 *   { china: 'china_01' }   // 直接使用字符串，结果为 'china_01'
 *
 * 加不加引号，含义不同。右边如果使用变量，这个变量必须能在当前位置访问。
 * 左边这种普通的属性名写法，则不会去读取同名变量的值。
 *
 * 三、原来写成 china: china，为什么两个名字可以一样？
 *
 * 原来的写法是：
 *
 *   let china = '中国';
 *   let result = ejs.render(str, {china: china, weather});
 *
 * 虽然两个 china 拼写相同，但在语法中的作用不同：
 *
 *   { china: china }
 *       ↑      ↑
 *     属性名   变量名，用来读取变量的值
 *
 * JavaScript 根据它们所在的位置区分含义，因此不会因为同名而混淆。
 * 两边也不要求同名；为了便于学习，可以把变量改成 china_01：
 *
 *   let china_01 = '中国';
 *   let result = ejs.render(str, {china: china_01, weather});
 *
 * 这正是当前文件采用的写法，更容易看出属性名与变量名的区别。
 *
 * 四、模板中的 china 到底对应对象中的哪一个名称？
 *
 * 模板中的：
 *
 *   <%= china %>
 *
 * 对应传入对象中冒号左边的属性名 china：
 *
 *   { china: china_01 }
 *
 * 在当前这种直接通过数据对象向模板提供数据的写法下，
 * 模板使用 china，数据对象就需要提供名为 china 的属性。
 *
 * 数据传递过程：
 *
 *   JavaScript 变量 china_01，值为 '中国'
 *                  ↓
 *   { china: china_01 } 把这个值放到 china 属性中
 *                  ↓
 *   EJS 模板通过 <%= china %> 读取这份数据
 *                  ↓
 *   输出：中国
 *
 * 模板中的 china 并不是根据右边的变量名 china_01 自动匹配出来的。
 * 也不要认为本文件中声明的变量会自动全部提供给模板；
 * 在本例中，应通过传给 ejs.render 的数据对象明确提供模板要使用的数据。
 *
 * 五、如果想改名，需要同步修改哪些地方？
 *
 * 情况一：修改 JavaScript 变量名，保留对象属性名。
 *
 *   let china_01 = '中国';
 *   let result = ejs.render(str, {china: china_01, weather});
 *
 * HTML 模板保持：
 *
 *   <h2>我爱你 <%= china %></h2>
 *
 * 此时需要同步修改的是变量声明和 JavaScript 中对该变量的引用，
 * 模板里的 china 不需要修改，因为数据对象的属性名仍然是 china。
 *
 * 情况二：修改对象属性名，保留 JavaScript 变量名。
 *
 *   let china_01 = '中国';
 *   let result = ejs.render(str, {country: china_01, weather});
 *
 * HTML 模板需要对应改成：
 *
 *   <h2>我爱你 <%= country %></h2>
 *
 * 如果对象只提供 country，而模板仍然访问 china，
 * 在本例没有其他 china 定义的情况下，渲染时就会出现 china 未定义的错误。
 *
 * china、country 都不是 EJS 规定的固定名称，而是我们自己选择的名称。
 * 关键是：传入对象提供的属性名，要与模板中访问数据时使用的名称对应。
 *
 * 六、冒号右边只能写变量吗？
 *
 * 不是。冒号右边可以写具体的值、变量，或者其他表达式。
 *
 *   { china: '中国' }          // 直接提供字符串值
 *   { china: china_01 }        // 读取变量的值
 *   { china: '中' + '国' }     // 先计算表达式，再使用计算结果
 *
 * 当 china_01 的值为 '中国' 时，上面三个例子中的 china 属性值相同。
 *
 * 因此，更准确的理解是：右边的表达式负责提供属性值。
 * 不能把“变量名”和“变量中保存的值”当成同一个概念。
 *
 * 七、weather 为什么只写一个？这是什么语法？
 *
 * 当前代码中：
 *
 *   let weather = '今天天气不错~';
 *   let result = ejs.render(str, {china: china_01, weather});
 *
 * 这里单独出现的 weather 使用了 JavaScript 的“对象属性简写”。
 *
 * 完整写法：
 *
 *   { weather: weather }
 *
 * 简写形式：
 *
 *   { weather }
 *
 * 这两种写法等价。简写后，属性名仍然叫 weather，
 * 属性值仍然来自变量 weather，冒号和重复的变量名一起省略。
 *
 * 这里要特别区分三个概念：
 *
 *   属性名：weather
 *   作为属性值来源的变量名：weather
 *   变量的值，也就是最终的属性值：'今天天气不错~'
 *
 * 正确规则：属性名与作为属性值的变量名相同时，可以使用属性简写。
 * 不准确的说法：属性名与属性值相同时，可以简写。
 *
 * 本例中，weather 和 '今天天气不错~' 显然不是同一个内容，
 * 能够简写，是因为属性名和变量名都叫 weather。
 *
 * 八、属性简写与 EJS 有关系吗？
 *
 * 属性简写是 JavaScript 本身的语法，与是否使用 EJS 无关。
 * 即使完全不用模板引擎，下面的写法也成立：
 *
 *   let weather = '今天天气不错~';
 *   let data = {weather};
 *   console.log(data);
 *   // 得到的对象：{ weather: '今天天气不错~' }
 *
 * 在本例中，可以把两个规则分别理解：
 *
 *   1. 模板使用 <%= weather %>，所以数据对象要提供 weather 属性。
 *   2. 该属性的值恰好来自变量 weather，所以 weather: weather 可以简写。
 *
 * 完整写法和简写形式都正确，并不是必须简写。
 * 学习阶段写成 weather: weather，更便于观察对象的结构。
 *
 * 九、china: china_01 可以直接简写成 china_01 吗？
 *
 * 如果希望保持当前模板不变，就不可以这样替换，因为会改变属性名。
 *
 *   { china: china_01 }   // 属性名为 china
 *   { china_01 }         // 等价于 { china_01: china_01 }，属性名为 china_01
 *
 * 虽然两者都能用到变量 china_01 的值，但是提供给模板的属性名不同。
 * 当前模板使用的是 <%= china %>，所以需要保留 china: china_01。
 *
 * 如果使用原来的同名变量，则可以简写：
 *
 *   let china = '中国';
 *   let weather = '今天天气不错~';
 *
 *   { china: china, weather: weather }
 *   // 可以简写为：
 *   { china, weather }
 *
 * 十、第 8 行的模板字符串与 EJS 有什么区别？
 *
 * 第 8 行原来的注释代码：
 *
 *   // let str = `我爱你 ${china}`;
 *
 * 这是 JavaScript 自己的“模板字符串”语法：
 *   使用反引号包围字符串。
 *   使用 ${...} 计算表达式，并把结果插入字符串。
 *
 * 例如，如果变量仍然叫 china：
 *
 *   let china = '中国';
 *   let message = `我爱你 ${china}`;
 *   // message 的值为 '我爱你 中国'
 *
 * ${china} 直接访问当前 JavaScript 作用域中可以访问到的变量 china。
 * 它不需要通过 ejs.render，也不需要先构造一个传给 EJS 的数据对象。
 *
 * 当前文件中的变量已经改名为 china_01，所以对应的写法应当是：
 *
 *   let message = `我爱你 ${china_01}`;
 *
 * EJS 的写法则是：
 *
 *   JavaScript 提供数据：ejs.render(str, {china: china_01});
 *   HTML 模板使用数据：<h2>我爱你 <%= china %></h2>
 *
 * 两者的对应关系不同：
 *
 *   ${china_01} 里的名称 → JavaScript 中可以访问到的变量名。
 *   本例 <%= china %> 里的名称 → 传给 EJS 的数据对象中的属性名。
 *
 * 十一、如果恢复第 8 行，需要注意什么？
 *
 * 当前第 8 行被注释，因此不会执行，其中旧的 china 名称不会影响当前运行。
 * 如果要取消注释，需要同时考虑两件事：
 *
 *   1. 变量已经叫 china_01，所以 ${china} 应改为 ${china_01}。
 *   2. 第 12 行已经有 let str，同一作用域不能再用 let 重复声明 str。
 *
 * 如果只是想同时观察 JavaScript 模板字符串的效果，可以另取变量名：
 *
 *   let message = `我爱你 ${china_01}`;
 *   console.log(message);
 *
 * 这样既能观察字符串插值，也不会与读取 HTML 模板时声明的 str 重名。
 *
 * 十二、记忆要点
 *
 *   对象属性：{ 属性名: 提供属性值的表达式 }。
 *   本例模板中的名称，对应数据对象的属性名。
 *   冒号右边写变量时，读取的是变量的值，不是把变量名当作字符串。
 *   属性名和变量名可以不同，例如 china: china_01。
 *   属性名和变量名相同时，可以简写，例如 weather: weather → weather。
 *   简写是可选的；完整写法同样正确，而且适合学习时观察语法结构。
 */
