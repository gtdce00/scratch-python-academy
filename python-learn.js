/* -------------------------------------------------------------
   Scratch Academy - Python Learning Page Logic (python-learn.js)
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

    // --- 1. Global State ---
    let currentLessonId = "1";
    let completedLessons = JSON.parse(localStorage.getItem('python_completed_lessons') || '{}');
    let isWaitingForInput = false;
    let pendingCodeExecution = null; // Stored callback for input completion
    let inputHistory = []; // Stores the inputs provided by the user in this run

    // --- 1.5. Python Projects Database for Students (20 Projects) ---
    const pythonProjectsDb = [
        {
            id: 1,
            title: "1. เครื่องคำนวณอายุ",
            desc: "คำนวณหาอายุจริงปีปัจจุบัน โดยป้อนปี ค.ศ. เกิดเข้ามาวิเคราะห์ทางคณิตศาสตร์อย่างง่าย",
            code: "# โปรเจกต์ 1: เครื่องคำนวณอายุ\nbirth_year = int(input(\"ป้อนปี ค.ศ. เกิดของคุณ: \"))\ncurrent_year = 2026\nage = current_year - birth_year\nprint(\"คุณมีอายุประมาณ\", age, \"ปี\")\n"
        },
        {
            id: 2,
            title: "2. ระบบคิดเกรดอัตโนมัติ",
            desc: "คำนวณเกรด A, B, C, D, F ของผู้เรียน โดยเปรียบเทียบตรรกะระดับคะแนนด้วยบล็อกเงื่อนไข if-elif-else",
            code: "# โปรเจกต์ 2: ระบบคิดเกรดอัตโนมัติ\nscore = int(input(\"ป้อนคะแนนสอบของคุณ (0-100): \"))\nif score >= 80:\n    print(\"เกรดของคุณคือ: A\")\nelif score >= 70:\n    print(\"เกรดของคุณคือ: B\")\nelif score >= 60:\n    print(\"เกรดของคุณคือ: C\")\nelif score >= 50:\n    print(\"เกรดของคุณคือ: D\")\nelse:\n    print(\"เกรดของคุณคือ: F\")\n"
        },
        {
            id: 3,
            title: "3. เกมทายเลขปริศนา",
            desc: "ท้าทายสมองโดยเปรียบเทียบเงื่อนไขตัวเลขนำเข้ากับเลขลับที่ระบบตั้งไว้เพื่อประเมินความถูกต้อง",
            code: "# โปรเจกต์ 3: เกมทายเลขปริศนา\nsecret_number = 7\nguess = int(input(\"ทายตัวเลขปริศนา (1-10): \"))\nif guess == secret_number:\n    print(\"ยินดีด้วย! คุณทายถูกแล้ว\")\nelse:\n    print(\"เสียใจด้วยนะ! เลขที่ถูกต้องคือ\", secret_number)\n"
        },
        {
            id: 4,
            title: "4. เครื่องคิดเลข 4 ฟังก์ชัน",
            desc: "ระบบประมวลคำสั่งคำนวณคณิตศาสตร์พื้นฐาน บวก ลบ คูณ หาร สำหรับตัวเลขสองจำนวน",
            code: "# โปรเจกต์ 4: เครื่องคิดเลข 4 ฟังก์ชัน\nnum1 = float(input(\"ป้อนตัวเลขแรก: \"))\nnum2 = float(input(\"ป้อนตัวเลขสอง: \"))\nop = input(\"ป้อนตัวดำเนินการ (+, -, *, /): \")\nif op == \"+\":\n    print(\"ผลลัพธ์:\", num1 + num2)\nelif op == \"-\":\n    print(\"ผลลัพธ์:\", num1 - num2)\nelif op == \"*\":\n    print(\"ผลลัพธ์:\", num1 * num2)\nelif op == \"/\":\n    print(\"ผลลัพธ์:\", num1 / num2)\nelse:\n    print(\"ตัวดำเนินการไม่ถูกต้อง\")\n"
        },
        {
            id: 5,
            title: "5. สูตรคูณแม่ต่างๆ",
            desc: "แสดงตารางสูตรคูณของแม่ตัวเลขที่คุณป้อนอย่างรวดเร็ว โดยวนรอบทำซ้ำ 12 บรรทัดด้วย For Loop",
            code: "# โปรเจกต์ 5: สูตรคูณแม่ต่างๆ\nmultiply_by = int(input(\"ป้อนแม่สูตรคูณที่ต้องการ: \"))\nfor i in range(1, 13):\n    print(multiply_by, \"x\", i, \"=\", multiply_by * i)\n"
        },
        {
            id: 6,
            title: "6. ตัวนับถอยหลังยิงจรวด",
            desc: "จำลองลูปการนับเวลาถอยหลัง 5 วินาที สำหรับเปิดสัญญาณปล่อยยานอวกาศ",
            code: "# โปรเจกต์ 6: ตัวนับถอยหลังยิงจรวด\nfor i in range(5, 0, -1):\n    print(\"T-Minus\", i)\nprint(\"Launch! ยานอวกาศขึ้นสู่ท้องฟ้าแล้ว!\")\n"
        },
        {
            id: 7,
            title: "7. คำนวณราคาสินค้ารวม VAT",
            desc: "ช่วยพ่อค้าแม่ค้าหาจำนวนภาษีมูลค่าเพิ่ม 7% และคำนวณหาราคาสุทธิสุดท้ายของราคาสินค้าป้ายแดง",
            code: "# โปรเจกต์ 7: คำนวณราคาสินค้ารวม VAT\nprice = float(input(\"ป้อนราคาสินค้า (บาท): \"))\nvat = price * 0.07\ntotal = price + vat\nprint(\"ภาษีมูลค่าเพิ่ม (7%):\", vat, \"บาท\")\nprint(\"ราคารวมทั้งสิ้น:\", total, \"บาท\")\n"
        },
        {
            id: 8,
            title: "8. แปลงเซลเซียสเป็นฟาเรนไฮต์",
            desc: "เปลี่ยนข้อมูลพยากรณ์อากาศจากหน่วยเซลเซียสเป็นองศาฟาเรนไฮต์ผ่านสมการความร้อน",
            code: "# โปรเจกต์ 8: แปลงเซลเซียสเป็นฟาเรนไฮต์\ncelsius = float(input(\"ป้อนอุณหภูมิ (°C): \"))\nfahrenheit = (celsius * 9/5) + 32\nprint(celsius, \"°C มีค่าเท่ากับ\", fahrenheit, \"°F\")\n"
        },
        {
            id: 9,
            title: "9. ตัวแยกเลขคู่/เลขคี่",
            desc: "ระบุวิเคราะห์ค่าทางคณิตศาสตร์เศษเหลือจากการโมดูโล เพื่อหาว่าข้อมูลที่กรอกคือเลขคู่หรือเลขคี่",
            code: "# โปรเจกต์ 9: ตัวแยกเลขคู่/เลขคี่\nnum = int(input(\"ป้อนตัวเลขใดๆ: \"))\nif num % 2 == 0:\n    print(num, \"เป็นจำนวนคู่\")\nelse:\n    print(num, \"เป็นจำนวนคี่\")\n"
        },
        {
            id: 10,
            title: "10. เครื่องคำนวณ BMI",
            desc: "ตรวจประเมินหาดัชนีมวลกายเพื่อแบ่งสเตตัสสุขภาพ โดยหารความสูงยกกำลังสองและน้ำหนักตัว",
            code: "# โปรเจกต์ 10: เครื่องคำนวณ BMI\nweight = float(input(\"ป้อนน้ำหนักตัว (กก.): \"))\nheight = float(input(\"ป้อนความสูง (เมตร เช่น 1.70): \"))\nbmi = weight / (height * height)\nprint(\"ค่า BMI ของคุณคือ:\", bmi)\nif bmi >= 25:\n    print(\"คุณอยู่ในเกณฑ์: น้ำหนักเกินพิกัด\")\nelif bmi >= 18.5:\n    print(\"คุณอยู่ในเกณฑ์: สุขภาพดี\")\nelse:\n    print(\"คุณอยู่ในเกณฑ์: น้ำหนักต่ำกว่าเกณฑ์\")\n"
        },
        {
            id: 11,
            title: "11. คำนวณพื้นที่สี่เหลี่ยม",
            desc: "หาตารางเมตรพื้นที่สี่เหลี่ยมผืนผ้า โดยรับขนาดความกว้างคูณกับความยาวมาคำนวณ",
            code: "# โปรเจกต์ 11: คำนวณพื้นที่สี่เหลี่ยม\nwidth = float(input(\"ป้อนความกว้าง (เมตร): \"))\nlength = float(input(\"ป้อนความยาว (เมตร): \"))\narea = width * length\nprint(\"พื้นที่สี่เหลี่ยมคือ:\", area, \"ตารางเมตร\")\n"
        },
        {
            id: 12,
            title: "12. ตรวจสอบสถานะตัวเลข",
            desc: "วิเคราะห์ค่าจำนวนจริงว่าเป็นเลขจำนวนบวก มีค่าเป็นลบ หรือมีสถานะเป็นเลขศูนย์",
            code: "# โปรเจกต์ 12: ตรวจสอบสถานะตัวเลข\nnum = float(input(\"ป้อนตัวเลขที่ต้องการวิเคราะห์: \"))\nif num > 0:\n    print(num, \"เป็นจำนวนบวก\")\nelif num < 0:\n    print(num, \"เป็นจำนวนลบ\")\nelse:\n    print(\"นี่คือเลขศูนย์ (Zero)\")\n"
        },
        {
            id: 13,
            title: "13. คำนวณส่วนลดหน้าร้าน",
            desc: "คำนวณสิทธิโปรโมชันและหักลบจำนวนเงินจริงตามอัตราส่วนเปอร์เซ็นต์ส่วนลดของร้านค้า",
            code: "# โปรเจกต์ 13: คำนวณส่วนลดหน้าร้าน\ntotal_price = float(input(\"ป้อนราคาสินค้ารวม (บาท): \"))\ndiscount_percent = float(input(\"ป้อนส่วนลด (%): \"))\nsaved = total_price * (discount_percent / 100)\nfinal_price = total_price - saved\nprint(\"ส่วนลดที่ได้รับ:\", saved, \"บาท\")\nprint(\"ราคาสุทธิที่ต้องจ่าย:\", final_price, \"บาท\")\n"
        },
        {
            id: 14,
            title: "14. เกมเป่ายิ้งฉุบจำลอง",
            desc: "เปรียบเทียบและหาผู้ชนะการเล่นเป่ายิ้งฉุบ ระหว่างสัญลักษณ์ที่คุณเลือกกับตัวเลือกของระบบบอท",
            code: "# โปรเจกต์ 14: เกมเป่ายิ้งฉุบจำลอง\nplayer = input(\"เลือก ค้อน / กรรไกร / กระดาษ: \")\ncomputer = \"ค้อน\"\nprint(\"คอมพิวเตอร์ออก:\", computer)\nif player == computer:\n    print(\"ผลลัพธ์: เสมอกัน!\")\nelif (player == \"กระดาษ\" and computer == \"ค้อน\") or (player == \"ค้อน\" and computer == \"กรรไกร\"):\n    print(\"ผลลัพธ์: ยินดีด้วย คุณชนะแล้ว!\")\nelse:\n    print(\"ผลลัพธ์: เสียใจด้วย คุณแพ้แล้วนะ!\")\n"
        },
        {
            id: 15,
            title: "15. ระบบนับสระในคำ",
            desc: "โปรแกรมตรวจค้นและนับความยาวสระภาษาอังกฤษ (a, e, i, o, u) ภายในข้อความที่ป้อนเข้ามา",
            code: "# โปรเจกต์ 15: ระบบนับสระในคำ\nword = input(\"ป้อนข้อความภาษาอังกฤษ: \")\nvowels = \"aeiouAEIOU\"\ncount = 0\nfor char in word:\n    if char in vowels:\n        count = count + 1\nprint(\"พบสระภาษาอังกฤษทั้งหมด:\", count, \"ตัว\")\n"
        },
        {
            id: 16,
            title: "16. แนะนำกิจกรรมตามอากาศ",
            desc: "แนะนำกิจกรรมนันทนาการที่เหมาะสมกับระดับสภาพอุณหภูมิของพื้นที่ในปัจจุบัน",
            code: "# โปรเจกต์ 16: แนะนำกิจกรรมตามสภาพอากาศ\ntemp = float(input(\"ป้อนอุณหภูมิขณะนี้ (°C): \"))\nif temp >= 35:\n    print(\"คำแนะนำ: อากาศร้อนมาก ควรพักผ่อนในร่มและเปิดพัดลม\")\nelif temp >= 25:\n    print(\"คำแนะนำ: อากาศกำลังดี เหมาะแก่การไปเดินเล่นนอกบ้าน\")\nelse:\n    print(\"คำแนะนำ: อากาศค่อนข้างเย็น ควรทำตัวให้อบอุ่น\")\n"
        },
        {
            id: 17,
            title: "17. ตรวจสอบรหัสผ่าน",
            desc: "วิเคราะห์เงื่อนไขความยาวขั้นต่ำและการป้อนรหัสสองรอบจับคู่เพื่อความปลอดภัยของข้อมูลบัญชี",
            code: "# โปรเจกต์ 17: ตรวจสอบรหัสผ่าน\npwd1 = input(\"ตั้งค่ารหัสผ่านใหม่: \")\npwd2 = input(\"ป้อนรหัสผ่านอีกครั้ง: \")\nif len(pwd1) < 6:\n    print(\"แจ้งเตือน: รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร!\")\nelif pwd1 == pwd2:\n    print(\"สำเร็จ: ตั้งค่ารหัสผ่านของคุณเรียบร้อยแล้ว!\")\nelse:\n    print(\"แจ้งเตือน: รหัสผ่านสองครั้งไม่ตรงกัน กรุณากรอกใหม่\")\n"
        },
        {
            id: 18,
            title: "18. รายการซื้อของชำจำลอง",
            desc: "สร้างระบบจัดการรายการของชำที่ซื้อ และใช้การสืบค้นความยาวรายการและพิมพ์ออกมาเป็นข้อความ",
            code: "# โปรเจกต์ 18: รายการซื้อของชำจำลอง\ngroceries = [\"นมสด\", \"ไข่ไก่\", \"ขนมปัง\", \"แอปเปิ้ล\"]\nprint(\"ของชำที่คุณมี:\", groceries)\nprint(\"จำนวนของชำทั้งหมด:\", len(groceries), \"รายการ\")\n"
        },
        {
            id: 19,
            title: "19. เครื่องแปลงเวลาเป็นวินาที",
            desc: "เปลี่ยนค่าเวลาที่มีหน่วยเป็นชั่วโมงและนาที ให้แปลงเป็นวินาทีรวมทั้งหมดสำหรับการคำนวณเชิงลึก",
            code: "# โปรเจกต์ 19: เครื่องแปลงเวลาเป็นวินาที\nhours = int(input(\"ป้อนจำนวนชั่วโมง: \"))\nminutes = int(input(\"ป้อนจำนวนนาที: \"))\ntotal_seconds = (hours * 3600) + (minutes * 60)\nprint(hours, \"ชั่วโมง\", minutes, \"นาที เท่ากับ\", total_seconds, \"วินาที\")\n"
        },
        {
            id: 20,
            title: "20. ตู้ ATM ถอนเงินจำลอง",
            desc: "จำลองขั้นตอนการถอนเงินของตู้ ATM โดยตรวจสอบการเบิกเงินเกินบัญชีส่วนบุคคล",
            code: "# โปรเจกต์ 20: ตู้ ATM ถอนเงินจำลอง\nbalance = 5000\nwithdraw = float(input(\"ป้อนจำนวนเงินที่ต้องการถอน: \"))\nif withdraw > balance:\n    print(\"แจ้งเตือน: ยอดเงินคงเหลือของคุณไม่พอจ่ายการถอนครั้งนี้!\")\nelse:\n    balance = balance - withdraw\n    print(\"การถอนเงินสำเร็จ! ยอดคงเหลือในบัญชีของคุณคือ:\", balance, \"บาท\")\n"
        }
    ];
    
    // Expose Global Navigation Helper
    window.navigateToLesson = function(lessonId) {
        const targetItem = document.querySelector(`.sidebar-menu .menu-item[data-lesson="${lessonId}"]`);
        if (targetItem) {
            targetItem.click();
        }
    };

    // DOM Elements
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item[data-lesson]');
    const pageSectionTitle = document.getElementById('page-section-title');
    const progressPercentText = document.getElementById('progress-percent');
    const progressBar = document.getElementById('learning-progress');

    const lessonBadge = document.getElementById('lesson-badge');
    const lessonStatus = document.getElementById('lesson-status');
    const lessonTitle = document.getElementById('lesson-title');
    const scratchBlockRender = document.getElementById('scratch-block-render');
    const pythonCodeRender = document.getElementById('python-code-render');
    
    const explanationHeading = document.getElementById('explanation-heading');
    const explanationBody = document.getElementById('explanation-body');
    const lessonChallengeList = document.getElementById('lesson-challenge-list');
    
    const editorTextArea = document.getElementById('editor-text-area');
    let editorInstance = null;
    
    // Note: paste/copy/cut prevention is handled via CodeMirror 'beforeChange' below
    const editorTemplatesContainer = document.getElementById('editor-templates-container');
    const btnRunCode = document.getElementById('btn-run-code');
    const btnResetCode = document.getElementById('btn-reset-code');
    
    const terminalOutputBox = document.getElementById('terminal-output-box');
    const successOverlay = null; // Removed
    const btnNextLessonInline = document.getElementById('btn-next-lesson-inline');
    
    const terminalInputRow = document.getElementById('terminal-input-row');
    const terminalPromptInputField = document.getElementById('terminal-prompt-input-field');
    const editorLineNumbers = null; // Removed — CodeMirror manages line numbers

    // Turtle Canvas Elements
    const turtleCanvasBox = document.getElementById('turtle-canvas-box');
    const turtleCanvas = document.getElementById('turtle-canvas');
    const turtleLabel = document.getElementById('turtle-label');
    const turtleIndicator = document.getElementById('turtle-indicator');

    // updateLineNumbers removed because CodeMirror handles it natively.

    // --- 1.8. Real Python Interpreter Simulator ---
    function runPythonInterpreter(code, inputsHistory = []) {
        const rawLines = code.split('\n');
        let variables = {};
        let outputs = [];
        let activeIfCondition = null; // null, true, or false
        let ifConditionMet = false; // tracks if any if/elif in chain was met
        
        // Reset and prepare turtle commands queue
        window.turtleCommandsQueue = [];
        
        // Helper to match and parse turtle commands
        function executeTurtleCommand(lineStr, vars) {
            let clean = lineStr.trim();
            if (!clean || clean.startsWith('#')) return false;
            
            if (clean.startsWith('import turtle') || clean.startsWith('from turtle import')) {
                window.turtleCommandsQueue.push({ cmd: 'init' });
                return true;
            }
            
            let fdMatch = clean.match(/(?:\w+)\.(?:forward|fd)\(\s*(.+?)\s*\)/);
            let bkMatch = clean.match(/(?:\w+)\.(?:backward|bk)\(\s*(.+?)\s*\)/);
            let rtMatch = clean.match(/(?:\w+)\.(?:right|rt)\(\s*(.+?)\s*\)/);
            let ltMatch = clean.match(/(?:\w+)\.(?:left|lt)\(\s*(.+?)\s*\)/);
            let puMatch = clean.match(/(?:\w+)\.(?:penup|pu)\(\s*\)/);
            let pdMatch = clean.match(/(?:\w+)\.(?:pendown|pd)\(\s*\)/);
            let colorMatch = clean.match(/(?:\w+)\.color\(\s*(["'])(.+?)\1\s*\)/);
            let sizeMatch = clean.match(/(?:\w+)\.(?:pensize|width)\(\s*(.+?)\s*\)/);
            let circleMatch = clean.match(/(?:\w+)\.circle\(\s*(.+?)\s*\)/);
            
            if (fdMatch) {
                let dist = evalExpression(fdMatch[1], vars);
                window.turtleCommandsQueue.push({ cmd: 'fd', arg: Number(dist) || 0 });
                return true;
            }
            if (bkMatch) {
                let dist = evalExpression(bkMatch[1], vars);
                window.turtleCommandsQueue.push({ cmd: 'bk', arg: Number(dist) || 0 });
                return true;
            }
            if (rtMatch) {
                let angle = evalExpression(rtMatch[1], vars);
                window.turtleCommandsQueue.push({ cmd: 'rt', arg: Number(angle) || 0 });
                return true;
            }
            if (ltMatch) {
                let angle = evalExpression(ltMatch[1], vars);
                window.turtleCommandsQueue.push({ cmd: 'lt', arg: Number(angle) || 0 });
                return true;
            }
            if (puMatch) {
                window.turtleCommandsQueue.push({ cmd: 'pu' });
                return true;
            }
            if (pdMatch) {
                window.turtleCommandsQueue.push({ cmd: 'pd' });
                return true;
            }
            if (colorMatch) {
                window.turtleCommandsQueue.push({ cmd: 'color', arg: colorMatch[2] });
                return true;
            }
            if (sizeMatch) {
                let sz = evalExpression(sizeMatch[1], vars);
                window.turtleCommandsQueue.push({ cmd: 'size', arg: Number(sz) || 2 });
                return true;
            }
            if (circleMatch) {
                let rad = evalExpression(circleMatch[1], vars);
                window.turtleCommandsQueue.push({ cmd: 'circle', arg: Number(rad) || 10 });
                return true;
            }
            return false;
        }
        
        // Ensure inputsHistory is treated as an array
        const history = Array.isArray(inputsHistory) ? inputsHistory : (inputsHistory ? [inputsHistory] : []);
        let inputIndex = 0;
        
        // Helper to evaluate simple expressions
        function evalExpression(expr, vars) {
            let cleanExpr = expr.trim();
            if (!cleanExpr) return "";
            
            // Handle len()
            let lenMatch = cleanExpr.match(/len\((\w+)\)/);
            if (lenMatch) {
                let varName = lenMatch[1];
                if (vars[varName] !== undefined) {
                    let val = vars[varName];
                    let len = (typeof val === 'string' || Array.isArray(val)) ? val.length : 0;
                    cleanExpr = cleanExpr.replace(lenMatch[0], len);
                }
            }
            
            // Replace variable names with JSON values
            let varNames = Object.keys(vars).sort((a,b) => b.length - a.length);
            for (let name of varNames) {
                let val = vars[name];
                let replacement = JSON.stringify(val);
                cleanExpr = cleanExpr.replace(new RegExp('\\b' + name + '\\b', 'g'), replacement);
            }
            
            try {
                // Translate Python logic to JS logic
                cleanExpr = cleanExpr.replace(/\band\b/g, '&&')
                                     .replace(/\bor\b/g, '||')
                                     .replace(/\bnot\b/g, '!');
                return Function(`"use strict"; return (${cleanExpr})`)();
            } catch (e) {
                // If it is a string representation or variable name fallback
                if ((cleanExpr.startsWith('"') && cleanExpr.endsWith('"')) || (cleanExpr.startsWith("'") && cleanExpr.endsWith("'"))) {
                    return cleanExpr.slice(1, -1);
                }
                return cleanExpr;
            }
        }
        
        // Helper to split arguments by commas outside quotes
        function parsePrintArgs(inner) {
            let args = [];
            let currentArg = '';
            let inQuotes = false;
            let quoteChar = '';
            
            for (let idx = 0; idx < inner.length; idx++) {
                let char = inner[idx];
                if ((char === '"' || char === "'") && (idx === 0 || inner[idx - 1] !== '\\')) {
                    if (!inQuotes) {
                        inQuotes = true;
                        quoteChar = char;
                    } else if (char === quoteChar) {
                        inQuotes = false;
                    }
                    currentArg += char;
                } else if (char === ',' && !inQuotes) {
                    args.push(currentArg.trim());
                    currentArg = '';
                } else {
                    currentArg += char;
                }
            }
            if (currentArg.trim()) {
                args.push(currentArg.trim());
            }
            return args;
        }

        // Sub-interpreter for loop bodies
        function runSubInterpreter(bodyLines, parentVars) {
            let localVars = Object.assign({}, parentVars);
            let localOutputs = [];
            
            for (let j = 0; j < bodyLines.length; j++) {
                let line = bodyLines[j].trim();
                if (!line || line.startsWith('#')) continue;
                
                if (line.startsWith('print(') && line.endsWith(')')) {
                    let inner = line.slice(6, -1).trim();
                    let args = parsePrintArgs(inner);
                    let evaluatedArgs = args.map(arg => {
                        let val = evalExpression(arg, localVars);
                        if (typeof val === 'object' && val !== null) {
                            return JSON.stringify(val);
                        }
                        return val;
                    });
                    localOutputs.push(evaluatedArgs.join(' '));
                } else if (executeTurtleCommand(line, localVars)) {
                    continue;
                } else if (line.includes('=')) {
                    let eqIdx = line.indexOf('=');
                    let varName = line.slice(0, eqIdx).trim();
                    let valExpr = line.slice(eqIdx + 1).trim();
                    localVars[varName] = evalExpression(valExpr, localVars);
                }
            }
            return { outputs: localOutputs, variables: localVars };
        }
        
        try {
            for (let i = 0; i < rawLines.length; i++) {
                let rawLine = rawLines[i];
                let trimmedLine = rawLine.trim();
                
                if (!trimmedLine || trimmedLine.startsWith('#')) {
                    continue;
                }
                
                // Indentation detection
                let isIndented = rawLine.startsWith(' ') || rawLine.startsWith('\t');
                
                if (isIndented) {
                    if (activeIfCondition === false) {
                        continue; // skip line
                    }
                } else {
                    // Reset if unindented and not else/elif
                    if (!trimmedLine.startsWith('else:') && !trimmedLine.startsWith('elif ')) {
                        activeIfCondition = null;
                    }
                }
                
                // Parse IF statement
                if (trimmedLine.startsWith('if ') && trimmedLine.endsWith(':')) {
                    let condExpr = trimmedLine.slice(3, -1).trim();
                    let res = evalExpression(condExpr, variables);
                    activeIfCondition = !!res;
                    ifConditionMet = !!res;
                    continue;
                }
                
                // Parse ELIF statement
                if (trimmedLine.startsWith('elif ') && trimmedLine.endsWith(':')) {
                    if (ifConditionMet) {
                        activeIfCondition = false;
                    } else {
                        let condExpr = trimmedLine.slice(5, -1).trim();
                        let res = evalExpression(condExpr, variables);
                        activeIfCondition = !!res;
                        if (res) {
                            ifConditionMet = true;
                        }
                    }
                    continue;
                }
                
                // Parse ELSE statement
                if (trimmedLine === 'else:') {
                    activeIfCondition = !ifConditionMet;
                    continue;
                }
                
                // Parse print
                if (trimmedLine.startsWith('print(') && trimmedLine.endsWith(')')) {
                    let inner = trimmedLine.slice(6, -1).trim();
                    let args = parsePrintArgs(inner);
                    let evaluatedArgs = args.map(arg => {
                        let val = evalExpression(arg, variables);
                        if (typeof val === 'object' && val !== null) {
                            return JSON.stringify(val);
                        }
                        return val;
                    });
                    outputs.push(evaluatedArgs.join(' '));
                    continue;
                }
                
                // Parse turtle commands
                if (executeTurtleCommand(trimmedLine, variables)) {
                    continue;
                }
                
                // Parse assignment
                if (trimmedLine.includes('=')) {
                    let eqIdx = trimmedLine.indexOf('=');
                    let varName = trimmedLine.slice(0, eqIdx).trim();
                    let valExpr = trimmedLine.slice(eqIdx + 1).trim();
                    
                    // Input request
                    if (valExpr.includes('input(')) {
                        if (inputIndex >= history.length) {
                            let prompt = "ป้อนอินพุต: ";
                            let promptMatch = valExpr.match(/input\(\s*(["'])(.*?)\1\s*\)/);
                            if (promptMatch && promptMatch[2]) {
                                prompt = promptMatch[2];
                            }
                            return { requestInput: true, prompt: prompt };
                        } else {
                            let value = history[inputIndex];
                            inputIndex++;
                            
                            if (valExpr.startsWith('int(')) {
                                value = parseInt(value);
                                if (isNaN(value)) value = 0;
                            } else if (valExpr.startsWith('float(')) {
                                value = parseFloat(value);
                                if (isNaN(value)) value = 0.0;
                            }
                            variables[varName] = value;
                            continue;
                        }
                    }
                    
                    // List
                    if (valExpr.startsWith('[') && valExpr.endsWith(']')) {
                        let listItems = valExpr.slice(1, -1).split(',').map(item => {
                            let valStr = item.trim();
                            if ((valStr.startsWith('"') && valStr.endsWith('"')) || (valStr.startsWith("'") && valStr.endsWith("'"))) {
                                return valStr.slice(1, -1);
                            }
                            return isNaN(Number(valStr)) ? valStr : Number(valStr);
                        }).filter(v => v !== "");
                        variables[varName] = listItems;
                        continue;
                    }
                    
                    // General expression evaluation
                    variables[varName] = evalExpression(valExpr, variables);
                    continue;
                }
                
                // Parse loops
                if (trimmedLine.startsWith('for ') && trimmedLine.endsWith(':')) {
                    let loopMatch = trimmedLine.match(/^for\s+(\w+)\s+in\s+range\((.*)\)\s*:$/);
                    if (loopMatch) {
                        let loopVar = loopMatch[1];
                        let rangeArgs = loopMatch[2].split(',').map(arg => evalExpression(arg.trim(), variables));
                        
                        let start = 0;
                        let stop = 0;
                        let step = 1;
                        
                        if (rangeArgs.length === 1) {
                            stop = rangeArgs[0];
                        } else if (rangeArgs.length === 2) {
                            start = rangeArgs[0];
                            stop = rangeArgs[1];
                        } else if (rangeArgs.length === 3) {
                            start = rangeArgs[0];
                            stop = rangeArgs[1];
                            step = rangeArgs[2];
                        }
                        
                        let bodyLines = [];
                        let j = i + 1;
                        while (j < rawLines.length) {
                            let nextRaw = rawLines[j];
                            let isNextIndented = nextRaw.startsWith(' ') || nextRaw.startsWith('\t');
                            if (isNextIndented || !nextRaw.trim()) {
                                if (nextRaw.trim()) {
                                    bodyLines.push(nextRaw);
                                }
                                j++;
                            } else {
                                break;
                            }
                        }
                        
                        const condition = (idx) => step > 0 ? idx < stop : idx > stop;
                        for (let val = start; condition(val); val += step) {
                            let subVars = Object.assign({}, variables);
                            subVars[loopVar] = val;
                            let subRes = runSubInterpreter(bodyLines, subVars);
                            outputs.push(...subRes.outputs);
                            Object.assign(variables, subRes.variables);
                        }
                        i = j - 1;
                        continue;
                    }
                }
                
                // Unrecognized statements fallback (e.g. prinnt("tigger") NameError)
                if (trimmedLine && activeIfCondition !== false) {
                    let firstWordMatch = trimmedLine.match(/^(\w+)/);
                    if (firstWordMatch) {
                        let name = firstWordMatch[1];
                        if (name !== 'if' && name !== 'for' && name !== 'print' && name !== 'import' && name !== 'elif' && name !== 'else') {
                            if (variables[name] === undefined) {
                                return { success: false, error: `NameError: name '${name}' is not defined` };
                            }
                        }
                    }
                }
            }
            return { success: true, output: outputs.join('\n') };
        } catch (e) {
            return { success: false, error: "เกิดข้อผิดพลาดในการประมวลผลโค้ด: " + e.message };
        }
    }

    // --- 2. Lesson Definitions ---
    const lessons = {
        "syllabus": {
            isSyllabus: true,
            badge: "แผนการเรียนรู้",
            title: "โครงสร้างหลักสูตรและสารบัญ 20 บทเรียน Python",
            scratchHtml: "",
            pythonHtml: "",
            explanation: `
                <p style="margin-bottom:12px;">สารบัญภาพรวมหัวข้อเนื้อหาในการศึกษาภาษา Python สำหรับนักเรียน ทั้ง 20 บทเรียนโต้ตอบ (คลิกเลือกหัวข้อเพื่อข้ามไปยังบทเรียน):</p>
                
                <!-- Syllabus Cards Layout (20 Lessons across 4 Modules) -->
                <div style="display:grid; grid-template-columns: 1fr; gap:12px; margin-top:14px; max-height:340px; overflow-y:auto; padding:4px;" id="syllabus-container">
                    
                    <!-- หมวดที่ 1 -->
                    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:10px; padding:12px;">
                        <h4 style="color:#50fa7b; font-size:13px; font-family:var(--font-headers); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                            <i class="fa-solid fa-graduation-cap"></i> หน่วยที่ 1: พื้นฐานการแสดงผลและข้อมูล (บทเรียน 1 - 5)
                        </h4>
                        <ul style="list-style:none; padding-left:0; margin:0; display:flex; flex-direction:column; gap:4px; font-size:11px;">
                            <li onclick="navigateToLesson('1')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:var(--primary-orange);"></i> 1. การพิมพ์ข้อความออกหน้าจอ (print)</li>
                            <li onclick="navigateToLesson('2')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:var(--primary-orange);"></i> 2. การสร้างตัวแปรและเก็บข้อมูล (Variables)</li>
                            <li onclick="navigateToLesson('3')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:var(--primary-orange);"></i> 3. การคำนวณทางคณิตศาสตร์ (Operators)</li>
                            <li onclick="navigateToLesson('4')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:var(--primary-orange);"></i> 4. การรับค่าข้อมูลผ่านแป้นพิมพ์ (input)</li>
                            <li onclick="navigateToLesson('5')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:var(--primary-orange);"></i> 5. การแปลงข้อมูลเป็นตัวเลขจำนวนเต็ม (int)</li>
                        </ul>
                    </div>

                    <!-- หมวดที่ 2 -->
                    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:10px; padding:12px;">
                        <h4 style="color:#8be9fd; font-size:13px; font-family:var(--font-headers); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                            <i class="fa-solid fa-code-branch"></i> หน่วยที่ 2: การควบคุมและเงื่อนไข (บทเรียน 6 - 10)
                        </h4>
                        <ul style="list-style:none; padding-left:0; margin:0; display:flex; flex-direction:column; gap:4px; font-size:11px;">
                            <li onclick="navigateToLesson('6')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#38bdf8;"></i> 6. การเปรียบเทียบเงื่อนไขพื้นฐาน (If-Else)</li>
                            <li onclick="navigateToLesson('7')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#38bdf8;"></i> 7. การเช็คเงื่อนไขหลายทางเลือก (Elif)</li>
                            <li onclick="navigateToLesson('8')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#38bdf8;"></i> 8. ตัวดำเนินการทางตรรกศาสตร์ (and / or)</li>
                            <li onclick="navigateToLesson('9')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#38bdf8;"></i> 9. ตัวหาเศษเหลือจากการหาร (Modulo %)</li>
                            <li onclick="navigateToLesson('10')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#38bdf8;"></i> 10. การเปรียบเทียบค่าช่วงตัวเลข (Range Check)</li>
                        </ul>
                    </div>

                    <!-- หมวดที่ 3 -->
                    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:10px; padding:12px;">
                        <h4 style="color:#ff79c6; font-size:13px; font-family:var(--font-headers); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                            <i class="fa-solid fa-rotate"></i> หน่วยที่ 3: การวนซ้ำและโครงสร้างข้อมูล (บทเรียน 11 - 15)
                        </h4>
                        <ul style="list-style:none; padding-left:0; margin:0; display:flex; flex-direction:column; gap:4px; font-size:11px;">
                            <li onclick="navigateToLesson('11')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#f472b6;"></i> 11. การทำคำสั่งซ้ำระบุจำนวนรอบ (For Loop)</li>
                            <li onclick="navigateToLesson('12')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#f472b6;"></i> 12. การใช้ตัวนับรอบในลูป (Loop Index i)</li>
                            <li onclick="navigateToLesson('13')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#f472b6;"></i> 13. การวนซ้ำตามเงื่อนไข (While Loop)</li>
                            <li onclick="navigateToLesson('14')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#f472b6;"></i> 14. การข้ามรอบลูป (Continue Statement)</li>
                            <li onclick="navigateToLesson('15')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#f472b6;"></i> 15. รายการข้อมูลแบบกลุ่ม (Lists)</li>
                        </ul>
                    </div>

                    <!-- หมวดที่ 4 -->
                    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:10px; padding:12px;">
                        <h4 style="color:#f1fa8c; font-size:13px; font-family:var(--font-headers); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                            <i class="fa-solid fa-cubes"></i> หน่วยที่ 4: ฟังก์ชันและการประยุกต์ใช้ (บทเรียน 16 - 20)
                        </h4>
                        <ul style="list-style:none; padding-left:0; margin:0; display:flex; flex-direction:column; gap:4px; font-size:11px;">
                            <li onclick="navigateToLesson('16')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#a855f7;"></i> 16. การเพิ่มและหาความยาวลิสต์ (append & len)</li>
                            <li onclick="navigateToLesson('17')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#a855f7;"></i> 17. โครงสร้างข้อมูลแบบคู่คีย์ (Dictionary)</li>
                            <li onclick="navigateToLesson('18')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#a855f7;"></i> 18. การสร้างฟังก์ชันใช้งานเอง (def)</li>
                            <li onclick="navigateToLesson('19')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#a855f7;"></i> 19. ฟังก์ชันการส่งคืนผลลัพธ์ (return)</li>
                            <li onclick="navigateToLesson('20')" style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)';" onmouseout="this.style.background='transparent';"><i class="fa-solid fa-circle-play" style="color:#a855f7;"></i> 20. โปรเจกต์สรุปทักษะฟังก์ชันส่วนลด (Final Challenge)</li>
                        </ul>
                    </div>

                </div>
            `,
            challenges: [
                "ศึกษาแผนผังทั้ง 20 บทเรียนของภาษา Python ด้านบนเพื่อวางแผนการเรียนรู้",
                "น้องๆ สามารถคลิกหัวข้อบทเรียนใดก็ได้ด้านบน หรือเลือกแท็บเมนูเพื่อเข้าสู่บทเรียนจริง"
            ],
            defaultCode: "# ยินดีต้อนรับสู่หลักสูตร Python Academy 20 บทเรียน!\n# คลิกเลือกบทเรียนด้านซ้ายเพื่อเริ่มศึกษาและทดสอบรันโค้ดได้เลยครับ\n",
            snippets: [],
            verify: (code, userInput = null) => {
                return { success: true, output: "ยินดีต้อนรับสู่หน้าสารบัญ 20 บทเรียน Python!" };
            }
        },
        "1": {
            badge: "บทเรียนที่ 1: การพิมพ์ข้อความ",
            title: "1. การพิมพ์ข้อความออกหน้าจอ (print)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-looks">พูด <span class="scratch-input-pill" style="min-width: 60px; text-align:left;">Hello Python</span> เป็นเวลา <span class="scratch-input-pill">2</span> วินาที</div>',
            pythonHtml: '<span class="python-builtin">print</span>(<span class="python-string">"Hello Python"</span>)',
            explanation: `คำสั่งมาตรฐานในภาษา Python สำหรับแสดงผลข้อความออกทางคอนโซลคือฟังก์ชัน <strong>print()</strong> โดยข้อความจะต้องอยู่ในเครื่องหมายคำพูด (Quotes)<br><br><div style='background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:10px; padding:12px; margin-top:10px;'><h4 style='color:#50fa7b; font-size:13px; font-family:var(--font-headers); margin-bottom:6px;'><i class='fa-solid fa-code'></i> รูปแบบคำสั่ง (Syntax)</h4><p style='font-size:12px !important;'><code>print("ข้อความที่ต้องการแสดง")</code></p></div>`,
            challenges: [
                'เขียนคำสั่ง <code style="color:#50fa7b;">print("Hello Python")</code> หรือ <code style="color:#50fa7b;">print("tigger")</code>',
                'กดปุ่ม "รันโค้ด Python" เพื่อตรวจเช็คผลลัพธ์'
            ],
            defaultCode: "# บทเรียนที่ 1: พิมพ์คำว่า Hello Python ออกหน้าจอ\n",
            snippets: [{ label: "พิมพ์ข้อความ", code: 'print("Hello Python")' }],
            verify: (code) => {
                const trimmed = code.trim();
                const cleanCode = trimmed.split('\n').filter(l => !l.trim().startsWith('#')).join('\n').trim();
                if (/print\(\s*["']Hello Python["']\s*\)/.test(cleanCode)) return { success: true, output: "Hello Python" };
                if (/print\(\s*["']tigger["']\s*\)/.test(cleanCode)) return { success: true, output: "tigger" };
                return { success: false, error: "กรุณาใช้คำสั่ง print(\"Hello Python\")" };
            }
        },
        "2": {
            badge: "บทเรียนที่ 2: สร้างตัวแปร",
            title: "2. การสร้างตัวแปรและเก็บข้อมูล (Variables)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-variables" style="background:#FF8C1A;">ตั้งค่า <span class="scratch-input-dropdown" style="background:rgba(0,0,0,0.08); color:white;">score</span> เป็น <span class="scratch-input-pill">10</span></div>',
            pythonHtml: '<span class="python-variable">score</span> = <span class="python-number">10</span>\n<span class="python-builtin">print</span>(<span class="python-variable">score</span>)',
            explanation: `ตัวแปรเป็นกล่องเก็บข้อมูล ใน Python ประกาศตัวแปรได้โดยระบุชื่อแล้วตามด้วยเครื่องหมายเท่ากับ <code>=</code> เช่น <code>score = 10</code>`,
            challenges: [
                'ประกาศตัวแปร <code style="color:#8be9fd;">score = 10</code>',
                'พิมพ์ค่าตัวแปรออกหน้าจอด้วย <code style="color:#50fa7b;">print(score)</code>'
            ],
            defaultCode: "# บทเรียนที่ 2: สร้างตัวแปร score เก็บค่า 10 และพิมพ์แสดงผล\n",
            snippets: [
                { label: "ตั้งตัวแปร", code: "score = 10" },
                { label: "พิมพ์ตัวแปร", code: "print(score)" }
            ],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/score\s*=\s*10/.test(clean) && /print\(\s*score\s*\)/.test(clean)) {
                    return { success: true, output: "10" };
                }
                return { success: false, error: "กรุณาประกาศ score = 10 และใช้ print(score)" };
            }
        },
        "3": {
            badge: "บทเรียนที่ 3: การคำนวณ",
            title: "3. การคำนวณทางคณิตศาสตร์ (Operators)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-operators" style="background:#59C059;">พูด <span class="scratch-input-pill">15 + 5</span></div>',
            pythonHtml: '<span class="python-variable">a</span> = <span class="python-number">15</span>\n<span class="python-variable">b</span> = <span class="python-number">5</span>\n<span class="python-builtin">print</span>(<span class="python-variable">a</span> + <span class="python-variable">b</span>)',
            explanation: `เราสามารถใช้ตัวดำเนินการ <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> คำนวณค่าตัวแปรได้โดยตรง`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">a = 15</code> และ <code style="color:#8be9fd;">b = 5</code>',
                'พิมพ์ผลบวกออกหน้าจอด้วย <code style="color:#50fa7b;">print(a + b)</code>'
            ],
            defaultCode: "# บทเรียนที่ 3: คำนวณผลบวกของ a และ b\na = 15\nb = 5\n",
            snippets: [{ label: "พิมพ์ผลบวก", code: "print(a + b)" }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/a\s*=\s*15/.test(clean) && /b\s*=\s*5/.test(clean) && /print\(\s*a\s*\+\s*b\s*\)/.test(clean)) {
                    return { success: true, output: "20" };
                }
                return { success: false, error: "กรุณาเขียน a = 15, b = 5 และ print(a + b)" };
            }
        },
        "4": {
            badge: "บทเรียนที่ 4: รับค่าข้อความ",
            title: "4. การรับค่าข้อมูลผ่านแป้นพิมพ์ (input)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-sensing" style="background:#4CBFE6;">ถาม <span class="scratch-input-pill" style="color:black; background:white;">คุณชื่ออะไร?</span> และรอ</div>',
            pythonHtml: '<span class="python-variable">name</span> = <span class="python-builtin">input</span>(<span class="python-string">"คุณชื่ออะไร? "</span>)\n<span class="python-builtin">print</span>(<span class="python-string">"Hello "</span> + <span class="python-variable">name</span>)',
            explanation: `คำสั่ง <strong>input()</strong> ใช้รับข้อความจากผู้ใช้งานผ่านแป้นพิมพ์`,
            challenges: [
                'รับอินพุตตั้งตัวแปร <code style="color:#8be9fd;">name = input("คุณชื่ออะไร? ")</code>',
                'พิมพ์ข้อความต้อนรับ <code style="color:#50fa7b;">print("Hello " + name)</code>'
            ],
            defaultCode: "# บทเรียนที่ 4: สอบถามชื่อผู้ใช้และแสดงคำทักทาย\n",
            snippets: [
                { label: "รับคำถาม", code: 'name = input("คุณชื่ออะไร? ")' },
                { label: "ทักทาย", code: 'print("Hello " + name)' }
            ],
            verify: (code, inputsHistory = []) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/name\s*=\s*input/.test(clean) && /print\(.*Hello.*name.*\)/.test(clean)) {
                    if (inputsHistory.length === 0) {
                        return { requestInput: true, prompt: "คุณชื่ออะไร? " };
                    } else {
                        return { success: true, output: `Hello ${inputsHistory[0]}` };
                    }
                }
                return { success: false, error: "กรุณาเขียนบรรทัดแรกเป็น name = input(...) และบรรทัดสองเป็น print(\"Hello \" + name)" };
            }
        },
        "5": {
            badge: "บทเรียนที่ 5: แปลงชนิดตัวเลข",
            title: "5. การแปลงข้อมูลเป็นตัวเลขจำนวนเต็ม (int)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-variables" style="background:#FF8C1A;">ตั้งค่า <span class="scratch-input-dropdown">age</span> เป็น <span class="scratch-input-pill">คำตอบ + 1</span></div>',
            pythonHtml: '<span class="python-variable">age</span> = <span class="python-builtin">int</span>(<span class="python-builtin">input</span>(<span class="python-string">"ป้อนอายุ: "</span>))\n<span class="python-builtin">print</span>(<span class="python-variable">age</span> + <span class="python-number">1</span>)',
            explanation: `เนื่องจาก <code>input()</code> คืนค่าเป็น String หากต้องการนำมาคำนวณ ต้องครอบด้วย <strong>int()</strong>`,
            challenges: [
                'รับค่าอายุ <code style="color:#8be9fd;">age = int(input("ป้อนอายุ: "))</code>',
                'พิมพ์อายุในปีถัดไปด้วย <code style="color:#50fa7b;">print(age + 1)</code>'
            ],
            defaultCode: "# บทเรียนที่ 5: รับค่าอายุและคำนวณบวก 1 ปี\n",
            snippets: [
                { label: "รับตัวเลข", code: 'age = int(input("ป้อนอายุ: "))' },
                { label: "พิมพ์บวก 1", code: "print(age + 1)" }
            ],
            verify: (code, inputsHistory = []) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/age\s*=\s*int\(\s*input/.test(clean) && /print\(\s*age\s*\+\s*1\s*\)/.test(clean)) {
                    if (inputsHistory.length === 0) {
                        return { requestInput: true, prompt: "ป้อนอายุของคุณ (เช่น 15): " };
                    } else {
                        const val = parseInt(inputsHistory[0]) || 15;
                        return { success: true, output: `${val + 1}` };
                    }
                }
                return { success: false, error: "กรุณาเขียน age = int(input(...)) และ print(age + 1)" };
            }
        },
        "6": {
            badge: "บทเรียนที่ 6: เงื่อนไข If-Else",
            title: "6. การเปรียบเทียบเงื่อนไขพื้นฐาน (If-Else)",
            scratchHtml: '<div class="scratch-c-wrapper"><div class="scratch-block-visual stack scratch-control scratch-c-top">ถ้า <span class="scratch-input-hexagon" style="background:#40BF50;">score >= 5</span> แล้ว</div><div class="scratch-c-body"><div class="scratch-block-visual stack scratch-looks">พูด <span class="scratch-input-pill">Pass</span></div></div><div class="scratch-block-visual stack scratch-control scratch-c-bottom">มิฉะนั้น</div><div class="scratch-c-body"><div class="scratch-block-visual stack scratch-looks">พูด <span class="scratch-input-pill">Fail</span></div></div></div>',
            pythonHtml: '<span class="python-keyword">if</span> <span class="python-variable">score</span> &gt;= <span class="python-number">5</span>:\n    <span class="python-builtin">print</span>(<span class="python-string">"Pass"</span>)\n<span class="python-keyword">else</span>:\n    <span class="python-builtin">print</span>(<span class="python-string">"Fail"</span>)',
            explanation: `คำสั่ง <code>if-else</code> ใช้เลือกทำตามเงื่อนไข อย่าลืมใส่ <code>:</code> ท้ายบรรทัดและย่อหน้าในบรรทัดถัดไป`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">score = 8</code>',
                'เขียนเงื่อนไข <code style="color:#ff79c6;">if score >= 5:</code> พิมพ์ <code style="color:#f1fa8c;">"Pass"</code> และส่วน <code style="color:#ff79c6;">else:</code> พิมพ์ <code style="color:#f1fa8c;">"Fail"</code>'
            ],
            defaultCode: "# บทเรียนที่ 6: ตรวจสอบเงื่อนไขคะแนนสอบ\nscore = 8\n",
            snippets: [{ label: "โครงสร้าง if-else", code: 'if score >= 5:\n    print("Pass")\nelse:\n    print("Fail")' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/score\s*=\s*8/.test(clean) && /if\s+score\s*>=?\s*5\s*:/.test(clean) && /else\s*:/.test(clean)) {
                    return { success: true, output: "Pass" };
                }
                return { success: false, error: "กรุณาเขียน score = 8 และโครงสร้าง if score >= 5: print(\"Pass\") else: print(\"Fail\")" };
            }
        },
        "7": {
            badge: "บทเรียนที่ 7: เงื่อนไขหลายทาง",
            title: "7. การเช็คเงื่อนไขหลายทางเลือก (Elif)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-control" style="background:#FFAB19;">ถ้า <span class="scratch-input-hexagon" style="background:#40BF50;">score >= 80</span> แล้ว ... มิฉะนั้น ถ้า ...</div>',
            pythonHtml: '<span class="python-keyword">if</span> <span class="python-variable">score</span> &gt;= <span class="python-number">80</span>:\n    <span class="python-builtin">print</span>(<span class="python-string">"Grade A"</span>)\n<span class="python-keyword">elif</span> <span class="python-variable">score</span> &gt;= <span class="python-number">70</span>:\n    <span class="python-builtin">print</span>(<span class="python-string">"Grade B"</span>)\n<span class="python-keyword">else</span>:\n    <span class="python-builtin">print</span>(<span class="python-string">"Grade C"</span>)',
            explanation: `เมื่อมีเงื่อนไขให้เลือกตรวจมากกว่า 2 ทาง เราใช้ <strong>elif</strong> แทรกระหว่างกลางได้`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">score = 75</code>',
                'เขียนเงื่อนไขตัดเกรดด้วย <code style="color:#ff79c6;">if</code>, <code style="color:#ff79c6;">elif</code>, <code style="color:#ff79c6;">else</code>'
            ],
            defaultCode: "# บทเรียนที่ 7: ตัดเกรดด้วย elif\nscore = 75\n",
            snippets: [{ label: "เงื่อนไข elif", code: 'if score >= 80:\n    print("Grade A")\nelif score >= 70:\n    print("Grade B")\nelse:\n    print("Grade C")' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/score\s*=\s*75/.test(clean) && /elif/.test(clean)) {
                    return { success: true, output: "Grade B" };
                }
                return { success: false, error: "กรุณาเขียน score = 75 และใช้คำสั่ง elif score >= 70:" };
            }
        },
        "8": {
            badge: "บทเรียนที่ 8: ตรรกศาสตร์",
            title: "8. ตัวดำเนินการทางตรรกศาสตร์ (and / or)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-operators" style="background:#59C059;"><span class="scratch-input-hexagon">age >= 12</span> และ <span class="scratch-input-hexagon">has_ticket = True</span></div>',
            pythonHtml: '<span class="python-keyword">if</span> <span class="python-variable">age</span> &gt;= <span class="python-number">12</span> <span class="python-keyword">and</span> <span class="python-variable">has_ticket</span>:\n    <span class="python-builtin">print</span>(<span class="python-string">"Allowed"</span>)',
            explanation: `คำสั่ง <strong>and</strong> จะเป็นจริงเมื่อทั้งสองเงื่อนไขเป็นจริงพร้อมกัน ส่วน <strong>or</strong> จะเป็นจริงเมื่อฝ่ายใดฝ่ายหนึ่งเป็นจริง`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">age = 15</code> และ <code style="color:#8be9fd;">has_ticket = True</code>',
                'ตรวจสอบด้วย <code style="color:#ff79c6;">if age >= 12 and has_ticket:</code> และพิมพ์ <code style="color:#50fa7b;">print("Allowed")</code>'
            ],
            defaultCode: "# บทเรียนที่ 8: เชื่อมเงื่อนไขด้วย and\nage = 15\nhas_ticket = True\n",
            snippets: [{ label: "เงื่อนไข and", code: 'if age >= 12 and has_ticket:\n    print("Allowed")' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/age\s*=\s*15/.test(clean) && /has_ticket\s*=\s*True/.test(clean) && /and/.test(clean)) {
                    return { success: true, output: "Allowed" };
                }
                return { success: false, error: "กรุณาตั้งค่า age = 15, has_ticket = True และใช้ if age >= 12 and has_ticket:" };
            }
        },
        "9": {
            badge: "บทเรียนที่ 9: เศษเหลือ Modulo",
            title: "9. ตัวหาเศษเหลือจากการหาร (Modulo %)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-operators" style="background:#59C059;"><span class="scratch-input-pill">num mod 2</span> = 0</div>',
            pythonHtml: '<span class="python-keyword">if</span> <span class="python-variable">num</span> % <span class="python-number">2</span> == <span class="python-number">0</span>:\n    <span class="python-builtin">print</span>(<span class="python-string">"Even"</span>)\n<span class="python-keyword">else</span>:\n    <span class="python-builtin">print</span>(<span class="python-string">"Odd"</span>)',
            explanation: `ตัวดำเนินการเครื่องหมายเปอร์เซ็นต์ <code>%</code> ใช้หาเศษเหลือจากการหาร นิยมใช้เช็คเลขคู่เลขคี่ (หาร 2 ลงตัว เศษ 0)`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">num = 10</code>',
                'เขียน <code style="color:#ff79c6;">if num % 2 == 0:</code> พิมพ์ <code style="color:#50fa7b;">"Even"</code> มิฉะนั้นพิมพ์ <code style="color:#50fa7b;">"Odd"</code>'
            ],
            defaultCode: "# บทเรียนที่ 9: เช็คเลขคู่หรือเลขคี่ด้วย modulo %\nnum = 10\n",
            snippets: [{ label: "เช็คเลขคู่", code: 'if num % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/num\s*=\s*10/.test(clean) && /%\s*2/.test(clean)) {
                    return { success: true, output: "Even" };
                }
                return { success: false, error: "กรุณาเขียน num = 10 และใช้เงื่อนไข if num % 2 == 0:" };
            }
        },
        "10": {
            badge: "บทเรียนที่ 10: เช็คช่วงตัวเลข",
            title: "10. การเปรียบเทียบค่าช่วงตัวเลข (Range Check)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-operators" style="background:#59C059;"><span class="scratch-input-hexagon">36.5 <= temp</span> และ <span class="scratch-input-hexagon">temp <= 37.5</span></div>',
            pythonHtml: '<span class="python-keyword">if</span> <span class="python-number">36.5</span> &lt;= <span class="python-variable">temp</span> &lt;= <span class="python-number">37.5</span>:\n    <span class="python-builtin">print</span>(<span class="python-string">"Normal"</span>)\n<span class="python-keyword">else</span>:\n    <span class="python-builtin">print</span>(<span class="python-string">"Fever"</span>)',
            explanation: `ภาษา Python พิเศษตรงที่สามารถเขียนเปรียบเทียบช่วงค่าตัวเลขแบบรวดเดียวได้ เช่น <code>36.5 <= temp <= 37.5</code>`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">temp = 37.0</code>',
                'เขียนเงื่อนไข <code style="color:#ff79c6;">if 36.5 <= temp <= 37.5:</code> พิมพ์ <code style="color:#50fa7b;">"Normal"</code> มิฉะนั้นพิมพ์ <code style="color:#50fa7b;">"Fever"</code>'
            ],
            defaultCode: "# บทเรียนที่ 10: ตรวจอุณหภูมิร่างกายช่วงปกติ\ntemp = 37.0\n",
            snippets: [{ label: "เช็คช่วงค่า", code: 'if 36.5 <= temp <= 37.5:\n    print("Normal")\nelse:\n    print("Fever")' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/temp\s*=\s*37/.test(clean) && (/(36\.5.*temp.*37\.5)/.test(clean) || /temp\s*>=?\s*36\.5/.test(clean))) {
                    return { success: true, output: "Normal" };
                }
                return { success: false, error: "กรุณาเขียน temp = 37.0 และเงื่อนไขตรวจสอบช่วง 36.5 ถึง 37.5" };
            }
        },
        "11": {
            badge: "บทเรียนที่ 11: ลูป For Loop",
            title: "11. การทำคำสั่งซ้ำระบุจำนวนรอบ (For Loop)",
            scratchHtml: '<div class="scratch-c-wrapper"><div class="scratch-block-visual stack scratch-control scratch-c-top">ทำซ้ำ <span class="scratch-input-pill">5</span> รอบ</div><div class="scratch-c-body"><div class="scratch-block-visual stack scratch-looks">พูด <span class="scratch-input-pill">Looping!</span></div></div></div>',
            pythonHtml: '<span class="python-keyword">for</span> <span class="python-variable">i</span> <span class="python-keyword">in</span> <span class="python-builtin">range</span>(<span class="python-number">5</span>):\n    <span class="python-builtin">print</span>(<span class="python-string">"Looping!"</span>)',
            explanation: `โครงสร้าง <code>for i in range(5):</code> จะทำซ้ำคำสั่งที่ร่นย่อหน้าใต้ลูปจำนวน 5 รอบ`,
            challenges: [
                'เขียนลูปทำซ้ำ 5 รอบด้วย <code style="color:#ff79c6;">for i in range(5):</code>',
                'ย่อหน้าพิมพ์ <code style="color:#50fa7b;">print("Looping!")</code>'
            ],
            defaultCode: "# บทเรียนที่ 11: เขียน for loop ทำซ้ำ 5 รอบ\n",
            snippets: [{ label: "ลูป For 5 รอบ", code: 'for i in range(5):\n    print("Looping!")' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/for\s+i\s+in\s+range\(\s*5\s*\):/.test(clean) && /Looping!/.test(clean)) {
                    return { success: true, output: "Looping!\nLooping!\nLooping!\nLooping!\nLooping!" };
                }
                return { success: false, error: "กรุณาเขียน for i in range(5): และ print(\"Looping!\")" };
            }
        },
        "12": {
            badge: "บทเรียนที่ 12: ตัวนับรอบลูป",
            title: "12. การใช้ตัวนับรอบในลูป (Loop Index i)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-control" style="background:#FFAB19;">ตั้งค่า [i] เป็น 1 ทำซ้ำ 5 รอบ (พูด i)</div>',
            pythonHtml: '<span class="python-keyword">for</span> <span class="python-variable">i</span> <span class="python-keyword">in</span> <span class="python-builtin">range</span>(<span class="python-number">1</span>, <span class="python-number">6</span>):\n    <span class="python-builtin">print</span>(<span class="python-string">"Count:"</span>, <span class="python-variable">i</span>)',
            explanation: `คำสั่ง <code>range(1, 6)</code> จะสร้างลำดับตัวเลขเริ่มจาก 1 ถึง 5 (สิ้นสุดก่อนตัวหลัง 6)`,
            challenges: [
                'เขียนลูปนับตัวเลข 1 ถึง 5 ด้วย <code style="color:#ff79c6;">for i in range(1, 6):</code>',
                'พิมพ์แสดงผลค่ารอบด้วย <code style="color:#50fa7b;">print("Count:", i)</code>'
            ],
            defaultCode: "# บทเรียนที่ 12: พิมพ์ตัวเลข 1 ถึง 5 ด้วย range(1, 6)\n",
            snippets: [{ label: "ลูป range(1,6)", code: 'for i in range(1, 6):\n    print("Count:", i)' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/range\(\s*1\s*,\s*6\s*\)/.test(clean) && /print/.test(clean)) {
                    return { success: true, output: "Count: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5" };
                }
                return { success: false, error: "กรุณาใช้ for i in range(1, 6): และ print(\"Count:\", i)" };
            }
        },
        "13": {
            badge: "บทเรียนที่ 13: ลูป While Loop",
            title: "13. การวนซ้ำตามเงื่อนไข (While Loop)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-control" style="background:#FFAB19;">วนซ้ำจนกระทั่ง <span class="scratch-input-hexagon">count = 0</span></div>',
            pythonHtml: '<span class="python-variable">count</span> = <span class="python-number">3</span>\n<span class="python-keyword">while</span> <span class="python-variable">count</span> &gt; <span class="python-number">0</span>:\n    <span class="python-builtin">print</span>(<span class="python-variable">count</span>)\n    <span class="python-variable">count</span> -= <span class="python-number">1</span>',
            explanation: `คำสั่ง <code>while</code> จะวนทำซ้ำต่อไปเรื่อยๆ ตราบใดที่เงื่อนไขยังเป็นจริงอย่าลืมลดค่าตัวแปรเพื่อป้องกันลูปไม่รู้จบ`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">count = 3</code>',
                'เขียนวนซ้ำนับถอยหลังด้วย <code style="color:#ff79c6;">while count > 0:</code> พิมพ์ <code style="color:#50fa7b;">print(count)</code> และลดค่า <code style="color:#8be9fd;">count -= 1</code>'
            ],
            defaultCode: "# บทเรียนที่ 13: นับถอยหลัง 3 ถึง 1 ด้วย while loop\ncount = 3\n",
            snippets: [{ label: "ลูป while ถอยหลัง", code: 'while count > 0:\n    print(count)\n    count -= 1' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/count\s*=\s*3/.test(clean) && /while\s+count\s*>\s*0\s*:/.test(clean) && /count\s*-=\s*1/.test(clean)) {
                    return { success: true, output: "3\n2\n1" };
                }
                return { success: false, error: "กรุณาเขียน count = 3, while count > 0: และลดค่า count -= 1" };
            }
        },
        "14": {
            badge: "บทเรียนที่ 14: ข้ามรอบ Continue",
            title: "14. การข้ามรอบลูป (Continue Statement)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-control" style="background:#FFAB19;">ข้ามคำสั่งเมื่อเงื่อนไขตรง</div>',
            pythonHtml: '<span class="python-keyword">for</span> <span class="python-variable">i</span> <span class="python-keyword">in</span> <span class="python-builtin">range</span>(<span class="python-number">1</span>, <span class="python-number">6</span>):\n    <span class="python-keyword">if</span> <span class="python-variable">i</span> == <span class="python-number">3</span>:\n        <span class="python-keyword">continue</span>\n    <span class="python-builtin">print</span>(<span class="python-variable">i</span>)',
            explanation: `คำสั่ง <strong>continue</strong> จะสั่งให้โปรแกรมกระโดดข้ามการทำงานที่เหลือในรอบปัจจุบันแล้วไปเริ่มรอบถัดไปทันที`,
            challenges: [
                'วนลูป <code style="color:#ff79c6;">for i in range(1, 6):</code>',
                'เขียน <code style="color:#ff79c6;">if i == 3: continue</code> และพิมพ์ค่า <code style="color:#50fa7b;">print(i)</code> (เพื่อข้ามเลข 3)'
            ],
            defaultCode: "# บทเรียนที่ 14: ข้ามเลข 3 ขณะวนลูป 1 ถึง 5\n",
            snippets: [{ label: "คำสั่ง continue", code: 'for i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/for\s+i\s+in\s+range/.test(clean) && /if\s+i\s*==\s*3\s*:/.test(clean) && /continue/.test(clean)) {
                    return { success: true, output: "1\n2\n4\n5" };
                }
                return { success: false, error: "กรุณาใช้ for i in range(1, 6):, if i == 3: continue และ print(i)" };
            }
        },
        "15": {
            badge: "บทเรียนที่ 15: รายการลิสต์",
            title: "15. รายการข้อมูลแบบกลุ่ม (Lists)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-variables" style="background:#FF6680;">รายการ [fruits] มี (Apple, Banana, Cherry)</div>',
            pythonHtml: '<span class="python-variable">fruits</span> = [<span class="python-string">"Apple"</span>, <span class="python-string">"Banana"</span>, <span class="python-string">"Cherry"</span>]\n<span class="python-builtin">print</span>(<span class="python-variable">fruits</span>[<span class="python-number">0</span>])',
            explanation: `ลิสต์ (List) คือโครงสร้างเก็บข้อมูลหลายๆ ชิ้นในตัวแปรเดียว ลำดับช่องข้อมูลจะเริ่มนับจากดัชนี 0 (Index 0)`,
            challenges: [
                'สร้างลิสต์ <code style="color:#8be9fd;">fruits = ["Apple", "Banana", "Cherry"]</code>',
                'ดึงข้อมูลชิ้นแรกออกมาพิมพ์ด้วย <code style="color:#50fa7b;">print(fruits[0])</code>'
            ],
            defaultCode: '# บทเรียนที่ 15: สร้างลิสต์และดึงข้อมูลช่องแรก index 0\nfruits = ["Apple", "Banana", "Cherry"]\n',
            snippets: [{ label: "พิมพ์ช่องแรก", code: "print(fruits[0])" }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/fruits\s*=\s*\[.*Apple.*\]/.test(clean) && /print\(\s*fruits\[\s*0\s*\]\s*\)/.test(clean)) {
                    return { success: true, output: "Apple" };
                }
                return { success: false, error: 'กรุณาเขียน fruits = ["Apple", "Banana", "Cherry"] และ print(fruits[0])' };
            }
        },
        "16": {
            badge: "บทเรียนที่ 16: เพิ่มข้อมูลลิสต์",
            title: "16. การเพิ่มและหาความยาวลิสต์ (append & len)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-variables" style="background:#FF6680;">เพิ่ม [Blue] ไปยัง [colors]</div>',
            pythonHtml: '<span class="python-variable">colors</span> = [<span class="python-string">"Red"</span>, <span class="python-string">"Green"</span>]\n<span class="python-variable">colors</span>.<span class="python-builtin">append</span>(<span class="python-string">"Blue"</span>)\n<span class="python-builtin">print</span>(<span class="python-builtin">len</span>(<span class="python-variable">colors</span>))',
            explanation: `ใช้เมธอด <code>.append("ข้อมูล")</code> ต่อท้ายลิสต์ และใช้ฟังก์ชัน <strong>len()</strong> นับจำนวนสมาชิกทั้งหมดในลิสต์`,
            challenges: [
                'สร้างลิสต์เริ่มต้น <code style="color:#8be9fd;">colors = ["Red", "Green"]</code>',
                'เพิ่มสีน้ำเงินด้วย <code style="color:#8be9fd;">colors.append("Blue")</code> และพิมพ์ความยาวด้วย <code style="color:#50fa7b;">print(len(colors))</code>'
            ],
            defaultCode: '# บทเรียนที่ 16: เพิ่มสมาชิกเข้าลิสต์และนับความยาว\ncolors = ["Red", "Green"]\n',
            snippets: [
                { label: "เพิ่มสี Blue", code: 'colors.append("Blue")' },
                { label: "พิมพ์ความยาว", code: "print(len(colors))" }
            ],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/colors\.append\(\s*["']Blue["']\s*\)/.test(clean) && /print\(\s*len\(\s*colors\s*\)\s*\)/.test(clean)) {
                    return { success: true, output: "3" };
                }
                return { success: false, error: 'กรุณาใช้ colors.append("Blue") และ print(len(colors))' };
            }
        },
        "17": {
            badge: "บทเรียนที่ 17: พจนานุกรม Dictionary",
            title: "17. โครงสร้างข้อมูลแบบคู่คีย์ (Dictionary)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-variables" style="background:#FF8C1A;">ตารางเก็บค่า (Key-Value)</div>',
            pythonHtml: '<span class="python-variable">student</span> = {<span class="python-string">"name"</span>: <span class="python-string">"Tigger"</span>, <span class="python-string">"score"</span>: <span class="python-number">95</span>}\n<span class="python-builtin">print</span>(<span class="python-variable">student</span>[<span class="python-string">"score"</span>])',
            explanation: `พจนานุกรม (Dictionary) ใช้ปีกกา <code>{}</code> เก็บข้อมูลคู่ <strong>Key: Value</strong> ค้นหาข้อมูลผ่านชื่อคีย์ได้ทันที`,
            challenges: [
                'ประกาศพจนานุกรม <code style="color:#8be9fd;">student = {"name": "Tigger", "score": 95}</code>',
                'ดึงค่าคะแนนพิมพ์ออกหน้าจอด้วย <code style="color:#50fa7b;">print(student["score"])</code>'
            ],
            defaultCode: '# บทเรียนที่ 17: ประกาศ Dictionary student และพิมพ์คะแนน\nstudent = {"name": "Tigger", "score": 95}\n',
            snippets: [{ label: "ดึงคีย์ score", code: 'print(student["score"])' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/student\s*=\s*\{.*score.*95.*\}/.test(clean) && /print\(\s*student\[\s*["']score["']\s*\]\s*\)/.test(clean)) {
                    return { success: true, output: "95" };
                }
                return { success: false, error: 'กรุณาเขียน student = {"name": "Tigger", "score": 95} และ print(student["score"])' };
            }
        },
        "18": {
            badge: "บทเรียนที่ 18: การสร้างฟังก์ชัน",
            title: "18. การสร้างฟังก์ชันใช้งานเอง (def)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-custom" style="background:#FF6680;">นิยามบล็อก [greet] ตัวแปร (name)</div>',
            pythonHtml: '<span class="python-keyword">def</span> <span class="python-function">greet</span>(<span class="python-variable">name</span>):\n    <span class="python-builtin">print</span>(<span class="python-string">"Hello "</span> + <span class="python-variable">name</span>)\n\n<span class="python-function">greet</span>(<span class="python-string">"Python"</span>)',
            explanation: `ฟังก์ชันช่วยรวบรวมชุดคำสั่งให้เรียกใช้ซ้ำได้สะดวก โดยขึ้นต้นประกาศด้วยคำว่า <strong>def</strong>`,
            challenges: [
                'ประกาศฟังก์ชัน <code style="color:#50fa7b;">def greet(name):</code> พิมพ์ <code style="color:#50fa7b;">print("Hello " + name)</code>',
                'เรียกใช้งานฟังก์ชันด้วยคำสั่ง <code style="color:#8be9fd;">greet("Python")</code>'
            ],
            defaultCode: "# บทเรียนที่ 18: ประกาศฟังก์ชัน greet และเรียกใช้งาน\n",
            snippets: [{ label: "สร้างฟังก์ชัน greet", code: 'def greet(name):\n    print("Hello " + name)\n\ngreet("Python")' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/def\s+greet\(\s*name\s*\):/.test(clean) && /greet\(\s*["']Python["']\s*\)/.test(clean)) {
                    return { success: true, output: "Hello Python" };
                }
                return { success: false, error: 'กรุณาเขียน def greet(name): print("Hello " + name) และเรียก greet("Python")' };
            }
        },
        "19": {
            badge: "บทเรียนที่ 19: คืนค่าฟังก์ชัน Return",
            title: "19. ฟังก์ชันการส่งคืนผลลัพธ์ (return)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-custom" style="background:#FF6680;">คืนค่าผลรวม x + y</div>',
            pythonHtml: '<span class="python-keyword">def</span> <span class="python-function">add</span>(<span class="python-variable">x</span>, <span class="python-variable">y</span>):\n    <span class="python-keyword">return</span> <span class="python-variable">x</span> + <span class="python-variable">y</span>\n\n<span class="python-builtin">print</span>(<span class="python-function">add</span>(<span class="python-number">10</span>, <span class="python-number">20</span>))',
            explanation: `คำสั่ง <strong>return</strong> ใช้ส่งค่าคำนวณจากภายในฟังก์ชันส่งกลับออกมาประมวลผลภายนอกต่อ`,
            challenges: [
                'สร้างฟังก์ชันคำนวณบวก <code style="color:#50fa7b;">def add(x, y): return x + y</code>',
                'พิมพ์ผลรวมผ่านคำสั่ง <code style="color:#8be9fd;">print(add(10, 20))</code>'
            ],
            defaultCode: "# บทเรียนที่ 19: สร้างฟังก์ชัน add คืนค่าผลรวม\n",
            snippets: [{ label: "สร้างฟังก์ชัน add", code: 'def add(x, y):\n    return x + y\n\nprint(add(10, 20))' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/def\s+add\(\s*x\s*,\s*y\s*\):/.test(clean) && /return\s+x\s*\+\s*y/.test(clean) && /add\(\s*10\s*,\s*20\s*\)/.test(clean)) {
                    return { success: true, output: "30" };
                }
                return { success: false, error: "กรุณาเขียน def add(x, y): return x + y และ print(add(10, 20))" };
            }
        },
        "20": {
            badge: "บทเรียนที่ 20: โปรเจกต์ฟังก์ชันส่วนลด",
            title: "20. โปรเจกต์สรุปทักษะฟังก์ชันส่วนลด (Final Challenge)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-custom" style="background:#FF6680;">ภารกิจสรุปทักษะ: คำนวณส่วนลด 10%</div>',
            pythonHtml: '<span class="python-keyword">def</span> <span class="python-function">calc_discount</span>(<span class="python-variable">price</span>):\n    <span class="python-keyword">return</span> <span class="python-variable">price</span> * <span class="python-number">0.9</span>\n\n<span class="python-builtin">print</span>(<span class="python-function">calc_discount</span>(<span class="python-number">100</span>))',
            explanation: `ยินดีด้วยกับบทเรียนสุดท้าย! ให้น้องๆ สร้างฟังก์ชัน <code>calc_discount(price)</code> เพื่อคำนวณราคาสินค้าหลังลด 10% (คูณ 0.9) และคืนค่าราคาใหม่กลับมา`,
            challenges: [
                'สร้างฟังก์ชันส่วนลด <code style="color:#50fa7b;">def calc_discount(price): return price * 0.9</code>',
                'ทดสอบคำนวณราคาสินค้า 100 บาท ด้วย <code style="color:#8be9fd;">print(calc_discount(100))</code>'
            ],
            defaultCode: "# บทเรียนที่ 20: สร้างฟังก์ชันคำนวณราคาหลังลด 10%\n",
            snippets: [{ label: "คำนวณส่วนลด 10%", code: 'def calc_discount(price):\n    return price * 0.9\n\nprint(calc_discount(100))' }],
            verify: (code) => {
                const clean = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
                if (/def\s+calc_discount\(\s*price\s*\):/.test(clean) && /return\s+price\s*\*\s*0\.9/.test(clean) && /calc_discount\(\s*100\s*\)/.test(clean)) {
                    return { success: true, output: "90.0" };
                }
                return { success: false, error: "กรุณาเขียน def calc_discount(price): return price * 0.9 และ print(calc_discount(100))" };
            }
        },
        "proj": {
            isProjects: true,
            badge: "คลังโปรเจกต์ตัวอย่าง",
            title: "20 โปรเจกต์ Python ตัวอย่างสำหรับนักเรียน",
            scratchHtml: "",
            pythonHtml: "",
            explanation: `
                <p style="margin-bottom:12px;">น้องๆ สามารถคลิกเลือกโปรเจกต์เรียนรู้จากรายการด่วนทั้ง 20 โปรเจกต์ด้านล่างนี้ โดยระบบจะเตรียมข้อมูลตัวอย่างและป้อนซอร์สโค้ดสำเร็จรูปจำลองลงสมุดจด (Editor) ทางขวาโดยอัตโนมัติ เพื่อให้น้องๆ ได้ลองรัน ศึกษา และดัดแปลงเล่นได้ทันที!</p>
                
                <!-- Project Selection Grid (20 Projects) -->
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:10px; margin-top:14px; max-height:200px; overflow-y:auto; padding:8px; border:1px solid var(--border-color); border-radius:10px; background:rgba(0,0,0,0.15);" id="projects-selector-grid">
                    <!-- Populated dynamically by python-learn.js -->
                </div>
                
                <!-- Currently Selected Project Details -->
                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:10px; padding:12px; margin-top:14px; display:none;" id="project-info-details-box">
                    <h4 style="color:var(--primary-orange); font-size:13px; font-family:var(--font-headers); margin-bottom:4px;" id="selected-project-title">ชื่อโปรเจกต์</h4>
                    <p style="font-size:12px !important; color:var(--text-muted) !important; line-height:1.4; margin-bottom:10px !important;" id="selected-project-desc">รายละเอียดแอปพลิเคชัน</p>
                    <button class="header-back-btn" style="padding:6px 12px; font-size:11px;" id="btn-load-project-code">
                        <i class="fa-solid fa-download"></i> โหลดโค้ดตัวอย่างลงสมุดเขียน
                    </button>
                </div>
            `,
            challenges: [
                "เลือกดูและเรียนรู้โครงสร้างโค้ดจริงจากแอปพลิเคชันสำเร็จรูปทั้ง 20 โปรเจกต์ด้านล่าง",
                "กดโหลดโค้ดลง Editor ปรับเปลี่ยนตัวแปร และกด \"รันโค้ด Python\" เพื่อทดสอบการทำงาน"
            ],
            defaultCode: "# ยินดีต้อนรับสู่คลัง 20 โปรเจกต์ตัวอย่างสำหรับนักเรียน!\n# กรุณาเลือกโครงการที่ต้องการจากรายการซ้ายมือ แล้วกดปุ่มโหลดโค้ดเพื่อเริ่มทดสอบ\n",
            snippets: [],
            verify: (code, userInput = null) => {
                return runPythonInterpreter(code, userInput);
            }
        }
    };

    // --- 3. Dynamic Rendering & Setup Engine ---

    function loadLesson(lessonId) {
        currentLessonId = lessonId;
        cleanupTerminal();
        if (btnNextLessonInline) btnNextLessonInline.style.display = 'none';
        if (btnRunCode) btnRunCode.style.display = 'block';

        const les = lessons[lessonId];
        if (!les) return;

        // Header info
        if (pageSectionTitle) pageSectionTitle.textContent = les.title;
        if (lessonTitle) lessonTitle.textContent = les.title;
        
        // Hide/Show Scratch side-by-side comparison in reference, projects or syllabus tab
        const compContainer = document.querySelector('.comparison-container');
        if (les.isReference || les.isProjects || les.isSyllabus) {
            if (compContainer) compContainer.style.display = 'none';
            lessonBadge.textContent = les.badge;
        } else {
            if (compContainer) compContainer.style.display = 'grid';
            lessonBadge.textContent = `บทเรียนที่ ${lessonId}`;
        }
        
        if (completedLessons[lessonId] || les.isReference || les.isProjects || les.isSyllabus) {
            lessonStatus.className = "mission-status-badge completed";
            lessonStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> เรียนรู้แล้ว';
        } else {
            lessonStatus.className = "mission-status-badge pending";
            lessonStatus.innerHTML = '<i class="fa-regular fa-clock"></i> รอตรวจสอบโค้ด';
        }

        // Side by Side comparisons
        if (!les.isReference && !les.isProjects && !les.isSyllabus) {
            scratchBlockRender.innerHTML = les.scratchHtml;
            pythonCodeRender.innerHTML = les.pythonHtml;
        }
        

        // Challenge and description
        explanationBody.innerHTML = les.explanation;
        
        // Populate Projects Grid if this is the projects tab
        if (les.isProjects) {
            const gridContainer = document.getElementById('projects-selector-grid');
            const detailsBox = document.getElementById('project-info-details-box');
            const projectTitle = document.getElementById('selected-project-title');
            const projectDesc = document.getElementById('selected-project-desc');
            const btnLoadCode = document.getElementById('btn-load-project-code');
            
            let selectedProject = null;
            let firstCard = null;
            
            if (gridContainer) {
                gridContainer.innerHTML = '';
                pythonProjectsDb.forEach(proj => {
                    const card = document.createElement('div');
                    
                    // Difficulty level classification and coloring
                    let iconColor = "#34d399"; // green
                    let levelText = "เริ่มต้น";
                    if ([1, 2, 3, 4, 7, 8, 11, 19].includes(proj.id)) {
                        iconColor = "#34d399";
                        levelText = "เริ่มต้น";
                    } else if ([9, 10, 12, 13, 16, 17].includes(proj.id)) {
                        iconColor = "#facc15"; // yellow
                        levelText = "ปานกลาง";
                    } else {
                        iconColor = "#38bdf8"; // blue
                        levelText = "ขั้นสูง";
                    }
                    
                    card.className = "project-grid-card-item";
                    card.style.cssText = 'background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:8px; padding:10px; cursor:pointer; text-align:center; transition:all 0.2s; font-size:11px;';
                    card.innerHTML = `<span style="font-size:8px; display:inline-block; padding:1px 4px; border-radius:4px; background:rgba(0,0,0,0.2); color:${iconColor}; margin-bottom:4px; border: 1px solid ${iconColor}22; font-weight:bold;">${levelText}</span><i class="fa-solid fa-code" style="color:${iconColor}; font-size:14px; margin-bottom:4px; display:block;"></i> <b>โปรเจกต์ ${proj.id}</b><div style="font-size:9px; color:var(--text-muted); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${proj.title.split('. ')[1]}</div>`;
                    
                    card.addEventListener('mouseenter', () => {
                        card.style.background = 'rgba(255,255,255,0.08)';
                        card.style.borderColor = iconColor;
                    });
                    card.addEventListener('mouseleave', () => {
                        if (selectedProject !== proj) {
                            card.style.background = 'rgba(255,255,255,0.03)';
                            card.style.borderColor = 'var(--border-color)';
                        }
                    });
                    
                    card.addEventListener('click', () => {
                        selectedProject = proj;
                        
                        // Highlight selected card
                        Array.from(gridContainer.children).forEach(child => {
                            child.style.background = 'rgba(255,255,255,0.03)';
                            child.style.borderColor = 'var(--border-color)';
                        });
                        card.style.background = 'rgba(48,105,152,0.15)';
                        card.style.borderColor = '#4fb8ff';
                        
                        // Show details
                        if (detailsBox) detailsBox.style.display = 'block';
                        if (projectTitle) projectTitle.textContent = proj.title;
                        if (projectDesc) projectDesc.textContent = proj.desc;
                        
                        // Auto-load code into editor immediately to improve UX!
                        if (editorInstance) editorInstance.setValue(proj.code);
                        cleanupTerminal();
                        logToTerminal(`>>> [โหลดโปรเจกต์]: โหลดโค้ด "${proj.title}" สำเร็จ! คุณสามารถพิมพ์ดัดแปลง หรือกดรันดูผลลัพธ์ได้เลย 🟢`);
                    });
                    
                    gridContainer.appendChild(card);
                    if (proj.id === 1) {
                        firstCard = card;
                    }
                });
                
                // Auto-select the first project by default on load
                if (firstCard) {
                    setTimeout(() => {
                        firstCard.click();
                    }, 50);
                }
            }
            
            if (btnLoadCode) {
                // Rename button to reflect Reset function
                btnLoadCode.innerHTML = '<i class="fa-solid fa-rotate-left"></i> รีเซ็ตโค้ดโปรเจกต์เริ่มต้น';
                
                // Clear any old event listeners by cloning
                const newBtn = btnLoadCode.cloneNode(true);
                btnLoadCode.parentNode.replaceChild(newBtn, btnLoadCode);
                
                newBtn.addEventListener('click', () => {
                    if (window.playCodeSound) window.playCodeSound('click');
                    if (selectedProject) {
                        if (editorInstance) editorInstance.setValue(selectedProject.code);
                        logToTerminal(`>>> [รีเซ็ตโค้ด]: คืนค่าโค้ดต้นฉบับสำเร็จ!`);
                    } else {
                        alert('กรุณาเลือกโปรเจกต์ตัวอย่างจากรายการด้านบนก่อนครับ');
                    }
                });
            }
        }
        
        lessonChallengeList.innerHTML = '';
        les.challenges.forEach(challenge => {
            const li = document.createElement('li');
            li.innerHTML = challenge;
            lessonChallengeList.appendChild(li);
        });

        // Load Default code in Editor only if NOT projects tab
        if (!les.isProjects) {
            if (editorInstance) editorInstance.setValue(les.defaultCode);
        }

        // Snippets helpers bar
        editorTemplatesContainer.innerHTML = '';
        les.snippets.forEach(snip => {
            const btn = document.createElement('button');
            btn.className = "btn-template-insert";
            btn.textContent = `ใส่ ${snip.label}`;
            btn.addEventListener('click', () => {
                if (window.playCodeSound) window.playCodeSound('click');
                // Insert snippet at CodeMirror cursor position
                if (editorInstance) {
                    const cursor = editorInstance.getCursor();
                    editorInstance.replaceRange(snip.code, cursor);
                    editorInstance.focus();
                } else {
                    const start = editorTextArea.selectionStart || 0;
                    const end = editorTextArea.selectionEnd || 0;
                    const val = editorTextArea.value;
                    editorTextArea.value = val.substring(0, start) + snip.code + val.substring(end);
                    editorTextArea.focus();
                }
            });
            editorTemplatesContainer.appendChild(btn);
        });

        logToTerminal(`>>> โหลดเนื้อหาบทเรียนที่ ${lessonId} สำเร็จ ยินดีต้อนรับสู่ Editor!`);
        // Line numbers managed by CodeMirror
    }

    // Output Logger to Terminal
    function logToTerminal(message, type = 'output') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        
        if (type === 'output' && !message.startsWith('>>>')) {
            line.textContent = message;
        } else {
            line.textContent = message;
        }
        
        terminalOutputBox.appendChild(line);
        terminalOutputBox.scrollTop = terminalOutputBox.scrollHeight;
    }

    // Reset Terminal Box
    function cleanupTerminal() {
        terminalOutputBox.innerHTML = '';
        terminalInputRow.style.display = 'none';
        isWaitingForInput = false;
        pendingCodeExecution = null;
        terminalPromptInputField.value = '';
        
        // Hide and clear turtle canvas animations
        if (turtleAnimTimer) {
            clearTimeout(turtleAnimTimer);
            turtleAnimTimer = null;
        }
        if (turtleCanvasBox) turtleCanvasBox.style.display = 'none';
        if (turtleLabel) turtleLabel.style.display = 'none';
        if (turtleIndicator) turtleIndicator.style.display = 'none';
    }

    let turtleAnimTimer = null;
    
    function animateTurtle(commands) {
        if (turtleAnimTimer) {
            clearTimeout(turtleAnimTimer);
            turtleAnimTimer = null;
        }
        
        if (!turtleCanvas || !turtleCanvasBox) return;
        
        // Show turtle canvas and label
        turtleCanvasBox.style.display = 'block';
        if (turtleLabel) turtleLabel.style.display = 'inline-flex';
        if (turtleIndicator) {
            turtleIndicator.style.display = 'block';
            turtleIndicator.style.left = '200px';
            turtleIndicator.style.top = '90px';
            turtleIndicator.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        }
        
        const ctx = turtleCanvas.getContext('2d');
        ctx.clearRect(0, 0, turtleCanvas.width, turtleCanvas.height);
        
        // Grid background drawing helper
        function drawGrid() {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x < turtleCanvas.width; x += 20) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, turtleCanvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < turtleCanvas.height; y += 20) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(turtleCanvas.width, y);
                ctx.stroke();
            }
        }
        
        let cmdIndex = 0;
        let currentPos = { x: 200, y: 90, angle: 0, penDown: true, color: '#a855f7', size: 2 };
        let linesHistory = [];
        
        function drawTurtleFrame() {
            if (cmdIndex >= commands.length) {
                return;
            }
            
            const cmd = commands[cmdIndex];
            cmdIndex++;
            
            if (cmd.cmd === 'init') {
                currentPos = { x: 200, y: 90, angle: 0, penDown: true, color: '#a855f7', size: 2 };
                linesHistory = [];
            } else if (cmd.cmd === 'fd') {
                let dist = cmd.arg;
                let nx = currentPos.x + dist * Math.cos(currentPos.angle * Math.PI / 180);
                let ny = currentPos.y + dist * Math.sin(currentPos.angle * Math.PI / 180);
                
                // Contain in bounds visually but allow offscreen positioning slightly
                nx = Math.max(-20, Math.min(turtleCanvas.width + 20, nx));
                ny = Math.max(-20, Math.min(turtleCanvas.height + 20, ny));
                
                if (currentPos.penDown) {
                    linesHistory.push({
                        type: 'line',
                        x1: currentPos.x, y1: currentPos.y,
                        x2: nx, y2: ny,
                        color: currentPos.color,
                        size: currentPos.size
                    });
                }
                currentPos.x = nx;
                currentPos.y = ny;
            } else if (cmd.cmd === 'bk') {
                let dist = cmd.arg;
                let nx = currentPos.x - dist * Math.cos(currentPos.angle * Math.PI / 180);
                let ny = currentPos.y - dist * Math.sin(currentPos.angle * Math.PI / 180);
                
                nx = Math.max(-20, Math.min(turtleCanvas.width + 20, nx));
                ny = Math.max(-20, Math.min(turtleCanvas.height + 20, ny));
                
                if (currentPos.penDown) {
                    linesHistory.push({
                        type: 'line',
                        x1: currentPos.x, y1: currentPos.y,
                        x2: nx, y2: ny,
                        color: currentPos.color,
                        size: currentPos.size
                    });
                }
                currentPos.x = nx;
                currentPos.y = ny;
            } else if (cmd.cmd === 'rt') {
                currentPos.angle += cmd.arg;
            } else if (cmd.cmd === 'lt') {
                currentPos.angle -= cmd.arg;
            } else if (cmd.cmd === 'pu') {
                currentPos.penDown = false;
            } else if (cmd.cmd === 'pd') {
                currentPos.penDown = true;
            } else if (cmd.cmd === 'color') {
                currentPos.color = cmd.arg;
            } else if (cmd.cmd === 'size') {
                currentPos.size = cmd.arg;
            } else if (cmd.cmd === 'circle') {
                let radius = cmd.arg;
                if (currentPos.penDown) {
                    linesHistory.push({
                        type: 'circle',
                        cx: currentPos.x,
                        cy: currentPos.y - radius,
                        r: radius,
                        color: currentPos.color,
                        size: currentPos.size
                    });
                }
            }
            
            // Render everything
            ctx.clearRect(0, 0, turtleCanvas.width, turtleCanvas.height);
            drawGrid();
            
            linesHistory.forEach(line => {
                ctx.beginPath();
                ctx.strokeStyle = line.color;
                ctx.lineWidth = line.size;
                ctx.lineCap = 'round';
                if (line.type === 'circle') {
                    // Draw arc circle
                    ctx.arc(line.cx, line.cy, line.r, 0, 2 * Math.PI);
                } else {
                    ctx.moveTo(line.x1, line.y1);
                    ctx.lineTo(line.x2, line.y2);
                }
                ctx.stroke();
            });
            
            if (turtleIndicator) {
                turtleIndicator.style.left = `${currentPos.x}px`;
                turtleIndicator.style.top = `${currentPos.y}px`;
                // Emoji points upward initially, rotate accordingly
                turtleIndicator.style.transform = `translate(-50%, -50%) rotate(${currentPos.angle}deg)`;
            }
            
            turtleAnimTimer = setTimeout(drawTurtleFrame, 150);
        }
        
        drawTurtleFrame();
    }

    // Progress bar and Sidebar update
    function updateProgress() {
        const total = Object.keys(lessons).filter(id => id !== "ref" && id !== "proj" && id !== "syllabus").length; // Exclude reference, projects and syllabus tab
        const done = Object.keys(completedLessons).filter(id => id !== "ref" && id !== "proj" && id !== "syllabus" && completedLessons[id] === true).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        progressPercentText.textContent = `${done} / ${total} (${pct}%)`;
        progressBar.style.width = `${pct}%`;

        // Update active checkmarks in menu
        menuItems.forEach(item => {
            const lesId = item.getAttribute('data-lesson');
            if (completedLessons[lesId]) {
                item.classList.add('completed');
                const check = item.querySelector('.status-icon') || document.createElement('i');
                check.className = "fa-solid fa-circle-check status-icon";
                check.style.color = "var(--scratch-green)";
                check.style.marginLeft = "auto";
                if (!item.querySelector('.status-icon')) {
                    item.appendChild(check);
                }
            }
        });
    }

            const pythonConceptQuestions = {
        "1": { q: "ข้อใดคือคำสั่งแสดงผลข้อความออกหน้าจอมาตรฐานใน Python?", options: ["print()", "console.log()", "echo()"], correct: 0 },
        "2": { q: "การสร้างตัวแปรในภาษา Python มีลักษณะเด่นอย่างไร?", options: ["ไม่ต้องระบุชนิดข้อมูลล่วงหน้า", "ต้องเขียน var นำหน้าเสมอ", "ต้องมีเครื่องหมายเซมิโคลอน ; ต่อท้าย"], correct: 0 },
        "3": { q: "ผลลัพธ์ของการคำนวณ print(15 + 5) คือเท่าใด?", options: ["20", "155", "15 + 5"], correct: 0 },
        "4": { q: "คำสั่ง input() จะรับค่าจากแป้นพิมพ์เป็นชนิดข้อมูลใดเป็นหลัก?", options: ["ข้อความ (String)", "ตัวเลขจำนวนเต็ม (Integer)", "ทศนิยม (Float)"], correct: 0 },
        "5": { q: "หากต้องการแปลงข้อมูลจาก input() ให้เป็นตัวเลขเพื่อคำนวณ ต้องใช้คำสั่งใด?", options: ["int()", "str()", "float()"], correct: 0 },
        "6": { q: "สิ่งที่ขาดไม่ได้ในบรรทัดเงื่อนไข if คือสัญลักษณ์ใด?", options: ["เครื่องหมายโคลอน :", "เครื่องหมายเซมิโคลอน ;", "วงเล็บปีกกา { }"], correct: 0 },
        "7": { q: "คำสั่ง elif มีไว้สำหรับวัตถุประสงค์ใด?", options: ["ตรวจสอบเงื่อนไขทางเลือกถัดไป", "วนซ้ำโปรแกรม", "สร้างตัวแปรใหม่"], correct: 0 },
        "8": { q: "ตัวเชื่อมทางตรรกศาสตร์ and จะเป็นจริงเมื่อใด?", options: ["เมื่อทั้งสองเงื่อนไขเป็นจริงพร้อมกัน", "เมื่อมีฝ่ายใดฝ่ายหนึ่งเป็นจริง", "เมื่อเป็นเท็จทั้งคู่"], correct: 0 },
        "9": { q: "ตัวดำเนินการ % (Modulo) ทำหน้าที่อะไร?", options: ["หาเศษเหลือจากการหาร", "หาค่าเปอร์เซ็นต์", "ยกกำลัง"], correct: 0 },
        "10": { q: "ประโยค 36.5 <= temp <= 37.5 ใน Python ทำหน้าที่อะไร?", options: ["ตรวจสอบว่าค่า temp อยู่ในช่วง 36.5 ถึง 37.5 หรือไม่", "บวกค่า temp กับ 37.5", "ตั้งค่า temp เป็น 36.5"], correct: 0 },
        "11": { q: "ลูปคำสั่ง for i in range(5): จะทำซ้ำทั้งหมดกี่รอบ?", options: ["5 รอบ", "4 รอบ", "6 รอบ"], correct: 0 },
        "12": { q: "คำสั่ง range(1, 6) จะสร้างลำดับตัวเลขอะไรบ้าง?", options: ["1, 2, 3, 4, 5", "1, 2, 3, 4, 5, 6", "0, 1, 2, 3, 4, 5"], correct: 0 },
        "13": { q: "ลูป while จะทำซ้ำจนกระทั่งเกิดสิ่งใด?", options: ["เงื่อนไขที่ตรวจสอบกลายเป็นเท็จ (False)", "วนซ้ำแค่ 10 รอบเสมอ", "เมื่อกดปุ่ม Enter"], correct: 0 },
        "14": { q: "คำสั่ง continue ภายในลูปมีหน้าที่อะไร?", options: ["กระโดดข้ามโค้ดที่เหลือในรอบนี้ไปเริ่มรอบถัดไป", "หยุดการทำงานของลูปทันที", "ลบตัวแปรออก"], correct: 0 },
        "15": { q: "ดัชนี (Index) ช่องแรกของข้อมูลใน List เริ่มต้นที่เลขอะไร?", options: ["Index 0", "Index 1", "Index -1"], correct: 0 },
        "16": { q: "เมธอดใดใช้สำหรับเพิ่มสมาชิกใหม่ต่อท้าย List?", options: [".append()", ".add()", ".push()"], correct: 0 },
        "17": { q: "โครงสร้างข้อมูลแบบ Dictionary เก็บข้อมูลในรูปแบบใด?", options: ["คู่ Key: Value", "เป็นลำดับ Index 0, 1, 2", "เก็บตัวเลขอย่างเดียว"], correct: 0 },
        "18": { q: "คำสำคัญ (Keyword) ใดใช้ขึ้นต้นในการสร้างฟังก์ชันใน Python?", options: ["def", "function", "create"], correct: 0 },
        "19": { q: "คำสั่ง return ภายในฟังก์ชันมีหน้าที่อย่างไร?", options: ["ส่งคืนผลลัพธ์คำนวณกลับไปให้ผู้เรียก", "พิมพ์ข้อความออกหน้าจอ", "ปิดโปรแกรม"], correct: 0 },
        "20": { q: "การคำนวณส่วนลด 10% ของราคาสินค้า price สามารถเขียนสมการได้อย่างไร?", options: ["price * 0.9", "price - 10", "price / 10"], correct: 0 }
    };

    // Trigger lesson success
    function triggerSuccess() {
        if (currentLessonId === "ref" || currentLessonId === "proj" || currentLessonId === "syllabus") return; // No success overlay for reference, projects or syllabus tab
        
        // Show Concept Check Quiz overlay first
        const conceptOverlay = document.getElementById('concept-overlay');
        const conceptQuestionText = document.getElementById('concept-question-text');
        const conceptOptions = document.getElementById('concept-options');
        const conceptFeedback = document.getElementById('concept-feedback');
        
        const qData = pythonConceptQuestions[currentLessonId] || {
            q: "ฟังก์ชันและโครงสร้างโค้ดมีบทบาทอย่างไร?",
            options: ["ควบคุมโปรแกรม", "แสดงความสวยงาม"],
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
                        executeSuccessFlow();
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
            executeSuccessFlow();
        }
    }

    function executeSuccessFlow() {
        completedLessons[currentLessonId] = true;
        localStorage.setItem('python_completed_lessons', JSON.stringify(completedLessons));
        
        // Sync progress with Cloud Database
        if (typeof window.syncProgressToCloud === 'function') {
            window.syncProgressToCloud();
        }
        
        lessonStatus.className = "mission-status-badge completed";
        lessonStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> เรียนรู้แล้ว';

        if (window.playCodeSound) window.playCodeSound('success');
        setTimeout(() => {
            if (btnNextLessonInline) btnNextLessonInline.style.display = 'block';
            if (btnRunCode) btnRunCode.style.display = 'none';
        }, 1500);
        logToTerminal(">>> [ระบบ]: ยินดีด้วย! โค้ดผลลัพธ์ผ่านเกณฑ์ความถูกต้องและปลดล็อกสำเร็จ 🎉", "success");
        
        updateProgress();
    }

    // Execute Written Code Mock Compiler
    function executePythonCode(isResume = false) {
        const code = editorInstance ? editorInstance.getValue() : editorTextArea.value;
        const les = lessons[currentLessonId];
        if (!les) return;

        if (!isResume) {
            inputHistory = [];
            cleanupTerminal();
            logToTerminal(">>> กำลังคอมไพล์และประมวลผลโค้ด main.py...", "input-prompt");
        }

        // Delay compile animation feel
        setTimeout(() => {
            const res = les.verify(code, inputHistory);

            if (res.requestInput) {
                // Pause compilation, show input row
                isWaitingForInput = true;
                terminalInputRow.style.display = 'flex';
                terminalPromptInputField.focus();
                logToTerminal(res.prompt, "input-prompt");
                
                // Store the callback to continue execution
                pendingCodeExecution = (inputVal) => {
                    inputHistory.push(inputVal);
                    executePythonCode(true); // resume with history
                };
                return;
            }

            if (res.success) {
                // Print output value in console
                if (res.output) {
                    logToTerminal(res.output, "output");
                }
                
                // Play animations if turtle drawing queue has commands
                if (window.turtleCommandsQueue && window.turtleCommandsQueue.length > 0) {
                    animateTurtle(window.turtleCommandsQueue);
                }
                
                triggerSuccess();
            } else {
                if (window.playCodeSound) window.playCodeSound('error');
                if (res.output) {
                    logToTerminal(res.output, "output");
                }
                if (res.error) {
                    logToTerminal(`>>> Error: ${res.error}`, "error");
                }
            }
        }, isResume ? 100 : 400);
    }

    // --- 4. Event Binding ---

    // Tab Switching
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const lesId = item.getAttribute('data-lesson');
            if (!lesId) return;

            e.preventDefault();
            if (window.playCodeSound) window.playCodeSound('click');

            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            loadLesson(lesId);
        });
    });

    // Run Code Button
    btnRunCode.addEventListener('click', () => {
        if (window.playCodeSound) window.playCodeSound('click');
        executePythonCode();
    });

    // Clear / Reset Code Button
    btnResetCode.addEventListener('click', () => {
        if (window.playCodeSound) window.playCodeSound('click');
        cleanupTerminal();
        const les = lessons[currentLessonId];
        if (les) {
            if (editorInstance) editorInstance.setValue(les.defaultCode);
        }
        logToTerminal(">>> เคลียร์สคริปต์และหน้าต่าง Console รีเซ็ตกลับค่าเริ่มต้น");
    });

    // Editor textarea listeners for line numbers removed (handled by CodeMirror)

    // Next Lesson Button inline
    if (btnNextLessonInline) {
        btnNextLessonInline.addEventListener('click', () => {
            if (window.playCodeSound) window.playCodeSound('click');
            let nextId = (parseInt(currentLessonId) + 1).toString();
            if (currentLessonId === "20") {
                nextId = "ref";
            }

            if (lessons[nextId]) {
                const nextItem = document.querySelector(`.menu-item[data-lesson="${nextId}"]`);
                if (nextItem) {
                    nextItem.click();
                }
            } else {
                alert("ยินดีด้วยครับ! น้องๆ ได้ศึกษาหัวข้อเปรียบเทียบ Scratch สู่ภาษา Python ครบถ้วนทุกข้อแล้ว เก่งมากๆ เลยครับ!");
                logToTerminal(">>> [ระบบ]: ขอแสดงความยินดีกับน้องๆ ที่พิชิตบทเรียน Python พื้นฐานได้สำเร็จ! 🏆", "success");
            }
        });
    }

    // Terminal Input Submission handler
    terminalPromptInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && isWaitingForInput && pendingCodeExecution) {
            const val = terminalPromptInputField.value;
            terminalPromptInputField.value = ''; // Clear input field value!
            logToTerminal(val, "output"); // echo output of user input
            terminalInputRow.style.display = 'none';
            isWaitingForInput = false;
            
            // Resume code execution callback
            const callback = pendingCodeExecution;
            pendingCodeExecution = null;
            callback(val);
        }
    });

    // --- Custom Python Autocomplete Hint Dictionary & Syntax Checker ---
    const PYTHON_KEYWORDS = [
        "print", "input", "int", "str", "float", "len", "append",
        "def", "return", "if", "else", "elif", "for", "while", "range",
        "in", "and", "or", "not", "True", "False", "None",
        "continue", "break", "score", "age", "name", "colors", "fruits",
        "student", "calc_discount", "count", "temp", "num", "price"
    ];

    if (window.CodeMirror) {
        CodeMirror.registerHelper("hint", "python", function(cm) {
            const cur = cm.getCursor();
            const token = cm.getTokenAt(cur);
            const start = token.start;
            const end = token.end;
            const word = token.string;

            if (!word || word.trim() === '') return null;

            const list = PYTHON_KEYWORDS.filter(k => k.toLowerCase().startsWith(word.toLowerCase()));
            if (!list.length) return null;

            return {
                list: list,
                from: CodeMirror.Pos(cur.line, start),
                to: CodeMirror.Pos(cur.line, end)
            };
        });
    }

    // --- Smart Levenshtein Distance Helper for Typo Suggestions ---
    function levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    const VALID_PYTHON_TOKENS = new Set([
        "print", "input", "int", "str", "float", "len", "type", "abs", "sum", "min", "max",
        "round", "range", "list", "dict", "tuple", "set", "append", "pop", "remove", "insert",
        "split", "join", "strip", "lower", "upper", "replace", "count", "items", "keys", "values",
        "if", "else", "elif", "for", "while", "def", "return", "import", "from", "as", "pass",
        "break", "continue", "in", "is", "and", "or", "not", "True", "False", "None", "try", "except"
    ]);

    function runRealtimeSyntaxChecker(cm) {
        // Clear previous markers & line classes
        activeSyntaxMarkers.forEach(m => m.clear());
        activeSyntaxMarkers = [];
        activeSyntaxLineClasses.forEach(h => cm.removeLineClass(h, "background", "cm-syntax-error-line"));
        activeSyntaxLineClasses = [];

        const code = cm.getValue();
        const lines = code.split("\n");
        let firstError = null;

        // Collect all user-defined variables & functions in the document
        const declaredUserVars = new Set();
        for (const m of code.matchAll(/\b([a-zA-Z_]\w*)\s*=/g)) declaredUserVars.add(m[1]);
        for (const m of code.matchAll(/def\s+([a-zA-Z_]\w*)/g)) declaredUserVars.add(m[1]);
        for (const m of code.matchAll(/for\s+([a-zA-Z_]\w*)\s+in/g)) declaredUserVars.add(m[1]);

        lines.forEach((lineText, lineIdx) => {
            const trimmed = lineText.trim();
            if (!trimmed || trimmed.startsWith("#")) return;

            // 1. Check unclosed double or single quotes
            const dQuotes = (lineText.match(/"/g) || []).length;
            const sQuotes = (lineText.match(/'/g) || []).length;
            if (dQuotes % 2 !== 0 || sQuotes % 2 !== 0) {
                if (!firstError) {
                    firstError = { line: lineIdx, msg: `เครื่องหมายคำพูด (" หรือ ') ปิดไม่ครบในบรรทัดที่ ${lineIdx + 1}` };
                }
                markSyntaxError(cm, lineIdx, 0, lineText.length);
                return;
            }

            // 2. Check unclosed parentheses
            const openP = (lineText.match(/\(/g) || []).length;
            const closeP = (lineText.match(/\)/g) || []).length;
            if (openP > closeP) {
                if (!firstError) {
                    firstError = { line: lineIdx, msg: `วงเล็บ () ปิดไม่ครบในบรรทัดที่ ${lineIdx + 1}` };
                }
                const pIdx = Math.max(0, lineText.indexOf('('));
                markSyntaxError(cm, lineIdx, pIdx, lineText.length);
                return;
            }

            // 3. Check missing colon on statement heads (if, elif, else, for, while, def)
            if (/^(if|elif|else|for|while|def)\b/.test(trimmed) && !trimmed.endsWith(":")) {
                if (!firstError) {
                    firstError = { line: lineIdx, msg: `ขาดเครื่องหมายโคลอน (:) ต่อท้ายบรรทัดที่ ${lineIdx + 1}` };
                }
                markSyntaxError(cm, lineIdx, Math.max(0, lineText.length - 3), lineText.length);
                return;
            }

            // 4. Check assignment operator '=' inside if/while condition
            if (/^(if|elif|while)\b.*[^=]=[^=]/.test(trimmed)) {
                if (!firstError) {
                    firstError = { line: lineIdx, msg: `ต้องใช้ == สำหรับเปรียบเทียบเงื่อนไข (ไม่ใช้ =) ในบรรทัดที่ ${lineIdx + 1}` };
                }
                const eqIdx = lineText.indexOf('=');
                markSyntaxError(cm, lineIdx, eqIdx, eqIdx + 1);
                return;
            }

            // 5. Check function call typos (e.g. prin("..."), inpug("..."), whil(...))
            const callMatches = lineText.matchAll(/\b([a-zA-Z_]\w*)\s*\(/g);
            for (const match of callMatches) {
                const fnName = match[1];
                if (!VALID_PYTHON_TOKENS.has(fnName) && !declaredUserVars.has(fnName)) {
                    // Find closest valid Python builtin/keyword suggestion
                    let bestMatch = "print";
                    let minDist = 99;
                    VALID_PYTHON_TOKENS.forEach(k => {
                        const dist = levenshteinDistance(fnName.toLowerCase(), k.toLowerCase());
                        if (dist < minDist) {
                            minDist = dist;
                            bestMatch = k;
                        }
                    });

                    if (!firstError) {
                        firstError = {
                            line: lineIdx,
                            msg: `สะกดคำสั่งผิด '${fnName}' (คำที่ถูกต้องคือ '${bestMatch}') ในบรรทัดที่ ${lineIdx + 1}`
                        };
                    }
                    const wStart = lineText.indexOf(fnName);
                    markSyntaxError(cm, lineIdx, wStart, wStart + fnName.length);
                }
            }

            // 6. Check common keyword spelling typos on non-function statements
            const staticTypos = {
                "prinnt": "print", "prnt": "print", "pirnt": "print", "prnit": "print", "prin": "print",
                "inpug": "input", "inpt": "input", "imput": "input",
                "whiile": "while", "whil": "while",
                "iif": "if", "eliff": "elif", "els": "else",
                "rang": "range", "ranfe": "range",
                "defa": "def", "functon": "def", "retun": "return"
            };
            const words = lineText.match(/\b[a-zA-Z_]\w*\b/g) || [];
            words.forEach(w => {
                if (staticTypos[w]) {
                    if (!firstError) {
                        firstError = { line: lineIdx, msg: `สะกดคำสั่งผิด '${w}' (คำที่ถูกต้องคือ '${staticTypos[w]}') ในบรรทัดที่ ${lineIdx + 1}` };
                    }
                    const wStart = lineText.indexOf(w);
                    markSyntaxError(cm, lineIdx, wStart, wStart + w.length);
                }
            });
        });

        // Update status bar UI
        const statusBar = document.getElementById('syntax-status-bar');
        if (statusBar) {
            if (firstError) {
                statusBar.className = "syntax-status-bar invalid";
                statusBar.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>ไวยากรณ์มีข้อผิดพลาด:</strong> ${firstError.msg}`;
            } else {
                statusBar.className = "syntax-status-bar valid";
                statusBar.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>ไวยากรณ์ถูกต้อง:</strong> พร้อมรันโค้ดประมวลผล`;
            }
        }
    }

    function markSyntaxError(cm, line, start, end) {
        const lineHandle = cm.addLineClass(line, "background", "cm-syntax-error-line");
        activeSyntaxLineClasses.push(lineHandle);
        const marker = cm.markText(
            { line: line, ch: start },
            { line: line, ch: end },
            { className: "cm-syntax-error-text" }
        );
        activeSyntaxMarkers.push(marker);
    }

    // --- 5. Initial Bootstrapping ---
    if (editorTextArea) {
        editorInstance = CodeMirror.fromTextArea(editorTextArea, {
            mode: "python",
            theme: "dracula",
            lineNumbers: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            extraKeys: {
                "Ctrl-Space": "autocomplete"
            }
        });

        // Trigger Auto-complete hint instantly when typing any letter
        editorInstance.on("inputRead", function(cm, change) {
            if (change.text.length === 1 && /[a-zA-Z._]/.test(change.text[0])) {
                CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
            }
        });

        // Real-time Syntax Checker on code change
        let syntaxTimeout = null;
        editorInstance.on("change", function(cm) {
            clearTimeout(syntaxTimeout);
            syntaxTimeout = setTimeout(() => runRealtimeSyntaxChecker(cm), 300);
        });

        // Prevent paste to encourage typing
        editorInstance.on("beforeChange", function(cm, change) {
            if (change.origin === "paste") {
                change.cancel();
                if (window.playCodeSound) window.playCodeSound('error');
                const t = document.createElement('div');
                t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1e293b;border-left:4px solid #f87171;color:white;font-size:13px;padding:12px 20px;border-radius:12px;z-index:99999;';
                t.textContent = '🚫 ไม่อนุญาตให้วาง (Paste) โค้ด กรุณาพิมพ์เองนะครับ!';
                document.body.appendChild(t);
                setTimeout(() => t.remove(), 2500);
            }
        });

        // Set initial code
        setTimeout(() => {
            if (lessons[currentLessonId]) {
                editorInstance.setValue(lessons[currentLessonId].defaultCode);
            }
            editorInstance.refresh();
            runRealtimeSyntaxChecker(editorInstance);
        }, 150);
    }

    // --- Sync Student Header Profile ---
    const headerStudentNameInput = document.getElementById('header-student-name');
    if (headerStudentNameInput) {
        const savedName = localStorage.getItem('scratch_student_name') || 
                          (localStorage.getItem('scratch_student_firstname') ? `${localStorage.getItem('scratch_student_firstname')} ${localStorage.getItem('scratch_student_lastname') || ''}`.trim() : '');
        if (savedName) {
            headerStudentNameInput.value = savedName;
        }
        headerStudentNameInput.addEventListener('input', () => {
            const val = headerStudentNameInput.value.trim();
            if (val) {
                localStorage.setItem('scratch_student_name', val);
                if (!localStorage.getItem('scratch_student_key')) {
                    const parts = val.split(' ');
                    const fn = parts[0] || val;
                    const ln = parts.slice(1).join(' ') || 'ผู้เรียน';
                    const sKey = fn.toLowerCase().replace(/\s+/g, '_') + '_' + ln.toLowerCase().replace(/\s+/g, '_');
                    localStorage.setItem('scratch_student_firstname', fn);
                    localStorage.setItem('scratch_student_lastname', ln);
                    localStorage.setItem('scratch_class_code', 'M101');
                    localStorage.setItem('scratch_student_key', sKey);
                }
            }
        });
    }

    updateProgress();
    loadLesson("syllabus");

});
