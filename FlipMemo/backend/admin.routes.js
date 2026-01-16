const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_HOSTNAME = process.env.DATABASE_HOSTNAME;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;

const apiLanguageIds = new Map();
apiLanguageIds.set('afrikaans', '1'); apiLanguageIds.set('arapski', '2'); apiLanguageIds.set('bengalski', '4'); apiLanguageIds.set('bugarski', '6'); apiLanguageIds.set('katalonski', '7'); apiLanguageIds.set('češki', '8'); apiLanguageIds.set('danski', '9'); apiLanguageIds.set('nizozemski', '11'); apiLanguageIds.set('engleski', '22'); apiLanguageIds.set('filipnski', '23'); apiLanguageIds.set('finski', '25'); apiLanguageIds.set('francuski', '28'); apiLanguageIds.set('njemački', '30'); apiLanguageIds.set('grčki', '32'); apiLanguageIds.set('gudžaratski', '33'); apiLanguageIds.set('hindi', '35'); apiLanguageIds.set('mađarski', '37'); apiLanguageIds.set('islandski', '38'); apiLanguageIds.set('indonezijski', '39'); apiLanguageIds.set('talijanski', '41'); apiLanguageIds.set('kanadski', '43'); apiLanguageIds.set('korejski', '45'); apiLanguageIds.set('latvijski', '47'); apiLanguageIds.set('malajski', '48'); apiLanguageIds.set('malajalam', '50'); apiLanguageIds.set('norveški', '52'); apiLanguageIds.set('poljski', '54'); apiLanguageIds.set('portugalski', '56'); apiLanguageIds.set('pandžapski', '58'); apiLanguageIds.set('rumunjski', '60'); apiLanguageIds.set('ruski', '61'); apiLanguageIds.set('srpski', '63'); apiLanguageIds.set('slovački', '64'); apiLanguageIds.set('španjolski', '65'); apiLanguageIds.set('švedski', '69'); apiLanguageIds.set('tamilski', '71'); apiLanguageIds.set('telugu', '74'); apiLanguageIds.set('tajlandski', '75'); apiLanguageIds.set('turski', '76'); apiLanguageIds.set('ukrajinski', '78'); apiLanguageIds.set('vijetnamski', '80');
    

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
  const {langname} = req.body;
  try {
    const usedNames = await client.query(`SELECT langname FROM languages`);

      if (usedNames.rows.some(r => r.langname === langname)) {
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

      await client.query(`insert into languages (langid, langname, langImg) values ($1, $2, $3)`, [i, langname, "aaaa"]);
    
    res.json({success: true});
  } catch (err) {
      res.status(500).json({success: false});
  }
});

router.get('/sendLangList', verifyToken, verifyAdmin, async (req, res) =>{
    try {
        const result = await client.query(`SELECT * FROM LANGUAGES`);
    
        res.json({success: true, langs: result.rows});
    } catch (err) {
        res.status(500).json({success: false});
    }
});

