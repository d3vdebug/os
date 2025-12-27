/**
 * Game modules for DEVDEBUG OS
 */

export const GAME_CONSTANTS = {
    SNAKE: {
        TILE_SIZE: 20,
        GAME_SPEED: 150,
        INITIAL_POSITION: { x: 10, y: 10 }
    },
    TENNIS: {
        WINNING_SCORE: 5,
        FPS: 60,
        BALL_RADIUS: 8,
        INITIAL_BALL_SPEED: 6
    }
};

/**
 * Initializes the Snake game window
 * @param {HTMLElement} windowElement - The window element to initialize
 * @param {Object} WindowManager - The system window manager
 */
export function initializeSnakeWindow(windowElement, WindowManager) {
    windowElement.querySelector('.window-content').innerHTML = `
              <div class="flex flex-col h-full bg-black">
                  <!-- Enhanced Header -->
                  <div class="flex justify-between items-center p-3 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 2px solid var(--primary-color);">
                      <div class="flex items-center space-x-4">
                          <div class="flex items-center space-x-2">
                              <i data-lucide="activity" class="w-4 h-4" style="color: var(--primary-color);"></i>
                              <span class="text-xs font-bold" style="color: var(--text-color-dim);">STATUS:</span>
                              <span id="game-status" class="text-sm font-bold px-2 py-1 rounded" style="color: var(--accent-color); background-color: rgba(0, 255, 255, 0.1);">READY</span>
                          </div>
                      </div>
                      <div class="flex items-center space-x-6">
                          <div class="flex items-center space-x-2">
                              <i data-lucide="trophy" class="w-4 h-4" style="color: var(--accent-color);"></i>
                              <span class="text-xs font-bold" style="color: var(--text-color-dim);">SCORE:</span>
                              <span id="snake-score" class="text-xl font-mono font-bold px-3 py-1 rounded" style="color: var(--accent-color); background-color: rgba(0, 255, 255, 0.1); min-width: 60px; text-align: center;">0</span>
                          </div>
                          <div class="flex items-center space-x-2">
                              <i data-lucide="star" class="w-4 h-4" style="color: var(--danger-color);"></i>
                              <span class="text-xs font-bold" style="color: var(--text-color-dim);">BEST:</span>
                              <span id="snake-high-score" class="text-sm font-mono font-bold px-2 py-1 rounded" style="color: var(--danger-color); background-color: rgba(255, 69, 0, 0.1);">0</span>
                          </div>
                      </div>
                  </div>

                  <!-- Game Canvas Container -->
                  <div id="snake-container" class="flex-grow flex items-center justify-center relative" style="background: #000;">
                      <canvas id="snake-canvas" width="420" height="420"></canvas>
                  </div>

                  <!-- Enhanced Footer with Controls -->
                  <div class="p-3 flex-shrink-0" style="background-color: var(--primary-color-darker); border-top: 2px solid var(--primary-color);">
                      <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-4 text-xs" style="color: var(--text-color-dim);">
                              <div class="flex items-center space-x-1">
                                  <i data-lucide="arrow-up" class="w-3 h-3"></i>
                                  <i data-lucide="arrow-down" class="w-3 h-3"></i>
                                  <i data-lucide="arrow-left" class="w-3 h-3"></i>
                                  <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                  <span class="ml-1">Move</span>
                              </div>
                              <div class="flex items-center space-x-1">
                                  <span class="px-1.5 py-0.5 rounded" style="background-color: var(--primary-color-dark);">SPACE</span>
                                  <span>Pause/Start</span>
                              </div>
                          </div>
                          <div class="text-xs" style="color: var(--text-color-dim); opacity: 0.7;">
                              Length: <span id="snake-length" class="font-bold" style="color: var(--primary-color);">3</span>
                          </div>
                      </div>
                  </div>
              </div>
          `;

    const canvas = windowElement.querySelector('#snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = windowElement.querySelector('#snake-score');
    const statusDisplay = windowElement.querySelector('#game-status');
    const highScoreDisplay = windowElement.querySelector('#snake-high-score');
    const lengthDisplay = windowElement.querySelector('#snake-length');

    // Initialize icons
    lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });

    // High score from localStorage
    let highScore = parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
    highScoreDisplay.textContent = highScore;

    // Game Constants
    const tileSize = GAME_CONSTANTS.SNAKE.TILE_SIZE;
    const tileCount = canvas.width / tileSize;
    const gameSpeed = 100; // Smoother movement

    // --- Game State ---
    let snake;
    let food;
    let velocity; // {x, y}
    let score;
    let inputQueue; // To handle rapid key presses
    let isGameOver;
    let isPaused;
    let gameInterval = null;
    let foodPulse = 0; // For food animation

    const generateFood = () => {
        let newFood;
        let onSnake;

        do {
            onSnake = false;
            // Generate random grid coordinates
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            // Check if the new food overlaps with the snake
            for (const segment of snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    onSnake = true;
                    break;
                }
            }
        } while (onSnake);

        food = newFood;
    };

    const drawRect = (x, y, color, isHead = false) => {
        const pixelX = x * tileSize;
        const pixelY = y * tileSize;

        // Draw full tile
        ctx.fillStyle = color;
        ctx.fillRect(pixelX, pixelY, tileSize, tileSize);

        // Add subtle highlight for head
        if (isHead) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(pixelX + 1, pixelY + 1, tileSize - 2, tileSize - 2);
        }
    };

    const drawFood = (x, y) => {
        const pixelX = x * tileSize;
        const pixelY = y * tileSize;
        const pulseSize = 1 + Math.sin(foodPulse) * 0.5;
        const size = tileSize - pulseSize * 2;

        const themeStyles = getComputedStyle(document.documentElement);
        const dangerColor = themeStyles.getPropertyValue('--danger-color').trim();

        // Outer glow
        ctx.shadowBlur = 6;
        ctx.shadowColor = dangerColor;
        ctx.fillStyle = dangerColor;
        ctx.fillRect(pixelX + pulseSize, pixelY + pulseSize, size, size);
        ctx.shadowBlur = 0;

        // Inner highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(pixelX + pulseSize + 1, pixelY + pulseSize + 1, size - 2, size - 2);
    };

    const drawMessage = (title, subtitle, color, showRestart = false) => {
        // Dark overlay with slight transparency
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.fillStyle = color;
        ctx.font = 'bold 32px Consolas, Monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 30);

        // Subtitle
        ctx.font = '16px Consolas, Monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 10);

        if (showRestart) {
            ctx.font = '14px Consolas, Monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 35);
        }

        ctx.shadowBlur = 0;
    };

    const drawGame = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * tileSize, 0);
            ctx.lineTo(i * tileSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * tileSize);
            ctx.lineTo(canvas.width, i * tileSize);
            ctx.stroke();
        }

        // Get current theme colors
        const themeStyles = getComputedStyle(document.documentElement);
        const primaryColor = themeStyles.getPropertyValue('--primary-color').trim();
        const accentColor = themeStyles.getPropertyValue('--accent-color').trim();
        const dangerColor = themeStyles.getPropertyValue('--danger-color').trim();

        // Animate food pulse
        foodPulse += 0.2;

        // Draw food with animation
        drawFood(food.x, food.y);

        // Draw snake with improved visuals
        snake.forEach((segment, index) => {
            const isHead = index === 0;
            const color = isHead ? accentColor : primaryColor;
            drawRect(segment.x, segment.y, color, isHead);
        });

        // Update displays
        scoreDisplay.textContent = score;
        lengthDisplay.textContent = snake.length;

        if (isPaused) {
            statusDisplay.textContent = 'PAUSED';
            statusDisplay.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
            drawMessage("PAUSED", "Press SPACE to resume.", accentColor);
        } else if (isGameOver) {
            statusDisplay.textContent = 'GAME OVER';
            statusDisplay.style.backgroundColor = 'rgba(255, 69, 0, 0.2)';
            if (gameInterval) clearInterval(gameInterval);
            drawMessage("GAME OVER", `Final Score: ${score} | Length: ${snake.length}`, dangerColor, true);
        } else {
            statusDisplay.textContent = 'RUNNING';
            statusDisplay.style.backgroundColor = 'rgba(0, 255, 65, 0.2)';
        }
    };

    const checkSelfCollision = (head) => {
        // Check if the new head position hits any existing body segment
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    };

    const updateGame = () => {
        // Process the next input from the queue
        if (inputQueue.length > 0) {
            const nextVelocity = inputQueue.shift();
            // Prevent reversing into self
            if (nextVelocity.x !== -velocity.x || nextVelocity.y !== -velocity.y) {
                velocity = nextVelocity;
            }
        }

        const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

        // Check for collision (Wall or Self)
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || checkSelfCollision(head)) {
            isGameOver = true;
            return;
        }

        // Add new head
        snake.unshift(head);

        // Check for food consumption
        if (head.x === food.x && head.y === food.y) {
            score++;
            // Update high score in real-time
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore.toString());
                highScoreDisplay.textContent = highScore;
            }
            generateFood(); // Grow the snake and place new food
        } else {
            snake.pop(); // Remove tail if no food eaten
        }
    };

    const resetGame = () => {
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore.toString());
            highScoreDisplay.textContent = highScore;
        }

        // Fixed starting position and length
        const initPos = GAME_CONSTANTS.SNAKE.INITIAL_POSITION;
        snake = [{ x: initPos.x, y: initPos.y }, { x: initPos.x - 1, y: initPos.y }, { x: initPos.x - 2, y: initPos.y }];
        velocity = { x: 1, y: 0 }; // Start moving right
        score = 0;
        isGameOver = false;
        inputQueue = [];
        isPaused = true;
        foodPulse = 0;
        scoreDisplay.textContent = '0';
        lengthDisplay.textContent = '3';
        statusDisplay.textContent = 'READY';
        statusDisplay.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
        generateFood();
        drawGame();
    };

    const gameLoop = () => {
        if (!isPaused && !isGameOver) {
            updateGame();
            drawGame();
        } else if (isGameOver) {
            statusDisplay.textContent = 'GAME OVER';
            // Stop the interval and draw the game over screen
            if (gameInterval) clearInterval(gameInterval);
            drawGame();
        }
    };

    const startGameLoop = () => {
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    };

    // Input Handler
    const keyHandler = (e) => {
        // Only process keys if the snake window is the active (top-most) window.
        if (parseInt(windowElement.style.zIndex) !== WindowManager.nextZIndex) {
            return;
        }

        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            if (isGameOver) {
                // Update high score before restarting
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('snakeHighScore', highScore.toString());
                    highScoreDisplay.textContent = highScore;
                }
                // Restart the game completely
                resetGame();
                isPaused = false;
                startGameLoop();
                return;
            }

            // Pause/Unpause
            isPaused = !isPaused;
            if (!isPaused) {
                startGameLoop();
                statusDisplay.textContent = 'RUNNING';
            } else {
                if (gameInterval) clearInterval(gameInterval);
            }
            drawGame();
            return;
        }

        if (isPaused || isGameOver) return;

        // Queue the input instead of setting it directly
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
                inputQueue.push({ x: -1, y: 0 });
                break;
            case 'ArrowUp':
            case 'w':
                inputQueue.push({ x: 0, y: -1 });
                break;
            case 'ArrowRight':
            case 'd':
                inputQueue.push({ x: 1, y: 0 });
                break;
            case 'ArrowDown':
            case 's':
                inputQueue.push({ x: 0, y: 1 });
                break;
        }
    };

    // Attach the listener to the document, assuming the game is played when window is open.
    document.addEventListener('keydown', keyHandler);

    // Cleanup function
    windowElement.cleanup = () => {
        document.removeEventListener('keydown', keyHandler);
        if (gameInterval) clearInterval(gameInterval);
    };

    // Initial setup
    resetGame();
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    drawMessage("PRESS SPACE TO START", "Use Arrow Keys or WASD to move", primaryColor);
}

