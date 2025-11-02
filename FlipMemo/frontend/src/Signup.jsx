import React from 'react'
import { useState } from 'react'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
  }

  return (
    <>
    <div className='container'>

        <div className='login part'>
          <form action="" onSubmit={handleSubmit} className='signup-form'>
            <h2>Registriraj se!</h2>
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
        </div>
    </div>
    </>
  )
}

export default Signup