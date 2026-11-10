//1. 安装 mongoose
//2. 导入 mongoose
const mongoose = require('mongoose');

//设置 strictQuery 为 true
mongoose.set('strictQuery', true);

//3. 通过 SSH 隧道连接云服务器上的 MongoDB
// 本地 127.0.0.1:27018 由 SSH 转发到云服务器的 127.0.0.1:27017。
mongoose
  .connect('mongodb://127.0.0.1:27018/bilibili', {
    user: 'mongo_admin',
    pass: 'wskygx2025$',
    authSource: 'admin', // 用户在 admin 中认证，业务数据使用 bilibili 数据库
    serverSelectionTimeoutMS: 5000
  })
  .catch((err) => {
    console.error('初次连接 MongoDB 失败：', err.message);
    process.exitCode = 1;
  });

//4. 设置回调
// 设置连接成功的回调  once 一次   事件回调函数只执行一次
mongoose.connection.once('open', () => {
  //5. 创建文档的结构对象
  //设置集合中文档的属性以及属性值的类型
  let BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    price: Number,
    is_hot: Boolean
  });

  //6. 创建模型对象  对文档操作的封装对象    mongoose 会使用集合名称的复数, 创建集合
  let BookModel = mongoose.model('novel', BookSchema);

  //7. 新增
  BookModel.insertMany([{
    name: '西游记',
    author: '吴承恩',
    price: 19.9,
    is_hot: true
  }, {
    name: '红楼梦',
    author: '曹雪芹',
    price: 29.9,
    is_hot: true
  }, {
    name: '三国演义',
    author: '罗贯中',
    price: 25.9,
    is_hot: true
  }, {
    name: '水浒传',
    author: '施耐庵',
    price: 20.9,
    is_hot: true
  }, {
    name: '活着',
    author: '余华',
    price: 19.9,
    is_hot: true
  }, {
    name: '狂飙',
    author: '徐纪周',
    price: 68,
    is_hot: true
  }, {
    name: '大魏能臣',
    author: '黑男爵',
    price: 9.9,
    is_hot: false
  },
  {
    name: '知北游',
    author: '洛水',
    price: 59,
    is_hot: false
  },{
    name: '道君',
    author: '跃千愁',
    price: 59,
    is_hot: false
  },{
    name: '七煞碑',
    author: '游泳的猫',
    price: 29,
    is_hot: false
  },{
    name: '独游',
    author: '酒精过敏',
    price: 15,
    is_hot: false
  },{
    name: '大泼猴',
    author: '甲鱼不是龟',
    price: 26,
    is_hot: false
  },
  {
    name: '黑暗王者',
    author: '古羲',
    price: 39,
    is_hot: false
  },
  {
    name: '不二大道',
    author: '文刀手予',
    price: 89,
    is_hot: false
  },
  {
    name: '大泼猴',
    author: '甲鱼不是龟',
    price: 59,
    is_hot: false
  },
  {
    name: '长安的荔枝',
    author: '马伯庸',
    price: 45,
    is_hot: true
  },
  {
    name: '命运',
    author: '蔡崇达',
    price: 59.8,
    is_hot: true
  },
  {
    name: '如雪如山',
    author: '张天翼',
    price: 58,
    is_hot: true
  },
  {
    name: '三体',
    author: '刘慈欣',
    price: 23,
    is_hot: true
  },
  {
    name: '秋园',
    author: '杨本芬',
    price: 38,
    is_hot: true
  },
  {
    name: '百年孤独',
    author: '范晔',
    price: 39.5,
    is_hot: true
  },
  {
    name: '在细雨中呼喊',
    author: '余华',
    price: 25,
    is_hot: true
  },], (err, data) => {
    //判断是否有错误
    if (err) {
      console.log(err);
      return;
    }
    //如果没有出错, 则输出插入后的文档对象
    console.log(data);
    //8. 关闭数据库连接 (项目运行过程中, 不会添加该代码)
    mongoose.disconnect();
  });

});

// 设置连接错误的回调
mongoose.connection.on('error', () => {
  console.log('连接失败');
});

