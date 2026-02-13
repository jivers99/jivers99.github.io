import { startDraft } from './draftLogic.js';
import { calculateOptimal } from './optimizer.js';

export let gameState = {};

export function initializeGame(pokemonData) {

    const filtered = pokemonData.filter(p =>
        p.fullyEvolved &&
        [1,2].includes(p.generation)
    );

    gameState.round = 1;
    gameState.drafted = [];
    gameState.remainingPool = [...filtered];
    gameState.currentOptions = [];
    gameState.gameFinished = false;
    gameState.currentOptimalIndex = 0;
    gameState.optimalResults = null;
    gameState.originalData = pokemonData;
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
        gameState.gameFinished = true;

        const playerScore = calculatePlayerScore();
        const optimal = calculateOptimal(gameState.drafted);

        gameState.optimalResults = optimal;
        gameState.currentOptimalIndex = 0;

        showResults(playerScore);

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

function showResults(playerScore) {

    const resultsDiv = document.getElementById("results-screen");
    resultsDiv.style.display = "block";

    const optimal = gameState.optimalResults;
    const optimalAssignment = optimal.optimalAssignments[gameState.currentOptimalIndex];

    const efficiency = ((playerScore / optimal.bestScore) * 100).toFixed(1);

    let html = `
        <h2>Results</h2>
        <p>Your Score: ${playerScore}</p>
        <p>Optimal Score: ${optimal.bestScore}</p>
        <p>Efficiency: ${efficiency}%</p>

        <div style="display:flex; justify-content:center; gap:50px; margin-top:20px;">
    `;

    // PLAYER TABLE
    html += `
        <div>
            <h3>Your Assignment</h3>
            <table border="1">
                <tr>
                    <th>Stat</th>
                    <th>Pokemon</th>
                    <th>Base</th>
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

    html += `</table></div>`;

    // OPTIMAL TABLE
    const totalOptimal = optimal.optimalAssignments.length;
    const currentIndex = gameState.currentOptimalIndex + 1;

    html += `
        <div style="display:flex; flex-direction:column; align-items:center;">
            <h3>
                Optimal Assignment 
                ${totalOptimal > 1 ? `(${currentIndex} of ${totalOptimal})` : ""}
            </h3>

            <table border="1" style="margin-bottom:10px;">
                <tr>
                    <th>Stat</th>
                    <th>Pokemon</th>
                    <th>Base</th>
                </tr>
    `;


    // Build reverse lookup: stat → pokemon
    const statOrder = ["hp","atk","def","spa","spd","spe"];
    const optimalMap = {};

    for (let i = 0; i < gameState.drafted.length; i++) {
        const pokemon = gameState.drafted[i];
        const stat = optimalAssignment[i];
        optimalMap[stat] = pokemon;
    }

    statOrder.forEach(stat => {

        const pokemon = optimalMap[stat];

        html += `
            <tr>
                <td>${stat.toUpperCase()}</td>
                <td>${pokemon.name}</td>
                <td>${pokemon.stats[stat]}</td>
            </tr>
        `;
    });

    html += `</table>`;

    if (totalOptimal > 1) {
        html += `
            <div style="display:flex; gap:15px; align-items:center;">
                <button id="prev-optimal">←</button>
                <button id="next-optimal">→</button>
            </div>
        `;
    }

    html += `</div>`;



    html += `<br><button id="restart-btn">New Game</button>`;

    resultsDiv.innerHTML = html;

    if (optimal.optimalAssignments.length > 1) {
        document.getElementById("prev-optimal").addEventListener("click", () => {
            if (gameState.currentOptimalIndex > 0) {
                gameState.currentOptimalIndex--;
                showResults(playerScore);
            }
        });

        document.getElementById("next-optimal").addEventListener("click", () => {
            if (gameState.currentOptimalIndex < optimal.optimalAssignments.length - 1) {
                gameState.currentOptimalIndex++;
                showResults(playerScore);
            }
        });
    }

    document.getElementById("restart-btn").addEventListener("click", restartGame);
}

function restartGame() {

    // Reset UI
    document.getElementById("results-screen").style.display = "none";
    document.getElementById("results-screen").innerHTML = "";
    document.getElementById("finish-draft-btn").style.display = "none";
    document.getElementById("finish-draft-btn").disabled = false;

    document.getElementById("draft-options").innerHTML = "";
    document.querySelectorAll(".stat-slot").forEach(slot => {
        slot.textContent = slot.dataset.stat.toUpperCase();
        slot.classList.remove("occupied");
    });

    // Restart game state
    initializeGame(gameState.originalData);
}
