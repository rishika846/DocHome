import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser= async (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) {
      return res.json({ success: false, message: 'Not Authorized Login ' })
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
      req.userId = token_decode.id || token_decode._id; 

    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
export default authUser
