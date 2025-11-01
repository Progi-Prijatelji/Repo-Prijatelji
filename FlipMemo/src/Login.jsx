import { useState } from 'react'
import './login.css'
const loginFunc =require('./javascript/login.js') 
import logo from './assets/FlipMemo__Logo.png'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <img src={logo} alt="Flip Memo Logo" className="page-logo" />
      <div className='container'>
        
        <div className='title part'>
          <h1>Flip Memo</h1>
        </div>
        <div className='login part'>
          <form action="" onSubmit={loginFunc.LoginAttempt(email, password)} className='login-form'>
            <label id = "welcome-label">Dobrodosli</label>
            <label id = "login-label">Unesite vase podatke</label>
            <div className="login-inputs">
              
              <input 
                type="text" 
                id="mail" 
                name="mail"
                value = {email} 
                onChange = {(e) => setEmail(e.target.value)}
                placeholder="Email" required/>
              
              <label htmlFor="mail">Email: </label>

            </div>
            <div className="login-inputs">
              <input 
                type="password" 
                id="password" 
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lozinka" required/>

              <label htmlFor="password">Lozinka: </label>
            </div>
            <a href="#">Zaboravili ste lozinku?</a>
            <input type="submit" value="Prijavi se" className='button' />
          </form> 
          <div className="noAcc">
            <p>Nemaš račun?</p>
            <button className='button'>Registriraj se</button>

          </div>
        </div>
      </div>
      <BrowserRouter>
            <Routes>
              <Route path="/home" element={<Login/>}/>
              <Route path="/singup" element = {<SingUp/>}></Route>
            </Routes>
          </BrowserRouter>
    </>
  )
}

export default Login;
