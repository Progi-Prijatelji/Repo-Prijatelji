import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import icon from '../assets/setting.png'
import Header from '../components/Header.jsx';
import '../css/homePage.css'

function HomePageUser() {
    return (
        <>
            <Header />
            <h1>
                Dobro došli!
            </h1>
            <a href="/home/settings"><img src={icon} alt="Flip Memo Logo" /></a>
        </>
    )
}

export default HomePageUser;