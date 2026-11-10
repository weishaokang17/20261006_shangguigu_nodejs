/**
 * 需求:
 *   复制『资料』文件夹下的『笑看风云.mp4』
 */
const fs = require('fs')

//方式一 readFile
//读取文件内容
let data = fs.readFileSync('资料/笑看风云.mp4')
// 写入文件
fs.writeFileSync('资料/笑看风云-2.mp4', data);

const process = require('process')
console.log(process.memoryUsage()); // rss    110710784 字节   105MB

//方式二 流式操作
//创建读取流对象
const rs = fs.createReadStream('资料/笑看风云.mp4')
//创建写入流对象
const ws = fs.createWriteStream('资料/笑看风云-3.mp4');

//绑定 data 事件
rs.on('data', chunk => {
  ws.write(chunk);
});

rs.on('end', () => {
  ws.end()
  console.log(process.memoryUsage());  // 43106304   =>  41M
})


//pipe  "管道"的意思 
rs.pipe(ws);
/*
 * rs.pipe(ws)：把读取流 rs 连接到写入流 ws，分块传输数据，实现文件复制。
 * 1. 自动将 rs 读取到的数据块写入 ws，无需再手动监听 data 事件调用 ws.write()。
 * 2. 自动处理背压：当写入速度跟不上读取速度时，暂停读取，待写入流可继续接收后恢复，
 *    避免待写入的数据不断积压在内存中。
 * 3. 默认在 rs 读取结束时调用 ws.end()，让已排队的数据写完；
 *    此处的文件写入流默认会在写入完成后自动关闭文件，无需手动调用 ws.close()。
 * 4. rs 的 end 事件表示读取结束；ws 的 finish 事件表示所有数据已完成写入。
 * 注意：此写法与上面的手动写入方式应二选一，同时使用会导致数据被重复写入。
 * pipe() 不等于完整的错误处理，读取流和写入流的错误仍需另外处理。
 */


