import { initializeGame } from './gameState.js';

fetch('../data/pokemon.json')
  .then(res => res.json())
  .then(data => {
      initializeGame(data);
  })
  .catch(err => console.error("Failed to load Pokémon data:", err));
