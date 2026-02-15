import express from 'express'

import cors from 'cors'//cross region resource sharing => It's a security feature implemented by browsers to restrict web pages from making requests to a different domain
import 'dotenv/config'//load environment variables
import connectDB from './Config/mongodb.js';
import connectCloudinary from './Config/Cloudnary.js';
import adminRouter from './Routes/adminRoute.js';
import doctorRouter from './Routes/doctorRoute.js';
import userRouter from './Routes/userRoutes.js';





//app config
const app=express();
const port=process.env.PORT || 4000
connectDB()//connects your app to mongodb
connectCloudinary()

//MIDDLEWARES
app.use(express.json());//IF WE DON'T use thenn json data will not be parsed in javascript object
app.use(cors())//app.use is used for mounting middlewares

//api endpoints
app.use('/api/admin',adminRouter)//localhost:4000/api/admin/add-doctor
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get("/",(req,res)=>{
    res.send("API WORKING")
})
//STARTING SERVER
app.listen(port,()=>{
    console.log("app is listening")
})