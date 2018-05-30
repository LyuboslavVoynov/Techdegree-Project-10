
const  express  = require("express")
const  app = express()
const  path  = require("path")
const  cookieParser = require("cookie-parser")
const  bodyParser = require("body-parser")
const  routes = require("./routes/index")



//SETTING UP
app.locals.moment = require('moment');//using moment to format the right date in pug files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static('public'));


app.use('/', routes);

//404 ERROR
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


//ERROR HANDLING WITH NEXT()
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
