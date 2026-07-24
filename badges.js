// badges.js — Scratch Academy Badge / Achievement System
// =====================================================

(function() {

    const BADGE_DEFS = [
        {
            id: 'first_step',
            icon: '🌟',
            name: 'First Step',
            desc: 'ผ่านด่าน Scratch ด่านแรก',
            color: '#facc15',
            check: (data) => Object.values(data.completedMissions || {}).filter(Boolean).length >= 1
        },
        {
            id: 'hot_streak',
            icon: '🔥',
            name: 'Hot Streak',
            desc: 'ผ่านด่าน Scratch 5 ด่านขึ้นไป',
            color: '#fb923c',
            check: (data) => Object.values(data.completedMissions || {}).filter(Boolean).length >= 5
        },
        {
            id: 'scratch_hero',
            icon: '🐱',
            name: 'Scratch Hero',
            desc: 'ผ่านด่าน Scratch ครบทุกด่าน (20 ด่าน)',
            color: '#60a5fa',
            check: (data) => Object.values(data.completedMissions || {}).filter(Boolean).length >= 20
        },
        {
            id: 'pythonista',
            icon: '🐍',
            name: 'Pythonista',
            desc: 'จบบทเรียน Python ครบทุกบท',
            color: '#4ade80',
            check: (data) => Object.values(data.completedLessons || {}).filter(Boolean).length >= 5
        },
        {
            id: 'quiz_ace',
            icon: '🧠',
            name: 'Quiz Ace',
            desc: 'ทำแบบทดสอบก่อนเรียน (Pre-test) ได้ ≥ 14/20',
            color: '#c084fc',
            check: (data) => (data.preScore || 0) >= 14
        },
        {
            id: 'top_scorer',
            icon: '🏆',
            name: 'Top Scorer',
            desc: 'ทำแบบทดสอบหลังเรียน (Post-test) ได้ ≥ 18/20',
            color: '#f97316',
            check: (data) => (data.postScore || 0) >= 18
        },
        {
            id: 'rubric_master',
            icon: '⭐',
            name: 'Rubric Master',
            desc: 'ผ่านแบบทดสอบย่อยรูบริกครบทุก 8 หัวข้อ',
            color: '#fbbf24',
            check: (data) => {
                const keys = ['sequencing','loops','coordinates','events','conditions','operators','variables','functions'];
                return keys.every(k => data.rubricQuizPassed && data.rubricQuizPassed[k]);
            }
        },
        {
            id: 'rover_pilot',
            icon: '🚀',
            name: 'Rover Pilot',
            desc: 'ผ่านเกม Code Rover ครบทั้ง 3 ด่าน',
            color: '#38bdf8',
            check: (data) => Object.values(data.game2dCompleted || {}).filter(Boolean).length >= 3
        },
        {
            id: 'rpg_explorer',
            icon: '🗺️',
            name: 'RPG Explorer',
            desc: 'เคลียร์ภารกิจ Python RPG อย่างน้อย 3 ด่าน',
            color: '#a78bfa',
            check: (data) => (data.rpgClearedCount || 0) >= 3
        },
        {
            id: 'graduate',
            icon: '🎓',
            name: 'Graduate',
            desc: 'ได้รับครบ 7 Badges หลัก (ไม่รวม Rover/RPG)',
            color: '#34d399',
            check: (data) => {
                const earned = data.badges || {};
                const required = ['first_step','hot_streak','scratch_hero','pythonista','quiz_ace','top_scorer','rubric_master'];
                return required.every(id => earned[id]);
            }
        }
    ];

    // ── Toast notification ──────────────────────────────────────────────────
    function showBadgeToast(badge) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 24px; right: 24px; z-index: 99999;
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border: 1px solid ${badge.color}55;
            border-left: 4px solid ${badge.color};
            border-radius: 14px; padding: 16px 20px;
            display: flex; align-items: center; gap: 14px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.5);
            animation: slideInRight 0.4s cubic-bezier(.22,1,.36,1);
            max-width: 320px;
        `;
        toast.innerHTML = `
            <div style="font-size: 34px; flex-shrink:0;">${badge.icon}</div>
            <div>
                <div style="font-size:10px; color:${badge.color}; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:3px;">🎉 Badge ใหม่!</div>
                <div style="font-size:14px; color:white; font-weight:700; margin-bottom:2px;">${badge.name}</div>
                <div style="font-size:11px; color:rgba(255,255,255,0.5);">${badge.desc}</div>
            </div>
        `;

        // Add animation keyframes once
        if (!document.getElementById('badge-toast-style')) {
            const style = document.createElement('style');
            style.id = 'badge-toast-style';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(120%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateX(0); }
                    to   { opacity: 0; transform: translateX(40px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.4s forwards';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // ── Check & award badges ────────────────────────────────────────────────
    window.checkAndAwardBadges = function() {
        // Build current data snapshot from localStorage
        const completedMissions = JSON.parse(localStorage.getItem('scratch_completed_missions') || '{}');
        const completedLessons  = JSON.parse(localStorage.getItem('python_completed_lessons')  || '{}');
        const preScore  = parseInt(localStorage.getItem('scratch_pre_test_score')  || '0');
        const postScore = parseInt(localStorage.getItem('scratch_post_test_score') || '0');
        const game2dCompleted = JSON.parse(localStorage.getItem('game2d_completed_levels') || '{}');
        const rpgSave = JSON.parse(localStorage.getItem('python-rpg-save') || 'null');
        const rpgClearedCount = Array.isArray(rpgSave && rpgSave.clearedLevels) ? rpgSave.clearedLevels.length : 0;

        const rubricQuizPassed = {};
        ['sequencing','loops','coordinates','events','conditions','operators','variables','functions'].forEach(k => {
            rubricQuizPassed[k] = localStorage.getItem('rubric_quiz_completed_' + k) === 'true';
        });

        const existingBadges = JSON.parse(localStorage.getItem('scratch_badges') || '{}');

        const data = {
            completedMissions, completedLessons, preScore, postScore, rubricQuizPassed,
            badges: existingBadges, game2dCompleted, rpgClearedCount
        };

        let newBadgeAwarded = false;

        BADGE_DEFS.forEach(badge => {
            if (!existingBadges[badge.id] && badge.check(data)) {
                existingBadges[badge.id] = new Date().toISOString();
                showBadgeToast(badge);
                newBadgeAwarded = true;
                // Re-check graduate badge with updated data
                data.badges = existingBadges;
            }
        });

        if (newBadgeAwarded) {
            localStorage.setItem('scratch_badges', JSON.stringify(existingBadges));
            // Sync to Firebase
            if (typeof window.syncProgressToCloud === 'function') {
                setTimeout(window.syncProgressToCloud, 500);
            }
        }
        
        // Re-render badge grid always to ensure UI is up-to-date
        if (typeof window.renderBadgeGrid === 'function') window.renderBadgeGrid();

        return existingBadges;
    };

    // ── Render badge grid (for profile/quiz tab) ───────────────────────────
    window.renderBadgeGrid = function() {
        const container = document.getElementById('badge-display-grid');
        if (!container) return;

        const earned = JSON.parse(localStorage.getItem('scratch_badges') || '{}');
        container.innerHTML = '';

        BADGE_DEFS.forEach(badge => {
            const isEarned = !!earned[badge.id];
            const card = document.createElement('div');
            card.title = badge.desc;
            card.style.cssText = `
                display: flex; flex-direction: column; align-items: center; gap: 6px;
                padding: 12px 8px; border-radius: 12px; cursor: default;
                border: 1px solid ${isEarned ? badge.color + '55' : 'rgba(255,255,255,0.06)'};
                background: ${isEarned ? badge.color + '11' : 'rgba(255,255,255,0.02)'};
                filter: ${isEarned ? 'none' : 'grayscale(1) opacity(0.35)'};
                transition: transform .2s;
                min-width: 72px;
            `;
            card.onmouseenter = () => { if (isEarned) card.style.transform = 'scale(1.08)'; };
            card.onmouseleave = () => card.style.transform = 'scale(1)';
            card.innerHTML = `
                <div style="font-size: 28px;">${badge.icon}</div>
                <div style="font-size: 10px; font-weight: 700; color: ${isEarned ? badge.color : 'rgba(255,255,255,0.3)'}; text-align:center; line-height:1.3;">${badge.name}</div>
                ${isEarned ? `<div style="font-size:9px; color:rgba(255,255,255,0.3);">${new Date(earned[badge.id]).toLocaleDateString('th-TH')}</div>` : '<div style="font-size:9px;color:rgba(255,255,255,0.2);">ยังไม่ได้รับ</div>'}
            `;
            container.appendChild(card);
        });
    };

    // ── Auto-check on page load ─────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(window.checkAndAwardBadges, 1500);
        setTimeout(window.renderBadgeGrid, 1600);
    });

})();
