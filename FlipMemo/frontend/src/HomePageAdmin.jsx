import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './assets/FlipMemo__Logo.png'
import HeaderAdmin from './components/HeaderAdmin.jsx';
import './css/homeAdmin.css'
function HomePageAdmin() {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [adminUser, setAdminUser] = useState([]);
    const kadmin = localStorage.getItem("isKadmin");

    const [dictName, setDictName] = useState("");
    const [dictDesc, setDictDesc] = useState("");
    const [langID, setLangID] = useState("");
    const [dictionaries, setDictionaries] = useState([]);

    const [inputs, setInputs] = useState({});
    const [word, setWord] = useState("");
    const [wordTrans, setWordTrans] = useState("");
    const [wordLangID, setWordLangID] = useState("");

    const [languages, setLanguages] = useState([]);

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
                body: JSON.stringify({word: word,  langname: wordLangID, translation: wordTrans})
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Neuspješno dodavanje riječi.");
                return;
            }
            
        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }

    }

    const handleAddWordToDictionary = async (e) => {
        e.preventDefault();
        /*try{
            const results = await fetch("https://fmimage.onrender.com/homeAdmin/addWordToDictionary", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}` 
             },
                body: JSON.stringify({word: word, wordTrans: wordTrans, wordLangID: wordLangID})
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Neuspješno dodavanje riječi.");
                return;
            }
            setWord("");
            setWordTrans("");
            setWordLangID("");
        }catch(error){
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }*/
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
                body: JSON.stringify({name: dictName, langname: langID, desc: dictDesc})
            });
            const data = await results.json();
            if (!data.success) {
                alert(data.message || "Neuspješno dodavanje rječnika.");
                return;
            }
            await fetchDictionaries();
            setDictName("");
            //setLangID("");
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
                <div className='add-dictionary'>
                    <h2>Dodavanje rječnika</h2>
                    <div className='adding-section'>
                        <h3>Dodaj novi rječnik</h3>
                        <form onSubmit={handleAddDictionary}>
                            <input type="text" placeholder="Naziv rječnika" value={dictName} onChange={(e) => setDictName(e.target.value)}/>
                            <select value={langID} onChange={(e) => setLangID(e.target.value)}>
                                <option value="">Jezik</option>
                                {languages.map((lang) => (
                                    <option key={lang.langname} value={lang.langname}>{lang.langname}</option>
                                ))}
                            </select>
                            <textarea placeholder="Opis rječnika" value={dictDesc} onChange={(e) => setDictDesc(e.target.value)}/>
                            <button type="submit">Dodaj rječnik</button>
                        </form>
                    </div>
                    <div className='old-dictionary'>
                        <h2>Postojeći rječnici</h2>
                        <ul>
                            {dictionaries.map((dict) => (
                            <li key={dict.dictname}>
                                <p>{dict.dictname}</p>
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='add-word'>
                    <h2>Dodavanje riječi</h2>
                    <div className='adding-section'>
                        <h3>Dodaj novu riječ</h3>
                        <form onSubmit={handleAddWord}>
                            <input type="text" placeholder="Riječ" value={word} onChange={(e) => setWord(e.target.value)}/>
                            <select value={wordLangID} onChange={(e) => setWordLangID(e.target.value)}>
                                <option value="">Jezik</option>
                                {languages.map((lang) => (
                                    <option key={lang.langname} value={lang.langname}>{lang.langname}</option>
                                ))}
                            </select>
                            <input type="text" placeholder="Prijevod riječi" value={wordTrans} onChange={(e) => setWordTrans(e.target.value)}/>
                            <button type="submit">Dodaj riječ</button>
                        </form>
                        <form onSubmit={handleAddWordToDictionary}>
                            <label>Odaberi rječnik u koji želiš dodati riječ:</label>
                            {dictionaries.map((dict) => (
                                <input type="checkbox" value={dict.dictName}/>
                            ))}
                            <button type="submit">Dodaj riječ u rječnik</button>
                        </form>
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