const env = require('dotenv');
env.config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const multer = require("multer");
const fileStorage = require("./util/fileStorage");
const compression = require("compression");
const morgan = require("morgan");
const fs = require('fs');


console.log(process.env.NODE_ENV);
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

//views engine
// app.set('view engine', 'ejs');
// app.set('views', 'views');

//middleware
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());
app.use(compression());
app.use(morgan('combined', { stream : accessLogStream}));

//upload
//need to declare global for using multer
app.post('/uploads', multer({ storage: fileStorage.uploadStorage}).single("file"));


app.use((req, res, next) => {
  req.user_id = 1;
  req.role_id = 1;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "OPTIONS, GET, POST, PUT, PATH, DELETE");
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//static
app.use(express.static(path.join(__dirname, "public")));
app.use("/images/product", express.static(path.join(__dirname, "images/product")));

//controllers
const errorController = require("./controllers/ErrorController");

//routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);


//response
app.use((obj, req, res, next) => {
  let error = {};
  if (obj.data == undefined) { 
    if (obj.statusCode) error.statusCode = obj.statusCode;
    else error.statusCode = 500; // assign error if we didn't catch
    error.message = obj.message + ` at ${req.url}`;
  } else error = obj.error;
  
  if (!error) {
    res.status(200).json({
      head: {
        error: false,
        statusCode: 200,
        message: "ok",
      },
      body: {
        insertedId: obj.insertedId,
        data: obj.data
      }
    });
  } else {
    res.status(error.statusCode).json({
      head: {
        error: true,
        statusCode: error.statusCode,
        message: error.message,
      },
      body: {
        insertedId: 0,
        data: {}
      }
    });
  }
});

app.use("/500", errorController.get500Page);
app.use(errorController.get404Page);

app.listen(process.env.PORT || 3000);
