/**
 * =====================================================
 * Python Academy Adventure - Main Game Script
 * =====================================================
 * RPG + Coding Challenge game to teach Python
 * Uses Pyodide to run real Python in the browser
 * Uses CodeMirror for syntax-highlighted code editor
 * All data saved to LocalStorage
 * =====================================================
 */

// ============================================================
// SECTION 1: GAME DATA - Levels, NPCs, Achievements
// ============================================================

/** All 12 levels with content, examples, default code, hints, answers, and auto-grader */
const LEVELS = {
    1: {
        id: 1,
        title: "Level 1: print() - เธชเธฑเนเธเธเธดเธกเธเนเธเนเธญเธเธงเธฒเธก",
        topic: "print()",
        instruction: `เธเธณเธชเธฑเนเธ <code>print()</code> เนเธเนเนเธชเธ”เธเธเนเธญเธเธงเธฒเธกเธญเธญเธเธ—เธฒเธเธซเธเนเธฒเธเธญ<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เธเธดเธกเธเนเธเธณเธงเนเธฒ <code>Hello World</code> เธญเธญเธเธกเธฒ`,
        example: `print("Hello World")`,
        defaultCode: `# เน€เธเธตเธขเธเธเธณเธชเธฑเนเธ print เธ”เนเธฒเธเธฅเนเธฒเธเธเธตเน\n`,
        hint: "เนเธเน print(\"Hello World\") เนเธ”เธขเนเธชเนเน€เธเธฃเธทเนเธญเธเธซเธกเธฒเธขเธเธณเธเธนเธ”เธเธฃเธญเธเธเนเธญเธเธงเธฒเธก",
        answer: `print("Hello World")`,
        expReward: 50,
        coinReward: 20,
        checkResult: (code, output) => {
            if (output.trim() === "Hello World") return { success: true, msg: "เน€เธขเธตเนเธขเธกเธกเธฒเธ! เธเธธเธ“เนเธชเธ”เธเธเนเธญเธเธงเธฒเธกเนเธ”เนเนเธฅเนเธง ๐" };
            return { success: false, msg: "เธเนเธญเธเธงเธฒเธกเธขเธฑเธเนเธกเนเธ•เธฃเธ เธฅเธญเธเธเธดเธกเธเน Hello World เนเธซเนเธ–เธนเธเธ•เนเธญเธเธ—เธฑเนเธเธ•เธฑเธงเธเธดเธกเธเนเน€เธฅเนเธเนเธฅเธฐเนเธซเธเน" };
        }
    },
    2: {
        id: 2,
        title: "Level 2: เธ•เธฑเธงเนเธเธฃ (Variables)",
        topic: "Variables",
        instruction: `เธ•เธฑเธงเนเธเธฃเธเธทเธญ "เธเธฅเนเธญเธเน€เธเนเธเธเธญเธ" เธชเธณเธซเธฃเธฑเธเน€เธเนเธเธเนเธญเธกเธนเธฅ<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เธชเธฃเนเธฒเธเธ•เธฑเธงเนเธเธฃ <code>name</code> เน€เธเนเธเธเธทเนเธญเธเธญเธเธเธธเธ“ เนเธฅเนเธง print เธญเธญเธเธกเธฒ`,
        example: `name = "เธชเธกเธเธฒเธข"\nprint(name)`,
        defaultCode: `# เธชเธฃเนเธฒเธเธ•เธฑเธงเนเธเธฃ name เนเธฅเนเธง print เธญเธญเธเธกเธฒ\nname = ""\nprint(name)\n`,
        hint: "เนเธชเนเธเธทเนเธญเนเธงเนเนเธเน€เธเธฃเธทเนเธญเธเธซเธกเธฒเธขเธเธณเธเธนเธ” เน€เธเนเธ name = \"Tigger\"",
        answer: `name = "Tigger"\nprint(name)`,
        expReward: 50,
        coinReward: 20,
        checkResult: (code, output) => {
            if (code.includes("name") && code.includes("print") && output.trim().length > 0 && output.trim() !== "") {
                return { success: true, msg: "เธขเธญเธ”เน€เธขเธตเนเธขเธก! เธเธธเธ“เธฃเธนเนเธเธฑเธเธ•เธฑเธงเนเธเธฃเนเธฅเนเธง ๐“ฆ" };
            }
            return { success: false, msg: "เธ•เนเธญเธเธชเธฃเนเธฒเธเธ•เธฑเธงเนเธเธฃ name เนเธชเนเธเธทเนเธญ เนเธฅเนเธงเนเธเน print(name) เธเธฐ" };
        }
    },
    3: {
        id: 3,
        title: "Level 3: input() - เธฃเธฑเธเธเนเธญเธกเธนเธฅเธเธฒเธเธเธนเนเนเธเน",
        topic: "input()",
        instruction: `<code>input()</code> เนเธเนเธฃเธฑเธเธเนเธญเธกเธนเธฅเธเธฒเธเธเธตเธขเนเธเธญเธฃเนเธ”<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เธเธณเธซเธเธ” <code>age = 15</code> เนเธฅเนเธงเธเธดเธกเธเนเธเนเธฒ age เธญเธญเธเธกเธฒ`,
        example: `age = 15\nprint(age)`,
        defaultCode: `# เธเธณเธซเธเธ”เธเนเธฒ age เนเธฅเนเธง print เธญเธญเธเธกเธฒ\n`,
        hint: "เธเธดเธกเธเน age = 15 เธเธฃเธฃเธ—เธฑเธ”เนเธฃเธ เนเธฅเนเธง print(age) เธเธฃเธฃเธ—เธฑเธ”เธ–เธฑเธ”เนเธ",
        answer: `age = 15\nprint(age)`,
        expReward: 60,
        coinReward: 25,
        checkResult: (code, output) => {
            if (output.trim() === "15") return { success: true, msg: "เน€เธเนเธเธกเธฒเธ! เธเธธเธ“เน€เธเนเธฒเนเธเธเธฒเธฃเน€เธเนเธเนเธฅเธฐเนเธชเธ”เธเธเนเธฒเนเธฅเนเธง ๐ฏ" };
            return { success: false, msg: "เธเธฅเธฅเธฑเธเธเนเธ•เนเธญเธเน€เธเนเธ 15 เธฅเธญเธเธ•เธฃเธงเธเธชเธญเธเธ•เธฑเธงเนเธเธฃ age" };
        }
    },
    4: {
        id: 4,
        title: "Level 4: if - เน€เธเธทเนเธญเธเนเธ",
        topic: "if",
        instruction: `เธเธณเธชเธฑเนเธ <code>if</code> เนเธเนเธ•เธฃเธงเธเธชเธญเธเน€เธเธทเนเธญเธเนเธ เธ–เนเธฒเน€เธเนเธเธเธฃเธดเธเธเนเธ—เธณเธเธฒเธ<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เธ–เนเธฒ score เธกเธฒเธเธเธงเนเธฒ 5 เนเธซเนเธเธดเธกเธเน "Pass"`,
        example: `score = 10\nif score > 5:\n    print("Pass")`,
        defaultCode: `score = 10\n# เน€เธเธตเธขเธเน€เธเธทเนเธญเธเนเธ if เธ”เนเธฒเธเธฅเนเธฒเธ\n`,
        hint: "เนเธเน if score > 5: เนเธฅเนเธงเธขเนเธญเธซเธเนเธฒเน€เธเนเธฒเนเธ 4 เธเนเธญเธ เธเธดเธกเธเน print(\"Pass\")",
        answer: `score = 10\nif score > 5:\n    print("Pass")`,
        expReward: 70,
        coinReward: 30,
        checkResult: (code, output) => {
            if (output.trim() === "Pass" && code.includes("if")) return { success: true, msg: "เธ–เธนเธเธ•เนเธญเธ! เธเธธเธ“เน€เธเนเธฒเนเธ if เนเธฅเนเธง โ…" };
            return { success: false, msg: "เธ•เนเธญเธเนเธเน if เน€เธเนเธเธเนเธฒ score > 5 เนเธฅเนเธง print(\"Pass\")" };
        }
    },
    5: {
        id: 5,
        title: "Level 5: if-else - เธชเธญเธเธ—เธฒเธเน€เธฅเธทเธญเธ",
        topic: "if-else",
        instruction: `<code>else</code> เธเธทเธญเธชเธดเนเธเธ—เธตเนเธเธฐเธ—เธณเน€เธกเธทเนเธญเน€เธเธทเนเธญเธเนเธ if เนเธกเนเน€เธเนเธเธเธฃเธดเธ<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เธ–เนเธฒ score >= 50 เธเธดเธกเธเน "เธเนเธฒเธ" เธ–เนเธฒเนเธกเนเนเธเนเนเธซเนเธเธดเธกเธเน "เนเธกเนเธเนเธฒเธ"<br>เธเธณเธซเธเธ”เนเธซเน score = 80`,
        example: `score = 80\nif score >= 50:\n    print("เธเนเธฒเธ")\nelse:\n    print("เนเธกเนเธเนเธฒเธ")`,
        defaultCode: `score = 80\n# เน€เธเธตเธขเธ if-else เธ”เนเธฒเธเธฅเนเธฒเธ\n`,
        hint: "เนเธเน if score >= 50: เธ•เธฒเธกเธ”เนเธงเธข else: เธญเธขเนเธฒเธฅเธทเธกเธขเนเธญเธซเธเนเธฒ",
        answer: `score = 80\nif score >= 50:\n    print("เธเนเธฒเธ")\nelse:\n    print("เนเธกเนเธเนเธฒเธ")`,
        expReward: 70,
        coinReward: 30,
        checkResult: (code, output) => {
            if (output.trim() === "เธเนเธฒเธ" && code.includes("if") && code.includes("else")) return { success: true, msg: "เน€เธขเธตเนเธขเธก! เธเธธเธ“เน€เธเนเธฒเนเธ if-else เนเธฅเนเธง ๐”€" };
            return { success: false, msg: "เธฅเธญเธเนเธเน if-else เนเธซเนเธเธฃเธเธ—เธฑเนเธเธชเธญเธเธเธฃเธ“เธต" };
        }
    },
    6: {
        id: 6,
        title: "Level 6: for loop - เธงเธเธเนเธณ",
        topic: "for",
        instruction: `<code>for</code> loop เธ—เธณเนเธซเนเน€เธฃเธฒเธชเธฒเธกเธฒเธฃเธ–เธงเธเธ—เธณเธเนเธณเนเธ”เนเธซเธฅเธฒเธขเธฃเธญเธ<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เนเธเน for loop เธเธดเธกเธเนเธ•เธฑเธงเน€เธฅเธ 0 เธ–เธถเธ 4 เธ—เธตเธฅเธฐเธเธฃเธฃเธ—เธฑเธ”`,
        example: `for i in range(5):\n    print(i)`,
        defaultCode: `# เนเธเน for loop เธเธดเธกเธเนเน€เธฅเธ 0-4\n`,
        hint: "เนเธเน for i in range(5): เนเธฅเนเธง print(i)",
        answer: `for i in range(5):\n    print(i)`,
        expReward: 80,
        coinReward: 35,
        checkResult: (code, output) => {
            const expected = "0\n1\n2\n3\n4";
            if (output.trim() === expected && code.includes("for")) return { success: true, msg: "เน€เธเนเธเธกเธฒเธ! เธเธธเธ“เนเธเน for loop เนเธ”เนเนเธฅเนเธง ๐”" };
            return { success: false, msg: "เธเธฅเธฅเธฑเธเธเนเธ•เนเธญเธเน€เธเนเธ 0 1 2 3 4 เนเธ•เนเธฅเธฐเธ•เธฑเธงเธญเธขเธนเนเธเธเธฅเธฐเธเธฃเธฃเธ—เธฑเธ”" };
        }
    },
    7: {
        id: 7,
        title: "Level 7: while loop - เธงเธเธเธเธเธงเนเธฒเธเธฐเธซเธขเธธเธ”",
        topic: "while",
        instruction: `<code>while</code> loop เธ—เธณเธเธฒเธเธงเธเธเนเธณเธเธเธเธงเนเธฒเน€เธเธทเนเธญเธเนเธเธเธฐเน€เธเนเธเน€เธ—เนเธ<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เนเธเน while loop เธเธฑเธ 1 เธ–เธถเธ 3`,
        example: `count = 1\nwhile count <= 3:\n    print(count)\n    count += 1`,
        defaultCode: `# เนเธเน while loop เธเธฑเธ 1-3\ncount = 1\n`,
        hint: "เนเธเน while count <= 3: เนเธฅเนเธง print(count) เนเธฅเธฐ count += 1",
        answer: `count = 1\nwhile count <= 3:\n    print(count)\n    count += 1`,
        expReward: 80,
        coinReward: 35,
        checkResult: (code, output) => {
            if (output.trim() === "1\n2\n3" && code.includes("while")) return { success: true, msg: "เธชเธธเธ”เธขเธญเธ”! while loop เธเนเนเธเนเนเธ”เนเน€เธซเธกเธทเธญเธเธเธฑเธ ๐ฏ" };
            return { success: false, msg: "เธเธฅเธฅเธฑเธเธเนเธ•เนเธญเธเน€เธเนเธ 1 2 3 เนเธ•เนเธฅเธฐเธ•เธฑเธงเธเธเธฅเธฐเธเธฃเธฃเธ—เธฑเธ”" };
        }
    },
    8: {
        id: 8,
        title: "Level 8: Function - เธชเธฃเนเธฒเธเธเธฑเธเธเนเธเธฑเธ",
        topic: "Function",
        instruction: `เธเธฑเธเธเนเธเธฑเธเธเธทเธญเธเธธเธ”เธเธณเธชเธฑเนเธเธ—เธตเนเธ•เธฑเนเธเธเธทเนเธญเนเธงเนเน€เธเธทเนเธญเน€เธฃเธตเธขเธเนเธเนเธเนเธณเนเธ”เน<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เธชเธฃเนเธฒเธเธเธฑเธเธเนเธเธฑเธเธเธทเนเธญ <code>greet</code> เธ—เธตเนเธเธดเธกเธเนเธเธณเธงเนเธฒ "เธชเธงเธฑเธชเธ”เธต" เนเธฅเนเธงเน€เธฃเธตเธขเธเนเธเนเธเธฒเธ`,
        example: `def greet():\n    print("เธชเธงเธฑเธชเธ”เธต")\n\ngreet()`,
        defaultCode: `# เธชเธฃเนเธฒเธเธเธฑเธเธเนเธเธฑเธ greet เนเธฅเนเธงเน€เธฃเธตเธขเธเนเธเน\n`,
        hint: "เนเธเน def greet(): เนเธฅเนเธง print(\"เธชเธงเธฑเธชเธ”เธต\") เธเนเธฒเธเนเธ เธชเธธเธ”เธ—เนเธฒเธขเน€เธฃเธตเธขเธ greet()",
        answer: `def greet():\n    print("เธชเธงเธฑเธชเธ”เธต")\n\ngreet()`,
        expReward: 90,
        coinReward: 40,
        checkResult: (code, output) => {
            if (output.trim() === "เธชเธงเธฑเธชเธ”เธต" && code.includes("def")) return { success: true, msg: "เธเธฑเธเธเนเธเธฑเธเนเธฃเธเธเธญเธเธเธธเธ“เธ—เธณเธเธฒเธเนเธ”เนเนเธฅเนเธง! ๐€" };
            return { success: false, msg: "เธชเธฃเนเธฒเธ def greet(): เนเธฅเนเธงเน€เธฃเธตเธขเธ greet() เธเนเธฒเธเธเธญเธ" };
        }
    },
    9: {
        id: 9,
        title: "Level 9: List - เธฃเธฒเธขเธเธฒเธฃเธเนเธญเธกเธนเธฅ",
        topic: "List",
        instruction: `List เธเธทเธญเธ•เธฑเธงเนเธเธฃเธ—เธตเนเน€เธเนเธเธเนเธญเธกเธนเธฅเธซเธฅเธฒเธขเธ•เธฑเธงเนเธงเนเธ”เนเธงเธขเธเธฑเธ<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เธชเธฃเนเธฒเธ list เธเธทเนเธญ <code>fruits</code> เธกเธตเธเธฅเนเธกเน 3 เธเธเธดเธ” เนเธฅเนเธงเธเธดเธกเธเนเธ•เธฑเธงเนเธฃเธเธญเธญเธเธกเธฒ`,
        example: `fruits = ["เนเธญเธเน€เธเธดเนเธฅ", "เธเธฅเนเธงเธข", "เธชเนเธก"]\nprint(fruits[0])`,
        defaultCode: `# เธชเธฃเนเธฒเธ list เธเธฅเนเธกเน เนเธฅเนเธงเธเธดเธกเธเนเธ•เธฑเธงเนเธฃเธ\n`,
        hint: "เนเธเน fruits = [\"เนเธญเธเน€เธเธดเนเธฅ\", \"เธเธฅเนเธงเธข\", \"เธชเนเธก\"] เนเธฅเนเธง print(fruits[0])",
        answer: `fruits = ["เนเธญเธเน€เธเธดเนเธฅ", "เธเธฅเนเธงเธข", "เธชเนเธก"]\nprint(fruits[0])`,
        expReward: 90,
        coinReward: 40,
        checkResult: (code, output) => {
            if (code.includes("[") && code.includes("]") && code.includes("print") && output.trim().length > 0) return { success: true, msg: "เธเธธเธ“เน€เธเนเธฒเนเธ List เนเธฅเนเธง! ๐“" };
            return { success: false, msg: "เธชเธฃเนเธฒเธ list เธ”เนเธงเธข [] เนเธฅเนเธง print เธ•เธฑเธงเนเธฃเธเธ”เนเธงเธข [0]" };
        }
    },
    10: {
        id: 10,
        title: "Level 10: Dictionary - เธเธเธเธฒเธเธธเธเธฃเธก",
        topic: "Dictionary",
        instruction: `Dictionary เน€เธเนเธเธเนเธญเธกเธนเธฅเนเธเธ key-value (เธเธทเนเธญ-เธเนเธฒ)<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เธชเธฃเนเธฒเธ dict เธเธทเนเธญ <code>student</code> เธกเธต key "name" เนเธฅเธฐ "age" เนเธฅเนเธงเธเธดเธกเธเนเธเธทเนเธญเธญเธญเธเธกเธฒ`,
        example: `student = {"name": "เธชเธกเธเธฒเธข", "age": 15}\nprint(student["name"])`,
        defaultCode: `# เธชเธฃเนเธฒเธ dictionary เนเธฅเนเธงเธเธดเธกเธเนเธเธทเนเธญ\n`,
        hint: "เนเธเน student = {\"name\": \"เธเธทเนเธญ\", \"age\": 15} เนเธฅเนเธง print(student[\"name\"])",
        answer: `student = {"name": "เธชเธกเธเธฒเธข", "age": 15}\nprint(student["name"])`,
        expReward: 100,
        coinReward: 45,
        checkResult: (code, output) => {
            if (code.includes("{") && code.includes("}") && code.includes("print") && output.trim().length > 0) return { success: true, msg: "Dictionary เธเนเน€เธเนเธฒเนเธเนเธฅเนเธง! ๐“–" };
            return { success: false, msg: "เธชเธฃเนเธฒเธ dict เธ”เนเธงเธข {} เนเธฅเนเธง print เธเนเธฒเธ—เธตเนเธ•เนเธญเธเธเธฒเธฃ" };
        }
    },
    11: {
        id: 11,
        title: "Level 11: String - เธเธฑเธ”เธเธฒเธฃเธเนเธญเธเธงเธฒเธก",
        topic: "String",
        instruction: `String เธกเธตเน€เธ—เธเธเธดเธเน€เธขเธญเธฐเธกเธฒเธ เน€เธเนเธ .upper() .lower() .replace()<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เธชเธฃเนเธฒเธเธเนเธญเธเธงเธฒเธก "hello python" เนเธฅเนเธงเธเธดเธกเธเนเน€เธเนเธเธ•เธฑเธงเธเธดเธกเธเนเนเธซเธเนเธ—เธฑเนเธเธซเธกเธ”`,
        example: `text = "hello python"\nprint(text.upper())`,
        defaultCode: `# เนเธเธฅเธเน€เธเนเธเธ•เธฑเธงเธเธดเธกเธเนเนเธซเธเน\ntext = "hello python"\n`,
        hint: "เนเธเน .upper() เธ•เนเธญเธ—เนเธฒเธขเธ•เธฑเธงเนเธเธฃ string",
        answer: `text = "hello python"\nprint(text.upper())`,
        expReward: 100,
        coinReward: 45,
        checkResult: (code, output) => {
            if (output.trim() === "HELLO PYTHON") return { success: true, msg: "String master! ๐”ค" };
            return { success: false, msg: "เนเธเน .upper() เน€เธเธทเนเธญเนเธเธฅเธเน€เธเนเธเธ•เธฑเธงเธเธดเธกเธเนเนเธซเธเน" };
        }
    },
    12: {
        id: 12,
        title: "Level 12: Mini Project ๐",
        topic: "Mini Project",
        instruction: `เธ–เธถเธเน€เธงเธฅเธฒเธฃเธงเธกเธ—เธธเธเธญเธขเนเธฒเธเธ—เธตเนเน€เธฃเธตเธขเธเธกเธฒ!<br><br>
            <b>เธ เธฒเธฃเธเธดเธ:</b> เธชเธฃเนเธฒเธเนเธเธฃเนเธเธฃเธกเธ—เธตเนเธกเธต list เธ•เธฑเธงเน€เธฅเธ [10, 20, 30, 40, 50] เนเธฅเนเธงเนเธเน for loop เธซเธฒเธเธฅเธฃเธงเธก เนเธฅเนเธง print เธเธฅเธฃเธงเธกเธญเธญเธเธกเธฒ`,
        example: `numbers = [10, 20, 30, 40, 50]\ntotal = 0\nfor n in numbers:\n    total += n\nprint(total)`,
        defaultCode: `# Mini Project: เธซเธฒเธเธฅเธฃเธงเธกเธเธญเธ list\nnumbers = [10, 20, 30, 40, 50]\n`,
        hint: "เธชเธฃเนเธฒเธเธ•เธฑเธงเนเธเธฃ total = 0 เนเธฅเนเธงเนเธเน for loop เธเธงเธเธชเธฐเธชเธกเน€เธเนเธฒเนเธ",
        answer: `numbers = [10, 20, 30, 40, 50]\ntotal = 0\nfor n in numbers:\n    total += n\nprint(total)`,
        expReward: 150,
        coinReward: 60,
        checkResult: (code, output) => {
            if (output.trim() === "150" && code.includes("for")) return { success: true, msg: "เธขเธดเธเธ”เธตเธ”เนเธงเธข! เธเธธเธ“เธเธเธซเธฅเธฑเธเธชเธนเธ•เธฃเธ—เธฑเนเธเธซเธกเธ”เนเธฅเนเธง! ๐๐" };
            return { success: false, msg: "เธเธฅเธฃเธงเธกเธ•เนเธญเธเนเธ”เน 150 เธฅเธญเธเนเธเน for loop เธเธงเธเธชเธฐเธชเธก" };
        }
    }
};

