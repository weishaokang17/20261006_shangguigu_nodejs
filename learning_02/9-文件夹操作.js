//1. 导入 fs 模块
const fs = require('fs');

//以下是独立的教学示例；一次只运行需要的示例，同一组异步与同步写法二选一。
//示例使用相同路径便于对照，同步方法不会等待前面已发起的异步操作完成。

//2. 异步创建文件夹：mkdir，通过回调函数处理结果（mk = make，dir = directory）
fs.mkdir('./html', err => {
  if(err) {
    console.log('创建失败~');
    return;
  }
  console.log('创建成功');
});

//对应的同步方法：mkdirSync，同步创建文件夹，不需要回调函数
//与上面的异步示例二选一；失败时直接抛出异常，使用 try...catch 处理。
try {
  fs.mkdirSync('./html');
  console.log('同步创建成功');
} catch (err) {
  console.log('同步操作失败：', err.code, err.message);
}
 
//2-2 异步递归创建文件夹：mkdir，recursive 表示递归，通过回调函数处理结果
fs.mkdir('./a/b/c', {recursive: true},err => {
  if(err) {
    console.log('创建失败~');
    return;
  }
  console.log('创建成功');
});

//对应的同步方法：mkdirSync，同步递归创建文件夹，不需要回调函数
//与上面的异步示例二选一；失败时直接抛出异常，使用 try...catch 处理。
try {
  fs.mkdirSync('./a/b/c', {recursive: true});
  console.log('同步递归创建成功');
} catch (err) {
  console.log('同步操作失败：', err.code, err.message);
}

//2-3 异步读取文件夹：readdir，通过回调函数获取结果（read = 读取，dir = directory）
fs.readdir('./资料', (err, data) => {
  if(err){
    console.log('读取失败');
    return;
  }
  console.log(data);
});

//对应的同步方法：readdirSync，同步读取文件夹，不需要回调函数
//与上面的异步示例二选一；失败时直接抛出异常，使用 try...catch 处理。
try {
  const data = fs.readdirSync('./资料');
  console.log('同步读取结果：', data);
} catch (err) {
  console.log('同步操作失败：', err.code, err.message);
}
//异步读取当前文件夹：readdir，通过回调函数获取结果
fs.readdir('./', (err, data) => {
  if(err){
    console.log('读取失败');
    return;
  }
  console.log(data);
});

//对应的同步方法：readdirSync，同步读取当前文件夹，不需要回调函数
//与上面的异步示例二选一；失败时直接抛出异常，使用 try...catch 处理。
try {
  const data = fs.readdirSync('./');
  console.log('同步读取结果：', data);
} catch (err) {
  console.log('同步操作失败：', err.code, err.message);
}

//2-4 异步删除空文件夹：rmdir，通过回调函数处理结果（rm = remove）
fs.rmdir('./html', err => {
  if(err){
    console.log('删除失败');
    return;
  }
  console.log('删除成功');
});

//对应的同步方法：rmdirSync，同步删除空文件夹，不需要回调函数
//与上面的异步示例二选一；失败时直接抛出异常，使用 try...catch 处理。
try {
  fs.rmdirSync('./html');
  console.log('同步删除成功');
} catch (err) {
  console.log('同步操作失败：', err.code, err.message);
}

//异步递归删除：rmdir 的旧版递归用法，不推荐；Node.js v25 起递归选项已移除
fs.rmdir('./a', {recursive: true},err => {
  if(err){
    console.log(err);
    return;
  }
  console.log('删除成功');
});

//对应的同步方法：rmdirSync，同步递归删除（旧版用法，不推荐；Node.js v25 起递归选项已移除），不需要回调函数
//与上面的异步示例二选一；失败时直接抛出异常，使用 try...catch 处理。
try {
  fs.rmdirSync('./a', {recursive: true});
  console.log('同步递归删除成功');
} catch (err) {
  console.log('同步操作失败：', err.code, err.message);
}

