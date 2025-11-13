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
            const results = await fetch(`https://fmimage.onrender.com/homeAdmin/sendUserList`, {
                method: "GET",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
                 },
                credentials: "include"
            });
            const data = await results.json();
            const filteredResults = data.users.filter(
                (username) => username.toLowerCase() === searchQuery.toLowerCase()
            );
            setSearchResults(filteredResults);

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
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
                },
                body: JSON.stringify({email: user}),
                credentials: "include"  
            });
            const data = await results.json();

        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
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
                <button type='submit'>traži</button>
            </form>
            <div>
                <ul>
                    {searchResults.map((result, index) => (
                        <li key={index}>
                            <p>{result}</p>
                            <button onClick={()=>handleAddAdmin(result)}>+</button>
                        </li>
                        
                    ))}
                </ul>
            </div>
        </div>
        </>
    );
}

export default HomePageAdmin;