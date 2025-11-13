import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './assets/FlipMemo__Logo.png'
import Header from './components/Header.jsx';
import './css/settingsUser.css'

function UserSettings() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState('flex')

    const handleDeleteAccount = async(e) => {
        e.preventDefault();
        try{
            const token = localStorage.getItem("jwt");
            if (!token) {
                alert("Niste prijavljeni!"); 
                return;
            }
            console.log("JWT token:", token);

            const response = await fetch("https://fmimage.onrender.com/deleteacc", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token 
                },
                body: JSON.stringify({ password }),
                credentials: "include"
            });

            const data = await response.json();
            if(data.success){
                alert("Račun uspješno obrisan!");
                window.location.href = "/login";
            }
            else{
                alert("Došlo je do greške pri brisanju računa.");
                
            }
        }catch (error) {
            console.error("Greška:", error);
            alert("Greška u povezivanju s poslužiteljem.");
        }
    }

    const handlePasswordChange = async(e) => {
        e.preventDefault()
        try{
            const token = localStorage.getItem("jwt");
            if (!token) {
                alert("Niste prijavljeni!"); 
                return;
            }

            const response = await fetch("https://fmimage.onrender.com/changepass", {
                method: "POST",
                headers: { "Content-Type": "application/json" , "Authorization": "Bearer " + token},
                body: JSON.stringify({ password: currentPassword,newpass1: newPassword, newpass2: confirmNewPassword }),
                credentials: "include"
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


    const display = (action) =>{
        if (action === 'delete') {
            const deleteSection = document.querySelector('.delete');

            if(deleteSection.style.display === 'flex'){
                deleteSection.style.display = 'none';
                return;
            }else{
                deleteSection.style.display = 'flex';
            }
            const changeSection = document.querySelector('.change');
            changeSection.style.display = 'none';
        } else if (action === 'change') {
            const changeSection = document.querySelector('.change');
            if(changeSection.style.display === 'flex'){
                changeSection.style.display = 'none';
                return;
            }else{
                changeSection.style.display = 'flex';
            }
            const deleteSection = document.querySelector('.delete');
            deleteSection.style.display = 'none';
        }
    }



    return (
        <>
            <Header />
            <div className='container user-settings'>
                <div className='user-setings-part'>
                    <button className='button' onClick={()=>display("delete")}>Obriši račun</button>
                    <div className='delete'>
                        <form action="" onSubmit={handleDeleteAccount}>
                            <input 
                                type="password"
                                id="current-password"
                                name="current-password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                placeholder="Trenutna lozinka" required
                                />
                                <button type='submit' className='button'>Izbriši račun</button>
                        </form>
                    </div>
                </div>
                <div className='user-setings-part'>
                    <button className='button' onClick={()=>display("change")}>Promjeni lozinku</button>
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
                            <button type="submit" className='button'>Spremi promjene</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserSettings;