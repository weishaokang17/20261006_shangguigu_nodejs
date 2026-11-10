//导入 fs
const fs = require('fs');
const path = require('path');
//写入文件  同步 

// __dirname : 当前这个JS文件所处位置的绝对路径,
fs.writeFileSync(__dirname + '/index.html', 'love');
console.log(__dirname + '/index.html');

//path
console.log(path.resolve(__dirname, './index.html'));
console.log(path.resolve(__dirname, 'index.html'));
/*
上面这两行都输出：
/Users/weishaokang/codeWorkSpace/webFrontWorkSpace/20261006_nodejs/learning_03/index.html
*/

//上面两行，写法正确，下面这一行写法错误，因为 /index.html 是绝对路径  下面这行输出：/index.html/test
console.log(path.resolve(__dirname, '/index.html', './test'))



fs.writeFileSync(path.resolve(__dirname,'index2.html'),'波士顿凯尔特人总冠军')










// sep 分隔符
console.log(path.sep); // windows系统输出： \  Linux系统与macOS系统输出：  /

// parse 方法  __dirname  '全局变量'
console.log(__filename); // 输出结果是 当前这个js文件的绝对路径 : /Users/weishaokang/codeWorkSpace/webFrontWorkSpace/20261006_nodejs/learning_03/path.js

let str = '/Users/weishaokang/codeWorkSpace/webFrontWorkSpace/20261006_nodejs/learning_03/path.js';
console.log(path.parse(str));

/* 

输出：
{
  root: '/',
  dir: '/Users/weishaokang/codeWorkSpace/webFrontWorkSpace/20261006_nodejs/learning_03',
  base: 'path.js',
  ext: '.js',
  name: 'path'
}

*/


// basename    文件名字
console.log(path.basename(str)); // 输出 ： path.js

// dirname   返回给定路径的目录部分
console.log(path.dirname(str)); // 输出： /Users/weishaokang/codeWorkSpace/webFrontWorkSpace/20261006_nodejs/learning_03

// extname   文件的扩展名
console.log(path.extname(str));  //输出：  .js

/*
注意  __filename 与 __dirname 这二者的区别。

前者是当前这个JS文件所在的完整路径。后者是这个JS文件所在目录的完整路径。
二者的区别在于，前者包含当前这个文件的文件名，后者不包含当前这个文件的文件名。
*/