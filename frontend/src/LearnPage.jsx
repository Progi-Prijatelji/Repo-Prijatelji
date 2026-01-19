import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from './components/Header.jsx';
import ForeignToNative from './components/ForeignToNative.jsx';
import NativeToForeign from './components/NativeToForeign.jsx';
import Writing from './components/Writing.jsx';
import Pronunciation from './components/Pronunciation.jsx';
import './css/LearnPage.css';

function LearnPage() {
  const { dictId, mode } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [allPhrases, setAllPhrases] = useState([]);
  
  const [loading, setLoading] = useState(true);


  const wordsMock = [
    { word: 'apple', translation: 'jabuka', audioFile: 'apple.mp3' },
    { word: 'pear', translation: 'kruška', audioFile: 'pear.mp3' },
    { word: 'banana', translation: 'banana', audioFile: 'banana.mp3' },
    { word: 'grape', translation: 'grožđe', audioFile: 'grape.mp3' },
    { word: 'orange', translation: 'naranča', audioFile: 'orange.mp3' },
    
  ];

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('https://fmimage.onrender.com/homeUser/sendWordsInDictForUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({ 
              email: localStorage.getItem('email'), 
              dictid: parseInt(dictId), 
              method: mode})
        });

        console.log('sendWordsInDictForUser response status:', response.status);

        const allWords = await fetch('https://fmimage.onrender.com/homeUser/showWords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({ dictid: parseInt(dictId) })
        });

        const allWordsData = await allWords.json();
        if (allWordsData && allWordsData.success) {
          setAllWords(allWordsData.words);
          setAllPhrases(allWordsData.phrases);
        }
        
        const data = await response.json();
        console.log('sendWordsInDictForUser response body:', data);
        if (data && data.success) {
          
          setWords(data.words);
          
          
          setTranslations(data.words.map(w => w.translation));
        } else {
          console.warn('No words returned or request not successful');
        }
      } catch (error) {
        console.error('Error fetching words:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [dictId]);

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  return (
    <>
      <Header />
      <div className="learn-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Nazad
        </button>
        

        {mode === 'fton' && (
          <ForeignToNative words={words} allWords={allWords} allPhrases={allPhrases} />
        )}

        {mode === 'ntof' && (
          <NativeToForeign words={words} allWords={allWords} allPhrases={allPhrases} />
        )}

        {mode === 'write' && (
          <Writing words={words} />
        )}

        {mode === 'speak' && (
          <Pronunciation words={words} />
        )}
      </div>
    </>
  );
}

export default LearnPage;

// router.post('/sendWordsInDictForUser', verifyToken, async (req, res) =>{
//   const {email, dictid, method} = req.body     

//   try {
//     const userResult = await client.query(`SELECT userid FROM users WHERE email = $1`,[email]);
//     const userid = userResult.rows[0].userid;

//     const newUserInDict = await client.query(`SELECT count(wordid) FROM userword WHERE userid = $1`,[userid]); //vidimo dal je osoba vec ucila

//     const count = Number(newUserInDict.rows[0].count);

//     if (count === 0) {//ako nije ucila stavljamo u userword, kao lasttimedate stavljam null jer nije zapravo naucila rijec ni jednom
//       const wordsInDict = await client.query(`select wordid from dictword where dictid = $1`, [dictid])

//       for (const row of wordsInDict.rows) {
//         await client.query(`INSERT INTO userword (userid, wordid, container, lastTimeDate, method) VALUES ($1, $2, 0, NULL, $3)`,[userid, row.wordid, method]);
//       }
//     }  
//       //sve riejci koje se mogu uciti, ili rijeci koje se nikada nisu ucile do sad ili rijeci koje su u pripadajucem konatineru dovoljno vremena
//     const returnWords = await client.query(`SELECT w.word AS word, w.wordid AS wordID, t.word AS translation 
//                                             FROM dictword dw 
//                                             JOIN words w ON w.wordid = dw.wordid
//                                             LEFT JOIN words t ON t.wordid = w.translationid 
//                                             JOIN userword uw on uw.wordid = dw.wordid
//                                             WHERE dw.dictid = $1 and uw.userid = $2 and uw.container <= 5 and dw.method = $3
//                                             and (lastTimeDate = NULL and container = 0
//                                             or lastTimeDate >= NOW() - '1 day'::interval and container = 1
//                                             or lastTimeDate >= NOW() - '2 day'::interval and container = 2
//                                             or lastTimeDate >= NOW() - '3 day'::interval and container = 3
//                                             or lastTimeDate >= NOW() - '4 day'::interval and container = 4
//                                             or lastTimeDate >= NOW() - '5 day'::interval and container = 5) `, [dictid, userid, method]);
  
//   res.json({success: true, words: returnWords.rows});     
//   } catch (err) {
//     res.status(500).json({success: false});
//   }
// });

// router.post('/showWords', verifyToken, async (req, res) =>{
//   const {dictid} = req.body

//   try {
//     const returnWords = await client.query(`SELECT w.word AS word, t.word AS translation, w.wordid AS wordid, w.translationid AS translationid
//                                             FROM dictword dw JOIN words w ON w.wordid = dw.wordid
//                                             LEFT JOIN words t ON t.wordid = w.translationid WHERE dw.dictid = $1`, [dictid]);
    
//     const returnPhrases = await client.query(`SELECT p.phrase, p.wordid FROM dictword dw JOIN words w ON dw.wordid = w.wordid AND dictid = $1 LEFT JOIN words t ON w.translationid = t.wordid LEFT JOIN phrases p ON p.wordid = w.wordid OR p.wordid = t.wordid`, [dictid]);

//     res.json({success: true, words: returnWords.rows, phrases: returnPhrases.rows});
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// });