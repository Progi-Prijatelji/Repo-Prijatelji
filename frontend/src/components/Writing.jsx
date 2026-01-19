import { WORDS } from '../mockData.js';
import { useState, useEffect, useRef } from 'react';
import {Mic} from 'lucide-react'


const Writing = ( {words} ) => {

  const [dictWords, setDictWords] = useState([]);//sve rijeci
  const [questionWord, setQuestionWord] = useState('');//trenutna tocna rijec
  const [wordAudio, setWordAudio] = useState('');//audio za rijec
  const [inputValue, setInputValue] = useState('');//unos korisnika
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);

  const [audioReady, setAudioReady] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    if(words.length > 0){
      const normalized = words.map(w => ({ ...w, wordid: Number(w.wordid ?? w.wordID) }));
      setDictWords(normalized);
      
      const randWord = normalized[Math.floor(Math.random() * normalized.length)];
      setQuestionWord(randWord.word);
      
      setWordAudio(randWord.audiofile);
    }
  }, [words]);

  useEffect(() => {
    if (progress > 0 && progress < words.length && dictWords.length > 0) {
      const randWord = dictWords[Math.floor(Math.random() * dictWords.length)];
      setQuestionWord(randWord.word);
      setWordAudio(randWord.audiofile);
      setInputValue('');
    }
  }, [progress, dictWords, words.length]);

  useEffect(() => {
    if (audioRef.current && wordAudio) {
      audioRef.current.src = wordAudio;
      audioRef.current.load();
      setAudioReady(false);
    }
  }, [wordAudio]);

  const handleAudio = () => {
    if (!wordAudio || !audioRef.current) {
      console.log('Audio nije dostupan:', wordAudio);
      return;
    }
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } catch (err) {
      console.error('Audio play failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      alert("Unesite riječ!");
      return;
    }

    try{
      const isCorrect = inputValue.toLowerCase().trim() === questionWord.toLowerCase().trim();

      const response = await fetch("https://fmimage.onrender.com/homeUser/updateWord", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
            email: localStorage.getItem('email'),
            wordid: dictWords.find(w => w.word === questionWord)?.wordid,
            correction: isCorrect,
            method: "write"
        })
      })
      const data = await response.json();
      if(data.success){
        if (isCorrect) {
          setScore(score + 1);
          alert("Točno!");
        } else{
          alert("Pogrešno! Točan odgovor: " + questionWord);
        }
        
        const remainingWords = dictWords.filter(w => w.word !== questionWord);
        setDictWords(remainingWords);
        setInputValue('');
        setProgress(progress + 1);
      }

    }catch(err){
      console.error("Error checking written word:", err);
      alert("Greška pri provjeri odgovora");
    }
  };


  if (words.length === 0) {
        return <div>Nema rijeci</div>;
    }
    
  return (
    <div className="learn-main-container">
            {progress >= words.length && (
                <div className="congrats-message">
                    <h2>Čestitamo! Završili ste lekciju!</h2>
                    <label className="score-lable">Vaš rezultat: {score} / {progress} </label>
                </div>
            )}
            {progress < words.length && (
                <>  
                    <div className="progress-bar">
                        <p>Napredak: {progress} / {words.length}</p>
                        <div className="progress-fill" style={{ width: `${(progress / words.length) * 100}%` }}></div>
                    </div>
                    {questionWord}
                    <div className="audio-section">
                        <button onClick={handleAudio} disabled={!audioReady}>
                          <Mic className="ikona"/>
                        </button>
                        <audio 
                          ref={audioRef}
                          onCanPlay={() => setAudioReady(true)}
                          onError={(e) => console.error('Audio error:', e)}
                          preload="auto"
                          playsInline
                          style={{ display: 'none' }}
                          />

                    </div>
                    
                    <div className="writing-section">
                        <form action="" onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                                placeholder="Upišite riječ ovdje"
                            />
                            <button type="submit">Provjeri</button>
                        </form>
                    </div>
                </>
            )}
        </div>
  );
};

export default Writing;

// router.post('/updateWord', verifyToken, async (req, res) =>{
//   const {email, wordid, correction} = req.body

//   try {
//     const userResult = await client.query(`SELECT userid FROM users WHERE email = $1`,[email]);
//     const userid = userResult.rows[0].userid;

//     if(correction){
//       await client.query(`UPDATE userword SET lastTimeDate = NOW(), container = container + 1 WHERE userid = $1 AND wordid = $2)`, [userid, wordid]);
//     } else{
//       await client.query(`UPDATE userword SET container = GREATEST(container - 1, 1), lastTimeDate = NOW() WHERE userid = $1 AND wordid = $2`, [userid, wordid]);
//     }

//     res.json({success: true});  
//   } catch (err) {
//     res.status(500).json({success: false});
//   }
// });
