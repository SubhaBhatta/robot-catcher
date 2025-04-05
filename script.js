const game = document.getElementById("game");
const robot = document.getElementById("robot");
const scoreboard = document.getElementById("scoreboard");
const healthBar = document.getElementById("health-bar");

const catchSound = document.getElementById("catchSound");
const missSound = document.getElementById("missSound");
const gameOverSound = document.getElementById("gameOverSound");

let robotX = 170;
let score = 0;
let lives = 3;
let level = 1;
let speed = 80;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") robotX = Math.max(0, robotX - 20);
  else if (e.key === "ArrowRight") robotX = Math.min(340, robotX + 20);
  robot.style.left = robotX + "px";
});

function createFallingObject(type) {
  const obj = document.createElement("div");
  obj.classList.add("object", type);
  obj.style.left = `${Math.floor(Math.random() * 360)}px`;
  obj.style.top = "0px";
  game.appendChild(obj);

  let y = 0;
  const fall = setInterval(() => {
    y += 5;
    obj.style.top = y + "px";

    const objX = parseInt(obj.style.left);
    const caught = objX >= robotX - 20 && objX <= robotX + 60;

    if (y >= 440) {
      clearInterval(fall);
      game.removeChild(obj);

      if (type === "bolt" && caught) {
        score++;
        catchSound.play();
      } else if ((type === "bolt" && !caught) || (type === "enemy" && caught)) {
        lives--;
        missSound.play();
      }

      if (lives <= 0) {
        gameOverSound.play();
        alert("💥 Game Over!\nFinal Score: " + score);
        resetGame();
        return;
      }

      updateStats();
    }
  }, speed);
}

function updateStats() {
  level = Math.floor(score / 5) + 1;
  speed = Math.max(10, 30 - level * 2);
  scoreboard.textContent = `Score: ${score} | Level: ${level}`;
  healthBar.style.width = `${(lives / 3) * 100}%`;
}

function resetGame() {
  score = 0;
  lives = 3;
  level = 1;
  speed = 80;
  updateStats();
}

function gameLoop() {
  const isEnemy = Math.random() < 0.3;
  createFallingObject(isEnemy ? "enemy" : "bolt");
  setTimeout(gameLoop, Math.max(300, 1000 - level * 50));
}

updateStats();
gameLoop();
