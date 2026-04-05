import React from 'react';
import { Pokemon, StatButton } from '../types';

interface EVCounterProps {
  pokemon: Pokemon;
  onUpdate: (pokemon: Pokemon) => void;
  onDelete: (id: string) => void;
}

const EVCounter: React.FC<EVCounterProps> = ({ pokemon, onUpdate, onDelete }) => {
  const maxEVs = 252;
  const maxTotalEVs = 510;

  const statButtons: StatButton[] = [
    { stat: 'hp', label: 'HP', color: '#ff6b6b' },
    { stat: 'attack', label: 'Attack', color: '#f06292' },
    { stat: 'defense', label: 'Defense', color: '#4fc3f7' },
    { stat: 'spAttack', label: 'Sp. Atk', color: '#ba68c8' },
    { stat: 'spDefense', label: 'Sp. Def', color: '#4db6ac' },
    { stat: 'speed', label: 'Speed', color: '#ffd54f' },
  ];

  const incrementEV = (stat: keyof Pokemon['evs']) => {
    if (pokemon.totalEVs >= maxTotalEVs) return;
    if (pokemon.evs[stat] >= maxEVs) return;

    const updatedPokemon = {
      ...pokemon,
      evs: {
        ...pokemon.evs,
        [stat]: pokemon.evs[stat] + 1,
      },
      totalEVs: pokemon.totalEVs + 1,
    };
    onUpdate(updatedPokemon);
  };

  const decrementEV = (stat: keyof Pokemon['evs']) => {
    if (pokemon.evs[stat] <= 0) return;

    const updatedPokemon = {
      ...pokemon,
      evs: {
        ...pokemon.evs,
        [stat]: pokemon.evs[stat] - 1,
      },
      totalEVs: pokemon.totalEVs - 1,
    };
    onUpdate(updatedPokemon);
  };

  const resetEVs = () => {
    const updatedPokemon = {
      ...pokemon,
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
    onUpdate(updatedPokemon);
  };

  return (
    <div className="ev-counter">
      <div className="pokemon-header">
        <h2>{pokemon.name}</h2>
        <button onClick={() => onDelete(pokemon.id)} className="delete-btn">
          Delete
        </button>
      </div>
      
      <div className="ev-summary">
        <div className="total-evs">
          Total EVs: {pokemon.totalEVs} / {maxTotalEVs}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(pokemon.totalEVs / maxTotalEVs) * 100}%` }}
          />
        </div>
      </div>

      <div className="stats-grid">
        {statButtons.map(({ stat, label, color }) => (
          <div key={stat} className="stat-card">
            <h3 style={{ color }}>{label}</h3>
            <div className="ev-controls">
              <button 
                onClick={() => decrementEV(stat)}
                disabled={pokemon.evs[stat] === 0}
                className="ev-btn decrement"
              >
                -
              </button>
              <span className="ev-value">{pokemon.evs[stat]}</span>
              <button 
                onClick={() => incrementEV(stat)}
                disabled={pokemon.evs[stat] >= maxEVs || pokemon.totalEVs >= maxTotalEVs}
                className="ev-btn increment"
              >
                +
              </button>
            </div>
            <div className="ev-bar">
              <div 
                className="ev-fill" 
                style={{ 
                  width: `${(pokemon.evs[stat] / maxEVs) * 100}%`,
                  backgroundColor: color 
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button onClick={resetEVs} className="reset-btn">
        Reset All EVs
      </button>
    </div>
  );
};

export default EVCounter;
