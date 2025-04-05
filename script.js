let tempChart, vibChart, eneChart;
let horasOperacion = 0;

function updateCharts(temp, vib, energia) {
  const now = new Date().toLocaleTimeString();
  [tempChart, vibChart, eneChart].forEach((chart, idx) => {
    const value = idx === 0 ? temp : idx === 1 ? vib : energia;
    if (chart.data.labels.length > 10) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(value);
    chart.update();
  });
}

function createChart(id, label, color) {
  return new Chart(document.getElementById(id), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        backgroundColor: color,
        borderColor: color.replace('0.5', '1'),
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById("modoBtn");

  html.classList.toggle("dark");
  const isDark = html.classList.contains("dark");

  localStorage.setItem("theme", isDark ? "dark" : "light");
  btn.textContent = isDark ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const html = document.documentElement;
  const btn = document.getElementById("modoBtn");

  if (savedTheme === "dark") {
    html.classList.add("dark");
  }

  if (btn) {
    btn.textContent = html.classList.contains("dark")
      ? "☀️ Modo Claro"
      : "🌙 Modo Oscuro";
  }

  const umbralGuardado = localStorage.getItem("umbralTemp") || 65;
  window.umbral = parseFloat(umbralGuardado);

  tempChart = createChart("tempChart", "Temperatura (°C)", 'rgba(255, 99, 132, 0.5)');
  vibChart = createChart("vibChart", "Vibración (mm/s)", 'rgba(255, 206, 86, 0.5)');
  eneChart = createChart("eneChart", "Consumo (kWh)", 'rgba(75, 192, 192, 0.5)');

  setInterval(() => {
    const temp = (Math.random() * 30 + 40).toFixed(2);
    const vib = (Math.random() * 5 + 1).toFixed(2);
    const energia = (Math.random() * 50 + 100).toFixed(2);

    document.getElementById("temp-val").textContent = temp + " °C";
    document.getElementById("vib-val").textContent = vib + " mm/s";
    document.getElementById("ene-val").textContent = energia + " kWh";
    document.getElementById("horas-val").textContent = (++horasOperacion / 1200).toFixed(2) + " h";

    const alerta = document.getElementById("alerta");
    if (alerta) {
      if (temp > 60) {
        alerta.textContent = "⚠️ Temperatura crítica detectada";
        alerta.classList.remove("hidden");
      } else {
        alerta.classList.add("hidden");
      }
    }

    updateCharts(temp, vib, energia);
  }, 3000);
});