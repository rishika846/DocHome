import express from 'express'
import { registerUser,loginUser, getProfile, updateUser,bookAppointment, listAppointment, cancelAppointment, payAppointment} from '../Controllers/userController.js'
import authUser from '../Middlewares/authUser.js';
import upload from '../Middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser)
userRouter.get('/get-profile',authUser, getProfile)

/* 
  FIX (PLACEMENT-READY): Swapped order of authUser and upload.single('image').
  We must authenticate the user BEFORE handling the file upload to prevent unauthenticated
  requests from writing images to disk and causing storage exhaustion.
*/
userRouter.post('/update-profile',authUser, upload.single('image'), updateUser)
userRouter.post('/book-appointment',authUser, bookAppointment)
userRouter.get('/appointments',authUser, listAppointment)
userRouter.post('/cancel-appointment',authUser, cancelAppointment)

/*
  FIX (PLACEMENT-READY): Registered payment API route to update database payment status.
*/
userRouter.post('/pay-appointment', authUser, payAppointment)

export default userRouter
