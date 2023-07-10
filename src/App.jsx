import React, { useState, useEffect } from 'react';
import './App.css';
import Modal from 'react-modal';

function App() {

  const [characters, setCharacters] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=200")
      .then(response => response.json())
      .then(data => {
        const promises = data.results.map(result =>
          fetch(result.url).then(response => response.json())
        );
        Promise.all(promises).then(pokemonData => {
          setCharacters(pokemonData);
        });
      })
      .catch(error => console.log(error));
  }, []);

  const handleSpeciesChange = (event) => {
    setSelectedSpecies(event.target.value.toLowerCase());
  };
  

  
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleNumberChange = (event) => {
    setSelectedNumber(event.target.value);
  };

  const handleCardClick = (character) => {
    setSelectedCharacter(character);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  const filteredCharacters = characters.filter(character => {
    if (selectedSpecies && !character.name.startsWith(selectedSpecies)) {
      return false;
    }
    if (selectedType && !character.types.some(type => type.type.name === selectedType)) {
      return false;
    }
    if (selectedNumber && character.id !== parseInt(selectedNumber)) {
      return false;
    }
    return true;
  });

  return (
    <div className="container">
      <h1>Pokémon</h1>
      <div className="filter-container">
        <label htmlFor="species">Search by Name:</label>
        <input type="text" id="species" value={selectedSpecies} onChange={handleSpeciesChange} />
        <label htmlFor="type">Filter by Type:</label>
        <select id="type" value={selectedType} onChange={handleTypeChange}>
          <option value="">All</option>
          {characters.map(character => (
            character.types.map(type => (
              <option key={type.type.name} value={type.type.name}>{type.type.name}</option>
            ))
          ))}
        </select>
        <label htmlFor="number">Filter by Number:</label>
        <input type="text" id="number" value={selectedNumber} onChange={handleNumberChange} />
      </div>
      <div className="card-container">
        {filteredCharacters.map(character => (
          <div key={character.name} className="card" onClick={() => handleCardClick(character)}>
            <h2>{character.name}</h2>
            <img src={character.sprites.front_default} alt={character.name} />
            <p>Species: {character.species.name}</p>
            <p>Type: {character.types.map(type => type.type.name).join(", ")}</p>
            
            <p>Number: {character.id}</p>
            <p>Weight: {character.weight}</p>
            <p>Habilidades: {character.abilities.map(ability => ability.ability.name).join(", ")}</p>
            <p>Estadísticas: {character.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(", ")}</p>
            <p>Estadísticas combate: Ataque: {character.attack}, Defensa: {character.defense}, Velocidad: {character.speed}</p>
          </div>
        ))}
      </div>
      <Modal
         isOpen={selectedCharacter !== null}
         onRequestClose={handleCloseModal}
         contentLabel="Character Details"
         className="modal"
         overlayClassName="overlay"
       >
         {selectedCharacter && (
           <div>
             <h2>{selectedCharacter.name}</h2>
             <img src={selectedCharacter.sprites.front_default} alt={selectedCharacter.name} />
             <p>Type: {selectedCharacter.types.map(type => type.type.name).join(", ")}</p>
             <p>Species: {selectedCharacter.species.name}</p>
            
             <button className="close-button" onClick={handleCloseModal}>
               Close
             </button>
           </div>
         )}
      </Modal>
    </div>
  );
}

export default App;
