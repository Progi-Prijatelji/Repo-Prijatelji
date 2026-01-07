import { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

const Pronunciation = ({ words = [] }) => {
  const [dictWords, setDictWords] = useState([]);
  const [questionWord, setQuestionWord] = useState('');
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  

  useEffect(() => {
    if (words.length > 0) {
      setDictWords(words);
      const rand = words[Math.floor(Math.random() * words.length)];
      setQuestionWord(rand.word);
    }
  }, [words]);

  const nextWord = () => {
    if (dictWords.length === 0) return;
    const remaining = dictWords.filter(w => w.word !== questionWord);
    let next;
    if (remaining.length === 0) {
      setDictWords(words);
      next = words[Math.floor(Math.random() * words.length)];
    } else {
      next = remaining[Math.floor(Math.random() * remaining.length)];
      setDictWords(remaining);
    }
    setQuestionWord(next.word);
    setProgress(progress + 1);
  };

  // const handleRecord = () => {
  //   // Implement recording functionality here

  //   setScore(score + 1); 
  //   setDictWords(dictWords.filter(w => w.word !== questionWord));
  //   nextWord();
  // }



  if (words.length === 0) {
    return <div className="learn-main-container">Nema riječi</div>;
  }

  return (
    <div className="learn-main-container pronunciation-page" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      {progress >= words.length ? (
        <div className="congrats-message">
          <h2>Čestitamo! Završili ste lekciju!</h2>
          <label className="score-lable">Riječi: {progress} / {words.length}</label>
        </div>
      ) : (
        <>
          <div className="progress-bar">
            <p>Napredak: {progress} / {words.length}</p>
            <div className="progress-fill" style={{ width: `${(progress / words.length) * 100}%` }}></div>
          </div>

          <div className="question-section" style={{padding: '24px', textAlign: 'center'}}>
            <h2>{questionWord}</h2>
            
          </div>

          <div style={{flex: 1}} />

          <div className="mic-footer" style={{padding: '20px', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center'}}>
            <button
              className="mic-button"
              aria-label="Start microphone (disabled)"
              style={{width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              onClick={() => {handleRecord}}
            >
              <Mic />
            </button>

            <button onClick={nextWord} className="next-button" style={{padding: '10px 16px'}}>Sljedeća riječ</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Pronunciation;