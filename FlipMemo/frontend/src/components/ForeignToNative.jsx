import { useState, useEffect } from 'react';

const ForeignToNative = ({ words }) => {

    const [dictWords, setDictWords] = useState([]);
    const [allTranslations, setAllTranslations] = useState([]); //hrvatske rijeci
    const [questionWord, setQuestionWord] = useState('');
    const [options, setOptions] = useState([]);
    const [currentCorrectWord, setCurrentCorrectWord] = useState(null);
    const [currentWordId, setCurrentWordId] = useState(null); // ID aktivne riječi
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (words.length > 0) {
            
            const normalized = words.map(w => ({ ...w, wordid: Number(w.wordid ?? w.wordID) }));
            setDictWords(normalized);
            setAllTranslations(normalized.map(w => w.translation));
        }
    }, [words]);

    useEffect(() => {
        if (dictWords.length > 0 && allTranslations.length > 0 && progress === 0) {
            generateQuestion();
        }
    }, [dictWords, allTranslations]);

    useEffect(() => {
        if (progress > 0 && progress < words.length && dictWords.length > 0) {
            generateQuestion();
        }
    }, [progress]);

    const generateQuestion = () => {
        const randWord = dictWords[Math.floor(Math.random() * dictWords.length)];
        const correctTranslation = randWord.translation;
        setCurrentCorrectWord(correctTranslation);
        
  
        const wrongAnswers = allTranslations
            .filter(t => t !== correctTranslation)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);


        const allOptions = [correctTranslation, ...wrongAnswers]
            .sort(() => Math.random() - 0.5);


        setQuestionWord(randWord.word);
        setCurrentWordId(randWord.wordid); 
        setOptions(allOptions);
    };

    const handleClick = async (option) => {
        try{
            const response = await fetch("https://fmimage.onrender.com/homeUser/updateWord", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    email: localStorage.getItem('email'),
                    wordid: currentWordId ?? randWord?.wordid, 
                    correction: option === currentCorrectWord,
                    method: 'fton'
                })
            });
            
            const data = await response.json();
            if(data.success){
                if (option === currentCorrectWord) {
                    setScore(score + 1);
                    alert("Točno!");
                } else {
                    alert("Pogrešno! Točan odgovor: " + currentCorrectWord);
                }
                setProgress(progress + 1);
                setDictWords(dictWords.filter(w => w.word !== questionWord));
            }
            else {
                console.error("Doslo je do pogreske pri azuriranju rijeci.");
            }
        } catch (error) {
            console.error("handleClick error, currentWordId=", currentWordId, error);
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
                    
                    <div className="question-section">
                        <span className="question-word">{questionWord.charAt(0).toUpperCase() + questionWord.slice(1)}</span>
                    </div>
                    
                    <div className="selection-section">
                        {options.map((opt, index) => (
                            <button 
                                key={index} 
                                className="option-card" 
                                onClick={() => handleClick(opt)}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ForeignToNative;


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
