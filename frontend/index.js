// Static list of horses — you can replace this later with dynamic ones
const horses = ['Thunderbolt', 'LightningStrike', 'ShadowRunner'];

function populateHorseSelector() {
  const selector = document.getElementById('horseSelector');
  selector.innerHTML = '<option value="">Select a horse</option>';
  horses.forEach(horse => {
    const option = document.createElement('option');
    option.value = horse;
    option.textContent = horse;
    selector.appendChild(option);
  });
}

async function runRace() {
  const horseSelector = document.getElementById('horseSelector');
  const selectedHorse = horseSelector.value;

  if (!selectedHorse) {
    alert('Please select a horse.');
    return;
  }

  try {
    const response = await fetch('https://deadzedrevival.onrender.com/run-race', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        horses: [selectedHorse, 'CPU_Horse_1', 'CPU_Horse_2']
      })
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

document.addEventListener('DOMContentLoaded', populateHorseSelector);
