import { gameState } from './gameState.js';
import { renderDraftOptions } from './ui.js';

export function startDraft() {
    renderDraftOptions(getRandomOptions());
}

function getRandomOptions() {

    const options = [];

    while (options.length < 3 && gameState.remainingPool.length > 0) {
        const index = Math.floor(Math.random() * gameState.remainingPool.length);
        const selected = gameState.remainingPool.splice(index, 1)[0];
        options.push(selected);
    }

    return options;
}
