# projectJWT+VueJS without VueJS (comming soon ;])

STEP 1) npm install 
</br>
STEP 2) create database (MongoDB) : TEST
</br>
STEP 3) In terminal :
</br>
=> FOR Nodemon users: npm run watch
</br>
=> FOR Ohers: npm run start 
</br>
Step 4) In Postman :
</br>
=> SET localhost:3333
</br>
=> ROUTES :
</br>
-> GET localhost:3333
</br>
-> POST localhost:3333/signup (BODY => x-www-form-urlencoded => username, password, message [optionnal])
</br>
-> POST localhost:3333/login (BODY => x-www-form-urlencoded => username, password)
</br>
-> POST localhost:3333/token (BODY => x-www-form-urlencoded => token)
</br>
-> GET localhost:3333/users_list (HEADERS => Content-Type = application/x-www-form-urlencoded, token)
</br>
-> GET localhost:3333/messages (HEADERS => Content-Type = application/x-www-form-urlencoded, token)
</br>
