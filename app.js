const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

// Set up Global configuration access
dotenv.config();

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

app.set('view engine', 'pug')
app.use(express.static('views'));

app.use('/', authRoutes)
app.use('/', userRoutes)

// error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})