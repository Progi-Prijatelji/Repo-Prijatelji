import React from 'react'
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import SingUp from './SingUp.jsx'; 

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/singup" element = {<SingUp/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App