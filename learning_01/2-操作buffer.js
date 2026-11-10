//buffer 与字符串的转换   
let buf_21 = Buffer.from([105, 108, 111, 118, 101, 121, 111, 117]);
console.log(buf_21.toString());// utf-8       输出 iloveyou  这两行代码的作用其实就是把Unicode对应的数字是上面这一串的转换成对应的字符。


let buf_22 = Buffer.from('hello');
console.log(buf_22[0]);// 输出 104 
console.log(buf_22[0].toString(2));//意思是首个字符转换为二进制是多少？  输出  1101000  其实也就是104这个数字转化为二进制是多少
console.log(buf_22); // <Buffer 68 65 6c 6c 6f>

buf_22[0] = 95;// 这里指的是，把首个字符的Unicode的对应的数字改为95。
console.log(buf_22); // <Buffer 5f 65 6c 6c 6f>

console.log(buf_22.toString()); // _ello

//溢出
let buf_24 = Buffer.from('hello');
buf_24[0] = 361;// 8个二进制位，最前面是符号位，共7个二进制位，能表达最大数字是255。这里赋值给361，所以明显溢出了。   最终会舍弃高位的数字  0001 0110 1001  => 0110 1001
console.log(buf_24); // 输出  <Buffer 69 65 6c 6c 6f>

//中文
let buf = Buffer.from('你好');  
console.log(buf); // 输出  <Buffer e4 bd a0 e5 a5 bd> 
