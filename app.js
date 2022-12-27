let express = require("express")
let app = express()
let overRide = require('method-override')
let ejsMate =  require('ejs-mate')
let path = require("path");

let Campground = require('./models/campground');
let Review = require('./models/review')
let campRoutes = require('./routes/camp')
let userRoutes = require('./routes/userPass')

let session = require('express-session')
let flash = require('connect-flash')
let passport = require('passport')
let LocalStrategy = require('passport-local')
let User = require('./models/passport')
let expressError = require('./Error/expres_error')




app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs',ejsMate)

app.use(express.urlencoded({extended:true}))
app.use(overRide('_method'))

let mongoose = require('mongoose')
mongoose
  .connect("mongodb://127.0.0.1:27017/yelpCamp_Passport")
  .then(() => {
    console.log("CONNECTION ESTD !!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR !!!");
    console.log(err);
  });


  let sessionOption = {
    secret : 'notgood',
    resave : false ,
    saveUninitialized : true
  }
  
app.use(session(sessionOption))
app.use(flash())

app.use((req,res,next)=>{
  console.log(req.session)
  res.locals.currentUser = req.user                   /// line 50 to 56 is written in GLOBALLY
  res.locals.show = req.flash('success')
  res.locals.err = req.flash('error')
  next()
})

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))  // authenticate() Generates a function that is used in Passport's LocalStrategy
passport.serializeUser(User.serializeUser())  // serializeUser() Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser())  // deserializeUser() Generates a function that is used by Passport to deserialize users into the session


app.get('/fakeuser',async(req,res)=>{
  let anotherUser = new User({email: 'rony2@gmail.com' , username: 'R_ony'})
  let brandUser = await User.register(anotherUser , '1419')  //  register(user, password, cb) --> Convenience method to register
  res.send(brandUser)                                                  //// a new user instance with a given password.
                                                                             
})


app.get('/',(req,res)=>{
      res.render('home')
  })
  
app.use('/campgrounds',campRoutes)
app.use('/',userRoutes)

app.post('/campgrounds/:id/reviews',async(req,res)=>{
  let thatId = await Campground.findById(req.params.id)
  let newReview = new Review(req.body.review)
  thatId.reviews.push(newReview)
  await newReview.save()
  await thatId.save()
  req.flash('success' ,'Successfully given review')
  res.redirect(`/campgrounds/${thatId._id}`)
  //res.send('review')
})



// this path is only run when anyone of above path

app.all('*',(req,res,next)=>{
  next(new expressError('Page not Found',404))
})

// is dose not match

app.use((er, req, res, next) => {
  // expressError = err
  let {statusCode = 500 , message='Something Wrong'} = er 
  //res.status(statusCode).send(message);
  res.status(statusCode).render('error',{er})
});


app.listen(2022,()=>{
    console.log("LISTENING")
})