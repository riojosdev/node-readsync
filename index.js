const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const webpush = require('web-push');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

  
// Set up Global configuration access
dotenv.config();

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
app.use(express.static('views'));

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/register', (req, res) => {
    // VAPID keys should be generated only once.
    const vapidKeys = webpush.generateVAPIDKeys();
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

app.post('/login', (req, res) => {
  const data = req.body
  // todo: verify and authenticate
  const query = `
    SELECT * FROM users WHERE email=${data.email} AND lname=${data.lname};`

  // todo: authorize and grant jwt token
  client.query(query)
    .then(res => {
      console.log(`✅: ${res}`);
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      let data = {
          time: Date(),
          userId: res.rows[0].publicid,
      }
      
      const token = jwt.sign(data, jwtSecretKey);
      
      res.send(token);
    })
    .catch(err => {
        console.error(`❌: ${err}`);
        res.send('try again')
    })
})

// !############################################

app.get("/user/validateToken", (req, res) => {
  // Tokens are generally passed in the header of the request
  // Due to security reasons.

  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
      const token = req.header(tokenHeaderKey);

      const verified = jwt.verify(token, jwtSecretKey);
      if(verified){
          return res.send("Successfully Verified");
      }else{
          // Access Denied
          return res.status(401).send(error);
      }
  } catch (error) {
      // Access Denied
      return res.status(401).send(error);
  }
});

// !############################################

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
    // .finally(() => {
    //     client.end();
    // })
      

  // res.send("SYNCED message to SERVER")
  res.render('worker')
})

app.post('/subscribe', async (req, res) => {
    // get pushSubscription object
    const subscription = req.body
    console.log({subscription})

    // send 201 - resource created
    res.status(201).json({})

    let user_id = 1

    // create payload
    let payload_test
    const query = `
    SELECT * FROM messages WHERE sender=${user_id} AND receiver=${user_id};`
    await client.query(query)
      .then(res => {
        payload_test = JSON.stringify(res.rows)
        console.log(payload_test)
      })
      .catch(err => console.error('❌: ', err))

    const payload = JSON.stringify({ title: "Push Test", body: payload_test })

    // fetch public vapid key
    let public_vapid_key
    const key_query = `SELECT publicid FROM users WHERE id=${user_id}`
    await client.query(key_query)
      .then(res => {
        public_vapid_key = res.rows
        console.log(public_vapid_key)
      })

    // pass object into sendNotification
    await webpush.sendNotification(subscription, payload).catch(err => console.error(err))
})

const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})