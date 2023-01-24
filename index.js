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

app.get('/users', (req, res) => {
  let user 
  const query = `SELECT * FROM users`
  client.query(query)
    .then(res => user = res.rows)
    .finally(() => {
      res.render('users', { user })
    })
})

app.post('/notify', async (req, res) => {
  const push_object = req.body
  console.log({push_object})
    
  const from_user = `
    SELECT * FROM users 
    WHERE id=${push_object.from_id}
    `
  let from_user_row
  await client.query(from_user)
    .then(res => {
      from_user_row = res.rows[0]
      console.log(`✅: ${res.rows[0].fname}`);
    })
    .catch(err => {
        console.error(`❌: ${err}`);
    })
    
  const to_user = `
    SELECT id FROM users 
    WHERE id=${push_object.to_id};
    `
  let to_user_row
  await client.query(to_user)
    .then(res => {
      to_user_row = res.rows[0]
      console.log(`✅: ${res.rows[0]}`);
    })
    .catch(err => {
        console.error(`❌: ${err}`);
    })

  
  const query = `
    INSERT INTO messages (sender, receiver, message, timestamp, status)
    VALUES ($1, $2, $3, $4, $5);`
  const values = [from_user_row.id, to_user_row.id, push_object.message, new Date().toISOString(), 'synced']

  await client.query(query, values)
    .then(res => {
      console.log(`✅: ${res}`);
    })
    .catch(err => {
        console.error(`❌: ${err}`);
    })
    .finally(() => {
        client.end();
    })
      

  res.send("SYNCED message to SERVER")
})

const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})