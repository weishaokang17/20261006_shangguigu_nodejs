//1. alloc  Allocate这个单词的缩写，“分配”的意思。
let buf = Buffer.alloc(10);  // Buffer 是Node.js的内置模块，所以不需要手动导入，就能使用
console.log(buf);  // 输出结果为 <Buffer 00 00 00 00 00 00 00 00 00 00>

let buf_101 = Buffer.alloc(14)
console.log(buf_101) //输出结果为 <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00>



//2. allocUnsafe   allocUnsafe 和上面的 alloc的区别是：allocUnsafe不会清空旧的内存空间
let buf_2 = Buffer.allocUnsafe(10000);
console.log(buf_2);

//3. from
let buf_3 = Buffer.from('hello');
let buf_4 = Buffer.from([105, 108, 111, 118, 101, 121, 111, 117]);
console.log(buf_3) // <Buffer 68 65 6c 6c 6f>  输出的是16进制。
console.log(buf_4); // <Buffer 69 6c 6f 76 65 79 6f 75>