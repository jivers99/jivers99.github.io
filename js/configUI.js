export function buildConfigUI() {

  // ---------- GENERATIONS ----------
  const genContainer = document.getElementById("gen-checkboxes");

  genContainer.innerHTML = `
    <button id="toggle-gens">Deselect All</button><br>
  `;

  for (let i = 1; i <= 9; i++) {
    genContainer.innerHTML += `
      <label>
        <input type="checkbox" value="${i}" checked>
        Gen ${i}
      </label>
    `;
  }

  document.getElementById("toggle-gens").addEventListener("click", () => {
    toggleCheckboxGroup("gen-checkboxes", "toggle-gens");
  });

  // ---------- TYPES ----------
  const types = [
    "Normal","Fire","Water","Electric","Grass","Ice",
    "Fighting","Poison","Ground","Flying","Psychic",
    "Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"
  ];

  const typeContainer = document.getElementById("type-checkboxes");

  typeContainer.innerHTML = `
    <button id="toggle-types">Deselect All</button><br>
  `;

  types.forEach(type => {
    typeContainer.innerHTML += `
      <label>
        <input type="checkbox" value="${type}" checked>
        ${type}
      </label>
    `;
  });

  document.getElementById("toggle-types").addEventListener("click", () => {
    toggleCheckboxGroup("type-checkboxes", "toggle-types");
  });
}

function toggleCheckboxGroup(containerId, buttonId) {

  const container = document.getElementById(containerId);
  const checkboxes = container.querySelectorAll("input[type='checkbox']");
  const button = document.getElementById(buttonId);

  const allChecked = [...checkboxes].every(cb => cb.checked);

  checkboxes.forEach(cb => cb.checked = !allChecked);

  button.textContent = allChecked ? "Select All" : "Deselect All";
}
