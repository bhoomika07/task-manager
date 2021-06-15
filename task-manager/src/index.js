const express=require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app=express()
const port= process.env.PORT || 3000

// middleware for maintenance mode
// app.use((req, res, next) => {
//     if(req){
//         res.status(503).send("Currently, the site is under maintenance. Cannot take you to the desired location.")
//     }
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () =>{
    console.log('listening on port ' + port)
})

const jwt =require('jsonwebtoken')