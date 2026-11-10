//声明一个函数
function tiemo(){
  console.log('贴膜...');
}

//捏脚
function niejiao(){
  console.log('捏脚....');
}

//暴露数据
// module.exports = {
//   tiemo,
//   niejiao
// }

// exports 暴露数据
// exports.niejiao = niejiao;
// exports.tiemo = tiemo;

//1. module.exports 可以暴露`任意`数据
// module.exports = 'iloveyou';
// module.exports = 521;

//2. 不能使用 `exports = value`的形式暴露数据
// exports = 'iloveyou' // X

// exports = module.exports = {}
// console.log(module.exports);  输出空对象 {}
// console.log(module.exports === exports);  输出 true

exports = module.exports = {tiemo:tiemo}
exports.tiemo = tiemo;
// exports = 'iloveyou' // X

/*
 * 学习笔记：第 32 行中的 tiemo: tiemo 是什么意思？
 *
 * 原代码：
 *   exports = module.exports = { tiemo: tiemo };
 *
 * 一、先看对象的基本语法：属性名: 属性值
 *
 *   const person = {
 *     name: '张三',
 *     age: 18
 *   };
 *
 * 在这个对象中：
 *   name 是属性名，'张三' 是属性值。
 *   age 是属性名，18 是属性值。
 *
 * 同样的规则应用到 { tiemo: tiemo }：
 *   冒号左边的 tiemo 是对象的属性名。
 *   冒号右边的 tiemo 是一个标识符，取的是当前作用域中已有的 tiemo 函数。
 *
 * 本文件开头已经声明了这个函数：
 *   function tiemo() {
 *     console.log('贴膜...');
 *   }
 *
 * 所以 { tiemo: tiemo } 的意思是：
 *   创建一个对象，这个对象有一个叫 tiemo 的属性，
 *   该属性的值是前面定义的 tiemo 函数。
 *
 * 左右两边虽然拼写相同，但作用不同：
 *   左边：给对象的属性起名字；这里的属性名相当于字符串 'tiemo'。
 *   右边：读取已有的 tiemo 函数，把这个函数作为属性值。
 *
 * 因此，这里也可以写成：
 *   { 'tiemo': tiemo }
 *
 * 注意：左边的 tiemo 不会去读取同名变量；右边的 tiemo 才会。
 *
 * 二、把左右两边换成不同名字，就更容易理解
 *
 *   const obj = {
 *     service: tiemo
 *   };
 *
 * service 是对象的属性名，tiemo 是前面已经定义的函数。
 * 因此可以通过属性名来找到这个函数并调用：
 *   obj.service(); // 输出：贴膜...
 *
 * 如果把属性名也叫作 tiemo：
 *   const obj = {
 *     tiemo: tiemo
 *   };
 *
 * 调用方式就变成：
 *   obj.tiemo(); // 输出：贴膜...
 *
 * 这两个例子的原理相同，只是对象的属性名不同。
 * 对象中保存的是同一个函数，并没有复制或重新定义一个函数：
 *   obj.tiemo === tiemo; // true（对应第二个例子）
 *
 * 三、tiemo 和 tiemo() 的区别：函数本身与函数调用结果
 *
 * 写法一：把函数本身作为属性值。
 *   const obj = {
 *     tiemo: tiemo
 *   };
 *
 * 创建对象时不会执行 tiemo 函数。
 * 之后执行下面这行代码，才会调用函数：
 *   obj.tiemo(); // 输出：贴膜...
 *
 * 写法二：调用函数，把函数的返回值作为属性值。
 *   const obj = {
 *     tiemo: tiemo()
 *   };
 *
 * 创建这个对象时，就会立即执行 tiemo()，输出“贴膜...”。
 * 由于本文件中的 tiemo 函数没有 return 语句，返回值是 undefined，
 * 所以对象创建完成后，obj.tiemo 的值就是 undefined。
 * 此时再执行 obj.tiemo() 会报错，因为 undefined 不是函数。
 *
 * console.log 输出的文字不是函数的返回值。
 * 如果希望函数向调用者返回某个值，需要使用 return。
 *
 * 四、属性简写：{ tiemo: tiemo } 可以写成 { tiemo }
 *
 * 当属性名与用作属性值的变量名或函数名相同时，
 * JavaScript 支持使用对象的“属性简写”语法。
 *
 * 完整写法：
 *   const obj = {
 *     tiemo: tiemo
 *   };
 *
 * 等价的简写：
 *   const obj = {
 *     tiemo
 *   };
 *
 * 这里不是没有属性值，而是语法允许省略重复的名字。
 *
 * 所以，本文件前面注释掉的代码：
 *   module.exports = {
 *     tiemo,
 *     niejiao
 *   };
 *
 * 等价于：
 *   module.exports = {
 *     tiemo: tiemo,
 *     niejiao: niejiao
 *   };
 *
 * 如果属性名和已有函数的名字不同，例如 service: tiemo，
 * 就不能用 { tiemo } 代替，否则属性名也会变成 tiemo。
 *
 * 五、理解完整的第 32 行：连续赋值与模块导出
 *
 *   exports = module.exports = { tiemo: tiemo };
 *
 * 对于这里的普通变量和属性，这行代码可以理解为以下两步：
 *   module.exports = { tiemo: tiemo };
 *   exports = module.exports;
 *
 * 第一步：创建一个带有 tiemo 属性的对象，并将它赋给 module.exports。
 * 第二步：让 exports 也指向这个对象。
 *
 * 这里没有创建两个对象，exports 和 module.exports 指向同一个对象：
 *   exports === module.exports; // true
 *
 * 在 Node.js 的 CommonJS 模块中，外部通过 require() 获取的导出值，
 * 取决于 module.exports。
 * 另一个位于同一目录的文件可以这样使用当前模块：
 *   const me = require('./me.js');
 *   me.tiemo(); // 输出：贴膜...
 *
 * me 得到的是导出的对象。
 * me.tiemo 访问的是该对象中名为 tiemo 的属性，
 * 这个属性保存着函数，加上 () 就是在调用这个函数。
 *
 * 补充：为什么单独写 exports = value 不能替换模块的导出值？
 *
 * 模块开始执行时，exports 和 module.exports 指向同一个初始对象。
 * 通过 exports.tiemo = tiemo 修改这个共享对象的属性，外部可以得到该属性。
 * 但直接写 exports = value，只是让 exports 重新指向另一个值，
 * 并没有替换 module.exports，因此不能用它替换模块的导出值。
 *
 * 同样，单独给 module.exports 赋一个新对象后，exports 不会自动跟着改变。
 * 第 32 行之所以让二者仍指向同一个对象，是因为它同时给二者进行了赋值。
 * 这种连续赋值不是导出对象所必需的；只写 module.exports = { tiemo }
 * 也能正确导出，只是如果后面还要使用 exports，就需要留意它的指向。
 *
 * 六、第 33 行在当前代码中属于重复赋值
 *
 *   exports.tiemo = tiemo;
 *
 * 这行的意思是：把已有的 tiemo 函数赋给 exports 对象的 tiemo 属性。
 * 因为第 32 行已经让 exports 和 module.exports 指向同一个对象，
 * 而且这个对象的 tiemo 属性已经保存了同一个函数，
 * 所以当前代码中的第 33 行只是再次设置相同的属性值，可以省略。
 *
 * 如果第 32 行创建的是空对象，这个属性赋值就有实际作用：
 *   exports = module.exports = {};
 *   exports.tiemo = tiemo;
 *
 * 上面两行执行完后，导出的对象同样有 tiemo 属性，可以在外部调用。
 *
 * 七、记忆方法
 *
 *   {
 *     对外使用的属性名: 当前代码中已有的值
 *   }
 *
 * { tiemo: tiemo } 中，“已有的值”恰好是一个函数，
 * 而且对外使用的属性名和函数名恰好都叫 tiemo。
 * 先区分“属性名”和“属性值”，再看它们是否同名，就不容易混淆了。
 */
