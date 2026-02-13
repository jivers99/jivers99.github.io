import { buildConfigUI } from "./configUI.js";
import { startGameWithConfig } from "./gameState.js";

fetch("../data/pokemon.json")
  .then(res => res.json())
  .then(data => {

    console.log("Data loaded"); // ✅ debug line

    buildConfigUI();

    document
      .getElementById("start-game-btn")
      .addEventListener("click", () => {
        startGameWithConfig(data);
      });

  })
  .catch(err => console.error("LOAD ERROR:", err));
