/* -------------------------------------------------------------
   Scratch Academy - Motion Lessons & Projects Logic (motion.js)
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

    // --- 1. Tab / Section Navigation ---
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item[data-sec]');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const pageSectionTitle = document.getElementById('page-section-title');

    const sectionTitles = {
        motion: "เรียนรู้กลุ่มบล็อกคำสั่งเคลื่อนไหว (Motions)",
        looks: "เรียนรู้กลุ่มบล็อกคำสั่งรูปลักษณ์ (Looks)",
        sound: "เรียนรู้กลุ่มบล็อกคำสั่งเสียง (Sound)",
        events: "เรียนรู้กลุ่มบล็อกคำสั่งเหตุการณ์ (Events)",
        control: "เรียนรู้กลุ่มบล็อกคำสั่งควบคุม (Control)",
        sensing: "เรียนรู้กลุ่มบล็อกคำสั่งตรวจจับ (Sensing)",
        operators: "เรียนรู้กลุ่มบล็อกคำสั่งตัวดำเนินการ (Operators)",
        variables: "เรียนรู้กลุ่มบล็อกคำสั่งตัวแปร (Variables)",
        projects: "5 โปรเจกต์ตัวอย่างสำหรับหัดเขียนโค้ด Scratch"
    };

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const secId = item.getAttribute('data-sec');
            if (!secId) return; // Let default anchor click happen for external links (e.g. index.html)

            e.preventDefault();

            menuItems.forEach(m => m.classList.remove('active'));
            item.classList.add('active');

            tabPanels.forEach(panel => panel.classList.remove('active'));
            const targetSec = document.getElementById(`${secId}-sec`);
            if (targetSec) targetSec.classList.add('active');

            pageSectionTitle.textContent = sectionTitles[secId] || "Scratch Academy";

            // If switching to projects, stop any active simulations
            stopProjectSimulation();
        });
    });


    // --- 2. Interactive Motion/Looks/Sound/Events/Control/Sensing/Operators/Variables Blocks Cards ---
    const blockCards = document.querySelectorAll('.block-card-interactive');
    
    blockCards.forEach(card => {
        card.addEventListener('click', () => {
            const blockType = card.getAttribute('data-block');
            
            // Give card a brief pulse effect
            card.style.transform = 'scale(1.02)';
            card.style.borderColor = 'var(--primary-orange)';
            setTimeout(() => {
                card.style.transform = 'none';
                card.style.borderColor = 'var(--border-color)';
            }, 300);

            // Navigate to projects screen and select corresponding project
            const projectsMenuBtn = document.querySelector('[data-sec="projects"]');
            if (projectsMenuBtn) {
                projectsMenuBtn.click();
                
                // Map block card to corresponding project ID
                const blockToProjMapping = {
                    // Motion
                    'move': '1',
                    'turn-right': '2',
                    'turn-left': '2',
                    'goto-xy': '5',
                    'glide': '5',
                    'bounce': '1',
                    // Looks
                    'say-for': '4',
                    'switch-costume': '2',
                    'next-costume': '2',
                    'change-size': '2',
                    'change-effect': '2',
                    'show-hide': '5',
                    // Sound
                    'play-sound': '2',
                    'start-sound': '2',
                    'stop-sound': '2',
                    'change-pitch': '2',
                    'change-volume': '2',
                    'set-volume': '2',
                    // Events
                    'when-green-flag': '1',
                    'when-key-pressed': '3',
                    'when-sprite-clicked': '4',
                    'when-i-receive': '4',
                    'broadcast': '4',
                    'broadcast-and-wait': '4',
                    // Control
                    'wait': '2',
                    'forever': '1',
                    'repeat': '2',
                    'if-then': '4',
                    'if-then-else': '4',
                    'stop': '1',
                    // Sensing
                    'touching': '4',
                    'distance': '3',
                    'ask': '4',
                    'answer': '4',
                    'key-pressed': '3',
                    'mouse-xy': '3',
                    // Operators
                    'add': '5',
                    'random': '5',
                    'greater-than': '5',
                    'and': '5',
                    'join': '4',
                    'mod': '5',
                    // Variables
                    'reporter': '5',
                    'set-var': '5',
                    'change-var': '5',
                    'show-var': '5',
                    'hide-var': '5'
                };
                
                const projId = blockToProjMapping[blockType] || '1';
                const projBtn = document.querySelector(`.project-btn[data-proj="${projId}"]`);
                if (projBtn) projBtn.click();
            }
        });
    });


    // --- 3. 5 Mini Projects Engine ---
    const projectsData = {
        "1": {
            title: "โปรเจกต์ที่ 1: เจ้าเหมียวเดินขยับขารอบเวที",
            objective: "สั่งให้ตัวละครเดินหน้าไปชนขอบขวา แล้วสะท้อนกลับหมุนกลับหัวเดินกลับมาทางซ้าย วนเวียนต่อเนื่องตลอดไป",
            flowchart: [
                "เริ่มต้น",
                "วนซ้ำตลอดไป (Forever)",
                "เดินหน้า 10 ก้าว (move 10 steps)",
                "ถ้าแตะขอบเวที ให้สะท้อนกลับ (if on edge, bounce)",
                "จบ/วนซ้ำ"
            ],
            blocks: [
                "when green flag clicked 🟢",
                "forever [",
                "   move (10) steps 🔵",
                "   if on edge, bounce 🔵",
                "]"
            ],
            steps: [
                "1. วางบล็อกเหตุการณ์ 'when green flag clicked' เพื่อเป็นจุดเริ่มทำงาน",
                "2. นำบล็อกวนซ้ำตลอดไป 'forever' มาต่อด้านล่าง",
                "3. นำบล็อกการเคลื่อนไหว 'move 10 steps' ใส่เข้าไปภายในปากบล็อกควบคุมวนซ้ำ",
                "4. นำบล็อกตรวจสอบ 'if on edge, bounce' วางต่อด้านล่างภายในลูป เพื่อป้องกันแมวเดินทะลุหลุดหายไปนอกจอ"
            ]
        },
        "2": {
            title: "โปรเจกต์ที่ 2: ตัวละครเต้นรำหรรษาขยับชุดแต่ง",
            objective: "สั่งให้ตัวละครก้าวเดินสลับเท้า (เปลี่ยนรูป Costume) ควบคู่กับการเล่นเสียงร้องเสียง Meow และพักรอจังหวะ",
            flowchart: [
                "เริ่มต้น",
                "วนซ้ำตลอดไป (Forever)",
                "เดินหน้า 15 ก้าว (move 15 steps)",
                "สลับชุดถัดไป (next costume)",
                "เล่นเสียง Meow จนจบ (play sound Meow)",
                "รอเวลา 0.2 วินาที (wait 0.2 secs)",
                "จบ/วนซ้ำ"
            ],
            blocks: [
                "when green flag clicked 🟢",
                "forever [",
                "   move (15) steps 🔵",
                "   next costume 🟣",
                "   play sound (Meow) until done 💗",
                "   wait (0.2) seconds 🟠",
                "]"
            ],
            steps: [
                "1. เริ่มต้นด้วยบล็อกเปิดสคริปต์ 'when green flag clicked'",
                "2. วางลูปควบคุม 'forever' สำหรับสั่งเต้นรำวนซ้ำเรื่อยๆ",
                "3. ใส่คำสั่ง 'move 15 steps' เพื่อสั่งตัวละครเคลื่อนตัวชิฟขยับตามทิศทาง",
                "4. สลับรูปตัวละครด้วยคำสั่ง 'next costume' ในหมวด Looks สีม่วง เพื่อแอนิเมทท่าเต้นรำ",
                "5. นำบล็อก 'play sound Meow until done' ในหมวด Sound สีชมพูมาใส่",
                "6. ดักรอจังหวะเล็กน้อย 'wait 0.2 seconds' ในหมวด Control สีส้ม เพื่อป้องกันสไปรท์ขยับเร็วเกินไป"
            ]
        },
        "3": {
            title: "โปรเจกต์ที่ 3: วิ่งไล่จับหันหน้าตามพิกัดเมาส์",
            objective: "ตัวละครตรวจเช็คพิกัดของเมาส์ แล้วหมุนหันหน้าวิ่งตามทิศทางการเลื่อนเมาส์ชี้เป้าของผู้ใช้ตลอดเวลา",
            flowchart: [
                "เริ่มต้น",
                "วนซ้ำตลอดไป (Forever)",
                "หันหน้าไปหาตัวชี้เมาส์ (point towards mouse-pointer)",
                "เดินหน้า 5 ก้าว (move 5 steps)",
                "จบ/วนซ้ำ"
            ],
            blocks: [
                "when green flag clicked 🟢",
                "forever [",
                "   point towards (mouse-pointer) 🔵",
                "   move (5) steps 🔵",
                "]"
            ],
            steps: [
                "1. ลากบล็อกปุ่มสตาร์ท 'when green flag clicked' มาวาง",
                "2. ใส่บล็อกครอบลูปกว้าง 'forever' เพื่อสั่งให้เช็คตำแหน่งพิกัดแบบตลอดเวลาเรียลไทม์",
                "3. เลือกบล็อกเคลื่อนที่ 'point towards' แล้วปรับตัวเลือกรวมในดรอปดาวน์เป็น 'mouse-pointer' เพื่อสั่งหมุนตัวละครหันหน้า",
                "4. ใส่บล็อกควบคุมก้าววิ่ง 'move 5 steps' ไว้ในลูป เพื่อให้มันขยับก้าวเดินตามเมาส์ตลอดเวลา"
            ]
        },
        "4": {
            title: "โปรเจกต์ที่ 4: เหมียวส้มทักทายเมื่อเมาส์สัมผัส",
            objective: "ตัวละครเดินลาดตระเวนไปข้างหน้าเรื่อยๆ แต่ถ้าผู้ใช้งานเอาลูกศรเมาส์ไปชี้แตะโดนตัวละคร มันจะหยุดเดินและพูดสวัสดีทันที",
            flowchart: [
                "เริ่มต้น",
                "วนซ้ำตลอดไป (Forever)",
                "ตรวจสอบเงื่อนไข แตะเมาส์พอยเตอร์? (touching mouse-pointer)",
                "ถ้าแตะ (จริง) -> หยุดเดิน และพูด 'สวัสดีจ้า!'",
                "ถ้าไม่แตะ (เท็จ) -> เดินหน้าปกติ 3 ก้าว",
                "จบ/วนซ้ำ"
            ],
            blocks: [
                "when green flag clicked 🟢",
                "forever [",
                "   if <touching (mouse-pointer)?> then [ 🟠",
                "       say (สวัสดีจ้า!) for (2) seconds 🟣",
                "   ] else [",
                "       move (3) steps 🔵",
                "   ]",
                "]"
            ],
            steps: [
                "1. เริ่มต้นด้วยบล็อก 'when green flag clicked'",
                "2. วางบล็อกครอบคุมลูปวน 'forever'",
                "3. วางกล่องทางเลือกคู่ตรวจเงื่อนไข 'if-then-else' ดึงมาจากหมวด Control สีส้ม",
                "4. นำบล็อกตรวจสอบ 'touching mouse-pointer?' ในหมวด Sensing สีฟ้ามาสอดในช่องหกเหลี่ยมเงื่อนไข",
                "5. ช่องแรกของ If (จริง): วางบล็อก 'say สวัสดีจ้า! for 2 seconds' เพื่อพูดเสียง",
                "6. ช่อง Else (เท็จ): วางบล็อก 'move 3 steps' เพื่อสั่งเดินต่อยามไม่โดนเมาส์รบกวน"
            ]
        },
        "5": {
            title: "โปรเจกต์ที่ 5: ดาวตกมหัศจรรย์คณิตศาสตร์สุ่มพิกัด",
            objective: "สุ่มพิกัดแกนนอน X และวาร์ปดาวตกขึ้นไปขอบฟ้าชั้นบน Y=180 จากนั้นสั่งลดความสูงลงดิน เมื่อดินแตะพิกัดพื้นล่าง X จะสุ่มตกมาใหม่",
            flowchart: [
                "เริ่มต้น",
                "วนซ้ำตลอดไป (Forever)",
                "สุ่มพิกัด x แนวนอน, ตั้งค่า y = 120 ด้านบน",
                "วนซ้ำจนกระทั่งตัวละครดาวตกสูง ต่ำกว่าพื้นดิน y < -110",
                "ลดความสูงตัวละครเปลี่ยนค่า y ลงทีละ 8 (change y by -8)",
                "จบ/วนซ้ำ"
            ],
            blocks: [
                "when green flag clicked 🟢",
                "forever [",
                "   go to x: (pick random -120 to 120) y: (120) 🔵",
                "   repeat until < (y position) < (-110) > [ 🟠",
                "       change y by (-8) 🔵",
                "   ]",
                "]"
            ],
            steps: [
                "1. ลากบล็อกเปิดระบบเหตุการณ์ 'when green flag clicked' วางบนเวิร์กสเปซ",
                "2. นำบล็อกลูป 'forever' ครอบโครงสร้างคำสั่งประมวลผลทั้งหมด",
                "3. วางคำสั่งย้ายพิกัด 'go to x y' โดยที่พิกัด X ให้ดึงบล็อกตัวดำเนินการสุ่ม 'pick random -120 to 120' มาใส่ และเซ็ตค่าความสูง Y = 120 เสมอเพื่อดันขึ้นยอดสุด",
                "4. ดึงคำสั่งลูปในเงื่อนไข 'repeat until' มาประกบภายในปากลูป forever",
                "5. ใส่ตัวเปรียบเทียบในเงื่อนไขลูปย่อยเป็น 'y position < -110' (ความสูงพิกัด Y น้อยกว่าพื้นดินขอบล่าง)",
                "6. ภายใน repeat until ให้ลากคำสั่งหล่นลงล่าง 'change y by -8' เพื่อลดพิกัดดาวตกทีละขั้น"
            ]
        }
    };

    const projectBtns = document.querySelectorAll('.project-btn');
    const projectDetailsBox = document.getElementById('project-details-box');
    
    // Stage elements
    const projCatSprite = document.getElementById('proj-cat-sprite');
    const projBallSprite = document.getElementById('proj-ball-sprite');
    const projStarSprite = document.getElementById('proj-star-sprite');
    const projStageBubble = document.getElementById('proj-stage-bubble');
    const projStageScreen = document.getElementById('project-stage-screen');
    const projConsole = document.getElementById('proj-console-text');
    const btnPlayProj = document.getElementById('btn-play-proj');
    const btnStopProj = document.getElementById('btn-stop-proj');

    let currentProject = "1";
    let isProjSimRunning = false;
    let projIntervalId = null;
    let projTimeoutId = null;
    let mousePos = { x: 0, y: 0 };

    function getRealisticBlocksHTML(projId) {
        switch (projId) {
            case "1":
                return `
                    <div class="scratch-block-visual hat scratch-events">เมื่อคลิกธงเขียว 🟢</div>
                    <div class="scratch-c-wrapper">
                        <div class="scratch-block-visual stack scratch-control scratch-c-top">วนซ้ำตลอดไป</div>
                        <div class="scratch-c-body">
                            <div class="scratch-block-visual stack scratch-motion">เดินหน้า <span class="scratch-input-pill">10</span> ก้าว</div>
                            <div class="scratch-block-visual stack scratch-motion">ถ้าแตะขอบ, ให้สะท้อนกลับ</div>
                        </div>
                        <div class="scratch-block-visual stack scratch-control scratch-c-bottom"></div>
                    </div>
                `;
            case "2":
                return `
                    <div class="scratch-block-visual hat scratch-events">เมื่อคลิกธงเขียว 🟢</div>
                    <div class="scratch-c-wrapper">
                        <div class="scratch-block-visual stack scratch-control scratch-c-top">วนซ้ำตลอดไป</div>
                        <div class="scratch-c-body">
                            <div class="scratch-block-visual stack scratch-motion">เดินหน้า <span class="scratch-input-pill">15</span> ก้าว</div>
                            <div class="scratch-block-visual stack scratch-looks">ชุดถัดไป</div>
                            <div class="scratch-block-visual stack scratch-sound">เล่นเสียง <span class="scratch-input-dropdown">Meow</span> จนจบ</div>
                            <div class="scratch-block-visual stack scratch-control">รอ <span class="scratch-input-pill">0.2</span> วินาที</div>
                        </div>
                        <div class="scratch-block-visual stack scratch-control scratch-c-bottom"></div>
                    </div>
                `;
            case "3":
                return `
                    <div class="scratch-block-visual hat scratch-events">เมื่อคลิกธงเขียว 🟢</div>
                    <div class="scratch-c-wrapper">
                        <div class="scratch-block-visual stack scratch-control scratch-c-top">วนซ้ำตลอดไป</div>
                        <div class="scratch-c-body">
                            <div class="scratch-block-visual stack scratch-motion">หันไปทาง <span class="scratch-input-dropdown">mouse-pointer</span></div>
                            <div class="scratch-block-visual stack scratch-motion">เดินหน้า <span class="scratch-input-pill">5</span> ก้าว</div>
                        </div>
                        <div class="scratch-block-visual stack scratch-control scratch-c-bottom"></div>
                    </div>
                `;
            case "4":
                return `
                    <div class="scratch-block-visual hat scratch-events">เมื่อคลิกธงเขียว 🟢</div>
                    <div class="scratch-c-wrapper">
                        <div class="scratch-block-visual stack scratch-control scratch-c-top">วนซ้ำตลอดไป</div>
                        <div class="scratch-c-body">
                            <div class="scratch-c-wrapper">
                                <div class="scratch-block-visual stack scratch-control scratch-c-top">ถ้า <span class="scratch-input-dropdown" style="background:#4CBFE6; border-radius:4px; padding:1px 6px;">แตะ mouse-pointer ?</span> แล้ว</div>
                                <div class="scratch-c-body">
                                    <div class="scratch-block-visual stack scratch-looks">พูด <span class="scratch-input-pill" style="min-width:60px; text-align:left;">สวัสดีจ้า!</span> เป็นเวลา <span class="scratch-input-pill">2</span> วินาที</div>
                                </div>
                                <div class="scratch-block-visual stack scratch-control scratch-c-bottom" style="border-radius:0;">มิฉะนั้น</div>
                                <div class="scratch-c-body">
                                    <div class="scratch-block-visual stack scratch-motion">เดินหน้า <span class="scratch-input-pill">3</span> ก้าว</div>
                                </div>
                                <div class="scratch-block-visual stack scratch-control scratch-c-bottom"></div>
                            </div>
                        </div>
                        <div class="scratch-block-visual stack scratch-control scratch-c-bottom"></div>
                    </div>
                `;
            case "5":
                return `
                    <div class="scratch-block-visual hat scratch-events">เมื่อคลิกธงเขียว 🟢</div>
                    <div class="scratch-c-wrapper">
                        <div class="scratch-block-visual stack scratch-control scratch-c-top">วนซ้ำตลอดไป</div>
                        <div class="scratch-c-body">
                            <div class="scratch-block-visual stack scratch-motion">ไปที่ x: <span class="scratch-input-dropdown" style="background:#40BF50;">สุ่ม -120 ถึง 120</span> y: <span class="scratch-input-pill">120</span></div>
                            <div class="scratch-c-wrapper">
                                <div class="scratch-block-visual stack scratch-control scratch-c-top">วนซ้ำจนกระทั่ง <span class="scratch-input-dropdown" style="background:#40BF50;">ตำแหน่ง Y &lt; -110</span></div>
                                <div class="scratch-c-body">
                                    <div class="scratch-block-visual stack scratch-motion">เปลี่ยน y ทีละ <span class="scratch-input-pill">-8</span></div>
                                </div>
                                <div class="scratch-block-visual stack scratch-control scratch-c-bottom"></div>
                            </div>
                        </div>
                        <div class="scratch-block-visual stack scratch-control scratch-c-bottom"></div>
                    </div>
                `;
            default:
                return "";
        }
    }

    function renderProjectInfo(projId) {
        const proj = projectsData[projId];
        if (!proj) return;

        // Render project details panel HTML
        let flowchartHtml = proj.flowchart.map(f => `<div class="flowchart-step-text" style="font-size:11px; margin-bottom:4px; color:var(--text-muted);"><i class="fa-solid fa-arrow-down-long" style="margin-right:8px; font-size:10px; color:var(--primary-orange);"></i> ${f}</div>`).join('');
        let blocksHtml = getRealisticBlocksHTML(projId);
        let stepsHtml = proj.steps.map(s => `<li style="margin-bottom:6px;">${s}</li>`).join('');

        projectDetailsBox.innerHTML = `
            <div class="project-info-card animation-fadeIn">
                <h3>${proj.title}</h3>
                <p style="font-size:13px; color:#cbd5e1; margin-bottom:15px;"><strong>วัตถุประสงค์:</strong> ${proj.objective}</p>
                
                <div class="project-details-card" style="margin-bottom:12px;">
                    <h5><i class="fa-solid fa-list-ol"></i> วิธีการต่อบล็อกทีละสเต็ป:</h5>
                    <ol style="padding-left: 20px;">
                        ${stepsHtml}
                    </ol>
                </div>
                
                <div style="display:flex; gap:16px;">
                    <div class="project-details-card" style="flex:1.2;">
                        <h5><i class="fa-solid fa-code"></i> โค้ดคำสั่งในเวิร์กสเปซ:</h5>
                        <div class="blocks-needed-list" style="background-color:#0c111d; padding:15px; border-radius:10px; display:flex; flex-direction:column; gap:2px; border:1px solid var(--border-color);">
                            ${blocksHtml}
                        </div>
                    </div>
                    <div class="project-details-card" style="flex:0.8;">
                        <h5><i class="fa-solid fa-diagram-project"></i> ลำดับความคิด (Flowchart):</h5>
                        <div style="margin-top:8px;">
                            ${flowchartHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function runProject1Simulation() {
        let x = 0;
        let speed = 6;
        let direction = 1; // 1 = right, -1 = left

        // Show/hide correct sprites
        projCatSprite.style.display = 'block';
        projBallSprite.style.display = 'none';
        projStarSprite.style.display = 'none';
        projStageBubble.style.display = 'none';

        projIntervalId = setInterval(() => {
            x += speed * direction;
            
            // Boundary detection (bounds width 260 width -> half is 130 -> minus sprite size ~30 = offset 100)
            if (x > 100) {
                direction = -1;
                x = 100;
                projCatSprite.style.transform = 'scaleX(-1)'; // Flip left
                logToConsole("แมวชนขอบขวาแล้ว! สะท้อนเด้งกลับหัว");
            } else if (x < -100) {
                direction = 1;
                x = -100;
                projCatSprite.style.transform = 'scaleX(1)'; // Flip right
                logToConsole("แมวชนขอบซ้ายแล้ว! สะท้อนเด้งกลับตัว");
            }

            projCatSprite.style.left = `calc(50% + ${x}px)`;
            projCatSprite.style.top = 'calc(50% + 20px)'; // Grounded y
        }, 50);
    }

    function runProject2Simulation() {
        let costumeIdx = 1;
        let x = -80;
        let speed = 10;
        let direction = 1;

        projCatSprite.style.display = 'block';
        projBallSprite.style.display = 'none';
        projStarSprite.style.display = 'none';

        logToConsole("เริ่มจังหวะการเต้นระบำแมวส้ม...");

        projIntervalId = setInterval(() => {
            // Move back and forth
            x += speed * direction;
            if (x > 80) direction = -1;
            if (x < -80) direction = 1;

            projCatSprite.style.left = `calc(50% + ${x}px)`;
            projCatSprite.style.top = 'calc(50% + 20px)';

            // Swap costume (simulated by scaling up/down and emoji text swapping)
            costumeIdx = costumeIdx === 1 ? 2 : 1;
            projCatSprite.innerHTML = costumeIdx === 1 ? "🐱" : "🐈";
            projCatSprite.style.transform = costumeIdx === 1 ? 'scale(1.15)' : 'scale(0.95)';

            // Say "Meow!"
            projStageBubble.textContent = "Meow! 🎶";
            projStageBubble.style.display = 'block';
            projStageBubble.style.left = `calc(50% + ${x}px)`;
            projStageBubble.style.top = 'calc(50% - 20px)';
            
            logToConsole(`เปลี่ยนท่าเต้นเป็น Costume ${costumeIdx} - เล่นเสียงเต้น [Meow!]`);
        }, 400); // Wait 0.4s
    }

    function runProject3Simulation() {
        projCatSprite.style.display = 'block';
        projBallSprite.style.display = 'block'; // Ball acts as target cursor
        projStarSprite.style.display = 'none';
        projStageBubble.style.display = 'none';

        let catX = -80;
        let catY = 20;

        // Initialize ball at center
        projBallSprite.style.left = '50%';
        projBallSprite.style.top = '50%';

        logToConsole("ลากเมาส์เข้ามาในกรอบเวที เพื่อล่อลวงให้เจ้าแมวเดินตาม!");

        const onMouseMove = (e) => {
            const rect = projStageScreen.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - (rect.width / 2);
            const mouseY = e.clientY - rect.top - (rect.height / 2);

            // Move the pink ball to cursor location
            projBallSprite.style.left = `calc(50% + ${mouseX}px)`;
            projBallSprite.style.top = `calc(50% + ${mouseY}px)`;

            mousePos.x = mouseX;
            mousePos.y = mouseY;
        };

        projStageScreen.addEventListener('mousemove', onMouseMove);

        // Cat chasing loop
        projIntervalId = setInterval(() => {
            const dx = mousePos.x - catX;
            const dy = mousePos.y - catY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                // Point towards target
                if (dx > 0) {
                    projCatSprite.style.transform = 'scaleX(1)';
                } else {
                    projCatSprite.style.transform = 'scaleX(-1)';
                }

                // Move 5 steps towards cursor
                catX += (dx / distance) * 4;
                catY += (dy / distance) * 4;

                projCatSprite.style.left = `calc(50% + ${catX}px)`;
                projCatSprite.style.top = `calc(50% + ${catY}px)`;
            }
        }, 50);

        // Store reference to clean event listener
        projStageScreen._onMouseMove = onMouseMove;
    }

    function runProject4Simulation() {
        projCatSprite.style.display = 'block';
        projBallSprite.style.display = 'none';
        projStarSprite.style.display = 'none';
        projStageBubble.style.display = 'none';

        let catX = -100;
        let isTouching = false;

        logToConsole("เจ้าแมวกำลังเดิน... นำพิกัดเมาส์ไปชี้วางทับตัวแมวเพื่อทักทาย!");

        const onMouseMove = (e) => {
            const rect = projStageScreen.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - (rect.width / 2);
            const mouseY = e.clientY - rect.top - (rect.height / 2);

            // Simple intersection check
            const dx = mouseX - catX;
            const dy = mouseY - 20; // grounded Y is 20
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 32) {
                if (!isTouching) {
                    isTouching = true;
                    logToConsole("ตรวจพบเมาส์แตะสไปรท์แมวส้ม! -> สั่งพูดทักทายและหยุดเดิน");
                    projStageBubble.textContent = "สวัสดีจ้า! 🐱";
                    projStageBubble.style.display = 'block';
                    projStageBubble.style.left = `calc(50% + ${catX}px)`;
                    projStageBubble.style.top = 'calc(50% - 20px)';
                }
            } else {
                if (isTouching) {
                    isTouching = false;
                    projStageBubble.style.display = 'none';
                    logToConsole("เมาส์ถอยห่างแล้ว -> เริ่มเดินลาดตระเวนต่อ");
                }
            }
        };

        projStageScreen.addEventListener('mousemove', onMouseMove);

        projIntervalId = setInterval(() => {
            if (!isTouching) {
                catX += 3;
                if (catX > 110) {
                    catX = -110; // loop back
                }
                projCatSprite.style.left = `calc(50% + ${catX}px)`;
                projCatSprite.style.top = 'calc(50% + 20px)';
            }
        }, 50);

        projStageScreen._onMouseMove = onMouseMove;
    }

    function runProject5Simulation() {
        projCatSprite.style.display = 'none'; // hide cat
        projBallSprite.style.display = 'none';
        projStarSprite.style.display = 'block'; // show star
        projStageBubble.style.display = 'none';

        let starX = 0;
        let starY = -100; // top is y coord 100 inside half container

        function resetStar() {
            // pick random horizontal x between -100 and 100
            starX = Math.floor(Math.random() * 200) - 100;
            starY = -100; // top of stage y pos
            projStarSprite.style.left = `calc(50% + ${starX}px)`;
            projStarSprite.style.top = `calc(50% + ${starY}px)`;
            logToConsole(`สุ่มพิกัดดาวตกด้านบน: x=${starX}, y=120`);
        }

        resetStar();

        projIntervalId = setInterval(() => {
            // change y by -8 (which drops it down)
            starY += 8; 
            projStarSprite.style.top = `calc(50% + ${starY}px)`;

            // check if y < -110 (which is bottom floor limit)
            if (starY > 100) {
                logToConsole("ดาวตกถึงขอบล่างพื้นดินแล้ว -> วนลูปกลับไปป้อนค่าเริ่มต้นใหม่");
                resetStar();
            }
        }, 50);
    }

    function logToConsole(text) {
        const time = new Date().toLocaleTimeString('th-TH');
        projConsole.innerHTML += `<div style="margin-bottom:2px;">[${time}] ${text}</div>`;
        projConsole.scrollTop = projConsole.scrollHeight;
    }

    function startProjectSimulation() {
        if (isProjSimRunning) return;
        
        isProjSimRunning = true;
        btnPlayProj.disabled = true;
        btnStopProj.disabled = false;

        logToConsole("🟢 รันโปรเจกต์เสมือนจริงเริ่มต้นทำงาน...");

        // Run simulation based on selected project ID
        switch (currentProject) {
            case "1":
                runProject1Simulation();
                break;
            case "2":
                runProject2Simulation();
                break;
            case "3":
                runProject3Simulation();
                break;
            case "4":
                runProject4Simulation();
                break;
            case "5":
                runProject5Simulation();
                break;
        }
    }

    function stopProjectSimulation() {
        isProjSimRunning = false;
        btnPlayProj.disabled = false;
        btnStopProj.disabled = true;

        if (projIntervalId) clearInterval(projIntervalId);
        if (projTimeoutId) clearTimeout(projTimeoutId);
        
        // Remove mouse listeners if any
        if (projStageScreen._onMouseMove) {
            projStageScreen.removeEventListener('mousemove', projStageScreen._onMouseMove);
            projStageScreen._onMouseMove = null;
        }

        // Reset elements positions
        projCatSprite.style.left = '50%';
        projCatSprite.style.top = 'calc(50% + 20px)';
        projCatSprite.style.transform = 'scaleX(1)';
        projCatSprite.innerHTML = '🐱';
        projCatSprite.style.display = 'block';
        projBallSprite.style.display = 'none';
        projStarSprite.style.display = 'none';
        projStageBubble.style.display = 'none';

        logToConsole("🛑 โปรเจกต์ปิดระบบหยุดทำงานเรียบร้อย");
    }

    // Bind project selector buttons
    projectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            stopProjectSimulation();

            projectBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentProject = btn.getAttribute('data-proj');
            renderProjectInfo(currentProject);

            projConsole.innerHTML = "กดรันโปรเจกต์เพื่อเริ่มดูแอนิเมชันคำสั่ง...";
        });
    });

    if (btnPlayProj && btnStopProj) {
        btnPlayProj.addEventListener('click', startProjectSimulation);
        btnStopProj.addEventListener('click', stopProjectSimulation);
    }

    // Initialize first project render
    renderProjectInfo("1");

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
