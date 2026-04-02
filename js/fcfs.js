// function para sa calculation
const fcfs = (processes) => {
  // sort ang processes based sa ila arrival time
  const sortedProcesses = processes.toSorted(
    (a, b) => a.arrivalTime - b.arrivalTime,
  );

  let currentTime = 0;

  const result = sortedProcesses.map((p) => {
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

  // e add tanan turnaround times
  const sumOfTurnaroundTime = result.reduce((acc, currValue) => {
    return acc + currValue.turnaroundTime;
  }, 0);

  // e add tanan waiting times
  const sumOfWaitingTime = result.reduce((acc, currValue) => {
    return acc + currValue.waitingTime;
  }, 0);

  // kuhaon ang average sa sum of turnaround and waiting time
  const avgTAT = sumOfTurnaroundTime / result.length;
  const avgWT = sumOfWaitingTime / result.length;

  return {
    result,
    avgTAT,
    avgWT,
  };
};

export default fcfs;