/**
 * Initializes the Pong game window
 * @param {HTMLElement} windowElement - The window element to initialize
 * @param {Object} WindowManager - The system window manager
 */
export function initializePongWindow(windowElement, WindowManager) {
    windowElement.querySelector('.window-content').innerHTML = `
              <div class="flex flex-col h-full bg-black">
                  <!-- Minimal Header -->
                  <div class="flex justify-center items-center p-2" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                      <span id="player-score" class="text-2xl font-mono font-bold px-4" style="color: var(--accent-color);">0</span>
                      <span class="text-xl px-2" style="color: var(--primary-color);">|</span>
                      <span id="cpu-score" class="text-2xl font-mono font-bold px-4" style="color: var(--danger-color);">0</span>
                  </div>

                  <!-- Game Canvas -->
                  <div id="tennis-container" class="flex-grow flex items-center justify-center relative bg-black">
                      <canvas id="pong-canvas" class="cursor-none"></canvas>
                      <!-- Start Screen -->
                      <div id="tennis-start-screen" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90" style="color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                          <div class="text-center">
                              <div class="text-2xl font-bold mb-4" style="color: var(--primary-color);">TERMINAL TENNIS</div>
                              <div class="text-sm mb-4">First to 5 points wins</div>
                              <div class="text-xs mb-4">
                                  <div>SPACE: Start/Pause Game</div>
                                  <div>MOUSE: Move Your Paddle</div>
                              </div>
                              <div class="text-lg font-mono" style="color: var(--accent-color);">PRESS SPACE TO START</div>
                          </div>
                      </div>
                  </div>

              </div>
          `;

    const canvas = windowElement.querySelector('#pong-canvas');
    const ctx = canvas.getContext('2d');
    const playerScoreEl = windowElement.querySelector('#player-score');
    const cpuScoreEl = windowElement.querySelector('#cpu-score');
    const startScreen = windowElement.querySelector('#tennis-start-screen');

    let gameInterval = null;
    let gameOver = false;
    let isPaused = true;
    const WINNING_SCORE = GAME_CONSTANTS.TENNIS.WINNING_SCORE;

    // Game objects - will be initialized after canvas is sized
    let ball, player, cpu, net;

    const drawRect = (x, y, w, h, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    };

    const drawCircle = (x, y, r, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    };

    const drawNet = (color) => {
        for (let i = 0; i <= canvas.height; i += 25) {
            ctx.fillStyle = color;
            ctx.fillRect(net.x, net.y + i, net.width, net.height);
        }
    };

    const initGameObjects = () => {
        ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: GAME_CONSTANTS.TENNIS.BALL_RADIUS,
            speed: GAME_CONSTANTS.TENNIS.INITIAL_BALL_SPEED,
            velX: GAME_CONSTANTS.TENNIS.INITIAL_BALL_SPEED,
            velY: GAME_CONSTANTS.TENNIS.INITIAL_BALL_SPEED
        };
        player = {
            x: 10,
            y: (canvas.height - 80) / 2,
            width: 10,
            height: 80,
            score: 0
        };
        cpu = {
            x: canvas.width - 20,
            y: (canvas.height - 80) / 2,
            width: 10,
            height: 80,
            score: 0,
            maxSpeed: 5
        };
        net = {
            x: (canvas.width - 4) / 2,
            y: 0,
            width: 4,
            height: 15
        };
    };

    const resetBall = () => {
        if (!ball) return;
        ball.x = canvas.width / 2;
        ball.y = Math.random() * (canvas.height - 100) + 50;
        ball.speed = GAME_CONSTANTS.TENNIS.INITIAL_BALL_SPEED;
        // Alternate direction or random if first time
        let direction = (ball.velX !== undefined && ball.velX > 0) ? -1 : 1;
        ball.velX = direction * ball.speed;
        ball.velY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 2);
    };

    const resetGame = () => {
        if (!player || !cpu || !ball) return;
        player.score = 0;
        cpu.score = 0;
        gameOver = false;
        isPaused = true;
        resetBall();
        playerScoreEl.textContent = '0';
        cpuScoreEl.textContent = '0';
    };

    // Resize canvas and reposition elements
    const resizeAndPosition = () => {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        if (!ball || !player || !cpu || !net) {
            initGameObjects();
        } else {
            player.y = (canvas.height - player.height) / 2;
            cpu.x = canvas.width - cpu.width - 10;
            cpu.y = (canvas.height - cpu.height) / 2;
            net.x = (canvas.width - net.width) / 2;
            if (ball) resetBall();
        }
    };

    const collision = (b, p) => {
        return b.x + b.radius > p.x && b.x - b.radius < p.x + p.width &&
            b.y + b.radius > p.y && b.y - b.radius < p.y + p.height;
    };

    const update = () => {
        if (gameOver || !ball || !player || !cpu) return;

        // Move ball
        ball.x += ball.velX;
        ball.y += ball.velY;

        // AI for CPU paddle
        let targetY = ball.y - (cpu.y + cpu.height / 2);
        let move = targetY * 0.1;
        if (Math.abs(move) > cpu.maxSpeed) {
            move = cpu.maxSpeed * Math.sign(move);
        }
        cpu.y += move;

        // Clamp CPU paddle
        if (cpu.y < 0) cpu.y = 0;
        if (cpu.y > canvas.height - cpu.height) cpu.y = canvas.height - cpu.height;

        // Wall collision (top/bottom)
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.velY = -ball.velY;
            // Clamp ball position
            if (ball.y - ball.radius < 0) ball.y = ball.radius;
            if (ball.y + ball.radius > canvas.height) ball.y = canvas.height - ball.radius;
        }

        // Paddle collision
        if (collision(ball, player)) {
            let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
            let angleRad = (Math.PI / 4) * collidePoint;
            ball.velX = Math.abs(ball.velX);
            ball.velY = ball.speed * Math.sin(angleRad);
            ball.speed = Math.min(ball.speed + 0.3, 15);
            // Prevent ball from getting stuck in paddle
            ball.x = player.x + player.width + ball.radius;
        } else if (collision(ball, cpu)) {
            let collidePoint = (ball.y - (cpu.y + cpu.height / 2)) / (cpu.height / 2);
            let angleRad = (Math.PI / 4) * collidePoint;
            ball.velX = -Math.abs(ball.velX);
            ball.velY = ball.speed * Math.sin(angleRad);
            ball.speed = Math.min(ball.speed + 0.3, 15);
            // Prevent ball from getting stuck in paddle
            ball.x = cpu.x - ball.radius;
        }

        // Scoring
        if (ball.x - ball.radius < 0) {
            cpu.score++;
            cpuScoreEl.textContent = cpu.score;
            resetBall();
        } else if (ball.x + ball.radius > canvas.width) {
            player.score++;
            playerScoreEl.textContent = player.score;
            resetBall();
        }
    };

    const drawMessage = (title, subtitle, color) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = color;
        ctx.font = 'bold 32px Consolas, Monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = '16px Consolas, Monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 20);
    };

    const render = () => {
        if (!ball || !player || !cpu || !net) return;

        const theme = getComputedStyle(document.documentElement);
        const primaryColor = theme.getPropertyValue('--primary-color').trim();
        const accentColor = theme.getPropertyValue('--accent-color').trim();
        const dangerColor = theme.getPropertyValue('--danger-color').trim();

        // Draw background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw net
        drawNet(primaryColor);

        // Draw paddles
        drawRect(player.x, player.y, player.width, player.height, accentColor);
        drawRect(cpu.x, cpu.y, cpu.width, cpu.height, dangerColor);

        // Draw ball
        drawCircle(ball.x, ball.y, ball.radius, primaryColor);

        // Check for game over
        if (!gameOver && (player.score >= WINNING_SCORE || cpu.score >= WINNING_SCORE)) {
            gameOver = true;
            isPaused = true; // Also pause on game over
            const playerWon = player.score >= WINNING_SCORE;
            drawMessage(
                playerWon ? "YOU WIN" : "CPU WINS",
                `Press SPACE to restart`,
                playerWon ? accentColor : dangerColor
            );
            canvas.classList.remove('cursor-none');
            if (gameInterval) clearInterval(gameInterval);
            gameInterval = null;
        }


        // Show/hide start screen
        startScreen.style.display = (isPaused && !gameOver) ? 'flex' : 'none';
    };

    const gameLoop = () => {
        if (!isPaused && !gameOver) {
            update();
        }
        render();
    };

    const mouseMoveHandler = (e) => {
        if (!player || gameOver) return;
        let rect = canvas.getBoundingClientRect();
        player.y = e.clientY - rect.top - player.height / 2;
        // Clamp paddle position
        if (player.y < 0) player.y = 0;
        if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
    };

    const keyHandler = (e) => {
        // Only process keys if the tennis window is the active (top-most) window.
        if (parseInt(windowElement.style.zIndex) !== WindowManager.nextZIndex) {
            return;
        }

        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            if (gameOver) {
                // Restart the game
                resetGame();
                isPaused = false;
                canvas.classList.add('cursor-none');
                gameInterval = setInterval(gameLoop, 1000 / GAME_CONSTANTS.TENNIS.FPS);
            } else {
                // Pause/Unpause
                isPaused = !isPaused;
                if (!isPaused) {
                    gameInterval = setInterval(gameLoop, 1000 / GAME_CONSTANTS.TENNIS.FPS);
                } else {
                    if (gameInterval) clearInterval(gameInterval);
                    gameInterval = null;
                }
                render(); // Update display
            }
        }
    };

    const clickHandler = () => {
        if (gameOver) {
            resetGame();
            isPaused = false;
            canvas.classList.add('cursor-none');
            gameInterval = setInterval(gameLoop, 1000 / GAME_CONSTANTS.TENNIS.FPS);
        }
    };

    // Use ResizeObserver to handle window resizing
    const resizeObserver = new ResizeObserver(() => {
        resizeAndPosition();
    });
    resizeObserver.observe(canvas.parentElement);

    // Initial setup
    resizeAndPosition();
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    drawMessage("PRESS SPACE TO START", "Use mouse to move paddle", primaryColor);

    // Start paused
    gameLoop(); // Draw initial state
    windowElement.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('click', clickHandler);
    document.addEventListener('keydown', keyHandler);

    // Cleanup
    windowElement.cleanup = () => {
        resizeObserver.disconnect();
        canvas.removeEventListener('click', clickHandler);
        document.removeEventListener('keydown', keyHandler);
        if (gameInterval) clearInterval(gameInterval);
        windowElement.removeEventListener('mousemove', mouseMoveHandler);
    };
}

