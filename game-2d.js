/**
 * Code Rover: Mission Mars - 2D Logic Game Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Config & State ---
    const TILE_SIZE = 60;
    const CANVAS_SIZE = 600;
    const GRID_COLS = CANVAS_SIZE / TILE_SIZE;
    const GRID_ROWS = CANVAS_SIZE / TILE_SIZE;

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let currentLevel = 1;
    let isRunning = false;
    let robot = { x: 0, y: 0, dir: 0 }; // dir: 0=Up, 1=Right, 2=Down, 3=Left
    let goal = { x: 0, y: 0 };
    let walls = [];
    
    // --- Levels ---
    const levels = {
        1: {
            title: "ด่านที่ 1: สตาร์ทเครื่อง",
            desc: "ลากคำสั่ง 'เดินหน้า' 3 ครั้งเพื่อไปเก็บกล่องพลังงาน",
            start: { x: 4, y: 8, dir: 0 },
            goal: { x: 4, y: 5 },
            walls: [],
            optimum: 3
        },
        2: {
            title: "ด่านที่ 2: เลี้ยวให้ถูกทาง",
            desc: "เดินหน้าและเลี้ยวขวาเพื่อหลบสิ่งกีดขวาง",
            start: { x: 2, y: 8, dir: 0 },
            goal: { x: 6, y: 4 },
            walls: [{x:2, y:6}, {x:2, y:5}, {x:2, y:4}, {x:3, y:4}, {x:4, y:4}],
            optimum: 7
        },
        3: {
            title: "ด่านที่ 3: เขาวงกตอวกาศ",
            desc: "หาทางเดินอ้อมกำแพงเลเซอร์",
            start: { x: 1, y: 8, dir: 1 },
            goal: { x: 8, y: 2 },
            walls: [
                {x:3,y:8},{x:3,y:7},{x:3,y:6},
                {x:5,y:1},{x:5,y:2},{x:5,y:3},{x:5,y:4},
                {x:7,y:4},{x:7,y:5},{x:7,y:6},{x:7,y:7}
            ],
            optimum: 12
        }
    };

    // --- Drag & Drop UI ---
    const blocks = document.querySelectorAll('.cmd-block');
    const workspace = document.getElementById('workspace');
    
    blocks.forEach(b => {
        b.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', b.dataset.cmd);
            b.classList.add('dragging');
        });
        b.addEventListener('dragend', () => {
            b.classList.remove('dragging');
        });
    });

    workspace.addEventListener('dragover', e => e.preventDefault());
    
    workspace.addEventListener('drop', e => {
        e.preventDefault();
        const cmd = e.dataTransfer.getData('text/plain');
        if (!cmd) return;
        
        const sourceBlock = document.querySelector(`.cmd-block[data-cmd="${cmd}"]`);
        if (!sourceBlock) return;

        const newBlock = sourceBlock.cloneNode(true);
        newBlock.removeAttribute('draggable');
        newBlock.style.cursor = 'default';
        
        // Add delete button
        const delBtn = document.createElement('i');
        delBtn.className = 'fa-solid fa-xmark';
        delBtn.style.cssText = 'margin-left:auto; cursor:pointer; opacity:0.5;';
        delBtn.onclick = () => newBlock.remove();
        newBlock.appendChild(delBtn);

        workspace.appendChild(newBlock);
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
        workspace.innerHTML = '';
    });

    document.getElementById('level-select').addEventListener('change', (e) => {
        loadLevel(parseInt(e.target.value));
    });

    // --- Drawing Engine ---
    function drawGrid() {
        ctx.fillStyle = '#0b1120';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_COLS; i++) {
            ctx.beginPath();
            ctx.moveTo(i * TILE_SIZE, 0);
            ctx.lineTo(i * TILE_SIZE, CANVAS_SIZE);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i * TILE_SIZE);
            ctx.lineTo(CANVAS_SIZE, i * TILE_SIZE);
            ctx.stroke();
        }
    }

    function drawWalls() {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        walls.forEach(w => {
            ctx.fillRect(w.x * TILE_SIZE + 2, w.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            ctx.strokeRect(w.x * TILE_SIZE + 2, w.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            
            // Draw cross
            ctx.beginPath();
            ctx.moveTo(w.x * TILE_SIZE + 10, w.y * TILE_SIZE + 10);
            ctx.lineTo(w.x * TILE_SIZE + TILE_SIZE - 10, w.y * TILE_SIZE + TILE_SIZE - 10);
            ctx.moveTo(w.x * TILE_SIZE + TILE_SIZE - 10, w.y * TILE_SIZE + 10);
            ctx.lineTo(w.x * TILE_SIZE + 10, w.y * TILE_SIZE + TILE_SIZE - 10);
            ctx.stroke();
        });
    }

    function drawGoal() {
        const cx = goal.x * TILE_SIZE + TILE_SIZE / 2;
        const cy = goal.y * TILE_SIZE + TILE_SIZE / 2;
        
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
    }

    function drawRobot() {
        const cx = robot.x * TILE_SIZE + TILE_SIZE / 2;
        const cy = robot.y * TILE_SIZE + TILE_SIZE / 2;
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(robot.dir * Math.PI / 2); // 0=Up, 1=Right...
        
        // Body
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-16, -16, 32, 32, 8);
        ctx.fill();
        ctx.stroke();

        // Eye / Light
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(-8, -20, 16, 6, 2);
        ctx.fill();
        
        ctx.restore();
    }

    function render() {
        drawGrid();
        drawWalls();
        drawGoal();
        drawRobot();
    }

    function loadLevel(lvl) {
        currentLevel = lvl;
        const data = levels[lvl];
        document.getElementById('lvl-title').textContent = data.title;
        document.getElementById('lvl-desc').textContent = data.desc;
        
        robot = { ...data.start };
        goal = { ...data.goal };
        walls = [ ...data.walls ];
        
        render();
    }

    // --- Execution Logic ---
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function runCode() {
        if (isRunning) return;
        isRunning = true;
        
        // Reset robot to start
        robot = { ...levels[currentLevel].start };
        render();
        await sleep(500);

        const blocks = Array.from(workspace.children);
        const commands = blocks.map(b => b.dataset.cmd);
        
        for (let i = 0; i < commands.length; i++) {
            // Highlight current block
            blocks.forEach(b => b.style.opacity = '0.5');
            blocks[i].style.opacity = '1';
            blocks[i].style.transform = 'scale(1.02)';
            
            const cmd = commands[i];
            let nextX = robot.x;
            let nextY = robot.y;

            if (cmd === 'forward') {
                if (robot.dir === 0) nextY--;
                else if (robot.dir === 1) nextX++;
                else if (robot.dir === 2) nextY++;
                else if (robot.dir === 3) nextX--;
            } else if (cmd === 'turnLeft') {
                robot.dir = (robot.dir + 3) % 4;
            } else if (cmd === 'turnRight') {
                robot.dir = (robot.dir + 1) % 4;
            }

            // Collision check
            const hitWall = walls.some(w => w.x === nextX && w.y === nextY);
            const outOfBounds = nextX < 0 || nextX >= GRID_COLS || nextY < 0 || nextY >= GRID_ROWS;
            
            if (!hitWall && !outOfBounds) {
                // Animate move smoothly (simplified for now)
                robot.x = nextX;
                robot.y = nextY;
            } else {
                // Error shake
                ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
                ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            }

            render();
            await sleep(400);
            blocks[i].style.transform = 'scale(1)';
        }
        
        // Reset block opacity
        blocks.forEach(b => b.style.opacity = '1');

        // Check Win
        if (robot.x === goal.x && robot.y === goal.y) {
            showSuccessModal(commands.length);
        }

        isRunning = false;
    }

    function showSuccessModal(linesOfCode) {
        const optimum = levels[currentLevel].optimum;
        let stars = 1;
        if (linesOfCode <= optimum) stars = 3;
        else if (linesOfCode <= optimum + 2) stars = 2;

        const modal = document.getElementById('modal-success');
        const starContainer = document.getElementById('modal-stars');
        
        let html = '';
        for (let i = 0; i < 3; i++) {
            if (i < stars) {
                html += '<i class="fa-solid fa-star" style="color: #fbbf24; text-shadow: 0 0 10px #fbbf24;"></i>';
            } else {
                html += '<i class="fa-regular fa-star" style="color: #475569;"></i>';
            }
        }
        starContainer.innerHTML = html;
        modal.style.display = 'flex';
    }

    document.getElementById('btn-run').addEventListener('click', runCode);
    
    document.getElementById('btn-next-level').addEventListener('click', () => {
        document.getElementById('modal-success').style.display = 'none';
        workspace.innerHTML = '';
        const select = document.getElementById('level-select');
        if (currentLevel < 3) {
            select.value = currentLevel + 1;
            loadLevel(currentLevel + 1);
        }
    });

    // Init
    loadLevel(1);
});
