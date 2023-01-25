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
        let token
        // todo: verify and authenticate
        const query = `
            SELECT * FROM users WHERE email='${data.email}' AND lname='${data.lname}';`
        console.log({data})

        // todo: authorize and grant jwt token
        let user
        await client.query(query)
            .then(async res => {
                console.log(`✅: ${res}`);
                const userData = Promise.resolve(res.rows[0])
                user = userData
                if (!userData) throw creatError.NotFound()
                const { id, lname, email, publicid } = res.rows[0]
                console.log({id, lname, email, publicid})

                if (!(id)) throw creatError.Unauthorized()

                token = await tokenHandler({ id, lname, email, publicid })
                // console.log({token})

                // let jwtSecretKey = process.env.JWT_SECRET_KEY;
                // let data = {
                //     time: Date(),
                //     // !FIXME: Dont use public VAPID key create alternate ways such as bcrypt hash/uuid to identify user...
                //     userId: res.rows[0].publicid,
                // }
                
                // // token = jwt.sign(data, jwtSecretKey);
                // // token = await tokenHandler({});
                
                // res.send(token);
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
        const headers = {
            'Authorization': 'Bearer ' + token
        };
        console.log({user, token})
        // res.set(headers).render('users', { user })
        res.json(token)
    } catch (error) {
        next(error)
    }
}

exports.entry = async (req, res, next) => {
    res.render('index')
}