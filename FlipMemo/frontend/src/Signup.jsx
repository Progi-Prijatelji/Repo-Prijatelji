import { useState, useEffect } from 'react'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("https://fmimage.onrender.com/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
      const data = await response.json();
  
      if(data.success){
        alert("Uspješna registracija!");
          window.location.href = "/home";
        } else {
          alert("Neuspješna registracija!");
        }
      } catch (error) {
      console.error("Greška:", error);
      alert("Greška u povezivanju s poslužiteljem.");
    }

  }

  useEffect(() => { 
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    const url = 'https://thefluentme.p.rapidapi.com/language';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '75a57d3999msh9fcebafe9c752d2p157bc0jsn2594fcfd6b2b',
        'x-rapidapi-host': 'thefluentme.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
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