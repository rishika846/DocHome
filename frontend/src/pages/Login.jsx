import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate=useNavigate()
  const {backendUrl,setToken,token}=useContext(AppContext);
  const [state, setState] = useState("sign-up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if(state=='sign-up'){
        const {data}=await axios.post(backendUrl+'/api/user/register',{name,password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        } else{
          toast.error(data.message)
        }
      }
      else{
        if(state=='login'){
        const {data}=await axios.post(backendUrl+'/api/user/login',{password,email})
        if(data.success){
          console.log("successful login")
          localStorage.setItem('token',data.token)
          setToken(data.token) 
        } else{
          toast.error(data.message)
        }
      }
        

      }
      
    } catch (error) {
       toast.error(error.message)
      
    }
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
  };
  useEffect(()=>{
    if(token){
      navigate("/")

    }
  },[token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>
          {state === "sign-up" ? "Create Account" : "Login"}
        </p>
        <p>Please {state === "sign-up" ? "sign up" : "log in"} to book appointment</p>

        {state === "sign-up" && (
          <div className='w-full'>
            <label className='block mt-2'>Full Name</label>
            <input
              type="text"
              className="w-full border border-zinc-300 rounded p-2"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className='w-full'>
          <label className='block mt-2'>Email</label>
          <input
            type="email"
            className="w-full border border-zinc-300 rounded p-2"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <label className='block mt-2'>Password</label>
          <input
            type="password"
            className="w-full border border-zinc-300 rounded p-2"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button type='submit' className='bg-blue-500 text-white w-full py-2 rounded-md text-base mt-4'>
          {state === "sign-up" ? "Create Account" : "Login"}
        </button>

        {state === "sign-up" ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setState("login")} className='text-blue-500 cursor-pointer underline'>
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span onClick={() => setState("sign-up")} className='text-blue-500 cursor-pointer underline'>
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
