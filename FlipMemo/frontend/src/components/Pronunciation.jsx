import { useState, useEffect, useRef } from 'react';
import { Mic, CircleStop } from 'lucide-react';

const Pronunciation = ({ words = [] }) => {
  const [dictWords, setDictWords] = useState([]);
  const [questionWord, setQuestionWord] = useState('');

  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);


  //za recordanje 
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordedURL, setRecordedURL] = useState('');

  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const chunks = useRef([]);


  const startRecording = async () => {
    setIsRecording(true);

    try{
        setSeconds(0);
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        mediaStream.current = stream;
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (e) => {
            if (e.data.size > 0){
                chunks.current.push(e.data);
            }
        }
        const timer = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        mediaRecorder.current.onstop = () => {
            const recordedBlob = new Blob(chunks.current,{type: 'audio/mp3'});
            const url = URL.createObjectURL(recordedBlob);
            setRecordedURL(url);

            chunks.current = [];
            clearTimeout(timer);
        }

        mediaRecorder.current.start();

    }catch(error){
        console.log(error);
    }

    
  }



  const stopRecording = async () => {
    setIsRecording(false);
    if(mediaRecorder.current){
        mediaRecorder.current.stop();
        mediaStream.current.getTracks().forEach(track => track.stop());
    }
  }

  




  const formatTime = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600)/60);
      const secs = totalSeconds % 60;

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
  }




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
            {isRecording ? (
              <button
                className="mic-button recording"
                aria-label="Stop microphone"
                style={{width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                onClick={() => {stopRecording}}
              >
                <CircleStop />
              </button>
            ) : (
              
              <button
                className="mic-button"
                aria-label="Start microphone (disabled)"
                style={{width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                onClick={() => {startRecording}}
              >
                <Mic />
              </button>
            )}
            
            {isRecording && <span className="recording-timer">{formatTime(seconds)}</span>}
            {recordedURL && !isRecording && (
              <audio controls src={recordedURL} />
            )}
            <button onClick={nextWord} className="next-button" style={{padding: '10px 16px'}}>Sljedeća riječ</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Pronunciation;