/** NPC definitions with positions on the grid map */
const NPC_LIST = [
    { id: 1, x: 7, y: 3, name: "เธญ.เนเธเธ—เธญเธ", color: "#10b981", emoji: "๐ง‘โ€๐ซ", levelId: 1, greeting: "เธขเธดเธเธ”เธตเธ•เนเธญเธเธฃเธฑเธ! เธกเธฒเน€เธฃเธตเธขเธเธเธณเธชเธฑเนเธ print() เธเธฑเธ" },
    { id: 2, x: 3, y: 5, name: "เธเธตเนเธ•เธฑเธงเนเธเธฃ", color: "#f59e0b", emoji: "๐“ฆ", levelId: 2, greeting: "เธ•เธฑเธงเนเธเธฃเน€เธซเธกเธทเธญเธเธเธฅเนเธญเธเน€เธเนเธเธเธญเธ เธกเธฒเธชเธฃเนเธฒเธเธเธฑเธ!" },
    { id: 3, x: 11, y: 5, name: "เธเนเธญเธ input", color: "#8b5cf6", emoji: "โจ๏ธ", levelId: 3, greeting: "เธกเธฒเธฅเธญเธเธฃเธฑเธเธเนเธญเธกเธนเธฅเธเธฒเธเธเธนเนเนเธเนเธเธฑเธเน€เธ–เธญเธฐ" },
    { id: 4, x: 3, y: 9, name: "เธ—เธฒเธเนเธขเธ if", color: "#ef4444", emoji: "๐”€", levelId: 4, greeting: "เธ–เนเธฒ...เนเธฅเนเธง...เธเธตเนเธเธทเธญเธซเธฅเธฑเธเธเธฒเธฃ if!" },
    { id: 5, x: 7, y: 9, name: "เธชเธญเธเธ—เธฒเธ", color: "#ec4899", emoji: "โ”๏ธ", levelId: 5, greeting: "เน€เธเธดเนเธก else เน€เธเนเธฒเธกเธฒเนเธซเนเธกเธต 2 เธ—เธฒเธเน€เธฅเธทเธญเธ" },
    { id: 6, x: 11, y: 9, name: "เธ—เนเธฒเธ Loop", color: "#06b6d4", emoji: "๐”", levelId: 6, greeting: "for loop เธเนเธงเธขเธ—เธณเธเนเธณเนเธ”เนเนเธกเนเธ•เนเธญเธเธเธดเธกเธเนเน€เธขเธญเธฐ" },
    { id: 7, x: 2, y: 12, name: "While Man", color: "#84cc16", emoji: "โพ๏ธ", levelId: 7, greeting: "while loop เธงเธเธเธเธเธงเนเธฒเน€เธเธทเนเธญเธเนเธเธเธฐเน€เธเนเธ False" },
    { id: 8, x: 5, y: 12, name: "เธเธฑเธเธเนเธเธฑเธเนเธกเธ", color: "#f97316", emoji: "๐“ฆ", levelId: 8, greeting: "เธเธฑเธเธเนเธเธฑเธเธเนเธงเธขเธเธฑเธ”เธฃเธฐเน€เธเธตเธขเธเนเธเนเธ”เธเธญเธเน€เธฃเธฒ" },
    { id: 9, x: 8, y: 12, name: "List Lady", color: "#a855f7", emoji: "๐“", levelId: 9, greeting: "List เน€เธเนเธเธเนเธญเธกเธนเธฅเธซเธฅเธฒเธขเธ•เธฑเธงเนเธงเนเธ—เธตเนเน€เธ”เธตเธขเธง!" },
    { id: 10, x: 11, y: 12, name: "Dict Boy", color: "#14b8a6", emoji: "๐“–", levelId: 10, greeting: "Dictionary เน€เธเนเธเธเนเธญเธกเธนเธฅเนเธเธเธเธนเน key-value" },
    { id: 11, x: 4, y: 2, name: "String Girl", color: "#e879f9", emoji: "๐”ค", levelId: 11, greeting: "String เธกเธตเน€เธ—เธเธเธดเธเน€เธขเธญเธฐเธกเธฒเธ เธกเธฒเธฅเธญเธเธเธฑเธ!" },
    { id: 12, x: 10, y: 2, name: "Boss ๐", color: "#fbbf24", emoji: "๐", levelId: 12, greeting: "เธ”เนเธฒเธเธชเธธเธ”เธ—เนเธฒเธข! เธฃเธงเธกเธ—เธธเธเธญเธขเนเธฒเธเธ—เธตเนเน€เธฃเธตเธขเธเธกเธฒ" },
];

