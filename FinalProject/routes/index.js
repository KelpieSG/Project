const express = require('express');
const router = express.Router();
const Incident = require('../models/incident'); 
const passport = require('passport');
const User = require('../models/user');

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in first');
  res.redirect('/authentication/login');
}


// Login Route
router.get('/authentication/login', (req, res) => {
  res.render('authentication/login');
});

router.post('/authentication/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.redirect('/authentication/login');
      }
      req.logIn(user, (err) => {
          if (err) {
              return next(err);
          }
          return res.redirect('/');
      });
  })(req, res, next);
});

// Registration Route
router.get('/authentication/registration', (req, res) => {
  res.render('authentication/registration');
});

router.post('/authentication/registration', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    await User.register(newUser, password);
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/authentication/login');
  } catch (err) {
    console.error("Error during registration:", err.message);
    req.flash('error', err.message);
    res.redirect('/authentication/registration');
  }
});

// Apply `isAuthenticated` middleware for all subsequent routes
router.use(isAuthenticated);

// Redirect root route to login if not authenticated
router.get('/', (req, res) => {
  res.redirect('/landing');
});

// Home Route - Landing page 
router.get('/landing', async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.render('landing', { incidents });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Logout Route
router.get('/authentication/logout', (req, res) => {
  req.logout(() => {
      res.redirect('/');
  });
});

router.get('/landing', isAuthenticated, (req, res) => {
  res.render('landing', { user: req.user });
});


// Add Incident Page Route 
router.get('/add', (req, res) => {
  res.render('add', { incident: {} })
});

// Add Incident Route 
router.post('/add', async (req, res) => {
  const newIncident = new Incident({
    Location: req.body.Location,
    Incident_Date: req.body.Incident_Date,
    Report_Date: new Date(),
    Incident_Type: req.body.Incident_Type,
    Injury_Count: req.body.Injury_Count
  });

  try {
    await newIncident.save();
    res.redirect('/landing');
  } catch (error) {
    console.error("Error adding incident:", error);
    res.render('error', { message: "Error adding incident", error });
  }
});

// Edit Incident Page Route
router.get('/edit/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).send('Incident not found');
    }
    res.render('edit', { incident });
  } catch (err) {
    console.error("Error fetching incident:", err);
    res.status(500).send('Server Error');
  }
});

// Update Incident Route
router.post('/edit/:id', async (req, res) => {
  const updatedData = {
    Location: req.body.Location,
    Incident_Date: req.body.Incident_Date,
    Incident_Type: req.body.Incident_Type,
    Injury_Count: req.body.Injury_Count
  };

  try {
    await Incident.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect('/landing');
  } catch (err) {
    console.error("Error updating incident:", err);
    res.render('error', { message: "Error updating incident", error: err });
  }
});

// Delete Incident Route
router.post('/delete/:id', async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.redirect('/landing');
  } catch (err) {
    console.error("Error deleting incident:", err);
    res.render('error', { message: "Error deleting incident", error: err });
  }
});


module.exports = router;
