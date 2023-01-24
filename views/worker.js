console.log("Service Worker Loaded...")

self.addEventListener("push", e => {
    const data = e.data.json()
    console.log("🦀 Received Push...")
    self.registration.showNotification(data.title, {
        body: "Notified By HTMLDecoder from DecodedHTML 😎😎",
        icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Glider.svg"
    })
})