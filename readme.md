[![We practice Ethical Design](https://img.shields.io/badge/Ethical_Design-_▲_❤_-blue.svg)](https://ind.ie/ethical-design)
[![Twitter Follow](https://img.shields.io/twitter/follow/htmldecoder?style=social)](https://twitter.com/htmldecoder)

<!-- --- -->

# ReadSync 🔔 v0.0.1
> "The plan is for the clients to be able to have **full freedom** to manage how they **receive** and **send** push notifications for their subscribers" - @htmldecoder

Demo deployed at: https://readsync.onrender.com

## About
A minimalistic & lightweight notification system, built using Service Workers and NodeJS.

The system is built using a server-client architecture that uses the client browser's service workers to push and receive notifications from a NodeJS REST API server. The system is able to work on most of the devices with modern browsers which supports Service Workers. 

Each platforms have a different UI design to represent notifications, so the user experience might differ across different platforms. Customizing options would be supported in the future to enable better user accessibility.

The service worker is the main dependency needed for push notifications to work. As it is still a new feature in most browsers, there might be breaking changes.


## Getting started
```bash
# To get started, clone and cd the repo:
git clone <readsync_git_url> && cd node-readsync
# You need to have Docker and docker-compose installed in your system
docker compose up -d
```
The application will be hosted on http://localhost:3000/



## Server Routes
|Route|Description|
|-|-|
| `signup` | A form for registering a new user |
| `login` | A form for logging in a registered user |
| `notify` | A list of input form for the messages to be delivered to different users. (Currently all users present in the database is revealed) | 
| `sync` | Syncronises new notifications from the server for the logged in user | 

> ### Note: 
> * The `notify` & `sync` routes will only be available after a successful login.

## It is a feature not a bug
| Feature | Bug |
|-|-|
| Only a succesful Login installs a new Service Worker, which contains new notifications for the client user | If service worker couldn't be installed; no notifications would be received or pushed, a reload often works; which means the user have to successfully login with a minimum of two times, more if error persists |

## Contribution
Please check the [CONTRIBUTION.md](./CONTRIBUTION.md) file.

## FAQ
### I added permission for the site to receive notification, but still received no notification.
Some browsers might have disabled notifications support for websites. You may need to manually enable it.

### I was not requested for any permissions and still not getting any notifications.
This might be because your browser has already set the permission for the application, you need to reset the permission. Most browser have permissions resetting feature, which could be seen next to the address bar.

> Also remember, the service worker is the main dependency needed for push notifications to work. As it is still a young feature in most browsers, there might be issues.
## License
Please check the [LICENSE](./LICENSE) file

<!-- --- -->
## Give Up GitHub
Note: we encourage you to add the below to your existing `README.md` on your GitHub project.

## We're Using GitHub Under Protest

This project is currently hosted on GitHub.  This is not ideal; GitHub is a
proprietary, trade-secret system that is not Free and Open Souce Software
(FOSS).  We are deeply concerned about using a proprietary system like GitHub
to develop our FOSS project.  We have an
[open {bug ticket, mailing list thread, etc.} ](INSERT_LINK) where the
project contributors are actively discussing how we can move away from GitHub
in the long term.  We urge you to read about the
[Give up GitHub](https://GiveUpGitHub.org) campaign from
[the Software Freedom Conservancy](https://sfconservancy.org) to understand
some of the reasons why GitHub is not a good place to host FOSS projects.

If you are a contributor who personally has already quit using GitHub, please
[check this resource](INSERT_LINK) for how to send us contributions without
using GitHub directly.

Any use of this project's code by GitHub Copilot, past or present, is done
without our permission.  We do not consent to GitHub's use of this project's
code in Copilot.

![Logo of the GiveUpGitHub campaign](https://sfconservancy.org/img/GiveUpGitHub.png)