/*
fs.rmdir() 与 fs.rm()：删除文件夹时的区别与用法

先记住使用结论：
1. 日常需要删除整个文件夹及其中所有内容时，通常优先使用
   fs.rm(path, {recursive: true}, callback)。
2. 使用 fs.rm() 删除文件夹，必须显式指定 recursive: true。
   recursive: false 时不能删除任何文件夹，包括空文件夹；但可以删除普通文件。
3. 如果希望“只有文件夹为空时才允许删除”，仍然可以使用 fs.rmdir(path, callback)。
   只要里面有文件或子文件夹就会失败，即使所有子文件夹都是空的也一样。
4. fs.rmdir() 的递归选项已被弃用，并从 Node.js v25.0.0 起被移除，
   因此递归删除应使用 fs.rm()；fs.rmdir() 删除空文件夹的功能仍然保留。

一、先回答“recursive 默认是不是 false”
1. fs.rm() 的 recursive 默认是 false。
2. 在本机 Node.js v24.21.0 中，fs.rmdir() 仍支持 recursive，默认也是 false，
   但这个选项已经被弃用。Node.js 从 v25.0.0 起已移除 rmdir 的递归功能，
   传入 {recursive: true} 也不会启用递归删除。因此要结合 Node.js 版本理解。
3. 两个方法默认都不能删除非空文件夹，但它们的默认行为并不相同：
   fs.rmdir() 可以删除空文件夹；fs.rm() 默认连空文件夹也不能删除。

二、fs.rmdir(path[, options], callback)：默认只删除空文件夹
1. rmdir = remove directory，目标必须是文件夹，默认不会删除里面的内容。
2. “空文件夹”指目标文件夹内没有任何文件、子文件夹或其他目录项。
   隐藏文件（例如 .DS_Store）也算内容；文件是否有内容、是否为 0 字节无关。
3. 只要存在一个子文件夹，父文件夹就不是空文件夹。
   即使没有任何文件，所有子文件夹及更深层子文件夹也全都没有文件，仍不能删除。
   例如 a/b/c 中 c 是空的：默认可以删除 c，但不能直接删除 b 或 a。
   若不使用递归，应先删 c，再删 b，最后删 a，而且要等上一次删除完成。
4. 默认删除非空文件夹会失败，本机常见错误为 ENOTEMPTY（目录非空）。
5. 它不能用于删除普通文件。本机 macOS 上会报 ENOTDIR；Windows 的错误可能不同。
6. 在仍支持递归选项的版本中，{recursive: true} 可以删除整个文件夹树：
   既删除其中的文件，也删除各层子文件夹，最后删除目标文件夹本身。
   递归删除并不要求各层子文件夹都是空的。
7. 上面的 fs.rmdir('./a', {recursive: true}, ...) 属于旧写法。
   rmdir 的 recursive 选项从 Node.js v14.14.0 起被弃用，v16.0.0 起使用时会警告，
   v25.0.0 起被移除。被弃用的是递归用法；用 rmdir 删除空文件夹仍然可用。
   Node.js v16～v24 中，即使 recursive 为 true，目标是普通文件或不存在仍会报错。

三、fs.rm(path[, options], callback)：可删除文件，也可递归删除文件夹
1. rm = remove，此方法从 Node.js v14.14.0 起提供。
2. 默认 recursive: false：可以删除普通文件，但不能删除文件夹，空文件夹也不行。
   本机尝试删除文件夹时会报 ERR_FS_EISDIR（目标是目录）。
   所以不能把 rm 的默认行为理解成“只能删除空文件夹”。
3. 设置 {recursive: true} 后：空文件夹、非空文件夹都可以删除。
   其中的文件、各层子文件夹以及目标文件夹本身都会被删除。
   例如删除 './a' 会把 a/b/c 及其中的文件一起删掉，而不是仅清空 a。
   recursive: true 时仍然可以删除普通文件。
4. 若只想清空文件夹并保留目标文件夹，需要单独删除其内部内容；
   直接 fs.rm('./a', {recursive: true}, ...) 不会保留 a。

四、行为对照（假设路径有效、权限足够，且没有其他操作同时改动目标）
目标                         rmdir 默认    rm 默认    rm recursive:true
普通文件                     失败         成功       成功
空文件夹                     成功         失败       成功
含文件的文件夹               失败         失败       成功
仅含空子文件夹的文件夹         失败         失败       成功
含多层子文件夹和文件的文件夹   失败         失败       成功
不存在的路径                 失败         失败       失败（force 默认 false）

五、fs.rm() 的 force 与 recursive 是两个不同的选项
1. force 默认 false：目标路径不存在时会报 ENOENT。
2. force: true：忽略“路径不存在”这类错误，让删除已经不存在的目标也能正常完成。
3. force 不会自动开启递归，也不代表忽略所有错误或绕过权限限制。
   fs.rm('./a', {force: true}, ...) 仍不能删除文件夹，哪怕 a 是空文件夹。
4. 常用组合是 {recursive: true, force: true}：
   允许删除整个文件夹树，同时容许目标不存在；其行为类似命令行 rm -rf。
5. rmdir 没有可用的 force 选项；不能靠给 rmdir 加 force 来忽略路径不存在。
6. rm 还支持 maxRetries（默认 0）和 retryDelay（默认 100 毫秒）。
   仅在 recursive: true 时生效；遇到 EBUSY、EMFILE、ENFILE、ENOTEMPTY、EPERM
   这几类错误时，按设置次数重试，每次等待时间逐次增加。
   这些选项不改变文件或文件夹是否允许删除的基本规则。

六、常见写法（下面是相互独立的示例，cb 表示完成后的回调）
const cb = err => {
  if (err) {
    console.log('删除失败：', err.code, err.message);
    return;
  }
  console.log('删除操作完成');
};

fs.rmdir('./empty-dir', cb);                              // 只删除空文件夹
fs.rm('./file.txt', cb);                                  // 删除普通文件
fs.rm('./a', {recursive: true}, cb);                       // 删除整个文件夹树；不存在则报错
fs.rm('./a', {recursive: true, force: true}, cb);          // 删除整个文件夹树；不存在也正常完成

七、结合本文件理解异步操作
1. 这里不带 Sync 后缀、接收 callback 的 rmdir 和 rm 是异步回调方法，通过 err 判断结果，
   不是根据方法的返回值判断是否删除成功；也不返回被删除的文件列表。
   用 force: true 时，“回调无错误”也可能表示目标本来就不存在。
2. 本文件同时发起创建 './html'、创建 './a/b/c' 和删除这些目录的操作，
   并且分别用 rmdir 和 rm 删除同一个 './a'。调用写在后面不代表完成得更晚。
   这些操作可能互相影响，例如其中一次删除完成后，另一次删除报 ENOENT。
   学习时应分别运行示例；若要先创建再删除，把删除放在创建成功的回调中，
   或使用 fs/promises 配合 await 按顺序执行。
3. './a' 等相对路径以 process.cwd()（运行程序时的工作目录）为基准，
   不一定以当前这个 JS 文件所在目录为基准。

官方文档（版本差异可查看 rmdir 的 History）：
https://nodejs.org/docs/latest-v24.x/api/fs.html#fsrmdirpath-options-callback
https://nodejs.org/docs/latest-v24.x/api/fs.html#fsrmpath-options-callback
https://nodejs.org/api/fs.html#fsrmdirpath-options-callback
*/

