const creatError = require('http-errors')
const client = require('../utils/db')

exports.getUser = async (req, res, next) => {
  try {
    console.log("🦀🦀🦀: ", req.payload)
    // checking for any error occurance
    const { email } = req.payload

    if (!email) throw creatError.Unauthorized()
    
    let user
    // !FIXME: reveal only connected-friend-users in personal network
    const query = `SELECT * FROM users WHERE email='${email}';`
    await client.query(query)
        .then(res => {
          user = res.rows[0]
          console.log(user)
        })
        .finally(() => {
          // console.log({user, email})
            // if (!user) throw creatError.NotFound()
        
            // creating user as json
            // const userDataObj = JSON.parse(user)
        
            // // remove the password key before sending it to client
            // delete userDataObj.password
        
            // res.status(200).send(userDataObj)
            // res.render('users', { user, email })
            // res.json({user, email})
            res.json(JSON.stringify(user, email))
        })

  } catch (error) {
    next(error)
  }
}