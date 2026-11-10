//1. 导入 fs 模块
const fs = require('fs');

//2. 文件重命名：rename 是异步方法，通过回调函数处理操作结果
fs.rename('./座右铭.txt', './论语.txt', err => {
  if(err) {
    console.log('操作失败~');
    return;
  }
  console.log('操作成功');
});

//文件重命名：renameSync 是同步方法，操作完成后才继续执行下一句，不需要回调函数
//与上面的异步写法二选一；使用同步写法时，先注释上面的异步调用


fs.renameSync('./座右铭.txt', './论语.txt');


//文件移动：rename 是异步方法，通过回调函数处理操作结果
fs.rename('./data.txt', '资料/data.txt', err => {
  if(err) {
    console.log('操作失败~');
    return;
  }
  console.log('操作成功');
})

//文件移动：renameSync 是同步方法，操作完成后才继续执行下一句，不需要回调函数
//与上面的异步写法二选一；使用同步写法时，先注释上面的异步调用

fs.renameSync('./data.txt', '资料/data.txt');
