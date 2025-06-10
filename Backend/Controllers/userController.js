import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import userModel from '../Models/userModel.js'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../Models/doctorModel.js'
import appointmentModel from '../Models/appointmentModel.js'


// API to register user
const registerUser = async (req, res) => {

  try {
    const { name, email, password } = req.body

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" })
    }
    //hashing user password
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    const userData={
        name,
        email,
        password:hashedPassword
    }
    const newuser=new userModel(userData)
    const user=await newuser.save()
    //creating token
     const token=jwt.sign({id:user.id},process.env.JWT_SECRET)
     res.json({success:true,token})
} catch(error){
    console.log(error);
    res.json({success:false,message:error.message})
}
}
//api for user login
const loginUser=async (req,res)=>{
    try{
        const { email, password } = req.body;
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'User does not exist'})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"invalid Credentials"})


        }
    }
    catch(error) {
        console.log(error);
        res.json({success:false,message:error.message});

    }
}
//api for user profile
const getProfile=async(req,res)=>{
    try {
        // console.log("req_body",req.body);
        const userId=req.userId
        
        //  const {userId}=req.body
         console.log(userId)
        const userData=await userModel.findById(userId).select('-password')
        res.json({success:true,userData})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});

        
    }
}
//api to update user profile
const updateUser = async (req, res) => {
  try {
    const userId=req.userId
    const { name, phone, address, dob, gender} = req.body;
    const imageFile = req.file;
    console.log("requestFile",req.file)
    

    if (!name || !phone || !gender || !dob) {
      return res.json({ success: false, message: "DATA MISSING!!" });
    }

    const updateData = {
      name,
      phone,
      dob,
      gender
    };

    // Parse address safely
    if (address) {
      try {
        updateData.address = JSON.parse(address);
      } catch (err) {
        return res.json({ success: false, message: "Invalid address format" });
      }
    }

    // Upload image if present
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      });
      updateData.image = imageUpload.secure_url;
    }

    // Single update
    await userModel.findByIdAndUpdate(userId, updateData);

    res.json({ success: true, message: "PROFILE UPDATED" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId; 
    const {  docId, slotDate, slotTime } = req.body

    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' })
    }

    let slots_booked = docData.slots_booked

    // checking for slot availability
    console.log("Requested slotDate:", slotDate);
console.log("Requested slotTime:", slotTime);
// console.log("Already booked slots on this date:", doctors.slots_booked[slotDate]);

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
       return res.json({ success: false, message: 'slot not available' })

      }
      else{
        slots_booked[slotDate].push(slotTime)
      }


    }
  else{
    slots_booked[slotDate]=[]
    slots_booked[slotDate].push(slotTime)
  }
  const userData=await userModel.findById(userId).select('-password')
  delete docData.slots_booked
  const appointmentData = {
  userId,
  docId,
  userData,
  docData,
  amount: docData.fees,
  slotTime,
  slotDate,
  date: Date.now()
}

const newAppointment = new appointmentModel(appointmentData)
await newAppointment.save()

//save new slots data in docData
await  doctorModel.findByIdAndUpdate(docId,{slots_booked})
res.json({success:true,message:"APPOINTMENT BOOKED"})

  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
  
   
  }
}

//api to  get users appointments for the frontend my-appointments page
const listAppointment=async (req,res)=>{
  try {
     const userId = req.userId;
     const appointments=await appointmentModel.find({userId})
     res.json({success:true,appointments})
    
  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
   
    
  }
}

//API to cancel appointment
 const cancelAppointment=async(req,res)=>{
  try {
     const userId = req.userId;
     const {appointmentId}=req.body
     const appointmentData=await appointmentModel.findById(appointmentId)

     //verify appointment user
     if(appointmentData.userId!==userId){
      res.json({success:false,message:'Unauthorized action'})
     }
     await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

     //releasing doctor slot
     const {docId,slotDate, slotTime}=appointmentData
     const doctorData=await doctorModel.findById(docId)
     let slots_booked=doctorData.slots_booked
     slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
     await doctorModel.findByIdAndUpdate(docId,{slots_booked})
     res.json({success:true,message:"APPOINTMENT CANCELLED!!"})

    
  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
   
    
  }
}


export {registerUser,loginUser,getProfile,updateUser,bookAppointment,listAppointment,cancelAppointment}