// db-sync.js — Scratch Academy Firebase Sync Engine v4
// =====================================================
// AUTH DESIGN:
//   accounts/{username}  → { displayName, passwordHash, classCode, studentKey }
//   students/{classCode}/{studentKey} → progress data
//   Password hashed with SHA-256 + salt via Web Crypto API

(function() {

    // ── Helpers ──────────────────────────────────────────────────────────────
    function sanitizeKey(str) {
        return str.trim()
            .replace(/\s+/g, '_')
            .replace(/[.#$[\]\/]/g, '-')
            .toLowerCase()
            .substring(0, 64) || 'unnamed';
    }

    function sanitizeUsername(str) {
        return str.trim()
            .replace(/\s+/g, '')
            .replace(/[.#$[\]\/\s]/g, '_')
            .toLowerCase()
            .substring(0, 32) || 'user';
    }

    function showToast(msg, color = '#34d399', duration = 3000) {
        const t = document.createElement('div');
        t.style.cssText = `
            position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
            background:#1e293b; border:1px solid ${color}55; border-left:4px solid ${color};
            color:white; font-size:13px; padding:12px 20px; border-radius:12px;
            z-index:99998; box-shadow:0 8px 30px rgba(0,0,0,0.4);
            animation: fadeInUp .3s ease; white-space:nowrap;
        `;
        if (!document.getElementById('toast-style')) {
            const s = document.createElement('style');
            s.id = 'toast-style';
            s.textContent = `@keyframes fadeInUp { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }`;
            document.head.appendChild(s);
        }
        t.innerHTML = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), duration);
    }

    // ── SHA-256 Password Hashing (Web Crypto API) ────────────────────────────
    const SALT = 'scratch_academy_2567_secure';
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + SALT);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ── State ────────────────────────────────────────────────────────────────
    let currentClassCode  = localStorage.getItem('scratch_class_code')  || null;
    let currentStudentKey = localStorage.getItem('scratch_student_key') || null;
    let currentUsername   = localStorage.getItem('scratch_username')    || null;

    // ── Firebase init ────────────────────────────────────────────────────────
    const dbUrl = typeof FIREBASE_DB_URL !== 'undefined'
        ? FIREBASE_DB_URL
        : 'https://my-scratch-academy-default-rtdb.asia-southeast1.firebasedatabase.app/';

    function initFirebase() {
        try {
            if (typeof firebase !== 'undefined') {
                if (!firebase.apps.length) firebase.initializeApp({ databaseURL: dbUrl });
                window.firebaseDB = firebase.database();
                console.log('✅ Firebase connected:', dbUrl);
            }
        } catch(e) { console.error('❌ Firebase init error:', e); }
    }
    initFirebase();

    // ── Authentic Performance-Based Rubric Score Calculator ─────────────────
    function calculateRubricScores(missions, lessons) {
        const map = {
            sequencing:  { m:[1,2,3,5],           l:['1'] },
            loops:       { m:[4,10,11,16],         l:['11','12','13','14'] },
            coordinates: { m:[7,10,12,16],         l:[] },
            events:      { m:[2,6,12,13],          l:['4'] },
            conditions:  { m:[8,9,15,17,18],       l:['6','7','8','9','10'] },
            operators:   { m:[3,5,14,17],          l:['3','8','9'] },
            variables:   { m:[1,3,4,13,18,20],     l:['2','5','15','16','17'] },
            functions:   { m:[15,19,20],           l:['18','19','20'] }
        };
        const scores = {};
        Object.keys(map).forEach(key => {
            const level = parseInt(localStorage.getItem('rubric_debug_level_' + key) || '0', 10);
            scores[key] = Math.min(3, Math.max(0, level));
        });
        return scores;
    }

    // ── Helper to clear all local student progress ───────────────────────────
    function clearLocalStorageProgress() {
        localStorage.removeItem('scratch_completed_missions');
        localStorage.removeItem('python_completed_lessons');
        localStorage.removeItem('scratch_pre_test_score');
        localStorage.removeItem('scratch_post_test_score');
        localStorage.removeItem('scratch_badges');
        ['sequencing','loops','coordinates','events','conditions','operators','variables','functions'].forEach(k => {
            localStorage.removeItem('rubric_quiz_completed_' + k);
            localStorage.removeItem('rubric_debug_level_' + k);
        });
    }

    // ── Restore progress from Firebase snapshot ──────────────────────────────
    function restoreProgressFromCloud(snap) {
        clearLocalStorageProgress();
        if (!snap || typeof snap.val !== 'function') {
            _refreshScoreUI();
            return;
        }
        const d = snap.val();
        if (!d) {
            _refreshScoreUI();
            return;
        }

        if (d.completedMissions) localStorage.setItem('scratch_completed_missions', JSON.stringify(d.completedMissions));
        if (d.completedLessons)  localStorage.setItem('python_completed_lessons',   JSON.stringify(d.completedLessons));
        if (d.preScore  !== null && d.preScore  !== undefined) localStorage.setItem('scratch_pre_test_score',  String(d.preScore));
        if (d.postScore !== null && d.postScore !== undefined) localStorage.setItem('scratch_post_test_score', String(d.postScore));
        if (d.badges)    localStorage.setItem('scratch_badges', JSON.stringify(d.badges));
        if (d.rubricDebugLevels) {
            Object.keys(d.rubricDebugLevels).forEach(k => {
                const lvl = parseInt(d.rubricDebugLevels[k] || 0, 10);
                localStorage.setItem('rubric_debug_level_' + k, String(lvl));
                localStorage.setItem('rubric_quiz_completed_' + k, lvl >= 3 ? 'true' : 'false');
            });
        }
        showToast('✅ โหลดข้อมูลการเรียนของคุณจากคลาวด์เรียบร้อยแล้ว', '#34d399');
        _refreshScoreUI();
        setTimeout(() => {
            if (typeof window.checkAndAwardBadges   === 'function') window.checkAndAwardBadges();
            if (typeof window.renderMyRubricProfile === 'function') window.renderMyRubricProfile();
            if (typeof window.renderBadgeGrid       === 'function') window.renderBadgeGrid();
            if (typeof window.loadLeaderboard        === 'function') window.loadLeaderboard();
        }, 400);
    }

    function _refreshScoreUI() {
        const pre  = localStorage.getItem('scratch_pre_test_score');
        const post = localStorage.getItem('scratch_post_test_score');
        const preEl  = document.getElementById('pre-test-score-val');
        const postEl = document.getElementById('post-test-score-val');
        if (preEl)  preEl.textContent  = pre  !== null ? `${pre} / 20`  : 'ยังไม่ได้ทำ';
        if (postEl) postEl.textContent = post !== null ? `${post} / 20` : 'ยังไม่ได้ทำ';
    }

    // ── Sync to Firebase ─────────────────────────────────────────────────────
    window.syncProgressToCloud = function() {
        if (!window.firebaseDB || !currentClassCode || !currentStudentKey) return;
        const name      = localStorage.getItem('scratch_student_name') || 'ผู้เรียนนิรนาม';
        const preScore  = localStorage.getItem('scratch_pre_test_score');
        const postScore = localStorage.getItem('scratch_post_test_score');
        const missions  = JSON.parse(localStorage.getItem('scratch_completed_missions') || '{}');
        const lessons   = JSON.parse(localStorage.getItem('python_completed_lessons')   || '{}');
        const badges    = JSON.parse(localStorage.getItem('scratch_badges')             || '{}');
        const missionsCount = Object.values(missions).filter(Boolean).length;
        const lessonsCount  = Object.values(lessons).filter(Boolean).length;
        const rubricQuizPassed = {};
        const rubricDebugLevels = {};
        ['sequencing','loops','coordinates','events','conditions','operators','variables','functions'].forEach(k => {
            const lvl = parseInt(localStorage.getItem('rubric_debug_level_' + k) || '0', 10);
            rubricDebugLevels[k] = lvl;
            rubricQuizPassed[k]  = lvl >= 3;
        });
        const data = {
            key: currentStudentKey, name, classCode: currentClassCode,
            username: currentUsername || '',
            preScore:  preScore  !== null ? parseInt(preScore)  : null,
            postScore: postScore !== null ? parseInt(postScore) : null,
            missionsCount, lessonsCount,
            completedMissions: missions,
            completedLessons:  lessons,
            rubrics: calculateRubricScores(missions, lessons),
            rubricDebugLevels,
            rubricQuizPassed, badges,
            lastUpdated: new Date().toISOString()
        };
        window.firebaseDB.ref(`students/${currentClassCode}/${currentStudentKey}`).set(data)
            .then(() => {
                console.log(`✅ Synced → students/${currentClassCode}/${currentStudentKey}`);
                if (typeof window.loadLeaderboard === 'function') setTimeout(window.loadLeaderboard, 300);
            })
            .catch(err => console.error('❌ Sync failed:', err));
    };

    // ── REGISTER new account ──────────────────────────────────────────────────
    window.registerStudent = async function(username, password, confirmPassword, firstname, lastname, classCode) {
        if (!username || !password || !firstname || !lastname || !classCode) {
            return { ok: false, msg: '⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง' };
        }
        if (password.length < 4) {
            return { ok: false, msg: '⚠️ รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร' };
        }
        if (password !== confirmPassword) {
            return { ok: false, msg: '⚠️ รหัสผ่านทั้งสองช่องไม่ตรงกัน' };
        }
        const uname = sanitizeUsername(username);
        if (!uname) return { ok: false, msg: '⚠️ ชื่อผู้ใช้ไม่ถูกต้อง' };

        const code = classCode.toUpperCase().trim();
        if (typeof isValidClassCode === 'function' && !isValidClassCode(code)) {
            return { ok: false, msg: '❌ รหัสห้องเรียนไม่ถูกต้อง' };
        }

        // Check username not taken
        const existing = await window.firebaseDB.ref(`accounts/${uname}`).once('value');
        if (existing.exists()) {
            return { ok: false, msg: `❌ ชื่อผู้ใช้ "${uname}" ถูกใช้แล้ว กรุณาเลือกชื่ออื่น` };
        }

        const fullName   = `${firstname.trim()} ${lastname.trim()}`;
        const studentKey = sanitizeKey(fullName);
        const pwHash     = await hashPassword(password);

        // Save account record
        await window.firebaseDB.ref(`accounts/${uname}`).set({
            displayName:  fullName,
            firstname:    firstname.trim(),
            lastname:     lastname.trim(),
            passwordHash: pwHash,
            classCode:    code,
            studentKey:   studentKey,
            createdAt:    new Date().toISOString()
        });

        // Set session & clear local data for new account
        _setSession(uname, fullName, firstname.trim(), lastname.trim(), code, studentKey);
        clearLocalStorageProgress();
        _refreshScoreUI();

        setTimeout(window.syncProgressToCloud, 800);
        return { ok: true, msg: `🎉 สมัครสำเร็จ! ยินดีต้อนรับ ${fullName}` };
    };

    // ── LOGIN existing account ────────────────────────────────────────────────
    window.loginStudent = async function(username, password) {
        if (!username || !password) {
            return { ok: false, msg: '⚠️ กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
        }
        const uname = sanitizeUsername(username);
        const snap  = await window.firebaseDB.ref(`accounts/${uname}`).once('value');
        if (!snap.exists()) {
            return { ok: false, msg: '❌ ไม่พบชื่อผู้ใช้นี้ในระบบ กรุณาสมัครก่อน' };
        }
        const account  = snap.val();
        const pwHash   = await hashPassword(password);
        if (pwHash !== account.passwordHash) {
            return { ok: false, msg: '❌ รหัสผ่านไม่ถูกต้อง' };
        }

        // Set session
        _setSession(uname, account.displayName, account.firstname, account.lastname, account.classCode, account.studentKey);

        // Restore progress from cloud or reset if none exists
        if (window.firebaseDB) {
            const progressSnap = await window.firebaseDB.ref(`students/${account.classCode}/${account.studentKey}`).once('value');
            if (progressSnap.exists()) {
                restoreProgressFromCloud(progressSnap);
            } else {
                clearLocalStorageProgress();
                _refreshScoreUI();
                showToast(`✅ เข้าสู่ระบบสำเร็จ! สวัสดี ${account.displayName}`, '#34d399');
            }
        }
        setTimeout(window.syncProgressToCloud, 800);
        return { ok: true, msg: `✅ เข้าสู่ระบบสำเร็จ` };
    };

    // ── Session helper ───────────────────────────────────────────────────────
    function _setSession(username, fullName, firstname, lastname, classCode, studentKey) {
        currentUsername   = username;
        currentClassCode  = classCode;
        currentStudentKey = studentKey;
        localStorage.setItem('scratch_username',          username);
        localStorage.setItem('scratch_student_name',      fullName);
        localStorage.setItem('scratch_student_firstname', firstname);
        localStorage.setItem('scratch_student_lastname',  lastname);
        localStorage.setItem('scratch_class_code',        classCode);
        localStorage.setItem('scratch_student_key',       studentKey);

        // Update header display
        const displayEl = document.getElementById('header-student-display');
        const badgeEl   = document.getElementById('header-class-badge');
        if (displayEl) displayEl.textContent = fullName;
        if (badgeEl) {
            const label = (typeof getClassName === 'function') ? getClassName(classCode) : classCode;
            badgeEl.textContent   = label || classCode;
            badgeEl.style.display = 'inline-block';
        }
    }

    // ── Student Login (Quick Modal / Name Entry) ──────────────────────────────
    window.studentLogin = async function(firstname, lastname, classCode) {
        const fn = (firstname || '').trim();
        const ln = (lastname || '').trim();
        const code = (classCode || '').trim().toUpperCase();
        if (!fn || !ln || !code) return false;

        const fullName = `${fn} ${ln}`;
        const studentKey = sanitizeKey(`${fn}_${ln}`);
        const username = sanitizeUsername(`${fn}_${ln}`);

        _setSession(username, fullName, fn, ln, code, studentKey);

        // Fetch cloud data for this student or reset stale local storage
        if (window.firebaseDB) {
            try {
                const progressSnap = await window.firebaseDB.ref(`students/${code}/${studentKey}`).once('value');
                if (progressSnap.exists()) {
                    restoreProgressFromCloud(progressSnap);
                } else {
                    clearLocalStorageProgress();
                    _refreshScoreUI();
                }
            } catch(e) {
                console.error("Cloud fetch error:", e);
            }
        }

        setTimeout(window.syncProgressToCloud, 800);
        return true;
    };

    // ── Logout ───────────────────────────────────────────────────────────────
    window.logoutStudent = function() {
        ['scratch_username','scratch_student_name','scratch_student_firstname','scratch_student_lastname',
         'scratch_class_code','scratch_student_key','scratch_class_code_confirmed'].forEach(k => localStorage.removeItem(k));
        clearLocalStorageProgress();
        currentUsername = currentClassCode = currentStudentKey = null;
        _refreshScoreUI();
        const modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'flex';
        // Switch to login tab
        const loginTab = document.getElementById('tab-login');
        if (loginTab) loginTab.click();
    };

    // ── DOM Bindings ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.firebaseDB && typeof firebase !== 'undefined') initFirebase();

        // Restore header display if already logged in
        const savedName = localStorage.getItem('scratch_student_name') || '';
        const savedCode = localStorage.getItem('scratch_class_code')   || '';
        const displayEl = document.getElementById('header-student-display');
        const badgeEl   = document.getElementById('header-class-badge');
        if (displayEl && savedName) displayEl.textContent = savedName;
        if (badgeEl && savedCode) {
            const label = (typeof getClassName === 'function') ? getClassName(savedCode) : savedCode;
            badgeEl.textContent   = label || savedCode;
            badgeEl.style.display = 'inline-block';
        }

        // Show login modal if not logged in (only on index.html which has the modal)
        const modal = document.getElementById('login-modal');
        if (!currentStudentKey || !currentClassCode) {
            if (modal) modal.style.display = 'flex';
        } else {
            if (modal) modal.style.display = 'none';
            setTimeout(window.syncProgressToCloud, 1200);
            setTimeout(_refreshScoreUI, 500);
        }

        // Restore header-student-name input (present on mission/motion/python-learn pages)
        const headerNameInput = document.getElementById('header-student-name');
        if (headerNameInput && !headerNameInput.value) {
            const name = localStorage.getItem('scratch_student_name') || '';
            if (name) headerNameInput.value = name;
        }

        // Change student button
        const btnChange = document.getElementById('btn-change-student');
        if (btnChange) {
            btnChange.addEventListener('click', () => {
                const modal = document.getElementById('login-modal');
                if (modal) modal.style.display = 'flex';
            });
        }
    });

})();
