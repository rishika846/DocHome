import doctorModel from "../Models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../Models/appointmentModel.js";
import mongoose from "mongoose";
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })



    }
}
const doctorsList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })



    }
}
//Api for Doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            res.json({ success: false, message: "INVALID CREDENTIALS!!" })
        }
        const isMatch = await bcrypt.compare(password, doctor.password)
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })

        } else {
            res.json({ super: false, message: "INVALID PASSWORD" })
        }

    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })



    }
}
// API TO GET DOCTOR APPOINTMENTS FOR DOCTOER PANEL
const appointmentsDoctor = async (req, res) => {
    try {

        const docId = req.docId;
        // console.log("docId",docId)

        // const objectId = new mongoose.Types.ObjectId(docId);
        const appointments = await appointmentModel.find({ docId: docId.trim() });

        // console.log(appointments)
        res.json({ success: true, appointments })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}
// API TO MARK APPOINTMENT IN DOCTOR PANEL

const appointmentComplete = async (req, res) => {
    try {
        const docId = req.docId;
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: "Appointment completed" })
        }
        else {
            return res.json({ success: false, message: "MARK FAILED" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })


    }
}
// API TO CANCEL APPOINTMENT IN DOCTOR PANEL

const appointmentCancel = async (req, res) => {
    try {
        const docId = req.docId;
        console.log("docID in Cancellation", docId)
        const { appointmentId } = req.body
        console.log("AppointmentId in Cancellation :", appointmentId)
        const appointmentData = await appointmentModel.findById(appointmentId)
        console.log("AppointmentDATA in Cancellation", appointmentData)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: "Appointment cancelled successfully" })
        }
        else {
            return res.json({ success: false, message: "CANCELLATION FAILED" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })


    }
}
//API TO GET DASHBOARD DATA FOR DOCTOR PANEL
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId;
        const appointments = await appointmentModel.find({ docId: docId.trim() });
        let earnings = 0
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })
        let patients = []
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })
        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}
//API TO GET PROFILE DATA FOR DOCTOR PANEL
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId
        console.log("####docid",docId)
        const profileData = await doctorModel.findById(docId.trim());
        console.log("ProfileData",profileData)
        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })


    }
}
//API TO UPDATE DOCTOR PROFILE
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId
        const {fees,address,available}=req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:"PROFILE UPDATED !"})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })


    }
}

export { changeAvailability, doctorsList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard,doctorProfile,updateDoctorProfile }