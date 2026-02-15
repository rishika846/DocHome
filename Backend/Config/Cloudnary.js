import { v2 as cloudinary } from 'cloudinary'
const connectCloudinary= async ()=>{
cloudinary.config({ 
  cloud_name: 'dhl4d7liv',
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});
}
export default connectCloudinary