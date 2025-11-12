const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Client } = require("pg");
const session = require("express-session") ;

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({
  secret: "blablubli",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// napravljeno za posebnu bazu mora se promijeniti
const client = new Client ({
    host: "localhost",
    user: "myuser",
    port: 5433,
    password: "mysecretpwd",
    database: "FlipMemo"
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
    client.query(query, [email, password], (err, result) => {
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
  const { email, name } = req.body;

  try {
    const result = await client.query(`SELECT COUNT(*) AS count FROM login WHERE email=$1`, [email]);
    const count = parseInt(result.rows[0].count);

    if (count > 0) {
      return res.json({ success: true, reg:false, message: "Dobrodošli natrag!" });
    }

    const password = crypto.randomBytes(6).toString("hex"); 
    const hashedPass = crypto.createHash("sha256").update(password).digest("hex");

    await client.query(`INSERT INTO login (email, password) VALUES ($1, $2)`, [email, hashedPass]);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "flipmemo.fer@gmail.com",
        pass: "MEmoFlippers67" 
      }
    });

    await transporter.sendMail({
      from: '"FlipMemo" <flipmemo.fer@gmail.com>',
      to: email,
      subject: "Vaša FlipMemo lozinka",
      text: `Pozdrav ${name},\n\nVaša lozinka za FlipMemo je: ${password}\n\nPrijavite se na http://localhost:5173/login`
    });

    return res.json({ success: true,reg: true, message: "Račun stvoren! Lozinka poslana na e-mail." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, reg: false, message: "Greška na poslužitelju!" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})