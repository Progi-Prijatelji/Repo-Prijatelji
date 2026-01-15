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
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingScore, setRecordingScore] = useState(-1);
  const [isScoring, setIsScoring] = useState(false);

  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (words.length > 0) {
      setDictWords(words);
      generateWord();
    }
  }, [words]);


  useEffect(() => {
    if(recordingScore > 0){
      if(recordingScore >= 50){
        alert(`Dobar izgovor! Osvojili ste ${recordingScore} bodova.`);
        setScore(score => score + 1);

      (async () => {
        try{
          const response = await fetch("https://fmimage.onrender.com/homeUser/updateWord", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
              email: localStorage.getItem("email"),
              wordid: Number(questionWord.wordid ?? questionWord.wordID),
              correction: true,
              method: 'speak'
            })
          });
          const data = await response.json();
          if(!data.success){
            console.error("Failed to update word progress:", data.message);
          }


        }catch(err){
          console.error("Error updating word progress:", err);
        }
      })


      }else {
        alert(`Izgovor nije zadovoljavajući. Osvojili ste ${recordingScore} bodova. Pokušajte ponovno.`);

      }
      setRecordingScore(-1);
      setRecordedURL('');
      setSeconds(0);
      setIsRecording(false);
      setProgress(progress => progress + 1);
    }
  }, [recordingScore]);

  useEffect(() => {
    if(progress === 0 && dictWords.length > 0){
      generateWord();
    }
  }, [dictWords, progress]);

  useEffect(() => {
    if (progress > 0 && progress < words.length) {
      generateWord();
    }
  }, [progress]);


  const generateWord = () => {
    const source = dictWords.length ? dictWords : words;
    if (source.length === 0) return;
    const rand = source[Math.floor(Math.random() * source.length)];
    setQuestionWord(rand);
  }



  

  

  const startRecording = async () => {
    setIsRecording(true);
    setRecordedURL('');
    setRecordingScore(-1);

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
            const recordedBlob = new Blob(chunks.current,{type: 'audio/webm'});
            const url = URL.createObjectURL(recordedBlob);
            setRecordedURL(url);
            setRecordedBlob(recordedBlob);

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
    //simuliraj ocjenjivanje izgovora
    if(!recordedBlob) {
      alert("Nema snimljenog zvuka.");
      return;
    }
    if (isScoring) return;

    const randNumer = Math.floor(Math.random() * 25) + 75; // Random broj izmedju 75 i 100
    setRecordingScore(randNumer);
    
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