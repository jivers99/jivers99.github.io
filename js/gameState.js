import { startDraft } from './draftLogic.js';
import { calculateOptimal } from './optimizer.js';

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

        const unassigned = Object.values(gameState.statAssignments).some(v => v === null);

        if (unassigned) {
            alert("You must assign all 6 stats before finishing.");
            return;
        }

        // Lock UI
        finishBtn.disabled = true;

        const playerScore = calculatePlayerScore();
        const optimal = calculateOptimal(gameState.drafted);

        showResults(playerScore, optimal);
    });

    import('./ui.js').then(module => {
        module.initializeDropZones();
    });

    startDraft();
}

export function calculatePlayerScore() {

    let total = 0;

    for (const stat in gameState.statAssignments) {

        const pokemonName = gameState.statAssignments[stat];

        const pokemon = gameState.drafted.find(p => p.name === pokemonName);

        total += pokemon.stats[stat];
    }

    return total;
}

function showResults(playerScore, optimal) {

    const resultsDiv = document.getElementById("results-screen");
    resultsDiv.style.display = "block";

    const efficiency = ((playerScore / optimal.bestScore) * 100).toFixed(1);

    let html = `
        <h2>Results</h2>
        <p>Your Score: ${playerScore}</p>
        <p>Optimal Score: ${optimal.bestScore}</p>
        <p>Efficiency: ${efficiency}%</p>
        <h3>Your Assignments</h3>
        <table border="1" style="margin:auto;">
        <tr>
            <th>Stat</th>
            <th>Pokemon</th>
            <th>Base Stat</th>
        </tr>
    `;

    for (const stat in gameState.statAssignments) {

        const name = gameState.statAssignments[stat];
        const pokemon = gameState.drafted.find(p => p.name === name);

        html += `
            <tr>
                <td>${stat.toUpperCase()}</td>
                <td>${name}</td>
                <td>${pokemon.stats[stat]}</td>
            </tr>
        `;
    }

    html += `</table>`;

    resultsDiv.innerHTML = html;
}
