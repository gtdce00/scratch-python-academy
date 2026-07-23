/* -------------------------------------------------------------
   Scratch Academy - Main Application Logic (app.js)
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // ── LOGIN MODAL ──────────────────────────────────────────────────────────
    const loginModal     = document.getElementById('login-modal');
    const btnLogin       = document.getElementById('btn-login-confirm');
    const loginError     = document.getElementById('login-error');
    const loginFirstname = document.getElementById('login-firstname');
    const loginLastname  = document.getElementById('login-lastname');
    const loginClasscode = document.getElementById('login-classcode');

    function updateHeaderDisplay(firstname, lastname, classCode) {
        const displayEl = document.getElementById('header-student-display');
        const badgeEl   = document.getElementById('header-class-badge');
        if (displayEl) displayEl.textContent = `${firstname} ${lastname}`.trim() || 'ผู้เรียนนิรนาม';
        if (badgeEl && classCode) {
            const label = (typeof getClassName === 'function') ? getClassName(classCode) : classCode;
            badgeEl.textContent  = label || classCode;
            badgeEl.style.display = 'inline-block';
        }
    }

    // Pre-fill saved data on modal open
    if (loginFirstname) loginFirstname.value = localStorage.getItem('scratch_student_firstname') || '';
    if (loginLastname)  loginLastname.value  = localStorage.getItem('scratch_student_lastname')  || '';
    if (loginClasscode) loginClasscode.value = localStorage.getItem('scratch_class_code')        || '';

    // Restore header display if already logged in
    const savedFN = localStorage.getItem('scratch_student_firstname') || '';
    const savedLN = localStorage.getItem('scratch_student_lastname')  || '';
    const savedCC = localStorage.getItem('scratch_class_code')        || '';
    if (savedFN) updateHeaderDisplay(savedFN, savedLN, savedCC);

    function doLogin() {
        const fn   = (loginFirstname ? loginFirstname.value.trim() : '');
        const ln   = (loginLastname  ? loginLastname.value.trim()  : '');
        const code = (loginClasscode ? loginClasscode.value.trim() : '');

        if (!fn) { loginError.textContent = '⚠️ กรุณากรอกชื่อจริง'; loginError.style.display='block'; loginFirstname.focus(); return; }
        if (!ln) { loginError.textContent = '⚠️ กรุณากรอกนามสกุล';  loginError.style.display='block'; loginLastname.focus();  return; }
        if (!code) { loginError.textContent = '⚠️ กรุณากรอกรหัสห้องเรียน'; loginError.style.display='block'; loginClasscode.focus(); return; }

        // Validate class code before saving/logging in
        if (typeof isValidClassCode === 'function' && !isValidClassCode(code)) {
            loginError.textContent = '❌ รหัสห้องเรียนไม่ถูกต้อง (กรุณาตรวจสอบรหัสจากครูผู้สอน)';
            loginError.style.display = 'block';
            loginClasscode.focus();
            return;
        }

        loginError.style.display = 'none';
        if (btnLogin) { btnLogin.disabled = true; btnLogin.textContent = 'กำลังเข้าสู่ระบบ...'; }

        // Save session details to localStorage as fallback
        const fullName = `${fn} ${ln}`;
        const sKey = fn.toLowerCase().replace(/\s+/g, '_') + '_' + ln.toLowerCase().replace(/\s+/g, '_');
        localStorage.setItem('scratch_student_firstname', fn);
        localStorage.setItem('scratch_student_lastname', ln);
        localStorage.setItem('scratch_student_name', fullName);
        localStorage.setItem('scratch_class_code', code.toUpperCase());
        localStorage.setItem('scratch_student_key', sKey);

        // db-sync's studentLogin is async; class-code validity was already checked above
        if (typeof window.studentLogin === 'function') {
            window.studentLogin(fn, ln, code);
        }

        updateHeaderDisplay(fn, ln, code);
        if (loginModal) { loginModal.style.display = 'none'; }
        // Trigger badge check
        setTimeout(() => {
            if (typeof window.checkAndAwardBadges === 'function') window.checkAndAwardBadges();
            if (typeof window.renderBadgeGrid     === 'function') window.renderBadgeGrid();
        }, 800);
    }

    if (btnLogin) btnLogin.addEventListener('click', doLogin);
    [loginFirstname, loginLastname, loginClasscode].forEach(el => {
        if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
    });

    // Change student button → reopen modal
    const btnChange = document.getElementById('btn-change-student');
    if (btnChange) {
        btnChange.addEventListener('click', () => {
            if (loginFirstname) loginFirstname.value = localStorage.getItem('scratch_student_firstname') || '';
            if (loginLastname)  loginLastname.value  = localStorage.getItem('scratch_student_lastname')  || '';
            if (loginClasscode) loginClasscode.value = localStorage.getItem('scratch_class_code')        || '';
            if (loginError) loginError.style.display = 'none';
            if (btnLogin) { btnLogin.disabled = false; btnLogin.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> เข้าสู่ระบบ'; }
            if (loginModal) loginModal.style.display = 'flex';
        });
    }

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

    // --- 1. SPA Tabs Controller & Learning Progress Tracker ---
    const menuItems = document.querySelectorAll('.menu-item[data-tab]');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const pageTitle = document.getElementById('page-title');
    const learningProgress = document.getElementById('learning-progress');
    const progressPercent = document.getElementById('progress-percent');
    
    const pageTitles = {
        home: "ยินดีต้อนรับสู่ Scratch Academy",
        about: "ทำความรู้จัก: โปรแกรม Scratch คืออะไร?",
        install: "คู่มือ: การติดตั้งโปรแกรมคอมพิวเตอร์",
        variables: "พื้นฐาน: ตัวแปรและตัวดำเนินการ",
        flowchart: "การออกแบบ: การเขียนผังงาน (Flowchart)",
        interface: "เครื่องมือ: ส่วนประกอบของโปรแกรม Scratch",
        activities: "ฝึกปฏิบัติ: กิจกรรมการเขียนโปรแกรมจำลอง",
        quiz: "ประเมินผล: แบบทดสอบ & เกียรติบัตรออนไลน์",
        teacher: "คุณครู: แผงประเมินผลและติดตามผลงานนักเรียน"
    };

    // Tracks which tabs the user has visited to calculate learning progress
    const visitedTabs = new Set(['home']);

    function updateProgress() {
        const keys = Object.keys(pageTitles).filter(k => k !== 'teacher');
        const visited = Array.from(visitedTabs).filter(k => k !== 'teacher');
        const percent = Math.round((visited.length / keys.length) * 100);
        learningProgress.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;
    }

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const tabId = item.getAttribute('data-tab');
            if (!tabId) {
                // Allow normal link navigation for other pages (like python-learn.html)
                return;
            }
            e.preventDefault();
            
            // Update active menu item
            menuItems.forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            
            // Switch tab panel
            tabPanels.forEach(panel => panel.classList.remove('active'));
            const targetTab = document.getElementById(`${tabId}-tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            // Special cases for tabs
            if (tabId === 'quiz') {
                if (typeof window.renderMyRubricProfile === 'function') {
                    window.renderMyRubricProfile();
                }
                if (typeof window.renderBadgeGrid === 'function') {
                    window.renderBadgeGrid();
                }
            }
            
            // Update page title
            pageTitle.textContent = pageTitles[tabId] || "Scratch Academy";
            
            // Update progress
            visitedTabs.add(tabId);
            updateProgress();
            
            // Scroll content to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Handle "Start Learning" button on home screen
    document.querySelector('.btn-start-learning').addEventListener('click', () => {
        const aboutMenu = document.querySelector('[data-tab="about"]');
        if (aboutMenu) aboutMenu.click();
    });

    // Automatic Hash Navigation Handler (e.g. index.html#quiz, index.html#flowchart)
    function handleInitialHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const targetMenu = document.querySelector(`[data-tab="${hash}"]`);
            if (targetMenu) {
                setTimeout(() => targetMenu.click(), 100);
            }
        }
    }
    handleInitialHash();
    window.addEventListener('hashchange', handleInitialHash);

    // Initial progress update
    updateProgress();


    // --- 2. Mini Game: Drag and Snap Block ---
    const draggableBlock = document.getElementById('draggable-block-move');
    const snapTarget = document.getElementById('snap-target');
    const snapFeedback = document.getElementById('snap-game-feedback');

    if (draggableBlock && snapTarget) {
        draggableBlock.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            draggableBlock.style.opacity = '0.5';
        });

        draggableBlock.addEventListener('dragend', () => {
            draggableBlock.style.opacity = '1';
        });

        snapTarget.addEventListener('dragover', (e) => {
            e.preventDefault();
            snapTarget.classList.add('dragover');
        });

        snapTarget.addEventListener('dragleave', () => {
            snapTarget.classList.remove('dragover');
        });

        snapTarget.addEventListener('drop', (e) => {
            e.preventDefault();
            snapTarget.classList.remove('dragover');
            const data = e.dataTransfer.getData('text/plain');
            const draggedEl = document.getElementById(data);
            
            if (draggedEl && draggedEl.id === 'draggable-block-move') {
                // Snap in place
                snapTarget.innerHTML = '';
                snapTarget.appendChild(draggedEl);
                snapTarget.style.height = 'auto';
                snapTarget.style.border = 'none';
                snapTarget.style.background = 'none';
                
                // Feedback
                snapFeedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> ยอดเยี่ยม! บล็อกเชื่อมต่อล็อกกันได้พอดี ด่านนี้ผ่านแล้วครับ!';
                snapFeedback.className = 'snap-feedback success';
                
                // Trigger a small confetti effect or visual sparkle
                draggedEl.style.boxShadow = '0 0 15px rgba(64, 191, 80, 0.8)';
            }
        });
    }


    // --- 3. Virtual Installer Simulator ---
    const installerScreen = document.getElementById('installer-screen');
    let installStep = 1;

    function renderInstallerStep(step) {
        let html = '';
        switch(step) {
            case 1:
                html = `
                    <div class="install-step" id="install-step-1">
                        <h4>ขั้นตอนที่ 1: ดาวน์โหลดตัวติดตั้ง</h4>
                        <p>จากหน้าเว็บไซต์ดาวน์โหลด Scratch Desktop</p>
                        <div class="fake-browser-page">
                            <div class="browser-address-bar">scratch.mit.edu/download</div>
                            <div class="fake-page-content text-center">
                                <div class="installer-logo-big"><i class="fa-solid fa-cubes" style="color: #FFAB19; font-size: 40px;"></i></div>
                                <p style="font-size:12px; margin-bottom:12px;">เลือกรับโปรแกรมสำหรับ Windows หรือ macOS</p>
                                <button class="btn btn-fake-download" id="btn-fake-download">
                                    <i class="fa-solid fa-arrow-down-to-bracket"></i> Direct download
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 2:
                html = `
                    <div class="install-step">
                        <h4>ขั้นตอนที่ 2: ตัวเลือกผู้ใช้งานคอมพิวเตอร์</h4>
                        <p>กรุณาเลือกว่าจะติดตั้งแอปพลิเคชันนี้สำหรับใครบ้าง:</p>
                        <div class="installer-options-box">
                            <label class="installer-radio-item">
                                <input type="radio" name="install-scope" value="anyone" checked>
                                Anyone who uses this computer (ทุกคนในเครื่อง)
                            </label>
                            <label class="installer-radio-item">
                                <input type="radio" name="install-scope" value="only-me">
                                Only for me (เฉพาะตัวฉันคนเดียว)
                            </label>
                        </div>
                        <button class="btn btn-orange" id="btn-fake-install">
                            <i class="fa-solid fa-screwdriver-wrench"></i> Install
                        </button>
                    </div>
                `;
                break;
            case 3:
                html = `
                    <div class="install-step">
                        <h4>ขั้นตอนที่ 3: กำลังดำเนินการติดตั้ง...</h4>
                        <p>รอสักครู่ ระบบกำลังคัดลอกไฟล์ลงระบบของคุณ</p>
                        <div class="installer-progress-bar-bg">
                            <div class="installer-progress-bar-fill" id="fake-install-bar"></div>
                        </div>
                        <span id="fake-install-status" style="font-size:11px; color:var(--text-muted);">Extracting files...</span>
                    </div>
                `;
                break;
            case 4:
                html = `
                    <div class="install-step text-center">
                        <div style="font-size: 45px; color: var(--scratch-green); margin-bottom: 12px;">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h4>ติดตั้ง Scratch Desktop เสร็จเรียบร้อย!</h4>
                        <p>การติดตั้งเสร็จสมบูรณ์ คุณสามารถกดปิดหน้าต่างเพื่อเข้าสู่โปรแกรม</p>
                        <button class="btn btn-green" id="btn-fake-finish">
                            <i class="fa-solid fa-flag-checkered"></i> Finish (เสร็จสิ้น)
                        </button>
                    </div>
                `;
                break;
        }

        installerScreen.innerHTML = html;
        bindInstallerEvents();
        updateInstallerStepsList(step);
    }

    function updateInstallerStepsList(step) {
        const stepItems = document.querySelectorAll('.step-list-item');
        stepItems.forEach((item, index) => {
            if (index + 1 === step) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function bindInstallerEvents() {
        const btnDownload = document.getElementById('btn-fake-download');
        if (btnDownload) {
            btnDownload.addEventListener('click', () => {
                installStep = 2;
                renderInstallerStep(installStep);
            });
        }

        const btnInstall = document.getElementById('btn-fake-install');
        if (btnInstall) {
            btnInstall.addEventListener('click', () => {
                installStep = 3;
                renderInstallerStep(installStep);
                
                // Simulate loading bar progress
                const bar = document.getElementById('fake-install-bar');
                const statusText = document.getElementById('fake-install-status');
                let progress = 0;
                
                const interval = setInterval(() => {
                    progress += 4;
                    if (bar) bar.style.width = `${progress}%`;
                    
                    if (progress >= 40 && progress < 70) {
                        if (statusText) statusText.textContent = "Installing packages...";
                    } else if (progress >= 70 && progress < 95) {
                        if (statusText) statusText.textContent = "Creating shortcuts...";
                    } else if (progress >= 100) {
                        clearInterval(interval);
                        installStep = 4;
                        renderInstallerStep(installStep);
                    }
                }, 80);
            });
        }

        const btnFinish = document.getElementById('btn-fake-finish');
        if (btnFinish) {
            btnFinish.addEventListener('click', () => {
                installStep = 1;
                renderInstallerStep(installStep); // Restart simulation
            });
        }
    }

    // Initialize installer simulation
    renderInstallerStep(1);


    // --- 4. Variable Box Simulator ---
    const btnRunBoxSim = document.getElementById('btn-run-box-sim');
    const inputVarA = document.getElementById('input-var-a');
    const inputVarB = document.getElementById('input-var-b');
    const varExprLeft = document.getElementById('var-expr-left');
    const varExprRight = document.getElementById('var-expr-right');
    const variableBoxObject = document.getElementById('variable-box-object');
    const boxStoredValue = document.getElementById('box-stored-value');
    const resultBubbleVal = document.getElementById('result-bubble-val');

    if (btnRunBoxSim) {
        btnRunBoxSim.addEventListener('click', () => {
            const valA = parseInt(inputVarA.value) || 0;
            const valB = parseInt(inputVarB.value) || 0;
            const result = valA + valB;

            // Reset visual states
            variableBoxObject.classList.remove('open');
            boxStoredValue.classList.remove('drop-anim');
            boxStoredValue.style.opacity = '0';
            resultBubbleVal.classList.remove('show');

            // Update terms in expression
            varExprLeft.textContent = valA;
            varExprRight.textContent = valB;

            // 1. Open Lid (after 100ms)
            setTimeout(() => {
                variableBoxObject.classList.add('open');
                
                // 2. Drop value in box (after 500ms)
                setTimeout(() => {
                    boxStoredValue.textContent = result;
                    boxStoredValue.classList.add('drop-anim');
                    
                    // 3. Close lid and show mascot bubble (after 1500ms)
                    setTimeout(() => {
                        variableBoxObject.classList.remove('open');
                        resultBubbleVal.textContent = `ตัวแปร num เก็บเลข = ${result}`;
                        resultBubbleVal.classList.add('show');
                    }, 1500);

                }, 500);

            }, 100);
        });
    }

    // Operators inner-tabs sub controller
    const subTabButtons = document.querySelectorAll('.sub-tab-btn');
    const subTabContents = document.querySelectorAll('.sub-tab-content');

    subTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-subtab');
            
            subTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            subTabContents.forEach(c => c.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });


    // --- 5. Flowchart Matching Game ---
    const matchShapes = [
        { id: 'term', name: 'Terminal', desc: 'จุดเริ่มต้น / สิ้นสุดของผังงาน', svg: '<ellipse cx="30" cy="18" rx="26" ry="14" fill="none" stroke="#4D97FF" stroke-width="3"/>' },
        { id: 'proc', name: 'Process', desc: 'การคำนวณ หรือประมวลผลข้อมูล', svg: '<rect x="4" y="6" width="52" height="24" fill="none" stroke="#FFAB19" stroke-width="3"/>' },
        { id: 'dec', name: 'Decision', desc: 'การตรวจสอบเงื่อนไข หรือการตัดสินใจ', svg: '<polygon points="30,2 58,18 30,34 2,18" fill="none" stroke="#FF66B2" stroke-width="3"/>' },
        { id: 'disp', name: 'Display', desc: 'แสดงผลลัพธ์ผ่านหน้าจอคอมพิวเตอร์', svg: '<path d="M4,18 L10,6 L50,6 L50,30 L10,30 Z" fill="none" stroke="#9966FF" stroke-width="3"/>' },
        { id: 'inout', name: 'Input/Output', desc: 'รับข้อมูล/แสดงผลลัพธ์ (ไม่ระบุอุปกรณ์)', svg: '<polygon points="10,6 56,6 46,30 2,30" fill="none" stroke="#4CBFE6" stroke-width="3"/>' }
    ];

    let selectedShape = null;
    let selectedMeaning = null;
    let matchedPairs = 0;

    const gameShapesCol = document.getElementById('game-shapes-col');
    const gameMeaningsCol = document.getElementById('game-meanings-col');
    const matchScoreText = document.getElementById('match-score');
    const matchFeedback = document.getElementById('match-feedback');
    const btnResetMatch = document.getElementById('btn-reset-match-game');

    function initMatchingGame() {
        if (!gameShapesCol || !gameMeaningsCol) return;

        gameShapesCol.innerHTML = '';
        gameMeaningsCol.innerHTML = '';
        selectedShape = null;
        selectedMeaning = null;
        matchedPairs = 0;
        matchScoreText.textContent = `คะแนน: 0 / ${matchShapes.length}`;
        matchFeedback.innerHTML = '<i class="fa-regular fa-hand-pointer"></i> เลือกสัญลักษณ์ด้านซ้าย แล้วจับคู่กับคำอธิบายด้านขวา';
        matchFeedback.className = 'game-feedback';

        // Shuffle arrays for dynamic placement
        const shuffledShapes = [...matchShapes].sort(() => Math.random() - 0.5);
        const shuffledMeanings = [...matchShapes].sort(() => Math.random() - 0.5);

        // Render shapes column
        shuffledShapes.forEach(shape => {
            const div = document.createElement('div');
            div.className = 'match-item shapes-col';
            div.setAttribute('data-id', shape.id);
            div.innerHTML = `
                <svg class="flowchart-svg-small" viewBox="0 0 60 36">${shape.svg}</svg>
                <span><strong>${shape.name}</strong></span>
            `;
            
            div.addEventListener('click', () => {
                if (div.classList.contains('matched')) return;
                
                // Clear previous shapes selection
                document.querySelectorAll('.shapes-list .match-item').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                selectedShape = shape.id;
                checkMatchSelection();
            });

            gameShapesCol.appendChild(div);
        });

        // Render meanings column
        shuffledMeanings.forEach(meaning => {
            const div = document.createElement('div');
            div.className = 'match-item meanings-col';
            div.setAttribute('data-id', meaning.id);
            div.innerHTML = `<span>${meaning.desc}</span>`;
            
            div.addEventListener('click', () => {
                if (div.classList.contains('matched')) return;
                
                // Clear previous meanings selection
                document.querySelectorAll('.meanings-list .match-item').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                selectedMeaning = meaning.id;
                checkMatchSelection();
            });

            gameMeaningsCol.appendChild(div);
        });
    }

    function checkMatchSelection() {
        if (selectedShape && selectedMeaning) {
            if (selectedShape === selectedMeaning) {
                // Correct Match
                const shapeEl = document.querySelector(`.shapes-list .match-item[data-id="${selectedShape}"]`);
                const meaningEl = document.querySelector(`.meanings-list .match-item[data-id="${selectedMeaning}"]`);
                
                shapeEl.classList.remove('selected');
                shapeEl.classList.add('matched');
                meaningEl.classList.remove('selected');
                meaningEl.classList.add('matched');
                
                matchedPairs++;
                matchScoreText.textContent = `คะแนน: ${matchedPairs} / ${matchShapes.length}`;
                matchFeedback.innerHTML = '<i class="fa-solid fa-circle-check" style="color:var(--scratch-green)"></i> จับคู่ถูกต้อง!';
                matchFeedback.className = 'game-feedback success';
                
                if (matchedPairs === matchShapes.length) {
                    matchFeedback.innerHTML = '<i class="fa-solid fa-trophy" style="color:var(--primary-orange)"></i> ยินดีด้วย! จับคู่สัญลักษณ์ผังงานครบทุกข้อถูกต้องทั้งหมด!';
                }
            } else {
                // Wrong Match
                matchFeedback.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color:#F87171"></i> ยังไม่ถูกนะ ลองจับคู่อีกครั้งหนึ่งครับ';
                matchFeedback.className = 'game-feedback';
                
                // Deselect selections with visual shake or flash
                setTimeout(() => {
                    document.querySelectorAll('.match-item.selected').forEach(el => el.classList.remove('selected'));
                }, 500);
            }
            
            selectedShape = null;
            selectedMeaning = null;
        }
    }

    if (btnResetMatch) {
        btnResetMatch.addEventListener('click', initMatchingGame);
    }

    initMatchingGame();


    // --- 6. Interactive Scratch UI Hotspots Tour ---
    const hotspots = document.querySelectorAll('.hotspot');
    const tourInfoPanel = document.getElementById('tour-info-panel');

    const tourData = {
        1: {
            title: "1. Tools Bar (แถบเครื่องมือด้านบน)",
            text: "เป็นแถบจัดการโปรแกรมทั่วไป เช่น สลับเปลี่ยนภาษาของบล็อกคำสั่ง, เมนูการจัดการไฟล์ต่างๆ (สร้างไฟล์งานใหม่, โหลดตัวอย่างไฟล์, ดาวน์โหลดและเซฟงานบันทึกเก็บลงเครื่องคอมพิวเตอร์), แถบบทเรียนแนะนำ (Tutorials) และส่วนจัดการชื่อโปรเจกต์"
        },
        2: {
            title: "2. แท็บการแก้ไขวัตถุ (Code, Costumes, Sounds)",
            text: "ประกอบด้วย 3 แท็บสำคัญสำหรับจัดแต่งวัตถุสไปรท์หลัก:<br>1. <strong>Code</strong>: สำหรับนำชุดบล็อกคำสั่งโค้ดมาต่อเรียงเป็นสคริปต์ทำงาน<br>2. <strong>Costumes</strong>: ใช้สำหรับปรับแต่งตัวละคร วาดโครงเส้น เปลี่ยนท่าทางเดิน ขยับหาง หรือเปลี่ยนสีสัน<br>3. <strong>Sounds</strong>: ใช้จัดการไฟล์เสียงเอฟเฟกต์ หรืออัดเสียงใหม่ลงโปรแกรม"
        },
        3: {
            title: "3. หมวดหมู่ของบล็อกคำสั่ง (Scripts Categories)",
            text: "แถบชุดสีวงกลมแสดงประเภทของบล็อกคำสั่งแบ่งเป็นหมวดต่างๆ ตามความสอดคล้อง เช่น สีฟ้า=Motion (เคลื่อนไหว), สีส้ม=Control (วนลูป-เช็คเงื่อนไข), สีชมพูอมม่วง=Looks (สลับท่าพูดคิด), สีเขียว=Operators (เครื่องคำนวณบวกเลข) ช่วยให้เลือกหยิบบล็อกได้เร็ว"
        },
        4: {
            title: "4. พื้นที่แสดงบล็อกคำสั่งย่อย (Blocks Palette)",
            text: "แผงแสดงชิ้นส่วนบล็อกย่อยของหมวดหมู่สีที่เลือกในปัจจุบัน น้องๆ สามารถลากบล็อกสีเหล่านั้นข้ามเขตเข้ามาปล่อยวางลงใน 'พื้นที่เขียนสคริปต์' (พื้นที่ตรงกลางจอ) เพื่อประกอบชิ้นส่วนโค้ด"
        },
        5: {
            title: "5. พื้นที่สำหรับเขียนสคริปต์ (Scripts Area)",
            text: "พื้นที่สีขาวกระดาษตาตารางขนาดใหญ่ตรงกลางจอ เป็นลานกว้างสำหรับลากบล็อกชิ้นต่างๆ มาสวมประกบรวมกันเป็นลำดับโค้ดจากบนลงล่าง บล็อกที่วางอยู่นี่จะทำงานควบคุมสิ่งต่างๆ ในเวที"
        },
        6: {
            title: "6. แถบควบคุมเวทีด้านบน Stage",
            text: "เป็นศูนย์ควบคุมเปิด/ปิดโปรเจกต์ มีสัญลักษณ์ <strong>ธงสีเขียว</strong> (คลิกเพื่อสั่งโปรแกรมที่เขียนทำงานทั้งหมดเริ่มรันพร้อมกัน) และสัญลักษณ์ <strong>ป้ายหยุดสีแดง</strong> (คลิกเพื่อหยุดคำสั่งของสไปรท์ทุกตัวทันที) และปุ่มสลับขนาดโฟกัสจอ"
        },
        7: {
            title: "7. Stage (เวทีแสดงผล)",
            text: "เป็นพื้นที่แสดงผลลัพธ์ของชิ้นงาน ตัวการ์ตูนจะเดิน วาดภาพ หรือเล่นเกมส์ตรงนี้ มีขนาดกว้าง 480 พิกเซล และสูง 360 พิกเซล โดยมีจุดอ้างอิงตรงกลางเป๊ะเป็น <strong>X=0, Y=0</strong> แกน X แนวนอนมีค่าซ้ายสุด -240 ไปขวาสุด 240 แกน Y แนวตั้งล่างสุด -180 ไปบนสุด 180"
        },
        8: {
            title: "8. รายการตัวละครและเวที (Sprites List)",
            text: "พื้นที่เก็บวัตถุทุกชิ้นในงาน ทั้งรายชื่อภาพตัวละครหลัก (Sprites) และชื่อภาพพื้นหลังเวที (Backdrops) การคลิกเลือกสไปรท์ตัวใด จะเป็นการกระโดดเข้าไปเขียนสคริปต์ควบคุมเฉพาะตัวสไปรท์ตัวนั้นๆ หากต้องการสลับเขียนโค้ดฉากหลังให้คลิกขวาสุดที่กล่อง Backdrop"
        }
    };

    hotspots.forEach(spot => {
        spot.addEventListener('click', () => {
            // Highlight active hotspot
            hotspots.forEach(s => s.classList.remove('active'));
            spot.classList.add('active');

            const sectionId = spot.getAttribute('data-section');
            const data = tourData[sectionId];
            
            if (data) {
                tourInfoPanel.innerHTML = `
                    <div class="tour-info-card animation-fadeIn">
                        <h3><i class="fa-solid fa-circle-info"></i> ${data.title}</h3>
                        <p>${data.text}</p>
                    </div>
                `;
            }
        });
    });


    // --- 7. Program Execution Simulator ---
    const simActButtons = document.querySelectorAll('.sim-act-btn');
    const flowchartContainer = document.getElementById('flowchart-steps-container');
    const blocksContainer = document.getElementById('scratch-blocks-container');
    const simCatSprite = document.getElementById('sim-cat-sprite');
    const simCatBubble = document.getElementById('sim-cat-bubble');
    const simConsole = document.getElementById('sim-console-text');
    const btnPlaySim = document.getElementById('btn-play-sim');
    const btnStopSim = document.getElementById('btn-stop-sim');

    let currentSimActivity = "1";
    let isSimRunning = false;
    let simTimeoutIds = [];

    const activitiesData = {
        "1": {
            name: "กิจกรรมที่ 1: บวกเลขแบบลำดับ",
            desc: "เริ่ม -> a=5 -> b=3 -> c=a+b -> แสดง c -> สิ้นสุด",
            flowchart: [
                { type: 'terminal', text: 'เริ่มต้น' },
                { type: 'process', text: 'a = 5' },
                { type: 'process', text: 'b = 3' },
                { type: 'process', text: 'c = a + b' },
                { type: 'io', text: 'แสดงค่า c' },
                { type: 'terminal', text: 'สิ้นสุด' }
            ],
            blocks: [
                { type: 'when-clicked', text: 'เมื่อคลิกธงเขียว 🟢' },
                { type: 'set-var', text: 'ตั้งค่า a เป็น 5' },
                { type: 'set-var', text: 'ตั้งค่า b เป็น 3' },
                { type: 'set-var', text: 'ตั้งค่า c เป็น a + b' },
                { type: 'say', text: 'พูดค่า c เป็นเวลา 5 วินาที' },
                { type: 'stop', text: 'หยุดสคริปต์ทั้งหมด' }
            ],
            actions: [
                { console: "เริ่มระบบ... ตัวสแกนผังงานชี้ที่ 'เริ่มต้น'", bubble: "สวัสดีจ้า! พร้อมคำนวณเลขแบบเรียงลำดับหรือยัง?", x: 0, scale: 1 },
                { console: "คำสั่งกำหนดค่า: a = 5 จองพื้นที่เก็บลงสมอง", bubble: "จดคำแรก: ให้ตัวแปร a เก็บเลข 5 ไว้ในใจนะ!", x: 0 },
                { console: "คำสั่งกำหนดค่า: b = 3 จองพื้นที่เก็บเพิ่ม", bubble: "จดคำสอง: ให้ตัวแปร b เก็บเลข 3 เพิ่มเข้าไป!", x: 0 },
                { console: "คำสั่งคำนวณผลบวก: c = 5 + 3 = 8", bubble: "จับบวกกันเลย! c = a + b จะได้เท่าไหร่กันน้า?", x: 0 },
                { console: "คำสั่งส่งออกจอ: ตัวละครพูดผลลัพธ์ของ c (8)", bubble: "ผลลัพธ์ของ c คือ 8 ครับผม! 🎉", x: 0 },
                { console: "สิ้นสุดลำดับการรันแบบขั้นตอนเดี่ยว", bubble: "คำนวณเสร็จเรียบร้อย! โปรแกรมทำงานเสร็จสมบูรณ์แล้ว", x: 0 }
            ]
        },
        "2": {
            name: "กิจกรรมที่ 2: ทางเลือกเดียว (เช็คคะแนน)",
            desc: "c = a + b; ถ้า c > 5 แล้วแสดงผล c",
            flowchart: [
                { type: 'terminal', text: 'เริ่มต้น' },
                { type: 'process', text: 'a=5, b=3' },
                { type: 'process', text: 'c = a + b' },
                { type: 'decision', text: 'c > 5 ?' },
                { type: 'io', text: 'แสดงค่า c' },
                { type: 'terminal', text: 'สิ้นสุด' }
            ],
            blocks: [
                { type: 'when-clicked', text: 'เมื่อคลิกธงเขียว 🟢' },
                { type: 'set-var', text: 'ตั้งค่า a เป็น 5, b เป็น 3' },
                { type: 'set-var', text: 'ตั้งค่า c เป็น a + b' },
                { type: 'if', text: 'ถ้า c > 5 แล้ว:', children: [
                    { type: 'say', text: 'พูดค่า c เป็นเวลา 5 วินาที' }
                ]},
                { type: 'stop', text: 'หยุดสคริปต์ทั้งหมด' }
            ],
            actions: [
                { console: "เริ่มโปรแกรมทางเลือก...", bubble: "เรามาเริ่มทดสอบเงื่อนไข If-Then ทางเลือกเดียวกระโดดข้ามกัน!", x: 0 },
                { console: "กำหนดค่า a = 5 และ b = 3", bubble: "ใส่ค่า: กำหนดตัวแปร a=5 และ b=3 เรียบร้อย", x: 0 },
                { console: "รวมค่า c = a + b = 8", bubble: "บวกเลข: คำนวณค่าตัวแปร c = 8", x: 0 },
                { console: "เข้ากล่องเงื่อนไข: เปรียบเทียบ 8 > 5 หรือไม่? คำตอบคือ จริง (True)", bubble: "ตรวจสอบเงื่อนไข: c > 5 หรือเปล่า? (8 > 5) คำตอบคือ จริง!", x: 0, highlightNodes: [3] },
                { console: "ผลลัพธ์จริง -> วิ่งเข้าไปสั่งงานคำสั่งในบล็อก 'ถ้า'", bubble: "ในเมื่อเป็นจริง! เหมียวจะเข้าไปพูดตัวเลข c ให้ฟังครับ... c = 8!", x: 0, highlightNodes: [4] },
                { console: "สิ้นสุดทางทำงาน", bubble: "สิ้นสุดเรียบร้อย! โปรแกรมเลือกรันจุดที่เป็นจริงสำเร็จ", x: 0 }
            ]
        },
        "3": {
            name: "กิจกรรมที่ 3: สองทางเลือก (เช็คเกิน 100)",
            desc: "คำนวณผลรวมของ 2 จำนวน ถ้าเกิน 100 แสดงคำเตือนเกินร้อย มิฉะนั้นเตือนไม่เกิน",
            flowchart: [
                { type: 'terminal', text: 'เริ่มต้น' },
                { type: 'io', text: 'รับค่า num1, num2' },
                { type: 'process', text: 'sum = num1 + num2' },
                { type: 'decision', text: 'sum > 100 ?' },
                { type: 'io', text: 'แสดง "ค่ามากกว่า 100"' },
                { type: 'io', text: 'แสดง "ค่าไม่เกิน 100"' },
                { type: 'terminal', text: 'สิ้นสุด' }
            ],
            blocks: [
                { type: 'when-clicked', text: 'เมื่อคลิกธงเขียว 🟢' },
                { type: 'ask', text: 'ถาม "กรอกค่า 1" และรอคอย' },
                { type: 'ask', text: 'ถาม "กรอกค่า 2" และรอคอย' },
                { type: 'set-var', text: 'ตั้งค่า sum เป็น num1 + num2' },
                { type: 'if', text: 'ถ้า sum > 100 แล้ว:', children: [
                    { type: 'say', text: 'พูด "ค่ามากกว่า 100"' }
                ], elseText: 'มิฉะนั้น:', elseChildren: [
                    { type: 'say', text: 'พูด "ค่าไม่เกิน 100"' }
                ]},
                { type: 'stop', text: 'หยุดสคริปต์ทั้งหมด' }
            ],
            actions: [
                { console: "เปิดใช้งานแบบทดสอบสองทางเลือก (If-Else)...", bubble: "มาลองกรอกตัวเลขตรวจสอบผลรวมกันเถอะ!", x: 0 },
                { console: "ป้อนข้อมูลจำลอง: num1 = 45", bubble: "ป้อนค่าแรก: num1 เก็บเลข 45", x: 0 },
                { console: "ป้อนข้อมูลจำลอง: num2 = 60", bubble: "ป้อนค่าสอง: num2 เก็บเลข 60", x: 0 },
                { console: "คำนวณผลรวม: sum = 45 + 60 = 105", bubble: "รวมตัวแปร: รวมผลลัพธ์ sum ได้เท่ากับ 105!", x: 0 },
                { console: "เช็คเงื่อนไข: 105 > 100 หรือไม่? คำตอบคือ จริง (True)", bubble: "เงื่อนไข sum > 100? (105 > 100) เป็นความจริง!", x: 0, highlightNodes: [3] },
                { console: "เงื่อนไขเป็นจริง -> รันคำสั่งในขากิ่ง 'จริง' ของเงื่อนไข If", bubble: "ความจริงชนะ! เหมียวพูดว่า: ค่ามากกว่า 100 ค้าบ! 🌟", x: 0, highlightNodes: [4] },
                { console: "ข้ามคำสั่งกิ่ง 'ไม่จริง' (Else) ไปสู่จุดสิ้นสุดทันที", bubble: "จบลำดับ: สังเกตว่าบล็อกสีม่วงช่องล่างโดนละเว้นไปทันที!", x: 0, highlightNodes: [6] }
            ]
        },
        "4": {
            name: "กิจกรรมที่ 4: หลายทางเลือก (คิดเกรดช่วงคะแนน)",
            desc: "ตรวจสอบช่วงผลรวมเพื่อรายงานเกรด (มากกว่า 100, ระหว่าง 50-100, น้อยกว่า 50)",
            flowchart: [
                { type: 'terminal', text: 'เริ่มต้น' },
                { type: 'io', text: 'ป้อนข้อมูลตัวแปร num1, num2' },
                { type: 'process', text: 'sum = num1 + num2' },
                { type: 'decision', text: 'sum > 100 ?' },
                { type: 'decision', text: 'sum >= 50 ?' },
                { type: 'io', text: 'แสดง "มากกว่า 100"' },
                { type: 'io', text: 'แสดง "ระหว่าง 50 ถึง 100"' },
                { type: 'io', text: 'แสดง "น้อยกว่า 50"' },
                { type: 'terminal', text: 'สิ้นสุด' }
            ],
            blocks: [
                { type: 'when-clicked', text: 'เมื่อคลิกธงเขียว 🟢' },
                { type: 'set-var', text: 'ตั้งค่า sum เป็น num1 + num2' },
                { type: 'if', text: 'ถ้า sum > 100 แล้ว:', children: [
                    { type: 'say', text: 'พูด "ค่ามากกว่า 100"' }
                ], elseText: 'มิฉะนั้น ถ้า sum >= 50 แล้ว:', elseChildren: [
                    { type: 'say', text: 'พูด "ค่าระหว่าง 50 ถึง 100"' }
                ], doubleElseText: 'มิฉะนั้น:', doubleElseChildren: [
                    { type: 'say', text: 'พูด "ค่าน้อยกว่า 50"' }
                ]},
                { type: 'stop', text: 'หยุดสคริปต์ทั้งหมด' }
            ],
            actions: [
                { console: "เปิดใช้ระบบหลายเงื่อนไขซ้อนกัน...", bubble: "รอบนี้จะจำลองการป้อนเลขเพื่อทดสอบเงื่อนไขตรงกลางนะ!", x: 0 },
                { console: "ป้อนข้อมูลจำลอง: num1 = 20, num2 = 40", bubble: "ใส่ค่าตัวแปร: ให้ num1 = 20 และ num2 = 40", x: 0 },
                { console: "ผลคำนวณรวม: sum = 60", bubble: "คำนวณผลรวม: ค่า sum เก็บเลข 60", x: 0 },
                { console: "เช็คทางเลือกแรก: sum > 100? (60 > 100) -> เท็จ (False)", bubble: "เช็คเงื่อนไขแรก: sum > 100? (60 > 100) ไม่จริง! ข้ามไปเช็คกล่องถัดไป", x: 0, highlightNodes: [3] },
                { console: "เช็คทางเลือกสอง: sum >= 50? (60 >= 50) -> จริง (True)", bubble: "เช็คเงื่อนไขสอง: sum >= 50? (60 >= 50) เป็นความจริง!", x: 0, highlightNodes: [4] },
                { console: "เงื่อนไขสองเป็นจริง -> ทำงานคำสั่งในกิ่งสอง", bubble: "เย้ เหมียวพูดว่า: ค่าระหว่าง 50 ถึง 100 ค้าบ! 🔔", x: 0, highlightNodes: [6] },
                { console: "ข้ามกิ่งที่เหลือมุ่งหน้าสู่จุดหยุดการทำงานของผังงาน", bubble: "สิ้นสุดการทำงานโปรแกรมทางเลือกชั้นซ้อนได้สำเร็จ", x: 0, highlightNodes: [8] }
            ]
        },
        "5": {
            name: "กิจกรรมที่ 5: วนซ้ำแบบนับจำนวนรอบ (For Loop)",
            desc: "เริ่ม -> i=0 -> วนลูป 10 รอบ -> แสดง i -> i = i+1 -> สิ้นสุด",
            flowchart: [
                { type: 'terminal', text: 'เริ่มต้น' },
                { type: 'process', text: 'i = 0' },
                { type: 'decision', text: 'วนซ้ำครบ 10 รอบ ?' },
                { type: 'io', text: 'แสดงค่า i' },
                { type: 'process', text: 'i = i + 1' },
                { type: 'terminal', text: 'สิ้นสุด' }
            ],
            blocks: [
                { type: 'when-clicked', text: 'เมื่อคลิกธงเขียว 🟢' },
                { type: 'set-var', text: 'ตั้งค่า i เป็น 0' },
                { type: 'repeat', text: 'วนซ้ำ 10 ครั้ง:', children: [
                    { type: 'say', text: 'พูดค่า i เป็นเวลา 1 วินาที' },
                    { type: 'set-var', text: 'เปลี่ยนค่า i เพิ่มขึ้นทีละ 1' }
                ]},
                { type: 'stop', text: 'หยุดสคริปต์ทั้งหมด' }
            ],
            actions: [
                { console: "เริ่มทำงานโครงสร้างวนซ้ำ...", bubble: "เหมียวจะช่วยนับเลขตั้งแต่ 0 จนถึง 9 ทีละรอบตัวเลขนะ!", x: -50 },
                { console: "ตั้งค่าตัวแปรดัชนีชี้รอบ: i = 0", bubble: "เริ่มต้น: ตัวแปรวนซ้ำ i มีค่าเริ่มต้นเป็น 0", x: -50 },
                { console: "เช็ครอบวนลูป: รอบที่ 1 (i = 0)", bubble: "นับรอบ 1: เหมียวพูดเลข i = 0", x: -30, highlightNodes: [2, 3] },
                { console: "บวกเพิ่มค่าดัชนี: i = i + 1 = 1", bubble: "รอบที่ 2: เหมียวพูดเลข i = 1", x: -10, highlightNodes: [4, 2, 3] },
                { console: "บวกเพิ่มค่าดัชนี: i = i + 1 = 2", bubble: "รอบที่ 3: เหมียวพูดเลข i = 2", x: 10, highlightNodes: [4, 2, 3] },
                { console: "รันลูปและแสดงผลเลขอย่างต่อเนื่องถัดไป...", bubble: "...ขยับนับวนซ้ำเพิ่มไปเรื่อยๆ จนถึงตัวเลข 9!", x: 40, highlightNodes: [2, 3] },
                { console: "นับจำนวนรอบตรวจสอบครบ 10 ครั้ง -> ออกจากลูป", bubble: "นับครบแล้ว! เงื่อนไขวนซ้ำหมดสิ้น ออกจากลูปมาที่จุดสิ้นสุด", x: 80, highlightNodes: [5] }
            ]
        },
        "6": {
            name: "กิจกรรมที่ 6: วนซ้ำแบบเช็คเงื่อนไข (Until Loop)",
            desc: "เริ่ม -> i=0 -> ทำงานซ้ำจนกว่า i > 9 -> แสดง i -> i = i+1 -> สิ้นสุด",
            flowchart: [
                { type: 'terminal', text: 'เริ่มต้น' },
                { type: 'process', text: 'i = 0' },
                { type: 'decision', text: 'เช็คเงื่อนไข i > 9 ?' },
                { type: 'io', text: 'แสดงค่า i' },
                { type: 'process', text: 'i = i + 1' },
                { type: 'terminal', text: 'สิ้นสุด' }
            ],
            blocks: [
                { type: 'when-clicked', text: 'เมื่อคลิกธงเขียว 🟢' },
                { type: 'set-var', text: 'ตั้งค่า i เป็น 0' },
                { type: 'repeat', text: 'วนซ้ำจนกว่า i > 9:', children: [
                    { type: 'say', text: 'พูดค่า i เป็นเวลา 1 วินาที' },
                    { type: 'set-var', text: 'เปลี่ยนค่า i เพิ่มขึ้นทีละ 1' }
                ]},
                { type: 'stop', text: 'หยุดสคริปต์ทั้งหมด' }
            ],
            actions: [
                { console: "เริ่มระบบวนลูปเงื่อนไข Repeat-Until...", bubble: "วนซ้ำแบบเช็คเงื่อนไขหลังลูป สั่งทำซ้ำไปเรื่อยๆ จนกว่า i จะเกิน 9 นะ!", x: -50 },
                { console: "ตั้งค่าตัวแปรดัชนีเงื่อนไข: i = 0", bubble: "เริ่มต้น: ตัวแปร i = 0", x: -50 },
                { console: "เช็คเงื่อนไข: 0 > 9 หรือไม่? คำตอบคือ เท็จ -> รันในลูปต่อ", bubble: "เช็คเงื่อนไข (0 > 9) คำตอบคือ เท็จ! เหมียวพูดเลข i = 0 ค้าบ", x: -30, highlightNodes: [2, 3] },
                { console: "บวกเพิ่มค่า: i = i + 1 = 1", bubble: "บวกเลข i เพิ่มเป็น 1 (1 > 9) ยังเท็จอยู่ รันต่อ! เหมียวพูด i = 1", x: -10, highlightNodes: [4, 2, 3] },
                { console: "บวกเพิ่มค่า: i = i + 1 = 2", bubble: "บวกเลข i เพิ่มเป็น 2 (2 > 9) ยังเท็จอยู่ รันต่อ! เหมียวพูด i = 2", x: 10, highlightNodes: [4, 2, 3] },
                { console: "ทำงานซ้ำอย่างต่อเนื่อง...", bubble: "วนไปเรื่อยๆ จนค่า i กลายสภาพเป็นเลข 10...", x: 40, highlightNodes: [2, 3] },
                { console: "เช็คเงื่อนไขรอบสุดท้าย: 10 > 9 เป็น จริง (True) -> สั่งเบรกออกจากลูปทันที", bubble: "ว้าว! รอบนี้ (10 > 9) เป็นจริงแล้ว! เหมียวเบรกออกจากลูปไปสิ้นสุดโปรแกรมจ้า", x: 80, highlightNodes: [5] }
            ]
        }
    };

    function renderFlowchart(activityId) {
        const act = activitiesData[activityId];
        if (!act) return;

        flowchartContainer.innerHTML = '';
        
        act.flowchart.forEach((node, index) => {
            // Draw shape node
            const nodeDiv = document.createElement('div');
            nodeDiv.className = `fc-node fc-${node.type}`;
            nodeDiv.id = `fc-node-${index}`;
            
            // Adjust inner content placement for skewed / rotated shapes
            if (node.type === 'decision') {
                nodeDiv.innerHTML = `<span class="fc-decision-content">${node.text}</span>`;
            } else if (node.type === 'io') {
                nodeDiv.innerHTML = `<span class="fc-io-content">${node.text}</span>`;
            } else {
                nodeDiv.innerHTML = `<span>${node.text}</span>`;
            }

            flowchartContainer.appendChild(nodeDiv);

            // Draw arrow if not the last node
            if (index < act.flowchart.length - 1) {
                const arrowDiv = document.createElement('div');
                arrowDiv.className = 'fc-arrow';
                arrowDiv.id = `fc-arrow-${index}`;
                arrowDiv.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
                flowchartContainer.appendChild(arrowDiv);
            }
        });
    }

    function renderScratchBlocks(activityId) {
        const act = activitiesData[activityId];
        if (!act) return;

        blocksContainer.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'sim-blocks-col';

        let blockIndex = 0;

        act.blocks.forEach((block) => {
            const blockEl = createBlockElement(block, blockIndex++);
            wrapper.appendChild(blockEl);
        });

        blocksContainer.appendChild(wrapper);
    }

    function createBlockElement(block, idIndex) {
        const div = document.createElement('div');
        div.className = `sb-block sb-${block.type}`;
        div.id = `sb-block-${idIndex}`;
        
        div.innerHTML = `<span>${block.text}</span>`;

        // Render nested child blocks (loops, ifs, etc.)
        if (block.children) {
            const body = document.createElement('div');
            body.className = 'sb-repeat-body';
            block.children.forEach(child => {
                const childEl = document.createElement('div');
                childEl.className = `sb-block sb-${child.type}`;
                childEl.innerHTML = `<span>${child.text}</span>`;
                body.appendChild(childEl);
            });
            
            const outerWrapper = document.createElement('div');
            outerWrapper.className = `sb-${block.type}`;
            outerWrapper.id = `sb-block-${idIndex}`; // associate state identification with outer block container
            
            const header = document.createElement('div');
            header.className = 'sb-repeat-header';
            header.innerHTML = `<span>${block.text}</span>`;
            
            outerWrapper.appendChild(header);
            outerWrapper.appendChild(body);
            
            // Render else clause inside double selections
            if (block.elseText) {
                const elseHeader = document.createElement('div');
                elseHeader.className = 'sb-else-header';
                elseHeader.innerHTML = `<span>${block.elseText}</span>`;
                outerWrapper.appendChild(elseHeader);

                const elseBody = document.createElement('div');
                elseBody.className = 'sb-repeat-body';
                block.elseChildren.forEach(child => {
                    const childEl = document.createElement('div');
                    childEl.className = `sb-block sb-${child.type}`;
                    childEl.innerHTML = `<span>${child.text}</span>`;
                    elseBody.appendChild(childEl);
                });
                outerWrapper.appendChild(elseBody);
            }

            // Render grade multiple selection else clause (double nested if)
            if (block.doubleElseText) {
                const doubleElseHeader = document.createElement('div');
                doubleElseHeader.className = 'sb-else-header';
                doubleElseHeader.innerHTML = `<span>${block.doubleElseText}</span>`;
                outerWrapper.appendChild(doubleElseHeader);

                const doubleElseBody = document.createElement('div');
                doubleElseBody.className = 'sb-repeat-body';
                block.doubleElseChildren.forEach(child => {
                    const childEl = document.createElement('div');
                    childEl.className = `sb-block sb-${child.type}`;
                    childEl.innerHTML = `<span>${child.text}</span>`;
                    doubleElseBody.appendChild(childEl);
                });
                outerWrapper.appendChild(doubleElseBody);
            }

            const bottom = document.createElement('div');
            bottom.className = 'sb-repeat-header';
            bottom.innerHTML = `<span></span>`;
            outerWrapper.appendChild(bottom);

            return outerWrapper;
        }

        return div;
    }

    function runSimulationStep(stepIndex, act) {
        if (!isSimRunning) return;

        const step = act.actions[stepIndex];
        if (!step) {
            // End simulation
            stopSimulation();
            return;
        }

        // Highlight flowchart node
        document.querySelectorAll('.fc-node, .fc-arrow').forEach(el => el.classList.remove('active-step'));
        const targetNode = document.getElementById(`fc-node-${stepIndex}`);
        const targetArrow = document.getElementById(`fc-arrow-${stepIndex - 1}`);
        if (targetNode) targetNode.classList.add('active-step');
        if (targetArrow) targetArrow.classList.add('active-step');

        // Force manual override highlighted nodes for branching structures
        if (step.highlightNodes) {
            document.querySelectorAll('.fc-node').forEach((el, idx) => {
                if (step.highlightNodes.includes(idx)) el.classList.add('active-step');
            });
        }

        // Highlight Scratch block
        document.querySelectorAll('.sb-block, .sb-repeat, .sb-if').forEach(el => el.classList.remove('active-step'));
        const targetBlock = document.getElementById(`sb-block-${stepIndex}`);
        if (targetBlock) targetBlock.classList.add('active-step');

        // Update Stage Cat position and speech
        if (step.x !== undefined) {
            // Map grid virtual X (-240, 240) to pixel offset relative to center
            const centerOffset = step.x;
            simCatSprite.style.left = `calc(50% + ${centerOffset}px)`;
        }

        if (step.bubble) {
            simCatBubble.textContent = step.bubble;
            simCatBubble.style.display = 'block';
        } else {
            simCatBubble.style.display = 'none';
        }

        // Output to simulation console log
        const time = new Date().toLocaleTimeString('th-TH');
        simConsole.innerHTML += `<div style="margin-bottom:4px;">[${time}] ${step.console}</div>`;
        simConsole.scrollTop = simConsole.scrollHeight;

        // Schedule next step
        const tid = setTimeout(() => {
            runSimulationStep(stepIndex + 1, act);
        }, 3200); // 3.2s per step so children can read easily
        simTimeoutIds.push(tid);
    }

    function startSimulation() {
        const act = activitiesData[currentSimActivity];
        if (!act) return;

        isSimRunning = true;
        btnPlaySim.disabled = true;
        btnStopSim.disabled = false;
        
        simConsole.innerHTML = '<div style="color:var(--scratch-green); font-weight:bold;">🟢 เริ่มต้นรันสคริปต์คอมพิวเตอร์...</div>';
        
        runSimulationStep(0, act);
    }

    function stopSimulation() {
        isSimRunning = false;
        btnPlaySim.disabled = false;
        btnStopSim.disabled = true;
        
        // Clear all timeout routines
        simTimeoutIds.forEach(id => clearTimeout(id));
        simTimeoutIds = [];

        // Clear active visual states
        document.querySelectorAll('.fc-node, .fc-arrow, .sb-block, .sb-repeat, .sb-if').forEach(el => {
            el.classList.remove('active-step');
        });

        simCatBubble.textContent = "โปรแกรมหยุดรันแล้วจ้า!";
        simConsole.innerHTML += '<div style="color:var(--scratch-pink); font-weight:bold;">🛑 สิ้นสุดกระบวนการทำงานของสคริปต์</div>';
        simConsole.scrollTop = simConsole.scrollHeight;
    }

    // Set active activity on click
    simActButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            stopSimulation();
            
            simActButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentSimActivity = btn.getAttribute('data-activity');
            renderFlowchart(currentSimActivity);
            renderScratchBlocks(currentSimActivity);

            const data = activitiesData[currentSimActivity];
            if (data) {
                simCatBubble.textContent = `กิจกรรมแสนสนุก: ${data.name}! พร้อมแล้วกดเริ่มรันกันเลยครับ`;
            }
        });
    });

    if (btnPlaySim && btnStopSim) {
        btnPlaySim.addEventListener('click', startSimulation);
        btnStopSim.addEventListener('click', stopSimulation);
    }

    // Initial simulator render
    renderFlowchart("1");
    renderScratchBlocks("1");


    // --- 8. Evaluation Quiz & Certificate System ---
    const quizQuestions = [
        {
            q: "1. โปรแกรม Scratch คือเครื่องมือชนิดใด?",
            a: [
                "โปรแกรมพิมพ์เอกสารและทำบัญชีการเงินในออฟฟิศ",
                "(Recommended) โปรแกรมสร้างสื่อมัลติมีเดียที่ใช้วิธีลากบล็อกคำสั่งมาประกอบกัน",
                "ระบบปฏิบัติการควบคุมโทรศัพท์มือถือสมาร์ทโฟน",
                "โปรแกรมแปลภาษาต่างประเทศแบบเรียลไทม์"
            ],
            correct: 1
        },
        {
            q: "2. การเขียนโปรแกรมแบบบล็อก (Block Programming) มีประโยชน์อย่างไรในเด็กหลักสูตรเริ่มต้น?",
            a: [
                "เพื่อฝึกทักษะการพิมพ์พิมพ์ดีดสัมผัสได้อย่างรวดเร็ว",
                "ช่วยประหยัดไฟหน่วยความจำบนการ์ดจอ",
                "(Recommended) ป้องกันความผิดพลาดจากการพิมพ์โค้ดผิดไวยากรณ์ และมองเห็นลำดับได้ง่ายขึ้น",
                "โปรแกรมจะประมวลผลคำนวณเร็วขึ้นกว่าพิมพ์โค้ดตัวอักษร"
            ],
            correct: 2
        },
        {
            q: "3. ตัวแปร (Variable) ในหลักการเขียนโปรแกรมเปรียบเสมือนสิ่งใด?",
            a: [
                "เครื่องเล่นเกมพกพาส่วนตัว",
                "เครื่องตรวจวัดอุณหภูมิอากาศภายนอกบ้าน",
                "(Recommended) กล่องกระดาษใส่ของที่แปะป้ายชื่อไว้เพื่อใช้อ้างอิงการจัดเก็บข้อมูล",
                "สายเคเบิลรับส่งข้อมูลอินเทอร์เน็ตความเร็วสูง"
            ],
            correct: 2
        },
        {
            q: "4. ตัวแปร num = 5 + 1 เมื่อผ่านการประมวลผลแล้ว กล่อง num จะเก็บค่าเท่าใด?",
            a: [
                "51",
                "(Recommended) 6",
                "5",
                "1"
            ],
            correct: 1
        },
        {
            q: "5. ตัวดำเนินการ logical operators ข้อใด ทำหน้าที่กลับผลลัพธ์จากจริงเป็นเท็จ และเท็จเป็นจริง?",
            a: [
                "and (&&)",
                "or (||)",
                "(Recommended) not (!)",
                "modulo (%)"
            ],
            correct: 2
        },
        {
            q: "6. แผนภาพแสดงขั้นตอนการทำงานของโปรแกรมโดยใช้รูปทรงสัญลักษณ์สากลเรียกว่าอะไร?",
            a: [
                "PowerPoint Presentation",
                "Microsoft Visio System Layout",
                "Graphic Screen Design Sheet",
                "(Recommended) ผังงาน (Flowchart)"
            ],
            correct: 3
        },
        {
            q: "7. สัญลักษณ์รูปสี่เหลี่ยมขนมเปียกปูน (Decision) ในผังงาน ทำหน้าที่อะไร?",
            a: [
                "แสดงจุดเริ่มต้นและสิ้นสุดของขั้นตอนการทำงานทั้งหมด",
                "(Recommended) การตรวจสอบเงื่อนไขเพื่อตัดสินใจเลือกทางทำงานในขั้นตอนถัดไป",
                "การป้อนข้อมูลตัวเลขผ่านหน้าต่างคีย์บอร์ดโดยตรง",
                "การประมวลผลหรือคำนวณข้อมูลตัวเลข"
            ],
            correct: 1
        },
        {
            q: "8. สัญลักษณ์สากลรูปสี่เหลี่ยมผืนผ้า (Process) ในผังงาน ทำหน้าที่อะไร?",
            a: [
                "รับข้อมูลเข้าทางคีย์บอร์ด",
                "(Recommended) การคำนวณผลหรือการประมวลผลข้อมูล",
                "ใช้ตรวจสอบเงื่อนไขเช็คความจริง",
                "พิมพ์รายละเอียดออกทางกระดาษเอกสาร"
            ],
            correct: 1
        },
        {
            q: "9. เวทีแสดงผล (Stage) ของ Scratch 3.0 มีจุดกึ่งกลางอ้างอิงเป็นพิกัดใด?",
            a: [
                "x=240, y=180",
                "x=-240, y=-180",
                "(Recommended) x=0, y=0",
                "x=100, y=100"
            ],
            correct: 2
        },
        {
            q: "10. หากต้องการให้ตัวละครตรวจเช็คค่าตัวแปร sum เพื่อให้แสดงคำพูด 3 แบบ แตกต่างกันอย่างเป็นเงื่อนไข ควรใช้โครงสร้างแบบใด?",
            a: [
                "โครงสร้างการทำงานแบบลำดับขั้นตรงลงมา (Sequential)",
                "โครงสร้างแบบวนซ้ำวนรอบเดิมไม่รู้จบ (Forever Loop)",
                "โครงสร้างทางเลือกเดียว (Single Selection)",
                "(Recommended) โครงสร้างหลายทางเลือกซ้อนกัน (Multiple Selection)"
            ],
            correct: 3
        },
        {
            q: "11. หากต้องการให้การตรวจสอบเงื่อนไขเป็นจริงเมื่อเงื่อนไขย่อยทั้งสองฝั่งเป็นจริงพร้อมกัน ต้องใช้ตัวดำเนินการตรรกะตัวใด?",
            a: [
                "or (||)",
                "not (!)",
                "(Recommended) and (&&)",
                "modulo (%)"
            ],
            correct: 2
        },
        {
            q: "12. ข้อใดแสดงรูปแบบการเขียนฟังก์ชันแสดงผลลัพธ์ออกหน้าจอในภาษา Python ได้อย่างถูกต้อง?",
            a: [
                "print Hello World",
                "console.log(\"Hello World\")",
                "(Recommended) print(\"Hello World\")",
                "echo \"Hello World\""
            ],
            correct: 2
        },
        {
            q: "13. หากเขียนคำสั่งพิมพ์คำว่า prinnt(\"tigger\") จะเกิดข้อผิดพลาดประเภทใดในภาษา Python?",
            a: [
                "SyntaxError (โครงสร้างภาษาผิดพลาด)",
                "(Recommended) NameError (ชื่อฟังก์ชันหรือตัวแปรไม่เป็นที่รู้จัก)",
                "TypeError (ชนิดข้อมูลไม่ถูกต้อง)",
                "ZeroDivisionError (ตัวหารเป็นศูนย์)"
            ],
            correct: 1
        },
        {
            q: "14. ฟังก์ชัน input() ในภาษา Python ใช้เพื่อวัตถุประสงค์ใด?",
            a: [
                "เพื่อประมวลผลคณิตศาสตร์พื้นฐาน",
                "เพื่อแสดงคำอธิบายความคิดเห็นของโปรแกรม",
                "(Recommended) เพื่อเปิดรับข้อมูลผ่านการพิมพ์คีย์บอร์ดจากผู้ใช้งาน",
                "เพื่อบันทึกไฟล์สคริปต์ลงคอมพิวเตอร์"
            ],
            correct: 2
        },
        {
            q: "15. คำสั่งใดใช้สำหรับทำซ้ำแบบวนรอบตามช่วงตัวเลขที่กำหนดแน่นอน (เช่น วนซ้ำ 5 รอบ) ในภาษา Python?",
            a: [
                "while x < 5:",
                "(Recommended) for i in range(5):",
                "loop forever:",
                "repeat(5):"
            ],
            correct: 1
        },
        {
            q: "16. ในภาษา Python การป้อนคำสั่ง x = int(input()) หมายถึงอะไร?",
            a: [
                "การพิมพ์ข้อมูลจำนวนเต็มออกทางคอนโซล",
                "(Recommended) การรับค่าจากคีย์บอร์ดแล้วแปลงประเภทข้อมูลเป็นจำนวนเต็ม (Integer)",
                "การสุ่มหาเลขจำนวนเต็มระหว่าง 0 ถึง x",
                "การหารหาเศษข้อมูลตัวเลข"
            ],
            correct: 1
        },
        {
            q: "17. โครงสร้างการวนซ้ำแบบ While Loop จะทำงานต่อไปเรื่อยๆ ตราบใดที่เป็นจริงตามเงื่อนไขข้อใด?",
            a: [
                "เงื่อนไขของลูปได้รับการประมวลผลเป็นเท็จ (False)",
                "จำนวนการคำนวณของลูปมีค่ามากกว่า 100 รอบ",
                "(Recommended) เงื่อนไขในการตรวจสอบมีค่าเป็นจริง (True)",
                "ไม่มีการป้อนข้อมูลใดๆ เข้ามาเลย"
            ],
            correct: 2
        },
        {
            q: "18. การประกาศสร้างฟังก์ชันในภาษา Python ต้องเริ่มต้นด้วยคีย์เวิร์ดใด?",
            a: [
                "function",
                "class",
                "void",
                "(Recommended) def"
            ],
            correct: 3
        },
        {
            q: "19. ข้อใดอธิบายความหมายของ คลาส (Class) และ ออบเจกต์ (Object) ในแนวคิด OOP ได้ถูกต้องที่สุด?",
            a: [
                "คลาสคือตัวแปรรูปแบบพิเศษ ออบเจกต์คือกลุ่มตัวเลขดัชนี",
                "(Recommended) คลาสคือพิมพ์เขียวหรือแม่แบบ ส่วนออบเจกต์คือสิ่งของจริงที่สร้างจากแม่แบบนั้น",
                "คลาสคือลูปวนซ้ำแบบ While ออบเจกต์คือชุดเงื่อนไข If-Else",
                "คลาสคือฟังก์ชันออฟไลน์ ออบเจกต์คือฐานข้อมูลภายนอก"
            ],
            correct: 1
        },
        {
            q: "20. การเขียนโปรแกรมแบบ Multi-threading มีประโยชน์หลักอย่างไรในการทำงานของคอมพิวเตอร์?",
            a: [
                "เพื่อเพิ่มความเร็วในการเชื่อมต่ออินเทอร์เน็ต",
                "(Recommended) เพื่อให้โปรแกรมสามารถทำงานหรือประมวลผลหลายงานย่อยไปพร้อมๆ กันได้",
                "เพื่อดักจับและแก้ไขบั๊ก Syntax error อัตโนมัติ",
                "เพื่อประหยัดหน่วยความจำในการรันกราฟิก 3D"
            ],
            correct: 1
        },
        {
            q: "21. ในภาษา Python รายการข้อมูล (List) สร้างด้วยเครื่องหมายใด?",
            a: ["{ }", "(Recommended) [ ]", "( )", "< >"],
            correct: 1
        },
        {
            q: "22. ชนิดข้อมูล String ในภาษา Python หมายถึงอะไร?",
            a: ["ตัวเลขจำนวนเต็ม", "ค่าจริง/เท็จ", "(Recommended) ข้อความตัวอักษร", "รายการข้อมูล"],
            correct: 2
        },
        {
            q: "23. คำสั่ง len(\"Scratch\") ในภาษา Python จะคืนค่าใด?",
            a: ["5", "8", "(Recommended) 7", "6"],
            correct: 2
        },
        {
            q: "24. คีย์เวิร์ด break ในภาษา Python ใช้ทำอะไร?",
            a: ["ข้ามรอบการวนซ้ำนั้น", "(Recommended) หยุดการวนซ้ำทันที", "เริ่มวนซ้ำใหม่", "แสดงผลลัพธ์"],
            correct: 1
        },
        {
            q: "25. สัญลักษณ์ % ในภาษา Python ทำหน้าที่อะไร?",
            a: ["คูณ", "หาร", "ยกกำลัง", "(Recommended) หารเอาเศษ (Modulo)"],
            correct: 3
        },
        {
            q: "26. ใน Scratch บล็อก 'เมื่อคลิกธงเขียว' เปรียบเสมือนสิ่งใดในการเขียนโปรแกรมทั่วไป?",
            a: ["ตัวแปร", "ฟังก์ชัน", "(Recommended) จุดเริ่มต้น (Entry Point)", "เงื่อนไข"],
            correct: 2
        },
        {
            q: "27. หาก x = 10, y = 3 ผลลัพธ์ของ x % y คืออะไร?",
            a: ["3", "(Recommended) 1", "0", "10"],
            correct: 1
        },
        {
            q: "28. ใน Scratch หมวดบล็อก 'การควบคุม' ใช้สำหรับอะไร?",
            a: ["เปลี่ยนสีตัวละคร", "เล่นเสียง", "(Recommended) สร้างเงื่อนไขและลูปวนซ้ำ", "เคลื่อนที่ตัวละคร"],
            correct: 2
        },
        {
            q: "29. Algorithm คืออะไร?",
            a: ["ภาษาโปรแกรมชนิดหนึ่ง", "(Recommended) ขั้นตอนการแก้ปัญหาที่ชัดเจนและเป็นลำดับ", "โปรแกรมสำหรับวาดภาพ", "ชื่อซอฟต์แวร์ของ MIT"],
            correct: 1
        },
        {
            q: "30. ข้อใดเป็น output ที่ถูกต้องของโค้ด Python: print(2 ** 3)",
            a: ["6", "(Recommended) 8", "9", "23"],
            correct: 1
        },
        {
            q: "31. ใน Scratch ค่าพิกัด x เป็นบวกแปลว่าอะไร?",
            a: ["ตัวละครอยู่ด้านล่าง", "ตัวละครอยู่ด้านบน", "ตัวละครอยู่ด้านซ้าย", "(Recommended) ตัวละครอยู่ด้านขวา"],
            correct: 3
        },
        {
            q: "32. การ Debug โปรแกรมหมายถึงอะไร?",
            a: ["การเพิ่มฟีเจอร์ใหม่", "การลบโปรแกรมออก", "(Recommended) การค้นหาและแก้ไขข้อผิดพลาดในโค้ด", "การคอมไพล์โปรแกรม"],
            correct: 2
        },
        {
            q: "33. คำสั่ง print(type(3.14)) จะแสดงผลว่าอะไร?",
            a: ["<class 'int'>", "(Recommended) <class 'float'>", "<class 'str'>", "<class 'bool'>"],
            correct: 1
        },
        {
            q: "34. ในผังงาน สัญลักษณ์วงรี (Oval) แทนความหมายอะไร?",
            a: ["กระบวนการ", "เงื่อนไข", "(Recommended) จุดเริ่มต้นหรือสิ้นสุด", "การแสดงผล"],
            correct: 2
        },
        {
            q: "35. Event-Driven Programming คืออะไร?",
            a: ["โปรแกรมทำงานตามลำดับบนลงล่างเสมอ", "(Recommended) โปรแกรมตอบสนองต่อเหตุการณ์ที่เกิดขึ้น เช่น คลิก กด", "โปรแกรมวนซ้ำตลอดเวลา", "โปรแกรมที่ไม่มีตัวแปร"],
            correct: 1
        },
        {
            q: "36. ใน Python คำสั่ง fruits = ['apple','banana','cherry'] แล้ว fruits[1] คืออะไร?",
            a: ["'apple'", "(Recommended) 'banana'", "'cherry'", "Error"],
            correct: 1
        },
        {
            q: "37. ความต่างระหว่าง for loop กับ while loop คืออะไร?",
            a: [
                "for ใช้กับตัวเลข while ใช้กับข้อความ",
                "(Recommended) for วนซ้ำตามช่วงที่กำหนด while วนซ้ำตามเงื่อนไข",
                "for เร็วกว่า while เสมอ",
                "ไม่มีความต่าง"
            ],
            correct: 1
        },
        {
            q: "38. ใน Scratch บล็อก 'สุ่มตัวเลข 1 ถึง 10' อยู่ในหมวดใด?",
            a: ["การเคลื่อนที่", "ตัวควบคุม", "(Recommended) ตัวดำเนินการ", "เหตุการณ์"],
            correct: 2
        },
        {
            q: "39. Decomposition ในแนวคิด Computational Thinking คืออะไร?",
            a: ["การจดจำรูปแบบที่คล้ายกัน", "(Recommended) การแบ่งปัญหาใหญ่ออกเป็นปัญหาย่อย", "การมองข้ามรายละเอียด", "การเขียนอัลกอริทึม"],
            correct: 1
        },
        {
            q: "40. โปรแกรม Python อ่าน input จาก keyboard แล้วต้องการแปลงเป็นตัวเลขทศนิยม ควรใช้คำสั่งใด?",
            a: ["int(input())", "str(input())", "(Recommended) float(input())", "bool(input())"],
            correct: 2
        }
    ];

    // Active session questions (picked 20 out of 40 bank)
    let currentQuizQuestions = [];
    let currentQuestionIndex = 0;
    let quizScore = 0;
    let selectedAnswers = [];
    let quizMode = 'pre'; // 'pre' or 'post'

    const btnStartPreQuiz = document.getElementById('btn-start-pre-quiz');
    const btnStartPostQuiz = document.getElementById('btn-start-post-quiz');
    const RUBRIC_QUESTIONS = {
        sequencing: [
            {
                q: "🐞 ภารกิจดีบัค 1/3: เรียงลำดับคำสั่งรับค่าชื่อและการทักทายให้ถูกต้อง (ปัจจุบันโค้ดทักทายก่อนรับค่าชื่อ)",
                buggyCode: `print("สวัสดีคุณ " + name)\nname = input("กรุณากรอกชื่อ: ")`,
                hint: "💡 คำแนะนำ: ต้องรับค่าด้วย input(...) ในบรรทัดแรกก่อน แล้วค่อย print(...) ในบรรทัดที่สอง",
                check: function(code) {
                    const clean = code.replace(/\s+/g, ' ');
                    const inputIdx = clean.indexOf('input');
                    const printIdx = clean.indexOf('print');
                    return inputIdx !== -1 && printIdx !== -1 && inputIdx < printIdx;
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 2/3: เรียงลำดับการกำหนดตัวแปรและการคำนวณผลรวมให้ถูกต้อง (ปัจจุบันพิมพ์ผลรวมก่อนกำหนดค่า)",
                buggyCode: `print("ผลรวม:", total)\nx = 10\ny = 20\ntotal = x + y`,
                hint: "💡 คำแนะนำ: ต้องกำหนด x และ y ก่อน จากนั้นคำนวณ total = x + y แล้วค่อย print ท้ายสุด",
                check: function(code) {
                    const clean = code.replace(/\s+/g, ' ');
                    const defIdx = clean.indexOf('total =');
                    const printIdx = clean.indexOf('print');
                    return defIdx !== -1 && printIdx !== -1 && defIdx < printIdx;
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 3/3: เรียงลำดับการคำนวณพื้นที่สี่เหลี่ยมและการพิมพ์ผลลัพธ์ให้ถูกต้อง",
                buggyCode: `print("พื้นที่:", area)\nwidth = 5\nheight = 10\narea = width * height`,
                hint: "💡 คำแนะนำ: ต้องสร้างตัวแปร width, height และคำนวณ area ให้เสร็จก่อนแสดงผล print",
                check: function(code) {
                    const clean = code.replace(/\s+/g, ' ');
                    const areaIdx = clean.indexOf('area =');
                    const printIdx = clean.indexOf('print');
                    return areaIdx !== -1 && printIdx !== -1 && areaIdx < printIdx;
                }
            }
        ],
        loops: [
            {
                q: "🐞 ภารกิจดีบัค 1/3: แก้ไขขอบเขตช่วงการวนลูปให้พิมพ์ตัวเลข 1 ถึง 5 (ปัจจุบันลูปทำงานแค่ 1 ถึง 4)",
                buggyCode: `for i in range(1, 5):\n    print(i)`,
                hint: "💡 คำแนะนำ: range(1, 5) จะหยุดก่อนเลข 5 ต้องเปลี่ยนตัวเลขหยุดเป็น 6 (range(1, 6))",
                check: function(code) {
                    return /range\(\s*1\s*,\s*6\s*\)/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 2/3: เพิ่มการบวกค่าตัวนับ count ใน while loop ป้องกันลูปไม่สิ้นสุด (Infinite Loop)",
                buggyCode: `count = 1\nwhile count <= 3:\n    print("รอบที่", count)`,
                hint: "💡 คำแนะนำ: ในลูปขณะที่ (while) ต้องเพิ่มค่า count = count + 1 หรือ count += 1 ท้ายลูปเสมอ",
                check: function(code) {
                    return /count\s*=\s*count\s*\+\s*1|count\s*\+=\s*1/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 3/3: แก้ไขการสะสมค่าผลรวมในลูป (ปัจจุบันสะสมผิดเป็นแทนที่ค่าเดิม total = i)",
                buggyCode: `total = 0\nfor i in range(1, 6):\n    total = i\nprint(total)`,
                hint: "💡 คำแนะนำ: การสะสมค่าต้องใช้ total = total + i หรือ total += i",
                check: function(code) {
                    return /total\s*=\s*total\s*\+\s*i|total\s*\+=\s*i/.test(code);
                }
            }
        ],
        coordinates: [
            {
                q: "🐞 ภารกิจดีบัค 1/3: แก้ไขโค้ดย้ายตำแหน่งตัวละครไปทางขวา 50 หน่วย (ปัจจุบันโค้ดไปเพิ่มแกน y ผิดแกน)",
                buggyCode: `x = 100\ny = 100\ny = y + 50`,
                hint: "💡 คำแนะนำ: การย้ายไปทางขวา ต้องเพิ่มค่าแกน x แทนแกน y (x = x + 50)",
                check: function(code) {
                    return /\bx\s*=\s*x\s*\+\s*50\b|\bx\s*\+=\s*50\b/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 2/3: แก้ไขโค้ดย้ายตำแหน่งตัวละครขึ้นด้านบน 30 หน่วย (ปัจจุบันไปลบค่า y)",
                buggyCode: `x = 0\ny = 100\ny = y - 30`,
                hint: "💡 คำแนะนำ: การเคลื่อนที่ขึ้นด้านบน ต้องเพิ่มค่าแกน y (y = y + 30)",
                check: function(code) {
                    return /\by\s*=\s*y\s*\+\s*30\b|\by\s*\+=\s*30\b/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 3/3: แก้ไขการตั้งค่าพิกัดเริ่มต้นย้อนกลับมาที่จุดศูนย์กลาง (0, 0) บนเวที",
                buggyCode: `x = 100\ny = -50`,
                hint: "💡 คำแนะนำ: จุดศูนย์กลางของเวทีคือพิกัด x = 0 และ y = 0",
                check: function(code) {
                    return /x\s*=\s*0/.test(code) && /y\s*=\s*0/.test(code);
                }
            }
        ],
        events: [
            {
                q: "🐞 ภารกิจดีบัค 1/3: แปลงค่าอายุที่รับจาก input() เป็น int() เพื่อให้นำไปคำนวณปีหน้าได้",
                buggyCode: `age = input("กรุณากรอกอายุ: ")\nnext_age = age + 1\nprint(next_age)`,
                hint: "💡 คำแนะนำ: ต้องใช้ int(input(...)) หรือ int(age) เพื่อแปลงข้อความเป็นตัวเลขก่อนบวก 1",
                check: function(code) {
                    return /int\s*\(\s*(input|age)/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 2/3: แปลงค่าราคาสินค้าที่เป็นทศนิยมจาก input() ด้วย float() เพื่อนำไปคำนวณภาษี",
                buggyCode: `price = input("ราคาสินค้า: ")\ntotal = price * 1.07\nprint(total)`,
                hint: "💡 คำแนะนำ: ใช้ float(input(...)) หรือ float(price) สำหรับแปลงตัวเลขทศนิยม",
                check: function(code) {
                    return /float\s*\(\s*(input|price)/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 3/3: เติมข้อความระบุคำถามภายในฟังก์ชัน input() เพื่อแจ้งผู้ใช้",
                buggyCode: `name = input()\nprint("สวัสดี", name)`,
                hint: "💡 คำแนะนำ: เติมข้อความในวงเล็บ input เช่น input(\"กรุณากรอกชื่อ: \")",
                check: function(code) {
                    return /input\s*\(\s*["'].+?["']\s*\)/.test(code);
                }
            }
        ],
        conditions: [
            {
                q: "🐞 ภารกิจดีบัค 1/3: แก้ไขเงื่อนไขผ่านเกณฑ์ (คะแนนตั้งแต่ 50 ขึ้นไปถือว่าผ่าน) ปัจจุบันคนได้ 50 คะแนนสอบตก",
                buggyCode: `score = 50\nif score > 50:\n    print("ผ่าน")\nelse:\n    print("ตก")`,
                hint: "💡 คำแนะนำ: คะแนนตั้งแต่ 50 ขึ้นไป ต้องใช้เครื่องหมายเปรียบเทียบ >= 50",
                check: function(code) {
                    return /score\s*>=\s*50/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 2/3: แก้ไขเครื่องหมายเปรียบเทียบความเท่ากันในเงื่อนไข if (ปัจจุบันใช้ = กำหนดค่าผิดไวยากรณ์)",
                buggyCode: `status = "online"\nif status = "online":\n    print("เชื่อมต่อแล้ว")`,
                hint: "💡 คำแนะนำ: การเปรียบเทียบเท่ากันใน Python ต้องใช้ == สองตัว (status == \"online\")",
                check: function(code) {
                    return /status\s*==\s*["']online["']/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 3/3: เรียงลำดับเงื่อนไขการตัดเกรด A (>= 80) และ B (>= 70) ให้ถูกต้อง",
                buggyCode: `score = 85\nif score >= 70:\n    print("B")\nelif score >= 80:\n    print("A")`,
                hint: "💡 คำแนะนำ: ต้องเช็คคะแนนสูง (>= 80) ก่อนคะแนนต่ำ (>= 70)",
                check: function(code) {
                    const clean = code.replace(/\s+/g, ' ');
                    const idx80 = clean.indexOf('80');
                    const idx70 = clean.indexOf('70');
                    return idx80 !== -1 && idx70 !== -1 && idx80 < idx70;
                }
            }
        ],
        operators: [
            {
                q: "🐞 ภารกิจดีบัค 1/3: แก้ไขตัวดำเนินการเพื่อเช็คเลขคู่ (หาร 2 เหลือเศษ 0) ปัจจุบันใช้ / หารธรรมดา",
                buggyCode: `num = 8\nif num / 2 == 0:\n    print("เลขคู่")`,
                hint: "💡 คำแนะนำ: การหาเศษเหลือจากการหาร ต้องใช้ตัวดำเนินการมอดุโล % 2 == 0",
                check: function(code) {
                    return /num\s*%\s*2\s*==\s*0/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 2/3: ใส่วงเล็บจัดลำดับการคำนวณให้บวกกันก่อนแล้วค่อยคูณ (ต้องการผลลัพธ์ (10 + 5) * 2 = 30)",
                buggyCode: `ans = 10 + 5 * 2\nprint(ans)`,
                hint: "💡 คำแนะนำ: ใส่ วงเล็บ (10 + 5) เพื่อให้บวกกันก่อนคูณ 2",
                check: function(code) {
                    return /\(\s*10\s*\+\s*5\s*\)\s*\*\s*2/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 3/3: แก้ไขเครื่องหมายคำนวณเลขยกกำลัง 2 ยกกำลัง 3 (ต้องการผลลัพธ์ 8)",
                buggyCode: `ans = 2 ^ 3\nprint(ans)`,
                hint: "💡 คำแนะนำ: เครื่องหมายยกกำลังใน Python คือ ** (2 ** 3)",
                check: function(code) {
                    return /2\s*\*\*\s*3/.test(code);
                }
            }
        ],
        variables: [
            {
                q: "🐞 ภารกิจดีบัค 1/3: แก้ไขการสะกดชื่อตัวแปรสะสมคะแนนให้ถูกต้อง (ปัจจุบันสะกดเป็น socre)",
                buggyCode: `score = 10\nsocre = score + 5\nprint(score)`,
                hint: "💡 คำแนะนำ: ตัวแปรสะสมคะแนนต้องสะกดให้ตรงกันคือ score = score + 5",
                check: function(code) {
                    return (/\bscore\s*=\s*score\s*\+\s*5\b/.test(code) || /\bscore\s*\+=\s*5\b/.test(code)) && !/socre/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 2/3: เพิ่มข้อมูลใหม่เข้าลิสต์ด้วยคำสั่ง append() (ปัจจุบันไปเขียนทับลิสต์เดิม)",
                buggyCode: `colors = ["red", "green"]\ncolors = "blue"\nprint(colors)`,
                hint: "💡 คำแนะนำ: ใช้คำสั่ง colors.append(\"blue\") เพื่อเพิ่มสมาชิกใหม่เข้าลิสต์",
                check: function(code) {
                    return /colors\.append\(\s*["']blue["']\s*\)/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 3/3: แก้ไขดัชนีเข้าถึงสมาชิกตัวแรกในลิสต์ (ใน Python เริ่มต้นที่ดัชนี 0)",
                buggyCode: `items = ["Apple", "Banana"]\nfirst = items[1]\nprint(first)`,
                hint: "💡 คำแนะนำ: สมาชิกตัวแรกสุดของลิสต์อยู่ในตำแหน่งดัชนี 0 (items[0])",
                check: function(code) {
                    return /items\[\s*0\s*\]/.test(code);
                }
            }
        ],
        functions: [
            {
                q: "🐞 ภารกิจดีบัค 1/3: เติมคำสั่ง return ส่งคืนค่าผลลัพธ์ภาษีในฟังก์ชัน calc_tax",
                buggyCode: `def calc_tax(price):\n    tax = price * 0.07\n\ntotal = calc_tax(100)\nprint(total)`,
                hint: "💡 คำแนะนำ: ท้ายฟังก์ชันต้องมีคำสั่ง return tax เพื่อส่งคืนค่าผลลัพธ์การคำนวณ",
                check: function(code) {
                    return /return\s+tax/.test(code) || /return\s+price\s*\*\s*0\.07/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 2/3: เติมพารามิเตอร์รับค่าชื่อในนิยามฟังก์ชัน def greet(name):",
                buggyCode: `def greet():\n    print("สวัสดีคุณ " + name)\n\ngreet("สมชาย")`,
                hint: "💡 คำแนะนำ: เพิ่มพารามิเตอร์ name ในวงเล็บหัวฟังก์ชัน def greet(name):",
                check: function(code) {
                    return /def\s+greet\(\s*name\s*\):/.test(code);
                }
            },
            {
                q: "🐞 ภารกิจดีบัค 3/3: เรียกใช้งานฟังก์ชันที่สร้างขึ้นให้ถูกไวยากรณ์ (ไม่ใช้คำสั่ง call หรือ run)",
                buggyCode: `def add(a, b):\n    return a + b\n\nans = call add(3, 5)\nprint(ans)`,
                hint: "💡 คำแนะนำ: ใน Python การเรียกใช้ฟังก์ชันทำได้เลยโดยเขียน add(3, 5) ไม่ต้องใส่ call",
                check: function(code) {
                    return /ans\s*=\s*add\(\s*3\s*,\s*5\s*\)/.test(code) && !/call/.test(code);
                }
            }
        ]
    };

    // ── Rubric Modal HTML (injected once) ─────────────────────────────────────
    const rubricModal = document.createElement('div');
    rubricModal.id = 'rubric-quiz-modal';
    rubricModal.style.cssText = `
        display:none; position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,0.82); backdrop-filter:blur(6px);
        align-items:center; justify-content:center; padding:16px;
    `;
    document.body.appendChild(rubricModal);

    function resetRubricModalHTML() {
        rubricModal.innerHTML = `
            <div style="background:linear-gradient(145deg,#0f172a,#1e293b); border:1px solid rgba(255,255,255,0.1);
                        border-radius:20px; padding:28px; max-width:620px; width:100%; position:relative;
                        box-shadow:0 25px 60px rgba(0,0,0,0.6); font-family:var(--font-headers);">
                <button id="rubric-modal-close" style="position:absolute;top:14px;right:16px;background:none;border:none;
                    color:rgba(255,255,255,0.4);font-size:20px;cursor:pointer;">✕</button>
                <div style="margin-bottom:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div id="rq-topic-badge" style="display:inline-block;padding:4px 12px;border-radius:20px;
                            font-size:11px;font-weight:700;font-family:var(--font-headers);"></div>
                        <span style="font-size:12px; color:#fb923c; font-weight:600;" id="rq-task-progress-label">
                            <i class="fa-solid fa-bug"></i> ภารกิจดีบัคข้อที่ 1 จาก 3
                        </span>
                    </div>

                    <!-- Progress Bar for 3 Tasks -->
                    <div style="height:6px; background:rgba(255,255,255,0.08); border-radius:4px; margin-bottom:14px; overflow:hidden;">
                        <div id="rq-progress-bar" style="height:100%; width:33%; background:linear-gradient(90deg, #fb923c, #34d399); border-radius:4px; transition:width 0.3s;"></div>
                    </div>

                    <h3 id="rq-question" style="font-size:14px;color:white;line-height:1.5;margin:0 0 14px 0; background:rgba(255,255,255,0.03); padding:12px 16px; border-radius:10px; border-left:4px solid #fb923c;"></h3>
                    
                    <!-- Interactive Code Editor Box -->
                    <div style="margin-bottom:12px;">
                        <div style="font-size:11px; color:var(--text-muted); margin-bottom:4px; display:flex; justify-content:space-between;">
                            <span><i class="fa-solid fa-code"></i> แก้ไขโค้ดที่ถูกต้องตรงนี้:</span>
                            <span id="rq-hint-toggle" style="color:#60a5fa; cursor:pointer;"><i class="fa-solid fa-lightbulb"></i> ดูคำใบ้</span>
                        </div>
                        <div id="rq-hint-box" style="display:none; font-size:12px; color:#93c5fd; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.3); padding:8px 12px; border-radius:8px; margin-bottom:8px;"></div>
                        <textarea id="rq-code-editor" style="width:100%; height:130px; background:#05070a; color:#f8fafc; font-family:'Fira Code', monospace; font-size:13px; padding:12px; border:1px solid rgba(255,255,255,0.15); border-radius:10px; box-sizing:border-box; outline:none; resize:none;"></textarea>
                    </div>
                </div>
                <div id="rq-feedback" style="display:none;padding:10px 14px;border-radius:10px;font-size:13px;margin-bottom:14px;"></div>
                <div style="display:flex;justify-content:space-between; align-items:center;">
                    <button id="rq-check-btn" style="background:#3b82f6;color:white;border:none;padding:10px 20px;
                        border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
                        🧪 ทดสอบดีบัคโค้ด
                    </button>
                    <button id="rq-next-btn" disabled style="background:#34d399;color:#1a1a1a;border:none;padding:10px 24px;
                        border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;opacity:0.5;transition:opacity .2s;">
                        ภารกิจถัดไป ➔
                    </button>
                </div>
            </div>
        `;

        document.getElementById('rq-hint-toggle').addEventListener('click', () => {
            const hBox = document.getElementById('rq-hint-box');
            if (hBox) hBox.style.display = hBox.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('rq-check-btn').addEventListener('click', () => {
            checkRubricDebugTask();
        });

        document.getElementById('rq-next-btn').addEventListener('click', () => {
            advanceRubricDebugTask();
        });

        document.getElementById('rubric-modal-close').addEventListener('click', () => {
            rubricModal.style.display = 'none';
        });
    }

    // Initialize modal structure
    resetRubricModalHTML();

    // ── Rubric Quiz State ─────────────────────────────────────────────────────
    let rqTopicKey = '';
    let rqQuestions = [];
    let rqIndex = 0;

    window.openRubricQuiz = function(topicKey) {
        resetRubricModalHTML();
        rqTopicKey = topicKey;
        rqQuestions = RUBRIC_QUESTIONS[topicKey] || [];
        rqIndex = 0;
        rubricModal.style.display = 'flex';
        renderRubricQuestion();
    };

    function renderRubricQuestion() {
        const skill = RUBRIC_SKILLS.find(s => s.key === rqTopicKey);
        const qData = rqQuestions[rqIndex];

        if (!qData) return;

        // Badge
        const badge = document.getElementById('rq-topic-badge');
        badge.textContent = skill ? skill.label : rqTopicKey;
        badge.style.background = skill ? skill.color + '22' : '#fb923c22';
        badge.style.color = skill ? skill.color : '#fb923c';
        badge.style.border = `1px solid ${skill ? skill.color + '55' : '#fb923c55'}`;

        const taskLabel = document.getElementById('rq-task-progress-label');
        if (taskLabel) taskLabel.innerHTML = `<i class="fa-solid fa-bug"></i> ภารกิจดีบัคข้อที่ ${rqIndex + 1} จาก 3`;

        const progressBar = document.getElementById('rq-progress-bar');
        if (progressBar) progressBar.style.width = `${((rqIndex + 1) / 3) * 100}%`;

        document.getElementById('rq-question').textContent = qData.q;
        document.getElementById('rq-hint-box').textContent = qData.hint;
        document.getElementById('rq-code-editor').value = qData.buggyCode;
        document.getElementById('rq-feedback').style.display = 'none';

        const nextBtn = document.getElementById('rq-next-btn');
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.textContent = rqIndex < 2 ? `ภารกิจถัดไป (ข้อ ${rqIndex + 2}/3) ➔` : 'เสร็จสิ้นการประเมิน 🏆';
    }

    function checkRubricDebugTask() {
        const qData = rqQuestions[rqIndex];
        const code = document.getElementById('rq-code-editor').value;
        const fb = document.getElementById('rq-feedback');
        const nextBtn = document.getElementById('rq-next-btn');

        fb.style.display = 'block';
        if (qData && typeof qData.check === 'function' && qData.check(code)) {
            // Earn +1 star for passing this task level
            const curLevel = parseInt(localStorage.getItem('rubric_debug_level_' + rqTopicKey) || '0', 10);
            const newLevel = Math.max(curLevel, rqIndex + 1);
            localStorage.setItem('rubric_debug_level_' + rqTopicKey, String(newLevel));
            localStorage.setItem('rubric_quiz_completed_' + rqTopicKey, newLevel >= 3 ? 'true' : 'false');

            if (window.playCodeSound) window.playCodeSound('success');
            fb.style.background = 'rgba(52,211,153,0.15)';
            fb.style.border = '1px solid #34d399';
            fb.style.color = '#34d399';
            fb.innerHTML = `<i class="fa-solid fa-circle-check"></i> 🎉 แก้ไขบัคภารกิจนี้สำเร็จ! ได้รับดาวเพิ่มเป็น <strong>${newLevel}/3 ดาว ⭐</strong>`;

            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';

            // Sync to Cloud
            if (typeof window.syncProgressToCloud === 'function') window.syncProgressToCloud();
        } else {
            if (window.playCodeSound) window.playCodeSound('error');
            fb.style.background = 'rgba(248,113,113,0.15)';
            fb.style.border = '1px solid #f87171';
            fb.style.color = '#f87171';
            fb.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ⚠️ โค้ดยังไม่ถูกต้อง กรุณาตรวจสอบหรือกดดูคำใบ้แล้วลองอีกครั้งครับ';
        }
    }

    function advanceRubricDebugTask() {
        rqIndex++;
        if (rqIndex < 3) {
            renderRubricQuestion();
        } else {
            finishRubricQuiz();
        }
    }

    function finishRubricQuiz() {
        const finalStars = parseInt(localStorage.getItem('rubric_debug_level_' + rqTopicKey) || '0', 10);
        const skill = RUBRIC_SKILLS.find(s => s.key === rqTopicKey);
        const color = skill ? skill.color : '#fb923c';

        document.querySelector('#rubric-quiz-modal > div').innerHTML = `
            <div style="text-align:center;padding:20px 0;">
                <div style="font-size:52px;margin-bottom:16px;">${finalStars > 0 ? '🏆' : '📚'}</div>
                <h2 style="color:${color};font-size:20px;margin-bottom:8px;">
                    ${finalStars === 3 ? 'ผ่านการประเมินระดับสูงสุด!' : 'สรุปผลการประเมินดีบัค'}
                </h2>
                <p style="font-size:15px;color:white;margin-bottom:16px;">
                    คุณได้รับดาวในทักษะ <strong>${skill ? skill.label : ''}</strong> จำนวน <strong style="color:#fbbf24; font-size:20px;">${finalStars}/3 ดาว ⭐</strong>
                </p>
                <p style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:24px;">
                    ${finalStars === 3 ? '🎉 คุณสั่งสมดาวครบ 3 ดาวเต็มเรียบร้อยแล้ว ยอดเยี่ยมมาก!' : 'ลองทำภารกิจดีบัคอีกครั้งเพื่อสะสมดาวให้ครบ 3 ดาว'}
                </p>
                <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                    <button onclick="document.getElementById('rubric-quiz-modal').style.display='none'; renderMyRubricProfile();"
                        style="background:${color};color:#1a1a1a;border:none;padding:10px 24px;border-radius:8px;
                        font-size:13px;font-weight:700;cursor:pointer;">
                        ตกลง <i class="fa-solid fa-check"></i>
                    </button>
                </div>
            </div>
        `;
        if (typeof window.renderMyRubricProfile === 'function') window.renderMyRubricProfile();
    }

    const preTestScoreVal = document.getElementById('pre-test-score-val');
    const postTestScoreVal = document.getElementById('post-test-score-val');

    const quizStartScreen = document.getElementById('quiz-start-screen');
    const quizPlayScreen = document.getElementById('quiz-play-screen');
    const quizScoreScreen = document.getElementById('quiz-score-screen');
    const currentQNum = document.getElementById('current-q-num');
    const quizProgressFill = document.getElementById('quiz-progress-fill');
    const questionText = document.getElementById('question-text');
    const optionsBox = document.getElementById('options-box');
    const btnPrevQ = document.getElementById('btn-prev-q');
    const btnNextQ = document.getElementById('btn-next-q');
    const scoreCircleStroke = document.getElementById('score-circle-stroke');
    const scorePercentVal = document.getElementById('score-percent-val');
    const scoreTitle = document.getElementById('score-title');
    const scoreSubtitle = document.getElementById('score-subtitle');
    const certFormBox = document.getElementById('cert-form-box');
    const btnRetryQuiz = document.getElementById('btn-retry-quiz');
    const btnGoBackHome = document.getElementById('btn-go-back-home');

    const certUnlockBox = document.getElementById('cert-unlock-box');
    const certStudentNameInput = document.getElementById('cert-student-name');
    const btnGenerateCert = document.getElementById('btn-generate-cert');
    const certModal = document.getElementById('cert-modal');
    const btnCloseCertModal = document.getElementById('btn-close-cert-modal');
    const btnPrintCert = document.getElementById('btn-print-cert');
    
    const certDisplayName = document.getElementById('cert-display-name');
    const certDisplayDate = document.getElementById('cert-display-date');
    const certDisplayScore = document.getElementById('cert-display-score');
    
    const analyticsGainBox = document.getElementById('analytics-gain-box');
    const learningGainPercent = document.getElementById('learning-gain-percent');

    function displayScores() {
        const preScore = localStorage.getItem('scratch_pre_test_score');
        const postScore = localStorage.getItem('scratch_post_test_score');
        
        if (preTestScoreVal) {
            preTestScoreVal.textContent = preScore !== null ? `${preScore} / 20` : 'ยังไม่ได้ทำ';
        }
        if (postTestScoreVal) {
            postTestScoreVal.textContent = postScore !== null ? `${postScore} / 20` : 'ยังไม่ได้ทำ';
        }

        if (preScore !== null && postScore !== null) {
            const pre = parseInt(preScore);
            const post = parseInt(postScore);
            let gain = 0;
            if (post >= pre) {
                gain = (20 - pre) > 0 ? ((post - pre) / (20 - pre)) * 100 : 100;
                if (learningGainPercent) {
                    learningGainPercent.textContent = "+" + gain.toFixed(1) + "%";
                    learningGainPercent.style.color = "#34d399";
                }
            } else {
                gain = pre > 0 ? ((post - pre) / pre) * 100 : 0;
                if (learningGainPercent) {
                    learningGainPercent.textContent = gain.toFixed(1) + "%";
                    learningGainPercent.style.color = "#f87171";
                }
            }
            if (analyticsGainBox) analyticsGainBox.style.display = 'block';
        } else {
            if (analyticsGainBox) analyticsGainBox.style.display = 'none';
        }

        if (postScore !== null && parseInt(postScore) >= 14) {
            if (certUnlockBox) certUnlockBox.style.display = 'block';
        } else {
            if (certUnlockBox) certUnlockBox.style.display = 'none';
        }
    }

    function loadLeaderboard() {
        const leaderboardBody = document.getElementById('leaderboard-body');
        if (!leaderboardBody) return;
        
        if (!window.firebaseDB) {
            leaderboardBody.innerHTML = '<tr><td colspan="13" style="text-align: center; color: var(--text-muted); padding: 16px;"><i class="fa-solid fa-spinner fa-spin"></i> กำลังเชื่อมต่อกับระบบคลาวด์จัดอันดับ...</td></tr>';
            // Retry in 1 second if firebase is loading
            setTimeout(loadLeaderboard, 1000);
            return;
        }
        
        // Use class-specific path if logged in
        const classCode = localStorage.getItem('scratch_class_code');
        const firebasePath = classCode ? `students/${classCode}` : 'students';

        leaderboardBody.innerHTML = '<tr><td colspan="13" style="text-align: center; color: var(--text-muted); padding: 16px;"><i class="fa-solid fa-spinner fa-spin"></i> กำลังดาวน์โหลดคะแนนห้องเรียนจากฐานข้อมูล...</td></tr>';
        
        // Setup Realtime value listener on class-specific path
        window.firebaseDB.ref(firebasePath).on('value', (snapshot) => {
            const rawData = snapshot.val() || {};
            const studentsList = [];
            
            Object.keys(rawData).forEach(key => {
                const entry = rawData[key];
                if (entry && typeof entry === 'object' && entry.name) {
                    studentsList.push(entry);
                }
            });
            
            // Calculate Classroom Averages
            let totalPre = 0, countPre = 0;
            let totalPost = 0, countPost = 0;
            let totalGain = 0, countGain = 0;
            
            studentsList.forEach(student => {
                if (student.preScore !== null && student.preScore !== undefined) {
                    totalPre += parseInt(student.preScore);
                    countPre++;
                }
                if (student.postScore !== null && student.postScore !== undefined) {
                    totalPost += parseInt(student.postScore);
                    countPost++;
                }
                if (student.preScore !== null && student.preScore !== undefined && 
                    student.postScore !== null && student.postScore !== undefined) {
                    totalGain += calculateGain(student.preScore, student.postScore);
                    countGain++;
                }
            });
            
            const avgPreEl = document.getElementById('class-avg-pre');
            const avgPostEl = document.getElementById('class-avg-post');
            const avgGainEl = document.getElementById('class-avg-gain');
            
            if (avgPreEl) avgPreEl.textContent = countPre > 0 ? `${(totalPre / countPre).toFixed(1)} / 20` : '- / 20';
            if (avgPostEl) avgPostEl.textContent = countPost > 0 ? `${(totalPost / countPost).toFixed(1)} / 20` : '- / 20';
            if (avgGainEl) avgGainEl.textContent = countGain > 0 ? `${(totalGain / countGain).toFixed(1)}%` : '- %';

            leaderboardBody.innerHTML = '';
            if (studentsList.length === 0) {
                leaderboardBody.innerHTML = '<tr><td colspan="15" style="text-align: center; color: var(--text-muted); padding: 16px;">ยังไม่มีข้อมูลผลคะแนนของเพื่อนร่วมห้องในขณะนี้</td></tr>';
                return;
            }
            
            // Save for CSV export
            window.currentLeaderboardData = studentsList;
            
            // Calculate total rubric stars for sorting
            const getTotalRubric = (student) => {
                if (!student.rubrics) return 0;
                let sum = 0;
                Object.values(student.rubrics).forEach(val => sum += (val || 0));
                return sum;
            };

            // Sort by postScore descending, then preScore, then gain descending, then rubric sum, then name
            studentsList.sort((a, b) => {
                const aPost = (a.postScore !== null && a.postScore !== undefined) ? parseInt(a.postScore) : -1;
                const bPost = (b.postScore !== null && b.postScore !== undefined) ? parseInt(b.postScore) : -1;
                if (bPost !== aPost) return bPost - aPost;
                
                const aPre = (a.preScore !== null && a.preScore !== undefined) ? parseInt(a.preScore) : -1;
                const bPre = (b.preScore !== null && b.preScore !== undefined) ? parseInt(b.preScore) : -1;
                if (bPre !== aPre) return bPre - aPre;
                
                const aGain = calculateGain(a.preScore, a.postScore);
                const bGain = calculateGain(b.preScore, b.postScore);
                if (bGain !== aGain) return bGain - aGain;

                const aRubric = getTotalRubric(a);
                const bRubric = getTotalRubric(b);
                if (bRubric !== aRubric) return bRubric - aRubric;

                return (a.name || '').localeCompare(b.name || '', 'th');
            });
            
            // Helper to render stars with number score
            const renderStars = (level) => {
                const lvl = level || 0;
                if (lvl <= 0) return '<span style="color: #475569; font-size: 12px; font-weight: bold;">0</span>';
                if (lvl === 1) return '<span style="color: #64748b; font-size: 12px; font-weight: bold;">1 <span style="font-size: 10px;">⭐</span></span>';
                if (lvl === 2) return '<span style="color: #eab308; font-size: 12px; font-weight: bold;">2 <span style="font-size: 10px;">⭐⭐</span></span>';
                return '<span style="color: #f97316; font-size: 12px; font-weight: bold;">3 <span style="font-size: 10px;">⭐⭐⭐</span></span>';
            };
            
            studentsList.forEach((student, index) => {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                
                const rank = index + 1;
                let rankBadge = rank;
                if (rank === 1) rankBadge = '🥇';
                else if (rank === 2) rankBadge = '🥈';
                else if (rank === 3) rankBadge = '🥉';
                
                const preVal = student.preScore !== null && student.preScore !== undefined ? `${student.preScore} / 20` : 'ยังไม่ได้ทำ';
                const postVal = student.postScore !== null && student.postScore !== undefined ? `${student.postScore} / 20` : 'ยังไม่ได้ทำ';
                
                let gainStr = '-';
                if (student.preScore !== null && student.preScore !== undefined && 
                    student.postScore !== null && student.postScore !== undefined) {
                    const gain = calculateGain(student.preScore, student.postScore);
                    gainStr = `<span style="color: #34d399; font-weight: bold; font-family: monospace;">+${gain.toFixed(1)}%</span>`;
                }
                
                const rub = student.rubrics || {};
                
                row.innerHTML = `
                    <td style="padding: 10px 8px; font-weight: bold; font-size: 12px;">${rankBadge}</td>
                    <td style="padding: 10px 8px; color: white; font-weight: 500; font-size: 12px;">
                        <i class="fa-solid fa-user-ninja" style="color: var(--primary-orange); margin-right: 6px; font-size: 10px;"></i> ${student.name}
                    </td>
                    <td style="padding: 10px 4px; text-align: center; color: #38bdf8; font-size: 12px;">${preVal}</td>
                    <td style="padding: 10px 4px; text-align: center; color: #34d399; font-size: 12px;">${postVal}</td>
                    <td style="padding: 10px 4px; text-align: center; font-size: 12px;">${gainStr}</td>
                    <!-- 8 Rubrics Columns -->
                    <td style="padding: 10px 4px; text-align: center;">${renderStars(rub.sequencing)}</td>
                    <td style="padding: 10px 4px; text-align: center;">${renderStars(rub.loops)}</td>
                    <td style="padding: 10px 4px; text-align: center;">${renderStars(rub.coordinates)}</td>
                    <td style="padding: 10px 4px; text-align: center;">${renderStars(rub.events)}</td>
                    <td style="padding: 10px 4px; text-align: center;">${renderStars(rub.conditions)}</td>
                    <td style="padding: 10px 4px; text-align: center;">${renderStars(rub.operators)}</td>
                    <td style="padding: 10px 4px; text-align: center;">${renderStars(rub.variables)}</td>
                    <td style="padding: 10px 4px; text-align: center;">${renderStars(rub.functions)}</td>
                    <td style="padding: 10px 4px; text-align: center; font-weight: bold; color: #e2e8f0; font-size: 13px; background: rgba(255,255,255,0.02);">${getTotalRubric(student)}</td>
                    <td style="padding: 10px 4px; text-align: center; font-weight: bold; color: #34d399; font-size: 13px; background: rgba(52,211,153,0.05);">${((getTotalRubric(student) / 24) * 100).toFixed(1)}%</td>
                `;
                leaderboardBody.appendChild(row);
            });
        }, (err) => {
            console.error("Firebase read failed:", err);
            leaderboardBody.innerHTML = '<tr><td colspan="13" style="text-align: center; color: #f87171; padding: 16px;"><i class="fa-solid fa-triangle-exclamation"></i> ไม่สามารถดึงข้อมูลได้ (การดึงข้อมูลจากระบบคลาวด์ขัดข้อง)</td></tr>';
        });
    }
    // Expose so db-sync.js can refresh the leaderboard after cloud sync/restore
    window.loadLeaderboard = loadLeaderboard;

    function calculateGain(pre, post) {
        if (pre === null || post === null) return 0;
        const diff = 20 - pre;
        if (post >= pre) {
            return diff > 0 ? ((post - pre) / diff) * 100 : 100;
        } else {
            return pre > 0 ? ((post - pre) / pre) * 100 : 0;
        }
    }

    function shuffleAndPick(bank, n) {
        const shuffled = bank.slice().sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(n, shuffled.length));
    }

    function startQuiz(mode) {
        quizMode = mode || 'pre';
        currentQuizQuestions = shuffleAndPick(quizQuestions, 20);
        currentQuestionIndex = 0;
        quizScore = 0;
        selectedAnswers = Array(currentQuizQuestions.length).fill(null);

        quizStartScreen.style.display = 'none';
        quizScoreScreen.style.display = 'none';
        quizPlayScreen.style.display = 'block';
        showQuestion(currentQuestionIndex);
    }

    function showQuestion(index) {
        const question = currentQuizQuestions[index];
        if (!question) return;

        currentQNum.textContent = index + 1;
        const progressWidth = ((index + 1) / currentQuizQuestions.length) * 100;
        quizProgressFill.style.width = `${progressWidth}%`;
        
        questionText.textContent = question.q;
        optionsBox.innerHTML = '';

        question.a.forEach((option, oIdx) => {
            const cleanText = option.replace('(Recommended) ', '');
            const div = document.createElement('div');
            div.className = 'quiz-option';
            if (selectedAnswers[index] === oIdx) {
                div.classList.add('selected');
            }
            
            div.innerHTML = `
                <div class="option-indicator" style="width:18px; height:18px; border:2px solid var(--border-color); border-radius:50%; display:flex; justify-content:center; align-items:center;">
                    <div class="opt-bullet" style="width:10px; height:10px; border-radius:50%; background-color:${selectedAnswers[index] === oIdx ? 'var(--primary-orange)' : 'transparent'};"></div>
                </div>
                <span>${cleanText}</span>
            `;

            div.addEventListener('click', () => {
                document.querySelectorAll('.options-container .quiz-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                selectedAnswers[index] = oIdx;
                btnNextQ.disabled = false;
                
                document.querySelectorAll('.opt-bullet').forEach((b, bIdx) => {
                    b.style.backgroundColor = (bIdx === oIdx) ? 'var(--primary-orange)' : 'transparent';
                });
            });

            optionsBox.appendChild(div);
        });

        if (index > 0) {
            btnPrevQ.style.display = 'inline-flex';
        } else {
            btnPrevQ.style.display = 'none';
        }

        if (index === currentQuizQuestions.length - 1) {
            btnNextQ.innerHTML = 'ส่งแบบทดสอบ <i class="fa-solid fa-paper-plane"></i>';
        } else {
            btnNextQ.innerHTML = 'ข้อถัดไป <i class="fa-solid fa-arrow-right"></i>';
        }

        btnNextQ.disabled = selectedAnswers[index] === null;
    }

    function evaluateQuiz() {
        quizScore = 0;
        currentQuizQuestions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correct) {
                quizScore++;
            }
        });

        if (quizMode === 'pre') {
            localStorage.setItem('scratch_pre_test_score', quizScore);
        } else {
            localStorage.setItem('scratch_post_test_score', quizScore);
        }
        displayScores();

        if (typeof window.syncProgressToCloud === 'function') {
            window.syncProgressToCloud();
        }

        quizPlayScreen.style.display = 'none';
        quizScoreScreen.style.display = 'block';
        
        if (typeof loadLeaderboard === 'function') {
            setTimeout(loadLeaderboard, 500);
        }

        const scorePercent = (quizScore / currentQuizQuestions.length) * 100;
        scoreCircleStroke.setAttribute('stroke-dasharray', `${scorePercent}, 100`);
        scorePercentVal.textContent = `${quizScore}/${currentQuizQuestions.length}`;

        const modeLabel = quizMode === 'pre' ? 'ก่อนเรียน (Pre-test)' : 'หลังเรียน (Post-test)';
        if (quizScore >= 14) {
            scoreTitle.textContent = "เก่งสุดยอดเลยครับ! 🎉";
            scoreSubtitle.textContent = `น้องๆ ทำคะแนนแบบทดสอบ${modeLabel}ได้ยอดเยี่ยมถึง ${quizScore} คะแนน ผ่านเกณฑ์การประเมินความรู้พื้นฐานแล้วครับ!`;
        } else {
            scoreTitle.textContent = "พยายามอีกนิดนะ! 💪";
            scoreSubtitle.textContent = `น้องๆ ทำคะแนนแบบทดสอบ${modeLabel}ได้ ${quizScore} คะแนน ซึ่งยังไม่ถึงเกณฑ์ผ่าน 14 คะแนน ลองทบทวนเนื้อหาบทเรียนและทำแบบทดสอบใหม่อีกครั้งนะเจ้าเหมียวส้มรอเชียร์อยู่!`;
        }
    }

    // ── Load leaderboard when quiz tab is clicked ─────────────────────────────
    const quizTabLink = document.querySelector('[data-tab="quiz"]');
    if (quizTabLink) {
        quizTabLink.addEventListener('click', () => {
            setTimeout(() => {
                if (typeof loadLeaderboard === 'function') loadLeaderboard();
                if (typeof window.renderMyRubricProfile === 'function') window.renderMyRubricProfile();
            }, 250);
        });
    }

    // Auto-load on page start (Firebase needs ~800ms to initialize)
    setTimeout(() => {
        if (typeof loadLeaderboard === 'function') loadLeaderboard();
        if (typeof window.renderMyRubricProfile === 'function') window.renderMyRubricProfile();
    }, 900);

    if (btnStartPreQuiz) {
        btnStartPreQuiz.addEventListener('click', () => {
            startQuiz('pre');
        });
    }
    if (btnStartPostQuiz) {
        btnStartPostQuiz.addEventListener('click', () => {
            startQuiz('post');
        });
    }
    
    // Initial display of scores on page load
    displayScores();
    
    if (btnPrevQ) {
        btnPrevQ.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                showQuestion(currentQuestionIndex);
            }
        });
    }

    if (btnNextQ) {
        btnNextQ.addEventListener('click', () => {
            if (currentQuestionIndex < currentQuizQuestions.length - 1) {
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            } else {
                evaluateQuiz();
            }
        });
    }

    if (btnRetryQuiz) {
        btnRetryQuiz.addEventListener('click', () => {
            startQuiz(quizMode);
        });
    }
    
    if (btnGoBackHome) {
        btnGoBackHome.addEventListener('click', () => {
            const homeMenu = document.querySelector('[data-tab="home"]');
            if (homeMenu) homeMenu.click();
        });
    }

    // Certificate event bindings
    if (btnGenerateCert) {
        btnGenerateCert.addEventListener('click', () => {
            if (window.playCodeSound) window.playCodeSound('click');
            const name = certStudentNameInput.value.trim();
            if (!name) {
                alert('กรุณากรอกชื่อ-นามสกุลของคุณก่อนเหมียว!');
                return;
            }
            const postScore = localStorage.getItem('scratch_post_test_score') || '0';
            
            if (certDisplayName) certDisplayName.textContent = name;
            if (certDisplayDate) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                certDisplayDate.textContent = new Date().toLocaleDateString('th-TH', options);
            }
            if (certDisplayScore) certDisplayScore.textContent = `${postScore} / 20`;
            
            if (certModal) certModal.style.display = 'flex';
        });
    }
    
    if (btnCloseCertModal) {
        btnCloseCertModal.addEventListener('click', () => {
            if (window.playCodeSound) window.playCodeSound('click');
            if (certModal) certModal.style.display = 'none';
        });
    }
    
    if (btnPrintCert) {
        btnPrintCert.addEventListener('click', () => {
            if (window.playCodeSound) window.playCodeSound('click');
            window.print();
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RUBRIC QUIZ ENGINE
    // ─────────────────────────────────────────────────────────────────────────
    const RUBRIC_SKILLS = [
        { key: 'sequencing',  label: 'การจัดลำดับตรรกะ',   color: '#f87171', icon: 'fa-list-ol' },
        { key: 'loops',       label: 'การวนซ้ำ Loop',       color: '#fb923c', icon: 'fa-rotate' },
        { key: 'coordinates', label: 'พิกัดและทิศทาง',      color: '#facc15', icon: 'fa-compass' },
        { key: 'events',      label: 'เหตุการณ์และอินพุต',  color: '#4ade80', icon: 'fa-bolt' },
        { key: 'conditions',  label: 'เงื่อนไข If/Else',   color: '#2dd4bf', icon: 'fa-code-branch' },
        { key: 'operators',   label: 'ตัวดำเนินการคำนวณ',  color: '#60a5fa', icon: 'fa-calculator' },
        { key: 'variables',   label: 'ตัวแปรและข้อมูล',    color: '#c084fc', icon: 'fa-database' },
        { key: 'functions',   label: 'ฟังก์ชันและโมดูล',   color: '#f472b6', icon: 'fa-cubes' }
    ];



    // ── Render My Rubric Skill Grid ───────────────────────────────────────────
    window.renderMyRubricProfile = function() {
        const grid = document.getElementById('rubric-skills-grid');
        if (!grid) return;

        const completedMissions = JSON.parse(localStorage.getItem('scratch_completed_missions') || '{}');
        const completedLessons  = JSON.parse(localStorage.getItem('python_completed_lessons')  || '{}');
        const topicMapping = {
            sequencing:  { missions: [1,2,3,5],           lessons: ['1'] },
            loops:       { missions: [4,10,11,16],         lessons: ['11','12','13','14'] },
            coordinates: { missions: [7,10,12,16],         lessons: [] },
            events:      { missions: [2,6,12,13],          lessons: ['4'] },
            conditions:  { missions: [8,9,15,17,18],       lessons: ['6','7','8','9','10'] },
            operators:   { missions: [3,5,14,17],          lessons: ['3','8','9'] },
            variables:   { missions: [1,3,4,13,18,20],     lessons: ['2','5','15','16','17'] },
            functions:   { missions: [15,19,20],           lessons: ['18','19','20'] }
        };

        grid.innerHTML = '';
        RUBRIC_SKILLS.forEach(skill => {
            const rel = topicMapping[skill.key];
            let total = rel.missions.length + rel.lessons.length;
            let done  = 0;
            rel.missions.forEach(id => { if (completedMissions[id]) done++; });
            rel.lessons.forEach(id  => { if (completedLessons[id])  done++; });

            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            // Star system: Start at 0 stars. Earn +1 star for each debug task passed (max 3 stars)!
            const debugLevel = parseInt(localStorage.getItem('rubric_debug_level_' + skill.key) || '0', 10);
            let stars = debugLevel;
            const quizPassed = localStorage.getItem('rubric_quiz_completed_' + skill.key) === 'true';

            // Build Stars with FontAwesome (Supports 0 to 3 stars)
            const starStr = Array(3).fill(0).map((_, i) => 
                i < stars ? `<i class="fa-solid fa-star" style="color: #fbbf24; font-size: 10px; margin-right: 2px; filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.4));"></i>` 
                          : `<i class="fa-regular fa-star" style="color: rgba(255,255,255,0.15); font-size: 10px; margin-right: 2px;"></i>`
            ).join('');

            const levelLabel = stars === 3 ? 'ดีเยี่ยม (3/3 ⭐)' : stars === 2 ? 'กำลังพัฒนา (2/3 ⭐)' : stars === 1 ? 'เริ่มต้น (1/3 ⭐)' : 'ยังไม่ประเมิน (0/3 ⭐)';
            const levelColor = stars === 3 ? '#34d399' : stars === 2 ? '#fbbf24' : stars === 1 ? '#f87171' : 'rgba(255,255,255,0.4)';

            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                border: 1px solid ${skill.color}30; border-top: 1px solid ${skill.color}50;
                border-radius: 16px; padding: 20px; position: relative; overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            `;
            card.onmouseenter = () => {
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = `0 12px 40px ${skill.color}22`;
                card.style.borderColor = `${skill.color}70`;
            };
            card.onmouseleave = () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = `0 8px 32px rgba(0,0,0,0.2)`;
                card.style.borderColor = `${skill.color}30`;
            };

            card.innerHTML = `
                <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
                    <div style="width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg, ${skill.color}33, ${skill.color}11);
                        display:flex;align-items:center;justify-content:center;flex-shrink:0; border: 1px solid ${skill.color}40;
                        box-shadow: 0 0 15px ${skill.color}22;">
                        <i class="fa-solid ${skill.icon}" style="color:${skill.color};font-size:18px;filter: drop-shadow(0 0 6px ${skill.color}88);"></i>
                    </div>
                    <div>
                        <div style="font-size:14px;font-weight:700;color:white;font-family:var(--font-headers);letter-spacing:0.3px;margin-bottom:4px;">${skill.label}</div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="font-size:11px;font-weight:600;color:${levelColor};">${levelLabel}</span>
                            <div style="display:flex;">${starStr}</div>
                        </div>
                    </div>
                </div>
                <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:4px;margin-bottom:14px;overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,0.2);">
                    <div style="height:100%;width:0%;background:linear-gradient(90deg, ${skill.color}88, ${skill.color});border-radius:4px;transition:width 1s cubic-bezier(0.4, 0, 0.2, 1);box-shadow: 0 0 10px ${skill.color}aa;" id="bar-${skill.key}"></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:11px;color:rgba(255,255,255,0.7);font-weight:500;">
                        <i class="fa-solid fa-code" style="color:${skill.color};margin-right:4px;"></i> ปฏิบัติจริง: <strong>${done}/${total}</strong> งาน (${pct}%)
                        ${quizPassed ? `<span style="margin-left:6px;color:#34d399;"><i class="fa-solid fa-circle-check"></i> ทบทวนแล้ว</span>` : ''}
                    </span>
                    <button onclick="openRubricQuiz('${skill.key}')"
                        onmouseenter="this.style.background='${skill.color}33'; this.style.borderColor='${skill.color}88'"
                        onmouseleave="this.style.background='${skill.color}15'; this.style.borderColor='${skill.color}44'"
                        style="font-size:11px;font-weight:600;padding:6px 14px;border-radius:8px;border:1px solid ${skill.color}44;
                        background:${skill.color}15;color:${skill.color};cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:6px;">
                        ทบทวน <i class="fa-solid fa-angle-right" style="font-size:9px;opacity:0.8;"></i>
                    </button>
                </div>
                ${quizPassed && done > 0 ? `<div style="position:absolute;top:-5px;right:-5px;font-size:28px;opacity:0.1;transform:rotate(15deg);pointer-events:none;">🏆</div>` : ''}
            `;
            grid.appendChild(card);
            
            // Trigger animation after render
            setTimeout(() => {
                const bar = card.querySelector(`#bar-${skill.key}`);
                if (bar) bar.style.width = `${pct}%`;
            }, 50);
        });
    };

    // Hook: Start rubric quiz button
    const btnStartRubricQuiz = document.getElementById('btn-start-rubric-quiz');
    if (btnStartRubricQuiz) {
        btnStartRubricQuiz.addEventListener('click', () => {
            const sel = document.getElementById('rubric-quiz-select');
            if (sel) openRubricQuiz(sel.value);
        });
    }

    // Also render on page load if quiz tab is already active
    if (document.getElementById('quiz-tab') && document.getElementById('quiz-tab').classList.contains('active')) {
        renderMyRubricProfile();
    }

    // CSV Export functionality
    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            if (!window.currentLeaderboardData || window.currentLeaderboardData.length === 0) {
                alert('ไม่พบข้อมูลที่จะบันทึก');
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
            
            // Header
            csvContent += "Rank,Name,Pre-test,Post-test,Gain_Percent,Logic,Loop,Coordinates,Events,Condition_If,Operators,Variables,Functions,Total_Rubric,Rubric_Percent\n";
            
            window.currentLeaderboardData.forEach((s, idx) => {
                const rank = idx + 1;
                const name = s.name ? s.name.replace(/,/g, " ") : "";
                const pre = s.preScore !== null && s.preScore !== undefined ? s.preScore : "";
                const post = s.postScore !== null && s.postScore !== undefined ? s.postScore : "";
                
                let gain = "";
                if (pre !== "" && post !== "") {
                    const diff = 20 - pre;
                    if (post >= pre) {
                        gain = diff > 0 ? ((post - pre) / diff) * 100 : 100;
                    } else {
                        gain = pre > 0 ? ((post - pre) / pre) * 100 : 0;
                    }
                    gain = gain.toFixed(2);
                }

                const rub = s.rubrics || {};
                const rSeq = rub.sequencing || 1;
                const rLoop = rub.loops || 1;
                const rCoord = rub.coordinates || 1;
                const rEvent = rub.events || 1;
                const rCond = rub.conditions || 1;
                const rOp = rub.operators || 1;
                const rVar = rub.variables || 1;
                const rFunc = rub.functions || 1;

                const totalRubric = rSeq + rLoop + rCoord + rEvent + rCond + rOp + rVar + rFunc;
                const pctRubric = ((totalRubric / 24) * 100).toFixed(2);

                const rowStr = `${rank},${name},${pre},${post},${gain},${rSeq},${rLoop},${rCoord},${rEvent},${rCond},${rOp},${rVar},${rFunc},${totalRubric},${pctRubric}`;
                csvContent += rowStr + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            const dateStr = new Date().toISOString().split('T')[0];
            link.setAttribute("download", `class_rubric_data_${dateStr}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

});
