const creatError = require('http-errors')
// const JSONdb = require('simple-json-db')
// const db = new JSONdb(process.env.JSON_DB_PATH, { asyncWrite: true })
exports.syncPush = async (req, res, next) => {
    try {
        const push_object = req.body
        const { email } = req.payload

        if (!email) throw creatError.Unauthorized()
        console.log({ push_object, email })

        const from_user = `
    SELECT * FROM users 
    WHERE email=${email}
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
    SELECT * FROM users 
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

    } catch (error) {
        next(error)
    }
}