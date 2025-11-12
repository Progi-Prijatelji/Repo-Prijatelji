import React from 'react'
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import HomePageUser from './pages/HomePageUser.jsx';
import UserSettings from './pages/UserSettings.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/home" element={<HomePageUser/>}/>
        <Route path="/home/settings" element={<UserSettings/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App