import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'


const DoctorProfile = () => {
  const {dtoken,setProfileData,profileData,getDashData,getProfileData,backendUrl}=useContext(DoctorContext)
  const {currency}=useContext(AppContext)
  const [isEdit,setIsEdit]=useState(false)
  const updateProfile=async()=>{
    try {
      const updateData={
        address:profileData.address,
        fees:profileData.fees,
        available:profileData.available 
      }
      const {data}=await axios.post(backendUrl+'/api/doctor/update-profile',updateData,{headers:{dtoken}})
      if(data.success){
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
      console.log(error)
      
    }
  }
  useEffect(()=>{
    console.log("useeffect???")
    if(dtoken){
      getProfileData()
      console.log("profiledata",profileData)
    }
  },[dtoken])
  return profileData && (
    <div>
      <div className='flex flex-col gap-4 m-5'>
        <div>
          <img className='bg-blue-500 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
        </div>
        <div className='flex-1 border  border-stone-100 rounded-lg p-8 oy-7 bg-white'>
          {/* docinfo:name,degree,expierence */}
          <p className='flex  items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
          <div className=' flex items-center gap-2 mt-1 text-gray-600'>
            <p>{profileData.degree}-{profileData.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
          </div>
          {/* doc about */}
          <div >
            <p className='flex items-center gap-1text-sm font-medium text-neutral-800 mt-3'>ABOUT:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
          </div>
          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>{currency} {isEdit?<input type="number" value={profileData.fees} onChange={(e)=>setProfileData(Prev=>({...Prev,fees:e.target.value}))}/>:profileData.fees}</span>
          </p>
          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              { isEdit?  <input type='text' value={profileData.address.line1} onChange={(e)=>setProfileData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))}/> :profileData.address.line1}
              <br />
                { isEdit?  <input type='text' value={profileData.address.line2} onChange={(e)=>setProfileData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))}/> :profileData.address.line2}

            </p>
            </div>
            <div className=' flex gap-1pt-2'>
              <input onChange={()=>isEdit && setProfileData(prev=>({...prev,available:!prev.available}))} checked={profileData.available} type="checkbox" id='available' />
              <label htmlFor="available">Available</label>
            </div>
            {
              isEdit
              ?<button onClick={updateProfile} className='  text-gray-800 px-4 py-1 border   border-blue-500  rounded-full mt-5 hover:bg-blue-500 hover:text-white  transition-all'>Save</button>
              :<button onClick={()=>setIsEdit(true)} className='  text-gray-800 px-4 py-1 border   border-blue-500  rounded-full mt-5 hover:bg-blue-500 hover:text-white  transition-all'>Edit</button>
            }
            
          
        </div>

      </div>
    </div>
  )
}

export default DoctorProfile