// Static list of horses: ID → Display name
const horses = {
  "100623": "Atlantic Records",
  "118226": "Purple Moon Rising",
  "138067": "Friendly Neighbor",
  "148500": "TeslaModelH",
  "151001": "Mistress of the Dark",
  "156512": "Sir LetsGoBrandon"
};

// Populate the dropdown with display names
function populateHorseSelector() {
  const selector = document.getElementById('horseSelector');
  selector.innerHTML = '<option value="">Select a horse</option>';
  for (const id in horses) {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = horses[id];
    selector.appendChild(option);
  }
}

// Send selected horse ID + 2 CPUs to backend for racing
async function runRace() {
  const horseSelector = document.getElementById('horseSelector');
  const selectedId = horseSelector.value;

  if (!selectedId) {
    alert('Please select a horse.');
    return;
  }

  // Choose up to 2 random CPU horses from the list (excluding selected)
  const cpuIds = Object.keys(horses).filter(id => id !== selectedId);
  const shuffled = cpuIds.sort(() => 0.5 - Math.random());
  const cpuPicks = shuffled.slice(0, 2); // pick 2

  const horseIds = [selectedId, ...cpuPicks];

  try {
    const response = await fetch('https://deadzedrevival.onrender.com/run-race', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ horseIds })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('raceResult').innerHTML = `
        <h2>Race Completed</h2>
        <p><strong>Winner:</strong> ${data.winner}</p>
        <p><strong>Participants:</strong> ${data.participants.join(', ')}</p>
      `;

      document.getElementById('winnerPhoto').innerHTML = `
        <img src="/images/${data.winner}.png" alt="${data.winner}" style="height: 150px;">
      `;
    } else {
      throw new Error(data.error || 'Race failed.');
    }
  } catch (error) {
    console.error('Race error:', error);
    document.getElementById('raceResult').innerText = 'Error: ' + error.message;
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', populateHorseSelector);

