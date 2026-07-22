import sys

lessons_code = '''        "1": {
            badge: "บทเรียนที่ 1: การพิมพ์ข้อความ",
            title: "1. การพิมพ์ข้อความออกหน้าจอ (print)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-looks">พูด <span class="scratch-input-pill" style="min-width: 60px; text-align:left;">Hello Python</span> เป็นเวลา <span class="scratch-input-pill">2</span> วินาที</div>',
            pythonHtml: '<span class="python-builtin">print</span>(<span class="python-string">"Hello Python"</span>)',
            explanation: `คำสั่งมาตรฐานในภาษา Python สำหรับแสดงผลข้อความออกทางคอนโซลคือฟังก์ชัน <strong>print()</strong> โดยข้อความจะต้องอยู่ในเครื่องหมายคำพูด (Quotes)<br><br><div style='background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:10px; padding:12px; margin-top:10px;'><h4 style='color:#50fa7b; font-size:13px; font-family:var(--font-headers); margin-bottom:6px;'><i class='fa-solid fa-code'></i> รูปแบบคำสั่ง (Syntax)</h4><p style='font-size:12px !important;'><code>print("ข้อความที่ต้องการแสดง")</code></p></div>`,
            challenges: [
                'เขียนคำสั่ง <code style="color:#50fa7b;">print("Hello Python")</code> หรือ <code style="color:#50fa7b;">print("tigger")</code>',
                'กดปุ่ม "รันโค้ด Python" เพื่อตรวจเช็คผลลัพธ์'
            ],
            defaultCode: "# บทเรียนที่ 1: พิมพ์คำว่า Hello Python ออกหน้าจอ\\n",
            snippets: [{ label: "พิมพ์ข้อความ", code: 'print("Hello Python")' }],
            verify: (code) => {
                const trimmed = code.trim();
                const cleanCode = trimmed.split('\\n').filter(l => !l.trim().startsWith('#')).join('\\n').trim();
                if (/print\\(\\s*["\']Hello Python["\']\\s*\\)/.test(cleanCode)) return { success: true, output: "Hello Python" };
                if (/print\\(\\s*["\']tigger["\']\\s*\\)/.test(cleanCode)) return { success: true, output: "tigger" };
                return { success: false, error: "กรุณาใช้คำสั่ง print(\\"Hello Python\\")" };
            }
        },
        "2": {
            badge: "บทเรียนที่ 2: สร้างตัวแปร",
            title: "2. การสร้างตัวแปรและเก็บข้อมูล (Variables)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-variables" style="background:#FF8C1A;">ตั้งค่า <span class="scratch-input-dropdown" style="background:rgba(0,0,0,0.08); color:white;">score</span> เป็น <span class="scratch-input-pill">10</span></div>',
            pythonHtml: '<span class="python-variable">score</span> = <span class="python-number">10</span>\\n<span class="python-builtin">print</span>(<span class="python-variable">score</span>)',
            explanation: `ตัวแปรเป็นกล่องเก็บข้อมูล ใน Python ประกาศตัวแปรได้โดยระบุชื่อแล้วตามด้วยเครื่องหมายเท่ากับ <code>=</code> เช่น <code>score = 10</code>`,
            challenges: [
                'ประกาศตัวแปร <code style="color:#8be9fd;">score = 10</code>',
                'พิมพ์ค่าตัวแปรออกหน้าจอด้วย <code style="color:#50fa7b;">print(score)</code>'
            ],
            defaultCode: "# บทเรียนที่ 2: สร้างตัวแปร score เก็บค่า 10 และพิมพ์แสดงผล\\n",
            snippets: [
                { label: "ตั้งตัวแปร", code: "score = 10" },
                { label: "พิมพ์ตัวแปร", code: "print(score)" }
            ],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/score\\s*=\\s*10/.test(clean) && /print\\(\\s*score\\s*\\)/.test(clean)) {
                    return { success: true, output: "10" };
                }
                return { success: false, error: "กรุณาประกาศ score = 10 และใช้ print(score)" };
            }
        },
        "3": {
            badge: "บทเรียนที่ 3: การคำนวณ",
            title: "3. การคำนวณทางคณิตศาสตร์ (Operators)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-operators" style="background:#59C059;">พูด <span class="scratch-input-pill">15 + 5</span></div>',
            pythonHtml: '<span class="python-variable">a</span> = <span class="python-number">15</span>\\n<span class="python-variable">b</span> = <span class="python-number">5</span>\\n<span class="python-builtin">print</span>(<span class="python-variable">a</span> + <span class="python-variable">b</span>)',
            explanation: `เราสามารถใช้ตัวดำเนินการ <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> คำนวณค่าตัวแปรได้โดยตรง`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">a = 15</code> และ <code style="color:#8be9fd;">b = 5</code>',
                'พิมพ์ผลบวกออกหน้าจอด้วย <code style="color:#50fa7b;">print(a + b)</code>'
            ],
            defaultCode: "# บทเรียนที่ 3: คำนวณผลบวกของ a และ b\\na = 15\\nb = 5\\n",
            snippets: [{ label: "พิมพ์ผลบวก", code: "print(a + b)" }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/a\\s*=\\s*15/.test(clean) && /b\\s*=\\s*5/.test(clean) && /print\\(\\s*a\\s*\\+\\s*b\\s*\\)/.test(clean)) {
                    return { success: true, output: "20" };
                }
                return { success: false, error: "กรุณาเขียน a = 15, b = 5 และ print(a + b)" };
            }
        },
        "4": {
            badge: "บทเรียนที่ 4: รับค่าข้อความ",
            title: "4. การรับค่าข้อมูลผ่านแป้นพิมพ์ (input)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-sensing" style="background:#4CBFE6;">ถาม <span class="scratch-input-pill" style="color:black; background:white;">คุณชื่ออะไร?</span> และรอ</div>',
            pythonHtml: '<span class="python-variable">name</span> = <span class="python-builtin">input</span>(<span class="python-string">"คุณชื่ออะไร? "</span>)\\n<span class="python-builtin">print</span>(<span class="python-string">"Hello "</span> + <span class="python-variable">name</span>)',
            explanation: `คำสั่ง <strong>input()</strong> ใช้รับข้อความจากผู้ใช้งานผ่านแป้นพิมพ์`,
            challenges: [
                'รับอินพุตตั้งตัวแปร <code style="color:#8be9fd;">name = input("คุณชื่ออะไร? ")</code>',
                'พิมพ์ข้อความต้อนรับ <code style="color:#50fa7b;">print("Hello " + name)</code>'
            ],
            defaultCode: "# บทเรียนที่ 4: สอบถามชื่อผู้ใช้และแสดงคำทักทาย\\n",
            snippets: [
                { label: "รับคำถาม", code: 'name = input("คุณชื่ออะไร? ")' },
                { label: "ทักทาย", code: 'print("Hello " + name)' }
            ],
            verify: (code, inputsHistory = []) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/name\\s*=\\s*input/.test(clean) && /print\\(.*Hello.*name.*\\)/.test(clean)) {
                    if (inputsHistory.length === 0) {
                        return { requestInput: true, prompt: "คุณชื่ออะไร? " };
                    } else {
                        return { success: true, output: `Hello ${inputsHistory[0]}` };
                    }
                }
                return { success: false, error: "กรุณาเขียนบรรทัดแรกเป็น name = input(...) และบรรทัดสองเป็น print(\\"Hello \\" + name)" };
            }
        },
        "5": {
            badge: "บทเรียนที่ 5: แปลงชนิดตัวเลข",
            title: "5. การแปลงข้อมูลเป็นตัวเลขจำนวนเต็ม (int)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-variables" style="background:#FF8C1A;">ตั้งค่า <span class="scratch-input-dropdown">age</span> เป็น <span class="scratch-input-pill">คำตอบ + 1</span></div>',
            pythonHtml: '<span class="python-variable">age</span> = <span class="python-builtin">int</span>(<span class="python-builtin">input</span>(<span class="python-string">"ป้อนอายุ: "</span>))\\n<span class="python-builtin">print</span>(<span class="python-variable">age</span> + <span class="python-number">1</span>)',
            explanation: `เนื่องจาก <code>input()</code> คืนค่าเป็น String หากต้องการนำมาคำนวณ ต้องครอบด้วย <strong>int()</strong>`,
            challenges: [
                'รับค่าอายุ <code style="color:#8be9fd;">age = int(input("ป้อนอายุ: "))</code>',
                'พิมพ์อายุในปีถัดไปด้วย <code style="color:#50fa7b;">print(age + 1)</code>'
            ],
            defaultCode: "# บทเรียนที่ 5: รับค่าอายุและคำนวณบวก 1 ปี\\n",
            snippets: [
                { label: "รับตัวเลข", code: 'age = int(input("ป้อนอายุ: "))' },
                { label: "พิมพ์บวก 1", code: "print(age + 1)" }
            ],
            verify: (code, inputsHistory = []) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/age\\s*=\\s*int\\(\\s*input/.test(clean) && /print\\(\\s*age\\s*\\+\\s*1\\s*\\)/.test(clean)) {
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
            pythonHtml: '<span class="python-keyword">if</span> <span class="python-variable">score</span> &gt;= <span class="python-number">5</span>:\\n    <span class="python-builtin">print</span>(<span class="python-string">"Pass"</span>)\\n<span class="python-keyword">else</span>:\\n    <span class="python-builtin">print</span>(<span class="python-string">"Fail"</span>)',
            explanation: `คำสั่ง <code>if-else</code> ใช้เลือกทำตามเงื่อนไข อย่าลืมใส่ <code>:</code> ท้ายบรรทัดและย่อหน้าในบรรทัดถัดไป`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">score = 8</code>',
                'เขียนเงื่อนไข <code style="color:#ff79c6;">if score >= 5:</code> พิมพ์ <code style="color:#f1fa8c;">"Pass"</code> และส่วน <code style="color:#ff79c6;">else:</code> พิมพ์ <code style="color:#f1fa8c;">"Fail"</code>'
            ],
            defaultCode: "# บทเรียนที่ 6: ตรวจสอบเงื่อนไขคะแนนสอบ\\nscore = 8\\n",
            snippets: [{ label: "โครงสร้าง if-else", code: 'if score >= 5:\\n    print("Pass")\\nelse:\\n    print("Fail")' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/score\\s*=\\s*8/.test(clean) && /if\\s+score\\s*>=?\\s*5\\s*:/.test(clean) && /else\\s*:/.test(clean)) {
                    return { success: true, output: "Pass" };
                }
                return { success: false, error: "กรุณาเขียน score = 8 และโครงสร้าง if score >= 5: print(\\"Pass\\") else: print(\\"Fail\\")" };
            }
        },
        "7": {
            badge: "บทเรียนที่ 7: เงื่อนไขหลายทาง",
            title: "7. การเช็คเงื่อนไขหลายทางเลือก (Elif)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-control" style="background:#FFAB19;">ถ้า <span class="scratch-input-hexagon" style="background:#40BF50;">score >= 80</span> แล้ว ... มิฉะนั้น ถ้า ...</div>',
            pythonHtml: '<span class="python-keyword">if</span> <span class="python-variable">score</span> &gt;= <span class="python-number">80</span>:\\n    <span class="python-builtin">print</span>(<span class="python-string">"Grade A"</span>)\\n<span class="python-keyword">elif</span> <span class="python-variable">score</span> &gt;= <span class="python-number">70</span>:\\n    <span class="python-builtin">print</span>(<span class="python-string">"Grade B"</span>)\\n<span class="python-keyword">else</span>:\\n    <span class="python-builtin">print</span>(<span class="python-string">"Grade C"</span>)',
            explanation: `เมื่อมีเงื่อนไขให้เลือกตรวจมากกว่า 2 ทาง เราใช้ <strong>elif</strong> แทรกระหว่างกลางได้`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">score = 75</code>',
                'เขียนเงื่อนไขตัดเกรดด้วย <code style="color:#ff79c6;">if</code>, <code style="color:#ff79c6;">elif</code>, <code style="color:#ff79c6;">else</code>'
            ],
            defaultCode: "# บทเรียนที่ 7: ตัดเกรดด้วย elif\\nscore = 75\\n",
            snippets: [{ label: "เงื่อนไข elif", code: 'if score >= 80:\\n    print("Grade A")\\nelif score >= 70:\\n    print("Grade B")\\nelse:\\n    print("Grade C")' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/score\\s*=\\s*75/.test(clean) && /elif/.test(clean)) {
                    return { success: true, output: "Grade B" };
                }
                return { success: false, error: "กรุณาเขียน score = 75 และใช้คำสั่ง elif score >= 70:" };
            }
        },
        "8": {
            badge: "บทเรียนที่ 8: ตรรกศาสตร์",
            title: "8. ตัวดำเนินการทางตรรกศาสตร์ (and / or)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-operators" style="background:#59C059;"><span class="scratch-input-hexagon">age >= 12</span> และ <span class="scratch-input-hexagon">has_ticket = True</span></div>',
            pythonHtml: '<span class="python-keyword">if</span> <span class="python-variable">age</span> &gt;= <span class="python-number">12</span> <span class="python-keyword">and</span> <span class="python-variable">has_ticket</span>:\\n    <span class="python-builtin">print</span>(<span class="python-string">"Allowed"</span>)',
            explanation: `คำสั่ง <strong>and</strong> จะเป็นจริงเมื่อทั้งสองเงื่อนไขเป็นจริงพร้อมกัน ส่วน <strong>or</strong> จะเป็นจริงเมื่อฝ่ายใดฝ่ายหนึ่งเป็นจริง`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">age = 15</code> และ <code style="color:#8be9fd;">has_ticket = True</code>',
                'ตรวจสอบด้วย <code style="color:#ff79c6;">if age >= 12 and has_ticket:</code> และพิมพ์ <code style="color:#50fa7b;">print("Allowed")</code>'
            ],
            defaultCode: "# บทเรียนที่ 8: เชื่อมเงื่อนไขด้วย and\\nage = 15\\nhas_ticket = True\\n",
            snippets: [{ label: "เงื่อนไข and", code: 'if age >= 12 and has_ticket:\\n    print("Allowed")' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/age\\s*=\\s*15/.test(clean) && /has_ticket\\s*=\\s*True/.test(clean) && /and/.test(clean)) {
                    return { success: true, output: "Allowed" };
                }
                return { success: false, error: "กรุณาตั้งค่า age = 15, has_ticket = True และใช้ if age >= 12 and has_ticket:" };
            }
        },
        "9": {
            badge: "บทเรียนที่ 9: เศษเหลือ Modulo",
            title: "9. ตัวหาเศษเหลือจากการหาร (Modulo %)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-operators" style="background:#59C059;"><span class="scratch-input-pill">num mod 2</span> = 0</div>',
            pythonHtml: '<span class="python-keyword">if</span> <span class="python-variable">num</span> % <span class="python-number">2</span> == <span class="python-number">0</span>:\\n    <span class="python-builtin">print</span>(<span class="python-string">"Even"</span>)\\n<span class="python-keyword">else</span>:\\n    <span class="python-builtin">print</span>(<span class="python-string">"Odd"</span>)',
            explanation: `ตัวดำเนินการเครื่องหมายเปอร์เซ็นต์ <code>%</code> ใช้หาเศษเหลือจากการหาร นิยมใช้เช็คเลขคู่เลขคี่ (หาร 2 ลงตัว เศษ 0)`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">num = 10</code>',
                'เขียน <code style="color:#ff79c6;">if num % 2 == 0:</code> พิมพ์ <code style="color:#50fa7b;">"Even"</code> มิฉะนั้นพิมพ์ <code style="color:#50fa7b;">"Odd"</code>'
            ],
            defaultCode: "# บทเรียนที่ 9: เช็คเลขคู่หรือเลขคี่ด้วย modulo %\\nnum = 10\\n",
            snippets: [{ label: "เช็คเลขคู่", code: 'if num % 2 == 0:\\n    print("Even")\\nelse:\\n    print("Odd")' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/num\\s*=\\s*10/.test(clean) && /%\\s*2/.test(clean)) {
                    return { success: true, output: "Even" };
                }
                return { success: false, error: "กรุณาเขียน num = 10 และใช้เงื่อนไข if num % 2 == 0:" };
            }
        },
        "10": {
            badge: "บทเรียนที่ 10: เช็คช่วงตัวเลข",
            title: "10. การเปรียบเทียบค่าช่วงตัวเลข (Range Check)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-operators" style="background:#59C059;"><span class="scratch-input-hexagon">36.5 <= temp</span> และ <span class="scratch-input-hexagon">temp <= 37.5</span></div>',
            pythonHtml: '<span class="python-keyword">if</span> <span class="python-number">36.5</span> &lt;= <span class="python-variable">temp</span> &lt;= <span class="python-number">37.5</span>:\\n    <span class="python-builtin">print</span>(<span class="python-string">"Normal"</span>)\\n<span class="python-keyword">else</span>:\\n    <span class="python-builtin">print</span>(<span class="python-string">"Fever"</span>)',
            explanation: `ภาษา Python พิเศษตรงที่สามารถเขียนเปรียบเทียบช่วงค่าตัวเลขแบบรวดเดียวได้ เช่น <code>36.5 <= temp <= 37.5</code>`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">temp = 37.0</code>',
                'เขียนเงื่อนไข <code style="color:#ff79c6;">if 36.5 <= temp <= 37.5:</code> พิมพ์ <code style="color:#50fa7b;">"Normal"</code> มิฉะนั้นพิมพ์ <code style="color:#50fa7b;">"Fever"</code>'
            ],
            defaultCode: "# บทเรียนที่ 10: ตรวจอุณหภูมิร่างกายช่วงปกติ\\ntemp = 37.0\\n",
            snippets: [{ label: "เช็คช่วงค่า", code: 'if 36.5 <= temp <= 37.5:\\n    print("Normal")\\nelse:\\n    print("Fever")' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/temp\\s*=\\s*37/.test(clean) && (/(36\.5.*temp.*37\.5)/.test(clean) || /temp\s*>=?\s*36\.5/.test(clean))) {
                    return { success: true, output: "Normal" };
                }
                return { success: false, error: "กรุณาเขียน temp = 37.0 และเงื่อนไขตรวจสอบช่วง 36.5 ถึง 37.5" };
            }
        },
        "11": {
            badge: "บทเรียนที่ 11: ลูป For Loop",
            title: "11. การทำคำสั่งซ้ำระบุจำนวนรอบ (For Loop)",
            scratchHtml: '<div class="scratch-c-wrapper"><div class="scratch-block-visual stack scratch-control scratch-c-top">ทำซ้ำ <span class="scratch-input-pill">5</span> รอบ</div><div class="scratch-c-body"><div class="scratch-block-visual stack scratch-looks">พูด <span class="scratch-input-pill">Looping!</span></div></div></div>',
            pythonHtml: '<span class="python-keyword">for</span> <span class="python-variable">i</span> <span class="python-keyword">in</span> <span class="python-builtin">range</span>(<span class="python-number">5</span>):\\n    <span class="python-builtin">print</span>(<span class="python-string">"Looping!"</span>)',
            explanation: `โครงสร้าง <code>for i in range(5):</code> จะทำซ้ำคำสั่งที่ร่นย่อหน้าใต้ลูปจำนวน 5 รอบ`,
            challenges: [
                'เขียนลูปทำซ้ำ 5 รอบด้วย <code style="color:#ff79c6;">for i in range(5):</code>',
                'ย่อหน้าพิมพ์ <code style="color:#50fa7b;">print("Looping!")</code>'
            ],
            defaultCode: "# บทเรียนที่ 11: เขียน for loop ทำซ้ำ 5 รอบ\\n",
            snippets: [{ label: "ลูป For 5 รอบ", code: 'for i in range(5):\\n    print("Looping!")' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/for\\s+i\\s+in\\s+range\\(\\s*5\\s*\\):/.test(clean) && /Looping!/.test(clean)) {
                    return { success: true, output: "Looping!\\nLooping!\\nLooping!\\nLooping!\\nLooping!" };
                }
                return { success: false, error: "กรุณาเขียน for i in range(5): และ print(\\"Looping!\\")" };
            }
        },
        "12": {
            badge: "บทเรียนที่ 12: ตัวนับรอบลูป",
            title: "12. การใช้ตัวนับรอบในลูป (Loop Index i)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-control" style="background:#FFAB19;">ตั้งค่า [i] เป็น 1 ทำซ้ำ 5 รอบ (พูด i)</div>',
            pythonHtml: '<span class="python-keyword">for</span> <span class="python-variable">i</span> <span class="python-keyword">in</span> <span class="python-builtin">range</span>(<span class="python-number">1</span>, <span class="python-number">6</span>):\\n    <span class="python-builtin">print</span>(<span class="python-string">"Count:"</span>, <span class="python-variable">i</span>)',
            explanation: `คำสั่ง <code>range(1, 6)</code> จะสร้างลำดับตัวเลขเริ่มจาก 1 ถึง 5 (สิ้นสุดก่อนตัวหลัง 6)`,
            challenges: [
                'เขียนลูปนับตัวเลข 1 ถึง 5 ด้วย <code style="color:#ff79c6;">for i in range(1, 6):</code>',
                'พิมพ์แสดงผลค่ารอบด้วย <code style="color:#50fa7b;">print("Count:", i)</code>'
            ],
            defaultCode: "# บทเรียนที่ 12: พิมพ์ตัวเลข 1 ถึง 5 ด้วย range(1, 6)\\n",
            snippets: [{ label: "ลูป range(1,6)", code: 'for i in range(1, 6):\\n    print("Count:", i)' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/range\\(\\s*1\\s*,\\s*6\\s*\\)/.test(clean) && /print/.test(clean)) {
                    return { success: true, output: "Count: 1\\nCount: 2\\nCount: 3\\nCount: 4\\nCount: 5" };
                }
                return { success: false, error: "กรุณาใช้ for i in range(1, 6): และ print(\\"Count:\\", i)" };
            }
        },
        "13": {
            badge: "บทเรียนที่ 13: ลูป While Loop",
            title: "13. การวนซ้ำตามเงื่อนไข (While Loop)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-control" style="background:#FFAB19;">วนซ้ำจนกระทั่ง <span class="scratch-input-hexagon">count = 0</span></div>',
            pythonHtml: '<span class="python-variable">count</span> = <span class="python-number">3</span>\\n<span class="python-keyword">while</span> <span class="python-variable">count</span> &gt; <span class="python-number">0</span>:\\n    <span class="python-builtin">print</span>(<span class="python-variable">count</span>)\\n    <span class="python-variable">count</span> -= <span class="python-number">1</span>',
            explanation: `คำสั่ง <code>while</code> จะวนทำซ้ำต่อไปเรื่อยๆ ตราบใดที่เงื่อนไขยังเป็นจริงอย่าลืมลดค่าตัวแปรเพื่อป้องกันลูปไม่รู้จบ`,
            challenges: [
                'ตั้งค่า <code style="color:#8be9fd;">count = 3</code>',
                'เขียนวนซ้ำนับถอยหลังด้วย <code style="color:#ff79c6;">while count > 0:</code> พิมพ์ <code style="color:#50fa7b;">print(count)</code> และลดค่า <code style="color:#8be9fd;">count -= 1</code>'
            ],
            defaultCode: "# บทเรียนที่ 13: นับถอยหลัง 3 ถึง 1 ด้วย while loop\\ncount = 3\\n",
            snippets: [{ label: "ลูป while ถอยหลัง", code: 'while count > 0:\\n    print(count)\\n    count -= 1' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/count\\s*=\\s*3/.test(clean) && /while\\s+count\\s*>\\s*0\\s*:/.test(clean) && /count\\s*-=\\s*1/.test(clean)) {
                    return { success: true, output: "3\\n2\\n1" };
                }
                return { success: false, error: "กรุณาเขียน count = 3, while count > 0: และลดค่า count -= 1" };
            }
        },
        "14": {
            badge: "บทเรียนที่ 14: ข้ามรอบ Continue",
            title: "14. การข้ามรอบลูป (Continue Statement)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-control" style="background:#FFAB19;">ข้ามคำสั่งเมื่อเงื่อนไขตรง</div>',
            pythonHtml: '<span class="python-keyword">for</span> <span class="python-variable">i</span> <span class="python-keyword">in</span> <span class="python-builtin">range</span>(<span class="python-number">1</span>, <span class="python-number">6</span>):\\n    <span class="python-keyword">if</span> <span class="python-variable">i</span> == <span class="python-number">3</span>:\\n        <span class="python-keyword">continue</span>\\n    <span class="python-builtin">print</span>(<span class="python-variable">i</span>)',
            explanation: `คำสั่ง <strong>continue</strong> จะสั่งให้โปรแกรมกระโดดข้ามการทำงานที่เหลือในรอบปัจจุบันแล้วไปเริ่มรอบถัดไปทันที`,
            challenges: [
                'วนลูป <code style="color:#ff79c6;">for i in range(1, 6):</code>',
                'เขียน <code style="color:#ff79c6;">if i == 3: continue</code> และพิมพ์ค่า <code style="color:#50fa7b;">print(i)</code> (เพื่อข้ามเลข 3)'
            ],
            defaultCode: "# บทเรียนที่ 14: ข้ามเลข 3 ขณะวนลูป 1 ถึง 5\\n",
            snippets: [{ label: "คำสั่ง continue", code: 'for i in range(1, 6):\\n    if i == 3:\\n        continue\\n    print(i)' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/for\\s+i\\s+in\\s+range/.test(clean) && /if\\s+i\\s*==\\s*3\\s*:/.test(clean) && /continue/.test(clean)) {
                    return { success: true, output: "1\\n2\\n4\\n5" };
                }
                return { success: false, error: "กรุณาใช้ for i in range(1, 6):, if i == 3: continue และ print(i)" };
            }
        },
        "15": {
            badge: "บทเรียนที่ 15: รายการลิสต์",
            title: "15. รายการข้อมูลแบบกลุ่ม (Lists)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-variables" style="background:#FF6680;">รายการ [fruits] มี (Apple, Banana, Cherry)</div>',
            pythonHtml: '<span class="python-variable">fruits</span> = [<span class="python-string">"Apple"</span>, <span class="python-string">"Banana"</span>, <span class="python-string">"Cherry"</span>]\\n<span class="python-builtin">print</span>(<span class="python-variable">fruits</span>[<span class="python-number">0</span>])',
            explanation: `ลิสต์ (List) คือโครงสร้างเก็บข้อมูลหลายๆ ชิ้นในตัวแปรเดียว ลำดับช่องข้อมูลจะเริ่มนับจากดัชนี 0 (Index 0)`,
            challenges: [
                'สร้างลิสต์ <code style="color:#8be9fd;">fruits = ["Apple", "Banana", "Cherry"]</code>',
                'ดึงข้อมูลชิ้นแรกออกมาพิมพ์ด้วย <code style="color:#50fa7b;">print(fruits[0])</code>'
            ],
            defaultCode: '# บทเรียนที่ 15: สร้างลิสต์และดึงข้อมูลช่องแรก index 0\\nfruits = ["Apple", "Banana", "Cherry"]\\n',
            snippets: [{ label: "พิมพ์ช่องแรก", code: "print(fruits[0])" }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/fruits\\s*=\\s*\\[.*Apple.*\\]/.test(clean) && /print\\(\\s*fruits\\[\\s*0\\s*\\]\\s*\\)/.test(clean)) {
                    return { success: true, output: "Apple" };
                }
                return { success: false, error: 'กรุณาเขียน fruits = ["Apple", "Banana", "Cherry"] และ print(fruits[0])' };
            }
        },
        "16": {
            badge: "บทเรียนที่ 16: เพิ่มข้อมูลลิสต์",
            title: "16. การเพิ่มและหาความยาวลิสต์ (append & len)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-variables" style="background:#FF6680;">เพิ่ม [Blue] ไปยัง [colors]</div>',
            pythonHtml: '<span class="python-variable">colors</span> = [<span class="python-string">"Red"</span>, <span class="python-string">"Green"</span>]\\n<span class="python-variable">colors</span>.<span class="python-builtin">append</span>(<span class="python-string">"Blue"</span>)\\n<span class="python-builtin">print</span>(<span class="python-builtin">len</span>(<span class="python-variable">colors</span>))',
            explanation: `ใช้เมธอด <code>.append("ข้อมูล")</code> ต่อท้ายลิสต์ และใช้ฟังก์ชัน <strong>len()</strong> นับจำนวนสมาชิกทั้งหมดในลิสต์`,
            challenges: [
                'สร้างลิสต์เริ่มต้น <code style="color:#8be9fd;">colors = ["Red", "Green"]</code>',
                'เพิ่มสีน้ำเงินด้วย <code style="color:#8be9fd;">colors.append("Blue")</code> และพิมพ์ความยาวด้วย <code style="color:#50fa7b;">print(len(colors))</code>'
            ],
            defaultCode: '# บทเรียนที่ 16: เพิ่มสมาชิกเข้าลิสต์และนับความยาว\\ncolors = ["Red", "Green"]\\n',
            snippets: [
                { label: "เพิ่มสี Blue", code: 'colors.append("Blue")' },
                { label: "พิมพ์ความยาว", code: "print(len(colors))" }
            ],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/colors\\.append\\(\\s*["\']Blue["\']\\s*\\)/.test(clean) && /print\\(\\s*len\\(\\s*colors\\s*\\)\\s*\\)/.test(clean)) {
                    return { success: true, output: "3" };
                }
                return { success: false, error: 'กรุณาใช้ colors.append("Blue") และ print(len(colors))' };
            }
        },
        "17": {
            badge: "บทเรียนที่ 17: พจนานุกรม Dictionary",
            title: "17. โครงสร้างข้อมูลแบบคู่คีย์ (Dictionary)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-variables" style="background:#FF8C1A;">ตารางเก็บค่า (Key-Value)</div>',
            pythonHtml: '<span class="python-variable">student</span> = {<span class="python-string">"name"</span>: <span class="python-string">"Tigger"</span>, <span class="python-string">"score"</span>: <span class="python-number">95</span>}\\n<span class="python-builtin">print</span>(<span class="python-variable">student</span>[<span class="python-string">"score"</span>])',
            explanation: `พจนานุกรม (Dictionary) ใช้ปีกกา <code>{}</code> เก็บข้อมูลคู่ <strong>Key: Value</strong> ค้นหาข้อมูลผ่านชื่อคีย์ได้ทันที`,
            challenges: [
                'ประกาศพจนานุกรม <code style="color:#8be9fd;">student = {"name": "Tigger", "score": 95}</code>',
                'ดึงค่าคะแนนพิมพ์ออกหน้าจอด้วย <code style="color:#50fa7b;">print(student["score"])</code>'
            ],
            defaultCode: '# บทเรียนที่ 17: ประกาศ Dictionary student และพิมพ์คะแนน\\nstudent = {"name": "Tigger", "score": 95}\\n',
            snippets: [{ label: "ดึงคีย์ score", code: 'print(student["score"])' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/student\\s*=\\s*\\{.*score.*95.*\\}/.test(clean) && /print\\(\\s*student\\[\\s*["\']score["\']\\s*\\]\\s*\\)/.test(clean)) {
                    return { success: true, output: "95" };
                }
                return { success: false, error: 'กรุณาเขียน student = {"name": "Tigger", "score": 95} และ print(student["score"])' };
            }
        },
        "18": {
            badge: "บทเรียนที่ 18: การสร้างฟังก์ชัน",
            title: "18. การสร้างฟังก์ชันใช้งานเอง (def)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-custom" style="background:#FF6680;">นิยามบล็อก [greet] ตัวแปร (name)</div>',
            pythonHtml: '<span class="python-keyword">def</span> <span class="python-function">greet</span>(<span class="python-variable">name</span>):\\n    <span class="python-builtin">print</span>(<span class="python-string">"Hello "</span> + <span class="python-variable">name</span>)\\n\\n<span class="python-function">greet</span>(<span class="python-string">"Python"</span>)',
            explanation: `ฟังก์ชันช่วยรวบรวมชุดคำสั่งให้เรียกใช้ซ้ำได้สะดวก โดยขึ้นต้นประกาศด้วยคำว่า <strong>def</strong>`,
            challenges: [
                'ประกาศฟังก์ชัน <code style="color:#50fa7b;">def greet(name):</code> พิมพ์ <code style="color:#50fa7b;">print("Hello " + name)</code>',
                'เรียกใช้งานฟังก์ชันด้วยคำสั่ง <code style="color:#8be9fd;">greet("Python")</code>'
            ],
            defaultCode: "# บทเรียนที่ 18: ประกาศฟังก์ชัน greet และเรียกใช้งาน\\n",
            snippets: [{ label: "สร้างฟังก์ชัน greet", code: 'def greet(name):\\n    print("Hello " + name)\\n\\ngreet("Python")' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/def\\s+greet\\(\\s*name\\s*\\):/.test(clean) && /greet\\(\\s*["\']Python["\']\\s*\\)/.test(clean)) {
                    return { success: true, output: "Hello Python" };
                }
                return { success: false, error: 'กรุณาเขียน def greet(name): print("Hello " + name) และเรียก greet("Python")' };
            }
        },
        "19": {
            badge: "บทเรียนที่ 19: คืนค่าฟังก์ชัน Return",
            title: "19. ฟังก์ชันการส่งคืนผลลัพธ์ (return)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-custom" style="background:#FF6680;">คืนค่าผลรวม x + y</div>',
            pythonHtml: '<span class="python-keyword">def</span> <span class="python-function">add</span>(<span class="python-variable">x</span>, <span class="python-variable">y</span>):\\n    <span class="python-keyword">return</span> <span class="python-variable">x</span> + <span class="python-variable">y</span>\\n\\n<span class="python-builtin">print</span>(<span class="python-function">add</span>(<span class="python-number">10</span>, <span class="python-number">20</span>))',
            explanation: `คำสั่ง <strong>return</strong> ใช้ส่งค่าคำนวณจากภายในฟังก์ชันส่งกลับออกมาประมวลผลภายนอกต่อ`,
            challenges: [
                'สร้างฟังก์ชันคำนวณบวก <code style="color:#50fa7b;">def add(x, y): return x + y</code>',
                'พิมพ์ผลรวมผ่านคำสั่ง <code style="color:#8be9fd;">print(add(10, 20))</code>'
            ],
            defaultCode: "# บทเรียนที่ 19: สร้างฟังก์ชัน add คืนค่าผลรวม\\n",
            snippets: [{ label: "สร้างฟังก์ชัน add", code: 'def add(x, y):\\n    return x + y\\n\\nprint(add(10, 20))' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/def\\s+add\\(\\s*x\\s*,\\s*y\\s*\\):/.test(clean) && /return\\s+x\\s*\\+\\s*y/.test(clean) && /add\\(\\s*10\\s*,\\s*20\\s*\\)/.test(clean)) {
                    return { success: true, output: "30" };
                }
                return { success: false, error: "กรุณาเขียน def add(x, y): return x + y และ print(add(10, 20))" };
            }
        },
        "20": {
            badge: "บทเรียนที่ 20: โปรเจกต์ฟังก์ชันส่วนลด",
            title: "20. โปรเจกต์สรุปทักษะฟังก์ชันส่วนลด (Final Challenge)",
            scratchHtml: '<div class="scratch-block-visual stack scratch-custom" style="background:#FF6680;">ภารกิจสรุปทักษะ: คำนวณส่วนลด 10%</div>',
            pythonHtml: '<span class="python-keyword">def</span> <span class="python-function">calc_discount</span>(<span class="python-variable">price</span>):\\n    <span class="python-keyword">return</span> <span class="python-variable">price</span> * <span class="python-number">0.9</span>\\n\\n<span class="python-builtin">print</span>(<span class="python-function">calc_discount</span>(<span class="python-number">100</span>))',
            explanation: `ยินดีด้วยกับบทเรียนสุดท้าย! ให้น้องๆ สร้างฟังก์ชัน <code>calc_discount(price)</code> เพื่อคำนวณราคาสินค้าหลังลด 10% (คูณ 0.9) และคืนค่าราคาใหม่กลับมา`,
            challenges: [
                'สร้างฟังก์ชันส่วนลด <code style="color:#50fa7b;">def calc_discount(price): return price * 0.9</code>',
                'ทดสอบคำนวณราคาสินค้า 100 บาท ด้วย <code style="color:#8be9fd;">print(calc_discount(100))</code>'
            ],
            defaultCode: "# บทเรียนที่ 20: สร้างฟังก์ชันคำนวณราคาหลังลด 10%\\n",
            snippets: [{ label: "คำนวณส่วนลด 10%", code: 'def calc_discount(price):\\n    return price * 0.9\\n\\nprint(calc_discount(100))' }],
            verify: (code) => {
                const clean = code.split('\\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\\n');
                if (/def\\s+calc_discount\\(\\s*price\\s*\\):/.test(clean) && /return\\s+price\\s*\\*\\s*0\\.9/.test(clean) && /calc_discount\\(\\s*100\\s*\\)/.test(clean)) {
                    return { success: true, output: "90.0" };
                }
                return { success: false, error: "กรุณาเขียน def calc_discount(price): return price * 0.9 และ print(calc_discount(100))" };
            }
        },'''

