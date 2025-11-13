const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { Client } = require("pg");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const sendgrid = require("@sendgrid/mail");
const path = require("path");

const app = express();
const googleClient = new OAuth2Client("412606688461-n8sf0ppktrgr9hc0jn1pc5c3vkkbp7no.apps.googleusercontent.com");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

app.use(cors({
  origin: "https://fmimage.onrender.com",
  credentials: true
}));

const client = new Client ({
    host: "dpg-d4ab1cjuibrs73car9v0-a",
    user: "myuser",
    port: 5432,
    password: "oEaV29J2gnc13fivqlkvAwy1zUf3rQGI",
    database: "flipmemo_1evy"
});
client.connect();

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "Nema tokena" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Neispravan ili istekao token" });
  }
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const hashedPass = crypto.createHash("sha256").update(password).digest("hex");

    try {
      const result = await client.query(`SELECT COUNT(*) AS count FROM users WHERE email=$1 AND password=$2`, [email, hashedPass]);
      const count = parseInt(result.rows[0].count);

      if (count > 0) {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "3h" });
        return res.json({ success: true, token });
      }   else {
        return res.json({ success: false, message: "Pogrešan email ili lozinka" });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success: false });
    }
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

    const result = await client.query(`SELECT COUNT(*) AS count FROM users WHERE email=$1`, [email]);
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      const password = crypto.randomBytes(6).toString("hex");
      const hashedPass = crypto.createHash("sha256").update(password).digest("hex");
      const maxResult = await client.query(`SELECT MAX(userid) AS maxid FROM users`);
      let userid = 1;
      if (maxResult.rows[0].maxid !== null) {
        userid = maxResult.rows[0].maxid + 1;
      } 

      await client.query(`INSERT INTO users (userid, email, password) VALUES ($1, $2, $3)`, [userid, email, hashedPass]);


      const msg = {
        to: email,
        from: 'flipmemo.fer@gmail.com',
        subject: "Vaša FlipMemo lozinka",
        text: `Pozdrav ${name},\n\nVaša lozinka za FlipMemo je: ${password}\n\nPrijavite se na https://fmimage.onrender.com/login`
      }

      sendgrid.send(msg).then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
      })
      .catch((error) => {
        console.error(error)
      });

      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
      return res.json({ success: true, reg: true, message: "Račun stvoren! Lozinka poslana na e-mail.", token});
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ success: true, reg: false, message: "Dobrodošli natrag!", token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Neuspješna Google autentikacija" });
  }
});

app.post('/changepass',verifyToken, (req, res) => {
    const email = req.user.email;
    const { password, newpass1, newpass2 } = req.body;

    if (!password || !newpass1 || !newpass2) {
        return res.status(400).json({ success: false, message: "Nedostaju podaci" });
    }

    if (newpass1 !== newpass2) {
        return res.json({ success: false, message: "Lozinke se ne podudaraju" });
    }

    const hashedPass = crypto.createHash("sha256").update(password).digest("hex");

    const checkQuery = `SELECT COUNT(*) AS count FROM users WHERE email=$1 AND password=$2`;
    client.query(checkQuery, [email, hashedPass], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false });
        }

        const count = parseInt(result.rows[0].count);
        if (count > 0) {
            const hashedNewPass = crypto.createHash("sha256").update(newpass1).digest("hex");
            client.query(
                `UPDATE users SET password=$1 WHERE email=$2`,
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

app.post('/deleteacc',verifyToken, (req, res) =>{
    const email = req.user.email;
    const {password} = req.body;

    const hashedPass = crypto.createHash("sha256").update(password).digest("hex");

    const checkQuery = `SELECT COUNT(*) AS count FROM users WHERE email=$1 AND password=$2`;
    client.query(checkQuery, [email, hashedPass], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false });
        }

        const count = parseInt(result.rows[0].count);
        if (count > 0) {
            client.query(
                `delete from users where password=$1 and email=$2`,
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

app.use(express.static(path.join(__dirname, "frontend/dist"))); 
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})