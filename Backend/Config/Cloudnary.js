import { v2 as cloudinary } from 'cloudinary'
const connectCloudinary= async ()=>{
cloudinary.config({ 
  cloud_name: 'dhl4d7liv',
  api_key: API_KEY, 
  api_secret: API_SECRET
});
}
export default connectCloudinary