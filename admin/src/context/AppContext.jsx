import React from "react";
import { createContext } from "react";

export const AppContext = createContext();

//currency symbol
const currency='$'

const AppContextProvider = (props) => {
  
  //calculate age of user
  const calculateAge=(dob)=>{
    const today=new Date()
    const birthDate=new Date(dob)
    let age=today.getFullYear()-birthDate.getFullYear()
    return age
  }

  
  //converting slotDate into a formatted Date
  const months = ["", "Jan", "Feb", "March", "April", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };



  const value = {
    calculateAge,slotDateFormat,currency
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;
