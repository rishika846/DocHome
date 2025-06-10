import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorProfile, doctorsList,loginDoctor, updateDoctorProfile} from '../Controllers/doctorController.js'
import authDoc from '../Middlewares/authDoctor.js'

const doctorRouter=express.Router()
doctorRouter.get('/list', doctorsList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoc,appointmentsDoctor)
doctorRouter.post('/complete-appointment',authDoc,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoc,appointmentCancel)
doctorRouter.get('/dashboard',authDoc,doctorDashboard)
doctorRouter.get('/profile',authDoc,doctorProfile)
doctorRouter.post('/update-profile',authDoc,updateDoctorProfile)



export default doctorRouter