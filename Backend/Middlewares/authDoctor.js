import jwt from 'jsonwebtoken'

// doctor authentication middleware
const authDoc= async (req, res, next) => {
  try {
    const { dtoken } = req.headers
    if (!dtoken) {
      return res.json({ success: false, message: 'Not Authorized Login ' })
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
    console.log("heyyyyyyyyy")
      req.docId = token_decode.id || token_decode._id

    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
export default authDoc
