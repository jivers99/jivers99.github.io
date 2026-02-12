import { draftPokemon } from './draftLogic.js';

export function renderDraftOptions(options) {

  const container = document.getElementById('draft-options');
  container.innerHTML = '';

  options.forEach(pokemon => {

    const card = document.createElement('div');
    card.className = 'pokemon-card';

    card.innerHTML = `
      <h3>${pokemon.name}</h3>
      <p>BST: ${pokemon.bst}</p>
    `;

    card.onclick = () => {
      draftPokemon(pokemon);
    };

    container.appendChild(card);
  });
}
