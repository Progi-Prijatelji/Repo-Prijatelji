import React from 'react';
import '../css/header.css'
import logo from '../assets/FlipMemo__Logo.png';
import icon from '../assets/setting.png';

const Header = () => {
    return(
        <header>
            <img src={logo} alt="Flip Memo Logo" className="page-logo" />
            <h1>FlipMemo</h1>
            <a href="/home/settings"><img src={icon} alt="Flip Memo Logo" className='setting'/></a>
        </header>
    )
}


export default Header;