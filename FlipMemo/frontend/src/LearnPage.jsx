import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import './css/LearnPage.css';




function LearnPage() {
  const { dictId, mode } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="learn-page">
        <button onClick={() => navigate(-1)}>← Nazad</button>
        <h1>Učenje - Mod: {mode}</h1>
        <p>Riječnik ID: {dictId}</p>


{/*--------------------------------Strani u materinji--------------------------------------------- */}


        {mode === 'foreign-to-native' && (
          <div>
            
          </div>
        )}


{/*---------------------------------Materinji u strani-------------------------------------------- */}
        
        {mode === 'native-to-foreign' && (
          <div>
            <h2>Mod: Materinji jezik → Strani jezik</h2>
            <p>Ovdje ide sadržaj za učenje iz materinjeg jezika u strani jezik.</p>
          </div>
        )




        }


{/*-----------------------------------------Pisanje---------------------------------------------- */}

      </div>
    </>
  );
}

export default LearnPage;
