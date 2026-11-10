//1. 导入 fs 模块
const fs = require('fs');

//2. unlink：异步删除，删除结果通过回调函数获取
fs.unlink('./观书有感.txt', err => {
  if(err) {
    console.log('删除失败~');
    return;
  }
  console.log('删除成功');
});

// unlinkSync：同步删除，删除完成后才会执行下一行；失败时抛出异常
// 使用另一份示例文件，避免与上面的异步删除同时操作同一个文件。
// 运行前需要准备好“观书有感-同步删除.txt”。
try {
  fs.unlinkSync('./观书有感-同步删除.txt');
  console.log('同步删除成功');
} catch (err) {
  console.log('同步删除失败~');
}

//3. rm：异步删除，删除结果通过回调函数获取
fs.rm('./论语.txt', err => {
  if (err) {
    console.log('删除失败~');
    return;
  }
  console.log('删除成功');
});

// rmSync：同步删除，删除完成后才会执行下一行；失败时抛出异常
// 使用另一份示例文件，避免与上面的异步删除同时操作同一个文件。
// 运行前需要准备好“论语-同步删除.txt”。
try {
  fs.rmSync('./论语-同步删除.txt');
  console.log('同步删除成功');
} catch (err) {
  console.log('同步删除失败~');
}
