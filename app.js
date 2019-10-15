const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const fileStorage = require("./util/fileStorage");
const app = express();

//views engine
// app.set('view engine', 'ejs');
// app.set('views', 'views');

//middleware
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

//upload
app.use(multer({ storage: fileStorage.productStorage,  fileFilter: fileStorage.fileFilter }).array("image"));

//controllers
const errorController = require("./controllers/errorController");

//routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

//response
app.use((data, req, res, next) => {
  const error = data.error;
  if (!error) {
    res.status(200).json({
      error: false,
      statusCode: 200,
      message: "ok",
      data: data.data
    });
  } else {
    res.status(error.httpStatusCode).json({
      error: true,
      statusCode: error.httpStatusCode,
      message: error.message,
      data: {}
    });
  }
});

app.use("/500", errorController.get500Page);
app.use(errorController.get404Page);

app.listen(3000);
