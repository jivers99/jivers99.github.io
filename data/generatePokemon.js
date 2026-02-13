const fs = require("fs");

async function fetchPokemon(id) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();

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

    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();

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
        generation: id <= 151 ? 1 : 2,
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

    for (let i = 1; i <= 251; i++) {
        console.log(`Fetching Pokémon #${i}...`);
        const p = await fetchPokemon(i);
        pokemonList.push(p);
    }

    fs.writeFileSync(
        "data/pokemon.json",
        JSON.stringify(pokemonList, null, 2)
    );

    console.log("Gen 1 JSON generated successfully!");
}

generate();
