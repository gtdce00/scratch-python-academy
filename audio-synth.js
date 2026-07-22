// audio-synth.js - Pure Web Audio API Sound Synthesizer
(function() {
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    window.playCodeSound = function(type) {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            if (type === 'click') {
                // Short, clean sine pop sound
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.08);
            } 
            else if (type === 'success') {
                // Pleasing major arpeggio (C4 -> E4 -> G4 -> C5)
                const notes = [261.63, 329.63, 392.00, 523.25];
                notes.forEach((freq, index) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + index * 0.12);

                    gain.gain.setValueAtTime(0.1, now + index * 0.12);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.12 + 0.3);

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(now + index * 0.12);
                    osc.stop(now + index * 0.12 + 0.3);
                });
            } 
            else if (type === 'error') {
                // Low buzz/sawtooth wave sound
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(110, now);
                osc.frequency.linearRampToValueAtTime(70, now + 0.25);

                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(250, now);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.25);
            }
        } catch (e) {
            console.warn("Web Audio API is not fully supported or blocked by user gesture:", e);
        }
    };

    // Auto-resume audio context on user click to comply with browser gesture requirements
    document.addEventListener('click', function() {
        try {
            const ctx = getAudioContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume();
            }
        } catch (e) {}
    }, { once: false, passive: true });
})();
