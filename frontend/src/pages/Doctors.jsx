import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../Context/AppContext';

const Doctors = () => {
    const { speciality }=useParams();
    const [filterDoc,setFilterDoc]=useState([])
    const navigate=useNavigate();
    console.log(speciality);
    const {doctors}=useContext(AppContext);
    const applyFilter=()=>{
      if(speciality){
        setFilterDoc(doctors.filter(doc=>doc.speciality===speciality))}
        else{
          setFilterDoc(doctors)
        }
      
    }
    useEffect(()=>{
      applyFilter()

    },[doctors,speciality ])
  return (

    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5  mt-5'>
        <div className=' flex flex-col gap-4 text-sm text-gray-600'>
          <p className='w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all  cursor' onClick={()=>speciality==='General physician'?navigate('/doctors'):navigate('/doctors/General physician')}>General physician</p>
          < p className='w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all  cursor'onClick={()=>speciality==='Gynecologist'?navigate('/doctors'):navigate('/doctors/Gynecologist')}>Gynecologist</p>
          <p className='w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all  cursor'onClick={()=>speciality==='Dermatologist'?navigate('/doctors/'):navigate('/doctors/Dermatologist')}>Dermatologist</p>
          <p className='w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all  cursor'onClick={()=>speciality==='Pediatricians'?navigate('/doctors'):navigate('/doctors/Pediatricians')}>Pediatricians</p>
          <p className='w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all  cursor'onClick={()=>speciality==='Neurologist'?navigate('/doctors'):navigate('/doctors/Neurologist')}> Neurologist</p>
          <p className='w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all  cursor'onClick={()=>speciality==='Gastroenterologist'?navigate('/doctors'):navigate('/doctors/Gastroenterologist')}>Gastroenterologist</p>
        </div>
        <div className='w-full grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6'>
          {
            filterDoc.map((item,index)=>(
                <div  onClick={()=>navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'key={index}>
                    <img  className='bg-blue-50'src={item.image} alt="" />
                    <div className='p-4'> 
                     <div className={`flex items-center gap-2 text-sm text-center ${item.available?"text-green-500":"text-gray-500"} `}>
                        <p className={`w-2 h-2 ${item.available?" bg-green-500": "bg-gray-500"} rounded-full`}></p><p>{item.available?"Available":"Not Available"}</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium '>{item.name}</p>
                    <p className='text-gray-600 text-sm'>{item.speciality }</p>
                    </div>

                    
                </div>
            ))
          }

        </div>



      </div>

    </div>
  )
}

export default Doctors