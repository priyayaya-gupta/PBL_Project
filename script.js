let totalCO2 = localStorage.getItem("co2") ? parseFloat(localStorage.getItem("co2")) : 0;
let history = JSON.parse(localStorage.getItem("history")) || [];

let chart;

function updateUI() {
  document.getElementById("co2").innerText = totalCO2.toFixed(2) + " kg";

  let points = Math.max(0, (100 - totalCO2 * 10));
  document.getElementById("points").innerText = "EcoPoints: " + points.toFixed(0);

  localStorage.setItem("co2", totalCO2);
  localStorage.setItem("history", JSON.stringify(history));

  updateChart();
  updateMessage();
}

// MESSAGE
function updateMessage() {
  let msg = "";

  if (totalCO2 < 2) {
    msg = "Excellent 🌱 Very low emissions!";
  } 
  else if (totalCO2 < 5) {
    msg = "You're doing good 👍";
  } 
  else {
    msg = "High emissions ⚠️ Try reducing travel/food orders";
  }

  document.getElementById("msg").innerText = msg;
}

// GRAPH
function updateChart() {
  let ctx = document.getElementById("chart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: history.map((_, i) => i + 1),
      datasets: [{
        data: history,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

// SUGGESTIONS
function showSuggestion(type) {
  let suggestion = "";

  if (type === "travel") {
    suggestion = "Use public transport 🚇 to reduce CO₂";
  }
  if (type === "screen") {
    suggestion = "Reduce screen time to save energy ⚡";
  }
  if (type === "food") {
    suggestion = "Cooking at home reduces emissions 🍳";
  }

  showPopup(suggestion);
}

// TRAVEL
function addTravel() {
  let d = prompt("Distance (km):");
  let mode = prompt("Mode (car/bike/metro/walk):");

  let factor = {
    car: 0.2,
    bike: 0.1,
    metro: 0.05,
    walk: 0
  };

  let emission = d * (factor[mode] || 0.1);

  totalCO2 += emission;
  history.push(totalCO2);

  showPopup("+" + emission.toFixed(2) + " kg CO₂");
  showSuggestion("travel");

  updateUI();
}

// SCREEN
function addScreen() {
  let h = prompt("Screen time (hours):");
  let emission = h * 0.05;

  totalCO2 += emission;
  history.push(totalCO2);

  showPopup("+" + emission.toFixed(2) + " kg CO₂");
  showSuggestion("screen");

  updateUI();
}

// FOOD
function foodPrompt() {
  let ans = confirm("Did you order food today?");
  if (ans) {
    totalCO2 += 0.8;
    history.push(totalCO2);

    showPopup("+0.8 kg CO₂");
    showSuggestion("food");

    updateUI();
  }
}

// RESET
function resetData() {
  localStorage.clear();
  totalCO2 = 0;
  history = [];
  updateUI();
}

// POPUP
function showPopup(msg) {
  let div = document.createElement("div");
  div.className = "popup";
  div.innerText = msg;

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 2000);
}

// LOAD
updateUI();