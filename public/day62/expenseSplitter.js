const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const percentageInput = document.getElementById("percentage");
const addBtn = document.getElementById("add-btn");
const expenseList = document.getElementById("expense-list");
const calculateBtn = document.getElementById("calculate-btn");
const resetBtn = document.getElementById("reset-btn");
const exportBtn = document.getElementById("export-btn");
const output = document.getElementById("output");
const toast = document.getElementById("toast");
const chartCanvas = document.getElementById("summaryChart");
const darkModeToggle = document.getElementById("darkModeToggle");
let expenses = [];

const categoryColors = {
  Food: "#ff6b6b",
  Travel: "#51cf66",
  Shopping: "#339af0",
  Rent: "#fcc419",
  Others: "#845ef7",
};

function showToast(msg, type = "info") {
  toast.textContent = msg;
  toast.style.background =
    type === "success" ? "#51cf66" : type === "error" ? "#ff6b6b" : "#6c63ff";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// Restore stored data and dark mode
window.addEventListener("load", () => {
  const stored = JSON.parse(localStorage.getItem("expenses"));
  if (stored) {
    expenses = stored;
    expenses.forEach(createListItem);
  }

  const lastCalc = JSON.parse(localStorage.getItem("lastCalculation"));
  if (lastCalc) {
    output.innerHTML = lastCalc.outputHTML;
    renderChart();
  }

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
    darkModeToggle.checked = true;
  }
});

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark") ? "enabled" : "disabled"
  );
});

function createListItem(exp) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span>${exp.name}: ₹${exp.amount.toFixed(2)} (${exp.category}) ${
    exp.percentage ? "[" + exp.percentage + "%]" : ""
  }</span>
    <span class="buttons">
      <button class="edit">✏️</button>
      <button class="delete">🗑️</button>
    </span>`;
  expenseList.appendChild(li);

  li.querySelector(".delete").addEventListener("click", () => {
    expenses = expenses.filter((e) => e !== exp);
    li.remove();
    localStorage.setItem("expenses", JSON.stringify(expenses));
    if (expenses.length === 0 && window.expChart) window.expChart.destroy();
    showToast("Expense deleted", "success");
  });
}

addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const perc = parseFloat(percentageInput.value);
  if (!name || isNaN(amount) || amount <= 0)
    return showToast("Enter valid name and amount", "error");
  if (expenses.some((e) => e.name.toLowerCase() === name.toLowerCase()))
    return showToast("Name already exists", "error");

  const exp = {
    name,
    amount,
    category,
    percentage: !isNaN(perc) ? perc : null,
  };
  expenses.push(exp);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  createListItem(exp);
  showToast("Expense added", "success");
  nameInput.value = amountInput.value = percentageInput.value = "";
});

function renderChart() {
  if (expenses.length === 0) return;
  const dataColors = expenses.map(
    (e) => `hsl(${Math.random() * 360}, 70%, 60%)`
  );
  if (window.expChart) window.expChart.destroy();
  window.expChart = new Chart(chartCanvas, {
    type: "pie",
    data: {
      labels: expenses.map((e) => e.name),
      datasets: [
        {
          data: expenses.map((e) => e.amount),
          backgroundColor: dataColors,
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Expense Distribution by Category" },
      },
    },
  });
}

// Calculate
calculateBtn.addEventListener("click", () => {
  if (expenses.length < 2)
    return (output.textContent = "Add at least 2 people to calculate.");
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const totalPerc = expenses.reduce((s, e) => s + (e.percentage || 0), 0);
  let result = `<p><strong>Total:</strong> ₹${total.toFixed(2)}</p><hr>`;
  expenses.forEach((e) => {
    let share =
      totalPerc > 0 && e.percentage
        ? total * (e.percentage / totalPerc)
        : total / expenses.length;
    const bal = (e.amount - share).toFixed(2);
    result +=
      bal > 0
        ? `<p>✅ ${e.name} should receive ₹${bal}</p>`
        : bal < 0
        ? `<p>❌ ${e.name} owes ₹${Math.abs(bal)}</p>`
        : `<p>⚖️ ${e.name} is settled!</p>`;
  });
  output.innerHTML = result;

  renderChart();

  // Store calculation
  localStorage.setItem(
    "lastCalculation",
    JSON.stringify({ outputHTML: result })
  );

  showToast("Split Calculated", "success");
});

// Reset
resetBtn.addEventListener("click", () => {
  expenses = [];
  expenseList.innerHTML = output.innerHTML = "";
  if (window.expChart) window.expChart.destroy();
  localStorage.removeItem("expenses");
  localStorage.removeItem("lastCalculation");
  showToast("All cleared", "success");
});
