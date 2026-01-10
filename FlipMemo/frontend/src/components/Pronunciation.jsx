import { useState, useEffect, useRef } from 'react';
import { Mic, CircleStop } from 'lucide-react';

const Pronunciation = ({ words = [] }) => {
  const [dictWords, setDictWords] = useState([]);
  const [questionWord, setQuestionWord] = useState({});

  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);


  //za recordanje 
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordedURL, setRecordedURL] = useState('');
  const [recordingScore, setRecordingScore] = useState(0);
  const [isScoring, setIsScoring] = useState(false);

  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);


  const startRecording = async () => {
    setIsRecording(true);
    setRecordedURL('');
    setRecordingScore(0);

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
        timerRef.current = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        mediaRecorder.current.onstop = () => {
            const recordedBlob = new Blob(chunks.current,{type: 'audio/mp3'});
            const url = URL.createObjectURL(recordedBlob);
            setRecordedURL(url);

            chunks.current = [];
            if(timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        mediaRecorder.current.start();

    }catch(error){
        console.log(error);
        setIsRecording(false);
    }

    
  }

  const handleConfirm = async () => {
    if(!recordedURL) return;

    setIsScoring(true);
    
    try{
      const url = `https://thefluentme.p.rapidapi.com/score/${questionWord.audiopostid}?100`;
      const options = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '53721952edmsh7b1cdc73f126a32p13c135jsn1e9892198854',
          'x-rapidapi-host': 'thefluentme.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audio_provided: recordedURL})
      };

      const response = await fetch(url, options);
      const result = await response.json();
      const score = result[1].overall_result_data[0].overall_points;
      setRecordingScore(score);

    }catch(err){
        console.error("Error scoring pronunciation:", err);
        alert("Došlo je do greške pri ocjenjivanju izgovora.");
        setIsScoring(false);
    }finally{
        setIsScoring(false);
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
      setQuestionWord(rand);
    }
  }, [words]);


  const scoring = async () => {
    //TREBA NAPRAVITI UPLOAD AUDIO NA JAVNI URL PRVO
    //BLOB SE NE MOZE POSLATI NA API, TREBA UPLOADATI U SERVER 
    const url = `https://thefluentme.p.rapidapi.com/score/${questionWord.audiopostid}?100`;
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '53721952edmsh7b1cdc73f126a32p13c135jsn1e9892198854',
        'x-rapidapi-host': 'thefluentme.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ audio_provided: recordedURL }) // Treba biti javni URL! OVO SE NE MOŽE SLATI KAO BLOB
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setRecordingScore(result[1].overall_result_data[0].overall_points);
            
    } catch (error) {
      console.error(error);
      alert('Greška pri bodovanju');
      setIsScoring(false);
    }
  }

  useEffect(() => {
    if(recordingScore != null){
      if(recordingScore >= 50){
        setScore(score + 1);
        alert(`Točno! Ocjena izgovora: ${recordingScore.toFixed(2)}`);
        setTimeout(() => {
          nextWord();
        }, 1500);

      }else{
        alert(`Pogrešno! Ocjena izgovora: ${recordingScore.toFixed(2)}. Pokušajte ponovno.`);
        setIsScoring(false);
      }
    }
  }, [recordingScore]);

  const nextWord = () => {
    if (dictWords.length === 0) return;
    setProgress(progress + 1);
    const remainingWords = dictWords.filter(w => w.word !== questionWord.word);
    setDictWords(remainingWords);
    if (remainingWords.length > 0) {
      const rand = remainingWords[Math.floor(Math.random() * remainingWords.length)];
      setQuestionWord(rand);
    }
    setRecordedURL('');
    setRecordingScore(null);
    setIsScoring(false);
    setSeconds(0);
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
            <h2>{questionWord.word}</h2>
            
          </div>

          <div style={{flex: 1}} />

          <div className="mic-footer" style={{padding: '20px', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center'}}>
            {isRecording ? (
              <button
                className="mic-button recording"
                aria-label="Stop microphone"
                style={{width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                onClick={stopRecording}
              >
                <CircleStop />
              </button>
            ) : (
              
              <button
                className="mic-button"
                aria-label="Start microphone (disabled)"
                style={{width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                onClick={startRecording}
              >
                <Mic />
              </button>
            )}
            
            {isRecording && <span className="recording-timer">{formatTime(seconds)}</span>}
            {recordedURL && !isRecording && (
              <audio controls src={recordedURL} />
            )}
            <button 
              onClick={handleConfirm}  
              className="next-button" 
              style={{padding: '10px 16px'}}
              disabled={!recordedURL || isScoring}
            >
              {isScoring ? 'Ocjenjivanje...' : 'Potvrdi'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Pronunciation;