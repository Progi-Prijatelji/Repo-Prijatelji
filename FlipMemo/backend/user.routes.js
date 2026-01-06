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

async function updateWords(userid) {
  await client.query(`update userword set container = container + 1 
                      where userid = $1 and lastTimeDate >= NOW() - INTERVAL '1 day'`, [userid])
}

router.post('/sendWordsInDictForUser', verifyToken, async (req, res) =>{
  const {email, dictid, method} = req.body     

  try {
    const userResult = await client.query(`SELECT userid FROM users WHERE email = $1`,[email]);
    const userid = userResult.rows[0].userid;

    const newUserInDict = await client.query(`SELECT count(wordid) FROM userword WHERE userid = $1`,[userid]);

    const count = Number(newUserInDict.rows[0].count);

    if (count === 0) {
      const wordsInDict = await client.query(`select wordid from dictword where dictid = $1`, [dictid])

      for (const row of wordsInDict.rows) {
        await client.query(`INSERT INTO userword (userid, wordid, container, lastTimeDate, method)VALUES ($1, $2, 1, NOW(),$3)`,[userid, row.wordid, method]);
      }
    }
    
    await updateWords(userid);

    const returnWords = await client.query(`SELECT w.word AS word, w.wordid AS wordID, t.word AS translation
                                            FROM dictword dw 
                                            JOIN words w ON w.wordid = dw.wordid
                                            LEFT JOIN words t ON t.wordid = w.translationid 
                                            JOIN userword uw on uw.wordid = dw.wordid
                                            WHERE dw.dictid = $1 and uw.userid = $2 and uw.container <= 5 and dw.method = $3`, [dictid, userid, method]);
  
  res.json({success: true, words: returnWords.rows});     
  } catch (err) {
    res.status(500).json({success: false});
  }
});

router.post('/demoteWords', verifyToken, async (req, res) =>{
  const {email, wordids} = req.body

  try {
    const userResult = await client.query(`SELECT userid FROM users WHERE email = $1`,[email]);
    const userid = userResult.rows[0].userid;

    await client.query(`UPDATE userword SET  container = GREATEST(container - 1, 1), lastTimeDate = NOW() WHERE userid = $1 AND wordid = ANY($2)`, [userid, wordids]);

    res.json({success: true});  
  } catch (err) {
    res.status(500).json({success: false});
  }
});

router.post('/checkWrittenWord',  verifyToken, async (req, res) =>{
  const{written, wordid} = req.body

  try {
    const correct = await client.query(`select word from words where wordid = $1`, [wordid])

    if (written.trim().toLowerCase() === correct.rows[0].word.toLowerCase()) {
      res.json({success: true});  
    }
    else{
      res.json({success: false});  
    }
  } catch (err) {
    res.status(500).json({success: false});
  }
});

module.exports = router;