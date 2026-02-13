export function buildConfigUI() {

  const genContainer = document.getElementById("gen-checkboxes");

  for (let i = 1; i <= 9; i++) {
    genContainer.innerHTML += `
      <label>
        <input type="checkbox" value="${i}" checked>
        Gen ${i}
      </label>
    `;
  }

  const types = [
    "Normal","Fire","Water","Electric","Grass","Ice",
    "Fighting","Poison","Ground","Flying","Psychic",
    "Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"
  ];

  const typeContainer = document.getElementById("type-checkboxes");

  types.forEach(type => {
    typeContainer.innerHTML += `
      <label>
        <input type="checkbox" value="${type}">
        ${type}
      </label>
    `;
  });

}
