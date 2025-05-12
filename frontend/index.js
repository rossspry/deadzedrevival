const horses = {
  "100623": "Atlantic Records",
  "118226": "Purple Moon Rising",
  "138067": "Friendly Neighbor",
  "148500": "TeslaModelH",
  "151001": "Mistress of the Dark",
  "156512": "Sir LetsGoBrandon"
};

function populateHorseSelector() {
  const picker = document.getElementById('horsePicker');
  picker.innerHTML = '';

  for (const id in horses) {
    const label = document.createElement('label');
    label.style.display = 'block';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = id;
    checkbox.name = 'horse';

    label.appendChild(checkbox);
    label.append(` ${horses[id]}`);
    picker.appendChild(label);
  }
}

function getSelectedHorseIds() {
  const checkboxes = document.querySelectorAll('input[name="horse"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function renderLanes(participants, winner) {
  const lanes = document.getElementById('raceLanes');
  lanes.innerHTML = ''; // clear previous

  participants.forEach(name => {
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.textContent = name;

    if (name === winner) {
      lane.classList.add('winner');
      lane.textContent += ' 🏆';
    }

    lanes.appendChild(lane);
  });
}

async function runRace() {
  const selectedIds = getSelectedHorseIds();

  if (selectedIds.length < 2 || selectedIds.length > 6) {
    alert('Select between 2 and 6 horses.');
    return;
  }

  try {
    const response = await fetch('https://deadzedrevival.onrender.com/run-race', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ horseIds: selectedIds })
    });

    const data = await response.json();

    if (response.ok) {
      renderLanes(data.participants, data.winner);

      document.getElementById('raceResult').innerHTML = `
        <h2>Race Completed</h2>
        <p><strong>Winner:</strong> ${data.winner}</p>
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
