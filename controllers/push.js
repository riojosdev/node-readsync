const creatError = require('http-errors')
const client = require('../utils/db')

exports.syncPush = async (req, res, next) => {
    try {
        const {to_id, message }= req.body
        const { email } = req.payload

        if (!email) throw creatError.Unauthorized()
        console.log("❤️❤️❤️❤️: ", { to_id, message, email })

        const from_user = `
    SELECT * FROM users 
    WHERE email='${email}';`
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
    SELECT * FROM users 
    WHERE id=${to_id};
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
        const values = [from_user_row.id, to_user_row.id, message, new Date().toISOString(), 'synced']

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

    } catch (error) {
        next(error)
    }
}