// ============================================================
// SECTION 2: GAME STATE & SAVE SYSTEM
// ============================================================

/** Default game state */
const DEFAULT_STATE = {
    exp: 0,
    level: 1,
    coins: 0,
    streak: 0,
    clearedLevels: [],
    runCount: 0,
    timeSpent: 0,
    bestStars: {} // { levelId: starCount }
};

/** Current game state (mutable) */
let gameState = { ...DEFAULT_STATE, clearedLevels: [], bestStars: {} };

/** Load save data from LocalStorage */
function loadSaveData() {
    try {
        const saved = localStorage.getItem("python-rpg-save");
        if (saved) {
            const data = JSON.parse(saved);
            gameState = { ...DEFAULT_STATE, ...data, clearedLevels: data.clearedLevels || [], bestStars: data.bestStars || {} };
        }
    } catch (e) {
        console.warn("Save data corrupted, resetting.", e);
    }
}

/** Save game state to LocalStorage */
function saveData() {
    localStorage.setItem("python-rpg-save", JSON.stringify(gameState));
}

/** Reset all data */
function resetData() {
    if (confirm("เธเธธเธ“เธ•เนเธญเธเธเธฒเธฃเธฃเธตเน€เธเนเธ•เธเนเธญเธกเธนเธฅเธ—เธฑเนเธเธซเธกเธ”เนเธเนเนเธซเธก? (เธเนเธญเธกเธนเธฅเธเธฐเธซเธฒเธขเธซเธกเธ”)")) {
        localStorage.removeItem("python-rpg-save");
        location.reload();
    }
}