//设置连接关闭的回调
mongoose.connection.on('close', () => {
  console.log('连接关闭');
});
/*
 * 关于集合名称：为什么代码里写的是 novel，MongoDB 中却显示 novels？
 *
 * 1. 原因：Mongoose 默认根据模型名称推导集合名称。
 *
 *    当前代码：
 *      let BookModel = mongoose.model('novel', BookSchema);
 *
 *    这里没有明确指定实际集合名，因此 Mongoose 默认使用模型名的小写复数形式：
 *      模型名 novel → 集合名 novels
 *
 *    这是 Mongoose 的默认命名规则，不是 MongoDB 强制要求集合名使用复数。
 *    MongoDB 允许集合直接叫 novel。
 *    本项目实际安装的 Mongoose 6.9.2 已通过本地模型验证，符合上述行为。
 *
 * 2. 区分变量名、模型名、Schema 和集合名。
 *
 *    BookModel：JavaScript 变量名，用来保存模型，方便调用模型的方法。
 *    'novel'：mongoose.model() 的第一个参数，是模型名。
 *    BookSchema：保存 Schema 的变量，定义文档的字段及其类型。
 *    novels：当前模型对应的 MongoDB 集合名，由 Mongoose 默认推导出来。
 *
 *    因此，BookModel.insertMany([...]) 会把书籍文档插入 novels 集合。
 *    连接字符串指定了 bilibili 数据库，最终的数据位置是：
 *      bilibili 数据库 → novels 集合 → 《西游记》《红楼梦》等书籍文档
 *
 *    BookModel 和 BookSchema 这两个 JavaScript 变量的名称，本身不决定集合名称。
 *
 * 3. 为什么使用复数？是否只是简单地在末尾加 s？
 *
 *    这个约定可以理解为：模型描述某一类对象，集合存放这一类对象的多条文档。
 *    因此，模型名通常使用单数，集合名默认使用小写复数，例如：
 *      Book  → books
 *      User  → users
 *      Novel → novels
 *
 *    Mongoose 使用复数化规则，并不是简单执行“模型名 + 's'”。
 *    某些单词可能变成 es、ies 或其他复数形式；novel 的复数恰好是 novels。
 *
 * 4. 如果希望实际集合名称就是 novel，可以明确指定集合名。
 *
 *    方法一：在 mongoose.model() 中传入第三个参数，最直接。
 *
 *      let BookModel = mongoose.model('novel', BookSchema, 'novel');
 *
 *    三个参数依次是：模型名称、Schema、实际集合名称。
 *    第三个参数指定为 'novel' 后，模型就会操作 novel 集合。
 *    模型名与集合名不必相同，例如下面的模型名是 Book，集合名仍是 novel：
 *
 *      let BookModel = mongoose.model('Book', BookSchema, 'novel');
 *
 *    方法二：创建 Schema 时，通过第二个参数中的 collection 选项指定集合名。
 *
 *      let BookSchema = new mongoose.Schema(
 *        {
 *          name: String,
 *          author: String,
 *          price: Number,
 *          is_hot: Boolean
 *        },
 *        {
 *          collection: 'novel'
 *        }
 *      );
 *      let BookModel = mongoose.model('novel', BookSchema);
 *
 *    两种方式选择一种即可。以上都是说明示例，当前实际代码仍使用默认的 novels。
 *
 * 5. 修改模型对应的集合名称，不会自动重命名集合或迁移已有数据。
 *
 *    如果原来的数据已经插入 novels，随后把目标集合明确指定为 novel：
 *      原有数据仍保留在 novels 集合中。
 *      后续通过该模型执行的查询、插入等操作，会针对 novel 集合。
 *      再次执行本文件并成功插入后，数据库中可能同时存在 novels 和 novel。
 *
 *    所以，目前看到 novels 属于正常现象；接受默认命名约定就无需修改模型定义。
 *
 * 6. 对前面创建模型处的注释，更准确的理解是：
 *
 *    “未明确指定集合名时，Mongoose 默认根据模型名的小写复数形式确定集合名。”
 *
 *    关键：第一个参数指定模型名，第三个参数可以明确指定实际集合名。
 *
 * 参考文档：
 * https://mongoosejs.com/docs/models.html#compiling-your-first-model
 * https://mongoosejs.com/docs/guide.html#collection
 */
