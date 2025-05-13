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

function renderAnimatedRace(participants, winner) {
  const track = document.getElementById('raceTrack');
  track.innerHTML = '';

  const animations = [];

  participants.forEach((name, index) => {
    const lane = document.createElement('div');
    lane.className = 'lane';

    const horse = document.createElement('div');
    horse.className = 'horse';
    horse.textContent = name;

    if (name === winner) {
      horse.classList.add('winner');
    }

    lane.appendChild(horse);
    track.appendChild(lane);

    const baseDuration = 6;
    const delay = index * 0.2;
    const speedFactor = name === winner ? 1 : 1.2 + index * 0.2;
    const duration = baseDuration * speedFactor * 1000;

    setTimeout(() => {
      horse.style.transitionDuration = `${duration / 1000}s`;
      horse.style.left = 'calc(100% - 160px)';
    }, 100);

    if (name === winner) {
      animations.push(new Promise(resolve => {
        setTimeout(resolve, duration + 100);
      }));
    }
  });

  return Promise.all(animations);
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
      await renderAnimatedRace(data.participants, data.winner);

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

function toggleMusic(forcePlay = false) {
  const music = document.getElementById('bgMusic');
  if (music.paused || forcePlay) {
    music.volume = 1;
    music.play().catch(err => {
      console.warn('Music play blocked by browser:', err);
    });
  } else {
    music.pause();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateHorseSelector();

  // Automatically try to play music after first user interaction
  document.addEventListener('click', () => {
    toggleMusic(true);
  }, { once: true });
});