// Auto-save every 15 seconds
setInterval(() => {
    gameState.timeSpent += 15;
    saveData();
}, 15000);

// ============================================================
// SECTION 3: PYODIDE (Python Runner)
// ============================================================

let pyodideInstance = null;
let pyodideReady = false;

/** Initialize Pyodide engine */
async function initPyodide() {
    const statusEl = document.getElementById("pyodide-status");
    try {
        pyodideInstance = await loadPyodide();
        pyodideReady = true;
        if (statusEl) statusEl.style.display = "none";
        printToTerminal(">>> Python engine เธเธฃเนเธญเธกเนเธเนเธเธฒเธ! โ…", "success-msg");
    } catch (e) {
        printToTerminal(">>> เนเธซเธฅเธ” Python engine เนเธกเนเธชเธณเน€เธฃเนเธ: " + e.message, "err-msg");
    }
}

/** Run Python code and return output */
async function runPythonCode(code) {
    if (!pyodideReady) {
        printToTerminal(">>> เธเธฃเธธเธ“เธฒเธฃเธญเธฃเธฐเธเธเนเธซเธฅเธ” Python engine เนเธซเนเน€เธชเธฃเนเธเธเนเธญเธ...", "err-msg");
        return null;
    }
    if (!code.trim()) {
        printToTerminal(">>> เนเธเนเธ”เธงเนเธฒเธเน€เธเธฅเนเธฒ เธเธฃเธธเธ“เธฒเธเธดเธกเธเนเธเธณเธชเธฑเนเธเธเนเธญเธ", "err-msg");
        return null;
    }

    let outputBuffer = [];
    pyodideInstance.setStdout({ batched: (msg) => outputBuffer.push(msg) });

    try {
        await pyodideInstance.runPythonAsync(code);
        return outputBuffer.join("\n");
    } catch (error) {
        const errMsg = error.message || error.toString();
        printToTerminal(errMsg, "err-msg");
        return null;
    }
}

