// Server/index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS - must allow credentials and exact origin
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", // match your front-end
  credentials: true
}));

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ Mongoose connect error:", err);
    process.exit(1);
  });

// 4. Session middleware - MUST be before passport.session()
app.use(session({
  secret: process.env.SESSION_SECRET || "dev_secret_change_me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: process.env.COOKIE_SAME_SITE || "lax", // "none" if cross-site and using HTTPS
    secure: process.env.COOKIE_SECURE === "true" || false, // true when using HTTPS
    httpOnly: true
  }
}));

// 5. Import passport configuration so serialize/deserialize & strategies are registered
// Make sure this path points to your passport config file which calls passport.use(...) and registers serialize/deserialize.
import "./config/passport.js";

// 6. Initialize passport AFTER session
app.use(passport.initialize());
app.use(passport.session());

// 7. Mount routes (auth should be after passport.session())
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

// 8. Test endpoints
app.get("/", (req, res) => res.send("Image Search API running"));
app.get("/ping", (req, res) => res.json({ message: "pong" }));

app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));







// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import session from "express-session";
// import bodyParser from "body-parser";
// import authRoutes from "./routes/auth.js";
// import apiRoutes from "./routes/api.js";
// import passport from "passport";

// const app = express();
// dotenv.config();
// app.use(cors({
//   origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
//   credentials: true
// }));
// app.use(bodyParser.json());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// const PORT = process.env.PORT || 5000;

// // app.use(cors({
// //   origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
// //   credentials: true
// // }));
// // app.use(bodyParser.json());



// // session config
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { 
//     // secure: false,
//     httpOnly: true,
//     sameSite: "lax" 
//   } // set secure:true when using HTTPS
// }));
// app.get("/auth/current_user", (req, res) => {
//   console.log("Session:", req.session);
//   console.log("User:", req.user);
//   res.json({ user: req.user || null });
// });


// // passport
// import("./config/passport.js").then(() => {
//   app.use(passport.initialize());
//   app.use(passport.session());
// });

// app.use("/auth", authRoutes);
// app.use("/api", apiRoutes);

// // health
// app.get("/", (req, res) => res.send("Image Search API running"));
// app.get("/ping", (req, res) => res.json({ message: "pong" }));

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(()=> {
//     console.log("MongoDB connected");
//     app.listen(PORT, ()=> console.log("Server listening on", PORT));
//   })
//   .catch(err => {
//     console.error("Mongoose connect error:", err);
//     process.exit(1);
//   });
