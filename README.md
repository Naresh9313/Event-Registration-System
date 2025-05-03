1step :Clone for Github  git clone " "
2step: frontend & backend  both are  npm i   
       frontend side run in : npm start 
       backend  side run in : nodemon index.js

3 step :  
register api  url POST
http://localhost:5000/api/auth/register 
{
  "name": "Naresh Prajapati",
  "email": "naresh123.com",
  "password": "password123"
}

login api url POST
http://localhost:5000/api/auth/login
{
  "email": "naresh123.com",
  "password": "password123"
}

Event api  url POST
Authorization select Bearer Token-> paste token
headers ma key ma  select  Authorization & value ma token 
http://localhost:5000/api/events/
{
  "title": "Naresh Prajapati",
  "description": "Latest in tech",
  "date": "2025-06-15T10:00:00Z",
  "location": "Ahmedabad",
  "totalSeats": 50
}


Register Event url POST
Authorization select Bearer Token-> paste token
headers ma key ma  select  Authorization & value ma token 
http://localhost:5000/api/events/<eventId>/register

Event url GET
Authorization select Bearer Token-> paste token
headers ma key ma  select  Authorization & value ma token 
http://localhost:5000/api/events



4 step: frontend run to npm start in login to api are generate email & passsword to enter and login the event system

Ex:  
"email": "naresh123.com",
"password": "password123"

5 Step:  Add event in api thi
Event api  url POST
Authorization select Bearer Token-> paste token
headers ma key ma  select  Authorization & value ma token 
http://localhost:5000/api/events/
{
  "title": "Naresh Prajapati",
  "description": "Latest in tech",
  "date": "2025-06-15T10:00:00Z",
  "location": "Ahmedabad",
  "totalSeats": 50
}

& show available event & category by default categry Other

step 5: My Profile  show not event regsiter profile are balnk event register show in profile


step 6:event register mail to confirmation are provide register has been succesfully event.

setp 7: logout functionality













