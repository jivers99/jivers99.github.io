import { gameState } from './gameState.js';
import { getTier } from './draftLogic.js';

export function renderDraftOptions(options) {

    const container = document.getElementById('draft-options');
    container.innerHTML = '';

    options.forEach(pokemon => {

        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
        <h3>${pokemon.name}</h3>
        <p>BST: ${pokemon.bst}</p>
        <p>Tier: ${getTier(pokemon.bst)}</p>
        `;


        card.onclick = () => {
            draftPokemon(pokemon);
        };

        container.appendChild(card);
    });
}

function draftPokemon(pokemon) {

    gameState.drafted.push(pokemon);

    // TODO: show stat selection UI

    if (gameState.drafted.length === 6) {
        endDraft();
    }
}
