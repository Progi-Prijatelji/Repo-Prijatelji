import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import './css/homePage.css'

function HomePageUser() {
    return (
        <>
            <Header />
            <div className='contain'>
                <h1>
                    Dobro došli!
                </h1>
            </div>
        </>
    )
}

export default HomePageUser;