let score = 0;
const field = document.querySelector('.field');
const avatar = document.getElementById('avatar');
const coin = document.getElementById('coin');
const bullet = document.getElementById('bullet');
let isGameOver = false;

// sounds
const coinSound = new Audio('./audio/smw_coin.wav');
const stepSound = new Audio('./audio/smw_footstep.wav');
const gaveOverSound = new Audio('./audio/smw_gameover.wav');
stepSound.volume = 0.2;
gaveOverSound.volume = 0.2;

// ---------------------------------------

const init = () => {
  document.body.classList.remove('gameover');
  avatar.style.top = '100px';
  avatar.style.left = '100px';
  updateScore(0);
  moveCoin();
  moveBullet();
};

const movePosition = (element, amount, direction) => {
  let currentPos;
  if (direction === 'vertical') {
    currentPos = extractPos(element.style.top);
    element.style.top = `${currentPos + amount}px`;
  } else {
    currentPos = extractPos(element.style.left);
    element.style.left = `${currentPos + amount}px`;
  }
};

const manageFacingDirection = (movingDirection) => {
  if (movingDirection === 'right') {
    if (avatar.classList.contains('isFacedLeft'))
      avatar.classList.remove('isFacedLeft');
  } else {
    if (!avatar.classList.contains('isFacedLeft'))
      avatar.classList.add('isFacedLeft');
  }
};

const isTouching = (a, b) => {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.top + aRect.height < bRect.top ||
    aRect.top > bRect.top + bRect.height ||
    aRect.left + aRect.width < bRect.left ||
    aRect.left > bRect.left + bRect.width
  );
};

const extractPos = (position) => {
  if (!position) return 100;
  return parseInt(position.slice(0, -2));
};

const moveCoin = () => {
  const x = Math.floor(Math.random() * (field.clientWidth - 50));
  const y = Math.floor(Math.random() * (field.clientHeight - 50));
  coin.style.left = `${x}px`;
  coin.style.top = `${y}px`;
};

const moveBullet = () => {
  const y = Math.floor(Math.random() * (field.clientHeight - 50));
  bullet.style.top = `${y}px`;
};

const updateScore = (newScore) => {
  if (newScore != null) {
    score = newScore;
  } else {
    score++;
  }
  document.getElementById('score').textContent = score;
};

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'Up') {
    if (avatar.getBoundingClientRect().top < field.getBoundingClientRect().top)
      return;
    movePosition(avatar, -50, 'vertical');
  }
  if (e.key === 'ArrowDown' || e.key === 'Down') {
    if (
      avatar.getBoundingClientRect().bottom >
      field.getBoundingClientRect().bottom
    )
      return;
    movePosition(avatar, 50, 'vertical');
  }
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    if (
      avatar.getBoundingClientRect().right > field.getBoundingClientRect().right
    )
      return;
    movePosition(avatar, 50, 'horizontal');
    manageFacingDirection('right');
  }
  if (e.key === 'ArrowLeft' || e.key === 'Left') {
    if (
      avatar.getBoundingClientRect().left < field.getBoundingClientRect().left
    )
      return;
    movePosition(avatar, -50, 'horizontal');
    manageFacingDirection('left');
  }
  stepSound.play();
  if (isTouching(avatar, coin)) {
    coinSound.play();
    updateScore();
    moveCoin();
    moveBullet();
  }
  setInterval(() => {
    if (isTouching(avatar, bullet) && !isGameOver) {
      isGameOver = true;
      gaveOverSound.play();
      document.body.classList.add('gameover');
      setTimeout(() => {
        isGameOver = false;
        init();
      }, 2500);
    }
  }, 800);
});

init();
