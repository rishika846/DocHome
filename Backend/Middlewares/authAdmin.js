import jwt from 'jsonwebtoken'

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({ success: false, message: 'Not Authorized. Login Again.' });
    }
    
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    /* 
      FIX (PLACEMENT-READY): Removed bcrypt.compare check on process.env.ADMIN_PASSWORD.
      Running bcrypt.compare on every single admin API request consumes excessive CPU cycles,
      leading to severe response delays and exposing the server to Denial of Service (DoS) attacks.
      JWT signature verification is sufficient to authenticate the admin token.
    */
    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;


