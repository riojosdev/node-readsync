const publicVapidKey = "BG6g_OGKk7fR2Qhk9tGyqYUIYPbceegJVxoY2Hs6Rzh9kUXxip59IafGqS79JEWgxpPk1fmy3BUJ6OEbVuhxWtU"
// check for service worker
if ("serviceWorker" in navigator) {
    send().catch(err => console.error(err))
}

// let btn = document.createElement("button")
// btn.innerHTML = "Allow Notifications!"
// btn.addEventListener('click', () => {
//     let promise = Notification.requestPermission();
//     // wait for permission
// })
// document.getElementById("btn").appendChild(btn)

// register SW, register Push, send Push
async function send() {
    // Register Service Worker
    console.log("registering service worker...")
    const register = await navigator.serviceWorker.register("./worker.js", {
        scope: "/"
    })
    console.log("service worker registered...")

    if (register.installing) {
        console.log("💾Service worker installing");
      } else if (register.waiting) {
        console.log("👾Service worker installed");
      } else if (register.active) {
        console.log("🤖Service worker active");
        
        // Register Push
        console.log("Registering Push")
        const subscription = await register.pushManager.subscribe({ 
            userVisibleOnly: true, 
            applicationServerKey: publicVapidKey 
        })
        console.log("push registered...")
    
        // Send Push Notification
        console.log("Sending Push...")
        await fetch('/subscribe', {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        })
        console.log("Push Sent...")

        // console.log("################")
        // send().catch(err => console.log(err))
      }

}