import { useState, useEffect } from 'react';

const ForeignToNative = ({ words, allWords, allPhrases }) => {

    const [dictWords, setDictWords] = useState([]);
    const [allTranslations, setAllTranslations] = useState([]);
    const [questionWord, setQuestionWord] = useState('');
    const [questionPhrase, setQuestionPhrase] = useState('');
    const [options, setOptions] = useState([]);
    const [currentCorrectWord, setCurrentCorrectWord] = useState(null);
    const [currentWordId, setCurrentWordId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);
    const [showPhrase, setShowPhrase] = useState(false);

    const mockFraza = "Ovo je primjer fraze";

    useEffect(() => {
        if (words.length > 0) {
            
            const normalized = words.map(w => ({ ...w, wordid: Number(w.wordid ?? w.wordID) }));
            const mappedTranslations = allWords
                .map(w => w.translation)
                .filter(Boolean);
            const uniqueTranslations = [...new Set(mappedTranslations)];

            setDictWords(normalized);
            setAllTranslations(uniqueTranslations);
        }
    }, [words, allWords]);

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

        const phrasesForWord = allPhrases.filter(p => p.wordid === randWord.wordid);
        const randomPhrase = phrasesForWord.length
            ? phrasesForWord[Math.floor(Math.random() * phrasesForWord.length)].phrase
            : '';



        setQuestionWord(randWord.word);
        setQuestionPhrase(randomPhrase);
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
                    wordid: currentWordId,
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
        return <div className="congrats-message">
                    <h2>Trenutno nemate riječi za učenje.</h2>
                    
                </div>
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
                        <span 
                            className="question-word"
                            onMouseEnter={() => setShowPhrase(true)}
                            onMouseLeave={() => setShowPhrase(false)}
                            style={{ position: 'relative', cursor: 'help' }}
                        >
                            {questionWord.charAt(0).toUpperCase() + questionWord.slice(1)}
                            
                            {(showPhrase && questionPhrase) && (
                                <div className="phrase-tooltip">
                                    {questionPhrase}
                                </div>
                            )}
                        </span>
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


