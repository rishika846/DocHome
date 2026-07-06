import React, { useState, useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'

const PencilIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 20.08a4.5 4.5 0 01-2.014 1.242l-3.85.962.962-3.85a4.5 4.5 0 011.242-2.013L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
)

const SpinnerIcon = ({ className = 'w-4 h-4 animate-spin' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

const MyProfile = () => {

  const [isEdit,setIsEdit]=useState(false)
  const [image,setImage]=useState(false)
  const [loading,setLoading]=useState(false)
  const {userData,setUserData,token,backendUrl,loadUserData}=useContext(AppContext)
  
  const updateUserData=async()=>{
    try {
      setLoading(true)
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      image && formData.append('image', image)

      const { data } = await axios.post(backendUrl + '/api/user/update-profile',formData,{headers:{token}})
      if(data.success){
        toast.success(data.message)
        await loadUserData()
        setIsEdit(false)
        setImage(false)
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
    return <Loader />
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {
        isEdit
        ?<label htmlFor="image">
          <div className='inline-block relative cursor-pointer group'>
            <img className='w-36 h-36 object-cover rounded opacity-75 group-hover:opacity-60 transition-all duration-300' src={image?URL.createObjectURL(image):userData.image} />
            <div className='absolute inset-0 flex items-center justify-center bg-black/30 rounded opacity-100 group-hover:bg-black/45 transition-all duration-300'>
              <img className='w-8 filter invert' src={image?'':assets.upload_icon} />
            </div>
          </div>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden />
        </label>
        : <div className='relative group w-36 h-36'>
            <img className='w-36 h-36 object-cover rounded' src={userData.image} alt="" />
            <div 
              onClick={()=>setIsEdit(true)} 
              className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded cursor-pointer transition-all duration-300'
            >
              <PencilIcon className='w-6 h-6 text-white' />
            </div>
          </div>
      }
     
      {isEdit
      ? <div className='flex items-center gap-2 mt-4'>
          <input className='bg-gray-50 text-3xl font-medium max-w-60 border-b border-gray-300 focus:outline-none focus:border-blue-500' type='text' value={userData.name} onChange={(e)=>setUserData(prev=>({...prev,name:e.target.value}))}/>
        </div>
      :<div className='flex items-center gap-2 mt-4 group'>
          <p className='font-medium text-3xl text-neutral-800'>{userData.name}</p>
          <button onClick={()=>setIsEdit(true)} className='opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all duration-300'>
            <PencilIcon className='w-5 h-5' />
          </button>
       </div>
      }
      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3'>Contact Information</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email Id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          
          <p className='font-medium'>Phone:</p>
          {isEdit
          ? <input className='bg-gray-100 max-w-52 px-2 py-0.5 rounded border border-gray-200' type='text' value={userData.phone} onChange={(e)=>setUserData(prev=>({...prev,phone:e.target.value}))}/>
          :<div className='flex items-center gap-2 group'>
              <p className='text-blue-400'>{userData.phone}</p>
              <button onClick={()=>setIsEdit(true)} className='opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all duration-300'>
                <PencilIcon className='w-3.5 h-3.5' />
              </button>
            </div>
          }
          
          <p className='font-medium'>Address:</p>
          {isEdit
          ? <div className='flex flex-col gap-1.5'>
              <input className='bg-gray-100 px-2 py-0.5 rounded border border-gray-200' type="text" value={userData.address.line1} onChange={(e)=>setUserData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))} />
              <input className='bg-gray-100 px-2 py-0.5 rounded border border-gray-200' type="text" value={userData.address.line2} onChange={(e)=>setUserData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))} />
            </div>
          :<div className='flex items-start gap-2 group'>
              <p className='text-gray-500'>{userData.address.line1}
              <br />
              {userData.address.line2}</p>
              <button onClick={()=>setIsEdit(true)} className='opacity-0 group-hover:opacity-100 mt-1 text-gray-400 hover:text-blue-500 transition-all duration-300'>
                <PencilIcon className='w-3.5 h-3.5' />
              </button>
            </div>
          }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit
          ? <select className='max-w-28 bg-gray-100 px-2 py-0.5 rounded border border-gray-200' onChange={(e)=>setUserData(prev=>({...prev,gender:e.target.value}))} value={userData.gender}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          :<div className='flex items-center gap-2 group'>
              <p className='text-gray-400 capitalize'>{userData.gender}</p>
              <button onClick={()=>setIsEdit(true)} className='opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all duration-300'>
                <PencilIcon className='w-3.5 h-3.5' />
              </button>
            </div>
          }
          
          <p className='font-medium'>Birthday:</p>
          {isEdit
          ? <input className='max-w-32 bg-gray-100 px-2 py-0.5 rounded border border-gray-200' type='date' value={userData.dob} onChange={(e)=>setUserData(prev=>({...prev,dob:e.target.value}))}/>
          :<div className='flex items-center gap-2 group'>
              <p className='text-gray-400'>{userData.dob}</p>
              <button onClick={()=>setIsEdit(true)} className='opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all duration-300'>
                <PencilIcon className='w-3.5 h-3.5' />
              </button>
            </div>
          }
        </div>
      </div>
      <div className='mt-10'>
        {
          isEdit?
          <button 
            disabled={loading} 
            className='border bg-blue-500 text-white border-blue-500 px-8 py-2 rounded-full flex items-center gap-2 hover:bg-blue-600 transition-all duration-300' 
            onClick={updateUserData}
          >
            {loading && <SpinnerIcon />}
            {loading ? 'Saving...' : 'Save Information'}
          </button>:
          <button 
            className='border border-blue-500 px-8 py-2 rounded-full flex items-center gap-2 hover:bg-blue-50 transition-all duration-300' 
            onClick={()=>setIsEdit(true)}
          >
            <PencilIcon className='w-4 h-4' />
            Edit
          </button>
        }
      </div>
    </div>
  )
}

export default MyProfile
