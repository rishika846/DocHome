import React from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {
    const { dtoken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
    const { calculateAge, slotDateFormat, currency } = useContext(AppContext)
    useEffect(() => {
        if (dtoken) {
            getAppointments()

        }
    }, [dtoken])
    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Appointments</p>
            <div className='bg-white  rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
                <div className='max-sm:hidden grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 '>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>
                {
                    appointments.map((item, index) => (
                        <div className='flex flex-wrap  justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 gap-1 items-center text-gray-500 hover:bg-gray-50'>
                            <p className='max-sm:hidden'>{index + 1}</p>
                            <div className='flex items-center gap-2'>
                                <img className='w-8 rounded-full' src={item.userData.image} alt="" />
                            </div>
                            <div>
                                <p className='text-xs inline border border-blue-500 px-2 rounded-full'>
                                    {item.payment ? 'Online' : "CASH"}
                                </p>
                            </div>
                            <p className='max-sm:hidden' >{calculateAge(item.userData.dob)}</p>
                            <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>
                            <p>{currency}{item.amount}</p>
                            {
                                item.cancelled
                                    ? <p className='text-xs inline border text-red-500 px-2 rounded-full'>Cancelled</p>
                                    : item.isCompleted
                                        ? <p className='text-xs inline border text-green-500 px-2 rounded-full'>Completed</p>
                                        : <div className='flex'>
                                            <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                                            <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                                        </div>

                            }

                        </div>

                    ))
                }
            </div>

        </div>
    )
}

export default DoctorAppointments