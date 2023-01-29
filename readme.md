# ReadSync 🔔 v0.0.1
<a href='https://ind.ie/ethical-design'><img style='margin-left: auto; margin-right: auto;' alt='We practice Ethical Design' src='https://img.shields.io/badge/Ethical_Design-_▲_❤_-blue.svg'></a>

A minimalistic & lightweight notification system, built using Service Workers and NodeJS.

The system is built using a server-client architecture that uses the client browser's service workers to push and receive notifications from a NodeJS server. The system is able to work on most of the devices which supports the modern browser. 

Each platforms have a different UI design to represent notifications, so the user experience might differ across different platforms. Customizing options would be supported in the future to enable better user accessibility.

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


## Contribution Guidelines to Follow
* Build in Public
* MVC
* Humane and ethical tech architecture
* Unix Philosophy

---
# Give Up GitHub
Note: we encourage you to add the below to your existing `README.md` on your GitHub project.

## == We're Using GitHub Under Protest ==

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