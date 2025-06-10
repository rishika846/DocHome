import express from 'express'

import cors from 'cors'//cross region resource sharing => It's a security feature implemented by browsers to restrict web pages from making requests to a different domain
import 'dotenv/config'
import connectDB from './Config/mongodb.js';
import connectCloudinary from './Config/Cloudnary.js';
import adminRouter from './Routes/adminRoute.js';
import doctorRouter from './Routes/doctorRoute.js';
import userRouter from './Routes/userRoutes.js';





//app config
const app=express();
const port=process.env.PORT || 4000
connectDB()
connectCloudinary()

//MIDDLEWARES
app.use(express.json());
app.use(cors())

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