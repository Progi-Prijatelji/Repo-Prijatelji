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
  database: DATABASE_NAME,
  ssl: {rejectUnauthorized: false}
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

  //if (parseInt(result.rows[0].count) != 1) return res.status(403).json({ success: false, message: "Niste admin" });
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

router.post('/addDictionary', verifyToken, verifyAdmin, async (req, res) =>{
    const {name, langID, desc} = req.body;
    
    try {
      const usedNames = await client.query(`SELECT dictname FROM dictionaries`);

      if (usedNames.rows.some(r => r.dictname === name)) {
        return res.status(403).json({
        success: false,
        message: "Postoji rječnik s tim imenom."
        });
      }

      const usedDictIDs = await client.query(`SELECT dictid FROM dictionaries`);
      let i = 1;
      const existingIDs = usedDictIDs.rows.map(r => r.dictid);
      while (existingIDs.includes(i)) {
      i++;
      }

      await client.query(`insert into DICTIONARIES (dictid, dictname, langid, description) values ($1, $2, $3, $4)`, [i, name, langID, desc]);
      const result = await client.query(`SELECT dictname FROM dictionaries`);
    
      res.json({success: true, dictionaries: result.rows.map(r => r.dictname)});
    } catch (err) {
      res.status(500).json({success: false});
    }
});

router.get('/sendDictList', verifyToken, verifyAdmin, async (req, res) =>{
    try {
        const result = await client.query(`SELECT * FROM DICTIONARIES`);
    
        res.json({success: true, dicts: result.rows.map(r => r.dictname)});
    } catch (err) {
        res.status(500).json({success: false});
    }
});

router.post('/addWord', verifyToken, verifyAdmin, async (req, res) => {
  const { word, langname, translation } = req.body;

  try {
    const getLangID = await client.query(`select langid from LANGUAGES where name = $1`, [langname]);
    const usedTranslations = await client.query(`select translationId, word from words`);

    let translationId;
    const existingTranslation = usedTranslations.rows.find(r => r.word === translation);

    if (!existingTranslation) {
      const usedWordIDs = await client.query(`select wordId from words`);
      const existingIDs = usedWordIDs.rows.map(r => r.wordid);

      let i = 1;
      while (existingIDs.includes(i)) {
        i++;
      }

      await client.query(`insert into words (wordId, word, langid, translationId) values ($1, $2, $3, $4)`,[i, translation, getLangID.rows[0].langid, null]);

      translationId = i;
    } else {
      translationId = existingTranslation.translationid;
    }

    const usedWordIDs = await client.query(`select wordId from words`);
    const existingIDs = usedWordIDs.rows.map(r => r.wordid);

    let j = 1;
    while (existingIDs.includes(j)) {
      j++;
    }

    await client.query(`insert into words (wordId, word, langid, translationId) values ($1, $2, $3, $4)`, [j, word, getLangID.rows[0].langid, translationId]);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post('/showWords', verifyToken, verifyAdmin, async (req, res) =>{
  const {discid} = req.body

  try {
    const returnWords = await client.query(`select w.* from words join dictword ON w.wordid = dw.wordid where dw.wordid in $1`, [discid])

    res.json({success: true, words: returnWords.rows.map(r => r.word)});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;