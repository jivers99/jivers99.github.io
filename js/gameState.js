import { startDraft } from './draftLogic.js';

export let gameState = {};

export function initializeGame(pokemonData) {

    const filtered = pokemonData.filter(p =>
        p.fullyEvolved &&
        (p.generation === 1 || p.generation === 2)
    );

    gameState = {
        round: 1,
        drafted: [],
        remainingPool: [...filtered],
        statAssignments: {
            hp: null,
            atk: null,
            def: null,
            spa: null,
            spd: null,
            spe: null
        }
    };

    startDraft();
}
