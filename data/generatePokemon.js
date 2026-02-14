const fs = require("fs");

function parseGeneration(genName) {
  const map = {
    "generation-i": 1,
    "generation-ii": 2,
    "generation-iii": 3,
    "generation-iv": 4,
    "generation-v": 5,
    "generation-vi": 6,
    "generation-vii": 7,
    "generation-viii": 8,
    "generation-ix": 9
  };

  return map[genName] || null;
}

async function fetchWithRetry(url, retries = 5, delay = 500) {

  for (let attempt = 1; attempt <= retries; attempt++) {

    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return await res.json();

    } catch (err) {

      console.log(`Retry ${attempt} for ${url}`);

      if (attempt === retries) {
        console.error(`FAILED: ${url}`);
        return null;
      }

      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function fetchPokemon(id) {
    const data = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!data) return null;

    if (!data.is_default) {
        return null;
    }

    const speciesData = await fetchWithRetry(data.species.url);
    if (!speciesData) return null;

    const generation = parseGeneration(speciesData.generation.name);

    const stats = {};
    let bst = 0;

    data.stats.forEach(s => {
        const name = s.stat.name;
        const value = s.base_stat;

        switch (name) {
            case "hp":
                stats.hp = value;
                break;
            case "attack":
                stats.atk = value;
                break;
            case "defense":
                stats.def = value;
                break;
            case "special-attack":
                stats.spa = value;
                break;
            case "special-defense":
                stats.spd = value;
                break;
            case "speed":
                stats.spe = value;
                break;
        }

        bst += value;
    });

    const evoData = await fetchWithRetry(speciesData.evolution_chain.url);
    if (!evoData) return null;

    function findChainNode(chainNode, targetName) {
    if (chainNode.species.name === targetName) return chainNode;

    for (const child of chainNode.evolves_to) {
        const found = findChainNode(child, targetName);
        if (found) return found;
    }

    return null;
    }

    function isFullyEvolved(chainRoot, targetName) {
    const node = findChainNode(chainRoot, targetName);
    if (!node) return false; // shouldn't happen, but safe
    return node.evolves_to.length === 0;
    }


    return {
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        generation: generation,
        fullyEvolved: isFullyEvolved(evoData.chain, data.name),
        legendary: false,
        bst: bst,
        types: data.types.map(t =>
            t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
        ),
        stats: stats
    };

}

async function generate() {
    const pokemonList = [];

    for (let i = 1; i <= 1025; i++) {
        console.log(`Fetching Pokémon #${i}...`);
        const p = await fetchPokemon(i);
        if (p) {
            pokemonList.push(p);
        }
    }

    fs.writeFileSync(
        "data/pokemon.json",
        JSON.stringify(pokemonList, null, 2)
    );

    console.log("Gen 1 JSON generated successfully!");
}

generate();
