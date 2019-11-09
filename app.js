const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const dotenv = require('dotenv')

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

const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')


// middleware
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())

app.use('/', postRoutes )
app.use('/', authRoutes )







const port = process.env.PORT || 8080;
app.listen( port, () => { console.log('Node API is running..!');})