router.post('/addWord', verifyToken, verifyAdmin, async (req, res) => {
  const { word, langid, translation, phrasesForeign, phrasesNative } = req.body;

  try {
    const usedWords = await client.query(`select word from words where langid = $1`,[langid])

    const exists = usedWords.rows.find(r => r.word === word)
    if(exists){
      const wordIDUsed = await client.query(`select wordid from words where word = $1 and langid = $2`,[word, langid])
      return res.json({ success: true, wordid: wordIDUsed.rows[0].wordid});
    }

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

      await client.query(`insert into words (wordid, word, audiofile, audiopostid, langid, translationid) values ($1, $2, NULL, NULL, $3, NULL)`,[i, translation, 1]);

      for (phrase of phrasesNative) {
        const usedPhraseIDs = await client.query(`select phraseid from phrases`);
        const existingPhraseIDs = usedPhraseIDs.rows.map(r => r.phraseid);

        let q = 1;
        while (existingPhraseIDs.includes(q)) {
        q++;
        }

        await client.query(`insert into phrases (phraseid, phrase, wordid) values ($1,$2, $3)`, [q, phrase, i]);
      }

      translationId = i;
    } else {
      translationId = existingTranslation.wordid;
      const phrases = await client.query(`select phrase from phrases where wordid = $1`, [translationId]);
      const existingPhrases = phrases.rows.map(r => r.phrase);
      for (phrase of phrasesNative) {
        if (!existingPhrases.includes(phrase)) {
          const usedPhraseIDs = await client.query(`select phraseid from phrases`);
          const existingPhraseIDs = usedPhraseIDs.rows.map(r => r.phraseid);

          let q = 1;
          while (existingPhraseIDs.includes(q)) {
            q++;
          }

          await client.query(`insert into phrases (phraseid, phrase, wordid) values ($1, $2, $3)`, [q, phrase, translationId]);
        }
      }
    }

    const usedWordIDs = await client.query(`select wordId from words`);
    const existingIDs = usedWordIDs.rows.map(r => r.wordid);

    let j = 1;
    while (existingIDs.includes(j)) {
      j++;
    }

    let audioFile = "";
    let postId = "";
    const lang = await client.query(`SELECT langname FROM languages where langid = $1 `, [langid]);
    if (apiLanguageIds.get(lang.rows[0].langname)) {
        const audioResults = await fetch("https://thefluentme.p.rapidapi.com/post", {
            method: "POST",
            headers: { 
                'x-rapidapi-key': process.env.API1_KEY,
                'x-rapidapi-host': 'thefluentme.p.rapidapi.com',
                'Content-Type': 'application/json'
          },
            body: JSON.stringify({post_language_id: apiLanguageIds.get(lang.rows[0].langname),  post_title: word, post_content: word})
        });
        const audioData = await audioResults.json();
        audioFile = audioData.ai_reading;
        postId = audioData.post_id;
    }

    await client.query(`insert into words (wordid, word, audiofile, audiopostid, langid, translationid) values ($1, $2, $3, $4, $5, $6)`, [j, word, audioFile, postId, langid, translationId]); 
    for (phrase of phrasesForeign) {
      const usedPhraseIDs = await client.query(`select phraseid from phrases`);
      const existingPhraseIDs = usedPhraseIDs.rows.map(r => r.phraseid);

      let q = 1;
      while (existingPhraseIDs.includes(q)) {
        q++;
      }

      await client.query(`insert into phrases (phraseid, phrase, wordid) values ($1, $2, $3)`, [q, phrase, j]);
    }

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

router.get('/showAllWords', verifyToken, verifyAdmin, async (req, res) =>{
  try {
    const returnWords = await client.query(`SELECT w.word AS word, w.wordid AS wordid, t.word AS translation, l.langname AS langname, l.langid AS langid
                                            FROM languages l JOIN words w ON l.langid = w.langid LEFT JOIN words t ON t.wordid = w.translationid
                                            ORDER BY word`);

    res.json({success: true, words: returnWords.rows});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post('/fetchExamples', verifyToken, verifyAdmin, async (req, res)=>{
  const {word, wordTrans, lang} = req.body;
  
  const url = `https://microsoft-translator-text.p.rapidapi.com/Dictionary/Examples?to=${lang}&from=hr&api-version=3.0`;
    const options = {method: 'POST',
                      headers: {
                        'x-rapidapi-key': '53721952edmsh7b1cdc73f126a32p13c135jsn1e9892198854',
                        'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                        'Content-Type': 'application/json'
                      },
                      body: [
                        {
                        Text: wordTrans,
                        Translation: word 
                        }
                      ]
                    };
    try {
      const response = await fetch(url, options);
      console.log(response.json())
      res.json({response: response.json()})
    } catch (error) {
      console.error(error);
    }
});

router.post('/changeWord', verifyToken, verifyAdmin, async (req, res) =>{
   const {wordid, newWord, phrases} = req.body;

   try {
    await client.query(`update words set word = $2 where wordid = $1`, [wordid, newWord])
    await client.query(`delete from phrases where wordid = $1`, [wordid]);
    for (phrase of phrases){
      if (phrase !== "") {
        const usedPhraseIDs = await client.query(`select phraseid from phrases`);
        const existingPhraseIDs = usedPhraseIDs.rows.map(r => r.phraseid);
        let q = 1;
        while (existingPhraseIDs.includes(q)) {
          q++;
        }
        await client.query(`insert into phrases (phraseid, phrase, wordid) values ($1, $2, $3)`, [q, phrase, wordid]);
      }
    }

    res.json({ success: true });
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
    res.status(500).json({ success: false });
   }
});

router.post('/sendPhrases',verifyToken, verifyAdmin, async (req, res) =>{
  const { wordid } = req.body;
  try {
    const returnPhrases = await client.query(`SELECT phrase FROM phrases WHERE wordid = $1`, [wordid]);
    const phrases = returnPhrases.rows.map(r => r.phrase);
    res.json({success: true, phrases: phrases});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;