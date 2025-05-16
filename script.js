const board = document.getElementById('board');
const diceBtn = document.getElementById('roll-dice');
const diceResult = document.getElementById('dice-result');
const questionModal = document.getElementById('question-modal');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const timerEl = document.getElementById('timer');
const winnerMessage = document.getElementById('winner-message');

let currentPlayer = 0;
let positions = [0, 0];
const players = [createPlayer('red'), createPlayer('yellow')];
let timer;
let boardSquares = [];

const ladders = {
  3: 22,
  5: 8,
  11: 26,
  20: 29
};

const snakes = {
  27: 1,
  21: 9,
  17: 4,
  19: 7
};

const questionSquares = [6, 13, 24, 30, 37, 44, 51, 58, 65, 72];

function createBoard() {
  for (let i = 99; i >= 0; i--) {
    const square = document.createElement('div');
    square.classList.add('square');
    if (ladders[i]) square.classList.add('ladder');
    else if (snakes[i]) square.classList.add('snake');
    else if (questionSquares.includes(i)) square.classList.add('question');
    else square.classList.add('normal');
    boardSquares.push(square);
    board.appendChild(square);
  }
  players.forEach(player => board.appendChild(player));
  updatePositions();
}

function createPlayer(color) {
  const div = document.createElement('div');
  div.classList.add('player', color);
  return div;
}

function updatePositions() {
  players.forEach((player, i) => {
    const pos = positions[i];
    const square = boardSquares[99 - pos];
    const offset = i === 0 ? 0 : 20;
    player.style.left = square.offsetLeft + offset + 'px';
    player.style.top = square.offsetTop + offset + 'px';
  });
}

diceBtn.addEventListener('click', () => {
  let roll = Math.floor(Math.random() * 6) + 1;
  diceResult.textContent = roll;

  let nextPos = positions[currentPlayer] + roll;
  if (nextPos > 99) nextPos = 99;
  positions[currentPlayer] = nextPos;

  if (questionSquares.includes(nextPos)) {
    showQuestion(nextPos);
  } else {
    handleMove();
  }
});

function handleMove() {
  let pos = positions[currentPlayer];
  if (ladders[pos]) {
    positions[currentPlayer] = ladders[pos];
  } else if (snakes[pos]) {
    positions[currentPlayer] = snakes[pos];
  }

  updatePositions();
  checkWinner();
  currentPlayer = 1 - currentPlayer;
}

function checkWinner() {
  if (positions[currentPlayer] === 99) {
    winnerMessage.classList.remove('hidden');
    winnerMessage.textContent = `Pemain ${currentPlayer + 1} menang!`;
    diceBtn.disabled = true;
  }
}

function showQuestion(pos) {
  diceBtn.disabled = true;
  questionModal.classList.remove('hidden');

  const q = questions[Math.floor(Math.random() * questions.length)];
  questionText.textContent = q.question;
  optionsDiv.innerHTML = '';

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => {
      clearInterval(timer);
      questionModal.classList.add('hidden');
      if (opt !== q.answer) {
        positions[currentPlayer] = Math.max(positions[currentPlayer] - 3, 0);
      }
      updatePositions();
      checkWinner();
      currentPlayer = 1 - currentPlayer;
      diceBtn.disabled = false;
    };
    optionsDiv.appendChild(btn);
  });

  let time = 10;
  timerEl.textContent = time;
  timer = setInterval(() => {
    time--;
    timerEl.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      questionModal.classList.add('hidden');
      positions[currentPlayer] = Math.max(positions[currentPlayer] - 3, 0);
      updatePositions();
      checkWinner();
      currentPlayer = 1 - currentPlayer;
      diceBtn.disabled = false;
    }
  }, 1000);
}

createBoard();
