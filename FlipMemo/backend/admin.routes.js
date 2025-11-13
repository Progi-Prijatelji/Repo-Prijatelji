const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";
const client = new Client({
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

async function verifyAdmin(req, res, next) {
  const email = req.user.email;
  const result = await client.query(`SELECT COUNT(*) AS count FROM users WHERE email=$1 AND role=$2`, [email, "kadmin"]);

  if (parseInt(result.rows[0].count) != 1) return res.status(403).json({ success: false, message: "Niste admin" });
  next();
};

router.get('/sendUserList', verifyToken, verifyAdmin, async (req, res) =>{
    try {
        const result = await client.query(`SELECT email FROM users WHERE role=$1`, ["student"]);
    
        res.json({success: true, users: result.rows.map(r => r.email)});
    } catch (err) {
        res.status(500).json({success: false});
    }
});

router.get('/sendAdminList', verifyToken, verifyAdmin, async (req, res) =>{
    try {
        const result = await client.query(`SELECT email FROM users WHERE role=$1`, ["admin"]);
    
        res.json({success: true, users: result.rows.map(r => r.email)});
    } catch (err) {
        res.status(500).json({success: false});
    }
});

router.post('/addNewAdmin', verifyToken, verifyAdmin, async (req, res) =>{
    const {email} = req.body;
    try {
        await client.query(`update users set role = $2 WHERE email=$1`, [email, "admin"]);
        const result = await client.query(`SELECT email FROM users WHERE role=$1`, ["admin"]);
    
        res.json({success: true, users: result.rows.map(r => r.email)});
    } catch (err) {
        res.status(500).json({success: false});
    }
})
