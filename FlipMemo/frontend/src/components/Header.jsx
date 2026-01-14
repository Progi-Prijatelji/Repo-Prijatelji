import React, { useState } from 'react';
import '../css/header.css'
import logo from '../assets/FlipMemo__Logo.png';
import { Link } from 'react-router-dom';
import { Settings, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [language, setLanguage] = useState('engleski')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        alert("Odjavljeni ste!");
        localStorage.removeItem("token");
        navigate("/");
    }

    return(
        

        <header>
            <Link to="/home" 
                className="page-logo"><img 
                src={logo} alt="Flip Memo Logo" 
                className="page-logo" /></Link>
            <h1>FlipMemo</h1>
            <div className="dropdown">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="dropdown-button">
                    <Menu size={28}/>
                </button>

                <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                    <Link 
                        to='/home/settings'
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}>
                        <Settings size={16} style={{marginRight: '8px'}}/>
                        <p>Postavke</p>
                    </Link>
                    <button 
                        className="dropdown-item"
                        onClick={handleLogout}>
                        <LogOut size={16} style={{marginRight: '8px'}}/>
                        <p>Odjava</p>
                    </button>
                </div>

            </div>
      </header>
        
    )
}
export default Header;