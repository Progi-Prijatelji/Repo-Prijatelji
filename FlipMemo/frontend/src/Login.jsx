import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './css/login.css';
import logo from './assets/FlipMemo__Logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://fmimage.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const data = await response.json();

      if (data.success) {
        alert("Uspješna prijava!");
        localStorage.setItem("jwt", data.token);
        window.location.href = "/home";
      } else {
        alert("Email i lozinka se ne podudaraju!");
      }
    } catch (error) {
      console.error("Greška:", error);
      alert("Greška u povezivanju s poslužiteljem.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      const response = await fetch("https://fmimage.onrender.com/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: token }),
        credentials: "include"
      });

      const data = await response.json();

      if (data.success) {
          localStorage.setItem("jwt", data.token); 
          if (!data.reg) {
            alert(data.message || "Uspješna Google prijava!");
            window.location.href = "/home";
          } else {
            alert(data.message || "Uspješna Google registracija!");
            window.location.href = "/";
          }
        }else {
        alert("Google prijava nije uspjela!");
      }
    } catch (err) {
      console.error("Greška:", err);
      alert("Greška prilikom prijave putem Google-a.");
    }
  };

  return (
    <>
      <img src={logo} alt="Flip Memo Logo" className="page-logo" />
      <div className='container'>
        <div className='title part'>
          <h1>Flip Memo</h1>
        </div>
          <form onSubmit={handleLogin} className='login-form'>
            <label id="welcome-label">Dobrodošli natrag</label>
            <label id="login-label">Unesite svoje podatke</label>

            <div className="login-inputs">
              <input
                type="text"
                id="mail"
                name="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" required
              />
              <label htmlFor="mail">Email:</label>
            </div>

            <div className="login-inputs">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lozinka" required
              />
              <label htmlFor="password">Lozinka:</label>
            </div>

            <input type="submit" value="Prijavi se" className='button' />
          </form>

          <div className="noAcc">
            <div className='login part'>
          <div className="google-login">
            <h2>Prijavi se ili registriraj putem Googlea</h2>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google prijava nije uspjela")}
            />
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
