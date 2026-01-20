import { useState, useEffect } from 'react';

const NativeToForeign = ( { words, allWords, allPhrases } ) => {

    const [dictWords, setDictWords] = useState([]);// hrvatske rijeci iz rjecnika
    const [allTranslations, setAllTranslations] = useState([]); //engleske rijeci
    const [questionWord, setQuestionWord] = useState('');
    const [questionPhrase, setQuestionPhrase] = useState('');
    const [options, setOptions] = useState([]);
    const [currentCorrectWord, setCurrentCorrectWord] = useState(null);
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);
    const [showPhrase, setShowPhrase] = useState(false);

    useEffect(() => {
        if( words.length > 0 ) {
            const normalized = words.map(w => ({ 
                ...w, 
                wordid: Number(w.wordid ?? w.wordID),
                translationID: w.translationID ? Number(w.translationID) : (w.translationid ? Number(w.translationid) : null)
            }));
            const mappedTranslations = allWords
                .map(w => w.word)
                .filter(Boolean);
            const uniqueTranslations = [...new Set(mappedTranslations)];
            setDictWords(normalized);
            setAllTranslations(uniqueTranslations);
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
        const correctTranslation = randWord.word;
        setCurrentCorrectWord(correctTranslation);



     
        const wrongAnswers = allTranslations
            .filter(t => t !== correctTranslation)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);


        const allOptions = [correctTranslation, ...wrongAnswers]
            .sort(() => Math.random() - 0.5);

        
        const targetId = randWord.translationID ?? randWord.translationid ?? randWord.wordid;
        const phrasesForWord = allPhrases.filter(p => p.wordid === targetId);
        console.log("Phrases for word ID", randWord.translationID, phrasesForWord);
        const randomPhrase = phrasesForWord.length
            ? phrasesForWord[Math.floor(Math.random() * phrasesForWord.length)].phrase
            : '';

        setQuestionWord(randWord.translation);
        setQuestionPhrase(randomPhrase);
        setOptions(allOptions);
    }
 

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
                    wordid: dictWords.find(w => w.translation === questionWord)?.wordid,
                    correction: option === currentCorrectWord,
                    method: 'ntof'
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
                setDictWords(dictWords.filter(w => w.translation !== questionWord));
            }
            else {
                console.error("Doslo je do pogreske pri azuriranju rijeci.");
            }
        } catch (error) {
            console.error("Krivo implementirana funkcija handleClick:", error);
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
}

export default NativeToForeign;