import { gameState } from './gameState.js';

export function renderDraftOptions(options) {

  const container = document.getElementById('draft-options');
  container.innerHTML = '';

  options.forEach(pokemon => {

    const card = document.createElement('div');
    card.className = 'pokemon-card';

    card.innerHTML = `<h3>${pokemon.name}</h3>`;

    card.onclick = () => {
      import('./draftLogic.js').then(module => {
        module.draftPokemon(pokemon);
      });
    };

    container.appendChild(card);
  });
}

export function renderDraftedPokemon() {

  const container = document.getElementById('drafted-pokemon');
  container.innerHTML = '';

  gameState.drafted.forEach(pokemon => {

    const card = document.createElement('div');
    card.className = 'drafted-card';
    card.draggable = true;
    card.textContent = pokemon.name;
    card.dataset.name = pokemon.name;

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', pokemon.name);
    });

    container.appendChild(card);
  });

  initializeDropZones();
}

function initializeDropZones() {

  const slots = document.querySelectorAll('.stat-slot');

  slots.forEach(slot => {

    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();

      const pokemonName = e.dataTransfer.getData('text/plain');
      const stat = slot.dataset.stat;

      assignPokemonToStat(pokemonName, stat);
    });
  });
}

function assignPokemonToStat(pokemonName, stat) {

    let currentStat = null;

    for (const s in gameState.statAssignments) {
        if (gameState.statAssignments[s] === pokemonName) {
            currentStat = s;
            break;
        }
    }

    const occupyingPokemon = gameState.statAssignments[stat];

    // If target slot occupied, we swap
    if (occupyingPokemon) {

        if (currentStat) {
            gameState.statAssignments[currentStat] = occupyingPokemon;
        }

    } else {

        if (currentStat) {
            gameState.statAssignments[currentStat] = null;
        }

    }

    gameState.statAssignments[stat] = pokemonName;

    renderStatAssignments();
}


function renderStatAssignments() {

  const slots = document.querySelectorAll('.stat-slot');

  slots.forEach(slot => {
    const stat = slot.dataset.stat;
    const assigned = gameState.statAssignments[stat];

    slot.textContent = assigned ? assigned.toUpperCase() : stat.toUpperCase();

    if (assigned) {
      slot.classList.add('occupied');
    } else {
      slot.classList.remove('occupied');
    }
  });
}
