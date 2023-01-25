const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'sw_botnet',
    password: 'password',
    port: '5432',
})
client
  .connect()
  .then(() => console.log('connected'))
  .catch((err) => console.error('connection error', err.stack))

module.exports = client