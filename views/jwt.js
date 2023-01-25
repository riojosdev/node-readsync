console.log("requesting jwt header")
// let token
// // self.addEventListener("fetch", )
// fetch('/authorize', {
//     method: "POST",
//     headers: {
//         "Authorization": "JWT " + token,
//     }
// }).then(res => {
//     token = Promise.resolve(res.headers)
//     console.log(token)
// })

// // Example POST method implementation:
// // async function postData(url = '', data = {}) {
// async function postData(url = '/authorize') {
//     // Default options are marked with *
//     const response = await fetch(url, {
//       method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     //   mode: 'cors', // no-cors, *cors, same-origin
//     //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     //   credentials: 'same-origin', // include, *same-origin, omit
//       headers: {
//         // 'Content-Type': 'application/json'
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//         "Authorization": "JWT " + token,
//       },
//     //   redirect: 'follow', // manual, *follow, error
//     //   referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     //   body: JSON.stringify(data) // body data type must match "Content-Type" header
//     });
//     return response.json(); // parses JSON response into native JavaScript objects
//   }
// async function onclickJwtEmbededPostRequest(url) {
window.onload = function startup() {
    let form = document.getElementById('form1')
    // form.addEventListener('submit', send(form), true)

}
async function login(e, forms) {

    // let form = document.getElementById('login')
    
    // form.addEventListener('submit', (evt) => {
    e.preventDefault()
    //     console.log({evt})
    // })
    // let data = new FormData(form)
    let email = document.getElementById('email1').value
    let lname = document.getElementById('lname1').value

    // console.log({data})
    await fetch('/login', {
        method: "POST",
        headers: {
            // "Authorization": "JWT " + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            lname
        })
    })
    .then(res => {
        return res.json()
    })
    .then(data => {
        console.log("🔑: ", {data})
    })
    .catch(err => console.error(err))
}
    // }
    // .onclick = async () => {
    //     let fromId = document.querySelector('from_id').value
    //     let toId = document.querySelector('to_id').value
    //     let email = document.querySelector('email').value
    //     let message = document.querySelector('message').value

        

    //     await fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             "Authorization": "JWT " + token,
    //         },
    //         body: {
    //             fromId,
    //             toId,
    //             email,
    //             message
    //         }
    //     })
    // }

// }