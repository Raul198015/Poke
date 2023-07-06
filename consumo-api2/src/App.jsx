import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemonData, setFilteredPokemonData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10000npm');
        const results = response.data.results;
        const pokemonPromises = results.map(async (pokemon) => {
          const response = await axios.get(pokemon.url);
          return response.data;
        });
        const data = await Promise.all(pokemonPromises);
        setPokemonData(data);
        setFilteredPokemonData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filterByType = () => {
    const filteredData = pokemonData.filter((pokemon) => {
      const matchesType = pokemon.types.some((t) => t.type.name === typeFilter);
      const matchesName = pokemon.name.toLowerCase().includes(nameFilter.toLowerCase());
      return matchesType && matchesName;
    });
    setFilteredPokemonData(filteredData);
    setVisibleCards(20);
  };
  const showMoreCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 20);
  };

  const resetFilters = () => {
    setFilteredPokemonData(pokemonData);
    setTypeFilter('');
    setVisibleCards(20);
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsPopupOpen(true);
  };

  const PokemonCard = ({ name, imageUrl, species, types, abilities }) => {
    return (
      <div className="pokemon-card">
        <img src={imageUrl} alt={name} onClick={() => handlePokemonClick({ name, imageUrl, species, types, abilities })} />
        <h3>{name}</h3>
        <p>Species: {species}</p>
        <p>Types: {types.join(', ')}</p>
        <p>Abilities: {abilities.join(', ')}</p>
      </div>
    );
  };

  const PokemonPopup = ({ pokemon, onClose }) => {
    return (
      <div className="pokemon-popup">
        <div className="popup-content">
          <img src={pokemon.imageUrl} alt={pokemon.name} />
          <h3>{pokemon.name}</h3>
          <p>Species: {pokemon.species}</p>
          <p>Types: {pokemon.types.join(', ')}</p>
          <p>Abilities: {pokemon.abilities.join(', ')}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className="pokemon-container" style={{ backgroundColor: 'black' }}>
      <div className="filter-buttons">
        <input
          type="text"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="Enter type"
        />
        
        <button onClick={filterByType}>Filter</button>
        
      </div>
      

      <div className="pokemon-cards-container">
        {filteredPokemonData.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            name={pokemon.name

}
            imageUrl={pokemon.sprites.front_default}
            species={pokemon.species.name}
            types={pokemon.types.map((type) => type.type.name)}
            abilities={pokemon.abilities.map((ability) => ability.ability.name)}
          />
        ))}
      </div>

      {isPopupOpen && selectedPokemon && (
        <PokemonPopup pokemon={selectedPokemon} onClose={() => setIsPopupOpen(false)} />
      )}
   </div>
  );
};



export default App;