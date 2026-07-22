// --- python-save.js (LocalStorage Management) ---
import { updateStatsUI } from './python-ui.js';

export const gameState = {
    exp: 0,
    level: 1,
    coins: 0,
    streak: 0,
    clearedLevels: [],
    runCount: 0,
    timeSpent: 0
};

export function loadSaveData() {
    const saved = localStorage.getItem('python-rpg-save');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.assign(gameState, data);
        } catch(e) {
            console.error("Save data corrupted", e);
        }
    }
    updateStatsUI(gameState);
}

export function saveData() {
    localStorage.setItem('python-rpg-save', JSON.stringify(gameState));
}

export function resetData() {
    if(confirm("คุณต้องการรีเซ็ตข้อมูลทั้งหมดใช่หรือไม่?")) {
        localStorage.removeItem('python-rpg-save');
        location.reload();
    }
}

// Auto save every 10 seconds and track time
setInterval(() => {
    gameState.timeSpent += 10;
    saveData();
}, 10000);
