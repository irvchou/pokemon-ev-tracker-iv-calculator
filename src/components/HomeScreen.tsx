import React, { useState } from 'react';
import { Pokemon } from '../types';
import PokemonForm from './PokemonForm';
import EVCounter from './EVCounter';

const HomeScreen: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  const addPokemon = (pokemonData: { name: string }) => {
    const newPokemon: Pokemon = {
      id: Date.now().toString(),
      name: pokemonData.name,
      evs: {
        hp: 0,
        attack: 0,
        defense: 0,
        spAttack: 0,
        spDefense: 0,
        speed: 0,
      },
      totalEVs: 0,
    };
    setPokemons([...pokemons, newPokemon]);
  };

  const updatePokemon = (updatedPokemon: Pokemon) => {
    setPokemons(pokemons.map(p => p.id === updatedPokemon.id ? updatedPokemon : p));
  };

  const deletePokemon = (id: string) => {
    setPokemons(pokemons.filter(p => p.id !== id));
    if (selectedPokemon === id) {
      setSelectedPokemon(null);
    }
  };

  const selectedPokemonData = pokemons.find(p => p.id === selectedPokemon);

  return (
    <div className="home-screen">
      <header className="app-header">
        <h1>Pokemon EV Counter</h1>
        <button onClick={() => setShowForm(true)} className="add-pokemon-btn">
          + Add Pokemon
        </button>
      </header>

      {showForm && (
        <PokemonForm 
          onSubmit={addPokemon}
          onClose={() => setShowForm(false)}
        />
      )}

      <main className="main-content">
        {pokemons.length === 0 ? (
          <div className="empty-state">
            <h2>No Pokemon Yet!</h2>
            <p>Start by adding your first Pokemon to track EVs.</p>
          </div>
        ) : (
          <div className="pokemon-list">
            {pokemons.map(pokemon => (
              <button
                key={pokemon.id}
                onClick={() => setSelectedPokemon(pokemon.id)}
                className={`pokemon-card ${selectedPokemon === pokemon.id ? 'selected' : ''}`}
              >
                <h3>{pokemon.name}</h3>
                <div className="ev-summary">
                  <span>Total EVs: {pokemon.totalEVs}/510</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedPokemonData && (
          <div className="ev-counter-section">
            <EVCounter
              pokemon={selectedPokemonData}
              onUpdate={updatePokemon}
              onDelete={deletePokemon}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeScreen;
