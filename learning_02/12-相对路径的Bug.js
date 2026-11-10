// 
const fs = require('fs');

// 相对路径参照物: 命令行的工作目录
// fs.writeFileSync('./index.html', 'love');

//绝对路径 '全局变量'     __dirname：指的是：当前这个js文件的所在目录的绝对路径
// console.log(__dirname);  
fs.writeFileSync(__dirname + '/index.html', 'love');
