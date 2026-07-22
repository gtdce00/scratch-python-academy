// --- python-ui.js (UI interactions and DOM manipulation) ---
import { initEditor } from './python-editor.js';

let dialogCallback = null;

export function initUI() {
    // Buttons
    document.getElementById('btn-dialog-next').addEventListener('click', onDialogNext);
    document.getElementById('btn-accept-mission').addEventListener('click', onAcceptMission);
    document.getElementById('btn-close-success').addEventListener('click', closeSuccessModal);
    
    document.getElementById('btn-dashboard').addEventListener('click', () => {
        document.getElementById('dashboard-modal').style.display = 'flex';
    });
    
    document.getElementById('btn-close-dashboard').addEventListener('click', () => {
        document.getElementById('dashboard-modal').style.display = 'none';
    });

    // Theme toggle
    document.getElementById('btn-theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
    });
}

export function showDialog(name, text, onAccept) {
    document.getElementById('npc-name').innerText = name;
    document.getElementById('npc-text').innerText = text;
    document.getElementById('dialog-modal').style.display = 'flex';
    
    document.getElementById('btn-dialog-next').style.display = 'none';
    document.getElementById('btn-accept-mission').style.display = 'block';
    
    dialogCallback = onAccept;
}

function onDialogNext() {
    // For multi-page dialogs in the future
}

function onAcceptMission() {
    document.getElementById('dialog-modal').style.display = 'none';
    if(dialogCallback) dialogCallback();
}

export function showMissionPanel(levelData) {
    document.getElementById('mission-subtitle').innerText = levelData.title;
    document.getElementById('mission-instruction').innerHTML = levelData.instruction;
    document.getElementById('mission-level-num').innerText = levelData.id;
    
    if (levelData.example) {
        document.getElementById('mission-example').style.display = 'block';
        document.getElementById('mission-example').querySelector('code').innerText = levelData.example;
    } else {
        document.getElementById('mission-example').style.display = 'none';
    }

    // Enable Editor
    const editorWrapper = document.getElementById('editor-wrapper');
    editorWrapper.style.opacity = '1';
    editorWrapper.style.pointerEvents = 'auto';
    
    // Enable Buttons
    document.getElementById('btn-run-code').disabled = false;
    document.getElementById('btn-get-hint').disabled = false;
    
    // Init editor with default code
    initEditor(levelData.defaultCode || "");
}

export function updateStatsUI(stats) {
    document.getElementById('ui-exp').innerText = stats.exp;
    document.getElementById('ui-level').innerText = stats.level;
    document.getElementById('ui-coins').innerText = stats.coins;
    document.getElementById('ui-streak').innerText = stats.streak;
}

export function showSuccessModal(stars, exp, coin) {
    const starsContainer = document.getElementById('success-stars');
    starsContainer.innerHTML = '';
    for(let i=0; i<3; i++) {
        const star = document.createElement('i');
        star.className = 'fa-solid fa-star';
        if (i < stars) {
            star.classList.add('star-lit');
            // Stagger animation
            star.style.animationDelay = `${i * 0.2}s`;
        }
        starsContainer.appendChild(star);
    }
    
    document.getElementById('reward-exp').innerText = exp;
    document.getElementById('reward-coin').innerText = coin;
    
    document.getElementById('success-modal').style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('success-modal').style.display = 'none';
}
