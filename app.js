const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const dotenv = require('dotenv')
const fs = require('fs')
const cors = require('cors')

dotenv.config()


//Database
mongoose.connect(process.env.MONGO_URI,
  {  useNewUrlParser: true,
     useUnifiedTopology: true
   })
.then(() => console.log("DB is connected"))

mongoose.connection.on('error', error => {
  console.log(`DB connection error: ${error.message}`);
})

//bring in routes
const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

//apiDocs
app.get('/', (req, res) => {
  fs.readFile('docs/apiDocs.json', (error, data) => {
    if(error){
      res.status(400).json({
        error: error
      })
    }
    const docs = JSON.parse(data)
    res.json(docs)
  })
})


// middleware
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

app.use('/', postRoutes )
app.use('/', authRoutes )
app.use('/', userRoutes )


app.use(function (error, req, res, next) {
  if (error.name === 'UnauthorizedError'){
    res.status(401).json({error: "You are unauthorized."})
  }
})







const port = process.env.PORT || 8080;
app.listen( port, () => { console.log('Node API is running..!');})
