import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24">

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-12 flex flex-col md:flex-row items-center gap-12'>

        {/* Image Section */}
        <img 
          className='w-full md:w-[400px] lg:w-[450px] h-auto object-contain rounded-xl shadow-md' 
          src={assets.about_image} 
          alt="About Us"
        />

        {/* Text Section */}
        <div className='flex flex-col justify-center gap-6 md:w-3/5 text-base text-gray-700'>
          <p>
            Welcome to <strong>Prescripto</strong>, your trusted partner in managing your healthcare needs conveniently and efficiently. 
            At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments 
            and managing their health records.
          </p>

          <p>
            Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, 
            integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking 
            your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
          </p>

          <h2 className='text-xl font-semibold text-gray-800'>Our Vision</h2>

          <p>
            Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap 
            between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>
        </div>

      </div>
      
    </div>
  )
}

export default About
