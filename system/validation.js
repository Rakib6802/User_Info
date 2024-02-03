
const db_connection = () => {
  let { conf_mysql } = require('../config/database');

    let instance = require('knex')({
      client: 'mysql',
      connection: conf_mysql
    });
    instance.raw('select 1+1 as result').catch(err => {
      console.log(`${err}`)
      console.log('database connected.')
    });
}

exports.validate = () => {
  db_connection()
}