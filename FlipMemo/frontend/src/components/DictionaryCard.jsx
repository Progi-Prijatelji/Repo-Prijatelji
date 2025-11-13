import React from 'react';

const DictionaryCard = ({ name, description }) => {
  return (
    <div className="dictionary-card">
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
};

export default DictionaryCard;
