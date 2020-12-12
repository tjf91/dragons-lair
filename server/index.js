require('dotenv').config()
const express = require('express')
const massive = require('massive')

const session = require('express-session')
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')
const { usersOnly, adminOnly } = require('./middleware/authMiddleware')
const app = express()
app.use(express.json())

const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env
app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:SESSION_SECRET,    
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login',authCtrl.login)
app.get('/auth/logout',authCtrl.logout)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user',usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user',usersOnly,treasureCtrl.addUserTreasure)
app.get('/api/treasure/all',usersOnly,adminOnly,treasureCtrl.getAllTreasure)


massive({
    connectionString:CONNECTION_STRING,
    ssl:{rejectUnauthorized:false}
}).then(dbInstance=>{
    console.log('db connected')
    app.set('db', dbInstance)
    app.listen(SERVER_PORT,()=>console.log(`Server listening on ${SERVER_PORT}` ))
})



