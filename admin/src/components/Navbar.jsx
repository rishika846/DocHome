import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext' 

const Navbar = () => {
    const { atoken, setAtoken } = useContext(AdminContext)
    const { dtoken, setDtoken } = useContext(DoctorContext) 
    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        if (atoken) {
            setAtoken('')
            localStorage.removeItem('atoken')
        }
        if (dtoken) {
            setDtoken('')
            localStorage.removeItem('dtoken')
        }
    }

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
            <div className='flex items-center gap-2 text-xs'>
                <img className='w-36 sm:w-40 cursor-pointer' src={assets.DocHomeLogo} alt="" />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
                    {atoken ? 'Admin' : dtoken ? 'Doctor' : ''}
                </p>
            </div>
            <button onClick={logout} className='bg-blue-500 text-white text-sm px-10 py-2 rounded-full'>Logout</button>
        </div>
    )
}

export default Navbar
