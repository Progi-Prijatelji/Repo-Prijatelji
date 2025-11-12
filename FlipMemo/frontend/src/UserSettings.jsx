import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './assets/FlipMemo__Logo.png'

function UserSettings() {
    return (
        <>
            <button>Obriši račun</button>
            <button>Promjeni lozinku</button>
        </>
    )
}

export default UserSettings;