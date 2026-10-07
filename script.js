/* ==========================================================================
   EDITORIAL PRESENTATION ENGINE - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // STATE VARIABLES
    let currentSlide = 1;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let isAudioEnabled = true;
    let isDocumentView = false;

    // DOM ELEMENTS
    const progressBar = document.getElementById('progress-bar');
    const currentSlideNum = document.getElementById('current-slide-num');
    const totalSlidesNum = document.getElementById('total-slides-num');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const thumbnailsContainer = document.getElementById('slide-thumbnails');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const viewModeBtn = document.getElementById('view-mode-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    // INITIALIZE
    if (totalSlidesNum) totalSlidesNum.textContent = totalSlides;
    buildThumbnails();
    updateSlideView();

    // WEB AUDIO API SOUND GENERATOR (Subtle Editorial Click Effects)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playClickSound(freq = 440, type = 'sine') {
        if (!isAudioEnabled) return;
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } catch (e) {
            console.log('Audio notice:', e);
        }
    }

    // SLIDE NAVIGATION FUNCTIONS
    function goToSlide(index) {
        if (index < 1) index = 1;
        if (index > totalSlides) index = totalSlides;
        
        if (currentSlide !== index) {
            playClickSound(480, 'sine');
        }

        currentSlide = index;
        updateSlideView();
    }

    function updateSlideView() {
        slides.forEach((slide, idx) => {
            if (idx + 1 === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update progress bar
        const progressPercentage = (currentSlide / totalSlides) * 100;
        if (progressBar) progressBar.style.width = `${progressPercentage}%`;

        // Update Counter
        if (currentSlideNum) currentSlideNum.textContent = currentSlide;

        // Update Prev/Next disabled states
        if (prevBtn) prevBtn.disabled = (currentSlide === 1);
        if (nextBtn) nextBtn.disabled = (currentSlide === totalSlides);

        // Update active thumb
        const thumbs = thumbnailsContainer.querySelectorAll('.thumb-btn');
        thumbs.forEach((thumb, idx) => {
            if (idx + 1 === currentSlide) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    function buildThumbnails() {
        if (!thumbnailsContainer) return;
        thumbnailsContainer.innerHTML = '';
        for (let i = 1; i <= totalSlides; i++) {
            const btn = document.createElement('button');
            btn.className = `thumb-btn ${i === 1 ? 'active' : ''}`;
            btn.textContent = i;
            btn.title = `انتقل إلى الشريحة ${i}`;
            btn.addEventListener('click', () => goToSlide(i));
            thumbnailsContainer.appendChild(btn);
        }
    }

    // EVENT LISTENERS: NEXT / PREV BUTTONS
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    }

    // Triggers inside slides
    document.querySelectorAll('.nav-next-trigger').forEach(btn => {
        btn.addEventListener('click', () => goToSlide(currentSlide + 1));
    });

    document.querySelectorAll('.nav-first-trigger').forEach(btn => {
        btn.addEventListener('click', () => goToSlide(1));
    });

    // KEYBOARD NAVIGATION (RTL Aware: Left Arrow = Next slide in RTL, Right Arrow = Previous slide)
    document.addEventListener('keydown', (e) => {
        if (isDocumentView) return;

        if (e.key === 'ArrowLeft' || e.key === 'Space') {
            e.preventDefault();
            goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToSlide(currentSlide - 1);
        } else if (e.key === 'Home') {
            goToSlide(1);
        } else if (e.key === 'End') {
            goToSlide(totalSlides);
        }
    });

    // AUDIO TOGGLE
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            isAudioEnabled = !isAudioEnabled;
            const btnText = audioToggleBtn.querySelector('.btn-text');

            if (isAudioEnabled) {
                if (btnText) btnText.textContent = 'الصوت: مفعل';
                playClickSound(600);
            } else {
                if (btnText) btnText.textContent = 'الصوت: معطل';
            }
        });
    }

    // DOCUMENT VIEW TOGGLE MODE
    if (viewModeBtn) {
        viewModeBtn.addEventListener('click', () => {
            isDocumentView = !isDocumentView;
            document.body.classList.toggle('document-view-active', isDocumentView);
            
            const btnText = viewModeBtn.querySelector('.btn-text');

            if (isDocumentView) {
                if (btnText) btnText.textContent = 'نمط الشرائح';
            } else {
                if (btnText) btnText.textContent = 'نمط المستند';
                updateSlideView();
            }
            playClickSound(350);
        });
    }

    // FULLSCREEN TOGGLE
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log('Fullscreen error:', err);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            playClickSound(450);
        });
    }

    // INTERACTIVE FREUD PSYCHE TABS (Slide 6)
    const psycheBtns = document.querySelectorAll('.psyche-tab-btn');
    psycheBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            psycheBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetPsyche = btn.getAttribute('data-psyche');
            document.querySelectorAll('.psyche-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            const activePanel = document.getElementById(`psyche-content-${targetPsyche}`);
            if (activePanel) activePanel.classList.add('active');

            playClickSound(500);
        });
    });

    // INTERACTIVE QUIZ LOGIC (Slide 10 - Emoji-Free)
    const quizOpts = document.querySelectorAll('.quiz-opt');
    const quizFeedback = document.getElementById('quiz-feedback');

    quizOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const isCorrect = opt.getAttribute('data-correct') === 'true';
            quizOpts.forEach(b => b.disabled = true);

            if (isCorrect) {
                opt.style.backgroundColor = 'var(--accent-burgundy)';
                opt.style.color = '#FFFFFF';
                opt.style.borderColor = 'var(--accent-burgundy)';
                if (quizFeedback) {
                    quizFeedback.textContent = 'إجابة صحيحة. المفكر كارل غوستاف يونغ هو من صاغ مفهوم اللاوعي الجمعي.';
                    quizFeedback.style.color = 'var(--accent-burgundy)';
                }
                playClickSound(750, 'sine');
            } else {
                opt.style.backgroundColor = 'var(--text-muted)';
                opt.style.color = '#FFFFFF';
                if (quizFeedback) {
                    quizFeedback.textContent = 'إجابة غير دقيقة. الإجابة الصحيحة هي المفكر كارل غوستاف يونغ.';
                    quizFeedback.style.color = 'var(--text-muted)';
                }
                playClickSound(220, 'sine');
            }
        });
    });

});
