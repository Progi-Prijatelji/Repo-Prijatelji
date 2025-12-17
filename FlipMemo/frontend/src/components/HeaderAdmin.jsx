import React, { useState } from 'react';
import '../css/header.css'
import logo from '../assets/FlipMemo__Logo.png';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const HeaderAdmin = () => {

    const [language, setLanguage] = useState('engleski')

    return(
        

        <header>
            <Link to="/homeAdmin" 
                className="page-logo"><img 
                src={logo} alt="Flip Memo Logo" 
                className="page-logo" /></Link>
            <h1>FlipMemo</h1>
            <div className="setting">

                <Link to="/homeAdmin/settings">
                    <Settings className="setting-icon"
                                color="black"
                                size="30"/>
                </Link>
            </div>
        </header>
        
    )
}


export default HeaderAdmin;