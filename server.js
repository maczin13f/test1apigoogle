const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const conectarMongoDB = require("./db");
const Usuario = require("./dados");

const app = express();

app.use(session({ secret: "secreto", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

// Salva o usuário na sessão
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Configura estratégia Google
passport.use(new GoogleStrategy({
    clientID: "746977735603-r9m3nv7sedf1qt5etubge1o8nrbmosng.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://testeapigoogle.onrender.com/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const userData = {
      google_id: profile.id,
      nome: profile.displayName,
      email: profile.emails[0].value,
      foto: profile.photos[0].value
    };

    async function salvarUsuarioNoBanco(userData) {
      const existente = await Usuario.findOne({ google_id: userData.google_id });
    
      if (!existente) {
        await Usuario.create(userData);
        console.log("Usuário salvo no MongoDB.");
      } else {
        console.log("Usuário já existe no banco.");
      }
    }  

    // Aqui você salva no banco de dados
    await salvarUsuarioNoBanco(userData);

    return done(null, userData);
  }
));

// Rotas
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account"
}));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
   res.redirect("/api.html");
  }
);

// Exemplo: dashboard com dados do usuário
app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");
  res.json(req.user); // ou renderiza uma página
});

conectarMongoDB();

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
