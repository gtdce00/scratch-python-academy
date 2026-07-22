// --- python-levels.js (Mission Content & Auto Grader definitions) ---

export const levels = {
    1: {
        id: 1,
        title: "Hello World!",
        instruction: "ภารกิจแรกของคุณคือการทักทายโลกของ Python ให้พิมพ์คำสั่ง <code>print('Hello World')</code> ลงในกล่องโค้ด",
        example: "print('Hello World')",
        defaultCode: "# พิมพ์คำสั่งด้านล่างนี้\n",
        checkResult: (code, output) => {
            if(output.trim() === 'Hello World' || output.trim() === "Hello World!") {
                return { success: true, message: "ยอดเยี่ยม! คุณสามารถแสดงข้อความบนหน้าจอได้แล้ว" };
            }
            return { success: false, message: "ข้อความยังไม่ตรง ลองตรวจสอบพิมพ์เล็กพิมพ์ใหญ่ หรือเครื่องหมายคำพูดดูนะ" };
        }
    },
    2: {
        id: 2,
        title: "การเก็บข้อมูล (ตัวแปร)",
        instruction: "สร้างตัวแปรชื่อ <code>name</code> แล้วใส่ชื่อของคุณ (เช่น 'Tigger') ลงไป จากนั้นพิมพ์ค่าของ name ออกมาดู",
        example: "name = 'สมชาย'\nprint(name)",
        defaultCode: "name = 'ใส่ชื่อของคุณ'\n# พิมพ์ name ออกมา\n",
        checkResult: (code, output) => {
            if(code.includes('name') && code.includes('print(name)') && output.trim().length > 0) {
                return { success: true, message: "เยี่ยมมาก! คุณเรียนรู้เรื่องตัวแปรแล้ว" };
            }
            return { success: false, message: "ลองเช็คดูว่าสร้างตัวแปร name และใช้คำสั่ง print(name) หรือยัง?" };
        }
    },
    // We will expand these to 12 levels as we build...
    3: {
        id: 3,
        title: "โต้ตอบกับผู้เล่น (input)",
        instruction: "ใช้คำสั่ง <code>input()</code> รับค่าจากคีย์บอร์ด มาเก็บไว้ในตัวแปร และ print ออกมา (หมายเหตุ: ในเวอร์ชันนี้ input อาจจะข้ามไปก่อนได้ ให้จำลองค่าเอาก็ได้)",
        example: "age = 15\nprint(age)",
        defaultCode: "age = 15\n# ลอง print age ดูสิ\n",
        checkResult: (code, output) => {
            if(output.trim() == "15") {
                return { success: true, message: "ถูกต้อง!" };
            }
            return { success: false, message: "ผิดพลาด" };
        }
    },
    4: {
        id: 4,
        title: "ทางแยก (if)",
        instruction: "กำหนดค่า <code>score = 10</code> และถ้า score มากกว่า 5 ให้ print('Pass')",
        example: "score = 10\nif score > 5:\n    print('Pass')",
        defaultCode: "score = 10\n",
        checkResult: (code, output) => {
            if(output.trim() == "Pass") {
                return { success: true, message: "เก่งมาก เรื่องเงื่อนไข if คุณทำได้ดี" };
            }
            return { success: false, message: "โค้ดยังไม่ครบ ลองดูที่ if" };
        }
    }
};
