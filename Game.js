window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Input Tracking
    const inputs = { left: false, right: false, up: false, down: false };
    let currentLevel = 0;

    // Player Attributes
    const player = {
        x: 60,
        y: 320,
        width: 20,
        height: 30,
        normalHeight: 30,
        slideHeight: 15,
        vx: 0,
        vy: 0,
        speed: 0.8,         
        maxSpeed: 6,        
        friction: 0.85,
        gravity: 0.45,       
        jumpForce: -9.5,
        isGrounded: false,
        isSliding: false,
        canWallJump: false,
        wallDir: 0
    };

    const tileSize = 20;

    // Levels Config
    const levels = [
        {
            playerStart: { x: 60, y: 320 },
            map: [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
                [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ]
        },
        {
            playerStart: { x: 60, y: 320 },
            map: [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
                [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                [1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ]
        }
    ];

    let map = levels[currentLevel].map;

    function resetPlayer() {
        player.x = levels[currentLevel].playerStart.x;
        player.y = levels[currentLevel].playerStart.y;
        player.vx = 0;
        player.vy = 0;
        player.isSliding = false;
        player.height = player.normalHeight;
    }

    // Input handlers
    window.addEventListener('keydown', e => handleKey(e.key, true));
    window.addEventListener('keyup', e => handleKey(e.key, false));

    function handleKey(key, isPressed) {
        if (key === 'ArrowLeft' || key === 'a' || key === 'A') inputs.left = isPressed;
        if (key === 'ArrowRight' || key === 'd' || key === 'D') inputs.right = isPressed;
        if (key === 'ArrowUp' || key === 'w' || key === 'W' || key === ' ') inputs.up = isPressed;
        if (key === 'ArrowDown' || key === 's' || key === 'S') inputs.down = isPressed;
    }

    function setupTouchBtn(id, inputKey) {
        const btn = document.getElementById(id);
        if (!btn) return; // Fail-safe
        
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); inputs[inputKey] = true; });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); inputs[inputKey] = false; });
        btn.addEventListener('mousedown', () => inputs[inputKey] = true);
        btn.addEventListener('mouseup', () => inputs[inputKey] = false);
        btn.addEventListener('mouseleave', () => inputs[inputKey] = false);
    }
    
    setupTouchBtn('btnLeft', 'left');
    setupTouchBtn('btnRight', 'right');
    setupTouchBtn('btnUp', 'up');
    setupTouchBtn('btnDown', 'down');

    function getCollisions(x, y, width, height) {
        const collisions = [];
        const startRow = Math.floor(y / tileSize);
        const endRow = Math.ceil((y + height) / tileSize);
        const startCol = Math.floor(x / tileSize);
        const endCol = Math.ceil((x + width) / tileSize);

        for (let r = startRow; r < endRow; r++) {
            for (let c = startCol; c < endCol; c++) {
                if (map[r] && map[r][c] > 0) {
                    collisions.push({
                        type: map[r][c],
                        x: c * tileSize,
                        y: r * tileSize
                    });
                }
            }
        }
        return collisions;
    }

    function gameLoop() {
        // Sliding Logic
        if (inputs.down && !player.isSliding && player.isGrounded) {
            player.isSliding = true;
            player.height = player.slideHeight;
            player.y += (player.normalHeight - player.slideHeight);
            
            if (inputs.left || player.vx < -1) player.vx = -player.maxSpeed * 1.6;
            else if (inputs.right || player.vx > 1) player.vx = player.maxSpeed * 1.6;
            else player.vx = (player.vx >= 0 ? 1 : -1) * player.maxSpeed * 1.6; 
        }

        if (!inputs.down && player.isSliding) {
            const headY = player.y - (player.normalHeight - player.slideHeight);
            const headCollisions = getCollisions(player.x, headY, player.width, player.normalHeight);
            const solidCeiling = headCollisions.some(c => c.type === 1);
            
            if (!solidCeiling) {
                player.isSliding = false;
                player.y -= (player.normalHeight - player.slideHeight);
                player.height = player.normalHeight;
            }
        }

        let accel = player.speed;
        let currentMaxSpeed = player.maxSpeed;

        if (player.isSliding) {
            accel = 0.02; 
            currentMaxSpeed = player.maxSpeed * 2.0; 
        }

        if (inputs.left) player.vx -= accel;
        if (inputs.right) player.vx += accel;

        if (!inputs.left && !inputs.right) {
            player.vx *= player.isSliding ? 0.98 : player.friction; 
        } else {
            player.vx *= player.isSliding ? 0.99 : player.friction;
        }

        if (player.vx > currentMaxSpeed) player.vx = currentMaxSpeed;
        if (player.vx < -currentMaxSpeed) player.vx = -currentMaxSpeed;

        player.vy += player.gravity;

        player.canWallJump = false;
        player.wallDir = 0;

        // Check X Axis
        player.x += player.vx;
        let xCollisions = getCollisions(player.x, player.y, player.width, player.height);
        for (let tile of xCollisions) {
            if (tile.type === 1) { 
                if (player.vx > 0) {
                    player.x = tile.x - player.width;
                    player.wallDir = 1; 
                }
                if (player.vx < 0) {
                    player.x = tile.x + tileSize;
                    player.wallDir = -1; 
                }
                if (!player.isGrounded) {
                    player.canWallJump = true;
                }
                player.vx = 0;
            }
            handleSpecialTiles(tile.type);
        }

        // Check Y Axis
        player.isGrounded = false;
        player.y += player.vy;
        let yCollisions = getCollisions(player.x, player.y, player.width, player.height);
        for (let tile of yCollisions) {
            if (tile.type === 1) {
                if (player.vy > 0) { 
                    player.y = tile.y - player.height;
                    player.isGrounded = true;
                    player.vy = 0;
                } else if (player.vy < 0) { 
                    player.y = tile.y + tileSize;
                    player.vy = 0;
                }
            }
            handleSpecialTiles(tile.type);
        }

        // Jumps & Wall Jumps
        if (inputs.up) {
            if (player.isGrounded) {
                player.vy = player.jumpForce;
                if (player.isSliding) {
                    player.vx *= 1.4; 
                    player.vy *= 0.85; 
                }
                player.isGrounded = false;
            } else if (player.canWallJump) {
                player.vy = player.jumpForce * 0.9;
                player.vx = -player.wallDir * player.maxSpeed * 1.3; 
                player.canWallJump = false;
            }
        }

        if (player.y > canvas.height) resetPlayer();

        draw();
        requestAnimationFrame(gameLoop);
    }

    function handleSpecialTiles(type) {
        if (type === 2) resetPlayer(); 
        if (type === 3) { 
            currentLevel++;
            if (currentLevel >= levels.length) {
                alert("GG! You completed the EvE prototype!");
                currentLevel = 0;
            }
            map = levels[currentLevel].map;
            resetPlayer();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < map.length; r++) {
            for (let c = 0; c < map[r].length; c++) {
                if (map[r][c] === 1) {
                    ctx.fillStyle = '#222';
                    ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                } else if (map[r][c] === 2) {
                    ctx.fillStyle = '#ff4444';
                    ctx.beginPath();
                    ctx.moveTo(c * tileSize, (r + 1) * tileSize);
                    ctx.lineTo((c + 0.5) * tileSize, r * tileSize);
                    ctx.lineTo((c + 1) * tileSize, (r + 1) * tileSize);
                    ctx.fill();
                } else if (map[r][c] === 3) {
                    ctx.fillStyle = '#2ecc71';
                    ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                    ctx.strokeStyle = '#fff';
                    ctx.strokeRect(c * tileSize, r * tileSize, tileSize, tileSize);
                }
            }
        }

        // Render Character
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        ctx.fillStyle = '#fff';
        if (player.isSliding) {
            ctx.fillRect(player.x + 12, player.y + 3, 4, 4);
        } else {
            ctx.fillRect(player.x + 10, player.y + 6, 4, 4);
        }
    }

    resetPlayer();
    gameLoop();
});
