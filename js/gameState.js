import { startDraft } from './draftLogic.js';

export let gameState = {};

export function initializeGame(pokemonData) {

  const filtered = pokemonData.filter(p =>
    p.fullyEvolved &&
    p.generation === 1
  );

  gameState.round = 1;
  gameState.drafted = [];
  gameState.remainingPool = [...filtered];

  startDraft();
}
