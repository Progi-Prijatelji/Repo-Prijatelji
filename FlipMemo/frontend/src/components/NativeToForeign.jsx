import { WORDS } from '../mockData.js';
import { useState, useEffect } from 'react';



const ForeignToNative = () => {

    const [dictWords, setDictWords] = useState(WORDS.filter(word => word.langId === 1));
    const [questionWord, setQuestionWord] = useState('');
    const [options, setOptions] = useState([]);
    const [currentCorrectWord, setCurrentCorrectWord] = useState(null);
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const croWords = WORDS.filter(word => word.langId === 1);
        const engWords = WORDS.filter(word => word.langId === 2);

        // Izaberi random hrvatsku riječ
        const randWord = croWords[Math.floor(Math.random() * croWords.length)];
        const correctWord = engWords.find(word => word.translateId === randWord.wordId);
        setCurrentCorrectWord(correctWord);

        // Izaberi 3 random pogrešna odgovora
        const wrongAnswers = engWords
            .filter(word => word.wordId !== correctWord.wordId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        // Kombiniraj tačan odgovor sa pogrešnim i izmješaj
        const allOptions = [correctWord, ...wrongAnswers]
            .sort(() => Math.random() - 0.5);

        setQuestionWord(randWord.word);
        setOptions(allOptions);
    }, []);

    

    useEffect(() => {
        if (progress > 0 && progress < 10) {
            const engWords = WORDS.filter(word => word.langId === 2);

            // Izaberi random hrvatsku riječ
            const randWord = dictWords[Math.floor(Math.random() * dictWords.length)];
            const correctWord = engWords.find(word => word.translateId === randWord.wordId);
            setCurrentCorrectWord(correctWord);

            // Izaberi 3 random pogrešna odgovora
            const wrongAnswers = engWords
                .filter(word => word.wordId !== correctWord.wordId)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

            // Kombiniraj tačan odgovor sa pogrešnim i izmješaj
            const allOptions = [correctWord, ...wrongAnswers]
                .sort(() => Math.random() - 0.5);

            setQuestionWord(randWord.word);
            setOptions(allOptions);
        }
    }, [progress]);

    const handleClick = (option) => {
        if (option.wordId === currentCorrectWord.wordId) {
            setProgress(progress + 1);
            setDictWords(dictWords.filter(word => word.wordId !== currentCorrectWord.translateId));
            setScore(score + 1);
            alert("Točno!");
        } else {
            setProgress(progress + 1);
            setDictWords(dictWords.filter(word => word.wordId !== currentCorrectWord.translateId));

            alert("Pogrešno! Pokušaj ponovno.");
        }
    }
   
    return (
        <div className="learn-main-container">
            {progress >= 10 && (
                <div className="congrats-message">
                    <h2>Čestitamo! Završili ste lekciju!</h2>
                    <label className="score-lable">Vaš rezultat: {score} / 10</label>
                </div>
            )}
            {progress < 10 && (
                <>  
                    <div className="progress-bar">
                        <p>Napredak: {progress} / 10</p>
                        <div className="progress-fill" style={{ width: `${(progress / 10) * 100}%` }}></div>
                    </div>
                    
                    <div className="question-section">
                        <span className="question-word">{questionWord}</span>
                    </div>
                    
                    <div className="selection-section">
                        {options.map((opt) => (
                            <button 
                                key={opt.wordId} 
                                className="option-card" 
                                onClick={() => handleClick(opt)}>
                                {opt.word}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ForeignToNative;