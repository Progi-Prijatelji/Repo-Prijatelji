import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import ForeighToNative from './components/ForeignToNative.jsx';
import NativeToForeign from './components/NativeToForeign.jsx';
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
        <p>Riječnik: {dictId}</p>

        {mode === 'foreign-to-native' && (
          <ForeighToNative />
        )}

        {mode === 'native-to-foreign' && (
          <NativeToForeign />
        )}
      </div>
    </>
  );
}

export default LearnPage;
