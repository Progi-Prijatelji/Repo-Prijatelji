const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client ({
    host: "localhost",
    user: "myuser",
    port: 5433,
    password: "mysecretpwd",
    database: "FlipMemo"
});
client.connect();

app.post('/changepass', async (req, res) =>{
    const {password, newpass1, newpass2} = req.body

    const res = await fetch("http://localhost:8080/current-user");
    const userData = await res.json();

    if (!userData.email) {
      alert("Niste prijavljeni!");
      return;
    }
 
    const hashedPass = crypto.createHash("sha256").update(password).digest("hex");

    const wait = `SELECT COUNT(*) AS count FROM login WHERE email=$1`

    client.query(wait, [userData.email,hashedPass], async (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false });
        }

        const count = parseInt(result.rows[0].count);
        if (count > 0) {
            if( newpass1 != newpass2){
                return res.json({ success: false });
            }
            const hashedPass2 = crypto.createHash("sha256").update(newpass1).digest("hex");
            
            await client.query(`update INTO login (email, password) VALUES ($1, $2)`, [email, hashedPass2]);
                const transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: "flipmemo.fer@gmail.com",
                    pass: "MEmoFlippers67" 
                  }
                });
        } else {
            return res.json({ success: false });
        }
    });

})