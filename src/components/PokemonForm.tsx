import React, { useState, useEffect } from 'react';
import { Pokemon } from '../types';
import { pokemonAPI, PokemonListItem } from '../services/pokemonAPI';

interface PokemonFormProps {
  onSubmit: (pokemon: Omit<Pokemon, 'id' | 'evs' | 'totalEVs'>) => void;
  onClose: () => void;
}

const PokemonForm: React.FC<PokemonFormProps> = ({ onSubmit, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonListItem[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setLoading(true);
        const list = await pokemonAPI.getAllPokemon();
        setPokemonList(list);
        setFilteredPokemon(list);
        setError(null);
      } catch (err) {
        setError('Failed to load Pokemon list');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    const filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [searchTerm, pokemonList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPokemon) {
      onSubmit({ name: selectedPokemon.name });
      setSelectedPokemon(null);
      setSearchTerm('');
      onClose();
    }
  };

  const handlePokemonSelect = (pokemon: PokemonListItem) => {
    setSelectedPokemon(pokemon);
    setSearchTerm(pokemon.name);
  };

  const formatPokemonName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="pokemon-form-overlay">
      <div className="pokemon-form">
        <h2>Select Pokemon</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pokemon-search">Search Pokemon:</label>
            <input
              id="pokemon-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Start typing to search..."
              autoComplete="off"
            />
          </div>

          {loading && (
            <div className="loading-state">
              <p>Loading Pokemon list...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="pokemon-list-container">
              {filteredPokemon.length === 0 ? (
                <p className="no-results">No Pokemon found</p>
              ) : (
                <div className="pokemon-list">
                  {filteredPokemon.slice(0, 50).map((pokemon) => (
                    <button
                      key={pokemon.name}
                      type="button"
                      onClick={() => handlePokemonSelect(pokemon)}
                      className={`pokemon-option ${selectedPokemon?.name === pokemon.name ? 'selected' : ''}`}
                    >
                      {formatPokemonName(pokemon.name)}
                    </button>
                  ))}
                </div>
              )}
              {filteredPokemon.length > 50 && (
                <p className="more-results">Showing first 50 results</p>
              )}
            </div>
          )}

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!selectedPokemon}
            >
              Add Pokemon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PokemonForm;
