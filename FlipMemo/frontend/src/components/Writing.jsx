import { WORDS } from '../mockData.js';
import { useState, useEffect } from 'react';
import {Mic} from 'lucide-react'


const Writing = ( {words} ) => {

  const [dictWords, setDictWords] = useState([]);//sve rijeci
  const [questionWord, setQuestionWord] = useState('');//trenutna tocna rijec
  const [wordAudio, setWordAudio] = useState('');//audio za rijec
  const [inputValue, setInputValue] = useState('');//unos korisnika
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if(words.length > 0){
      
      setDictWords(words);
      
      
    }
  }, [words]);

  useEffect(() => {
    if (progress > 0 && progress < words.length && dictWords.length > 0) {
      const randWord = dictWords[Math.floor(Math.random() * dictWords.length)];
      setQuestionWord(randWord.word);
      setWordAudio(randWord.audioFile);
      setInputValue('');

    }
  }, [progress]);

  const handleAudio = () => {
    {/*play audio for the word*/}
  }

  const handleSubmit = () => {
    if (inputValue.toLowerCase() === questionWord.toLowerCase()) {
      setScore(score + 1);
      alert("Točno!");

    } else{
      alert("Pogrešno! Točan odgovor: " + questionWord);
    }
    setProgress(progress + 1);
    setInputValue('');
  };


  return (
    <div className="learn-main-container">
            {progress < words.length && (
                <div className="congrats-message">
                    <h2>Čestitamo! Završili ste lekciju!</h2>
                    <label className="score-lable">Vaš rezultat: {score} / {progress} </label>
                </div>
            )}
            {progress >= words.length && (
                <>  
                    <div className="progress-bar">
                        <p>Napredak: {progress} / {words.length}</p>
                        <div className="progress-fill" style={{ width: `${(progress / words.length) * 100}%` }}></div>
                    </div>
                    {questionWord}
                    <div className="audio-section">
                        <button
                          onClick={() => handleAudio()}>
                            <Mic className="ikona"/>
                          </button>
                    </div>
                    
                    <div className="writing-section">
                        <form action="">
                            <input 
                                type="text" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                                placeholder="Upišite riječ ovdje"
                            />
                            <button type="button" onClick={handleSubmit}>Provjeri</button>
                        </form>
                    </div>
                </>
            )}
        </div>
  );
};

export default Writing;


// router.post('/checkWrittenWord',  verifyToken, async (req, res) =>{
//   const{written, wordid} = req.body

//   try {
//     const correct = await client.query(`select word from words where wordid = $1`, [wordid])

//     if(written == correct.rows[0].word){
//       res.json({success: true});  
//     }
//     else{
//       res.json({success: false});  
//     }
//   } catch (err) {
//     res.status(500).json({success: false});
//   }
// });

// module.exports = router;