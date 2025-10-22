import { useState } from 'react'
import './App.css'
import logo from './assets/FlipMemo__Logo.png'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
  }

  return (
    <>
      <img src={logo} alt="Flip Memo Logo" className="page-logo" />
      <div className='container'>
        
        <div className='title part'>
          <h1>Flip Memo</h1>
        </div>
        <div className='login part'>
          <form action="" onSubmit={handleSubmit} className='login-form'>
            <label id = "welcome-label">Dobrodosli</label>
            <label id = "login-label">Prijava</label>
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
            <input type="submit" value="Prijavi se" className='button' />
          </form> 
          <div className="noAcc">
            <p>Nemaš račun?</p>
            <button className='button'>Registriraj se</button>

          </div>
        </div>
      </div>
    </>
  )
}

export default App;
