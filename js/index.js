let processList = [];

/* ===== ADD PROCESS ===== */
function addProcess() {
  const id = document.getElementById("pid").value.trim();
  const arrival = parseInt(document.getElementById("arrival").value);
  const burst = parseInt(document.getElementById("burst").value);

  if (!id || arrival < 0 || burst <= 0) {
    alert("Invalid input!");
    return;
  }

  processList.push({ id, arrivalTime: arrival, burstTime: burst });
  renderTable();
}

const addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", addProcess);

/* ===== CLEAR ===== */
function clearAll() {
  processList = [];
  renderTable();
  document.querySelector("#resultTable tbody").innerHTML = "";
  document.getElementById("gantt").innerHTML = "";
  document.getElementById("averages").innerHTML = "";
}

const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", clearAll);

/* ===== DELETE ===== */
function deleteProcess(index) {
  processList.splice(index, 1);
  renderTable();
}

/* ===== RENDER TABLE ===== */
function renderTable() {
  const tbody = document.querySelector("#processTable tbody");
  tbody.innerHTML = "";

  processList.forEach((p, index) => {
    const row = `
      <tr>
        <td>${p.id}</td>
        <td>${p.arrivalTime}</td>
        <td>${p.burstTime}</td>
        <td><button class="btn-danger" onclick="deleteProcess(${index})">X</button></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

/* ===== FCFS ===== */
function fcfs(processes) {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;

  const result = sorted.map((p) => {
    const startTime = Math.max(currentTime, p.arrivalTime);
    const completionTime = startTime + p.burstTime;
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;

    currentTime = completionTime;

    return {
      ...p,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    };
  });

  const avgTAT =
    result.reduce((a, b) => a + b.turnaroundTime, 0) / result.length;
  const avgWT = result.reduce((a, b) => a + b.waitingTime, 0) / result.length;

  return { result, avgTAT, avgWT };
}

/* ===== RUN ===== */
function runSimulation() {
  if (processList.length === 0) return;

  document.getElementById("loader").classList.add("active");

  setTimeout(() => {
    const { result, avgTAT, avgWT } = fcfs(processList);

    renderResults(result, avgTAT, avgWT);
    renderGantt(result);

    document.getElementById("loader").classList.remove("active");
  }, 500);
}

const runBtn = document.getElementById("runBtn");
runBtn.addEventListener("click", runSimulation);

/* ===== RENDER RESULTS ===== */
function renderResults(data, avgTAT, avgWT) {
  const tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";

  data.forEach((p) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.startTime}</td>
        <td>${p.completionTime}</td>
        <td>${p.turnaroundTime}</td>
        <td>${p.waitingTime}</td>
      </tr>
    `;
  });

  document.getElementById("averages").innerHTML =
    `Avg TAT: ${avgTAT.toFixed(2)} | Avg WT: ${avgWT.toFixed(2)}`;
}

/* ===== GANTT ===== */
function renderGantt(data) {
  const gantt = document.getElementById("gantt");
  gantt.innerHTML = "";

  data.forEach((p, i) => {
    const color = `hsl(${i * 60}, 70%, 70%)`;

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.background = color;
    bar.style.flex = p.burstTime;
    bar.innerHTML = `${p.id}<br>${p.startTime}-${p.completionTime}`;

    gantt.appendChild(bar);
  });
}
