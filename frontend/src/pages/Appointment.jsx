import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const navigate=useNavigate()
  const { docId } = useParams();
  const { doctors, currency ,backendUrl,token,getDoctorsData} = useContext(AppContext);
  const daysOfWeek=['SUN','MON','TUE','WED','THUR','FRI','SAT']

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  /* FIX (PLACEMENT-READY): Default day index selection to 0 (first day) */
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };

  /* 
    FIX (PLACEMENT-READY): Group slots by day.
    Instead of a flat array of all 140+ slots, we group slots by day (0 to 6) 
    so the UI can render date selection and time slot selection in two separate clean flows.
  */
  const getAvailableSlots = async () => {
    let today = new Date();
    let groupedSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0); // 9pm

      // Set starting time
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let daySlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;
        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

        if (isSlotAvailable) {
          daySlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // Store both the day date representation and its specific slots
      groupedSlots.push({
        date: new Date(today.getTime() + i * 24 * 60 * 60 * 1000),
        slots: daySlots
      });
    }

    setDocSlots(groupedSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login');
    }
    if (!slotTime) {
      toast.warn('Please select a time slot');
      return;
    }

    try {
      /* FIX (PLACEMENT-READY): Adapted bookAppointment to use the new grouped slots data structure */
      const date = docSlots[slotIndex].date;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      console.log("🕒 Booked Slot Date:", slotDate, "Time:", slotTime);
      const {data}= await axios.post(backendUrl + '/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log("❌ Error booking slot:", error.message);
      toast.error("Failed to book appointment");
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return docInfo && (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className='bg-blue-500 w-full sm:max-w-72 rounded-lg'
            src={docInfo.image}
            alt=""
          />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>
          {/* About doctor */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">
              {docInfo.about}
            </p>
          </div>
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee: <span className="text-gray-600">{currency}{docInfo.fees}</span>
          </p>
        </div>
      </div>
      
      {/* booking slots */}
      {/* 
        FIX (PLACEMENT-READY): Refactored Layout.
        Separated booking slot selector into Day Selection (date cards) 
        and Time Selection (individual slot pills) to build a standard, premium medical booking experience.
      */}
      <div className="sm:ml-72 sm:pl-4 font-medium text-gray-700 mt-4">
        <p>Booking Slots</p>
        
        {/* Step 1: Day Selector */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div 
                onClick={() => { setSlotIndex(index); setSlotTime(""); }} 
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all duration-300 ${slotIndex===index?'bg-blue-500 text-white':'border border-gray-200 hover:bg-gray-50'}`} 
                key={index}
              >
                 <p>{item.date && daysOfWeek[item.date.getDay()]}</p>
                 <p>{item.date && item.date.getDate()}</p>
              </div>
            ))
          }
        </div>

        {/* Step 2: Time Selector for the Selected Day */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {
            docSlots.length && docSlots[slotIndex].slots.map((item, index) => (
              <p 
                onClick={() => setSlotTime(item.time)} 
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${item.time === slotTime ? 'bg-blue-500 text-white' : 'text-gray-400 border border-gray-300 hover:bg-gray-50'}`} 
                key={index}
              >
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>

        <button onClick={bookAppointment} className="bg-blue-500 text-white text-sm font-medium px-14 py-3  rounded-full my-6 hover:bg-blue-600 transition-all duration-300">Book  an Appointment</button>

      </div>
      {/* related doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  );
};

export default Appointment;

