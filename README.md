# CS340 Group 78 Final Project
This project connects an SQL database to a frontend interface using Node.js and Handlebars.

Use this link to interact with the website on the OSU servers: http://flip1.engr.oregonstate.edu:45013/

## To clone this project and view on your local server:

First, use npm to install the following packages:
- dotenv
- express
- express-handlebars
- mysql

```
npm i dotenv express express-handlebars mysql
```

Add the following variables to your .env file as it pertains to you:
- PORT = *****
- DB_HOST = *****
- DB_USER = *****
- DB_PASS = *****
- DB_NAME = *****

Then, use node app.js to run the project on your local server.

```
node app.js
```

## Project Overview
"Within the Hogwarts School of Witchcraft and Wizardry, mastery of spells holds remarkable importance. However, with over two hundred spells that are classified into multiple different types, the challenge lies in being able to efficiently find the right one. Furthermore, if a student wanted to learn more about the spell performed in action, it is difficult to find information regarding which witch/wizard used that spell before. To address these complexities, we have developed a database that is capable of quickly retrieving and recording Hogwarts wizards and spells to avoid accidentally turning someone into a frog! 

We’ve created a tool to track spells, along with the ability to record instances of when the spell was used, and which wizard(s) have used the spell. To promote cross-generational relationships, our database also provides users with comprehensive insights into those wizards’ houses and graduation status. Additionally, the database will handle data for the four major Hogwarts houses, with the option to add more houses in the future. 

These database implementations will promote the learning experience of magic, providing both a historical and modern perspective on spell usage. With the anticipation of various users ranging from students to professors to those curious about magic, we are extremely ambitious with our database capabilities. We aim to have hundreds of wizard records, over two hundred distinct spells, and hundreds of documented spell instances, in addition to the four known Hogwarts houses and the current seven spell types!"

