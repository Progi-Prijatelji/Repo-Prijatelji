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
    const {name, langid, desc} = req.body;
    
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
      
      await client.query(`insert into DICTIONARIES (dictid, dictname, langid, description) values ($1, $2, $3, $4)`, [i, name, langid, desc]);
    
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({success: false});
    }
});

router.get('/sendDictList', verifyToken, verifyAdmin, async (req, res) =>{
    try {
        const result = await client.query(`SELECT * FROM DICTIONARIES`);
    
        res.json({success: true, dicts: result.rows});
    } catch (err) {
        res.status(500).json({success: false});
    }
});

router.post('/addLang', verifyToken, verifyAdmin, async (req, res) =>{
  const {langname} = req.body
  try {
    const usedNames = await client.query(`SELECT langname FROM languages`);

      if (usedNames.rows.some(r => r.dictname === langname)) {
        return res.status(403).json({
        success: false,
        message: "Postoji taj jezik."
        });
      }

      const usedLangIDs = await client.query(`SELECT langid FROM languages`);
      let i = 1;
      const existingIDs = usedLangIDs.rows.map(r => r.langid);
      while (existingIDs.includes(i)) {
      i++;
      }

      await client.query(`insert into languages values (langid, langname, langImg) `, [i, langname, "aaaa"])
    
    res.json({success: true});
  } catch (err) {
      res.status(500).json({success: false});
  }
});

router.get('/sendLangList', verifyToken, verifyAdmin, async (req, res) =>{
    try {
        const result = await client.query(`SELECT * FROM LANGUAGES where langid > 1`);
    
        res.json({success: true, langs: result.rows});
    } catch (err) {
        res.status(500).json({success: false});
    }
});

router.post('/addWord', verifyToken, verifyAdmin, async (req, res) => {
  const { word, langid, translation } = req.body;

  try {
    const usedTranslations = await client.query(`select wordid, word from words where langid = 1`);

    let translationId;
    const existingTranslation = usedTranslations.rows.find(r => r.word === translation);

    if (!existingTranslation) {
      const usedWordIDs = await client.query(`select wordid from words`);
      const existingIDs = usedWordIDs.rows.map(r => r.wordid);

      let i = 1;
      while (existingIDs.includes(i)) {
        i++;
      }

      await client.query(`insert into words (wordid, word, langid, translationid, audioFile) values ($1, $2, $3, $4, $5)`,[i, translation, 1, null, "aaaa"]);

      translationId = i;
    } else {
      translationId = existingTranslation.wordid;
    }

    const usedWordIDs = await client.query(`select wordId from words`);
    const existingIDs = usedWordIDs.rows.map(r => r.wordid);

    let j = 1;
    while (existingIDs.includes(j)) {
      j++;
    }

    await client.query(`insert into words (wordId, word, langid, translationid, audioFile) values ($1, $2, $3, $4, $5)`, [j, word, langid, translationId, "aaaa"]);  //aaaa je placeholder jer baza ne prima null za audiofile rijeci koja nije na hrvatskom

    res.json({ success: true, wordid: j});

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post('/addWordToDicts', verifyToken, verifyAdmin, async (req, res) =>{
  try {
    const {wordid, dictids} = req.body;
  
    for (let index = 0; index < dictids.length; index++) {
      const element = dictids[index];
      
      await client.query(`insert into dictword (wordid, dictid) values ($1, $2)`, [wordid, element])
    }
  
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post('/showWords', verifyToken, verifyAdmin, async (req, res) =>{
  const {dictid} = req.body

  try {
    const returnWords = await client.query(`SELECT w.word AS word, t.word AS translation FROM dictword dw JOIN words w ON w.wordid = dw.wordid
                                            LEFT JOIN words t ON t.wordid = w.translationid WHERE dw.dictid = $1`, [dictid])

    res.json({success: true, words: returnWords.rows});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post('/deleteWord', verifyToken, verifyAdmin, async (req, res) =>{
   const {wordid} = req.body;

   try {
    await client.query(`delete from words where wordid = $1`, [wordid])

    res.json({ success: true });
   } catch (err) {
    console.error(err);
    res.status(500).e({ success: false });
   }
});

module.exports = router;