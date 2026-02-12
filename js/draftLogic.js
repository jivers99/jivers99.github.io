import { gameState } from './gameState.js';
import { renderDraftOptions } from './ui.js';
import { getTier } from './tierUtils.js';


const roundChances = {
  1: { A: 59, B: 40 },
  2: { A: 18, B: 20, C: 30, D: 18, F: 13 },
  3: { A: 18, B: 20, C: 30, D: 18, F: 13 },
  4: { A: 12, B: 15, C: 30, D: 22, F: 20 },
  5: { A: 8,  B: 10, C: 27, D: 24, F: 30 },
  6: { A: 8,  B: 10, C: 27, D: 24, F: 30 }
};

const tierOrder = ["S", "A", "B", "C", "D", "F"];

function buildTierBuckets(pool) {
  const buckets = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    F: []
  };

  pool.forEach(p => {
    const tier = getTier(p.bst);
    buckets[tier].push(p);
  });

  return buckets;
}

function weightedRoll(round) {
  // First check S roll
  if (Math.random() < 0.01) return "S";

  const chances = roundChances[round];
  const roll = Math.random() * 100;

  let cumulative = 0;
  for (const tier of Object.keys(chances)) {
    cumulative += chances[tier];
    if (roll <= cumulative) {
      return tier;
    }
  }

  return "F"; // safety fallback
}

function fallbackTier(tier, buckets) {
  let index = tierOrder.indexOf(tier);

  while (index < tierOrder.length) {
    const candidateTier = tierOrder[index];
    if (buckets[candidateTier].length > 0) {
      return candidateTier;
    }
    index++; // go one tier lower
  }

  return null;
}

function getCardFromTier(tier, buckets) {
  const bucket = buckets[tier];
  const index = Math.floor(Math.random() * bucket.length);
  return bucket.splice(index, 1)[0];
}

function generateThreeOptions() {
  const buckets = buildTierBuckets(gameState.remainingPool);
  const options = [];

  for (let i = 0; i < 3; i++) {
    const rolledTier = weightedRoll(gameState.round);
    const actualTier = fallbackTier(rolledTier, buckets);

    if (!actualTier) break; // no Pokémon left

    const pokemon = getCardFromTier(actualTier, buckets);

    // Also remove from remainingPool
    const poolIndex = gameState.remainingPool.findIndex(p => p.name === pokemon.name);
    if (poolIndex !== -1) {
      gameState.remainingPool.splice(poolIndex, 1);
    }

    options.push(pokemon);
  }

  return options;
}

export function startDraft() {

  if (gameState.round > 6) {
    console.log("Draft complete");
    return;
  }

  const options = generateThreeOptions();
  renderDraftOptions(options);
}

export function draftPokemon(pokemon) {

  gameState.drafted.push(pokemon);

  renderDraftedPokemon();

  gameState.round++;

  if (gameState.round <= 6) {
    startDraft();
  } else {
    document.getElementById("finish-draft-btn").style.display = "block";
  }
}