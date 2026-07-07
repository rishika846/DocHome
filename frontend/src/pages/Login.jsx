import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Login = () => {
  const navigate=useNavigate()
  const {backendUrl,setToken,token}=useContext(AppContext);
  const [state, setState] = useState("sign-up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
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
      
    } finally {
      setIsSubmitting(false);
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

  if (loading) {
    return <Loader />
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center animate-fade-in-up'>
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

        <button type='submit' disabled={isSubmitting} className='bg-blue-500 text-white w-full py-2 rounded-md text-base mt-4 flex items-center justify-center gap-2 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300'>
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {state === "sign-up" ? "Creating Account..." : "Logging in..."}
            </>
          ) : (
            state === "sign-up" ? "Create Account" : "Login"
          )}
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
