![Kahotgrid](https://user-images.githubusercontent.com/44262632/97087042-05adb700-161f-11eb-9f2c-54641842a86b.png)


### About Cranehoot
Cranehoot is a cloud-hosted, mobile-friendly, multiplayer quiz powered by VueJS, NodeJS, SocketIO, MySQL & AWS

  - Play singleplayer or multiplayer 
  - Create lobbies to play with your friends
  - Use powerups to help yourself or hinder your opponents
### Screenshots

##### Homepage
![7bab4c5dc7ecf2f6334482e445793a88](https://user-images.githubusercontent.com/44262632/97087055-24ac4900-161f-11eb-985c-cd7a996a2527.jpg)

##### Lobby
![32bfd4bdee378d883f3cddcf44b72428](https://user-images.githubusercontent.com/44262632/97087066-31c93800-161f-11eb-871f-753af38feb77.jpg)

##### Quiz
![ae99e7413f0080445a9287f0c7493cc4](https://user-images.githubusercontent.com/44262632/97087072-3857af80-161f-11eb-818d-2e03d0f151f4.png)

##### Leaderboard
![5aa7b6797cbae6b211d7551921b9c7a7](https://user-images.githubusercontent.com/44262632/97087075-41e11780-161f-11eb-83c7-c5e4c18fd5bb.png)

##### Settings
----

General Settings             |  Game Settings
:-------------------------:|:-------------------------:
![7526a1d441d396a9a52484186ffcc0e1](https://user-images.githubusercontent.com/44262632/97087079-4ad1e900-161f-11eb-9374-ea0d54abe073.png)| ![283be48ed5e5191392ad94cea43924c0](https://user-images.githubusercontent.com/44262632/97087082-532a2400-161f-11eb-8292-20f6db75299e.png)


##### Mobile
---
![Untitled-2](https://user-images.githubusercontent.com/44262632/97087103-7a80f100-161f-11eb-96d1-47deeb490691.png)

### Tech

Creanehoot uses a number of open source projects to work properly:

* [Vue.js](https://vuejs.org/) - HTML enhanced for web apps!
* [Vue-Bootstrap](https://bootstrap-vue.org/) - Responsive, mobile-first, and ARIA accessible projects on the web using Vue.js and the world's most popular front-end CSS library
* [Node.js](https://nodejs.org/en/) - Handle data from the database
* [SocketIO](https://socket.io/) - Socket management javaScript library for realtime web applications.
* [Amazon Web Services (AWS)](https://aws.amazon.com/) - Cloud storage for database and website hosting
* [Buddy Docker](https://buddy.works/) - CICD from GitHub
* [MySQL](https://www.mysql.com/) - Relational database management system

### Installation

Cranehoot requires [Node.js](https://nodejs.org/) to run.

Install the frontend & backend dependencies.

```sh
$ cd frontend
$ npm install
$ cd ../backend
& npm install
```

To start simply run applet.js in /backend & the Vue CLI service in /frontend:

```sh
$/backend node applet.js
$/frontend npm run serve
```
*Ensure db.json is present in the backend folder, in order to connect to the database
#### How to use
The quiz itself is quite self-explanatory, upon entering the website you will be greeted with the homepage. On this page you will see an input form for your username and lobby codes which we'll talk about later. Under these inputs there's 4 buttons:
* Join - Join a specific lobby (You'll need to input a username and valid lobby code)
* Find Lobby (Placeholder)
* Create Lobby - Create & join a new lobby
* Settings - A modal will appear giving you options that you can customize (See general settings screenshot)

When on the lobby page, you will see a unique 6 character lobby code. This is what your friends will need in order to join your lobby. There is also a game settings menu (See screenshots), from this you can specify categories, change the number of questions, & the time to answer each question. When the Start Game button is pressed the quiz will begin for all users in the lobby.

During the quiz itself the player have a number of seconds to answer a question, if correctly answered the player will recieve points equal to the number of seconds left on the timer. If correct multiple times in a row the player will gain a score streak, giving bonus points based on the lenght of the streak. 
The player will also have the ability to use the Powerups. There are currently 3 poweruprs in the game:

* Double Points - Doubles your points from that round if you are correct
* 50/50 - Remove 2 wrong answers from the question
* Half Score - Target another player, halfing their score for the round

After all questions have been asnwered the player(s) will be taken to the leaderboard page, & shown the final rankings/points of each player.

#### Accessibility
During the limited development window of Cranehoot we have strived to create a product that caters to as many people as possible.
Although we haven't strictly adhered to [WCAG AA](https://www.w3.org/WAI/WCAG21/quickref/) standards Cranehoot has mutliple settings to assist with Sensory processing and Visual inpairments, this includes a high contrast background mode, background animation speed slider, all text passing [WCAG AAA](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html) contrast ratio standards & customization of quiz round times to assist those using Screen Readers.

### Todos
Although Cranehoot is unlikely to be developed more, we will include work we would have liked to see done.
 - Pass WCAG AAA Standards
 - Add MORE powerups
 - Scale size of lobbies
 - Add MORE questions
 
 ### Music & Audio
Sound effects & music obtained from www.zapsplat.com

----

**Thanks for reading me!**

Created by Team 7 for AC41004 - Industrial Team Project 

