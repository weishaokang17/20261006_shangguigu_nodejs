//1. 导入 fs 模块
const fs = require('fs');

//2. stat 方法  status 缩写 状态
// 异步方法：不等待查询完成，查询结果通过回调函数获取
fs.stat('资料/笑看风云.mp4', (err, data) => {
  if(err){
    console.log('操作失败');
    return;
  }
  console.log(data);
  // isFile 
  console.log(data.isFile());
  // isDirectory
  console.log(data.isDirectory());

});

//3. 同步方法 statSync：等待查询完成，直接返回查询结果；失败时抛出异常
try {
  const data = fs.statSync('资料/笑看风云.mp4');
  console.log(data);
  // isFile
  console.log(data.isFile());
  // isDirectory
  console.log(data.isDirectory());
} catch (err) {
  console.log('操作失败', err.message);
}
