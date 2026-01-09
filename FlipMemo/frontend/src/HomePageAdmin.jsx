import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/addWord", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
             },
                body: JSON.stringify({word: word,  langid: wordLangID, translation: wordTrans})
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Neuspješno dodavanje riječi.");
                return;
            }
            setWordId(data.wordid);
            
        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
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
                body: JSON.stringify({wordid: wordId, dictids: selectedDictIds})
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
            console.log(data.langs);
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
    return(
        <>
        <HeaderAdmin />
            <div className="admin-page">
                <div className='adding'>
                    <div className='add-dictionary adding-part'>
                        <h2>Dodavanje rječnika</h2>
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
                                <button type="submit">Dodaj rječnik</button>
                            </form>
                        </div>
                        <div className='old-dictionary'>
                            <h2>Postojeći rječnici</h2>
                            <ul>
                                {dictionaries.filter(dict => dict.langid === Number(langID)).map((dict) => (
                                <li key={dict.dictid}>
                                    <div>
                                        <p>{dict.dictname}</p>
                                        <p>{dict.description}</p>
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
                    </div>

                    <div className='add-word adding-part'>
                        <h2>Dodavanje riječi</h2>
                        <div className='adding-section'>
                            <h3>Dodaj novu riječ</h3>
                            <form onSubmit={handleAddWord}>
                                <input type="text" placeholder="Riječ" value={word} onChange={(e) => setWord(e.target.value)}/>
                                <select value={wordLangID} onChange={(e) => setWordLangID(e.target.value)}>
                                    <option value="">Jezik</option>
                                    {languages.map((lang) => (
                                        <option key={lang.langid} value={lang.langid}>{lang.langname}</option>
                                    ))}
                                </select>
                                <input type="text" placeholder="Prijevod riječi" value={wordTrans} onChange={(e) => setWordTrans(e.target.value)}/>
                                <button type="submit">Dodaj riječ</button>
                            </form>
                            <form onSubmit={handleAddWordToDictionary}>
                                <label>Odaberi rječnik u koji želiš dodati riječ:</label>
                                {dictionaries.filter(dict => dict.langid === Number(wordLangID)).map((dict) => (
                                    <div key={dict.dictid}>
                                        <input type="checkbox" checked={selectedDictIds.includes(dict.dictid)} onChange={()=>handleDictCheckboxChange(dict.dictid)}/>
                                        <label>{dict.dictname}</label>
                                    </div>
                                ))}
                                <button type="submit">Dodaj riječ u rječnik</button>
                            </form>
                        </div>
                    </div>

                    <div className='add-language adding-part'>
                        <h3>Dodavanje novog jezika</h3>
                        <div className='adding-section'>
                            <h3>Dodaj novu jezik</h3>
                            <form onSubmit={handleAddLanguage}>
                                <input type="text" placeholder="jezik" value={language} onChange={(e) => setLanguage(e.target.value)}/>
                                <button type="submit">Dodaj jezik</button>
                            </form>
                        </div>
                    </div>
                    <div className='remove-words adding-part'>
                        <h3>Brisanje riječi</h3>
                        <div className='adding-section'>
                            <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
                                <option value="">Jezik</option>
                                    {languages.map((lang) => (
                                        <option key={lang.langid} value={lang.langid}>{lang.langname}</option>
                                    ))}
                            </select>
                            <ul>
                                {allWordList.filter(wordItem => wordItem.langid === Number(languageFilter)).map((wordItem) => (
                                    <li key={wordItem.wordid}>
                                        <p>{wordItem.word} - {wordItem.translation}</p>
                                        <button onClick={()=> deleteWord(wordItem.wordid)}>X</button>
                                    </li>
                                ))}
                            </ul>

                        </div>

                    </div>
                </div>

                {
                    kadmin === "true" &&(

                <div className="admin-main-layout">
                    <div className="search">
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
                    <div className="user-containers">
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
                                <button  className="admin-remove-btn" onClick={() => handleRemoveAdmin(admin)}>X</button>
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>



                </div>
                    )
                }

            </div>
        </>
    );
}

export default HomePageAdmin;