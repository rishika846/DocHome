import validator from 'validator'
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from '../Models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../Models/appointmentModel.js'
import userModel from '../Models/userModel.js'
//API FOR ADDING DOCTOR
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        console.log({ name, email, password, speciality, degree, experience, about, fees, address, imageFile });
        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !about ||
            !fees ||
            !address
            ||
            !imageFile
        ) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }

        //validating  email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "please enter a valid email" })

        }
        //validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "please enter a strong password" })
        }
        //hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //uploading image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }
        const newDoctor = new doctorModel(doctorData)
        // await newDoctor.save()
        const savedDoctor = await newDoctor.save();
        console.log("Saved Doctor:", savedDoctor);
        if(savedDoctor){
             res.json({ success: true, message: "doctor added" })

        }

       

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error })

    }
}
// API FOR ADMIN LOGIN
const loginAdmin = async  (req, res) => {
    try {
        // console.log(req.body);
        const { email, password } = req.body;
        const salt = await bcrypt.genSalt(10)
        const hashedAdminPassword = await bcrypt.hash(password, salt)

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const atoken = jwt.sign(
                { email, hashedAdminPassword},
                process.env.JWT_SECRET,
                { expiresIn: '7d' } 
            );
            res.json({ success: true, atoken });
        } else {
            res.json({ success: false, message: "Incorrect credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//API FOR DOCTORS LIST IN ADMIN PANNEL FOR THE DASHBOARD
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        // if (doctors.length === 0) {
        //     return res.json({ success: true, doctors: [], message: "No doctors found" });
        // }
        console.log(doctors)
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error })

    }
}
//Api to get  all appointments list
const appointmentsAdmin=async(req,res)=>{
    try {
      const appointments=await appointmentModel.find({})
      res.json({success:true,appointments})
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error })
        
    }
}

//api for appointment cancellation by admin
 const appointmentCancel=async(req,res)=>{
  try {
  
     const {appointmentId}=req.body;
     const appointmentData=await appointmentModel.findById(appointmentId)

     
     //releasing doctor slot
     const {docId,slotDate, slotTime}=appointmentData
     const doctorData=await doctorModel.findById(docId)
     let slots_booked=doctorData.slots_booked
     slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
       // Mark appointment as cancelled
     await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
     await doctorModel.findByIdAndUpdate(docId,{slots_booked})

     res.json({success:true,message:"APPOINTMENT CANCELLED!!"})

    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
   
    
  }
}

//API TO GET DASHBOARD DATA FOR ADMIN PANEL
const adminDashboard=async(req,res)=>{
    try {
        const doctors=await doctorModel.find({})
        const users=await userModel.find({})
        const appointments=await appointmentModel.find({})

        const dashData={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)

        }
        res.json({success:true,dashData})

        
    } catch (error) {
        console.log(error);
    res.json({ success: false, message: error.message });
   
        
    }
}



export { addDoctor, loginAdmin, allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard }


