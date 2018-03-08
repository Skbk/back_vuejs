# projectJWT+VueJS without VueJS

STEP 1) npm install 
</br>
STEP 2) create database (MongoDB) : TEST
</br>
STEP 3) In terminal :
</br>
- FOR Nodemon users: npm run watch
</br>
- FOR Ohers: npm run start 
</br>
Step 4) In Postman :
- SET localhost:3333
- ROUTES :
-> GET localhost:3333
-> POST localhost:3333/signup (BODY => x-www-form-urlencoded => username, password, message [optionnal])
-> POST localhost:3333/login (BODY => x-www-form-urlencoded => username, password)
-> POST localhost:3333/token (BODY => x-www-form-urlencoded => token)
-> GET localhost:3333/users_list (HEADERS => Content-Type = application/x-www-form-urlencoded, token)
-> GET localhost:3333/messages (HEADERS => Content-Type = application/x-www-form-urlencoded, token)
