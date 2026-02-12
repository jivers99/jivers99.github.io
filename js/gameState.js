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
    gameState.currentOptions = [];
    gameState.statAssignments = {
        hp: null,
        atk: null,
        def: null,
        spa: null,
        spd: null,
        spe: null
    };

    const finishBtn = document.getElementById("finish-draft-btn");

    finishBtn.addEventListener("click", () => {

        // Ensure all stats are assigned
        const unassigned = Object.values(gameState.statAssignments).some(v => v === null);

        if (unassigned) {
            alert("You must assign all 6 stats before finishing.");
            return;
        }

        console.log("Final Assignments:", gameState.statAssignments);

        // Lock draft (we'll expand this next phase)
        finishBtn.disabled = true;
    });

    import('./ui.js').then(module => {
        module.initializeDropZones();
    });

    startDraft();
}
