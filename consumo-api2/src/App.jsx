
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';





const App = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemonData, setFilteredPokemonData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
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

  const [speciesFilter, setSpeciesFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [abilityFilter, setAbilityFilter] = useState('');

  const filterBySpecies = () => {
    const filteredData = pokemonData.filter((pokemon) => pokemon.species.name === speciesFilter);
    setFilteredPokemonData(filteredData);
  };

  const filterByType = () => {
    const filteredData = pokemonData.filter((pokemon) => pokemon.types.some((t) => t.type.name === typeFilter));
    setFilteredPokemonData(filteredData);
  };

  const filterByAbility = () => {
    const filteredData = pokemonData.filter((pokemon) => pokemon.abilities.some((a) => a.ability.name === abilityFilter));
    setFilteredPokemonData(filteredData);
  };

  const resetFilters = () => {
    setFilteredPokemonData(pokemonData);
  };

  return (
    <div className="pokemon-container">
      <div className="filter-buttons">
        <input
          type="text"
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          placeholder="Enter species"
        />
        <button onClick={filterBySpecies}>Filter by Species</button>

        <input
          type="text"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="Enter type"
        />
        <button onClick={filterByType}>Filter by Type</button>

        <input
          type="text"
          value={abilityFilter}
          onChange={(e) => setAbilityFilter(e.target.value)}
          placeholder="Enter ability"
        />
        <button onClick={filterByAbility}>Filter by Ability</button>

        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      <div className="pokemon-cards-container">
        {filteredPokemonData.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            name={pokemon.name}
            imageUrl={pokemon.sprites.front_default}
            species={pokemon.species.name}
            types={pokemon.types.map((type) => type.type.name)}
            abilities={pokemon.abilities.map((ability) => ability.ability.name)}
          />
        ))}
      </div>
    </div>
  );
};

const PokemonCard = ({ name, imageUrl, species, types, abilities }) => {
  return (
    <div className="pokemon-card">
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p>Species: {species}</p>
      <p>Types: {types.join(', ')}</p>
      <p>Abilities: {abilities.join(', ')}</p>
    </div>
  );
};

export default App;






