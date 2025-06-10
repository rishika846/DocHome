import React, { createContext, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dtoken, setDtoken] = useState(() => localStorage.getItem("dtoken") || "");
  const [appointments, setAppointments] = useState([])
  const[dashData,setDashData]=useState(false)
  const [profileData,setProfileData]=useState(false)
  const getAppointments = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
      headers: { dtoken}
    })

    if (data.success) {
      setAppointments(data.appointments.reverse())
      console.log(data)
    } else {
      toast.error(data.message)
    }

  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}



  //mark appointment as complete
  const completeAppointment=async(appointmentId)=>{
    try {
      const {data}=await axios.post(backendUrl + '/api/doctor/complete-appointment',{appointmentId},{headers:{dtoken}})
      if(data.success){
        toast.success(data.message)
        getAppointments()
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }

   //mark appointment as cancel
  const cancelAppointment=async(appointmentId)=>{
    try {
      const {data}=await axios.post(backendUrl + '/api/doctor/cancel-appointment',{appointmentId},{headers:{dtoken}})
      if(data.success){
        toast.success(data.message)
        getAppointments()
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }
  //to get dashData for Dashboard in doctor panel
  const getDashData=async ()=>{
    try {
      
      const {data}=await axios.get(backendUrl+'/api/doctor/dashboard',{headers:{dtoken}})
      if(data.success){
        setDashData(data.dashData)
        console.log("dashdata",data.dashData)
      } else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }

  //to get profile data
  const getProfileData=async()=>{
    try {
      console.log("profile data")
      const {data}=await axios.get(backendUrl+'/api/doctor/profile',{headers:{dtoken}})
      if(data.success){
        console.log(data)
        setProfileData(data.profileData)
        console.log("Profile Data",data.profileData)
      }
      
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }
  
  const value = {
    dtoken,
    setDtoken,
    backendUrl,setAppointments,appointments,getAppointments,cancelAppointment,completeAppointment,
    dashData,setDashData,getDashData,
    setProfileData,profileData,getProfileData
  };
  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;