// ============================================================
// SECTION 4: CODE EDITOR (CodeMirror)
// ============================================================

let editorInstance = null;

/** Initialize or re-use CodeMirror editor */
function initEditor(defaultCode) {
    const textArea = document.getElementById("python-editor");
    if (!textArea) return;

    if (!editorInstance) {
        editorInstance = CodeMirror.fromTextArea(textArea, {
            mode: "python",
            theme: "dracula",
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            matchBrackets: true,
            autoCloseBrackets: true,
            lineWrapping: true,
            extraKeys: {
                Tab: function (cm) {
                    cm.replaceSelection("    ");
                }
            }
        });
        editorInstance.setSize("100%", "100%");
    }

    editorInstance.setValue(defaultCode || "");
    setTimeout(() => editorInstance.refresh(), 150);
}

/** Get current code from editor */
function getEditorCode() {
    return editorInstance ? editorInstance.getValue() : "";
}

// ============================================================
// SECTION 5: TERMINAL (Console Output)
// ============================================================

/** Print a message to the terminal */
function printToTerminal(text, className) {
    const terminal = document.getElementById("terminal-output");
    if (!terminal) return;
    const div = document.createElement("div");
    div.textContent = text;
    if (className) div.className = className;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
}

/** Clear terminal */
function clearTerminal() {
    const terminal = document.getElementById("terminal-output");
    if (terminal) terminal.innerHTML = "";
}

