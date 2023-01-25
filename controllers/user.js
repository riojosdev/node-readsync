const creatError = require('http-errors')
// const JSONdb = require('simple-json-db')
// const db = new JSONdb(process.env.JSON_DB_PATH, { asyncWrite: true })
exports.getUser = async (req, res, next) => {
  try {
    // checking for any error occurance
    const { email } = req.payload
    if (!email) throw creatError.Unauthorized()
    
    // const userData = db.get(email)
    let user
    // !FIXME: reveal only connected-friend-users in personal network
    const query = `SELECT * FROM users WHERE email=${email};`
    client.query(query)
        .then(res => user = res.rows[0])
        .finally(() => {
            // if (!user) throw creatError.NotFound()
        
            // creating user as json
            // const userDataObj = JSON.parse(user)
        
            // // remove the password key before sending it to client
            // delete userDataObj.password
        
            // res.status(200).send(userDataObj)
            res.render('users', { user, email })
        })

  } catch (error) {
    next(error)
  }
}