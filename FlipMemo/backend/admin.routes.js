const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_HOSTNAME = process.env.DATABASE_HOSTNAME;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;

const client = new Client({
  host: DATABASE_HOSTNAME,
  user: DATABASE_USER,
  port: 5432,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME
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
};

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

router.post('/removeAdmin', verifyToken, verifyAdmin, async (req, res) =>{
    const {email} = req.body;
    try {
        await client.query(`update users set role = $2 WHERE email=$1`, [email, "student"]);
        const result = await client.query(`SELECT email FROM users WHERE role=$1`, ["admin"]);
    
        res.json({success: true, users: result.rows.map(r => r.email)});
    } catch (err) {
        res.status(500).json({success: false});
    }
})

module.exports = router;