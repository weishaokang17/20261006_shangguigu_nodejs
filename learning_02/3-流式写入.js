/**
 * 观书有感.txt
 */
//1. 导入 fs 
const fs = require('fs');

//2. 创建写入流对象 
const ws = fs.createWriteStream('./观书有感.txt');

//3. write
ws.write('半亩方塘一鉴开\r\n');
ws.write('天光云影共徘徊\r\n');
ws.write('问渠那得清如许\r\n');
ws.write('为有源头活水来\r\n');

//4. 关闭通道   close()方法是可选的，脚本执行完毕后，自动close
// ws.close();


/*
一、当前的流式写入是同步还是异步？

当前文件使用 fs.createWriteStream() 创建文件写入流，属于异步 I/O。
Node.js 没有对应的 fs.createWriteStreamSync()，也没有 fs.createReadStreamSync()。

“流式处理”和“同步 / 异步”是两个不同的概念：
- 流式处理：把数据分成多块，逐块交给流处理。
- 同步：当前 JavaScript 代码必须等这次读写完成，才能继续向下执行。
- 异步：发起读写后，当前 JavaScript 代码可以继续执行，通过回调或事件获知结果。

createWriteStream() 会立即返回流对象，这不代表文件已经打开或写入完成。
上面的四次 ws.write() 按顺序提交数据，流会保持这些内容的写入顺序。
但是，每次 write() 返回时，数据可能仍在内部队列中等待写入文件。
“内容按顺序写入”不等于“同步写入”；没有传回调函数，也不等于同步。
write() 的返回值是布尔值，表示是否适合继续提交数据，不表示写入是否完成。
大量写入时，如果 write() 返回 false，应等待 drain 事件后再继续提交数据。

正常结束写入，应在最后一次 write() 后调用 ws.end()，表示没有更多数据了。
可以监听 finish 事件，获知所有提交的数据已经完成写入：

ws.on('finish', () => {
  console.log('写入完成');
});
ws.on('error', err => {
  console.error('写入失败：', err);
});
ws.end();
console.log('后面的代码执行了'); // 先输出；成功写完后才输出“写入完成”

补充说明：上方“脚本执行完毕后，自动 close”的注释不够准确。
默认配置下，调用 end() 并正常完成写入后，流会自动关闭文件描述符。
仅仅执行完最后一行 JavaScript 代码，不代表流已经结束或文件已经关闭。

二、如果希望分块处理，同时每块都同步等待写入完成，可以怎样写？

可以用 openSync() 打开文件，用 writeSync() 逐块写入，最后用 closeSync() 关闭。
这属于“同步的分块写入”，不属于 createWriteStream() 这套文件流接口。
每次 writeSync() 都会阻塞当前 JavaScript 线程，完成后才执行下一步。

下面是独立示例，请复制到新文件中运行；当前放在注释中，不会执行。
这里把每句诗作为一块数据，写入另一个文件：

const fs = require('fs');

const chunks = [
  '半亩方塘一鉴开\r\n',
  '天光云影共徘徊\r\n',
  '问渠那得清如许\r\n',
  '为有源头活水来\r\n'
];

const fd = fs.openSync('./观书有感-同步分块.txt', 'w');

try {
  for (const text of chunks) {
    const chunk = Buffer.from(text, 'utf8');
    let offset = 0;

    // writeSync() 返回本次实际写入的字节数。
    // 如果一次没有写完整块，就继续同步写入这一块剩余的部分。
    while (offset < chunk.length) {
      const bytesWritten = fs.writeSync(
        fd, chunk, offset, chunk.length - offset, null
      );
      if (bytesWritten === 0) {
        throw new Error('本次没有写入任何字节，无法继续写入');
      }
      offset += bytesWritten;
    }

    // 当前这一块全部写完后，才会进入下一轮，写下一块。
    console.log('当前块写入完成：', chunk.length, '字节');
  }
} finally {
  // 即使写入中途出错，也会尝试关闭已经打开的文件。
  fs.closeSync(fd);
}

console.log('全部写入完成'); // 成功写完并关闭文件后，才执行这一行。
*/
