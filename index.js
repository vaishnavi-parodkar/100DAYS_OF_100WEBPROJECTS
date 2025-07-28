const projects = [
  "Animated Landing Page",
  "To-Do List",
  "Weather App",
  "Jewellery-company landing page",
  "Random Image Generator",
  "New Year Countdown",
  "Stylish Animated loginpage",
  "BMI Calculator",
  "QR Generator",
  "Rock Paper Scissors Game",
  "Reading Journal",
  "Pong Game",
  "Colour Picker",
  "Drawing Canvas",
  "Nasa Astronomy Picture of the day",
  "World Clock",
  "Text to PDF Converter",
];

const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

const tableBody = document.getElementById("tableBody");
const projectCount = document.getElementById("projectCount");
projectCount.textContent = projects.length;

// Random project button
const randomBtn = document.getElementById("randomProjectBtn");
let showingRandom = false;
let lastRandomIndex = null;

randomBtn.addEventListener("click", () => {
  const rows = tableBody.getElementsByTagName("tr");

  if (showingRandom) {
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.display = "";
    }
    randomBtn.textContent = "Random";
    showingRandom = false;
    lastRandomIndex = null;
    return;
  }

  const randomIndex = Math.floor(Math.random() * projects.length);
  lastRandomIndex = randomIndex;
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.display = i === randomIndex ? "" : "none";
  }
  randomBtn.textContent = "Show All";
  showingRandom = true;
});
projects.forEach((name, index) => {
  const day = `Day ${String(index + 1).padStart(2, "0")}`;

  let link;

  // Handle specific exceptions with hardcoded folders
  if (name === "QR Generator") {
    link = "public/Day 09/index.html";
  } else if (name === "Text to PDF Converter") {
    link = "public/Day 17/index.html";
  } else {
    // Default path based on index
    const folder = `Day ${String(index + 1).padStart(2, "0")}`;
    link = `public/${folder}/index.html`;
  }

  const row = document.createElement("tr");
  row.classList.add("project-row");

  row.innerHTML = `
    <td class="p-4 font-semibold text-primary">${day}</td>
    <td class="p-4">${name}</td>
    <td class="p-4">
      <a href="${link}" target="_blank" class="text-primary underline hover:text-pink-500">Live Demo</a>
    </td>
  `;

  tableBody.appendChild(row);
});

