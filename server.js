import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from "passport";
import './connections/Passport.js';
import authRoutes from './routes/authroutes.js';
import jobAppRoutes from './routes/jobApproutes.js'; // ✅ fixed variable name
import JobListingRoutes from './routes/joblistingroutes.js';

function isloggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
};

dotenv.config();


const app = express();
app.use(session({secret:'cats'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
// ✅ Connect to MongoDB

// app.get('/', (req, res) => {
//   res.send('Job Application Portal API is running ✅');
// });

mongoose.connect(process.env.MONGO_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', jobAppRoutes); 
app.use('/api/jobs', JobListingRoutes);

app.get('/',(req,res)=>{
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
  )

  app.get('/google/callback',
  passport.authenticate('google',{
  successRedirect: '/protected',
  failureRedirect: '/auth/failure',
  })
)
app.get('/auth/failure', (req, res) =>{
   res.send('Authentication failed');
});

app.get('/protected', isloggedIn,(req,res)=>{
  res.send(`Welcome ${req.user.displayName}`);
});
app.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
