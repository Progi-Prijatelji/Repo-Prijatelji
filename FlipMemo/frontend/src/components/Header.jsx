import React from 'react';
import '../css/header.css'
import logo from '../assets/FlipMemo__Logo.png';
import icon from '../assets/settings.png';
import home from '../assets/home.png';

const Header = () => {
    return(
        <header>
            <img src={logo} alt="Flip Memo Logo" className="page-logo" />
            <h1>FlipMemo</h1>
            <div>
                <a href="/home"><img src={home} alt="home" className='home'/></a>
                <a href="/home/settings"><img src={icon} alt="settings" className='setting'/></a>
            </div>
        </header>
    )
}


export default Header;