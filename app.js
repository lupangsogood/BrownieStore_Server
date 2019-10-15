const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

//views engine
// app.set('view engine', 'ejs');
// app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));


//controllers
const errorController = require('./controllers/errorController');


//routes
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');


app.use(apiRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);


app.get('/500', errorController.get500Page);
app.use(errorController.get404Page);
app.use((error, req, res, next) => {
  res.status(error.httpStatusCode);
  res.redirect('/500');
});

app.listen(3000);
