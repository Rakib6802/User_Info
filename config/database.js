

const connection = {
  host: (process.env.DB_HOST) ? process.env.DB_HOST : 'localhost',
  user: (process.env.DB_USER) ? process.env.DB_USER : 'root',
  password: (process.env.DB_PASSWORD) ? process.env.DB_PASSWORD : 'test@0856',
  database: (process.env.DB_NAME) ? process.env.DB_NAME : 'user_db',
}


const conf_mysql = {
  ...connection,
  timezone: 'UTC',
  typeCast: function (field, next) {
    if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
      let value = field.string();
      if (!value) return value;
      if (Config.db_datetime_convert) return moment(value).tz(Config.timezone).format('YYYY-MM-DD HH:mm:ss');
      else return moment(value).format('YYYY-MM-DD HH:mm:ss');
    } else if (field.type == 'DATE') {
      let value = field.string();
      if (!value) return value;
      if (Config.db_datetime_convert) return moment(value).tz(Config.timezone).format('YYYY-MM-DD');
      else return moment(value).format('YYYY-MM-DD');
    }
    return next();
  }
}



exports.connection = connection;
exports.conf_mysql = conf_mysql;
if (true) {
  let instance = require('knex')({
    client: 'mysql',
    connection: conf_mysql
  });
  console.log(`database is conected.`)
  exports.instance = instance;
}
