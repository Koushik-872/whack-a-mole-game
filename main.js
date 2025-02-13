const cursor = document.querySelector('.cursor');
const holes = [...document.querySelectorAll('.hole')];
const scoreEl = document.querySelector('.score span');
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const messageBox = document.createElement("div");

let score = 0;
let timeLeft = 30;
let timerId = null;
let gameRunning = false;
let moleSpeed = 1500; // Initial mole speed (1.5s)

const sound = new Audio("assets/smash.mp3");

// Message Box Styling
messageBox.classList.add("message-box");
document.body.appendChild(messageBox);
messageBox.style.display = "none";

function run() {
    if (!gameRunning) return;

    const i = Math.floor(Math.random() * holes.length);
    const hole = holes[i];
    let timer = null;

    const img = document.createElement('img');
    img.classList.add('mole');
    img.src = 'assets/mole.png';
    img.draggable = false;

    img.addEventListener('click', () => {
        if (!gameRunning) return;
        score += 10;
        sound.play();
        scoreEl.textContent = score;
        img.src = 'assets/mole-whacked.png';
        clearTimeout(timer);
        setTimeout(() => {
            hole.removeChild(img);
            run();
        }, 500);
    });

    hole.appendChild(img);

    timer = setTimeout(() => {
        if (hole.contains(img)) {
            hole.removeChild(img);
        }
        run();
    }, moleSpeed);
}

// Timer function
function startTimer() {
    timeLeft = 30;
    timeEl.textContent = timeLeft;
    moleSpeed = 1500; // Reset speed at start
    timerId = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;

        // After 15 seconds, make the game faster
        if (timeLeft === 15) {
            moleSpeed = 800; // Reduce mole appearance time to 0.8s
        }

        if (timeLeft <= 0) {
            stopGame();
        }
    }, 1000);
}

// Start game
function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    score = 0;
    scoreEl.textContent = score;
    messageBox.style.display = "none";
    startTimer();
    run();
}

// Stop game
function stopGame() {
    gameRunning = false;
    clearInterval(timerId);
    timeEl.textContent = "0";

    messageBox.innerHTML = `
        <h2>Game Over!</h2>
        <p>Your Score: <strong>${score}</strong></p>
        <button onclick="restartGame()">Play Again</button>
        <button onclick="exitGame()">Exit</button>
    `;
    messageBox.style.display = "flex";
}

// Restart game function
function restartGame() {
    messageBox.style.display = "none";
    startGame();
}

// Exit game function
function exitGame() {
    messageBox.style.display = "none";
    alert("Thanks for playing!");
    location.reload();
}

// Mouse movement
window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px';
    cursor.style.left = e.pageX + 'px';
});
window.addEventListener('mousedown', () => {
    cursor.classList.add('active');
});
window.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
});

// Button event listeners
startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
