import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import Login from './pages/Login'
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin/Dashboard';
import AddDoctors from './pages/Admin/AddDoctors';
import DoctorsList from './pages/Admin/DoctorsList';
import AllAppointments from './pages/Admin/AllAppointments';
import { DoctorContext } from './context/DoctorContext';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';



const App = () => {
  const { atoken } = useContext(AdminContext)
  const { dtoken } = useContext(DoctorContext)
  return atoken || dtoken ? (
    <div>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* admin paths */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctors' element={<AddDoctors />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
        


          {/* doctors path */}
          <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
          <Route path='/doctor-profile' element={<DoctorProfile/>} />
          </Routes>
       
      </div>

    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App