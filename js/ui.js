import { gameState } from './gameState.js';
import { getTier } from './tierUtils.js';


export function renderDraftOptions(options) {

  const container = document.getElementById('draft-options');
  container.innerHTML = '';

  options.forEach(pokemon => {

    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.draggable = true;
    card.dataset.name = pokemon.name;
    card.dataset.type = "draft-option";

    card.innerHTML = `
    <h3>${pokemon.name}</h3>
    <p>Tier: ${getTier(pokemon.bst)}</p>
    `;

    card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", pokemon.name);
    e.dataTransfer.setData("card-type", "draft-option");
    });


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

    if (assigned) {
      slot.innerHTML = `
        <div class="drafted-card" draggable="true" data-name="${assigned}">
        ${assigned}
        </div>
      `;
      slot.classList.add('occupied');
    } else {
      slot.textContent = stat.toUpperCase();
      slot.classList.remove('occupied');
    }
  });

  document.querySelectorAll(".drafted-card").forEach(card => {
    if (!gameState.gameFinished) {
        card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", card.dataset.name);
        e.dataTransfer.setData("card-type", "drafted");
        });
    } else {
        card.draggable = false;
    }
  });

}

function handleDraftDrop(pokemonName, stat, slot) {

  // Only allow drafting into empty slot
  if (gameState.statAssignments[stat] !== null) {
    return;
  }

  const pokemon = gameState.currentOptions.find(p => p.name === pokemonName);

  if (!pokemon) return;

  // Assign stat
  gameState.statAssignments[stat] = pokemonName;

  // Add to drafted
  gameState.drafted.push(pokemon);

  // Remove all 3 current draft options from pool
  document.getElementById("draft-options").innerHTML = "";

  // Advance round
  gameState.round++;

  if (gameState.round <= 6) {
    import('./draftLogic.js').then(module => {
      module.startDraft();
    });
  } else {
    document.getElementById("finish-draft-btn").style.display = "block";
  }

  gameState.currentOptions = [];
  document.getElementById("draft-options").innerHTML = "";

  renderStatAssignments();
}

function handleSwap(pokemonName, targetStat) {

  let currentStat = null;

  for (const s in gameState.statAssignments) {
    if (gameState.statAssignments[s] === pokemonName) {
      currentStat = s;
      break;
    }
  }

  const occupyingPokemon = gameState.statAssignments[targetStat];

  if (occupyingPokemon) {
    gameState.statAssignments[currentStat] = occupyingPokemon;
  } else {
    gameState.statAssignments[currentStat] = null;
  }

  gameState.statAssignments[targetStat] = pokemonName;

  renderStatAssignments();
}

export function initializeDropZones() {

    const slots = document.querySelectorAll('.stat-slot');

    slots.forEach(slot => {

        slot.addEventListener('dragover', (e) => {
            e.preventDefault();   // THIS IS REQUIRED
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();

            const pokemonName = e.dataTransfer.getData('text/plain');
            const cardType = e.dataTransfer.getData('card-type');
            const stat = slot.dataset.stat;

            if (cardType === "draft-option") {
                handleDraftDrop(pokemonName, stat);
            } else if (cardType === "drafted") {
                handleSwap(pokemonName, stat);
            }
        });

    });
}
