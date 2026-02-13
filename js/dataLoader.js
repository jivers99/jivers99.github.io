import { buildConfigUI } from './configUI.js';
import { startGameWithConfig } from './gameState.js';

fetch('./data/pokemon.json')
  .then(res => res.json())
  .then(data => {

      window.fullPokemonData = data;

      buildConfigUI();

      document
        .getElementById("start-game-btn")
        .addEventListener("click", () => {
            startGameWithConfig(data);
        });

  });