import React, { useState } from 'react'
import { useContext }  from 'react';
import { useNavigate } from 'react-router-dom';

import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext} from '../context/DoctorContext';

const Login = () => {
const{dtoken,setDtoken}=useContext(DoctorContext)
const navigate=useNavigate()
const [state, setState] = useState('Admin');
const [email,setEmail]=useState('');
const [password,setPassword]=useState('');
const {setAtoken,backendUrl,atoken}=useContext(AdminContext);
const onSubmitHandler=async(event)=>{
    event.preventDefault()
    try {
        if(state==='Admin'){
            const {data}= await axios.post(backendUrl + '/api/admin/login',{email,password})
            console.log(data.success)
            if(data.success){
              localStorage.setItem('atoken',data.atoken)
                setAtoken(data.atoken)
                navigate('/admin-dashboard')
            }
            else{
              toast.error(data.message)
            }
        }
        else{
           const {data}= await axios.post(backendUrl + '/api/doctor/login',{email,password})
            console.log(data.success)
            if(data.success){

              localStorage.setItem('dtoken',data.token)

                setAtoken(data.token)
                navigate('/doctor-dashboard')
            }
            else{
              toast.error(data.message)
            }

        }
        
    } catch (error) {
        
    }
}

  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-blue-500'>{state}</span> Login
        </p>
        <div className='w-full'>
          <p>Email</p>
          <input
            onChange={(e)=>setEmail(e.target.value)} value={email}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='email'
            required
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
           onChange={(e)=>setPassword(e.target.value)} value={password}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='password'
            required
          />
        </div>
        <button  className='bg-blue-500 text-white w-full py-2 rounded-md text-base'>
          Login
        </button>
     {
  state === 'Admin' ? (
    <p>
      Doctor Login?{' '}
      <span
        className='text-blue-500 underline cursor-pointer'
        onClick={() => setState('Doctor')}
      >
        Click Here
      </span>
    </p>
  ) : (
    <p>
      Admin Login?{' '}
      <span
        className='text-blue-500 underline cursor-pointer'
        onClick={() => setState('Admin')}
      >
        Click Here
      </span>
    </p>
  )
}

      </div>
    </form>
  )
}

export default Login
