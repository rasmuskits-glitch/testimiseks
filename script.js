const excerpts = [
  {
    title: 'A. H. Tammsaare – Tõde ja õigus I',
    text:
      'Kui Arno isaga koolimajja jõudis, olid tunnid juba alanud. Õpetaja seisis klassi ees ning vaatas tulijatele teraselt otsa, otsekui küsides, miks hilinemine pidi just täna juhtuma.',
  },
  {
    title: 'Lydia Koidula – valitud proosa',
    text:
      'Rahvas, kes oma keelt ja meelt kalliks peab, ei kao nii pea. Isegi vaiksel õhtul, kui küla teed on tühjad, püsib südames tunne, et homne päev toob jälle hääli ja tööd.',
  },
  {
    title: 'Eduard Vilde – Mäeküla piimamees',
    text:
      'Inimese saatus käib sageli tema enda tahtest mööda. Ta arvab end valitsevat päeva, ent õhtu toob vahel sõnumi, mis pöörab kõik teiseks ja sunnib silmi avaramalt vaatama.',
  },
  {
    title: 'Oskar Luts – Kevade',
    text:
      'Kevadine tuul liikus üle kooliõue ja pani kaseoksad sosistama. Poisid kogunesid ukse juurde, igaühel oma jutt suul, aga südames sama kärsitu ootus, et tund kord ometi lõpeks.',
  },
];

const select = document.getElementById('excerpt-select');
const newExcerptBtn = document.getElementById('new-excerpt-btn');
const resetBtn = document.getElementById('reset-btn');
const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');

const accuracyEl = document.getElementById('accuracy');
const wpmEl = document.getElementById('wpm');
const timerEl = document.getElementById('timer');
const progressEl = document.getElementById('progress');

let activeText = '';
let startedAt = null;
let timerInterval = null;

function populateSelect() {
  excerpts.forEach((excerpt, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = excerpt.title;
    select.appendChild(option);
  });
}

function chooseExcerpt(index) {
  const safeIndex = Math.max(0, Math.min(excerpts.length - 1, index));
  select.value = String(safeIndex);
  activeText = excerpts[safeIndex].text;
  resetExercise();
}

function renderText(typedText = '') {
  textDisplay.innerHTML = '';

  for (let i = 0; i < activeText.length; i += 1) {
    const span = document.createElement('span');
    span.textContent = activeText[i];
    span.classList.add('char');

    if (i < typedText.length) {
      span.classList.add(typedText[i] === activeText[i] ? 'correct' : 'wrong');
    } else if (i === typedText.length) {
      span.classList.add('current');
    }

    textDisplay.appendChild(span);
  }
}

function updateStats() {
  const typed = typingInput.value;
  const comparisonLength = Math.min(typed.length, activeText.length);

  let correct = 0;
  for (let i = 0; i < comparisonLength; i += 1) {
    if (typed[i] === activeText[i]) {
      correct += 1;
    }
  }

  const accuracy = typed.length === 0 ? 100 : Math.round((correct / typed.length) * 100);
  const progress = Math.min(100, Math.round((comparisonLength / activeText.length) * 100));

  accuracyEl.textContent = `${accuracy}%`;
  progressEl.textContent = `${progress}%`;

  const elapsedMinutes = startedAt ? (Date.now() - startedAt) / 60000 : 0;
  const words = typed.trim().length === 0 ? 0 : typed.trim().split(/\s+/).length;
  const wpm = elapsedMinutes > 0 ? Math.round(words / elapsedMinutes) : 0;
  wpmEl.textContent = `${wpm} sõna/min`;
}

function startTimer() {
  if (timerInterval) {
    return;
  }

  startedAt = Date.now();
  timerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    timerEl.textContent = `${elapsedSeconds} s`;
  }, 250);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  timerInterval = null;
}

function resetExercise() {
  stopTimer();
  startedAt = null;
  typingInput.value = '';
  timerEl.textContent = '0 s';
  wpmEl.textContent = '0 sõna/min';
  accuracyEl.textContent = '100%';
  progressEl.textContent = '0%';
  renderText('');
  typingInput.focus();
}

typingInput.addEventListener('input', () => {
  if (!startedAt && typingInput.value.length > 0) {
    startTimer();
  }

  const typed = typingInput.value;
  renderText(typed);
  updateStats();

  if (typed.length >= activeText.length) {
    stopTimer();
  }
});

select.addEventListener('change', () => {
  chooseExcerpt(Number(select.value));
});

newExcerptBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * excerpts.length);
  chooseExcerpt(randomIndex);
});

resetBtn.addEventListener('click', resetExercise);

populateSelect();
chooseExcerpt(0);
