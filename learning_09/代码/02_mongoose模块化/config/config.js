//配置文件
module.exports = {
  DBHOST: '127.0.0.1',
  DBPORT: 27018,
  DBNAME: 'bilibili',
  USER: 'mongo_admin',
  PASSWORD: 'wskygx2025$',
  AUTHSOURCE : 'admin', // 用户在 admin 中认证，业务数据使用 bilibili 数据库
  SERVERSELECTIONTIMEOUTMS : 500
}