const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const postSchema = new mongoose.Schema ({
  title: {
    type: String,
    require: "Title is required",
    minlength: 4,
    maxlength: 150
  },
  body: {
    type: String,
    required: "body is required",
    minlength: 4,
    maxlength: 2000
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  postedBy:{
    type: ObjectId,
    ref: "User"
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Post", postSchema)
