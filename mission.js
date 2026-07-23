/* -------------------------------------------------------------
   Scratch Academy - Coding Missions Logic (mission.js)
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. Dropdown Menus Toggle for Touch & Click ---
    const dropdownBtns = document.querySelectorAll('.nav-dropdown-btn');
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parent = btn.parentElement;
            
            // Close other dropdowns
            document.querySelectorAll('.nav-dropdown').forEach(d => {
                if (d !== parent) d.classList.remove('open');
            });
            
            parent.classList.toggle('open');
        });
    });
    
    // Close dropdowns if user clicks anywhere else
    document.addEventListener('click', () => {
        document.querySelectorAll('.nav-dropdown').forEach(d => {
            d.classList.remove('open');
        });
    });

    // --- 1. Global Simulation State ---
    let currentMissionId = "1";
    let isRunning = false;
    let score = 0;
    let stepsCount = 0;
    let completedMissions = JSON.parse(localStorage.getItem('scratch_completed_missions') || '{}');
    
    // DOM Elements
    const missionItems = document.querySelectorAll('.mission-item');
    const pageSectionTitle = document.getElementById('page-section-title');
    const progressPercentText = document.getElementById('progress-percent');
    const progressBar = document.getElementById('learning-progress');
    
    const missionTitle = document.getElementById('mission-title');
    const missionObjective = document.getElementById('mission-objective');
    const missionStatus = document.getElementById('mission-status');
    const missionHintsList = document.getElementById('mission-hints-list');
    const missionStepsList = document.getElementById('mission-steps-list');
    
    const stageBox = document.getElementById('stage-box');
    const spriteCat = document.getElementById('sprite-cat');
    const spriteTarget = document.getElementById('sprite-target');
    const spriteExtra = document.getElementById('sprite-extra');
    const speechBubble = document.getElementById('speech-bubble');
    const successOverlay = document.getElementById('success-overlay');
    const successText = document.getElementById('success-text');
    const btnNextMission = document.getElementById('btn-next-mission');
    
    const stageVarDisplay = document.getElementById('stage-var-display');
    const stageVarName = document.getElementById('stage-var-name');
    const stageVarVal = document.getElementById('stage-var-val');
    
    const answerBox = document.getElementById('answer-box');
    const answerInput = document.getElementById('answer-input');
    const btnSubmitAnswer = document.getElementById('btn-submit-answer');
    
    const btnActionRun = document.getElementById('btn-action-run');
    const btnActionStop = document.getElementById('btn-action-stop');
    const btnFlag = document.getElementById('btn-flag');
    const btnStop = document.getElementById('btn-stop');
    
    const consoleBox = document.getElementById('console-box');
    
    // Drag & Drop Elements
    const blockDropArea = document.getElementById('block-drop-area');
    const btnClearWorkspace = document.getElementById('btn-clear-workspace');
    const dropPlaceholder = document.getElementById('drop-placeholder-text');

    // List of active intervals / timeout ids to clean up on stop/switch
    let activeIntervals = [];
    let activeTimeouts = [];
    let activeEventListeners = [];

    // Safe Event Listener Registrator
    function addStageListener(target, event, handler) {
        target.addEventListener(event, handler);
        activeEventListeners.push({ target, event, handler });
    }

    // Cleanup all simulation side-effects
    function cleanupSimulation() {
        isRunning = false;
        
        // Clear all intervals
        activeIntervals.forEach(clearInterval);
        activeIntervals = [];
        
        // Clear all timeouts
        activeTimeouts.forEach(clearTimeout);
        activeTimeouts = [];
        
        // Remove all dynamically registered stage event listeners
        activeEventListeners.forEach(({ target, event, handler }) => {
            target.removeEventListener(event, handler);
        });
        activeEventListeners = [];

        // Reset DOM styles
        spriteCat.style.transform = 'scale(1)';
        spriteCat.style.filter = 'none';
        spriteCat.style.left = '60px';
        spriteCat.style.top = '156px';
        spriteCat.style.transition = 'none';
        spriteCat.textContent = '🐱';
        spriteCat.style.display = 'flex';
        
        spriteTarget.style.display = 'none';
        spriteTarget.style.opacity = '1';
        spriteTarget.style.transform = 'scale(1)';
        spriteTarget.style.filter = 'none';
        spriteTarget.textContent = '🍼';
        
        spriteExtra.style.display = 'none';
        spriteExtra.style.left = '60px';
        spriteExtra.style.top = '220px';
        spriteExtra.textContent = '😸';
        
        speechBubble.style.display = 'none';
        answerBox.style.display = 'none';
        successOverlay.style.display = 'none';
        stageBox.style.backgroundColor = 'white';
        
        // Reset controls state
        btnActionRun.innerHTML = '<i class="fa-solid fa-play"></i> เริ่มรันสคริปต์';
        btnActionRun.style.backgroundColor = 'var(--scratch-green)';
    }

    // Console Logging Helper
    function logToConsole(message, type = 'system') {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        
        const now = new Date();
        const timeStr = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        
        line.textContent = `${timeStr} ${message}`;
        consoleBox.appendChild(line);
        consoleBox.scrollTop = consoleBox.scrollHeight;
    }

    // Translate coordinates: Center of Stage is (0, 0)
    // Stage is responsive, so we measure width and height
    function setSpriteCoords(element, x, y) {
        if (!element) return;
        const w = element.offsetWidth || 48;
        const h = element.offsetHeight || 48;
        const stageW = stageBox.clientWidth;
        const stageH = stageBox.clientHeight;
        
        const left = (stageW / 2) + x - (w / 2);
        const top = (stageH / 2) - y - (h / 2);
        
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
    }

    // Get Sprite Coordinates relative to stage center
    function getSpriteCoords(element) {
        if (!element) return { x: 0, y: 0 };
        const stageW = stageBox.clientWidth;
        const stageH = stageBox.clientHeight;
        const left = parseFloat(element.style.left) || 0;
        const top = parseFloat(element.style.top) || 0;
        const w = element.offsetWidth || 48;
        const h = element.offsetHeight || 48;
        
        const x = left + (w / 2) - (stageW / 2);
        const y = (stageH / 2) - top - (h / 2);
        return { x, y };
    }

    // Distance calculator
    function getDistance(el1, el2) {
        const c1 = getSpriteCoords(el1);
        const c2 = getSpriteCoords(el2);
        return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
    }

    // Render scratch block hint helper (modified to be draggable)
    function renderBlockHint(block, index) {
        const dragAttrs = `draggable="true" data-index="${index}" data-category="${block.category}"`;
        if (block.type === 'hat') {
            return `<div ${dragAttrs} class="scratch-block-visual hat scratch-${block.category}" style="margin-top:0;">${block.text}</div>`;
        } else if (block.type === 'cap') {
            return `<div ${dragAttrs} class="scratch-block-visual cap scratch-${block.category}">${block.text}</div>`;
        } else if (block.type === 'c-start') {
            return `
            <div class="scratch-c-wrapper">
                <div ${dragAttrs} class="scratch-block-visual stack scratch-${block.category} scratch-c-top">${block.text}</div>
                <div class="scratch-c-body">
            `;
        } else if (block.type === 'c-end') {
            return `
                </div>
                <div ${dragAttrs} class="scratch-block-visual stack scratch-${block.category} scratch-c-bottom"></div>
            </div>
            `;
        } else {
            return `<div ${dragAttrs} class="scratch-block-visual stack scratch-${block.category}">${block.text}</div>`;
        }
    }

    // --- 2. 20 Missions Definitions ---
    const missions = {
        "1": {
            title: "ภารกิจที่ 1: เหมียวส้มกินนมพลังงาน",
            objective: "สั่งให้ตัวละครแมวส้ม (🐱) เดินหน้าไปกินขวดนม (🍼) เมื่อแมวสัมผัสโดนขวดนม ร่างกายจะขยายร่างขึ้น 80% (ขนาดเพิ่มขึ้น 80%) และส่งเสียงร้อง Meow",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'c-start', category: 'control', text: 'วนซ้ำตลอดไป' },
                { type: 'stack', category: 'motion', text: 'เดินหน้า <span class="scratch-input-pill">10</span> ก้าว' },
                { type: 'c-start', category: 'control', text: 'ถ้า <span class="scratch-input-hexagon" style="background:#4CBFE6; padding:1px 6px;">แตะ ขวดนม ?</span> แล้ว' },
                { type: 'stack', category: 'looks', text: 'เปลี่ยนขนาดทีละ <span class="scratch-input-pill">80</span>' },
                { type: 'stack', category: 'sound', text: 'เล่นเสียง <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">Meow</span> จนจบ' },
                { type: 'c-end', category: 'control' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "เริ่มต้นด้วยบล็อกหัวสวม 'เมื่อคลิก 🟢'",
                "ใส่บล็อกควบคุม 'วนซ้ำตลอดไป' เพื่อให้แมวเดินอย่างต่อเนื่อง",
                "ภายในลูป ให้ใส่บล็อก 'เดินหน้า 10 ก้าว'",
                "นำบล็อกเงื่อนไข 'ถ้า...แล้ว' มาครอบ เพื่อตรวจสอบว่าแมวสัมผัสขวดนมหรือไม่ โดยใส่บล็อกหกเหลี่ยม 'แตะ ขวดนม ?'",
                "ถ้าแตะ ให้ขยายตัวด้วย 'เปลี่ยนขนาดทีละ 80' และเปิดเสียงร้องด้วย 'เล่นเสียง Meow จนจบ'"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                spriteTarget.style.display = 'flex';
                spriteTarget.textContent = '🍼';
                setSpriteCoords(spriteCat, -160, 0);
                setSpriteCoords(spriteTarget, 120, 0);
                stageVarDisplay.style.display = 'none';
            },
            start: () => {
                logToConsole("แมวส้ม: เริ่มต้นการเดินหาขวดนมเพื่อเพิ่มพลังงาน...", "sprite");
                let interval = setInterval(() => {
                    let catCoords = getSpriteCoords(spriteCat);
                    if (catCoords.x < 120) {
                        catCoords.x += 6;
                        setSpriteCoords(spriteCat, catCoords.x, catCoords.y);
                    }
                    
                    let dist = getDistance(spriteCat, spriteTarget);
                    if (dist < 25) {
                        clearInterval(interval);
                        spriteCat.style.transform = 'scale(1.8)';
                        spriteTarget.style.transform = 'scale(0)';
                        speechBubble.style.display = 'block';
                        speechBubble.textContent = 'อร่อยจัง! ตัวโตขึ้นแล้ว!';
                        setSpriteCoords(speechBubble, catCoords.x, catCoords.y + 45);
                        logToConsole("แมวส้ม: *เล่นเสียง Meow* อร่อยจัง!", "sprite");
                        activeTimeouts.push(setTimeout(() => {
                            triggerSuccess("แมวส้มกินนมพลังงานสำเร็จและร่างกายขยายใหญ่ขึ้น!");
                        }, 1200));
                    }
                }, 50);
                activeIntervals.push(interval);
            }
        },
        "2": {
            title: "ภารกิจที่ 2: เต้นบีทบ็อกซ์จับจังหวะ",
            objective: "สั่งให้ตัวละครเต้นบีทบ็อกซ์โดยเปลี่ยนคอสตูมแอนิเมชันและหมุนขวา 15 องศา พร้อมเล่นเสียง Meow วนซ้ำจำกัด 10 รอบ",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'c-start', category: 'control', text: 'ทำซ้ำ <span class="scratch-input-pill">10</span> รอบ' },
                { type: 'stack', category: 'motion', text: 'หมุน ↷ <span class="scratch-input-pill">36</span> องศา' },
                { type: 'stack', category: 'looks', text: 'ชุดถัดไป' },
                { type: 'stack', category: 'sound', text: 'เริ่มเสียง <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">Meow</span>' },
                { type: 'stack', category: 'control', text: 'รอ <span class="scratch-input-pill">0.2</span> วินาที' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "สวมหัวสคริปต์ด้วย 'เมื่อคลิก 🟢'",
                "นำบล็อกลูป 'ทำซ้ำ 10 รอบ' มาต่อสำหรับระบุขอบเขตการทำงานจำกัดรอบ",
                "ใส่บล็อก 'หมุนตามเข็ม 36 องศา' และ 'ชุดถัดไป' ในปากลูปเต้น",
                "เพิ่มสีสันด้วยเสียงดนตรี 'เริ่มเสียง Meow' และชะลอจังหวะ 'รอ 0.2 วินาที' ทุกรอบการเต้น"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, 0, 0);
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'รอบการเต้น:';
                stageVarVal.textContent = '0';
                stepsCount = 0;
            },
            start: () => {
                logToConsole("แมวส้ม: เตรียมพร้อมเริ่มโชว์สเต็ปบีทบ็อกซ์ 10 จังหวะ!", "sprite");
                let rotateAngle = 0;
                let interval = setInterval(() => {
                    stepsCount++;
                    stageVarVal.textContent = stepsCount;
                    
                    rotateAngle += 36;
                    spriteCat.style.transform = `rotate(${rotateAngle}deg)`;
                    spriteCat.textContent = stepsCount % 2 === 0 ? '😸' : '🐱';
                    
                    logToConsole(`แมวส้ม: เต้นจังหวะบีทบ็อกซ์รอบที่ ${stepsCount}/10`, "sprite");
                    
                    if (stepsCount >= 10) {
                        clearInterval(interval);
                        spriteCat.style.transform = 'none';
                        spriteCat.textContent = '😸';
                        triggerSuccess("เต้นบีทบ็อกซ์ครบ 10 จังหวะสมบูรณ์แบบ!");
                    }
                }, 250);
                activeIntervals.push(interval);
            }
        },
        "3": {
            title: "ภารกิจที่ 3: หลบดาวระเบิดลบแต้ม",
            objective: "บังคับตัวละครหลบดาวตกระเบิด (⭐) ให้พ้นจำนวน 3 ครั้ง โดยแต้มสะสมจะเริ่มที่ 5 คะแนน หากดาวตกชนตัวแมว แมวจะร้องพูด 'โอ๊ย!' และถูกลบคะแนนสะสมทีละ -1 คะแนน",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'stack', category: 'variables', text: 'ตั้งค่า <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">คะแนน</span> เป็น <span class="scratch-input-pill">5</span>' },
                { type: 'c-start', category: 'control', text: 'วนซ้ำตลอดไป' },
                { type: 'stack', category: 'motion', text: 'เปลี่ยน y ทีละ <span class="scratch-input-pill">-6</span>' },
                { type: 'c-start', category: 'control', text: 'ถ้า <span class="scratch-input-hexagon" style="background:#4CBFE6; padding:1px 6px;">แตะ แมวส้ม ?</span> แล้ว' },
                { type: 'stack', category: 'variables', text: 'เปลี่ยนค่า <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">คะแนน</span> ทีละ <span class="scratch-input-pill">-1</span>' },
                { type: 'stack', category: 'looks', text: 'พูด <span class="scratch-input-pill">โอ๊ย!</span> เป็นเวลา <span class="scratch-input-pill">0.5</span> วินาที' },
                { type: 'c-end', category: 'control' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "ตั้งค่าตัวแปรเริ่มต้น 'ตั้งค่า คะแนน เป็น 5' ในหมวด Variables",
                "สร้างลูปเคลื่อนไหวของดาวตกด้วย 'วนซ้ำตลอดไป' และ 'เปลี่ยน y ทีละ -6' เพื่อให้ตกลงล่างเรื่อยๆ",
                "เพิ่มบล็อกทางเลือก 'ถ้า แตะ แมวส้ม ? แล้ว' เพื่อตรวจสอบการสัมผัสชน",
                "หากชนกัน ให้ลดคะแนนสะสมด้วย 'เปลี่ยนค่า คะแนน ทีละ -1' และแสดงบทสนทนา 'พูด โอ๊ย! 0.5 วินาที'"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                spriteTarget.style.display = 'flex';
                spriteTarget.textContent = '⭐';
                setSpriteCoords(spriteCat, 0, -100);
                setSpriteCoords(spriteTarget, 0, 140);
                
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'คะแนนสะสม:';
                score = 5;
                stageVarVal.textContent = score;
                stepsCount = 0; // successfully avoided count

                // Add instruction overlay help
                logToConsole("เคล็ดลับ: บังคับแมวด้วยปุ่มลูกศร ซ้าย (◀️) ขวา (▶️) บนคีย์บอร์ด หรือคลิกหน้าจอเพื่อเลื่อนหลบดาวระเบิด!", "system");
            },
            start: () => {
                let catCoords = getSpriteCoords(spriteCat);
                let starCoords = getSpriteCoords(spriteTarget);
                starCoords.x = Math.random() * 240 - 120;
                setSpriteCoords(spriteTarget, starCoords.x, 140);

                // Add Keyboard Controls
                addStageListener(window, 'keydown', (e) => {
                    let catX = getSpriteCoords(spriteCat).x;
                    if (e.key === 'ArrowLeft') {
                        catX = Math.max(-200, catX - 25);
                        setSpriteCoords(spriteCat, catX, -100);
                    } else if (e.key === 'ArrowRight') {
                        catX = Math.min(200, catX + 25);
                        setSpriteCoords(spriteCat, catX, -100);
                    }
                });

                // Add Click controls for mobile
                addStageListener(stageBox, 'click', (e) => {
                    const rect = stageBox.getBoundingClientRect();
                    const clickX = e.clientX - rect.left - (stageBox.clientWidth / 2);
                    setSpriteCoords(spriteCat, Math.min(200, Math.max(-200, clickX)), -100);
                });

                let interval = setInterval(() => {
                    let starPos = getSpriteCoords(spriteTarget);
                    starPos.y -= 5;
                    setSpriteCoords(spriteTarget, starPos.x, starPos.y);

                    // Check boundaries
                    if (starPos.y <= -140) {
                        stepsCount++;
                        logToConsole(`ระบบ: หลบดาวตกสำเร็จครั้งที่ ${stepsCount}/3`, "system");
                        if (stepsCount >= 3) {
                            clearInterval(interval);
                            triggerSuccess("หลบดาวระเบิดสำเร็จครบ 3 ครั้งโดยรักษาแต้มไว้ได้!");
                        } else {
                            starPos.y = 140;
                            starPos.x = Math.random() * 240 - 120;
                            setSpriteCoords(spriteTarget, starPos.x, starPos.y);
                        }
                    }

                    // Check collision
                    let dist = getDistance(spriteCat, spriteTarget);
                    if (dist < 32) {
                        score--;
                        stageVarVal.textContent = score;
                        logToConsole("ดาวระเบิด: ตูม! โดนแมวเข้าแล้ว คะแนน -1", "system");
                        
                        // Speak bubble
                        let catPos = getSpriteCoords(spriteCat);
                        speechBubble.style.display = 'block';
                        speechBubble.textContent = 'โอ๊ย!';
                        setSpriteCoords(speechBubble, catPos.x, catPos.y + 40);
                        
                        // Flash background red
                        stageBox.style.backgroundColor = '#fee2e2';
                        setTimeout(() => {
                            stageBox.style.backgroundColor = 'white';
                            speechBubble.style.display = 'none';
                        }, 500);

                        if (score <= 0) {
                            clearInterval(interval);
                            logToConsole("ระบบ: คะแนนหมดแล้ว! ลองรันด่านใหม่อีกครั้งนะ", "system");
                            cleanupSimulation();
                        } else {
                            // Reset star
                            starPos.y = 140;
                            starPos.x = Math.random() * 240 - 120;
                            setSpriteCoords(spriteTarget, starPos.x, starPos.y);
                        }
                    }
                }, 40);
                activeIntervals.push(interval);
            }
        },
        "4": {
            title: "ภารกิจที่ 4: เหมียวส้มเร่งความเร็ว",
            objective: "สั่งให้ตัวละครแมวเดินลาดตระเวนไปกลับซ้ายขวา หากผู้เรียนกดปุ่ม 'Spacebar' บนคีย์บอร์ด ตัวละครจะตรวจจับและวิ่งด้วยความเร็วเพิ่มขึ้นเป็น 3 เท่า!",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'c-start', category: 'control', text: 'วนซ้ำตลอดไป' },
                { type: 'c-start', category: 'control', text: 'ถ้า <span class="scratch-input-hexagon" style="background:#4CBFE6; padding:1px 6px;">ปุ่ม สเปซบาร์ ถูกกด ?</span> แล้ว' },
                { type: 'stack', category: 'motion', text: 'เดินหน้า <span class="scratch-input-pill">18</span> ก้าว' },
                { type: 'c-start', category: 'control', text: 'มิฉะนั้น' },
                { type: 'stack', category: 'motion', text: 'เดินหน้า <span class="scratch-input-pill">6</span> ก้าว' },
                { type: 'c-end', category: 'control' },
                { type: 'stack', category: 'motion', text: 'ถ้าชนขอบ, ให้สะท้อนกลับ' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "วางสวมบล็อก 'เมื่อคลิก 🟢' และใช้บล็อก 'วนซ้ำตลอดไป'",
                "ลากบล็อกทางเลือกสองทาง 'ถ้า...มิฉะนั้น' มาใส่เพื่อแยกกรณีความเร็ว",
                "ใส่เงื่อนไขตรวจจับ 'ปุ่ม สเปซบาร์ ถูกกด ?' ในช่องตรวจสอบของบล็อก",
                "ในช่อง 'ถ้า' (เมื่อกดสเปซบาร์) ให้เดิน 18 ก้าว",
                "ในช่อง 'มิฉะนั้น' (ความเร็วปกติ) ให้เดิน 6 ก้าว",
                "วางบล็อกเคลื่อนไหว 'ถ้าชนขอบ, ให้สะท้อนกลับ' ต่อข้างล่างของโครงสร้างหลัก"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, -160, 0);
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'ความเร็วเดิน:';
                stageVarVal.textContent = 'ปกติ (6)';
                stepsCount = 0; // Check if fast mode was triggered
                
                logToConsole("ระบบ: สังเกตความก้าวหน้าด่าน กดปุ่ม Spacebar ค้างไว้เพื่อเร่งสปีดตัวแมว!", "system");
            },
            start: () => {
                let catCoords = getSpriteCoords(spriteCat);
                let dir = 1; // 1 = right, -1 = left
                let spacePressed = false;

                addStageListener(window, 'keydown', (e) => {
                    if (e.code === 'Space') {
                        e.preventDefault();
                        spacePressed = true;
                        stageVarVal.textContent = 'เร็วจี๋ x3 (18)';
                        spriteCat.textContent = '🚀';
                    }
                });

                addStageListener(window, 'keyup', (e) => {
                    if (e.code === 'Space') {
                        spacePressed = false;
                        stageVarVal.textContent = 'ปกติ (6)';
                        spriteCat.textContent = '🐱';
                    }
                });

                // Touch / Click control simulation for mobile
                addStageListener(stageBox, 'mousedown', () => {
                    spacePressed = true;
                    stageVarVal.textContent = 'เร็วจี๋ x3 (18)';
                    spriteCat.textContent = '🚀';
                });
                addStageListener(stageBox, 'mouseup', () => {
                    spacePressed = false;
                    stageVarVal.textContent = 'ปกติ (6)';
                    spriteCat.textContent = '🐱';
                });

                let interval = setInterval(() => {
                    let speed = spacePressed ? 18 : 6;
                    if (spacePressed) {
                        stepsCount++;
                    }

                    catCoords.x += speed * dir;
                    
                    // Bounce borders
                    if (catCoords.x >= 180) {
                        dir = -1;
                        spriteCat.style.transform = 'scaleX(-1)';
                    } else if (catCoords.x <= -180) {
                        dir = 1;
                        spriteCat.style.transform = 'scaleX(1)';
                    }
                    
                    setSpriteCoords(spriteCat, catCoords.x, catCoords.y);

                    if (stepsCount >= 40) {
                        clearInterval(interval);
                        spriteCat.textContent = '😸';
                        spriteCat.style.transform = 'none';
                        triggerSuccess("แมวส้มเร่งสปีดพุ่งทะยานข้ามเวทีเรียบร้อย!");
                    }
                }, 50);
                activeIntervals.push(interval);
            }
        },
        "5": {
            title: "ภารกิจที่ 5: ถอดรหัสบวกเลขวิเศษ",
            objective: "แมวส้ม (🐱) จะโชว์คำถามคณิตศาสตร์บนหน้าจอ '5 + 7 ได้เท่าไหร่?' ให้เขียนโค้ดและพิมพ์ป้อนคำตอบลงในกล่องข้อความให้ถูกต้องเพื่อปลดล็อกด่านสำเร็จ",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'stack', category: 'sensing', text: 'ถาม <span class="scratch-input-pill" style="color:black; background:white; font-size:11px; padding:1px 6px;">5 + 7 ได้เท่าไหร่?</span> และรอ' },
                { type: 'c-start', category: 'control', text: 'ถ้า <span class="scratch-input-hexagon" style="background:#40BF50; padding:1px 6px;"><span style="background:rgba(255,255,255,0.2); border-radius:40px; padding:1px 4px;">คำตอบ</span> = 12</span> แล้ว' },
                { type: 'stack', category: 'looks', text: 'พูด <span class="scratch-input-pill">ผ่านเข้ารอบสำเร็จ! 🎉</span> เป็นเวลา <span class="scratch-input-pill">2</span> วินาที' },
                { type: 'c-start', category: 'control', text: 'มิฉะนั้น' },
                { type: 'stack', category: 'looks', text: 'พูด <span class="scratch-input-pill">คำตอบยังไม่ถูก ลองใหม่นะ</span> เป็นเวลา <span class="scratch-input-pill">2</span> วินาที' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "เริ่มเปิดบล็อกหลัก 'เมื่อคลิก 🟢'",
                "ใช้คำสั่งกลุ่มตรวจจับ 'ถาม 5 + 7 ได้เท่าไหร่? และรอ' เพื่อรับข้อมูลผ่านแป้นพิมพ์",
                "ลากบล็อกเปรียบเทียบตรรกะ '=' สีเขียวในหมวด Operators ไปใส่ในช่องเงื่อนไขบล็อก 'ถ้า...มิฉะนั้น'",
                "นำกล่องตัวแปรคำตอบ 'คำตอบ' วางฝั่งซ้ายของปุ่มตรรกะ และพิมพ์เลข '12' ฝั่งขวา",
                "ใส่ข้อความตอบรับให้ครบทั้งกรณีตอบถูกและตอบผิดเพื่อชี้นำผู้เล่น"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, 0, 0);
                stageVarDisplay.style.display = 'none';
                answerBox.style.display = 'flex';
                answerInput.value = '';
                
                speechBubble.style.display = 'block';
                speechBubble.textContent = 'เด็กๆ ครับ 5 + 7 ได้คำตอบเท่าไหร่ช่วยตอบคำตอบผมหน่อย?';
                setSpriteCoords(speechBubble, 0, 45);
            },
            start: () => {
                logToConsole("แมวส้ม: ถามโจทย์คณิตศาสตร์ '5 + 7 = ?'", "sprite");
                
                addStageListener(btnSubmitAnswer, 'click', handleAnswerSubmission);
                addStageListener(answerInput, 'keypress', (e) => {
                    if (e.key === 'Enter') handleAnswerSubmission();
                });

                function handleAnswerSubmission() {
                    let ans = answerInput.value.trim();
                    logToConsole(`ผู้เรียนตอบ: "${ans}"`, "system");
                    
                    if (ans === '12') {
                        speechBubble.textContent = 'ถูกต้องแล้วคร้าบบ! ยินดีด้วย 🎉';
                        logToConsole("แมวส้ม: คำตอบถูกต้อง! ผ่านด่านแล้ว!", "sprite");
                        answerBox.style.display = 'none';
                        activeTimeouts.push(setTimeout(() => {
                            triggerSuccess("ตอบคำถามคณิตศาสตร์ได้ถูกต้อง 5 + 7 = 12");
                        }, 1500));
                    } else {
                        if (window.playCodeSound) window.playCodeSound('error');
                        speechBubble.textContent = 'ยังไม่ถูกน้า ลองคิดใหม่อีกทีซิ!';
                        logToConsole("แมวส้ม: คำตอบผิด ลองพยายามใหม่อีกครั้ง", "sprite");
                        answerInput.value = '';
                    }
                }
            }
        },
        "6": {
            title: "ภารกิจที่ 6: เปลี่ยนเอฟเฟกต์สีเมื่อโดนคลิก",
            objective: "สั่งให้ตัวละครเปลี่ยนเอฟเฟกต์สีทีละ 25 เมื่อแมวโดนกดคลิกเมาส์ และร้องเสียง Meow เพื่อทำภารกิจให้สำเร็จ โดยต้องคลิกตัวแมวให้ครบ 3 ครั้ง",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อตัวละครนี้ถูกคลิก' },
                { type: 'stack', category: 'looks', text: 'เปลี่ยนเอฟเฟกต์ <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">สี</span> ทีละ <span class="scratch-input-pill">25</span>' },
                { type: 'stack', category: 'sound', text: 'เริ่มเสียง <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">Meow</span>' }
            ],
            steps: [
                "ดึงบล็อก 'เมื่อตัวละครนี้ถูกคลิก' เป็นตัวเปิดรับสัญญาณ",
                "ใช้บล็อก 'เปลี่ยนเอฟเฟกต์ สี ทีละ 25' ในหมวด Looks สีม่วง เพื่อแต่งโทนสีตัวสไปรท์",
                "นำบล็อก 'เริ่มเสียง Meow' ต่อท้ายเพื่อให้ตัวละครร้องพร้อมกันเมื่อโดนจิ้มสัมผัส"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, 0, 0);
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'จำนวนครั้งที่คลิก:';
                score = 0;
                stageVarVal.textContent = score;
                logToConsole("ระบบ: รันจำลองแล้วคลิกจิ้มตัวแมวบนหน้าเวทีให้สีเพี้ยนครบ 3 ครั้ง!", "system");
            },
            start: () => {
                let hue = 0;
                addStageListener(spriteCat, 'click', () => {
                    if (!isRunning) return;
                    score++;
                    stageVarVal.textContent = score;
                    
                    hue = (hue + 45) % 360;
                    spriteCat.style.filter = `hue-rotate(${hue}deg)`;
                    logToConsole(`แมวส้ม: โดนจิ้มแล้ว! เปลี่ยนสีเอฟเฟกต์ และเล่นเสียง Meow`, "sprite");
                    
                    // pop visual
                    spriteCat.style.transform = 'scale(1.2)';
                    setTimeout(() => { spriteCat.style.transform = 'scale(1)'; }, 150);

                    if (score >= 3) {
                        triggerSuccess("คลิกตัวละครแมวเพื่อสะท้อนเอฟเฟกต์สีครบ 3 ครั้งสำเร็จ!");
                    }
                });
            }
        },
        "7": {
            title: "ภารกิจที่ 7: สเกลตามระยะห่างเมาส์",
            objective: "ประยุกต์ใช้บล็อกเปรียบเทียบขนาด ให้แมวส้มตัวใหญ่ขยายตัวบิ๊กขึ้นตามการขยับเมาส์เข้าใกล้เมาส์ชี้เป้าของผู้ใช้ ลากเมาส์เข้าประชิดแมวในระยะ < 30 เพื่อสำเร็จภารกิจ",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'c-start', category: 'control', text: 'วนซ้ำตลอดไป' },
                { type: 'stack', category: 'looks', text: 'ตั้งค่าขนาดเป็น <span class="scratch-input-hexagon" style="background:#4CBFE6; padding:1px 6px;">(200) - (ระยะห่างไปยัง ตัวชี้เมาส์)</span> %' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "เริ่มต้นด้วยบล็อกเปิดสคริปต์ 'เมื่อคลิก 🟢'",
                "ใช้ลูปควบคุมแบบต่อเนื่องไร้ขีดจำกัด 'วนซ้ำตลอดไป'",
                "นำบล็อกลบ '-' สีเขียวในหมวด Operators ไปต่อในบล็อก 'ตั้งค่าขนาดเป็น %'",
                "ใช้บล็อกเซนเซอร์ 'ระยะห่างไปยัง ตัวชี้เมาส์' ในหมวด Sensing เป็นตัวตั้งลบเพื่อให้ผลลัพธ์ผกผันกัน"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, 0, 0);
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'ระยะห่างเมาส์:';
                stageVarVal.textContent = 'รอจับสัญญาณ...';
            },
            start: () => {
                addStageListener(stageBox, 'mousemove', (e) => {
                    if (!isRunning) return;
                    const rect = stageBox.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left - (stageBox.clientWidth / 2);
                    const mouseY = (stageBox.clientHeight / 2) - (e.clientY - rect.top);
                    
                    const catCoords = getSpriteCoords(spriteCat);
                    const dist = Math.sqrt(Math.pow(mouseX - catCoords.x, 2) + Math.pow(mouseY - catCoords.y, 2));
                    
                    stageVarVal.textContent = Math.round(dist);
                    
                    // calculate scale factor
                    let scale = Math.max(0.5, 2.2 - (dist / 140));
                    spriteCat.style.transform = `scale(${scale})`;
                    
                    if (dist < 30) {
                        triggerSuccess("ขยับเมาส์มาประชิดตัวแมวจนแมวส้มตัวโตเต็มพิกัด!");
                    }
                });
            }
        },
        "8": {
            title: "ภารกิจที่ 8: กระโดดข้ามรั้วหรรษา",
            objective: "กดปุ่ม 'Spacebar' เพื่อสั่งแมวกระโดดหลบสิ่งกีดขวาง (🪨) ที่กำลังเคลื่อนที่มาทางซ้ายข้ามผ่านให้ครบ 2 รอบโดยไม่เดินสะดุดชนก้อนหิน",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อกดปุ่ม <span class="scratch-input-dropdown" style="background:rgba(0,0,0,0.08); color:#1e293b;">สเปซบาร์</span>' },
                { type: 'stack', category: 'motion', text: 'ร่อน <span class="scratch-input-pill">0.2</span> วิ ไปที่ x: <span class="scratch-input-pill">-120</span> y: <span class="scratch-input-pill">60</span>' },
                { type: 'stack', category: 'motion', text: 'ร่อน <span class="scratch-input-pill">0.2</span> วิ ไปที่ x: <span class="scratch-input-pill">-120</span> y: <span class="scratch-input-pill">-70</span>' }
            ],
            steps: [
                "ดักจับการกระทำของผู้ใช้ทางแป้นพิมพ์ 'เมื่อกดปุ่ม สเปซบาร์'",
                "นำบล็อกเคลื่อนไหว 'ร่อน ... วิ ไปที่ x y' มาช่วยสร้างความนุ่มนวล โดยให้แมวเหินลอยตัวชั่วคราวขึ้นสูง y: 60",
                "ใช้บล็อก 'ร่อน ... วิ ไปที่ x y' อีกตัวสั่งสไลด์แมวปักหัวร่อนแลนดิ้งกลับสู่ระนาบพื้นปกติ y: -70"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                spriteTarget.style.display = 'flex';
                spriteTarget.textContent = '🪨';
                
                setSpriteCoords(spriteCat, -120, -70);
                setSpriteCoords(spriteTarget, 220, -70);
                
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'หลบสำเร็จ (รอบ):';
                stepsCount = 0;
                stageVarVal.textContent = stepsCount;
                
                logToConsole("ระบบ: รันจำลองแล้วกด Spacebar เพื่อกระโดดเมื่อก้อนหินวิ่งเข้าใกล้แมวส้ม!", "system");
            },
            start: () => {
                let isJumping = false;
                let catCoords = { x: -120, y: -70 };
                let rockX = 220;

                // Handle jumping action
                addStageListener(window, 'keydown', (e) => {
                    if (e.code === 'Space' && !isJumping) {
                        e.preventDefault();
                        isJumping = true;
                        
                        // Glide Up animation simulation
                        spriteCat.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        catCoords.y = 50;
                        setSpriteCoords(spriteCat, catCoords.x, catCoords.y);
                        
                        activeTimeouts.push(setTimeout(() => {
                            // Glide Down animation
                            spriteCat.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                            catCoords.y = -70;
                            setSpriteCoords(spriteCat, catCoords.x, catCoords.y);
                            
                            activeTimeouts.push(setTimeout(() => {
                                isJumping = false;
                                spriteCat.style.transition = 'none';
                            }, 200));
                        }, 250));
                    }
                });

                // Make stage touch clickable to trigger jump for mobile
                addStageListener(stageBox, 'click', () => {
                    if (!isJumping) {
                        isJumping = true;
                        spriteCat.style.transition = 'all 0.2s ease-out';
                        catCoords.y = 50;
                        setSpriteCoords(spriteCat, catCoords.x, catCoords.y);
                        activeTimeouts.push(setTimeout(() => {
                            spriteCat.style.transition = 'all 0.2s ease-in';
                            catCoords.y = -70;
                            setSpriteCoords(spriteCat, catCoords.x, catCoords.y);
                            activeTimeouts.push(setTimeout(() => {
                                isJumping = false;
                                spriteCat.style.transition = 'none';
                            }, 200));
                        }, 250));
                    }
                });

                // Obstacle loop
                let interval = setInterval(() => {
                    rockX -= 8;
                    if (rockX <= -220) {
                        rockX = 220;
                        stepsCount++;
                        stageVarVal.textContent = stepsCount;
                        logToConsole(`ระบบ: กระโดดหลบก้อนหินผ่านแล้ว ${stepsCount}/2 รอบ`, "system");
                        
                        if (stepsCount >= 2) {
                            clearInterval(interval);
                            triggerSuccess("กระโดดข้ามรั้วก้อนหินระเบิดครบ 2 รอบปลอดภัย!");
                        }
                    }
                    setSpriteCoords(spriteTarget, rockX, -70);

                    // Collision Detection
                    let currentCatY = getSpriteCoords(spriteCat).y;
                    let distance = Math.abs(rockX - (-120));
                    if (distance < 28 && currentCatY < -30) {
                        // Collision!
                        logToConsole("ระบบ: โอ๊ะ! ชนก้อนหินเต็มๆ เริ่มนับรอบใหม่", "system");
                        rockX = 220;
                        stepsCount = 0;
                        stageVarVal.textContent = stepsCount;
                        
                        // flash effect
                        stageBox.style.backgroundColor = '#fee2e2';
                        setTimeout(() => { stageBox.style.backgroundColor = 'white'; }, 200);
                    }
                }, 40);
                activeIntervals.push(interval);
            }
        },
        "9": {
            title: "ภารกิจที่ 9: เหมียวสองตัววิทยุสื่อสาร",
            objective: "สัมผัสตัวแมวส้มตัวที่ 1 (🐱) เพื่อส่งรหัสข้อความแบบกระจายเสียง (Broadcast) 'สวัสดี' ส่งผลให้แมวตัวที่ 2 (😸) ที่แอบซ่อนอยู่ ได้รับสารนำไปสู่การแสดงผลและส่งเสียงตอบรับ",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อตัวละครนี้ถูกคลิก' },
                { type: 'stack', category: 'events', text: 'กระจาย <span class="scratch-input-dropdown" style="background:rgba(0,0,0,0.08); color:#1e293b;">สวัสดี</span>' },
                { type: 'hat', category: 'events', text: 'เมื่อฉันได้รับ <span class="scratch-input-dropdown" style="background:rgba(0,0,0,0.08); color:#1e293b;">สวัสดี</span>' },
                { type: 'stack', category: 'looks', text: 'แสดง' },
                { type: 'stack', category: 'looks', text: 'พูด <span class="scratch-input-pill">สวัสดีเพื่อนซี้!</span> เป็นเวลา <span class="scratch-input-pill">2</span> วินาที' }
            ],
            steps: [
                "เขียนคำสั่งให้สไปรท์แมวตัวที่ 1: ใช้บล็อก 'เมื่อตัวละครนี้ถูกคลิก' ต่อด้วย 'กระจาย สวัสดี' ในหมวดเหตุการณ์เพื่อหักช่องทางวิทยุ",
                "เขียนคำสั่งดักจับที่สไปรท์ตัวที่ 2: ดึงบล็อกตั้งต้น 'เมื่อฉันได้รับ สวัสดี'",
                "นำคำสั่งสีม่วง 'แสดง' มาช่วยแก้สถานะการถูกซ่อนและใช้ 'พูด สวัสดีเพื่อนซี้! 2 วินาที' เพื่อตอบบทสนทนา"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                spriteExtra.style.display = 'none'; // Cat B hidden initially
                
                setSpriteCoords(spriteCat, -80, 0);
                setSpriteCoords(spriteExtra, 80, 0);
                
                stageVarDisplay.style.display = 'none';
                logToConsole("ระบบ: รันจำลองแล้วกดจิ้มตัวแมวส้มฝั่งซ้ายเพื่อลองส่งสัญญาณคลื่นวิทยุ!", "system");
            },
            start: () => {
                addStageListener(spriteCat, 'click', () => {
                    if (!isRunning) return;
                    logToConsole("แมวส้ม (ซ้าย): ส่งคลื่นเสียง [กระจายข้อความ 'สวัสดี']", "sprite");
                    
                    speechBubble.textContent = 'สวัสดี!';
                    speechBubble.style.display = 'block';
                    setSpriteCoords(speechBubble, -80, 45);

                    activeTimeouts.push(setTimeout(() => {
                        speechBubble.style.display = 'none';
                        logToConsole("แมว B (ขวา): ได้รับรหัสสัญญาณ 'สวัสดี' -> สั่งทำงาน [แสดงตัวละคร]", "system");
                        
                        spriteExtra.style.display = 'flex';
                        
                        // Speech Bubble for cat B
                        activeTimeouts.push(setTimeout(() => {
                            speechBubble.textContent = 'สวัสดีเพื่อนซี้!';
                            speechBubble.style.display = 'block';
                            setSpriteCoords(speechBubble, 80, 45);
                            logToConsole("แมว B (ขวา): พูดทักทายตอบกลับ...", "sprite");
                            
                            activeTimeouts.push(setTimeout(() => {
                                triggerSuccess("ส่งและรับสัญญาณวิทยุกระจายเสียงเสร็จสมบูรณ์!");
                            }, 1500));
                        }, 500));
                    }, 1000));
                });
            }
        },
        "10": {
            title: "ภารกิจที่ 10: ตัวนับก้าวขยันเดิน",
            objective: "สั่งให้ตัวละครแมวเดินไปข้างหน้าทีละก้าว โดยทุกครั้งที่แมวก้าวเดิน ตัวแปรเก็บจำนวนก้าว (steps) ในระบบจะบวกเพิ่มขึ้นทีละ 1 ก้าว เดินครบ 10 ก้าวเพื่อเข้าวิน",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'stack', category: 'variables', text: 'ตั้งค่า <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">steps</span> เป็น <span class="scratch-input-pill">0</span>' },
                { type: 'c-start', category: 'control', text: 'ทำซ้ำ <span class="scratch-input-pill">10</span> รอบ' },
                { type: 'stack', category: 'motion', text: 'เดินหน้า <span class="scratch-input-pill">20</span> ก้าว' },
                { type: 'stack', category: 'variables', text: 'เปลี่ยนค่า <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">steps</span> ทีละ <span class="scratch-input-pill">1</span>' },
                { type: 'stack', category: 'control', text: 'รอ <span class="scratch-input-pill">0.2</span> วินาที' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "ตั้งตารางตัวแปรระบบ 'ตั้งค่า steps เป็น 0'",
                "ครอบจังหวะทวนคำสั่งด้วยลูป 'ทำซ้ำ 10 รอบ'",
                "นำบล็อกเคลื่อนที่ 'เดินหน้า 20 ก้าว' มาขยับตัวละครภายในลูป",
                "เพิ่มค่าตัวเลขสะสมของตัวแปรนับก้าวด้วย 'เปลี่ยนค่า steps ทีละ 1' และพัก 'รอ 0.2 วินาที'"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, -160, 0);
                
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'ก้าวสะสม (steps):';
                score = 0;
                stageVarVal.textContent = score;
            },
            start: () => {
                logToConsole("แมวส้ม: เริ่มต้นระบบนับก้าวขยันเดิน...", "sprite");
                let catX = -160;
                let interval = setInterval(() => {
                    score++;
                    stageVarVal.textContent = score;
                    
                    catX += 20;
                    setSpriteCoords(spriteCat, catX, 0);
                    
                    spriteCat.textContent = score % 2 === 0 ? '😸' : '🐱';
                    logToConsole(`ระบบ: บวกเพิ่มตัวแปรนับก้าวสะสม steps = ${score}`, "system");

                    if (score >= 10) {
                        clearInterval(interval);
                        spriteCat.textContent = '😸';
                        triggerSuccess("แมวเดินรอบเวทีและแปรค่านับก้าวได้ถูกต้องครบถ้วน!");
                    }
                }, 300);
                activeIntervals.push(interval);
            }
        },
        "11": {
            title: "ภารกิจที่ 11: เครื่องคิดเลขคูณเลขเร็ว",
            objective: "คำนวณสูตรคูณแสนสนุก แมวส้มจะทายคำถามคณิตศาสตร์ '6 คูณ 8 ได้เท่าไหร่?' ให้หาคำตอบและพิมพ์ตอบในกล่องเพื่อไขรหัสภารกิจ",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'stack', category: 'sensing', text: 'ถาม <span class="scratch-input-pill" style="color:black; background:white; font-size:11px; padding:1px 6px;">6 x 8 ได้เท่าไหร่?</span> และรอ' },
                { type: 'c-start', category: 'control', text: 'ถ้า <span class="scratch-input-hexagon" style="background:#40BF50; padding:1px 6px;"><span style="background:rgba(255,255,255,0.2); border-radius:40px; padding:1px 4px;">คำตอบ</span> = 48</span> แล้ว' },
                { type: 'stack', category: 'looks', text: 'พูด <span class="scratch-input-pill">ยินดีด้วยเก่งมากๆ!</span>' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "สร้างสคริปต์หลักเริ่มต้นด้วย 'เมื่อคลิก 🟢'",
                "ใช้คำถามตรวจจับ 'ถาม 6 x 8 ได้เท่าไหร่? และรอ'",
                "ใช้ตรรกะเท่ากับ '=' วางค่าตัวแปร 'คำตอบ' เทียบเท่ากับเลข '48'"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, 0, 0);
                stageVarDisplay.style.display = 'none';
                answerBox.style.display = 'flex';
                answerInput.value = '';
                
                speechBubble.style.display = 'block';
                speechBubble.textContent = 'คำถามควิซคณิต: 6 x 8 ได้ผลลัพธ์เท่ากับเท่าไหร่ครับ?';
                setSpriteCoords(speechBubble, 0, 45);
            },
            start: () => {
                logToConsole("แมวส้ม: ถามโจทย์คูณเลข '6 x 8 = ?'", "sprite");
                
                addStageListener(btnSubmitAnswer, 'click', handleAnswer);
                addStageListener(answerInput, 'keypress', (e) => {
                    if (e.key === 'Enter') handleAnswer();
                });

                function handleAnswer() {
                    let ans = answerInput.value.trim();
                    if (ans === '48') {
                        speechBubble.textContent = 'คำตอบถูกต้อง! เก่งมากๆ เลยครับ 👏';
                        logToConsole("แมวส้ม: ว้าว 48 เป็นคำตอบที่ใช่!", "sprite");
                        answerBox.style.display = 'none';
                        activeTimeouts.push(setTimeout(() => {
                            triggerSuccess("ตอบคำถามสูตรคูณวิเศษได้ถูกต้อง 6 x 8 = 48");
                        }, 1500));
                    } else {
                        speechBubble.textContent = 'ลองสุ่มคิดเลขในใจแล้วทายคำตอบใหม่อีกทีนะ!';
                        logToConsole("ระบบ: คำตอบยังผิด พยายามต่อไป", "system");
                        answerInput.value = '';
                    }
                }
            }
        },
        "12": {
            title: "ภารกิจที่ 12: นักล่าสมบัติหาระยะห่าง",
            objective: "ค้นหากุญแจสมบัติทองคำ (🔑) ที่แฝงตัวล่องหนอยู่บนเวที โดยระบบจะคำนวณระยะห่างชี้ไกด์บอกทาง ยิ่งเมาส์เข้าใกล้ค่าตัวเลขจะลดลง ปัดเมาส์แตะกุญแจให้เจอในระยะ 20 พิกเซล",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'c-start', category: 'control', text: 'วนซ้ำตลอดไป' },
                { type: 'stack', category: 'variables', text: 'ตั้งค่า <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">ระยะห่าง</span> เป็น <span class="scratch-input-hexagon" style="background:#4CBFE6; padding:1px 6px;">ระยะห่างไปยัง ตัวชี้เมาส์</span>' },
                { type: 'c-start', category: 'control', text: 'ถ้า <span class="scratch-input-hexagon" style="background:#40BF50; padding:1px 6px;">ระยะห่าง < 20</span> แล้ว' },
                { type: 'stack', category: 'looks', text: 'แสดงตัวละครกุญแจ' },
                { type: 'c-end', category: 'control' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "ใช้เหตุการณ์หลัก 'เมื่อคลิก 🟢' ครอบตรรกะวนซ้ำ 'วนซ้ำตลอดไป'",
                "นำบล็อกตรวจจับ 'ระยะห่างไปยัง ตัวชี้เมาส์' อัปเดตเก็บลงตัวแปร 'ระยะห่าง'",
                "สร้างกล่องทางเลือกเงื่อนไข 'ถ้า ระยะห่าง < 20 แล้ว' เพื่อแสดงตัวนำสมบัติล่องหนออกมา"
            ],
            setup: () => {
                spriteCat.style.display = 'none'; // hide cat, hunt for key instead
                spriteTarget.style.display = 'flex';
                spriteTarget.textContent = '🔑';
                spriteTarget.style.opacity = '0'; // Invisible key
                
                // Random position for key
                let rx = Math.random() * 200 - 100;
                let ry = Math.random() * 140 - 70;
                setSpriteCoords(spriteTarget, rx, ry);
                
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'ระยะห่างกุญแจ:';
                stageVarVal.textContent = 'เลื่อนเมาส์ชี้หา...';
                
                logToConsole("ระบบ: รันจำลองแล้วเลื่อนเมาส์ชี้ไปรอบๆ เวทีเพื่อค้นหากุญแจทองคำที่ล่องหนอยู่!", "system");
            },
            start: () => {
                addStageListener(stageBox, 'mousemove', (e) => {
                    if (!isRunning) return;
                    const rect = stageBox.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left - (stageBox.clientWidth / 2);
                    const mouseY = (stageBox.clientHeight / 2) - (e.clientY - rect.top);
                    
                    const keyCoords = getSpriteCoords(spriteTarget);
                    const dist = Math.sqrt(Math.pow(mouseX - keyCoords.x, 2) + Math.pow(mouseY - keyCoords.y, 2));
                    
                    stageVarVal.textContent = Math.round(dist);
                    
                    // visual feedback: key fades in as mouse gets closer
                    let opacity = Math.max(0, 1 - (dist / 180));
                    spriteTarget.style.opacity = opacity;

                    if (dist < 20) {
                        spriteTarget.style.opacity = '1';
                        spriteTarget.style.transform = 'scale(1.5)';
                        logToConsole("ระบบ: ว้าว! เจอกุญแจไขหีบสมบัติทองคำแล้ว!", "system");
                        triggerSuccess("ค้นหากุญแจสมบัติโดยคำนวณจากตัวจับระยะห่างเสร็จสมบูรณ์!");
                    }
                });
            }
        },
        "13": {
            title: "ภารกิจที่ 13: ดนตรีตามตำแหน่ง X",
            objective: "ประยุกต์ลากตัวละครแมว (🐱) ไปทางขวา แกน X จะเพิ่มขึ้นและระดับเสียง (Pitch) จะสูงแหลมขึ้น ลากตัวละครไปที่ x มากกว่า 160 เพื่อผ่านด่าน",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'c-start', category: 'control', text: 'วนซ้ำตลอดไป' },
                { type: 'stack', category: 'sound', text: 'ตั้งค่าเอฟเฟกต์ <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">เสียงสูงต่ำ</span> เป็น <span class="scratch-input-hexagon" style="background:#4D97FF; padding:1px 6px;">ตำแหน่ง x</span>' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "เชื่อมโยงด้วย 'เมื่อคลิก 🟢' และสร้าง 'วนซ้ำตลอดไป'",
                "ในบล็อกสีชมพู 'ตั้งค่าเอฟเฟกต์ เสียงสูงต่ำ เป็น ...' ให้ดึงบล็อกตัวรายงานค่าพิกัด 'ตำแหน่ง x' สีฟ้ามาใส่ลงไป",
                "ลากตัวละครเหมียวไปทางขวาสุดเพื่อปรับโทนระดับเสียงคีย์สูงและสัมผัสความก้าวหน้า"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, -120, 0);
                
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'ตำแหน่งแกน X:';
                stageVarVal.textContent = '-120';
                
                logToConsole("ระบบ: จิ้มเมาส์ค้างที่ตัวแมว แล้วลากแมวส้มไปฝั่งขวาสุดของเวที!", "system");
            },
            start: () => {
                let isDragging = false;
                
                addStageListener(spriteCat, 'mousedown', (e) => {
                    isDragging = true;
                    spriteCat.style.cursor = 'grabbing';
                });
                
                addStageListener(window, 'mouseup', () => {
                    isDragging = false;
                    spriteCat.style.cursor = 'grab';
                });
                
                addStageListener(stageBox, 'mousemove', (e) => {
                    if (!isRunning || !isDragging) return;
                    
                    const rect = stageBox.getBoundingClientRect();
                    let mouseX = e.clientX - rect.left - (stageBox.clientWidth / 2);
                    
                    // Keep cat in boundaries
                    mouseX = Math.min(200, Math.max(-200, mouseX));
                    
                    setSpriteCoords(spriteCat, mouseX, 0);
                    stageVarVal.textContent = Math.round(mouseX);
                    
                    // pitch feedback simulation
                    let pitch = Math.round(100 + (mouseX * 0.7));
                    logToConsole(`แมวส้ม: เสียงดนตรี Pitch = ${pitch}% (ตำแหน่ง x: ${Math.round(mouseX)})`, "sprite");

                    if (mouseX >= 160) {
                        isDragging = false;
                        triggerSuccess("ตั้งค่า Pitch ระดับเสียงสูงตามตำแหน่งแกน x สำเร็จ!");
                    }
                });
            }
        },
        "14": {
            title: "ภารกิจที่ 14: เลขคณิตหาเศษเหลือ (Modulo)",
            objective: "ท้าทายตรรกะเศษเลขคณิต '15 หารด้วย 4 เหลือเศษเท่าไหร่?' ป้อนคำตอบเศษที่ได้เพื่อผ่านภารกิจปลดล็อกด่านถัดไป",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'stack', category: 'sensing', text: 'ถาม <span class="scratch-input-pill" style="color:black; background:white; font-size:11px; padding:1px 6px;">15 mod 4 ได้เท่าไหร่?</span> และรอ' },
                { type: 'c-start', category: 'control', text: 'ถ้า <span class="scratch-input-hexagon" style="background:#40BF50; padding:1px 6px;"><span style="background:rgba(255,255,255,0.2); border-radius:40px; padding:1px 4px;">คำตอบ</span> = 3</span> แล้ว' },
                { type: 'stack', category: 'looks', text: 'พูด <span class="scratch-input-pill">คำตอบเจ๋งมาก! เหลือเศษ 3</span>' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "วางสวม 'เมื่อคลิก 🟢' และตั้งค่าอินเตอร์เฟสควิซ",
                "เลือกบล็อก Operators สีเขียวตัวคำนวณหาค่าเศษเหลือ 'mod' ในการทดสอบตรรกะระบบเบื้องหลัง",
                "พิมพ์ข้อความตรรกะเทียบผลลัพธ์เศษที่คำนวณจากสูตร '15 mod 4 = 3'"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, 0, 0);
                stageVarDisplay.style.display = 'none';
                answerBox.style.display = 'flex';
                answerInput.value = '';
                
                speechBubble.style.display = 'block';
                speechBubble.textContent = '15 mod 4 หรือ 15 หารด้วย 4 เหลือเศษเท่าไหร่ครับเด็กๆ?';
                setSpriteCoords(speechBubble, 0, 45);
            },
            start: () => {
                addStageListener(btnSubmitAnswer, 'click', checkAns);
                addStageListener(answerInput, 'keypress', (e) => {
                    if (e.key === 'Enter') checkAns();
                });

                function checkAns() {
                    let ans = answerInput.value.trim();
                    if (ans === '3') {
                        speechBubble.textContent = 'คำตอบถูกต้อง! 15 หารด้วย 4 ได้ 3 เหลือเศษ 3';
                        logToConsole("แมวส้ม: เศษคือ 3! ผ่านด่านครับ", "sprite");
                        answerBox.style.display = 'none';
                        activeTimeouts.push(setTimeout(() => {
                            triggerSuccess("ผ่านด่านถอดสมการ Modulo เลขเศษเหลือสำเร็จ!");
                        }, 1500));
                    } else {
                        speechBubble.textContent = 'ยังไม่ใช่เศษที่ถูกต้อง ลองนับสูตรคูณแม่ 4 ดู!';
                        logToConsole("ระบบ: คำตอบยังไม่ถูก ลองใหม่อีกครั้ง", "system");
                        answerInput.value = '';
                    }
                }
            }
        },
        "15": {
            title: "ภารกิจที่ 15: สวิตช์ปิดเปิดไฟเวที",
            objective: "ประยุกต์เปลี่ยนรูปชุดสไตล์ฉากเวที (Backdrop) สลัวโหมดมืดสลับสว่าง โดยการกดจิ้มหลอดไฟสวิตช์ด้านบนเวทีเพื่อเปลี่ยนชุดแต่งให้ห้องสว่างไสว",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'stack', category: 'looks', text: 'สลับคอสตูมฉากหลังเป็น <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">dark_room</span>' },
                { type: 'hat', category: 'events', text: 'เมื่อคลิกตัวละครหลอดไฟ' },
                { type: 'stack', category: 'events', text: 'กระจาย <span class="scratch-input-dropdown" style="background:rgba(0,0,0,0.08); color:#1e293b;">เปิดไฟ</span>' },
                { type: 'hat', category: 'events', text: 'เมื่อได้รับ <span class="scratch-input-dropdown" style="background:rgba(0,0,0,0.08); color:#1e293b;">เปิดไฟ</span>' },
                { type: 'stack', category: 'looks', text: 'สลับคอสตูมฉากหลังเป็น <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">light_room</span>' }
            ],
            steps: [
                "ตั้งค่าฉากห้องให้เริ่มต้นเป็นโหมดมืดด้วย 'สลับคอสตูมฉากหลังเป็น dark_room'",
                "ดึงตัวสวิตช์เปิดปิด 'เมื่อคลิกตัวละครหลอดไฟ' ส่งสัญญาณแบบไร้สาย 'กระจาย เปิดไฟ'",
                "ดักจับสัญญาณที่ตัวละครฉากหลัง 'เมื่อได้รับ เปิดไฟ' และจัดการเปลี่ยนเป็น 'light_room'"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, 0, -40);
                
                spriteTarget.style.display = 'flex';
                spriteTarget.textContent = '💡'; // Bulb switch
                setSpriteCoords(spriteTarget, 0, 80);
                
                stageBox.style.backgroundColor = '#1e293b'; // dark room
                stageVarDisplay.style.display = 'none';
                logToConsole("ระบบ: ห้องมืดสนิทอยู่ จิ้มที่ตัวหลอดไฟ 💡 เพื่อเปิดสวิตช์ไฟกัน!", "system");
            },
            start: () => {
                addStageListener(spriteTarget, 'click', () => {
                    if (!isRunning) return;
                    logToConsole("หลอดไฟ: สวิตช์ถูกเปิด! กระจายสัญญาณ [เปิดไฟ]", "system");
                    
                    stageBox.style.backgroundColor = '#fef08a'; // bright yellow light
                    spriteTarget.textContent = '🟡'; // lit bulb
                    spriteCat.textContent = '😸';
                    logToConsole("ฉากหลัง: ได้รับสัญญาณ [เปิดไฟ] -> เปลี่ยนพื้นหลังห้องสว่างไสว", "system");
                    
                    speechBubble.textContent = 'เย้! ห้องสว่างแล้ว!';
                    speechBubble.style.display = 'block';
                    setSpriteCoords(speechBubble, 0, 5);
                    
                    activeTimeouts.push(setTimeout(() => {
                        triggerSuccess("เปิดสวิตช์ไฟสลับชุดแต่งฉากหลังห้องสำเร็จ!");
                    }, 1500));
                });
            }
        },
        "16": {
            title: "ภารกิจที่ 16: วิ่งแข่งเต่ากับหอยทาก",
            objective: "กดปุ่มเพื่อจำลองรันวิ่งแข่งขันความเร็วระหว่างเต่า (🐢 - สปีดเดินเร็วและรอจังหวะสั้น) และหอยทาก (🐌 - สปีดขยับช้าหน่วงนาน) จนกว่าเต่าจะวิ่งชนเส้นชัยชัยชนะ",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'c-start', category: 'control', text: 'วนซ้ำตลอดไป' },
                { type: 'stack', category: 'motion', text: 'เดินหน้า <span class="scratch-input-pill">12</span> ก้าว' },
                { type: 'stack', category: 'control', text: 'รอ <span class="scratch-input-pill">0.05</span> วินาที' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "ตั้งพิกัดสไปรท์สองผู้แข่งขันที่มุมซ้ายของเวทีจำลองระนาบ X และ Y แตกต่างกัน",
                "ใส่ลูปให้ตัวเต่าวิ่งด้วยความเร็วสูง 'เดินหน้า 12 ก้าว' และพ่วงบล็อก 'รอ 0.05 วินาที'",
                "ใส่ลูปให้ตัวหอยทากขยับสปีดต่ำ 'เดินหน้า 3 ก้าว' และพ่วง 'รอ 0.15 วินาที'"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                spriteCat.textContent = '🐢'; // Turtle
                spriteExtra.style.display = 'flex';
                spriteExtra.textContent = '🐌'; // Snail
                
                setSpriteCoords(spriteCat, -180, 30);
                setSpriteCoords(spriteExtra, -180, -30);
                
                stageVarDisplay.style.display = 'none';
                logToConsole("ระบบ: ใครจะถึงเส้นชัยขวาสุดก่อนกันนะ? กดปุ่มเพื่อเริ่มสตาร์ท!", "system");
            },
            start: () => {
                let turX = -180;
                let snaX = -180;
                
                let interval = setInterval(() => {
                    // Turtle moves faster
                    turX += 8;
                    // Snail moves slower
                    snaX += 2.5;
                    
                    setSpriteCoords(spriteCat, turX, 30);
                    setSpriteCoords(spriteExtra, snaX, -30);
                    
                    if (turX >= 150) {
                        clearInterval(interval);
                        logToConsole("เต่า: ฉันถึงเส้นชัยชนะการแข่งขันขยันวิ่งแล้ว! 🏆", "sprite");
                        speechBubble.textContent = 'ฉันชนะแล้ว!';
                        speechBubble.style.display = 'block';
                        setSpriteCoords(speechBubble, turX, 70);
                        
                        activeTimeouts.push(setTimeout(() => {
                            triggerSuccess("การจำลองสเต็ปการแข่งความเร็วเสร็จสิ้น เต่าเข้าเส้นชัยก่อน!");
                        }, 1200));
                    }
                }, 50);
                activeIntervals.push(interval);
            }
        },
        "17": {
            title: "ภารกิจที่ 17: ตัวตรวจสอบตรรกะจริงหรือเท็จ",
            objective: "วิเคราะห์สมการเปรียบเทียบเชิงเชื่อมรวมเงื่อนไขสีเขียว: '10 > 5 AND 3 < 8 ใช่หรือไม่?' พิมพ์ตอบ yes หรือ no เพื่อยืนยันหลักประโยคจริงเท็จ",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'stack', category: 'sensing', text: 'ถาม <span class="scratch-input-pill" style="color:black; background:white; font-size:11px; padding:1px 6px;">10 > 5 และ 3 < 8 ใช่หรือไม่? (yes/no)</span> และรอ' },
                { type: 'c-start', category: 'control', text: 'ถ้า <span class="scratch-input-hexagon" style="background:#40BF50; padding:1px 6px;"><span style="background:rgba(255,255,255,0.2); border-radius:40px; padding:1px 4px;">คำตอบ</span> = yes</span> แล้ว' },
                { type: 'stack', category: 'looks', text: 'พูด <span class="scratch-input-pill">สมการจริง เชื่อมด้วย และ เป็นจริง!</span>' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "ตั้งเงื่อนไขรับค่าตรวจจับพิกัดคีย์บอร์ดถามผู้เรียน",
                "วิเคราะห์นิพจน์ด้วยตัวดำเนินการ 'และ' เชื่อมทั้ง 2 ฝั่งให้เป็นบวกจริง",
                "เนื่องจาก 10 > 5 (เป็นจริง) และ 3 < 8 (เป็นจริง) ส่งผลลัพธ์เป็น จริง (yes)"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, 0, 0);
                stageVarDisplay.style.display = 'none';
                answerBox.style.display = 'flex';
                answerInput.value = '';
                
                speechBubble.style.display = 'block';
                speechBubble.textContent = 'วิเคราะห์ตรรกะ: 10 > 5 AND 3 < 8 ใช่หรือไม่? (พิมพ์ yes หรือ no)';
                setSpriteCoords(speechBubble, 0, 45);
            },
            start: () => {
                addStageListener(btnSubmitAnswer, 'click', testLogic);
                addStageListener(answerInput, 'keypress', (e) => {
                    if (e.key === 'Enter') testLogic();
                });

                function testLogic() {
                    let ans = answerInput.value.trim().toLowerCase();
                    if (ans === 'yes' || ans === 'ใช่') {
                        speechBubble.textContent = 'วิเคราะห์ถูกต้อง! จริง และ จริง ได้ผลลัพธ์เป็น จริง';
                        logToConsole("แมวส้ม: ตอบถูก! สมการนี้เป็นจริง (yes)", "sprite");
                        answerBox.style.display = 'none';
                        activeTimeouts.push(setTimeout(() => {
                            triggerSuccess("ผ่านด่านไขรหัสวิเคราะห์ Operators logic สมบูรณ์!");
                        }, 1500));
                    } else {
                        speechBubble.textContent = 'วิเคราะห์ผิดแล้วลองดูค่าจริงของทั้งสองฝั่งนะ!';
                        logToConsole("ระบบ: คำตอบยังไม่ถูก ลองพิมพ์ตอบ yes", "system");
                        answerInput.value = '';
                    }
                }
            }
        },
        "18": {
            title: "ภารกิจที่ 18: เกมจับหนูจอมซน",
            objective: "เล่นเกมแบบโต้ตอบ ตัวแมวจะวิ่งตามเมาส์ชี้เป้า ให้น้องๆ นำเมาส์ไปชี้ล่อจับตัวหนู (🐭) ที่วิ่งสุ่มตำแหน่งบนเวทีให้ครบ 5 คะแนนสะสม",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'c-start', category: 'control', text: 'วนซ้ำตลอดไป' },
                { type: 'stack', category: 'motion', text: 'ไปที่ <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">ตัวชี้เมาส์</span>' },
                { type: 'c-start', category: 'control', text: 'ถ้า <span class="scratch-input-hexagon" style="background:#4CBFE6; padding:1px 6px;">แตะ หนูจอมซน ?</span> แล้ว' },
                { type: 'stack', category: 'variables', text: 'เปลี่ยนค่า <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">คะแนน</span> ทีละ <span class="scratch-input-pill">1</span>' },
                { type: 'stack', category: 'motion', text: 'ไปที่ตำแหน่งสุ่มของหนู' },
                { type: 'c-end', category: 'control' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "ใช้คำสั่งวนซ้ำตลอดไปสั่งตัวแมว 'ไปที่ ตัวชี้เมาส์' เพื่อเคลื่อนที่ติดตามการควบคุม",
                "ครอบเงื่อนไขชนด้วยบล็อก 'ถ้า แตะ หนูจอมซน ? แล้ว'",
                "ทุกครั้งที่จับสัมผัสชน ให้บวกคะแนนสะสมทีละ 1 แต้มและย้ายตัวหนูสุ่มตำแหน่งใหม่ไปเรื่อยๆ"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                spriteTarget.style.display = 'flex';
                spriteTarget.textContent = '🐭'; // mouse
                
                setSpriteCoords(spriteCat, 0, 0);
                // Random position for mouse
                let rx = Math.random() * 200 - 100;
                let ry = Math.random() * 120 - 60;
                setSpriteCoords(spriteTarget, rx, ry);
                
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'แต้มจับหนู:';
                score = 0;
                stageVarVal.textContent = score;
                
                logToConsole("ระบบ: เคลื่อนเมาส์ชี้บนเวทีล่อแมวส้มให้วิ่งชนจับตัวหนูครบ 5 ตัว!", "system");
            },
            start: () => {
                addStageListener(stageBox, 'mousemove', (e) => {
                    if (!isRunning) return;
                    const rect = stageBox.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left - (stageBox.clientWidth / 2);
                    const mouseY = (stageBox.clientHeight / 2) - (e.clientY - rect.top);
                    
                    // Cat follows mouse coordinates
                    setSpriteCoords(spriteCat, Math.min(220, Math.max(-220, mouseX)), Math.min(140, Math.max(-140, mouseY)));
                    
                    // Check touch mouse collision
                    let dist = getDistance(spriteCat, spriteTarget);
                    if (dist < 26) {
                        score++;
                        stageVarVal.textContent = score;
                        logToConsole(`แมวส้ม: จับตัวหนูจอมซนได้แล้ว สะสมได้ ${score}/5 แต้ม`, "sprite");
                        
                        if (score >= 5) {
                            triggerSuccess("ล่าแต้มความขยันตะครุบจับหนูจอมซนครบ 5 แต้ม!");
                        } else {
                            // Spawn mouse to another random spot
                            let rx = Math.random() * 200 - 100;
                            let ry = Math.random() * 120 - 60;
                            setSpriteCoords(spriteTarget, rx, ry);
                        }
                    }
                });
            }
        },
        "19": {
            title: "ภารกิจที่ 19: หัวใจแอนิเมชันเต้นตึกตัก",
            objective: "สั่งสร้างภาพเคลื่อนไหวหัวใจ (❤️) เต้นบีบขยายสลับร่างวนซ้ำตลอดไป โดยขยายขนาดโตขึ้น 130% รอ 0.15 วิ และย่อตัวเหลือ 80% รอ 0.15 วิ ทำสลับกันให้ครบ 5 จังหวะเต้น",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'c-start', category: 'control', text: 'วนซ้ำตลอดไป' },
                { type: 'stack', category: 'looks', text: 'ตั้งค่าขนาดเป็น <span class="scratch-input-pill">130</span> %' },
                { type: 'stack', category: 'control', text: 'รอ <span class="scratch-input-pill">0.15</span> วินาที' },
                { type: 'stack', category: 'looks', text: 'ตั้งค่าขนาดเป็น <span class="scratch-input-pill">80</span> %' },
                { type: 'stack', category: 'control', text: 'รอ <span class="scratch-input-pill">0.15</span> วินาที' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "เปลี่ยนคอสตูมเป็นรูปหัวใจและใส่ตัวบล็อกครอบวนซ้ำทำภาพเคลื่อนไหว",
                "ขยายโพรไฟล์ขนาดตัวหัวใจสูงขึ้นด้วยการ 'ตั้งค่าขนาดเป็น 130% และหน่วงรอสั้นๆ'",
                "บีบหดกลับด้วยบล็อก Looks 'ตั้งค่าขนาดเป็น 80%' และปล่อยหน่วงเพื่อให้เกิดจังหวะเต้นสมบูรณ์"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                spriteCat.textContent = '❤️'; // Change cat emoji to heart
                setSpriteCoords(spriteCat, 0, 0);
                
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'ชีพจรหัวใจเต้น:';
                score = 0;
                stageVarVal.textContent = 'ปกติ';
            },
            start: () => {
                logToConsole("ระบบ: เริ่มทำแอนิเมชันชีพจรหัวใจเต้นสลับขนาด...", "system");
                let pulse = 0;
                let scaleBig = true;
                
                let interval = setInterval(() => {
                    if (scaleBig) {
                        spriteCat.style.transform = 'scale(1.4)';
                        stageVarVal.textContent = 'ขยายโต (130%)';
                    } else {
                        spriteCat.style.transform = 'scale(0.8)';
                        stageVarVal.textContent = 'บีบตัว (80%)';
                        pulse++;
                        logToConsole(`หัวใจ: เต้นจังหวะตึกล่าสุดรอบที่ ${pulse}/5`, "system");
                    }
                    
                    scaleBig = !scaleBig;
                    
                    if (pulse >= 5) {
                        clearInterval(interval);
                        spriteCat.style.transform = 'none';
                        triggerSuccess("จำลองภาพเคลื่อนไหวชีวจิตหัวใจเต้นสอดประสานจังหวะสำเร็จ!");
                    }
                }, 200);
                activeIntervals.push(interval);
            }
        },
        "20": {
            title: "ภารกิจที่ 20: วงล้อสุ่มเลขนำโชค",
            objective: "จำลองปุ่มตรรกะสุ่มจับฉลาก โดยคลิกธงเขียวเพื่อสุ่มตัวแปร 'เลขนำโชค' ระหว่าง 10 ถึง 99 หากค่าที่ออกมามีค่ายินยอมสูงกว่า 50 (เลขสุ่ม > 50) จะประกาศผ่านภารกิจ!",
            hints: [
                { type: 'hat', category: 'events', text: 'เมื่อคลิก 🟢' },
                { type: 'stack', category: 'variables', text: 'ตั้งค่า <span class="scratch-input-dropdown" style="background:rgba(255,255,255,0.2); color:white; border-radius:4px; padding:1px 4px;">เลขนำโชค</span> เป็น <span class="scratch-input-hexagon" style="background:#40BF50; padding:1px 6px;">เลือกสุ่มจาก 10 ถึง 99</span>' },
                { type: 'c-start', category: 'control', text: 'ถ้า <span class="scratch-input-hexagon" style="background:#40BF50; padding:1px 6px;">เลขนำโชค > 50</span> แล้ว' },
                { type: 'stack', category: 'looks', text: 'พูด <span class="scratch-input-pill">โชคดีสุดๆ! ผ่านด่านแล้ว</span>' },
                { type: 'c-end', category: 'control' }
            ],
            steps: [
                "เริ่มต้นด้วยบล็อกการตั้งสปินเหตุการณ์หลัก 'เมื่อคลิก 🟢'",
                "ใช้คำสั่งสุ่มเลข Operators สีเขียว 'เลือกสุ่มจาก 10 ถึง 99' ย้ายเก็บเข้าตัวแปร 'เลขนำโชค'",
                "นำบล็อกความสัมพันธ์แบบสมการค่าวิเคราะห์ '>' มาต่อตรวจเช็คเพื่อลุ้นว่ามีค่าสูงกว่า 50 หรือไม่"
            ],
            setup: () => {
                spriteCat.style.display = 'flex';
                setSpriteCoords(spriteCat, 0, -30);
                
                spriteTarget.style.display = 'flex';
                spriteTarget.textContent = '🎡'; // Spin wheel emoji
                setSpriteCoords(spriteTarget, 0, 60);
                
                stageVarDisplay.style.display = 'flex';
                stageVarName.textContent = 'เลขนำโชค:';
                stageVarVal.textContent = 'กดสุ่มลุ้นโชค...';
                
                logToConsole("ระบบ: จิ้มเมาส์คลิกปุ่มกงล้อสุ่ม 🎡 เพื่อเปิดลุ้นตัวเลขอธิษฐานรางวัล!", "system");
            },
            start: () => {
                addStageListener(spriteTarget, 'click', () => {
                    if (!isRunning) return;
                    
                    let rollInterval = 0;
                    let count = 0;
                    
                    logToConsole("กงล้อ: หมุนติ้วๆ ลุ้นเลขรางวัลนำโชค...", "system");
                    
                    let roll = setInterval(() => {
                        let tempNum = Math.floor(Math.random() * 90) + 10;
                        stageVarVal.textContent = tempNum;
                        count++;
                        
                        if (count >= 10) {
                            clearInterval(roll);
                            let finalNum = Math.floor(Math.random() * 90) + 10;
                            stageVarVal.textContent = finalNum;
                            logToConsole(`กงล้อ: หยุดที่เลขรางวัล = ${finalNum}`, "system");
                            
                            if (finalNum > 50) {
                                speechBubble.textContent = `เลขนำโชคคือ ${finalNum}! โชคดีผ่านฉลุย 🎉`;
                                speechBubble.style.display = 'block';
                                setSpriteCoords(speechBubble, 0, 15);
                                
                                activeTimeouts.push(setTimeout(() => {
                                    triggerSuccess(`สุ่มกงล้อได้ตัวเลขมงคล ${finalNum} สำเร็จ!`);
                                }, 1500));
                            } else {
                                speechBubble.textContent = `สุ่มได้ ${finalNum} (ยังน้อยกว่า 50) ลองจิ้มหมุนกงล้อลุ้นเลขใหม่อีกรอบนะ!`;
                                speechBubble.style.display = 'block';
                                setSpriteCoords(speechBubble, 0, 15);
                                logToConsole("ระบบ: คะแนนสุ่มยังไม่ถึง 50 กดจิ้มปุ่มกงล้อสปินอีกรอบได้เลย", "system");
                            }
                        }
                    }, 80);
                });
            }
        }
    };

    // --- 3. Mission Navigation & Loading Engine ---
    
    function loadMission(missionId) {
        currentMissionId = missionId;
        cleanupSimulation();
        
        const m = missions[missionId];
        if (!m) return;
        
        // Update Title & Objective
        missionTitle.textContent = m.title;
        missionObjective.textContent = m.objective;
        pageSectionTitle.textContent = `ภารกิจประยุกต์ด่านที่ ${missionId}`;
        
        // Update status badge style
        if (completedMissions[missionId]) {
            missionStatus.className = "mission-status-badge completed";
            missionStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> ภารกิจสำเร็จแล้ว';
        } else {
            missionStatus.className = "mission-status-badge pending";
            missionStatus.innerHTML = '<i class="fa-regular fa-clock"></i> กำลังรอทำภารกิจ';
        }
        
        // Render Coding Hint Blocks
        missionHintsList.innerHTML = '';
        m.hints.forEach((hint, index) => {
            missionHintsList.innerHTML += renderBlockHint(hint, index);
        });
        
        // Render Steps List
        missionStepsList.innerHTML = '';
        m.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            missionStepsList.appendChild(li);
        });
        
        // Clear workspace on load
        if (blockDropArea) {
            const blocks = blockDropArea.querySelectorAll('.scratch-block-visual');
            blocks.forEach(b => b.remove());
            if (dropPlaceholder) dropPlaceholder.style.display = 'block';
        }
        
        // Perform stage layout setup
        m.setup();
        
        logToConsole(`ระบบ: โหลดรายละเอียดภารกิจด่านที่ ${missionId} สำเร็จ พร้อมทำสคริปต์เรียบร้อย!`, "system");
    }

    const scratchConceptQuestions = {
        "1": {
            q: "หากต้องการให้แมวหมุนตัวไปทางขวา 90 องศา ต้องใช้บล็อกใด?",
            options: ["หมุนขวา 90 องศา", "เดินหน้า 90 ก้าว", "หันในทิศทาง 90"],
            correct: 0
        },
        "2": {
            q: "บล็อก 'เปลี่ยน Y ทีละ 10' จะทำให้ตัวละครเคลื่อนที่ในทิศทางใด?",
            options: ["เคลื่อนที่ขึ้นด้านบน", "เคลื่อนที่ไปทางขวา", "เคลื่อนที่ลงด้านล่าง"],
            correct: 0
        },
        "3": {
            q: "บล็อก 'หันในทิศทาง 180' จะทำให้แมวหันหน้าไปทางใด?",
            options: ["หันลงด้านล่าง", "หันไปทางซ้าย", "หันขึ้นด้านบน"],
            correct: 0
        },
        "4": {
            q: "บล็อกใดช่วยลดการประกอบบล็อกเดิมซ้ำๆ หลายครั้ง?",
            options: ["วนซ้ำ 10 ครั้ง", "ถ้า...แล้ว", "เมื่อคลิกธงเขียว"],
            correct: 0
        },
        "5": {
            q: "บล็อก 'เล่นเสียงจนจบ' ต่างจาก 'เริ่มเสียง' อย่างไร?",
            options: ["เล่นจนจบก่อนทำบล็อกถัดไป", "เล่นเสียงดังกว่า", "เล่นเสียงสั้นกว่า"],
            correct: 0
        },
        "6": {
            q: "ถ้าต้องการให้แมวเดินซ้ำๆ ไม่สิ้นสุด ควรใช้บล็อกวนซ้ำชนิดใด?",
            options: ["วนซ้ำตลอดไป", "วนซ้ำ 10 ครั้ง", "ทำซ้ำจนกระทั่ง"],
            correct: 0
        },
        "7": {
            q: "บล็อก 'ถ้า...แล้ว' (If) อยู่ในหมวดหมู่บล็อกสีใด?",
            options: ["สีส้ม (ควบคุม)", "สีเหลือง (เหตุการณ์)", "สีฟ้า (ตรวจจับ)"],
            correct: 0
        },
        "8": {
            q: "บล็อกใดใช้ดักฟังเพื่อให้โปรเจกต์เริ่มทำงานเมื่อคลิกปุ่มเริ่ม?",
            options: ["เมื่อคลิกธงเขียว", "เมื่อกดปุ่มสเปซบาร์", "เมื่อได้รับข้อความ"],
            correct: 0
        },
        "9": {
            q: "บล็อก 'เปลี่ยน X ทีละ -10' ทำให้แมวเดินไปทางทิศใด?",
            options: ["เดินถอยหลังไปทางซ้าย", "เดินขึ้นข้างบน", "เดินไปข้างหน้าทางขวา"],
            correct: 0
        },
        "10": {
            q: "การตั้งค่าให้ตัวละครไม่หันหัวกลับหัวเมื่อเดินย้อนกลับ ต้องปรับแบบใด?",
            options: ["ปรับทิศทางซ้าย-ขวา (Left-Right)", "ปรับหมุนรอบทิศ (All Around)", "ไม่ต้องปรับอะไรเลย"],
            correct: 0
        },
        "11": {
            q: "ถ้าจะดักจับเหตุการณ์เมื่อตัวละครชนกัน ควรใช้บล็อกหมวดหมู่ใด?",
            options: ["ตรวจจับ (Sensing)", "เหตุการณ์ (Events)", "ตัวดำเนินการ (Operators)"],
            correct: 0
        },
        "12": {
            q: "หากต้องการเก็บแต้มคะแนนของนักเรียนในโปรเจกต์ Scratch ควรใช้เครื่องมือใด?",
            options: ["ตัวแปร (Variables)", "ชุดตัวละคร (Costumes)", "เสียง (Sounds)"],
            correct: 0
        },
        "13": {
            q: "บล็อกตัวดำเนินการ 'และ' (AND) จะเป็นจริงเมื่อใด?",
            options: ["เมื่อเงื่อนไขทั้งสองฝั่งเป็นจริงพร้อมกัน", "เมื่อฝั่งใดฝั่งหนึ่งเป็นจริง", "เมื่อทั้งสองฝั่งเป็นเท็จ"],
            correct: 0
        },
        "14": {
            q: "บล็อกตัวดำเนินการ 'หรือ' (OR) จะเป็นจริงเมื่อใด?",
            options: ["เมื่อเงื่อนไขฝั่งใดฝั่งหนึ่งเป็นจริง", "เมื่อต้องเป็นจริงทั้งสองฝั่งเท่านั้น", "เมื่อไม่มีฝั่งใดเป็นจริงเลย"],
            correct: 0
        },
        "15": {
            q: "บล็อกสร้างโคลน (Clone) ช่วยทำหน้าที่อะไร?",
            options: ["ก๊อปปี้คัดลอกตัวละครเพิ่มขึ้นมาในฉาก", "เปลี่ยนรูปตัวละคร", "ลบตัวละครทิ้ง"],
            correct: 0
        },
        "16": {
            q: "บล็อกส่งสาร (Broadcast Message) ใช้ประโยชน์อย่างไร?",
            options: ["ส่งสัญญาณติดต่อระหว่างตัวละครเพื่อเริ่มทำคำสั่ง", "พิมพ์ตัวหนังสือโชว์บนจอ", "เล่นเพลงสั้น"],
            correct: 0
        },
        "17": {
            q: "บล็อกคำสั่ง 'ตั้งค่าคะแนนเป็น 0' ควรอยู่ในลำดับตำแหน่งใด?",
            options: ["ด้านบนสุด ใต้เหตุการณ์เริ่มโปรแกรม", "ตรงไหนก็ได้", "ล่างสุดเมื่อจบเกม"],
            correct: 0
        },
        "18": {
            q: "ถ้าต้องการให้ฉากหลังเปลี่ยนภาพเมื่อถึงด่านถัดไป ต้องใช้บล็อกใด?",
            options: ["สลับฉากหลังเป็น...", "สลับชุดตัวละครเป็น...", "แสดงตัวละคร"],
            correct: 0
        },
        "19": {
            q: "บล็อก 'ซ่อนตัวละคร' (Hide) อยู่ในหมวดหมู่รูปลักษณ์สีใด?",
            options: ["สีม่วง (Looks)", "สีฟ้า (Motion)", "สีชมพู (Sound)"],
            correct: 0
        },
        "20": {
            q: "โครงสร้างแบบ 'ทำซ้ำจนกระทั่ง' (Repeat Until) จะหยุดทำซ้ำเมื่อใด?",
            options: ["เมื่อเงื่อนไขหลังคำว่า 'จนกระทั่ง' เป็นจริง", "เมื่อทำครบรอบ 10 ครั้ง", "ไม่มีวันหยุด"],
            correct: 0
        }
    };

    // Trigger Success Event
    function triggerSuccess(successMessage) {
        isRunning = false;
        
        // Show Concept Check Quiz overlay first
        const conceptOverlay = document.getElementById('concept-overlay');
        const conceptQuestionText = document.getElementById('concept-question-text');
        const conceptOptions = document.getElementById('concept-options');
        const conceptFeedback = document.getElementById('concept-feedback');
        
        const qData = scratchConceptQuestions[currentMissionId] || {
            q: "ด่านนี้สอนเกี่ยวกับเรื่องใด?",
            options: ["แนวคิดวิทยาการคำนวณ", "การควบคุมเครื่องยนต์"],
            correct: 0
        };

        if (conceptOverlay && conceptQuestionText && conceptOptions) {
            conceptQuestionText.textContent = qData.q;
            conceptOptions.innerHTML = '';
            if (conceptFeedback) {
                conceptFeedback.style.display = 'none';
            }
            
            qData.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'stage-answer-btn';
                btn.style.width = '100%';
                btn.style.margin = '4px 0';
                btn.style.padding = '8px 12px';
                btn.style.fontSize = '12px';
                btn.style.background = 'rgba(255,255,255,0.06)';
                btn.style.color = 'white';
                btn.style.border = '1px solid var(--border-color)';
                btn.style.borderRadius = '8px';
                btn.style.cursor = 'pointer';
                btn.textContent = opt;
                
                btn.addEventListener('click', () => {
                    if (idx === qData.correct) {
                        // Answer is correct! Save and continue to normal success
                        if (window.playCodeSound) window.playCodeSound('success');
                        conceptOverlay.style.display = 'none';
                        executeSuccessFlow(successMessage);
                    } else {
                        // Answer is incorrect, show feedback
                        if (conceptFeedback) {
                            conceptFeedback.style.display = 'block';
                            conceptFeedback.style.color = '#ef4444';
                            conceptFeedback.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> คำตอบยังไม่ถูก ลองคิดใหม่อีกทีนะ!';
                        }
                        btn.style.background = 'rgba(239, 68, 68, 0.2)';
                        btn.style.borderColor = '#ef4444';
                    }
                });
                
                conceptOptions.appendChild(btn);
            });
            
            conceptOverlay.style.display = 'flex';
        } else {
            // Fallback if elements not found
            executeSuccessFlow(successMessage);
        }
    }

    function executeSuccessFlow(successMessage) {
        completedMissions[currentMissionId] = true;
        localStorage.setItem('scratch_completed_missions', JSON.stringify(completedMissions));
        
        // Sync progress with Cloud Database
        if (typeof window.syncProgressToCloud === 'function') {
            window.syncProgressToCloud();
        }
        
        // Update sidebar check icons
        const sidebarLink = document.querySelector(`.mission-item[data-mission="${currentMissionId}"]`);
        if (sidebarLink) {
            sidebarLink.classList.add('completed');
        }
        
        // Show Success Overlay
        successOverlay.style.display = 'flex';
        successText.textContent = successMessage;
        
        // Update badges
        missionStatus.className = "mission-status-badge completed";
        missionStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> ภารกิจสำเร็จแล้ว';
        
        // Update Progress Bar
        updateProgress();
        
        logToConsole(`🎉 [ยินดีด้วย]: ${successMessage} ผ่านด่านแล้ว!`, "success");
    }

    // Run active simulation
    function runSimulation() {
        if (isRunning) return;
        
        // Verify workspace blocks drop area has all required blocks
        const droppedBlocks = blockDropArea ? blockDropArea.querySelectorAll('.scratch-block-visual') : [];
        const requiredHints = missions[currentMissionId].hints;
        
        if (droppedBlocks.length === 0) {
            if (window.playCodeSound) window.playCodeSound('error');
            logToConsole("⚠️ [ข้อผิดพลาด]: กรุณาลากบล็อกคำใบ้จากทางซ้ายมาวางในพื้นที่ประกอบบล็อกก่อนรันสคริปต์!", "system");
            return;
        }
        
        let matchedCount = 0;
        requiredHints.forEach(hint => {
            const cleanText = hint.text ? hint.text.replace(/<[^>]*>/g, '').trim() : '';
            let found = false;
            droppedBlocks.forEach(block => {
                const blockText = block.textContent.trim();
                if (cleanText) {
                    if (blockText.includes(cleanText)) found = true;
                } else {
                    if (hint.category === 'control' && (blockText.includes('มิฉะนั้น') || blockText.includes('ถ้า') || block.classList.contains('scratch-control'))) {
                        found = true;
                    }
                }
            });
            if (found) matchedCount++;
        });

        if (matchedCount < requiredHints.length) {
            if (window.playCodeSound) window.playCodeSound('error');
            logToConsole("⚠️ [ข้อผิดพลาด]: บล็อกที่ประกอบยังไม่ครบถ้วนสำหรับภารกิจ! ลองศึกษาลากบล็อกคำใบ้มาวางให้ครบนะเหมียว", "system");
            return;
        }
        
        if (window.playCodeSound) window.playCodeSound('click');
        cleanupSimulation(); // Reset first
        isRunning = true;
        
        btnActionRun.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังรันสคริปต์...';
        btnActionRun.style.backgroundColor = 'var(--primary-orange)';
        
        logToConsole(`🟢 [ธงเขียว]: สั่งรันชุดบล็อกสคริปต์คำใบ้จำลองในด่านที่ ${currentMissionId}`, "system");
        
        const m = missions[currentMissionId];
        // Re-run setup() after cleanup so target/extra sprites are re-shown and
        // repositioned before the script runs (cleanupSimulation hides them).
        if (m && m.setup) {
            m.setup();
        }
        if (m && m.start) {
            m.start();
        }
    }

    // Update Progress bar statistics
    function updateProgress() {
        const total = Object.keys(missions).length; // 20
        const done = Object.keys(completedMissions).filter(id => completedMissions[id] === true).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        
        progressPercentText.textContent = `${done} / ${total} (${pct}%)`;
        progressBar.style.width = `${pct}%`;

        // Update items check icons in Sidebar
        missionItems.forEach(item => {
            const mId = item.getAttribute('data-mission');
            if (completedMissions[mId]) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });
    }

    // --- 4. Event Binding ---
    
    // Sidebar items switching
    missionItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const mId = item.getAttribute('data-mission');
            if (!mId) return;
            
            e.preventDefault();
            if (window.playCodeSound) window.playCodeSound('click');
            
            missionItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            loadMission(mId);
        });
    });

    // Run Buttons
    btnActionRun.addEventListener('click', runSimulation);
    btnFlag.addEventListener('click', runSimulation);

    // Stop Buttons
    btnActionStop.addEventListener('click', () => {
        if (window.playCodeSound) window.playCodeSound('click');
        cleanupSimulation();
        const m = missions[currentMissionId];
        if (m) m.setup();
        logToConsole(`🛑 [หยุด/รีเซ็ต]: เคลียร์คำสั่งและรีเซ็ตตำแหน่งตัวละครด่านที่ ${currentMissionId} กลับจุดเริ่มต้น`, "system");
    });
    
    btnStop.addEventListener('click', () => {
        if (window.playCodeSound) window.playCodeSound('click');
        cleanupSimulation();
        const m = missions[currentMissionId];
        if (m) m.setup();
        logToConsole(`🛑 [หยุด]: ยกเลิกสคริปต์ชั่วคราว`, "system");
    });

    // Next Mission Button in overlay
    btnNextMission.addEventListener('click', () => {
        if (window.playCodeSound) window.playCodeSound('click');
        successOverlay.style.display = 'none';
        const nextId = (parseInt(currentMissionId) + 1).toString();
        
        if (missions[nextId]) {
            const nextItem = document.querySelector(`.mission-item[data-mission="${nextId}"]`);
            if (nextItem) {
                nextItem.click();
                
                // Scroll sidebar menu to show active item if out of view
                const sidebarMenu = document.getElementById('mission-sidebar-menu');
                sidebarMenu.scrollTop = nextItem.offsetTop - 120;
            }
        } else {
            // Reached last mission
            alert("ยินดีด้วยครับน้องๆ! น้องๆ ทำภารกิจประยุกต์บล็อกคำสั่ง Scratch ครบถ้วนทั้ง 20 ด่านแล้ว สุดยอดมาก!");
            logToConsole("🏆 [ภารกิจสิ้นสุด]: ขอแสดงความยินดีกับนักเรียนทุกคนที่พิชิตคอร์สได้สำเร็จครบ 20 ด่าน!", "success");
        }
    });

    // --- 5. Bootstrapping ---
    updateProgress();
    
    // Check if URL hash maps to a specific mission (e.g. mission.html#mission5)
    let initialMission = "1";
    const hash = window.location.hash;
    if (hash && hash.startsWith('#mission')) {
        const hashNum = hash.replace('#mission', '');
        if (missions[hashNum]) {
            initialMission = hashNum;
            const targetItem = document.querySelector(`.mission-item[data-mission="${initialMission}"]`);
            if (targetItem) {
                missionItems.forEach(i => i.classList.remove('active'));
                targetItem.classList.add('active');
            }
        }
    }
    
    loadMission(initialMission);

    // --- 6. Drag & Drop Assembly Event Handlers Wires ---
    let draggedElement = null;

    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('scratch-block-visual')) {
            draggedElement = e.target;
            e.target.classList.add('dragging');
            if (e.dataTransfer) {
                e.dataTransfer.setData('text/plain', e.target.getAttribute('data-index') || '0');
            }
        }
    });

    document.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('scratch-block-visual')) {
            e.target.classList.remove('dragging');
        }
    });

    if (blockDropArea) {
        blockDropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            blockDropArea.classList.add('drag-over');
        });

        blockDropArea.addEventListener('dragleave', () => {
            blockDropArea.classList.remove('drag-over');
        });

        blockDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            blockDropArea.classList.remove('drag-over');
            
            if (draggedElement) {
                // Confirm block is originating from hints list
                const isFromHints = draggedElement.closest('#mission-hints-list') !== null;
                if (isFromHints) {
                    const dragIdx = draggedElement.getAttribute('data-index');
                    // Avoid duplicate index drops
                    const existing = blockDropArea.querySelector(`[data-index="${dragIdx}"]`);
                    if (existing) {
                        if (window.playCodeSound) window.playCodeSound('error');
                        logToConsole("ระบบ: บล็อกคำใบ้ชิ้นนี้ถูกนำมาวางประกอบอยู่แล้ว!", "system");
                        return;
                    }
                    
                    const clone = draggedElement.cloneNode(true);
                    clone.setAttribute('draggable', 'false');
                    clone.style.cursor = 'pointer';
                    clone.title = 'คลิกเพื่อลบบล็อกนี้';
                    
                    clone.addEventListener('click', () => {
                        if (window.playCodeSound) window.playCodeSound('click');
                        clone.remove();
                        if (blockDropArea.querySelectorAll('.scratch-block-visual').length === 0) {
                            if (dropPlaceholder) dropPlaceholder.style.display = 'block';
                        }
                    });
                    
                    if (dropPlaceholder) dropPlaceholder.style.display = 'none';
                    blockDropArea.appendChild(clone);
                    if (window.playCodeSound) window.playCodeSound('click');
                }
            }
        });
    }

    if (btnClearWorkspace) {
        btnClearWorkspace.addEventListener('click', () => {
            if (window.playCodeSound) window.playCodeSound('click');
            if (blockDropArea) {
                const blocks = blockDropArea.querySelectorAll('.scratch-block-visual');
                blocks.forEach(b => b.remove());
                if (dropPlaceholder) dropPlaceholder.style.display = 'block';
            }
        });
    }

    // --- Sync Student Header Profile ---
    const headerStudentNameInput = document.getElementById('header-student-name');
    if (headerStudentNameInput) {
        const savedName = localStorage.getItem('scratch_student_name') || '';
        if (savedName) headerStudentNameInput.value = savedName;

        headerStudentNameInput.addEventListener('input', () => {
            const val = headerStudentNameInput.value.trim();
            if (val) localStorage.setItem('scratch_student_name', val);
        });
    }

});
