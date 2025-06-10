import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const { doctors, backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paidAppointments, setPaidAppointments] = useState({}); // New state for paid status

  const months = ["", "Jan", "Feb", "March", "April", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
      console.log("hey")
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePayOnline = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPaymentForm(true);
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {appointments.slice(0, 3).map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-22 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zincx-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-zinc-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && paidAppointments[item._id] ? (
                <button
                  disabled
                  className='text-sm text-green-600 text-center sm:min-w-48 py-2 border rounded bg-green-100 cursor-not-allowed'
                >
                  Paid
                </button>
              ) : !item.cancelled  ? !item.isCompleted &&(
                <button
                  onClick={() => handlePayOnline(item)}
                  className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300'
                >
                  Pay Online
                </button>
              ) : null}

              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300'
                >
                  Cancel appointment
                </button>
              )}

              {item.cancelled && !item.isCompleted && (
                <button className='text-sm text-red-500 text-center sm:min-w-48 py-2 border rounded'>
                  Appointment Cancelled
                </button>
              )}
                {item.isCompleted && (
                <button className='text-sm text-green-500 text-center sm:min-w-48 py-2 border rounded'>
                 Completed
                </button>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const paymentInfo = {
                  cardNumber: formData.get("cardNumber"),
                  expiryDate: formData.get("expiryDate"),
                  cvv: formData.get("cvv"),
                  nameOnCard: formData.get("nameOnCard"),
                };
                console.log("Payment Info:", paymentInfo);

                // Mark appointment as paid in state
                setPaidAppointments((prev) => ({
                  ...prev,
                  [selectedAppointment._id]: true,
                }));

                setShowPaymentForm(false); // close modal
                toast.success("Payment submitted");
              }}
            >
              <div className="mb-3">
                <label className="block text-sm">Card Number</label>
                <input name="cardNumber" required type="text" className="w-full border p-2 rounded" />
              </div>
              <div className="mb-3">
                <label className="block text-sm">Expiry Date (MM/YY)</label>
                <input name="expiryDate" required type="text" className="w-full border p-2 rounded" />
              </div>
              <div className="mb-3">
                <label className="block text-sm">CVV</label>
                <input name="cvv" required type="password" className="w-full border p-2 rounded" />
              </div>
              <div className="mb-3">
                <label className="block text-sm">Name on Card</label>
                <input name="nameOnCard" required type="text" className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-between mt-4">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Submit
                </button>
                <button type="button" onClick={() => setShowPaymentForm(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