// ============================================================
// SECTION 6: RPG MAP (2D Canvas Game)
// ============================================================

const TILE = 40;
const COLS = 15;
const ROWS = 15;

const player = { x: 7, y: 7, facing: "down" };
let activeNPC = null;
let currentMissionId = null;
let canvas, ctx;

/** Resize canvas and start rendering */
function initCanvas() {
    canvas = document.getElementById("rpg-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");

    // Fit canvas to its container
    function resize() {
        const container = document.querySelector(".rpg-container") || document.getElementById("rpg-map-container");
        if (!container) return;
        const size = Math.min(container.clientWidth - 20, container.clientHeight - 20, TILE * COLS);
        canvas.width = size;
        canvas.height = size;
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(gameLoop);
}

/** Main game rendering loop */
function gameLoop() {
    if (!ctx || !canvas) return;

    const tileW = canvas.width / COLS;
    const tileH = canvas.height / ROWS;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = "#0d1b2a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
        ctx.beginPath(); ctx.moveTo(x * tileW, 0); ctx.lineTo(x * tileW, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * tileH); ctx.lineTo(canvas.width, y * tileH); ctx.stroke();
    }

    // Draw decorations (paths)
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    for (let i = 0; i < COLS; i++) {
        ctx.fillRect(i * tileW, 7 * tileH, tileW, tileH); // horizontal path
    }
    for (let i = 0; i < ROWS; i++) {
        ctx.fillRect(7 * tileW, i * tileH, tileW, tileH); // vertical path
    }

    // Draw NPCs
    for (const npc of NPC_LIST) {
        const nx = npc.x * tileW;
        const ny = npc.y * tileH;
        const isCleared = gameState.clearedLevels.includes(npc.levelId);

        // NPC body
        ctx.fillStyle = isCleared ? "rgba(100,100,100,0.5)" : npc.color;
        const pad = tileW * 0.15;
        ctx.beginPath();
        ctx.roundRect(nx + pad, ny + pad, tileW - pad * 2, tileH - pad * 2, 4);
        ctx.fill();

        // NPC Emoji/Label
        ctx.font = `${tileW * 0.4}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(npc.emoji || "?", nx + tileW / 2, ny + tileH / 2);

        // Exclamation if not cleared
        if (!isCleared) {
            ctx.fillStyle = "#fbbf24";
            ctx.font = `bold ${tileW * 0.45}px Arial`;
            ctx.fillText("!", nx + tileW / 2, ny - tileH * 0.15);
        } else {
            ctx.fillStyle = "#10b981";
            ctx.font = `${tileW * 0.35}px Arial`;
            ctx.fillText("โ“", nx + tileW / 2, ny - tileH * 0.15);
        }
    }

    // Draw Player
    const px = player.x * tileW + tileW / 2;
    const py = player.y * tileH + tileH / 2;
    const pr = tileW * 0.35;

    // Glow
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Eyes
    ctx.fillStyle = "white";
    const eyeSize = pr * 0.2;
    let ex = 0, ey = 0;
    if (player.facing === "up") ey = -pr * 0.3;
    if (player.facing === "down") ey = pr * 0.3;
    if (player.facing === "left") ex = -pr * 0.3;
    if (player.facing === "right") ex = pr * 0.3;
    ctx.beginPath(); ctx.arc(px + ex, py + ey, eyeSize, 0, Math.PI * 2); ctx.fill();

    requestAnimationFrame(gameLoop);
}

/** Handle keyboard input for movement */
function handleKeydown(e) {
    // Ignore when typing in editor or modals
    const tag = document.activeElement?.tagName;
    if (tag === "TEXTAREA" || tag === "INPUT") return;
    if (isAnyModalOpen()) return;

    let nx = player.x;
    let ny = player.y;

    switch (e.key) {
        case "ArrowUp": case "w": case "W": ny--; player.facing = "up"; e.preventDefault(); break;
        case "ArrowDown": case "s": case "S": ny++; player.facing = "down"; e.preventDefault(); break;
        case "ArrowLeft": case "a": case "A": nx--; player.facing = "left"; e.preventDefault(); break;
        case "ArrowRight": case "d": case "D": nx++; player.facing = "right"; e.preventDefault(); break;
        case " ":
            e.preventDefault();
            if (activeNPC) openNPCDialog(activeNPC);
            return;
        default: return;
    }

    // Boundary check
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;

    // Check collision with NPCs
    const blocked = NPC_LIST.some(n => n.x === nx && n.y === ny);
    if (!blocked) {
        player.x = nx;
        player.y = ny;
    }

    checkNPCProximity();
}

/** Check if player is adjacent to an NPC */
function checkNPCProximity() {
    activeNPC = null;
    for (const npc of NPC_LIST) {
        const dx = Math.abs(npc.x - player.x);
        const dy = Math.abs(npc.y - player.y);
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            activeNPC = npc;
            break;
        }
    }

    const overlay = document.getElementById("interaction-overlay");
    if (overlay) {
        if (activeNPC) overlay.classList.remove("hidden");
        else overlay.classList.add("hidden");
    }
}

function isAnyModalOpen() {
    return ["dialog-modal", "success-modal", "dashboard-modal", "achievement-modal"]
        .some(id => {
            const el = document.getElementById(id);
            return el && el.classList.contains("active");
        });
}

// ============================================================
// SECTION 7: UI INTERACTIONS
// ============================================================

/** Open NPC dialog modal */
function openNPCDialog(npc) {
    document.getElementById("interaction-overlay").classList.add("hidden");
    document.getElementById("npc-name").innerText = `${npc.emoji} ${npc.name}`;
    document.getElementById("npc-text").innerText = npc.greeting;
    document.getElementById("dialog-modal").classList.add("active");

    // Wire accept button
    document.getElementById("btn-accept-mission").onclick = () => {
        document.getElementById("dialog-modal").classList.remove("active");
        startMission(npc.levelId);
    };
}

/** Start a mission - load level data into the IDE panel */
function startMission(levelId) {
    const level = LEVELS[levelId];
    if (!level) return;

    currentMissionId = levelId;

    document.getElementById("mission-subtitle").innerText = level.title;
    document.getElementById("mission-instruction").innerHTML = level.instruction;

    // Show example
    const exampleBox = document.getElementById("mission-example");
    if (level.example && exampleBox) {
        exampleBox.classList.add("active");
        exampleBox.innerHTML = `<pre><code>${level.example}</code></pre>`;
    } else if (exampleBox) {
        exampleBox.classList.remove("active");
    }

    // Enable editor
    const wrapper = document.getElementById("editor-wrapper");
    if (wrapper) {
        wrapper.style.opacity = "1";
        wrapper.style.pointerEvents = "auto";
    }

    // Set editor code
    initEditor(level.defaultCode);

    // Update mission display (element is optional; guard against null to avoid TypeError)
    (document.getElementById("current-mission-display") || {}).innerText = `๐“ ${level.topic} - เธ เธฒเธฃเธเธดเธ ${levelId}/12`;
}

/** Update stats display in navbar */
function updateStatsUI() {
    const el = (id) => document.getElementById(id);
    if (el("ui-exp")) el("ui-exp").innerText = gameState.exp;
    if (el("ui-level")) el("ui-level").innerText = gameState.level;
    if (el("ui-coins")) el("ui-coins").innerText = gameState.coins;
    if (el("ui-streak")) el("ui-streak").innerText = gameState.streak;
}

/** Show success modal with stars and rewards */
function showSuccess(stars, expGain, coinGain) {
    const container = document.getElementById("success-stars");
    if (container) {
        container.innerHTML = "";
        for (let i = 0; i < 3; i++) {
            const star = document.createElement("i");
            star.className = "fa-solid fa-star";
            if (i < stars) {
                star.classList.add("star-lit");
                star.style.animationDelay = `${i * 0.2}s`;
            }
            container.appendChild(star);
        }
    }

    const el = (id) => document.getElementById(id);
    if (el("reward-exp")) el("reward-exp").innerText = expGain;
    if (el("reward-coin")) el("reward-coin").innerText = coinGain;
    if (el("success-modal")) el("success-modal").classList.add("active");
}

/** Handle run button click */
async function onRunCode() {
    if (!currentMissionId) {
        printToTerminal(">>> เน€เธ”เธดเธเนเธเธเธธเธขเธเธฑเธ NPC เน€เธเธทเนเธญเธฃเธฑเธเธ เธฒเธฃเธเธดเธเธเนเธญเธเธเธฐ!", "sys-msg");
        return;
    }

    clearTerminal();
    printToTerminal(">>> เธเธณเธฅเธฑเธเธฃเธฑเธเนเธเธฃเนเธเธฃเธก...", "sys-msg");

    gameState.runCount++;

    const code = getEditorCode();
    const output = await runPythonCode(code);

    if (output === null) return; // Error already printed

    if (output) printToTerminal(output);

    // Check answer
    const level = LEVELS[currentMissionId];
    if (!level) return;

    const result = level.checkResult(code, output || "");

    if (result.success) {
        printToTerminal(">>> โ… " + result.msg, "success-msg");

        const isFirstClear = !gameState.clearedLevels.includes(currentMissionId);
        const expGain = isFirstClear ? level.expReward : 10;
        const coinGain = isFirstClear ? level.coinReward : 5;
        const stars = isFirstClear ? 3 : 1;

        gameState.exp += expGain;
        gameState.coins += coinGain;
        gameState.streak++;

        if (isFirstClear) gameState.clearedLevels.push(currentMissionId);

        // Level up
        const nextLevelExp = gameState.level * 100;
        if (gameState.exp >= nextLevelExp) {
            gameState.level++;
            printToTerminal(`>>> ๐ Level Up! เธเธธเธ“เธญเธขเธนเน Level ${gameState.level} เนเธฅเนเธง!`, "success-msg");
        }

        updateStatsUI();
        saveData();

        setTimeout(() => showSuccess(stars, expGain, coinGain), 500);
    } else {
        printToTerminal(">>> โ " + result.msg, "err-msg");
        gameState.streak = 0;
        updateStatsUI();
        saveData();
    }
}

/** Render teacher dashboard stats */
function renderDashboard() {
    const container = document.getElementById("dashboard-stats") || document.querySelector(".dashboard-stats");
    if (!container) return;

    const mins = Math.floor(gameState.timeSpent / 60);

    container.innerHTML = `
        <table style="width:100%; border-collapse:collapse;">
            <tr><th style="padding:12px; text-align:left; border-bottom:1px solid #334155;">เธเนเธญเธกเธนเธฅ</th><th style="padding:12px; text-align:left; border-bottom:1px solid #334155;">เธเนเธฒ</th></tr>
            <tr><td style="padding:10px; border-bottom:1px solid #1e293b;">เธฃเธฐเธ”เธฑเธ (Level)</td><td style="padding:10px; color:#3b82f6; border-bottom:1px solid #1e293b;">${gameState.level}</td></tr>
            <tr><td style="padding:10px; border-bottom:1px solid #1e293b;">EXP เธชเธฐเธชเธก</td><td style="padding:10px; color:#10b981; border-bottom:1px solid #1e293b;">${gameState.exp}</td></tr>
            <tr><td style="padding:10px; border-bottom:1px solid #1e293b;">เน€เธซเธฃเธตเธขเธเธ—เธญเธ</td><td style="padding:10px; color:#fbbf24; border-bottom:1px solid #1e293b;">${gameState.coins}</td></tr>
            <tr><td style="padding:10px; border-bottom:1px solid #1e293b;">เธ”เนเธฒเธเธ—เธตเนเธเนเธฒเธ</td><td style="padding:10px; border-bottom:1px solid #1e293b;">${gameState.clearedLevels.length}/12 (${gameState.clearedLevels.sort((a,b)=>a-b).join(", ") || "เธขเธฑเธเนเธกเนเธกเธต"})</td></tr>
            <tr><td style="padding:10px; border-bottom:1px solid #1e293b;">เธเธณเธเธงเธเธเธฃเธฑเนเธเธ—เธตเนเธฃเธฑเธเนเธเนเธ”</td><td style="padding:10px; border-bottom:1px solid #1e293b;">${gameState.runCount}</td></tr>
            <tr><td style="padding:10px; border-bottom:1px solid #1e293b;">เน€เธงเธฅเธฒเน€เธฃเธตเธขเธเธ—เธฑเนเธเธซเธกเธ”</td><td style="padding:10px; border-bottom:1px solid #1e293b;">${mins} เธเธฒเธ—เธต</td></tr>
            <tr><td style="padding:10px;">Streak เธเธฑเธเธเธธเธเธฑเธ</td><td style="padding:10px; color:#ef4444;">${gameState.streak} ๐”ฅ</td></tr>
        </table>`;
}

/** Export CSV */
function exportCSV() {
    let csv = "data:text/csv;charset=utf-8,";
    csv += "Metric,Value\n";
    csv += `Level,${gameState.level}\n`;
    csv += `EXP,${gameState.exp}\n`;
    csv += `Coins,${gameState.coins}\n`;
    csv += `Cleared Levels,"${gameState.clearedLevels.join(",")}"\n`;
    csv += `Run Count,${gameState.runCount}\n`;
    csv += `Time Spent (sec),${gameState.timeSpent}\n`;
    csv += `Streak,${gameState.streak}\n`;

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "python_rpg_stats.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/** Render achievements list */
function renderAchievements() {
    const list = document.getElementById("achievement-list");
    if (!list) return;

    let html = "";
    for (let i = 1; i <= 12; i++) {
        const level = LEVELS[i];
        const cleared = gameState.clearedLevels.includes(i);
        html += `<div style="display:flex; align-items:center; gap:12px; padding:12px; border-bottom:1px solid #1e293b; opacity:${cleared ? 1 : 0.5};">
            <div style="font-size:28px;">${cleared ? "โญ" : "๐”’"}</div>
            <div>
                <div style="font-weight:600;">${level?.title || "Level " + i}</div>
                <div style="font-size:0.85rem; color:#94a3b8;">${cleared ? "เธชเธณเน€เธฃเนเธเนเธฅเนเธง!" : "เธขเธฑเธเนเธกเนเธเธฅเธ”เธฅเนเธญเธ"}</div>
            </div>
        </div>`;
    }
    list.innerHTML = html;
}

// ============================================================
// SECTION 8: INITIALIZATION - Wire everything together
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // Load save
    loadSaveData();
    updateStatsUI();

    // Init canvas
    initCanvas();

    // Init Pyodide
    initPyodide();

    // Init Editor (empty initially)
    initEditor("");

    // Keyboard
    window.addEventListener("keydown", handleKeydown);

    // --- Button bindings ---
    const bind = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", fn);
    };

    // Run code (HTML uses btn-run)
    bind("btn-run-code", onRunCode);
    bind("btn-run", onRunCode);

    // Clear console (HTML uses btn-clear)
    bind("btn-clear-console", clearTerminal);
    bind("btn-clear", clearTerminal);

    // Hint (HTML uses btn-hint)
    bind("btn-get-hint", () => {
        if (!currentMissionId) return;
        const level = LEVELS[currentMissionId];
        if (level) printToTerminal("๐’ก เธเธณเนเธเน: " + level.hint, "sys-msg");
    });
    bind("btn-hint", () => {
        if (!currentMissionId) return;
        const level = LEVELS[currentMissionId];
        if (level) printToTerminal("๐’ก เธเธณเนเธเน: " + level.hint, "sys-msg");
    });

    // Show answer
    bind("btn-show-answer", () => {
        if (!currentMissionId) return;
        const level = LEVELS[currentMissionId];
        if (level && level.answer) {
            if (confirm("เธ•เนเธญเธเธเธฒเธฃเธ”เธนเน€เธเธฅเธขเธเธฃเธดเธเธซเธฃเธทเธญ? (เธเธฐเนเธกเนเนเธ”เนเธ”เธฒเธงเน€เธ•เนเธก)")) {
                editorInstance.setValue(level.answer);
            }
        }
    });

    // Close dialog
    bind("btn-dialog-next", () => {
        document.getElementById("dialog-modal").classList.remove("active");
    });
    bind("btn-close-dialog", () => {
        document.getElementById("dialog-modal").classList.remove("active");
    });

    // Close success
    bind("btn-close-success", () => {
        document.getElementById("success-modal").classList.remove("active");
    });

    // Dashboard
    bind("btn-dashboard", () => {
        renderDashboard();
        document.getElementById("dashboard-modal").classList.add("active");
    });
    bind("btn-close-dashboard", () => {
        document.getElementById("dashboard-modal").classList.remove("active");
    });

    // Export CSV
    bind("btn-export-csv", exportCSV);

    // Reset data
    bind("btn-reset-data", resetData);

    // Achievements
    bind("btn-achievements", () => {
        renderAchievements();
        document.getElementById("achievement-modal").classList.add("active");
    });
    bind("btn-close-achievements", () => {
        document.getElementById("achievement-modal").classList.remove("active");
    });

    // Theme toggle
    bind("btn-theme-toggle", () => {
        document.body.classList.toggle("light-mode");
        document.body.classList.toggle("dark-mode");
        const icon = document.querySelector("#btn-theme-toggle i");
        if (icon) icon.className = document.body.classList.contains("light-mode") ? "fa-solid fa-sun" : "fa-solid fa-moon";
    });
});