//建议使用的异步递归删除：rm，通过回调函数处理结果
fs.rm('./a', {recursive: true},err => {
  if(err){
    console.log(err);
    return;
  }
  console.log('删除成功');
});

//对应的同步方法：rmSync，同步递归删除文件夹，推荐的同步递归删除写法，不需要回调函数
//与上面的异步示例二选一；失败时直接抛出异常，使用 try...catch 处理。
try {
  fs.rmSync('./a', {recursive: true});
  console.log('同步递归删除成功');
} catch (err) {
  console.log('同步操作失败：', err.code, err.message);
}

/*
文件夹操作：同步与异步方法的对应关系、共同规则和适用场景

一、本文件中的对应关系
异步回调方法                 同步方法
fs.mkdir(path, options, cb)   fs.mkdirSync(path, options)
fs.readdir(path, options, cb) fs.readdirSync(path, options)
fs.rmdir(path, options, cb)   fs.rmdirSync(path, options)
fs.rm(path, options, cb)      fs.rmSync(path, options)
这里的 options 是可选配置对象，cb 是异步操作完成后的回调函数。
当前文件已把各个异步示例与对应的同步示例相邻放置，便于比较写法。

二、哪些场景适合使用同步方法？
1. 一次性脚本、简单命令行工具：操作完成后程序就结束，任务主要按顺序执行，
   不需要在文件操作期间继续响应其他请求或交互，同步写法比较直接。
2. 程序启动、开始提供服务之前的少量必要操作：例如准备目录、读取少量配置。
   如果操作量很大或耗时较长，仍需考虑启动耗时，不能因为是启动阶段就无限制使用同步。
3. 学习、调试或很小的独立任务：使用同步方法可以直观看到操作与后续语句的执行顺序。
4. 同步方法不是“几乎不用”，也不是被弃用；要根据是否能接受阻塞来选择。

三、哪些场景适合使用异步方法？
1. Web 服务器处理用户请求时：创建、读取、删除目录通常优先选择异步方法，
   避免耗时的文件操作阻塞当前 JavaScript 线程，影响它处理其他请求、回调和定时器。
2. 程序运行期间需要持续响应交互或其他任务时：通常优先选择异步方法。
3. 文件夹较大、文件较多或操作耗时不确定时：异步写法能避免同步等待阻塞事件循环。
   这不保证每次操作都更快；它主要改变等待期间当前线程能否继续处理其他工作。
4. 异步方法既可以使用本文件中的回调写法，也可以使用 fs/promises 配合 async/await。
   例如 require('node:fs/promises') 导出的 mkdir、readdir、rmdir、rm 返回 Promise。
   await 只暂停当前异步函数等待结果，不会把这些方法变成 Sync 方法。
5. 需要先创建、再读取、最后删除时，可以通过回调衔接或 await 保证顺序，
   不必为了按顺序执行而把所有操作都改成同步方法。

四、除了同步与异步，它们的操作规则基本一致吗？
1. 对本文件涉及的这几组方法，在同一个 Node.js 版本中，使用相同路径和选项时，
   对目标文件或文件夹的操作规则、主要选项含义及默认值基本一致。
   换成 Sync 不会自动获得不同的删除能力；“基本一致”不代表调用方式完全相同。
2. mkdir 与 mkdirSync：都用于创建文件夹，recursive 默认 false；
   设置 recursive: true，都可以递归创建缺失的多层目录。
3. readdir 与 readdirSync：都读取目录项，默认结果是文件名和子文件夹名的数组，
   不会读取这些文件的内容。设置 withFileTypes: true，结果都会是 Dirent 对象数组。
4. rmdir 与 rmdirSync：默认都只能删除空文件夹，不能删除普通文件。
   文件夹里只要有文件或子文件夹，就不是空文件夹；空子文件夹也算内容。
   两者的递归选项都从 Node.js v14.14.0 起被弃用，v25.0.0 起被移除。
   因此需要递归删除时，分别使用 rm 或 rmSync。
5. rm 与 rmSync：recursive 默认都是 false，此时能删除普通文件，不能删除任何文件夹。
   要删除文件夹，哪怕是空文件夹，都必须显式设置 recursive: true。
   递归删除会删除所有内部内容以及目标文件夹本身。
   force 默认都是 false；设为 true 可忽略目标不存在的错误，不会自动开启递归，
   也不表示忽略所有错误或绕过权限限制。

五、调用方式、结果和错误处理仍有区别
1. 异步回调方法：最后一个参数是回调函数，操作完成后在回调中获取结果。
   常规文件系统操作失败时，通过回调的 err 获取错误；不要把紧接着执行的下一句
   理解成“操作已经完成”。参数类型无效等调用错误仍可能立即抛出异常。
2. 同步方法：不传回调函数，完成或失败后才结束当前调用。
   如果后续代码继续正常执行，就说明该调用已完成；失败时抛出异常，用 try...catch 处理。
3. 读取结果：readdir 的目录项数组在回调的第二个参数中；readdirSync 直接返回数组。
4. 删除结果：rmdirSync、rmSync 成功时返回 undefined，不返回 true 或 false。
   使用 force: true 时，无错误也可能表示目标本来就不存在。
5. 创建结果：mkdirSync 在非递归模式成功时返回 undefined；递归模式下可能返回本次
   首个新建目录的路径，没有新建目录则返回 undefined。
   mkdir 的递归模式会通过回调的第二个参数提供对应路径，而不是通过方法返回值提供。

六、运行本文件时如何避免示例互相影响？
1. 相邻的异步与同步代码是两种独立写法，不是“先异步执行，再同步执行”的流程。
   同一组示例会操作相同路径，学习时二选一，单独运行，并准备好要操作的目标。
2. 同步方法只等待自己的操作完成，不会等待之前发起的异步方法完成，
   也不会自动锁住路径，让其他异步操作停止。
3. 同时运行所有创建、读取、删除示例，可能因重复创建出现 EEXIST，
   或因其他示例已经删除目标而出现 ENOENT；这些结果不能用来判断 API 的基本能力。

官方文档：
https://nodejs.org/docs/latest-v24.x/api/fs.html#synchronous-api
https://nodejs.org/docs/latest-v24.x/api/fs.html#promises-api
https://nodejs.org/api/fs.html#fsrmdirsyncpath-options
https://nodejs.org/learn/asynchronous-work/dont-block-the-event-loop
*/