/**
* Initializes the TicTacToe game window
* @param {HTMLElement} windowElement - The window element to initialize
*/
export function initializeTicTacToeWindow(windowElement) {
    windowElement.querySelector('.window-content').innerHTML = `
       <div class="flex flex-col h-full bg-black">
           <!-- Header -->
           <div class="flex justify-center items-center p-3 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 2px solid var(--primary-color);">
               <div class="flex items-center space-x-4">
                   <div class="flex items-center space-x-2">
                       <i data-lucide="grid-3x3" class="w-4 h-4" style="color: var(--primary-color);"></i>
                       <span class="text-xs font-bold" style="color: var(--text-color-dim);">STATUS:</span>
                       <span id="tictactoe-status" class="text-sm font-bold px-2 py-1 rounded" style="color: var(--accent-color); background-color: rgba(0, 255, 255, 0.1);">Your Turn</span>
                   </div>
               </div>
           </div>

           <!-- Game Board -->
           <div class="flex-grow flex items-center justify-center p-4">
               <div id="tictactoe-board" class="grid grid-cols-3 gap-2 w-64 h-64">
                   <!-- Cells will be generated here -->
               </div>
           </div>

           <!-- Footer -->
           <div class="p-3 flex-shrink-0 flex justify-center" style="background-color: var(--primary-color-darker); border-top: 2px solid var(--primary-color);">
               <button id="tictactoe-reset" class="px-4 py-2 text-sm font-bold" style="background-color: var(--primary-color); color: black; border: 1px solid var(--primary-color);">New Game</button>
           </div>
       </div>
   `;

    const statusEl = windowElement.querySelector('#tictactoe-status');
    const boardEl = windowElement.querySelector('#tictactoe-board');
    const resetBtn = windowElement.querySelector('#tictactoe-reset');

    // Initialize icons
    lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });

    // Game state
    let board = Array(9).fill(null);
    let currentPlayer = 'X'; // User is X, Computer is O
    let gameOver = false;

    // Create board cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'flex items-center justify-center text-4xl font-bold cursor-pointer border-2 transition-colors';
        cell.style.borderColor = 'var(--primary-color-dark)';
        cell.style.color = 'var(--primary-color)';
        cell.style.width = '80px';
        cell.style.height = '80px';
        cell.style.overflow = 'hidden';
        cell.dataset.index = i;
        cell.addEventListener('click', () => makeMove(i));
        boardEl.appendChild(cell);
    }

    const cells = boardEl.querySelectorAll('div');

    function makeMove(index) {
        if (board[index] || gameOver || currentPlayer !== 'X') return;

        board[index] = 'X';
        cells[index].textContent = 'X';
        cells[index].style.color = 'var(--accent-color)';

        if (checkWinner()) {
            statusEl.textContent = 'You Win!';
            statusEl.style.backgroundColor = 'rgba(0, 255, 65, 0.2)';
            gameOver = true;
            return;
        }

        if (board.every(cell => cell)) {
            statusEl.textContent = 'Draw!';
            statusEl.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            gameOver = true;
            return;
        }

        currentPlayer = 'O';
        statusEl.textContent = 'Computer\'s Turn';
        statusEl.style.backgroundColor = 'rgba(255, 69, 0, 0.2)';

        // Computer move after a short delay
        setTimeout(computerMove, 500);
    }

    function computerMove() {
        if (gameOver) return;

        // Simple AI: random empty cell
        const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        if (emptyCells.length === 0) return;

        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomIndex] = 'O';
        cells[randomIndex].textContent = 'O';
        cells[randomIndex].style.color = 'var(--danger-color)';

        if (checkWinner()) {
            statusEl.textContent = 'Computer Wins!';
            statusEl.style.backgroundColor = 'rgba(255, 69, 0, 0.2)';
            gameOver = true;
            return;
        }

        if (board.every(cell => cell)) {
            statusEl.textContent = 'Draw!';
            statusEl.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            gameOver = true;
            return;
        }

        currentPlayer = 'X';
        statusEl.textContent = 'Your Turn';
        statusEl.style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
    }

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                // Highlight winning cells
                cells[a].style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                cells[b].style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                cells[c].style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                return true;
            }
        }
        return false;
    }

    function resetGame() {
        board = Array(9).fill(null);
        currentPlayer = 'X';
        gameOver = false;
        statusEl.textContent = 'Your Turn';
        statusEl.style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.backgroundColor = 'transparent';
        });
    }

    resetBtn.addEventListener('click', resetGame);

    // Initial game state
    resetGame();
}
