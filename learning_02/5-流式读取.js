//1. 引入 fs 模块
const fs = require('fs')

//2. 创建读取流对象
const rs = fs.createReadStream('资料/笑看风云.mp4')

//3. 绑定 data 事件   chunk 块儿  大块儿           每读完一块内容，就会调用里面的回调函数。
rs.on('data', chunk => {
  console.log(chunk.length); // 65536 字节 => 64KB
  // console.log(chunk.toString());
});

//4. end  这是个可选事件   也就是说，当前这个文件中，如果不写下面几行代码，完全没有任何问题
rs.on('end', () => {
  console.log('读取完成');
});

/*
一、当前的流式读取是同步还是异步？

当前文件使用 fs.createReadStream() 创建文件读取流，属于异步 I/O。
Node.js 没有对应的 fs.createReadStreamSync()，也没有 fs.createWriteStreamSync()。

“流式处理”和“同步 / 异步”是两个不同的概念：
- 流式处理：把数据分成多块，逐块读取和处理。
- 同步：当前 JavaScript 代码必须等这次读写完成，才能继续向下执行。
- 异步：发起读写后，当前 JavaScript 代码可以继续执行，通过回调或事件获知结果。

createReadStream() 会立即返回流对象，这不代表文件已经读取完成。
rs.on('data', 回调函数) 是注册监听器，不是在这一行等待数据读出来。
对于当前的文件读取流，之后读到数据块时，才会执行 data 回调。
正常读完并输出全部数据后，会触发 end 事件。
如果在当前文件末尾加上：

console.log('后面的代码执行了');

在文件正常读取的情况下，会先输出“后面的代码执行了”，
然后才输出各个数据块的长度，最后输出“读取完成”。

每块数据按顺序到达，不代表同步读取。
data 回调中的普通 JavaScript 代码仍在当前线程上执行；
如果回调里进行耗时计算，这部分计算仍会阻塞当前线程。
默认情况下，这个文件读取流每次请求读取的大小是 64KB，
但实际收到的 chunk 不一定都是 65536 字节，最后一块通常会更小。

不监听 end 事件，只是不执行“读取完成”这段回调，不会阻止流正常结束。
默认配置下，读取流在结束后会自动关闭文件描述符。
实际使用时也应监听 error 事件，例如处理文件不存在等错误：

rs.on('error', err => {
  console.error('读取失败：', err);
});

二、如果希望分块处理，同时每块都同步等待读取完成，可以怎样写？

可以用 openSync() 打开文件，用 readSync() 逐块读取，最后用 closeSync() 关闭。
这属于“同步的分块读取”，不属于 createReadStream() 这套文件流接口。
每次 readSync() 都会阻塞当前 JavaScript 线程，完成后才执行下一步。

下面是独立示例，请复制到新文件中运行；当前放在注释中，不会执行。
文件路径相对于运行 node 命令时的工作目录。

const fs = require('fs');

const fd = fs.openSync('资料/笑看风云.mp4', 'r');
const buffer = Buffer.alloc(64 * 1024); // 复用一个 64KB 的缓冲区。

try {
  while (true) {
    // null 表示从当前文件位置读取；读取后文件位置会自动向后移动。
    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, null);

    // 返回 0，表示已经读到文件末尾。
    if (bytesRead === 0) {
      break;
    }

    // 只处理本次实际读到的部分，避免最后一块混入缓冲区里的旧数据。
    const chunk = buffer.subarray(0, bytesRead);
    console.log('当前块读取完成：', chunk.length, '字节');

    // 在这里同步处理当前块，处理结束后才会进行下一次 readSync()。
    // chunk 与 buffer 共用内存，下一次读取会覆盖它；
    // 如果需要保留当前块，应先用 Buffer.from(chunk) 复制一份。
  }
} finally {
  // 即使读取中途出错，也会尝试关闭已经打开的文件。
  fs.closeSync(fd);
}

console.log('全部读取完成'); // 成功读完并关闭文件后，才执行这一行。
*/
