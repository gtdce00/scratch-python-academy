// --- python-runner.js (Pyodide Integration) ---
import { getCode } from './python-editor.js';
import { checkMissionResult } from './python-achievement.js';

let pyodideInstance = null;
let isReady = false;

// Initialize Pyodide
async function main() {
    try {
        pyodideInstance = await loadPyodide();
        isReady = true;
        document.getElementById('pyodide-status').style.display = 'none';
        printToConsole(">>> ระบบพร้อมใช้งาน! (Pyodide 0.25.0 Loaded)", 'success-msg');
    } catch (e) {
        printToConsole(">>> เกิดข้อผิดพลาดในการโหลด Pyodide: " + e, 'err-msg');
    }
}

main();

export function printToConsole(text, className = '') {
    const terminal = document.getElementById('terminal-output');
    const div = document.createElement('div');
    div.textContent = text;
    if (className) div.className = className;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
}

export function clearConsole() {
    const terminal = document.getElementById('terminal-output');
    terminal.innerHTML = '';
}

// Intercept stdout
export async function runPythonCode(missionId) {
    if (!isReady) {
        printToConsole(">>> กรุณารอสักครู่ ระบบกำลังโหลด...", 'err-msg');
        return;
    }
    
    const code = getCode();
    if (!code.trim()) {
        printToConsole(">>> โค้ดว่างเปล่า กรุณาพิมพ์คำสั่งก่อนรัน", 'err-msg');
        return;
    }
    
    clearConsole();
    printToConsole(">>> รันโปรแกรม...", 'sys-msg');
    
    // Capture stdout
    let outputBuffer = [];
    pyodideInstance.setStdout({ batched: (msg) => outputBuffer.push(msg) });
    
    try {
        await pyodideInstance.runPythonAsync(code);
        const finalOutput = outputBuffer.join('\n');
        
        if (finalOutput) {
            printToConsole(finalOutput);
        }
        
        // Pass to grader
        checkMissionResult(missionId, code, finalOutput);
        
    } catch (error) {
        // Format Error message
        let errStr = error.toString();
        printToConsole(errStr, 'err-msg');
    }
}

// Bind Button
document.getElementById('btn-run-code').addEventListener('click', () => {
    // Current mission ID should be fetched from UI or state
    const currentMissionId = window.currentMissionId || parseInt(document.getElementById('mission-level-num').innerText) || null;
    runPythonCode(currentMissionId);
});

document.getElementById('btn-clear-console').addEventListener('click', clearConsole);
