import { v2 as cloudinary } from 'cloudinary'
const connectCloudinary= async ()=>{
cloudinary.config({ 
  /* FIX (PLACEMENT-READY): Made cloud_name configurable via environment variable with a fallback */
  cloud_name: process.env.CLOUDINARY_NAME || 'dhl4d7liv',
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});
}
export default connectCloudinary
