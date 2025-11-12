import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from '../assets/FlipMemo__Logo.png'
import Header from '../components/Header.jsx';

function UserSettings() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const handleDeleteAccount = async() => {
        try{
            const res = await fetch("http://localhost:8080/current-user");
            const userData = await res.json(); 
            if (!userData.email) { 
                alert("Niste prijavljeni!"); 
                return; 
            }
            const response = await fetch("http://localhost:8080/deleteacc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email:userData.email, currentPassword }),
            });
            const data = await response.json();
            if(data.success){
                alert("Račun uspješno obrisan!");
                window.location.href = "/login";
            }
        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    }

    const handlePasswordChange = async(e) => {
        e.preventDefault()
        try{
            const res = await fetch("http://localhost:8080/current-user");
            const userData = await res.json(); 
            if (!userData.email) { 
                alert("Niste prijavljeni!"); 
                return; 
            }
            const response = await fetch("http://localhost:8080/changepass", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email:userData.email, currentPassword, newPassword, confirmNewPassword }),
        });
        const data = await response.json();
        if(data.success){
            alert("Lozinka uspješno promijenjena!");
            window.location.href = "/home";
        } else {
            alert("Došlo je do greške pri promjeni lozinke.");
            setConfirmNewPassword('');
            setCurrentPassword('');
            setNewPassword('');
        }   
    }catch (error) {
        console.error("Greška:", error);
        alert("Greška u povezivanju s poslužiteljem.");
    }
}


    return (
        <>
            <Header />
            <div className='container user-settings'>
                <button>Obriši račun</button>
                <div className='delete'>
                    <form action="" onSubmit={handleDeleteAccount}>
                        <input 
                            type="password"
                            id="current-password"
                            name="current-password"
                            value={currentPassword}
                            onChange={(e)=>setCurrentPassword(e.target.value)}
                            placeholder="Trenutna lozinka" required
                            />
                            <button type='submit'>Izbriši račun</button>
                    </form>
                </div>
                <button>Promjeni lozinku</button>
                <div className='change'>
                    <form action="" onSubmit={handlePasswordChange}>
                        <input 
                            type="password" 
                            id="current-password"   
                            name="current-password"
                            value={currentPassword}
                            onChange={(e)=>setCurrentPassword(e.target.value)}
                            placeholder="Trenutna lozinka" required/>
                        <input
                            type="password"
                            id="new-password"
                            name="new-password"
                            value={newPassword}
                            onChange={(e)=>setNewPassword(e.target.value)}
                            placeholder="Nova lozinka" required/>
                        <input
                            type="password"
                            id="confirm-new-password"
                            name="confirm-new-password"
                            value={confirmNewPassword}
                            onChange={(e)=>setConfirmNewPassword(e.target.value)}
                            placeholder="Potvrdi novu lozinku" required/>
                        <button type="submit">Spremi promjene</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UserSettings;