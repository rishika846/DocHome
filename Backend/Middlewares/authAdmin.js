import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({ success: false, message: 'Not Authorized. Login Again.' });
    }
    

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    console.log(token_decode.email)
    console.log(token_decode.hashedAdminPassword)
   // token_decode.hashedAdminPassword!==
    const isMatch= await bcrypt.compare(process.env.ADMIN_PASSWORD, token_decode.hashedAdminPassword)

    if (
      token_decode.email !== process.env.ADMIN_EMAIL || !isMatch )
      
    {
      return res.json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;


