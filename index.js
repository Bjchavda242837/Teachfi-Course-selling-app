require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

//import modules
const { userRouter } = require('./routes/userRouter')
const { courseRouter } = require('./routes/courseRouter')
const { adminRouter } = require('./routes/adminRouter')

const app = express()
app.use(express.json())
app.use(express.static("public"));


app.use('/api/v1/user',userRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/course',courseRouter)

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000)
    console.log('listening at port 3000');
}

main()