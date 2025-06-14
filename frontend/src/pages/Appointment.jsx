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
  const [slotIndex, setSlotIndex] = useState();
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };

  const getAvailableSlots = async  () => {
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);//creating a copy of today date
      currentDate.setDate(today.getDate() + i);//creating ahead 7 dates from current date

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0); //9pm

      // Set starting time
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()
         const slotDate = `${day}_${month}_${year}`;
        const slotTime=formattedTime;
        const isSlotAvailable=docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime)?false:true

       if(isSlotAvailable){
         //add slot to array
        allSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
       }
        currentDate.setMinutes(currentDate.getMinutes() + 30); // next slot in 30 min
      }
    }

    setDocSlots(allSlots);
  };
  const bookAppointment = async () => {
  if (!token) {
    toast.warn('Login to book appointment');
    return navigate('/login');
  }

  try {
    const date = docSlots[slotIndex].datetime;

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const slotDate = `${day}_${month}_${year}`;
    const slotTime = docSlots[slotIndex].time;


    console.log("🕒 Booked Slot:", date);
    console.log("📅 Formatted Slot Date:", slotDate);
    const {data}= await axios.post(backendUrl + '/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})
    if (data.success) {
     toast.success(data.message)
     getDoctorsData()
     navigate('/my-appointments')
}   else {
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
      <div className="sm:ml-72 sm:pl-4 font-medium text-gray-700">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full  overflow-x-scroll mt-4">
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index?'bg-blue-500 text-white':'border border-gray-200'}`} key={index}>
                 <p>{daysOfWeek[new Date(item.datetime).getDay()]}</p>
                 <p>{new Date(item.datetime).getDate()}</p>
                 <p>{item.time}</p>
                </div>
            ))
          }
        </div>
        <button onClick={bookAppointment} className="bg-blue-500 text-white text-sm font-medium px-14 py-3  rounded-full my-6">Book  an Appointment</button>

      </div>
      {/* related doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  );
};

export default Appointment;

