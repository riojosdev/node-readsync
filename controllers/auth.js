// const { v4: uuid } = require('uuid')
const creatError = require('http-errors')
const client = require('../utils/db')
const webpush = require('web-push');
const { signJwtToken } = require('../utils/jwt')
/**
 * Access token delivery handler
 */
const tokenHandler = async (user) => {
    try {
        // generate token
        const accessToken = await signJwtToken(user, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: process.env.JWT_EXPIRY
        })
        return Promise.resolve(accessToken)
    } catch (error) {
        return Promise.reject(error)
    }
}

// handles register
exports.register = async (req, res, next) => {
    try {
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

        res.status(201)
        res.send('Account created successfully')
    } catch (error) {
        next(error)
    }
}

// handles login
exports.login = async (req, res, next) => {
    try {
        const data = req.body
        const email = data.email
        let token
        // todo: verify and authenticate
        const query = `
            SELECT * FROM users WHERE email='${data.email}' AND lname='${data.lname}';`
        console.log({data})

        // todo: authorize and grant jwt token
        let output
        await client.query(query)
            .then(async res => {
                console.log(`✅: ${res}`);
                const userData = res.rows[0]
                user = userData
                if (!userData) throw creatError.NotFound()
                // const { id, lname, email, publicid } = res.rows[0]
                const { fname, lname, email, dob, privateid, publicid, mobile, id } = res.rows[0]
                // console.log({id, lname, email, publicid})

                if (!(id)) throw creatError.Unauthorized()

                token = await tokenHandler({ id, lname, email, publicid })
                
                // res.send(token);\
                const object = {fname, lname, email, dob, privateid, publicid, mobile, id, token}
                output = {user: object, token: token, email}
            })
            .catch(err => {
                console.error(`❌: ${err}`);
                throw creatError.NotFound()
            })

        // if (!userData) throw creatError.NotFound()

        // const { id, username, password: dbPassword } = JSON.parse(userData)

        // if (!(id && (password === dbPassword))) throw creatError.Unauthorized()

        // const token = await tokenHandler({ id, username, email })
        // Add the token to the header
        // const headers = {
        //     'Authorization': 'Bearer ' + token
        // };
        // console.log({user: user, token, email})
        // res.render('users', { user, email })
        res.json(output)
    } catch (error) {
        next(error)
    }
}

exports.entry = async (req, res, next) => {
    res.render('index')
}