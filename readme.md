# This was run using npm pg library to create the database `users`
```js
// create database and `users` table
const query = `
CREATE TABLE users (
    fname varchar,
    lname varchar,
    mobile bigint,
    email varchar,
    publicID varchar,
    privateID varchar,
    dob date
)`

client
.query(query)
.then(res => {
    console.log('Table is successfully created');
})
.catch(err => {
    console.log("Already exists")
    console.error(err);
})
.finally(() => {
    client.end();
})
```

> ## This was run to add auto incrementing primary key row to existing `users` table
> ```postgres
> ALTER TABLE users ADD COLUMN id SERIAL PRIMARY KEY;
> ```

# This Postgres command was run to create the relational table `messages` for the `users` table
```postgres
CREATE TYPE message_status AS ENUM ('waiting', 'synced', 'delivered');

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender INTEGER REFERENCES users(id),
    receiver INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    status message_status NOT NULL
);
```

# History
* ...
* Message saved to server DB
  * Redirects to a page that executes client.js
    * Client.js contains code for writing to indexedDB
  * Worker displays notification
---
* create client fetch syntax for sending requests using jwt embeded header
* 