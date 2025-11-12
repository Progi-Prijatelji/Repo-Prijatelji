import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './assets/FlipMemo__Logo.png'

function UserSettings() {
    handlePasswordChange = async(e) => {
        e.preventDefault()
        try{
            const response = await fetch("http://localhost:8080/changepass", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
        });
        const data = await response.json();
        if(data.success){
            alert("Lozinka uspješno promijenjena!");
            window.location.href = "/home";
        } else {
            alert("Došlo je do greške pri promjeni lozinke.");
        }   
    }catch (error) {
        console.error("Greška:", error);
        alert("Greška u povezivanju s poslužiteljem.");
    }
}


    return (
        <>
            <button>Obriši račun</button>
            <button>Promjeni lozinku</button>
            <form action="" >
                <input 
                    type="password" 
                    id="current-password"   
                    name="current-password"
                    placeholder="Trenutna lozinka" required/>
                <input
                    type="password"
                    id="new-password"
                    name="new-password"
                    placeholder="Nova lozinka" required/>
                <input
                    type="password"
                    id="confirm-new-password"
                    name="confirm-new-password"
                    placeholder="Potvrdi novu lozinku" required/>
                <button type="submit">Spremi promjene</button>

            </form>
        </>
    )
}

export default UserSettings;