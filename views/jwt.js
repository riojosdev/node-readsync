console.log("requesting jwt header")

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
            const { user, token, email } = data
            console.log("🔑: ", { data })
            fetch('/profile', {
                method: 'POST',
                headers: {
                    "Authorization": "JWT " + token,
                },
                body: JSON.stringify({ email, user })
            }).then(res => {
                return res.json()
            }).then(async data => {
                const { user, email } = data
                console.log("👥: ", {user, email})

                // TODO: render notify-users-input-list
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    console.log(element)
                    const div = document.createElement('div')
                    const username = document.createElement('p').innerHTML = element.email
                    div.appendChild(username)
                    // Create the form element
                    const form = document.createElement('form');
                    
                    // !FIXME: hidden elements
                    // Create the fromId hidden input field
                    // const fromIdLabel = document.createElement('label');
                    // fromIdLabel.innerHTML = 'From:';
                    const fromIdInput = document.createElement('input');
                    fromIdInput.setAttribute('type', 'hidden');
                    fromIdInput.setAttribute('name', 'from_id');
                    fromIdInput.setAttribute('value', element.id);
                    // Create the email hidden input field
                    // const emailLabel = document.createElement('label');
                    // emailLabel.innerHTML = 'Email:';
                    const emailInput = document.createElement('input');
                    emailInput.setAttribute('type', 'hidden');
                    emailInput.setAttribute('name', 'email');
                    emailInput.setAttribute('value', element.email);
                    // Create the toId hidden input field
                    // const toIdLabel = document.createElement('label');
                    // toIdLabel.innerHTML = 'To:';
                    const toIdInput = document.createElement('input');
                    toIdInput.setAttribute('type', 'hidden');
                    toIdInput.setAttribute('name', 'to_id');
                    toIdInput.setAttribute('value', element.id);

                    // Create the message input field
                    const messageLabel = document.createElement('label');
                    messageLabel.innerHTML = 'Message:';
                    const messageInput = document.createElement('textarea');
                    messageInput.setAttribute('name', 'message');
                    messageInput.setAttribute('required', true);

                    // Create the submit button
                    const submitButton = document.createElement('input');
                    submitButton.setAttribute('type', 'submit');
                    submitButton.setAttribute('value', 'Submit');

                    // Append the input fields and submit button to the form
                    form.appendChild(fromIdInput);
                    form.appendChild(emailInput);
                    form.appendChild(toIdInput);
                    form.appendChild(messageLabel);
                    form.appendChild(messageInput);
                    form.appendChild(submitButton);

                    // Add a submit event listener to the form
                    form.addEventListener('submit', event => {
                        event.preventDefault();
                        const to_id = toIdInput.value;
                        const message = messageInput.value;

                        fetch('notify', {
                            method: 'POST',
                            headers: {
                                "Authorization": "JWT " + token,
                            },
                            body: JSON.stringify({ to_id, message })
                        })
                        console.log(`to_id: ${to_id}, Message: ${message}`);
                    });

                    // Append the form to the body
                    div.appendChild(form)
                    document.body.appendChild(div);

                }
            })
        })
        .catch(err => console.error(err))
}