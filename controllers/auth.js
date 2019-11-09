const jwt = require('jsonwebtoken');
require('dotenv').config()
const User = require("../models/user");



exports.signup = async (req, res) => {
  const userExits = await User.findOne({email: req.body.email})

  if(userExits) return res.status(403).json({
    error: "Email is taken!"
  })

  const user = await new User(req.body)
  await user.save()
  res.status(200).json({message: "Signup success! please login."})
}

exports.signin = (req, res) => {
  // find the user based on Email
  const {email, password} = req.body
  User.findOne({email}, (error, user) => {
    // if user not exit, no user
    if(error || ! user){
      return res.status(401).json({
        error: "User with that email does not exist. Please signin"
      })
    }

    //if user is found, make sure the email and password matches
    //create authenticate method in model and use here
    if(!user.authenticate(password)){
      return res.status(401).json({
        error: "Email and password do not match"
      })
    }

    //generate a token with user id and secret
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)

    //persist the token as 't' in cookie with expire date
    res.cookie("t", token, {expire: new Date()+ 9999})

    // return response with user and token to frontend client
    const {_id, name, email} = user
    return res.json({token, user: {_id, email, name} })
  })

}

exports.signout = (req, res) => {
  res.clearCookie("t")
  return res.json({message: "Signout success!"})
}