syllabus_html = '''        "syllabus": {
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
            defaultCode: "# ยินดีต้อนรับสู่หลักสูตร Python Academy 20 บทเรียน!\\n# คลิกเลือกบทเรียนด้านซ้ายเพื่อเริ่มศึกษาและทดสอบรันโค้ดได้เลยครับ\\n",
            snippets: [],
            verify: (code, userInput = null) => {
                return { success: true, output: "ยินดีต้อนรับสู่หน้าสารบัญ 20 บทเรียน Python!" };
            }
        },'''

concept_questions_code = '''    const pythonConceptQuestions = {
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
    };'''

with open('python-learn.js', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = 'const lessons = {'
end_marker = '"proj": {'

p1 = content.find(start_marker)
p2 = content.find(end_marker, p1)

if p1 != -1 and p2 != -1:
    new_content = content[:p1 + len(start_marker)] + '\n' + syllabus_html + '\n' + lessons_code + '\n        ' + content[p2:]
    
    q_start = 'const pythonConceptQuestions = {'
    q_end = '};'
    qp1 = new_content.find(q_start)
    qp2 = new_content.find(q_end, qp1)
    
    if qp1 != -1 and qp2 != -1:
        new_content = new_content[:qp1] + concept_questions_code + new_content[qp2 + 2:]
        
    new_content = new_content.replace('if (currentLessonId === "5") {', 'if (currentLessonId === "20") {')
    
    with open('python-learn.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced python-learn.js content!")
else:
    print("Markers not found!")
