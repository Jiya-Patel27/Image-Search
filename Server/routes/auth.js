import express from "express";
import passport from "passport";

const router = express.Router();

// Google
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_ORIGIN}/login` }),
  (req, res) => {
    req.login(req.user, (err) => {           // ✅ add this
      if (err) {
        console.error("Google login error:", err);
        return res.redirect(`${process.env.CLIENT_ORIGIN}/login`);
      }
      res.redirect(`${process.env.CLIENT_ORIGIN}/`);
    });
  }
);

// GitHub
router.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: `${process.env.CLIENT_ORIGIN}/login` }),
  (req, res) => {
    req.login(req.user, (err) => {           // ✅ add this
      if (err) {
        console.error("GitHub login error:", err);
        return res.redirect(`${process.env.CLIENT_ORIGIN}/login`);
      }
      res.redirect(`${process.env.CLIENT_ORIGIN}/`);
    });
  }
);

// Facebook
router.get("/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: `${process.env.CLIENT_ORIGIN}/login` }),
  (req, res) => {
    req.login(req.user, (err) => {           // ✅ add this
      if (err) {
        console.error("Facebook login error:", err);
        return res.redirect(`${process.env.CLIENT_ORIGIN}/login`);
      }
      res.redirect(`${process.env.CLIENT_ORIGIN}/`);
    });
  }
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(process.env.CLIENT_ORIGIN);
  });
});

// Current User
router.get("/current_user", (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.json({ user: req.user });
});

export default router;