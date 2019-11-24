const Post = require('../models/post')
const _ = require('lodash')
const formidable = require('formidable')
const fs = require('fs')

exports.postById = (req, res, next, id) => {
  Post.findById(id)
      .populate("postedBy", "_id name")
      .exec((error, post) => {
        if (error || !post){
          return res.status(400).json({
            error: error
          })
        }

        req.post = post;
        next()
      })
}

exports.getPosts = (req, res) => {
  const posts = Post.find()
                .populate("postedBy", "_id name")
                .select("_id title body created")
                .sort({created: -1})
                .then( (posts) => {
                  res.json(posts)
                })
                .catch(err => console.log(err))
}


exports.createPost = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true;
  form.parse( req, ( error, fields, files ) => {
    if(error){
      return res.status(400).json({
        error: "Image could not be uploaded."
      })
    }
    let post = new Post(fields)
    req.profile.salt = undefined
    req.profile.hashed_password = undefined
    post.postedBy = req.profile


    if(files.photo){
      post.photo.data = fs.readFileSync(files.photo.path)
      post.photo.contentType = files.photo.type
    }
    post.save( (error, result) => {
      if(error){
        return res.status(400).json({
          error: error
        })
      }
      res.json(result)
    })
  })
}

exports.postsByUser = (req, res) => {
  Post.find({postedBy: req.profile._id})
      .populate("postedBy", "_id name")
      .sort("_created")
      .exec( (error, posts) => {
        if(error){
          return res.status(400).json({
            error: error
          })
        }
        res.json(posts)
      })
}

exports.isPoster = (req, res , next) =>{
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
  if(!isPoster){
      return res.status(403).json({
        error: "User is not authorized."
      })
  }
  next()
}


// exports.updatePost = (req, res, next) => {
//     let form = new formidable.IncomingForm()
//     form.keepExtensions = true
//     form.parse( req, (error, fields, files) => {
//       if(error){
//         return res.status(400).json({
//           error: "Photo could not be uploaded"
//         })
//       }
//
//       let post = req.post
//       post = _.extend(post, fields)
//       post.updated = Date.now()
//
//       if(files.post){
//         post.photo.data = fs.readFileSync(files.photo.path)
//         post.photo.contentType = files.photo.type
//       }
//       post.save((error, result) => {
//         if(error){
//           return res.status(400).json({
//             error: error
//           })
//         }
//
//         res.json(post)
//       })
//
//     })
// }

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save post
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    });
};

exports.deletePost = (req, res) => {
  let post = req.post
  post.remove( (error, post) => {
    if(error){
      return res.status(400).json({
        error: error
      })
    }
    res.json({message: "Post was deleted successfully."})
  })
}

exports.photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType)
  return res.send(req.post.photo.data)
}

exports.singlePost = (req, res) => {
    return res.json(req.post)
}
