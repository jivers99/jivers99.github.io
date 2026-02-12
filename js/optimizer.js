export function calculateOptimal(draftedPokemon) {

    const stats = ["hp", "atk", "def", "spa", "spd", "spe"];

    const permutations = generatePermutations(stats);

    let bestScore = 0;
    let bestAssignment = null;

    permutations.forEach(permutation => {

        let total = 0;

        for (let i = 0; i < draftedPokemon.length; i++) {
            total += draftedPokemon[i].stats[permutation[i]];
        }

        if (total > bestScore) {
            bestScore = total;
            bestAssignment = permutation;
        }
    });

    return {
        bestScore,
        bestAssignment
    };
}

function generatePermutations(arr) {
    if (arr.length === 0) return [[]];

    const result = [];

    arr.forEach((item, index) => {
        const remaining = [...arr.slice(0, index), ...arr.slice(index + 1)];
        const perms = generatePermutations(remaining);
        perms.forEach(p => {
            result.push([item, ...p]);
        });
    });

    return result;
}
