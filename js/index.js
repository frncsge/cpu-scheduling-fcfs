import fcfs from "./fcfs.js";

let processList = [];

/* ===== ADD PROCESS ===== */
function addProcess() {
  const arrival = document.getElementById("arrival").value.trim();
  const burst = document.getElementById("burst").value.trim();

  // prevent zero input
  if (!arrival || !burst) {
    alert("Input cannot be empty. Please enter arrival and burst times.");
    return;
  }

  const arrivalArr = parseInput(arrival);
  const burstArr = parseInput(burst);

  // prevent invali inputs
  if (!arrivalArr || !burstArr) {
    alert("Invalid input: Please enter valid numbers only.");
    return;
  }

  // user must enter same number of values
  if (arrivalArr.length !== burstArr.length) {
    alert(
      "Invalid input: Arrival and Burst times must have the same number of values.",
    );
    return;
  }

  processList = arrivalArr.map((value, i) => ({
    id: String.fromCharCode(97 + i), // 97 = 'a'
    arrivalTime: value,
    burstTime: burstArr[i],
  }));

  renderTable();
}

function parseInput(input) {
  const inputArr = input.split(/\s+/);
  const parsedInputArr = inputArr.map(Number);

  const isValid = parsedInputArr.every((n) => !isNaN(n));

  if (!isValid) return false;

  return parsedInputArr;
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
const tbody = document.querySelector("#processTable tbody");

// event delegation: add event listener to tbody but only
// respond if the element clicked inside of it is the delete button
tbody.addEventListener("click", (e) => {
  if (
    e.target.tagName === "BUTTON" &&
    e.target.classList.contains("btn-danger")
  ) {
    const row = e.target.closest("tr");
    const index = Array.from(tbody.children).indexOf(row);
    deleteProcess(index);
  }
});

function renderTable() {
  tbody.innerHTML = "";

  processList.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <tr>
        <td>${p.id}</td>
        <td>${p.arrivalTime}</td>
        <td>${p.burstTime}</td>
        <td><button class="btn-danger">X</button></td>
      </tr>
    `;
    tbody.appendChild(row);
  });
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
        <td>${p.arrivalTime}</td>
        <td>${p.burstTime}</td>
        <td>${p.completionTime}</td>
        <td>${p.turnaroundTime}</td>
        <td>${p.waitingTime}</td>
      </tr>
    `;
  });

  document.getElementById("averages").innerHTML =
    `Avg Turnaround Time: <b>${avgTAT.toFixed(2)}</b> | Avg Waiting Time: <b>${avgWT.toFixed(2)}</b>`;
}

/* ===== GANTT ===== */
function renderGantt(data) {
  const gantt = document.getElementById("gantt");
  gantt.innerHTML = "";

  data.forEach((p, i) => {
    const color = `hsl(${i * 60}, 70%, 70%)`;

    const item = document.createElement("div");
    item.className = "gantt-item";
    item.style.flex = p.burstTime;

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.background = color;
    bar.innerHTML = `${p.id}`;

    const info = document.createElement("div");
    info.className = "gantt-info";

    if (i === 0) {
      const start = document.createElement("span");
      start.textContent = p.startTime;
      info.appendChild(start);
    }

    const end = document.createElement("span");
    end.textContent = p.completionTime;
    info.appendChild(end);

    item.appendChild(bar);
    item.appendChild(info);

    gantt.appendChild(item);
  });
}
