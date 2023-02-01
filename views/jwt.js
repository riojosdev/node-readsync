/* eslint-disable no-unused-vars */

// ... your code here with unused vars...
console.log('requesting jwt header')

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
	let user_data

	// console.log({data})
	await fetch('/login', {
		method: 'POST',
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
		.then(async data => {
			const { user, token, email } = data
			console.log('🔑: ', { data }, user)
			user_data = { publicId: user.publicID, id: user.id, privateId: user.privateID }

			// TODO: render sync button which updates service worker
			let button = document.getElementById('sync')
			button.disabled = false

			button.addEventListener('click', worker(token, user_data))

			await fetch('/profile', {
				method: 'POST',
				headers: {
					// 'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'JWT ' + token,
				},
				body: JSON.stringify({ email, user: user })
			}).then(res => {
				return res.json()
			}).then(async data => {
				const { user, email } = data
				console.log('👥: ', { user, email })

				// TODO: render notify-users-input-list
				for (let index = 0; index < user.length; index++) {
					const element = user[index]
					console.log(element)
					// const para = document.createElement('p')
					// para.innerHTML = element.email
					const div = document.getElementById('container')
					// div.appendChild(para)
					// Create the form element
					const form = document.createElement('form')

					// !FIXME: hidden elements
					// Create the fromId hidden input field
					// const fromIdLabel = document.createElement('label');
					// fromIdLabel.innerHTML = 'From:';
					const fromIdInput = document.createElement('input')
					fromIdInput.setAttribute('type', 'hidden')
					fromIdInput.setAttribute('name', 'from_id')
					fromIdInput.setAttribute('value', element.id)
					// Create the email hidden input field
					// const emailLabel = document.createElement('label');
					// emailLabel.innerHTML = 'Email:';
					const emailInput = document.createElement('input')
					emailInput.setAttribute('type', 'hidden')
					emailInput.setAttribute('name', 'email')
					emailInput.setAttribute('value', element.email)
					// Create the toId hidden input field
					// const toIdLabel = document.createElement('label');
					// toIdLabel.innerHTML = 'To:';
					const toIdInput = document.createElement('input')
					toIdInput.setAttribute('type', 'hidden')
					toIdInput.setAttribute('name', 'to_id')
					toIdInput.setAttribute('value', element.id)

					// Create the message input field
					// const messageLabel = document.createElement('label');
					// messageLabel.innerHTML = 'Message:';
					const messageInput = document.createElement('input')
					messageInput.setAttribute('name', 'message')
					messageInput.setAttribute('placeholder', element.email)
					messageInput.setAttribute('type', 'text')
					messageInput.setAttribute('required', true)

					// Create the submit button
					const submitButton = document.createElement('input')
					submitButton.setAttribute('type', 'submit')
					submitButton.setAttribute('value', 'Submit')

					// Append the input fields and submit button to the form
					form.appendChild(fromIdInput)
					form.appendChild(emailInput)
					form.appendChild(toIdInput)
					// form.appendChild(messageLabel);
					form.appendChild(messageInput)
					form.appendChild(submitButton)

					// Add a submit event listener to the form
					form.addEventListener('submit', async event => {
						event.preventDefault()
						const to_id = toIdInput.value
						const message = messageInput.value
						console.log({ to_id, message, token })
						await fetch('/notify', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'Authorization': 'JWT ' + token,
							},
							body: JSON.stringify({ to_id, message })
						})
						console.log(`to_id: ${to_id}, Message: ${message}`)
					})

					// Append the form to the body
					div.appendChild(form)
					document.body.appendChild(div)

				}
			})
		})
		.catch(err => console.error(err))
}

async function worker(token, data) {
	// Register Service Worker
	console.log('registering service worker...', { data })
	const register = await navigator.serviceWorker.register('./worker.js', {
		scope: '/'
	})
	console.log('service worker registered...')

	console.log('fetch publicid')
	// !FIXME: get only the push sync requested user
	const { publicId, id, privateId } = data

	if (register.installing) {
		console.log('💾Service worker installing')
	} else if (register.waiting) {
		console.log('👾Service worker installed')
	} else if (register.active) {
		console.log('🤖Service worker active')
	}

	// Register Push
	console.log('Registering Push')
	const subscription = await register.pushManager.subscribe({
		userVisibleOnly: true,
		// applicationServerKey: vapidKeys.publicKey 
		applicationServerKey: publicId
	})
	console.log('push registered...')

	// Send Push Notification
	console.log('Sending Push...')
	await fetch('/push', {
		method: 'POST',
		body: JSON.stringify({ subscription, user_id: id, publicKey: publicId, privateKey: privateId }),
		headers: {
			'content-type': 'application/json',
			'Authorization': 'JWT ' + token,
		}
	})
	console.log('Push Sent...')

	// console.log("################")
	// send().catch(err => console.log(err))
}