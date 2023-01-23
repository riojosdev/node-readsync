const express = require('express')
const bodyParser = require('body-parser')
const { Client } = require('pg')
const webpush = require('web-push');

// VAPID keys should be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

const app = express()
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

// create database and `users` table
// const query = `
// CREATE TABLE users (
//     fname varchar,
//     lname varchar,
//     mobile bigint,
//     email varchar,
//     publicID varchar,
//     privateID varchar,
//     dob date
// )`

// client
// .query(query)
// .then(res => {
//     console.log('Table is successfully created');
// })
// .catch(err => {
//     console.log("Already exists")
//     console.error(err);
// })
// .finally(() => {
//     client.end();
// })

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/register', (req, res) => {
    const data = req.body
    // insert data to `users` table
    const query = `
      INSERT INTO users (fname, lname, mobile, email, publicID, privateID, dob) 
      VALUES ('${data.fname}', '${data.lname}', '${data.mobile}', '${data.email}', '${vapidKeys.publicKey}', '${vapidKeys.privateKey}', '${data.dob}')`;

    client
      .query(query)
      .then(res => {
          console.log(`✅: ${res}`);
      })
      .catch(err => {
          console.error(`❌: ${err}`);
      })
      .finally(() => {
          client.end();
      })

    res.send('Hello World!')
})

const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})