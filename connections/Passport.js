import dotenv from 'dotenv';
import passport from 'passport';
import User from '../model/usermodel.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback",
    passReqToCallback: true
  },
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function (User, done) {
  done(null, User);
});

passport.deserializeUser(function (User, done) {
  done(null, User);
});

export default passport;