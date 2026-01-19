import React from 'react';

const DictionaryCard = ({ name, description }) => {
  return (
    <div className="dictionary-card">
      <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
      <p>{description.charAt(0).toUpperCase() + description.slice(1)}</p>
    </div>
  );
};

export default DictionaryCard;
