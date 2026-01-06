
import { useState, useEffect } from 'react';



const ForeignToNative = ( { words, translations } ) => {

    const [dictWords, setDictWords] = useState([]);// hrvatska rijeci iz rjecnika
    const [allTranslations, setAllTranslations] = useState([]); //engleske rijeci
    const [questionWord, setQuestionWord] = useState('');
    const [options, setOptions] = useState([]);
    const [currentCorrectWord, setCurrentCorrectWord] = useState(null);
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if( words.length > 0 ) {
        
            setDictWords(translations);
         
            setAllTranslations(words);
        }
    }, [words, translations]);

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

        setQuestionWord(randWord.translation);
        setOptions(allOptions);
    }
 

    const handleClick = (option) => {
        if (option === currentCorrectWord) {
            setScore(score + 1);
            alert("Točno!");
        } else {
            alert("Pogrešno! Točan odgovor: " + currentCorrectWord);
        }
        
        setProgress(progress + 1);
        setDictWords(dictWords.filter(w => w.word !== questionWord));
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
                        <span className="question-word">{questionWord}</span>
                    </div>
                    
                    <div className="selection-section">
                        {options.map((opt, index) => (
                            <button 
                                key={index} 
                                className="option-card" 
                                onClick={() => handleClick(opt)}>
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ForeignToNative;