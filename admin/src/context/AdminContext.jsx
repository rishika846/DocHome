import React from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [atoken,setAtoken]=useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):'')
    const [dashData,setDashData]=useState(false)
    const [doctors,setDoctors]=useState([])
     const [appointments,setAppointments]=useState([])
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    //to get all doctors
    const getAllDoctors=async()=>{
      try {
        const {data}=await axios.get(backendUrl+'/api/admin/all-doctors',{headers:{atoken}});
        if(data.success){
          setDoctors(data.doctors)
          console.log(data.doctors)
        }
        else{
          toast.error(data.message)
        }
        
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        
      }


    }
    //to change availability
    const changeAvailability=async(docId)=>{
      try {
        setDoctors((prevDoctors) =>
      prevDoctors.map((doc) =>
        doc._id === docId ? { ...doc, available: !doc.available } : doc
      )
    );
        const {data}=await axios.post(backendUrl+"/api/admin/change-availability",{docId},{headers:{atoken}})
        if(data.success){
         toast.success(data.message)
       
        }
        else{
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
        
      }

    }
    //get all appointments
const getAllAppointments=async()=>{
  try {
    const {data}=await axios.get(backendUrl +'/api/admin/appointments',{headers:{atoken}})
    if(data.success){
      console.log("Data Appointments :",data.appointments)
      setAppointments(data.appointments)
      console.log("Appointments::",data)
    } else{
      toast.error(error.message)
    }
    
  } catch (error) {
    toast.error(error.message)
    
  }
}

//api to cancel appointment by admin
const cancelAppointment=async(appointmentId)=>{
  
  try {
   
    const {data}= await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{atoken}})
    if(data.success){
      console.log("data",data)
      toast.success(data.message)
      getAllAppointments()
    }
    else{
      console.log(error)
      toast.error(data.message)
    }
    
  } catch (error) {
    console.log(error)
    toast.error(error.message)
    
  }
}
// api to display dashboard data
const getDashData=async()=>{
  try {
    const {data}=await axios.get(backendUrl+'/api/admin/dashboard',{headers:{atoken}})
    console.log(data)
    if(data.success){
      setDashData(data.dashData);

    }else{
      toast.error(data.message)
    }
    
  } catch (error) {
    console.log(error)
    toast.error(error.message)
    
  }
}
  const value = {
    atoken,setAtoken,doctors,
    backendUrl,getAllDoctors,changeAvailability,appointments,setAppointments,getAllAppointments,cancelAppointment,dashData,getDashData
  }

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider;
