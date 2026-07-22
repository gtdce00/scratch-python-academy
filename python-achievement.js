// --- python-achievement.js (Gamification & Checking Logic) ---
import { levels } from './python-levels.js';
import { showSuccessModal, updateStatsUI } from './python-ui.js';
import { printToConsole } from './python-runner.js';
import { saveData, gameState } from './python-save.js';

export function checkMissionResult(missionId, code, output) {
    if (!missionId) {
        printToConsole(">>> ลองคุยกับ NPC เพื่อเริ่มภารกิจก่อนรันโค้ดนะครับ!", 'sys-msg');
        return;
    }
    
    const levelData = levels[missionId];
    if (!levelData) return;
    
    const result = levelData.checkResult(code, output);
    
    if (result.success) {
        printToConsole(">>> " + result.message, 'success-msg');
        handleSuccess(missionId);
    } else {
        printToConsole(">>> " + result.message, 'err-msg');
        // Reset streak on fail
        gameState.streak = 0;
        updateStatsUI(gameState);
        saveData();
    }
}

function handleSuccess(missionId) {
    // Prevent double rewards if already cleared (Optional, but let's give small rewards)
    const isFirstClear = !gameState.clearedLevels.includes(missionId);
    
    const expGain = isFirstClear ? 50 : 10;
    const coinGain = isFirstClear ? 20 : 5;
    const stars = isFirstClear ? 3 : 1; // Simplified star logic
    
    gameState.exp += expGain;
    gameState.coins += coinGain;
    gameState.streak += 1;
    
    if (isFirstClear) {
        gameState.clearedLevels.push(missionId);
    }
    
    // Level up logic
    if (gameState.exp >= gameState.level * 100) {
        gameState.level++;
        printToConsole(`>>> 🎉 ยินดีด้วย เลื่อนขั้นเป็น Level ${gameState.level}!`, 'success-msg');
    }
    
    updateStatsUI(gameState);
    saveData();
    
    showSuccessModal(stars, expGain, coinGain);
}
