const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const jwt = require("jsonwebtoken");
const cloudinary = require('./cloudinary');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');
const path = require("path");


const storage = multer.memoryStorage();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  storage: storage
});


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

router.post('/sendWordsInDictForUser', verifyToken, async (req, res) =>{
  const {email, dictid, method} = req.body     

  try {
    const userResult = await client.query(`SELECT userid FROM users WHERE email = $1`,[email]);
    const userid = userResult.rows[0].userid;

    const newUserInDict = await client.query(`SELECT count(uw.wordid) learning, count(dw.wordid) all FROM userword uw RIGHT JOIN dictword dw ON uw.wordid = dw.wordid AND uw.userid = $1 AND uw.method = $2 WHERE dw.dictid = $3`,[userid, method, dictid]); //vidimo dal je osoba vec ucila
    const learning = Number(newUserInDict.rows[0].learning);
    const countInDict = Number(newUserInDict.rows[0].all);

    if (learning < countInDict) {//ako nije ucila stavljamo u userword, kao lasttimedate stavljam null jer nije zapravo naucila rijec ni jednom
      const wordsInDict = await client.query(`select wordid from dictword where dictid = $1`, [dictid])
      for (const row of wordsInDict.rows) {
        const userWordMethod = await client.query(`select case when not exists (select * from userword where userid=$1 and wordid=$2 and method=$3) then cast(1 as bit) else cast(0 as bit) end`, [userid, row.wordid, method]);
        const exists = Number(userWordMethod.rows[0].case)
        if (exists){
          await client.query(`INSERT INTO userword (userid, wordid, container, lastTimeDate, method) VALUES ($1, $2, 0, NULL, $3)`,[userid, row.wordid, method]);
        }
      }
    }  
      //sve riejci koje se mogu uciti, ili rijeci koje se nikada nisu ucile do sad ili rijeci koje su u pripadajucem konatineru dovoljno vremena
    const returnWords = await client.query(`SELECT w.word AS word, w.wordid AS wordID, t.word AS translation, w.audiofile, w.audiopostid 
                                            FROM dictword dw 
                                            JOIN words w ON w.wordid = dw.wordid
                                            LEFT JOIN words t ON t.wordid = w.translationid 
                                            JOIN userword uw on uw.wordid = dw.wordid
                                            left join phrases p on p.wordid = dw.wordid
                                            WHERE dw.dictid = $1 and uw.userid = $2 and uw.container <= 5 and uw.method = $3
                                            and ((lastTimeDate IS NULL and container = 0)
                                            or (lastTimeDate <= NOW() - '1 day'::interval and container = 1)
                                            or (lastTimeDate <= NOW() - '2 day'::interval and container = 2)
                                            or (lastTimeDate <= NOW() - '3 day'::interval and container = 3)
                                            or (lastTimeDate <= NOW() - '4 day'::interval and container = 4)
                                            or (lastTimeDate <= NOW() - '5 day'::interval and container = 5)) `, [dictid, userid, method]);
  
  res.json({success: true, words: returnWords.rows});     
  } catch (err) {
    res.status(500).json({success: false});
  }
});

router.post('/updateWord', verifyToken, async (req, res) =>{
  const {email, wordid, correction, method} = req.body;
  try {
    const userResult = await client.query(`SELECT userid FROM users WHERE email = $1`,[email]);
    const userid = userResult.rows[0].userid;
    if(correction){
      await client.query(`UPDATE userword SET lastTimeDate = NOW(), container = (CASE WHEN container = 0 THEN 2 ELSE container + 1 END) WHERE userid = $1 AND wordid = $2 AND method = $3`, [userid, wordid, method]);
    } else{
      await client.query(`UPDATE userword SET container = 1, lastTimeDate = NOW() WHERE userid = $1 AND wordid = $2 AND method = $3`, [userid, wordid, method]);
    }

    res.json({success: true});  
  } catch (err) {
    res.status(500).json({success: false});
  }
});

router.post('/checkWrittenWord', verifyToken, async (req, res) =>{
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

router.post('/showWords', verifyToken, async (req, res) =>{
  const {dictid} = req.body

  try {
    const returnWords = await client.query(`SELECT w.word AS word, t.word AS translation, w.wordid AS wordid, w.translationid AS translationid
                                            FROM dictword dw JOIN words w ON w.wordid = dw.wordid
                                            LEFT JOIN words t ON t.wordid = w.translationid WHERE dw.dictid = $1`, [dictid]);
    
    const returnPhrases = await client.query(`SELECT p.phrase, p.wordid FROM dictword dw JOIN words w ON dw.wordid = w.wordid AND dictid = $1 LEFT JOIN words t ON w.translationid = t.wordid LEFT JOIN phrases p ON p.wordid = w.wordid OR p.wordid = t.wordid`, [dictid]);

    res.json({success: true, words: returnWords.rows, phrases: returnPhrases.rows});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


module.exports = router;