const express = require('express');
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user'); // Correct import
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  res.locals.currentUser = req.user|| null;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Passport Configuration
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Setup express session 
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: true,
  resave: false
}));

// Initialize flash
app.use(flash());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Use the routes from index.js
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Connection error:', error);
});

