// --- python-teacher.js (Teacher Dashboard & Analytics) ---
import { gameState, resetData } from './python-save.js';

function renderDashboard() {
    const container = document.querySelector('.dashboard-stats');
    if(!container) return;
    
    // Formatting time
    const mins = Math.floor(gameState.timeSpent / 60);
    const secs = gameState.timeSpent % 60;
    
    container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <tr style="border-bottom: 1px solid #334155;">
                <th style="padding: 10px;">ข้อมูล</th>
                <th style="padding: 10px;">ค่าสถิติ</th>
            </tr>
            <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px;">ระดับ (Level)</td>
                <td style="padding: 10px; color: #3b82f6;">${gameState.level}</td>
            </tr>
            <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px;">ประสบการณ์ (EXP)</td>
                <td style="padding: 10px; color: #10b981;">${gameState.exp}</td>
            </tr>
            <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px;">เหรียญทอง (Coins)</td>
                <td style="padding: 10px; color: #fbbf24;">${gameState.coins}</td>
            </tr>
            <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px;">ด่านที่ผ่านแล้ว</td>
                <td style="padding: 10px;">${gameState.clearedLevels.length > 0 ? gameState.clearedLevels.join(', ') : 'ยังไม่มี'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px;">เวลาที่ใช้เรียน</td>
                <td style="padding: 10px;">${mins} นาที ${secs} วินาที</td>
            </tr>
        </table>
    `;
}

// Bind button to render when opened
document.getElementById('btn-dashboard').addEventListener('click', renderDashboard);

// Export CSV
document.getElementById('btn-export-csv').addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Level,${gameState.level}\n`;
    csvContent += `EXP,${gameState.exp}\n`;
    csvContent += `Coins,${gameState.coins}\n`;
    csvContent += `Cleared Levels,"${gameState.clearedLevels.join(',')}"\n`;
    csvContent += `Time Spent (seconds),${gameState.timeSpent}\n`;
    
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_python_stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById('btn-reset-data').addEventListener('click', resetData);
