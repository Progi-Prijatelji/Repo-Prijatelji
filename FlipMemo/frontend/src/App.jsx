import React from 'react'
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import HomePageUser from './HomePageUser.jsx';
import UserSettings from './UserSettings.jsx';
import HomePageAdmin from './HomePageAdmin.jsx';
import AdminSettings from './AdminSettings.jsx';
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import LearnPage from './LearnPage.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePageUser/>}/>
          <Route path="/home/settings" element={<UserSettings/>}/> 
        </Route>
        <Route path="/" element={<HomePageUser/>}/>
        <Route path="/signup" element={<Signup/>}/>

        <Route element={<AdminProtectedRoute />}>
          <Route path="/homeAdmin" element={<HomePageAdmin/>}/>  
          <Route path="/homeAdmin/settings" element={<AdminSettings/>}/>  
        </Route>


        <Route path="/learn/:dictId/:mode" element={<LearnPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App