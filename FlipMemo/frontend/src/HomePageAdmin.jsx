import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './assets/FlipMemo__Logo.png'
import Header from './components/Header.jsx';
import './css/settingsUser.css'
function HomePageAdmin() {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const handleSearch = async(e) => {
        e.preventDefault();
        if (!searchQuery) {
            alert("Unesite pojam za pretraživanje.");
            return;
        }
        try {
            const results = await fetch(`https://fmimage.onrender.com/adminsearch}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const data = await results.json();

        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i]===searchQuery){
                setSearchResults(prevResults => [...prevResults, data[i]]);     
            }
        }
        
    }
    return(
        <>
        <Header />
        <div>
            <form action="" onSubmit={handleSearch}>
                <input 
                type="text" 
                id="searchBar"
                name='searchBar'
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
                />
                <button type='submit'></button>
            </form>
            <div>
                <ul>
                    {searchResults.map((result, index) => (
                        <li key={index}>{result}</li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    );
}

export default HomePageAdmin;