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
