const form = document.getElementById("plantForm");
const plantList = document.getElementById("plantList");

// Load from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("plants")) || [];
  saved.forEach(createCard);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("plantName").value;
  const waterDate = document.getElementById("waterDate").value;
  const sunlightDate = document.getElementById("sunlightDate").value;

  const plant = { name, waterDate, sunlightDate };

  createCard(plant);
  savePlant(plant);

  form.reset();
});

function createCard({ name, waterDate, sunlightDate }) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <strong>${name}</strong>
    <small>💧 Water on: ${waterDate}</small><br>
    <small>☀️ Sunlight on: ${sunlightDate}</small>
  `;

  plantList.appendChild(div);
}

function savePlant(plant) {
  const plants = JSON.parse(localStorage.getItem("plants")) || [];
  plants.push(plant);
  localStorage.setItem("plants", JSON.stringify(plants));
}
