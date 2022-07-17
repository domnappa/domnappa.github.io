const actions = document.querySelectorAll('.action');
const tiles = document.querySelectorAll('.board-tile');

const combos = [
  ["dodge-left","short-punch-right","long-punch-left","duck-right","short-punch-left"],
  ["dodge-left","short-punch-right","long-punch-left","duck-right","short-punch-left"],
  ["dodge-left","short-punch-right","long-punch-left","duck-right","short-punch-left"],
  ["dodge-left","short-punch-right","long-punch-left","duck-right","short-punch-left"],
  ["dodge-left","short-punch-right","long-punch-left","duck-right","short-punch-left"],
  ["dodge-left","short-punch-right","long-punch-left","duck-right","short-punch-left"],
  ["dodge-left","short-punch-right","long-punch-left","duck-right","short-punch-left"],
  ["dodge-left","short-punch-right","long-punch-left","duck-right","short-punch-left"],
  ["dodge-left","short-punch-right","long-punch-left","duck-right","short-punch-left"],
  ["dodge-left","short-punch-right","long-punch-left","duck-right","short-punch-left"]
]

const randomNum = Math.floor(Math.random() * (0 - combos.length)) + combos.length;

const correctCombo = combos[randomNum];

function dragStart(e) {
  this.style.opacity = '0.4';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
  e.dataTransfer.setData('text/plain', e.target.dataset.action);
}

function dragEnd(e) {
  this.setAttribute('draggable', 'false');
}

function dragEnter(e) {
  e.preventDefault();
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  if (e.target.classList.contains('locked-action')) {
    return;
  }
  this.innerHTML = e.dataTransfer.getData('text/html');
  e.target.classList.add('has-action');
}

function completeGame() {
  var confettiSettings = {"target":"confetti-canvas","max":"800","size":"1","animate":true,"props":["circle","square","triangle","line"],"colors":[[165,104,246],[230,61,135],[0,199,228],[253,214,126]],"clock":"25","rotate":true,"width":"1680","height":"914","start_from_edge":false,"respawn":true};
  var confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();
}

function removeAction(e) {
  if (e.target.classList.contains('locked-action')) {
    return;
  }
  this.textContent = '';
  e.target.classList.remove('has-action')
}

function refreshSelection() {
  let selections = document.querySelectorAll('.action');
  selections.forEach((action) => {
    action.setAttribute('draggable','true');
    action.style.opacity = '1';
  })
}

function checkRowResults() {
  let submittedGuess = [];
  const answerRow = document.querySelector('.board-row--active');
  const guesses = answerRow.querySelectorAll('.board-tile');
  const assignedGuesses = answerRow.querySelectorAll('.has-action');

  if (assignedGuesses.length !== 5) {
    return;
  }

  guesses.forEach((guess, index) => {
    let actionID = guess.querySelector('.action-image').dataset.action
    guess.classList.add(checkAction(actionID,index), "locked-action");
  });

  answerRow.classList.remove('board-row--active');

  if (answerRow.querySelectorAll('.correct').length === 5) {
    completeGame();
    return;
  }

  answerRow.nextElementSibling.classList.add('board-row--active');
  refreshSelection();
}

function checkAction(action,index) {
  for (let i=0; i<correctCombo.length;i++) {
    if (correctCombo[i] === action && index === i) {
      return "correct"
    } else if (correctCombo[i] === action) {
      return "present"
    }
  }
  return "absent"
}

actions.forEach(action => {
  action.addEventListener('dragstart', dragStart);
  action.addEventListener('dragend', dragEnd);
});

tiles.forEach(tile => {
  tile.addEventListener('dragenter', dragEnter)
  tile.addEventListener('dragover', dragOver);
  tile.addEventListener('drop', drop);
  tile.addEventListener('click', removeAction);
});

document.body.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    checkRowResults();
  }
})