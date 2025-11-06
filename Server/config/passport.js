import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

passport.serializeUser((user, done) => done(null, user.id));
console.log("Passport deserializeUser registered");

passport.deserializeUser((id, done) => {
  import("../models/User.js").then(async ({ default: User }) => {
    try {
      const user = await User.findById(id).lean(); // lean() avoids Mongoose doc wrapper
      if (!user) {
        console.warn("User not found in DB for ID:", id);
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      console.error("❌ Error in deserializeUser:", err);
      done(err, null);
    }
  });
});



// GOOGLE
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_ROOT_URL}/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ oauthId: profile.id, provider: "google" });
    if (!user) {
      user = await User.create({
        oauthId: profile.id,
        provider: "google",
        name: profile.displayName,
        email: profile.emails?.[0]?.value
      });
    }
    done(null, user);
  } catch (err) { done(err, null); }
}));

// GITHUB
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_ROOT_URL}/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ oauthId: profile.id, provider: "github" });
    if (!user) {
      user = await User.create({
        oauthId: profile.id,
        provider: "github",
        name: profile.displayName || profile.username,
        email: profile.emails?.[0]?.value
      });
    }
    done(null, user);
  } catch (err) { done(err, null); }
}));

// FACEBOOK
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_ROOT_URL}/auth/facebook/callback`,
  profileFields: ['id', 'emails', 'name', 'displayName']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ oauthId: profile.id, provider: "facebook" });
    if (!user) {
      user = await User.create({
        oauthId: profile.id,
        provider: "facebook",
        name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`,
        email: profile.emails?.[0]?.value
      });
    }
    done(null, user);
  } catch (err) { done(err, null); }
}));
