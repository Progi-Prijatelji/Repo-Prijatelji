import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
 

  return (
    <div className='container'>
      <div className='title part'>
        <h1>Dobro došli u aplikaciju Flip Memo!!!!!</h1>
      </div>
      <div className='login part'>
        <form action="/action_page.php">
          <label htmlFor="mail">email:</label>
          <input type="text" id="mail" name="mail" />
          <label htmlFor="password">lozinka:</label>
          <input type="text" id="password" name="password"  />
          <input type="submit" value="Submit" className='button' />
        </form> 
        <p>Nemaš račun?</p>
        <button className='button'>registriraj se</button>
      </div>
    </div>
  )
}

export default App;
