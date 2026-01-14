import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, json } from 'react-router-dom';
import logo from './assets/FlipMemo__Logo.png'
import HeaderAdmin from './components/HeaderAdmin.jsx';
import './css/homeAdmin.css'
import './css/addDictionary.css'
function HomePageAdmin() {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [adminUser, setAdminUser] = useState([]);
    const kadmin = localStorage.getItem("isKadmin");

    const [dictName, setDictName] = useState("");
    const [dictDesc, setDictDesc] = useState("");
    const [langID, setLangID] = useState("");
    const [dictionaries, setDictionaries] = useState([]);

    const [word, setWord] = useState("");
    const [wordTrans, setWordTrans] = useState("");
    const [wordLangID, setWordLangID] = useState("");

   const [wordId, setWordId] = useState("");
   const [selectedDictIds, setSelectedDictIds] = useState([]);

    const [language, setLanguage] = useState("");

    const [languages, setLanguages] = useState([]);

    const [openDictId, setOpenDictId] = useState(null);
    const [wordList, setWordList] = useState([]);

    const [allWordList, setAllWordList] = useState([]);
    const [languageFilter, setLanguageFilter] = useState("");
    const [typedWord, setTypedWord] = useState("");
    const [selectedWord, setSelectedWord] = useState("");

    const apiLanguageIds = new Map();
    apiLanguageIds.set('afrikaans', '1'); apiLanguageIds.set('arapski', '2'); apiLanguageIds.set('bengalski', '4'); apiLanguageIds.set('bugarski', '6'); apiLanguageIds.set('katalonski', '7'); apiLanguageIds.set('češki', '8'); apiLanguageIds.set('danski', '9'); apiLanguageIds.set('nizozemski', '11'); apiLanguageIds.set('engleski', '22'); apiLanguageIds.set('filipnski', '23'); apiLanguageIds.set('finski', '25'); apiLanguageIds.set('francuski', '28'); apiLanguageIds.set('njemački', '30'); apiLanguageIds.set('grčki', '32'); apiLanguageIds.set('gudžaratski', '33'); apiLanguageIds.set('hindi', '35'); apiLanguageIds.set('mađarski', '37'); apiLanguageIds.set('islandski', '38'); apiLanguageIds.set('indonezijski', '39'); apiLanguageIds.set('talijanski', '41'); apiLanguageIds.set('kanadski', '43'); apiLanguageIds.set('korejski', '45'); apiLanguageIds.set('latvijski', '47'); apiLanguageIds.set('malajski', '48'); apiLanguageIds.set('malajalam', '50'); apiLanguageIds.set('norveški', '52'); apiLanguageIds.set('poljski', '54'); apiLanguageIds.set('portugalski', '56'); apiLanguageIds.set('pandžapski', '58'); apiLanguageIds.set('rumunjski', '60'); apiLanguageIds.set('ruski', '61'); apiLanguageIds.set('srpski', '63'); apiLanguageIds.set('slovački', '64'); apiLanguageIds.set('španjolski', '65'); apiLanguageIds.set('švedski', '69'); apiLanguageIds.set('tamilski', '71'); apiLanguageIds.set('telugu', '74'); apiLanguageIds.set('tajlandski', '75'); apiLanguageIds.set('turski', '76'); apiLanguageIds.set('ukrajinski', '78'); apiLanguageIds.set('vijetnamski', '80');
    
    const apiLanguageAcros = new Map();
    apiLanguageAcros.set('afrikaans', 'af'); apiLanguageAcros.set('arapski', 'ar'); apiLanguageAcros.set('bugarski', 'bn'); apiLanguageAcros.set('bangla', 'bn'); apiLanguageAcros.set('bosanski', 'bs'); apiLanguageAcros.set('katalonski', 'ca'); apiLanguageAcros.set('češki', 'cs'); apiLanguageAcros.set('velški', 'cy'); apiLanguageAcros.set('danski', 'da'); apiLanguageAcros.set('njemački', 'de'); apiLanguageAcros.set('grčki', 'el'); apiLanguageAcros.set('engleski', 'en'); apiLanguageAcros.set('španjolski', 'es'); apiLanguageAcros.set('estonski', 'et'); apiLanguageAcros.set('perzijski', 'fa'); apiLanguageAcros.set('finski', 'fi'); apiLanguageAcros.set('francuski', 'fr'); apiLanguageAcros.set('hebrejski', 'he'); apiLanguageAcros.set('hindski', 'hi'); apiLanguageAcros.set('hrvatski', 'hr'); apiLanguageAcros.set('mađarski', 'hu'); apiLanguageAcros.set('indonezijski', 'id'); apiLanguageAcros.set('islandski', 'is'); apiLanguageAcros.set('talijanski', 'it'); apiLanguageAcros.set('japanski', 'ja'); apiLanguageAcros.set('korejski', 'ko'); apiLanguageAcros.set('litavski', 'lt'); apiLanguageAcros.set('latvijski', 'lv'); apiLanguageAcros.set('malajski', 'ms'); apiLanguageAcros.set('malteški', 'mt'); apiLanguageAcros.set('hmong', 'mww'); apiLanguageAcros.set('norveški', 'nb'); apiLanguageAcros.set('nizozemski', 'nl'); apiLanguageAcros.set('poljski', 'pl'); apiLanguageAcros.set('portugalski', 'pt'); apiLanguageAcros.set('rumunjski', 'ro'); apiLanguageAcros.set('ruski', 'ru'); apiLanguageAcros.set('slovački', 'sk'); apiLanguageAcros.set('slovenski', 'sl'); apiLanguageAcros.set('srpski', 'sr-Latn'); apiLanguageAcros.set('švedski', 'sv'); apiLanguageAcros.set('svahili', 'sw'); apiLanguageAcros.set('tamilski', 'ta'); apiLanguageAcros.set('tajlandski', 'th'); apiLanguageAcros.set('klinkonski', 'tlh-Latn'); apiLanguageAcros.set('turski', 'tr'); apiLanguageAcros.set('ukrajinski', 'uk'); apiLanguageAcros.set('urdski', 'ur'); apiLanguageAcros.set('vijetnamski', 'vi'); apiLanguageAcros.set('kineski', 'zh-Hans');
   
    const [phraseToAdd, setPhraseToAdd] = useState([]);
    const [phrasesForeign, setPhrasesForeign] = useState([]);
    const [phrasesNative, setPhrasesNative] = useState([]);



    const [wordToEdit, setWordToEdit] = useState(null);
    const [changedWord, setChangedWord] = useState("");

    const [revealed, setRevealed] = useState("");


    const changeWord = async(originalWord, newWord) => {
        if (!newWord || newWord===originalWord.word) {
            alert("Unesite novu riječ.");
            return;
        }
        try{
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/changeWord", {
                method: "POST", 
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify({wordid: originalWord.wordid, newWord: newWord})
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Neuspješno mijenjanje riječi.");
                return;
            }
            setWordToEdit(null);
            setChangedWord("");
            await fetchWords();
        }catch(error){
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    }
    const editWord = async(wordid) => {
        setWordToEdit(wordid);
        setChangedWord("");
    }
    const fetchWords = async() => {
        try { 
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/showAllWords", {
                method: "GET",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
             },
            credentials: "include"  
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Nemate pravo pristupa.");
                return;
            }
            setAllWordList(data.words || []);
            
        } catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
            
        }
    }

    

    const showWords = async(id) => {
        setOpenDictId(prev => prev === id ? null : id);
        
        try{
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/showWords", {
                method: "GET",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
             },
                body: JSON.stringify({dictid: id})
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Neuspješno ucitavanje riječi.");
                return;
            }
            setWordList(data.words);

        }catch(error){
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    }

    const deleteWord = async(wordid) => {
        try{
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/deleteWord", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
             },
                body: JSON.stringify({wordid: wordid})
            });
            const data = await results.json();  
            if (!data.success) {
                alert(data.message || "Neuspješno brisanje riječi.");
                return;
            }
            await fetchWords();
        }catch(error){
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }   
    }

    const handleAddWord = async (e) => {
        e.preventDefault();
        if (!word || !wordLangID || !wordTrans) {
            alert("Molimo ispunite sva obavezna polja.");
            return;
        }
        try{
            let audioFile = "";
            let audioPostId = "";
            const lang = languages.find(l => l.langid===Number(wordLangID));
            if (apiLanguageIds.get(lang.langname)) {
                const audioResults = await fetch("https://thefluentme.p.rapidapi.com/post", {
                    method: "POST",
                    headers: { 
                        'x-rapidapi-key': 'db42fd30a6msh16db513f27f5c5ap1d716bjsn7c',
                        'x-rapidapi-host': 'thefluentme.p.rapidapi.com',
                        'Content-Type': 'application/json'
                 },
                    body: JSON.stringify({post_language_id: apiLanguageIds.get(lang.langname),  post_title: word, post_content: word})
                });
                const audioData = await audioResults.json();
                audioFile = audioData.ai_reading;
                audioPostId = audioData.post_id;
            }
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/addWord", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
                },
                body: JSON.stringify({word: word,  langid: wordLangID, translation: wordTrans, audioFile: audioFile, postId: audioPostId, phrasesForeign: phrasesForeign, phrasesNative: phrasesNative})
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Neuspješno dodavanje riječi.");
                return;
            }
            setWordId(data.wordid);
            fetchWords();
            
        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
        
    }
  

    const askForPhrases = async (w) => {

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${w}`;
        const options = {
        method: 'GET'
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const data=result[0].meanings;
            const definitions = [];
    
            data.forEach(meaning => {
                meaning.definitions.forEach(def => {
                    if (def.example){
                        definitions.push({
                            definition: def.definition,
                            example: def.example 
                        });
                    }
                });
            });
            console.log(definitions);
    
            
            setPhraseToAdd(definitions);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDictCheckboxChangePhrase = (sourceSentence) => {
        setPhrasesForeign(prev => {
            if (prev.includes(sourceSentence)) {
                return prev.filter(s => s !== sourceSentence);
            } else {
                return [...prev, sourceSentence];
            }
        });
    };

    const translateWord = async() => {
        const lang = languages.find(l => l.langid===Number(wordLangID));
        const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/text';
        const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '53721952edmsh7b1cdc73f126a32p13c135jsn1e9892198854',
            'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'hr',
            to: apiLanguageAcros.get(lang.langname),
            text: wordTrans
        })
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            setWord(result.trans || "");
        } catch (error) {
            console.error(error);
        }

    }

    const handleAddWordToDictionary = async (e) => {
        e.preventDefault();
        try{
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/addWordToDicts", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
             },
                body: JSON.stringify({wordid: selectedWord, dictids: selectedDictIds})
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Neuspješno dodavanje riječi.");
                return;
            }
            setWord("");
            setWordId("");
            setWordTrans("");
            setWordLangID("");
            setSelectedDictIds([]);
        }catch(error){
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    }

    const handleDictCheckboxChange = (dictId) => {
        setSelectedDictIds(prev => prev.includes(dictId) ? prev.filter(id => id !== dictId) : [...prev, dictId]);
    };

    const handleWordCheckboxChange = (wordId) => {
        setSelectedWord(wordId);
    };

    const handleAddLanguage = async (e) => {
        e.preventDefault();
        try {
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/addLang", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
             },
                body: JSON.stringify({langname: language})
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Neuspješno dodavanje jezika.");
                return;
            }
            setLanguage("");
            await fetchLanguages();
        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    }

    const handleAddDictionary = async (e) => {
        e.preventDefault();
        if (!dictName || !langID) {
            alert("Molimo ispunite sva obavezna polja.");
            return;
        }
        try {
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/addDictionary", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
             },
                body: JSON.stringify({name: dictName, langid: langID, desc: dictDesc})
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Neuspješno dodavanje rječnika.");
                return;
            }
            await fetchDictionaries();
            setDictName("");
            setDictDesc("");
        } catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    }
    const fetchLanguages = async () => {
        try{
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/sendLangList", {
                method: "GET",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
             },
            credentials: "include"
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Nemate pravo pristupa.");
                return;
            }
            setLanguages(data.langs || []);
        } catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    }
    const fetchDictionaries = async () => {
        try {
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/sendDictList", {
                method: "GET",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
             },
            credentials: "include"
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Nemate pravo pristupa.");
                return;
            }
            setDictionaries(data.dicts || []);
        } catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    };
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const results = await fetch("https://fmimage.onrender.com/homeAdmin/sendAdminList", {
                    method: "GET",
                    headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
                 },
                credentials: "include"
                }); 
                const data = await results.json();
                if (!data.success) {
                    alert(data.message || "Nemate pravo pristupa.");
                    return;
                }else{
                    setAdminUser(data.users);
                }
                
            } catch (error) {
                console.error("Greška:", error);
                alert("Greška u povezivanju s poslužiteljem.");
                
            }
        }
        fetchLanguages();
        fetchDictionaries();
        fetchAdmin();
        fetchWords();
    }, []);
    
    const handleSearch = async(e) => {
        e.preventDefault();
        if (!searchQuery) {
            alert("Unesite pojam za pretraživanje.");
            return;
        }
        try {
            const results = await fetch(`https://fmimage.onrender.com/homeAdmin/sendUserList`, {
                method: "GET",
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
                 },
                credentials: "include"
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Nemate pravo pristupa.");
                return;
            }
            
            if (!data.users) {
                alert("Nema dostupnih korisnika.");
                return;
            }

            const filteredResults = data.users.filter(
            (username) => username.toLowerCase().includes(searchQuery.toLowerCase()));
            setSearchResults(filteredResults);

        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
        
        
    }

    const handleRemoveAdmin = async(user) => {
        try {
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/removeAdmin", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
                },
                body: JSON.stringify({email: user}),
                credentials: "include"  
            });
            const data = await results.json();

            if (!data.success) {
                alert(data.message || "Neuspješno micanje admina.");
                return;
            }

            setAdminUser(prev => prev.filter(a => a !== user));


            
        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    }
    const handleAddAdmin = async(user) => {
        try {
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/addNewAdmin", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
                },
                body: JSON.stringify({email: user}),
                credentials: "include"  
            });
            const data = await results.json();

            if (!data.success) {
                alert(data.message || "Neuspješno dodavanje admina.");
                return;
            }

            setAdminUser(prev => [...prev, user]);         
            setSearchResults(prev => prev.filter(u => u !== user)); 

            
        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    }

    const toggleOptions = (option) => {
        setRevealed(prev => prev === option ? "" : option);
    }
    return(
        <>
        <HeaderAdmin />
            <div className="admin-page">
                <div className='adding'>
                    <div className='adding-parts word-adding'>
                        <div className='add-dictionary word-adding-part'>
                            <h2>Uređivanje rječnika</h2>
                            <button className="option-button" onClick={() => toggleOptions("AddRjecnik")}>Dodaj Rjecnik</button>
                            {revealed === "AddRjecnik" && 
                            <div className='adding-section'>
                                <h3>Dodaj novi rječnik</h3>
                                <form onSubmit={handleAddDictionary}>
                                    <input type="text" placeholder="Naziv rječnika" value={dictName} onChange={(e) => setDictName(e.target.value)}/>
                                    <select value={langID} onChange={(e) => setLangID(e.target.value)}>
                                        <option value="">Jezik</option>
                                        {languages.map((lang) => (
                                            <option key={lang.langid} value={lang.langid}>{lang.langname}</option>
                                        ))}
                                    </select>
                                    <textarea placeholder="Opis rječnika" value={dictDesc} onChange={(e) => setDictDesc(e.target.value)}/>
                                    <button className="admin-btn" type="submit">Dodaj rječnik</button>
                                </form>
                                <div className='old-dictionary current-admins'>
                                    <h2>Postojeći rječnici</h2>
                                    <ul className='admin-list existing'>
                                        {dictionaries.filter(dict => dict.langid === Number(langID)).map((dict) => (
                                        <li key={dict.dictid} className='admin-list-item'>
                                            <div>
                                                <p>{dict.dictname} - {dict.description}</p>
                                                {/*<button onClick={()=> showWords (dict.dictid)}>...</button>*/}
                                            </div>
                                            {/*{openDictId === dict.dictid  && (
                                                <div>
                                                    <h4>Riječi u rječniku:</h4>
                                                    <ul>
                                                        {wordList.map((wordItem) => (
                                                            <li key={wordItem.wordid}>
                                                                <p>{wordItem.word} - {wordItem.translation}</p>
                                                                <button onClick={()=> deleteWord(wordItem.wordid)}>X</button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}*/}
                                        </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>}
                        </div>

                        <div className='add-word word-adding-part'>
                            <h2>Uređivanje riječi</h2>
                            <button className="option-button"onClick={()=>toggleOptions("AddWord")}>Dodaj Riječ</button>
                            {revealed === "AddWord" && <div className='adding-section'>
                                <h3>Dodaj novu riječ</h3>
                                <form onSubmit={handleAddWord}>
                                    <input type="text" placeholder="Riječ na hrvatskom" value={wordTrans} onChange={(e) => setWordTrans(e.target.value)}/>
                                    <select value={wordLangID} onChange={(e) => setWordLangID(e.target.value)}>
                                        <option value="">Jezik</option>
                                        {languages.map((lang) => (
                                            <option key={lang.langid} value={lang.langid}>{lang.langname}</option>
                                        ))}
                                    </select>
                                    {wordLangID && <button className="admin-btn" type="button" onClick={translateWord}>Prevedi</button>}
                                    <input type="text" placeholder="Riječ" value={word} onChange={(e) => setWord(e.target.value)}/>

                                    {Number(wordLangID) === 2 && <button className="admin-btn" onClick={() => askForPhrases(word)}>Dodaj frazu</button>}
                                    {phraseToAdd.map((phrase, index) => {
                                        const sourceSentence =
                                            phrase.example; 

                                        return (
                                            <div key={index}>
                                                <input
                                                    type="checkbox"
                                                    checked={phrasesForeign.includes(sourceSentence)}
                                                    onChange={() => handleDictCheckboxChangePhrase(sourceSentence)}
                                                />
                                                <label>
                                                    {sourceSentence}
                                                </label>
                                            </div>
                                        );
                                    })}

                                    <button className="admin-btn" type="submit">Dodaj riječ</button>
                                </form>
                                <form onSubmit={handleAddWordToDictionary}>
                                    
                                    <input type="text" placeholder="Riječ koju zelis dodat u rječnik" value={typedWord} onChange={(e) => setTypedWord(e.target.value)}/>
                                    
                                    {typedWord && allWordList.filter(w => w.word.includes(typedWord)).map((w) => (
                                        <div key={w.wordid}>
                                            <input type="radio" checked={selectedWord === w.wordid} onChange={()=>handleWordCheckboxChange(w.wordid)}/>
                                            <label>{w.word}</label>
                                        </div>
                                    ))}
                                    <label>Odaberi rječnik u koji želiš dodati riječ:</label>
                                    {dictionaries.filter(dict => dict.langid === Number(wordLangID)).map((dict) => (
                                        <div key={dict.dictid}>
                                            <input type="checkbox" checked={selectedDictIds.includes(dict.dictid)} onChange={()=>handleDictCheckboxChange(dict.dictid)}/>
                                            <label>{dict.dictname}</label>
                                        </div>
                                    ))}
                                    <button className="admin-btn" type="submit">Dodaj riječ u rječnik</button>
                                </form>
                            </div>}
                            <button className="option-button"onClick={()=>toggleOptions("EditWords")}>Uredi riječi</button>
                            {revealed === "EditWords" && <div className='remove-words word-adding-part'>
                                <div className='adding-section'>
                                    <h3>Uredi ili obriši riječi</h3>
                                    <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
                                        <option value="">Jezik</option>
                                            {languages.map((lang) => (
                                                <option key={lang.langid} value={lang.langid}>{lang.langname}</option>
                                            ))}
                                    </select>
                                    <div className='admin-list'>
                                        <ul className='existing admin-list'>
                                            {allWordList.filter(wordItem => wordItem.langid === Number(languageFilter)).map((wordItem) => (
                                                <li key={wordItem.wordid} className='admin-list-item'>
                                                    <p>{wordItem.word} - {wordItem.translation}</p>
                                                    <button className="admin-add-btn" onClick={()=> deleteWord(wordItem.wordid)}>X</button>
                                                    <button className="admin-btn" onClick={()=>editWord(wordItem.wordid)}>Uredi</button>
                                                    { wordToEdit === wordItem.wordid &&(
                                                        <form onSubmit={(e)=>{e.preventDefault();
                                                            changeWord(wordItem, changedWord)}}>
                                                            <input type="text" value={changedWord} onChange={(e) => setChangedWord(e.target.value)}/>
                                                            <button className="admin-btn" type="submit">Spremi</button>
                                                        </form>
                                                    ) }
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>}
                            </div>
                            {/*<div className='add-language word-adding-part'>
                                <h3>Dodavanje novog jezika</h3>
                                <div className='adding-section'>
                                    <h3>Dodaj novu jezik</h3>
                                    <form onSubmit={handleAddLanguage}>
                                        <input type="text" placeholder="jezik" value={language} onChange={(e) => setLanguage(e.target.value)}/>
                                        <button type="submit">Dodaj jezik</button>
                                    </form>
                                </div>
                            </div>*/}
                        </div>



                    {kadmin === "true" &&(
                    <div className="admin-main-layout">
                        <div className="search container-admin">
                            <h2>Dodavanje admina</h2>
                            <form className="admin-search" onSubmit={handleSearch}>
                                <input
                                type="text"
                                className="admin-input"
                                placeholder="Pretraži korisnike..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="admin-btn" type="submit">Traži</button>
                            </form>
                        </div>
                        <div className="user-containers container-admin">
                            <div className="search-list">
                                <h3>Rezultati pretrage</h3>
                                <ul className="admin-list">
                                {searchResults.length > 0 ? (
                                    searchResults.map((result, index) => (
                                    <li key={index} className="admin-list-item">
                                        <span>{result}</span>
                                        <button className="admin-add-btn" onClick={() => handleAddAdmin(result)}>+</button>
                                    </li>
                                    ))
                                ) : (
                                    <p className="admin-empty">Nema rezultata</p>
                                )}
                                </ul>
                            </div>
                            <div className="current-admins"> 
                                <h3>Postojeći admini</h3>
                                <ul className="admin-list">
                                {adminUser.map((admin, index) => (
                                    <li key={index} className="admin-list-item">
                                    <span>{admin}</span>
                                    <button  className="admin-add-btn" onClick={() => handleRemoveAdmin(admin)}>X</button>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>
        </>
    );
}

export default HomePageAdmin;