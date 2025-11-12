const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Client } = require("pg");
const session = require("express-session");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client("412606688461-n8sf0ppktrgr9hc0jn1pc5c3vkkbp7no.apps.googleusercontent.com");

const app = express();

app.use(cors({
  origin: "https://fmimage.onrender.com/",
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: "blablubli",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: "lax" }
}));

// napravljeno za posebnu bazu mora se promijeniti
const client = new Client ({
    host: "dpg-d4ab1cjuibrs73car9v0-a",
    user: "myuser",
    port: 5432,
    password: "oEaV29J2gnc13fivqlkvAwy1zUf3rQGI",
    database: "flipmemo_1evy"
});
client.connect();

app.get("/current-user", (req, res) => {
  if(req.session.userEmail) {
    res.json({ email: req.session.userEmail });
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

    const query = `SELECT COUNT(*) AS count FROM login WHERE email=$1 AND password=$2`;
    client.query(query, [email, crypto.createHash("sha256").update(password).digest("hex")], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false });
        }

        const count = parseInt(result.rows[0].count);
        if (count > 0) {
            req.session.userEmail = email;
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    });
});

app.post("/google-auth", async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: "412606688461-n8sf0ppktrgr9hc0jn1pc5c3vkkbp7no.apps.googleusercontent.com"
    });

    const payload = ticket.getPayload();
    console.log(payload)
    const email = payload.email;
    const name = payload.name;

    const result = await client.query(`SELECT COUNT(*) AS count FROM login WHERE email=$1`, [email]);
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      const password = crypto.randomBytes(6).toString("hex");
      const hashedPass = crypto.createHash("sha256").update(password).digest("hex");
      const maxResult = await client.query(`SELECT MAX(userid) AS maxid FROM login`);
      let userid = 1;
      if (maxResult.rows[0].maxid !== null) {
        userid = maxResult.rows[0].maxid + 1;
      } 

      await client.query(`INSERT INTO login (userid, email, password) VALUES ($1, $2, $3)`, [userid, email, hashedPass]);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: "flipmemo.fer@gmail.com", 
          pass: process.env.EMAIL_PASS }
      });

      await transporter.sendMail({
        from: '"FlipMemo" <flipmemo.fer@gmail.com>',
        to: email,
        subject: "Vaša FlipMemo lozinka",
        text: `Pozdrav ${name},\n\nVaša lozinka za FlipMemo je: ${password}\n\nPrijavite se na https://fmimage.onrender.com/login`
      });

      req.session.userEmail = email;
      return res.json({ success: true, reg: true, message: "Račun stvoren! Lozinka poslana na e-mail." });
    }

    req.session.userEmail = email;
    return res.json({ success: true, reg: false, message: "Dobrodošli natrag!" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Neuspješna Google autentikacija" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})

app.post('/changepass', (req, res) => {
    const { email, password, newpass1, newpass2 } = req.body;

    if (!email || !password || !newpass1 || !newpass2) {
        return res.status(400).json({ success: false, message: "Nedostaju podaci" });
    }

    if (newpass1 !== newpass2) {
        return res.json({ success: false, message: "Lozinke se ne podudaraju" });
    }

    const hashedPass = crypto.createHash("sha256").update(password).digest("hex");

    const checkQuery = `SELECT COUNT(*) AS count FROM login WHERE email=$1 AND password=$2`;
    client.query(checkQuery, [email, hashedPass], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false });
        }

        const count = parseInt(result.rows[0].count);
        if (count > 0) {
            const hashedNewPass = crypto.createHash("sha256").update(newpass1).digest("hex");
            client.query(
                `UPDATE login SET password=$1 WHERE email=$2`,
                [hashedNewPass, email],
                (err2) => {
                    if (err2) {
                        console.error(err2.message);
                        return res.status(500).json({ success: false });
                    }
                    return res.json({ success: true, message: "Lozinka uspješno promijenjena!" });
                }
            );
        } else {
            return res.json({ success: false, message: "Pogrešna trenutna lozinka" });
        }
    });
});


app.post('/deleteacc', (req, res) =>{
    const {email, password} = req.body;

    const hashedPass = crypto.createHash("sha256").update(password).digest("hex");

    const checkQuery = `SELECT COUNT(*) AS count FROM login WHERE email=$1 AND password=$2`;
    client.query(checkQuery, [email, hashedPass], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false });
        }

        const count = parseInt(result.rows[0].count);
        if (count > 0) {
            client.query(
                `delete from login where password=$1 and email=$2`,
                [hashedPass, email],
                (err2) => {
                    if (err2) {
                        console.error(err2.message);
                        return res.status(500).json({ success: false });
                    }
                    return res.json({ success: true, message: "Obrisan račun!" });
                }
            );
        } else {
            return res.json({ success: false, message: "Neuspješno brisanje računa!" });
        }
    });
});



const path = require("path");

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, "frontend/dist"))); // ili "build" ako se tako zove

// Catch-all route to serve index.html for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});
