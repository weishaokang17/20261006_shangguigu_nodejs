/**
 * 需求:
 * 新建一个文件, 座右铭.txt,  写入内容, 三人行, 则必有我师焉
 */

//1. 导入 fs 模块    fs 是 File System 的缩写
const fileSystem = require('fs')

//2. 写入文件
fileSystem.writeFile('./座右铭.txt', '三人行, 则必有我师焉', err => {
  // err 写入失败: 错误对象  写入成功: null
  if(err){
    console.log('写入失败')
    return;
  }
  console.log('写入成功')
});

console.log(1 + 1)

//以上是异步写入，以下这行代码是同步写入
fileSystem.writeFileSync('./data.txt', 'test')

console.log(1 + 1)

/*
同步写入：主线程把写入这件事情做完以后，才继续向下执行代码
异步写入：交给异步线程来写入，主线程直接去执行下面的代码

上面可以看出：同步写入，是写入结束后，才输出 2；异步写入，是先输出 2，然后才写入结束
*/