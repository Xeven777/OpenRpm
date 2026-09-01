(function() {
    const CONFIG = {
        totalTime: 20 * 60,
        imageExt: '.svg',
        imagePath: 'images/',
    };

    const NORMATIVE_DISTRIBUTION = {
        0:  [0, 0, 0, 0, 0],
        15: [8, 4, 2, 1, 0],
        16: [8, 4, 2, 1, 0],
        17: [8, 5, 2, 1, 1],
        18: [8, 5, 2, 2, 1],
        19: [8, 6, 3, 2, 0],
        20: [8, 6, 4, 2, 0],
        21: [8, 6, 4, 2, 1],
        22: [9, 6, 4, 2, 1],
        23: [9, 7, 4, 3, 1],
        24: [9, 7, 4, 3, 1],
        25: [10, 7, 4, 3, 1],
        26: [10, 7, 5, 3, 1],
        27: [10, 7, 5, 4, 1],
        28: [10, 7, 6, 4, 1],
        29: [10, 7, 6, 4, 1],
        30: [10, 7, 7, 5, 1],
        31: [10, 8, 7, 5, 1],
        32: [10, 8, 7, 5, 2],
        33: [11, 8, 7, 5, 2],
        34: [11, 8, 7, 5, 2],
        35: [11, 8, 7, 6, 2],
        36: [11, 8, 7, 6, 2],
        37: [11, 9, 8, 7, 2],
        38: [11, 9, 8, 8, 2],
        39: [11, 10, 8, 8, 2],
        40: [11, 10, 8, 8, 3],
        41: [11, 10, 9, 8, 3],
        42: [11, 10, 9, 8, 3],
        43: [11, 10, 9, 9, 3],
        44: [12, 10, 9, 9, 4],
        45: [12, 10, 9, 9, 5],
        46: [12, 10, 9, 10, 5],
        47: [12, 10, 9, 10, 6],
        48: [12, 11, 10, 10, 6],
        49: [12, 11, 10, 10, 6],
        50: [12, 11, 11, 10, 7],
        51: [12, 11, 11, 11, 7],
        52: [12, 11, 11, 11, 7],
        53: [12, 12, 12, 9, 8],
        54: [12, 12, 12, 10, 8],
        55: [12, 12, 12, 11, 9],
        56: [12, 12, 12, 11, 9],
        57: [12, 12, 12, 12, 10],
        58: [12, 12, 12, 12, 10],
        59: [12, 12, 12, 12, 11],
        60: [12, 12, 12, 12, 12]
    };

    class SplineInterpolator {
        constructor(points) {
            this.points = points;
            this.points.sort((a, b) => a.x - b.x);
        }

        interpolate(x) {
            if (x <= this.points[0].x) return this.points[0].y;
            if (x >= this.points[this.points.length - 1].x) return this.points[this.points.length - 1].y;

            let i = 0;
            for (let j = 0; j < this.points.length - 1; j++) {
                if (this.points[j].x <= x && x <= this.points[j+1].x) {
                    i = j;
                    break;
                }
            }

            const p0 = this.points[Math.max(0, i - 1)];
            const p1 = this.points[i];
            const p2 = this.points[Math.min(this.points.length - 1, i + 1)];
            const p3 = this.points[Math.min(this.points.length - 1, i + 2)];

            const t = (x - p1.x) / (p2.x - p1.x);
            const t2 = t * t;
            const t3 = t2 * t;

            const h1 = 2*p1.y + (-p0.y + p2.y)*t;
            const h2 = (2*p0.y - 5*p1.y + 4*p2.y - p3.y)*t2;
            const h3 = (-p0.y + 3*p1.y - 3*p2.y + p3.y)*t3;

            return 0.5 * (h1 + h2 + h3);
        }
    }

    const splineData = [
        {x: 0, y: 0}, {x: 15, y: 62},
        {x: 16, y: 65}, {x: 17, y: 65},
        {x: 18, y: 66}, {x: 19, y: 67},
        {x: 20, y: 69}, {x: 22, y: 71},
        {x: 23, y: 72}, {x: 24, y: 73},
        {x: 25, y: 75}, {x: 26, y: 76},
        {x: 27, y: 77}, {x: 28, y: 79},
        {x: 29, y: 80}, {x: 30, y: 82},
        {x: 31, y: 83}, {x: 32, y: 84},
        {x: 33, y: 86}, {x: 34, y: 87},
        {x: 35, y: 88}, {x: 36, y: 90},
        {x: 37, y: 91}, {x: 38, y: 92},
        {x: 39, y: 94}, {x: 40, y: 95},
        {x: 41, y: 96}, {x: 42, y: 98},
        {x: 43, y: 99}, {x: 44, y: 100},
        {x: 45, y: 102},{x: 46, y: 104},
        {x: 47, y: 105}, {x: 48, y: 106},
        {x: 49, y: 108}, {x: 50, y: 110},
        {x: 51, y: 112}, {x: 52, y: 114},
        {x: 53, y: 116}, {x: 54, y: 118},
        {x: 55, y: 122}, {x: 56, y: 124},
        {x: 57, y: 126}, {x: 58, y: 128},
        {x: 59, y: 130}, {x: 60, y: 140}
    ];

    const splineIQ = new SplineInterpolator(splineData);

    function getBaseIQ(score) {
        return splineIQ.interpolate(Math.round(score));
    }

    class RavenApp {
        constructor() {
            this.currentQuestion = 1;
            this.userAnswers = {};
            this.timeLeft = CONFIG.totalTime;
            this.timerInterval = null;
            this.testActive = false;
            this.agePercent = 100;
            this.currentLang = 'en';
            this.endTime = 0;
            this.lastRenderedQuestion = null;

            this.imageCache = new Map();

            this.preloadQueue = [];
            this.activeConnections = 0;
            this.maxConnections = 6;

            this.screens = {
                intro: document.getElementById('intro-screen'),
                test: document.getElementById('test-screen'),
                result: document.getElementById('result-screen')
            };

            this.dom = {
                timerBar: document.getElementById('timer-bar-fill'),
                qImage: document.getElementById('q-image'),
                options: document.getElementById('options-container'),
                qNum: document.getElementById('current-q-num'),
                series: document.getElementById('current-series'),
                progressContainer: document.getElementById('progress-container'),
                prevBtn: document.getElementById('btn-prev'),
                nextBtn: document.getElementById('btn-next'),
                resultTable: document.querySelector('table'),
                interpretationCard: document.querySelectorAll('.sub-card')[0],
                totalScore: document.getElementById('total-raw-score'),
                timeTaken: document.getElementById('time-taken'),
                confirmModal: document.getElementById('confirm-modal'),
                userAge: document.getElementById('user-age'),
                modalTitle: document.getElementById('modal-title'),
                modalMessage: document.getElementById('modal-message'),
                confirmBtn: document.querySelector('.btn-confirm'),
                timerBarWrap: document.querySelector('.timer-bar'),
                resumeModal: document.getElementById('resume-modal')
            };
            this.STORAGE_KEY = 'raven_progress_v1';
        }

        init() {
            window.addEventListener('beforeunload', (e) => {
                if (this.testActive) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            });

            window.addEventListener('keydown', (e) => this.handleKeydown(e));

            this.startQueuePreloading(1, 60);

            setTimeout(() => {
                this.determineLanguage();
                this.loadSavedAge();
                this.applyTranslations();
                this.updateMetaTitle();
                this.updateWikiLink();
                this.tryRestoreProgress();
            }, 0);
        }

        handleKeydown(e) {
            if (!this.testActive) return;
            if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
            const s = this.getSeries(this.currentQuestion);
            const optCount = (s === 'A' || s === 'B') ? 6 : 8;
            const key = e.key;
            if (key >= '1' && key <= '8') {
                const n = parseInt(key, 10);
                if (n >= 1 && n <= optCount) {
                    e.preventDefault();
                    this.selectAnswer(n);
                }
            } else if (key === 'ArrowRight' || key === 'Enter') {
                // Enter confirms selection or goes next; avoid double with typing
                if (key === 'Enter' && this.userAnswers[this.currentQuestion] == null) return;
                e.preventDefault();
                this.nextQuestion();
            } else if (key === 'ArrowLeft') {
                e.preventDefault();
                this.prevQuestion();
            }
        }

        saveProgress() {
            try {
                const data = {
                    currentQuestion: this.currentQuestion,
                    userAnswers: this.userAnswers,
                    timeLeft: this.timeLeft,
                    agePercent: this.agePercent,
                    endTime: this.endTime,
                    testActive: this.testActive,
                    savedAt: Date.now()
                };
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            } catch (err) {}
        }

        clearProgress() {
            try { localStorage.removeItem(this.STORAGE_KEY); } catch (err) {}
        }

        tryRestoreProgress() {
            try {
                const raw = localStorage.getItem(this.STORAGE_KEY);
                if (!raw) return;
                const data = JSON.parse(raw);
                // expire after 24h
                if (Date.now() - (data.savedAt || 0) > 24*60*60*1000) { this.clearProgress(); return; }
                if (!data.testActive || !data.userAnswers) return;
                // show resume modal instead of auto-resuming
                if (this.dom.resumeModal) this.dom.resumeModal.classList.remove('hidden');
                this._pendingRestore = data;
            } catch (err) {}
        }

        resumeProgress() {
            const data = this._pendingRestore;
            if (!data) return;
            if (this.dom.resumeModal) this.dom.resumeModal.classList.add('hidden');
            this.currentQuestion = data.currentQuestion || 1;
            this.userAnswers = data.userAnswers || {};
            this.timeLeft = data.timeLeft != null ? data.timeLeft : CONFIG.totalTime;
            this.agePercent = data.agePercent || parseInt(this.dom.userAge.value || '100', 10);
            this.endTime = data.endTime || (Date.now() + this.timeLeft * 1000);
            // if ended time is in past, recalc
            const remaining = Math.ceil((this.endTime - Date.now())/1000);
            if (remaining <= 0) { this.timeLeft = 0; this.finishTest(); return; }
            this.timeLeft = remaining;
            this.screens.intro.classList.add('hidden');
            this.screens.test.classList.remove('hidden');
            this.testActive = true;
            this.startTimer();
            this.renderQuestion();
        }

        discardProgress() {
            this.clearProgress();
            this._pendingRestore = null;
            if (this.dom.resumeModal) this.dom.resumeModal.classList.add('hidden');
        }

        loadSavedAge() {
            const savedAge = localStorage.getItem('raven_age');
            if (savedAge && this.dom.userAge) this.dom.userAge.value = savedAge;
        }

        determineLanguage() {
            this.currentLang = 'en';
        }

        t(key) {
            return TRANSLATIONS[this.currentLang][key] || key;
        }

        updateMetaTitle() { document.title = this.t('site_title'); }

        updateWikiLink() {
            const linkEl = document.querySelector('[data-i18n-href="wiki_url"]');
            if (linkEl) {
                const url = this.t('wiki_url');
                if (url && typeof url === 'string') linkEl.href = url;
            }
        }

        changeLanguage(lang) {
            // single language (en) - no-op kept for compatibility
            this.currentLang = 'en';
        }

        applyTranslations() {
            document.querySelectorAll('[data-i18n]').forEach(el => el.innerText = this.t(el.getAttribute('data-i18n')));
            document.querySelectorAll('[data-i18n-href]').forEach(el => {
                const link = this.t(el.getAttribute('data-i18n-href'));
                if (link && typeof link === 'string') el.href = link;
            });
        }

        resetApp() {
            clearInterval(this.timerInterval);
            this.clearProgress();
            this.testActive = false;
            if(this.dom.confirmModal) this.dom.confirmModal.classList.add('hidden');
            this.screens.test.classList.add('hidden');
            this.screens.result.classList.add('hidden');
            this.currentQuestion = 1;
            this.userAnswers = {};
            this.timeLeft = CONFIG.totalTime;
            this.lastRenderedQuestion = null;

            this.preloadQueue = [];
            this.activeConnections = 0;
            this.screens.intro.classList.remove('hidden');
        }

        startTest() {
            const age = this.dom.userAge.value;
            if (!age) {
                this.dom.modalTitle.innerText = "Error";
                this.dom.modalMessage.innerText = this.t('age_label');

                const tempHandler = () => {
                    this.hideConfirm();
                    this.applyTranslations();
                    this.dom.confirmBtn.onclick = () => this.forceEnd();
                };

                this.dom.confirmBtn.onclick = tempHandler;
                this.dom.confirmModal.classList.remove('hidden');
                return;
            }
            localStorage.setItem('raven_age', age);
            this.agePercent = parseInt(age);
            this.screens.intro.classList.add('hidden');
            this.screens.test.classList.remove('hidden');
            this.testActive = true;
            this.startTimer();
            this.renderQuestion();
        }

        startTimer() {
            this.endTime = Date.now() + (this.timeLeft * 1000);
            this.updateTimerDisplay();
            this.saveProgress();
            let lastSave = Date.now();
            this.timerInterval = setInterval(() => {
                if (!this.testActive) return;
                const now = Date.now();
                const remaining = Math.ceil((this.endTime - now) / 1000);
                this.timeLeft = Math.max(0, remaining);
                this.updateTimerDisplay();
                if (now - lastSave > 1000) { this.saveProgress(); lastSave = now; }
                if (this.timeLeft <= 0) this.finishTest();
            }, 100);
        }

        updateTimerDisplay() {
            const pct = (this.timeLeft / CONFIG.totalTime) * 100;
            this.dom.timerBar.style.width = `${pct}%`;
            if (this.dom.timerBarWrap) this.dom.timerBarWrap.setAttribute('aria-valuenow', String(Math.round(pct)));
            if (pct < 20) this.dom.timerBar.style.background = '#e74c3c';
            else if (pct < 40) this.dom.timerBar.style.background = '#f39c12';
            else this.dom.timerBar.style.background = '#ffffff';
        }

        preloadImage(index) {
            if (this.imageCache.has(index) || index > 60 || index < 1) return;

            this.activeConnections++;
            const url = `${CONFIG.imagePath}${index}${CONFIG.imageExt}`;

            fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.blob();
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                this.imageCache.set(index, blobUrl);
                this.activeConnections--;
                this.processQueue();
            })
            .catch(error => {
                console.error(`Failed to load image ${index}:`, error);
                this.activeConnections--;
                this.processQueue();
            });
        }

        startQueuePreloading(startIndex, count) {
            for (let i = 0; i < count; i++) {
                const idx = startIndex + i;
                if (!this.imageCache.has(idx)) {
                    this.preloadQueue.push(idx);
                }
            }
            this.processQueue();
        }

        processQueue() {
            while (this.activeConnections < this.maxConnections && this.preloadQueue.length > 0) {
                const index = this.preloadQueue.shift();
                this.preloadImage(index);
            }
        }

        getSeries(n) {
            if (n <= 12) return 'A';
            if (n <= 24) return 'B';
            if (n <= 36) return 'C';
            if (n <= 48) return 'D';
            return 'E';
        }

        renderQuestion() {
            const q = this.currentQuestion;
            const s = this.getSeries(q);
            const template = this.t('progress_template');
            this.dom.progressContainer.innerText = template.replace('{q}', q).replace('{s}', s);

            const img = this.dom.qImage;

            if (this.lastRenderedQuestion !== q) {
                this.lastRenderedQuestion = q;

                if (!this.imageCache.has(q)) {
                    this.preloadQueue.unshift(q);
                    this.processQueue();
                }

                const blobUrl = this.imageCache.get(q);

                if (blobUrl) {
                    img.src = blobUrl;
                    img.style.opacity = '1';
                    img.style.filter = '';
                    img.style.transition = 'none';
                } else {
                    const newSrc = `${CONFIG.imagePath}${q}${CONFIG.imageExt}`;
                    img.src = newSrc;
                    img.style.filter = 'grayscale(100%) brightness(0.7)';

                    const onLoad = () => {
                        img.onload = null;
                        img.onerror = null;
                        img.style.filter = '';
                    };

                    img.onload = onLoad;

                    if (img.complete) onLoad();
                }
            }

            this.dom.options.innerHTML = '';
            this.dom.options.className = 'options-grid';
            const optCount = (s === 'A' || s === 'B') ? 6 : 8;
            if (optCount === 6) this.dom.options.classList.add('cols-6');
            for (let i = 1; i <= optCount; i++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `option-btn ${this.userAnswers[q] === i ? 'selected' : ''}`;
                btn.innerText = i;
                btn.setAttribute('role', 'radio');
                btn.setAttribute('aria-checked', this.userAnswers[q] === i ? 'true' : 'false');
                btn.setAttribute('aria-label', `Option ${i}` + (this.userAnswers[q] === i ? ' selected' : ''));
                btn.onclick = () => this.selectAnswer(i);
                this.dom.options.appendChild(btn);
            }
            this.dom.prevBtn.disabled = q === 1;
            if (q === 60) {
                this.dom.nextBtn.innerText = this.t('btn_finish');
                this.dom.nextBtn.classList.add('btn-finish');
            } else {
                this.dom.nextBtn.innerText = this.t('btn_next');
                this.dom.nextBtn.classList.remove('btn-finish');
            }
        }

        selectAnswer(val) {
            this.userAnswers[this.currentQuestion] = val;
            this.saveProgress();
            this.renderQuestion();
            // focus selected for screen reader
            const sel = this.dom.options.querySelector('.selected');
            if (sel) sel.focus({ preventScroll: true });
        }

        nextQuestion() {
            if (this.currentQuestion < 60) {
                this.currentQuestion++;
                this.saveProgress();
                this.renderQuestion();
            } else {
                this.finishTest();
            }
        }

        prevQuestion() {
            if (this.currentQuestion > 1) {
                this.currentQuestion--;
                this.saveProgress();
                this.renderQuestion();
            }
        }

        finishTest() {
            clearInterval(this.timerInterval);
            this.testActive = false;
            this.clearProgress();
            this.screens.test.classList.add('hidden');
            this.screens.result.classList.remove('hidden');
            this.calculateResults();
        }

        confirmEndTest() { if (this.dom.confirmModal) this.dom.confirmModal.classList.remove('hidden'); }
        hideConfirm() { if (this.dom.confirmModal) this.dom.confirmModal.classList.add('hidden'); }
        forceEnd() { this.hideConfirm(); this.resetApp(); }


        iqToPercentile(iq) {
            // z = (IQ-100)/15, percentile via approx normal CDF
            const z = (iq - 100) / 15;
            // Abramowitz & Stegun approx
            const t = 1 / (1 + 0.2316419 * Math.abs(z));
            const d = 0.3989423 * Math.exp(-z*z/2);
            let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
            if (z > 0) prob = 1 - prob;
            return Math.max(1, Math.min(99, Math.round(prob * 100)));
        }

        getClosestNormative(score) {
            if (score < 15) {
                const ratio = score / 15;
                return [
                    Math.round(8 * ratio),
                    Math.round(4 * ratio),
                    Math.round(2 * ratio),
                    Math.round(1 * ratio),
                    0
                ];
            }

            if (NORMATIVE_DISTRIBUTION[score]) return NORMATIVE_DISTRIBUTION[score];
            const keys = Object.keys(NORMATIVE_DISTRIBUTION).map(Number).sort((a, b) => a - b);
            let closest = keys[0];
            let minDiff = Math.abs(score - closest);
            for (let i = 1; i < keys.length; i++) {
                const diff = Math.abs(score - keys[i]);
                if (diff < minDiff) { minDiff = diff; closest = keys[i]; }
            }
            return NORMATIVE_DISTRIBUTION[closest];
        }

        calculateResults() {
            const ANSWER_KEY = getAnswers();
            let rawScore = 0;
            const seriesScores = { A:0, B:0, C:0, D:0, E:0 };
            for (let i = 1; i <= 60; i++) {
                if (this.userAnswers[i] === ANSWER_KEY[i]) {
                    rawScore++;
                    seriesScores[this.getSeries(i)]++;
                }
            }

            let baseIQ = getBaseIQ(rawScore);
            let finalIQ = Math.round((baseIQ * 100) / this.agePercent);
            document.getElementById('final-iq').innerText = finalIQ;
            const pctEl = document.getElementById('final-percentile');
            if (pctEl) pctEl.innerText = this.iqToPercentile(finalIQ) + 'th';

            let diagnosisText = "";
            if (finalIQ >= 140) diagnosisText = this.t('diag_exceptional');
            else if (finalIQ >= 121) diagnosisText = this.t('diag_high');
            else if (finalIQ >= 111) diagnosisText = this.t('diag_above_avg');
            else if (finalIQ >= 91) diagnosisText = this.t('diag_avg');
            else if (finalIQ >= 81) diagnosisText = this.t('diag_below_avg');
            else if (finalIQ >= 71) diagnosisText = this.t('diag_low');
            else if (finalIQ >= 51) diagnosisText = this.t('diag_mild');
            else if (finalIQ >= 21) diagnosisText = this.t('diag_moderate');
            else diagnosisText = this.t('diag_severe');
            document.getElementById('final-diagnosis').innerText = diagnosisText;

            let degreeText = "";
            if (finalIQ >= 121) degreeText = this.t('degree_1');
            else if (finalIQ >= 111) degreeText = this.t('degree_2');
            else if (finalIQ >= 91) degreeText = this.t('degree_3');
            else if (finalIQ >= 81) degreeText = this.t('degree_4');
            else degreeText = this.t('degree_5');

            document.getElementById('interpretation-text').innerText = degreeText;

            const recText = this.getRecommendations(finalIQ);
            document.getElementById('recommendation-text').innerText = recText;

            const seriesNames = ['A', 'B', 'C', 'D', 'E'];
            const expectedNorms = this.getClosestNormative(rawScore);
            let unreliableSeriesCount = 0;
            let deviationA = 0;
            seriesNames.forEach((s, index) => {
                const score = seriesScores[s];
                const expectedScore = expectedNorms[index];
                const deviation = score - expectedScore;
                if (s === 'A') deviationA = deviation;
                if (Math.abs(deviation) > 2) unreliableSeriesCount++;
            });
            // new visuals
            this.renderBellCurve(finalIQ);
            this.renderRadar(seriesScores, expectedNorms);

            const timeTaken = CONFIG.totalTime - this.timeLeft;
            const m = Math.floor(timeTaken / 60);
            const s = timeTaken % 60;
            this.dom.totalScore.innerText = `${rawScore} / 60`;
            this.dom.timeTaken.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;

            const ageVal = document.getElementById('user-age-val');
            if (ageVal && this.dom.userAge && this.dom.userAge.selectedIndex >= 0) {
                ageVal.innerText = this.dom.userAge.options[this.dom.userAge.selectedIndex].text;
            }

            const relMsg = document.getElementById('reliability-msg');

            if (deviationA <= -3) {
                relMsg.innerText = this.t('reliability_defect');
                relMsg.className = "alert-danger";
            } else if (unreliableSeriesCount > 2) {
                relMsg.innerText = this.t('reliability_unreliable');
                relMsg.className = "alert-danger";
            } else if (rawScore < 15) {
                relMsg.innerText = this.t('reliability_low_reliability');
                relMsg.className = "alert-warning";
            } else {
                relMsg.innerText = this.t('reliability_good');
                relMsg.className = "alert-success";
            }
        }

        getRecommendations(iq) {
            if (iq >= 120) return this.t('rec_120');
            if (iq >= 110) return this.t('rec_110');
            if (iq >= 90) return this.t('rec_90');
            if (iq >= 80) return this.t('rec_80');
            return this.t('rec_low');
        }

        renderBellCurve(iq) {
            const wrap = document.getElementById('bell-wrap');
            if (!wrap) return;
            const W = 520, H = 150, pad = 12;
            const mean = 100, sd = 15;
            const minIQ = 55, maxIQ = 145;
            const norm = (x) => (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / sd, 2));
            const maxDens = norm(mean);
            const toX = (iqVal) => pad + ((iqVal - minIQ) / (maxIQ - minIQ)) * (W - pad*2);
            const toY = (dens) => H - 26 - (dens / maxDens) * (H - 40);
            let d = '';
            for (let iqVal = minIQ; iqVal <= maxIQ; iqVal += 1) {
                const x = toX(iqVal);
                const y = toY(norm(iqVal));
                d += (d ? ' L ' : 'M ') + x.toFixed(1) + ' ' + y.toFixed(1);
            }
            const areaD = d + ` L ${toX(maxIQ).toFixed(1)} ${H-26} L ${toX(minIQ).toFixed(1)} ${H-26} Z`;
            const iqX = toX(Math.max(minIQ, Math.min(maxIQ, iq)));
            const pct = this.iqToPercentile(iq);
            wrap.innerHTML = `
                <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IQ distribution">
                    <rect width="${W}" height="${H}" rx="8" fill="#0a0a0a"/>
                    <!-- grid -->
                    <g stroke="#1e1e1e" stroke-width="1">
                        ${[70,85,100,115,130].map(v=>`<line x1="${toX(v)}" y1="12" x2="${toX(v)}" y2="${H-26}"/>`).join('')}
                    </g>
                    <path d="${areaD}" fill="#1a1a1a" stroke="none"/>
                    <path d="${d}" fill="none" stroke="#555" stroke-width="1.6" stroke-linejoin="round"/>
                    <!-- mean line -->
                    <line x1="${toX(100)}" y1="12" x2="${toX(100)}" y2="${H-26}" stroke="#333" stroke-dasharray="4 4"/>
                    <!-- IQ marker -->
                    <g>
                        <line x1="${iqX.toFixed(1)}" y1="14" x2="${iqX.toFixed(1)}" y2="${H-26}" stroke="#fff" stroke-width="1.8"/>
                        <circle cx="${iqX.toFixed(1)}" cy="${toY(norm(Math.max(minIQ,Math.min(maxIQ,iq)))).toFixed(1)}" r="5" fill="#fff" stroke="#000" stroke-width="1.5"/>
                        <g transform="translate(${Math.min(W-44, Math.max(22, iqX-22))}, 16)">
                            <rect x="0" y="0" width="44" height="18" rx="9" fill="#fff"/>
                            <text x="22" y="12.5" text-anchor="middle" font-size="10" font-weight="700" fill="#000" font-family="Inter,sans-serif">${iq}</text>
                        </g>
                    </g>
                    <g font-family="Inter,sans-serif" font-size="8" fill="#666" text-anchor="middle">
                        ${[55,70,85,100,115,130,145].map(v=>`<text x="${toX(v)}" y="${H-6}">${v}</text>`).join('')}
                    </g>
                    <text x="${W/2}" y="${H-30}" text-anchor="middle" font-size="8" fill="#555" font-family="Inter,sans-serif">mean 100 · SD 15 — you: ${pct}th percentile</text>
                </svg>`;
        }

        renderRadar(scores, expected) {
            const wrap = document.getElementById('radar-wrap');
            if (!wrap) return;
            const size = 260, cx = size/2, cy = size/2, R = 96;
            const axes = ['A','B','C','D','E'];
            const levels = 4;
            const angle = (i) => -90 + i * 72;
            const pt = (val, idx, radius) => {
                const rad = angle(idx) * Math.PI/180;
                const r = (val/12) * radius;
                return [cx + Math.cos(rad)*r, cy + Math.sin(rad)*r];
            };
            let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Series profile">`;
            svg += `<rect width="${size}" height="${size}" rx="12" fill="#0a0a0a"/>`;
            // grid
            for (let l=1; l<=levels; l++) {
                const r = (l/levels)*R;
                let d='';
                axes.forEach((_,i)=>{
                    const [x,y]=pt(12,i,r);
                    d += (i?' L ':'M ') + x.toFixed(1) + ' ' + y.toFixed(1);
                });
                d += ' Z';
                svg += `<path d="${d}" fill="none" stroke="#1e1e1e" stroke-width="1"/>`;
            }
            // axes
            axes.forEach((_,i)=>{
                const [x,y]=pt(12,i,R);
                svg += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#1e1e1e" stroke-width="1"/>`;
            });
            // expected polygon (dashed)
            let expD='';
            axes.forEach((a,i)=>{
                const v = expected ? expected[i] : 6;
                const [x,y]=pt(v,i,R);
                expD += (i?' L ':'M ') + x.toFixed(1) + ' ' + y.toFixed(1);
            });
            expD += ' Z';
            svg += `<path d="${expD}" fill="none" stroke="#333" stroke-width="1.2" stroke-dasharray="5 4"/>`;
            // user polygon
            let d='';
            axes.forEach((a,i)=>{
                const v = scores[a] ?? 0;
                const [x,y]=pt(v,i,R);
                d += (i?' L ':'M ') + x.toFixed(1) + ' ' + y.toFixed(1);
            });
            d += ' Z';
            svg += `<path d="${d}" fill="rgba(255,255,255,0.12)" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>`;
            // dots
            axes.forEach((a,i)=>{
                const v = scores[a] ?? 0;
                const [x,y]=pt(v,i,R);
                svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#fff" stroke="#000" stroke-width="1.2"/>`;
            });
            // labels
            axes.forEach((a,i)=>{
                const [x,y]=pt(12,i,R+18);
                const v = scores[a] ?? 0;
                svg += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="#ddd">${a}</text>`;
                svg += `<text x="${x.toFixed(1)}" y="${(y+14).toFixed(1)}" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#666">${v}/12</text>`;
            });
            svg += `<text x="${cx}" y="${size-8}" text-anchor="middle" font-family="Inter,sans-serif" font-size="7" fill="#444">solid = you · dashed = expected for your total</text>`;
            svg += `</svg>`;
            wrap.innerHTML = svg;
        }

        shareResults() {
            const iq = document.getElementById('final-iq')?.innerText || '';
            const pct = document.getElementById('final-percentile')?.innerText || '';
            const text = `I scored ${iq} IQ (${pct} percentile) on Raven's Progressive Matrices — Open RPM.`;
            const url = location.href;
            if (navigator.share) {
                navigator.share({title: document.title, text, url}).catch(()=>{});
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(text + ' ' + url).then(()=> alert('Copied to clipboard: ' + text)).catch(()=> alert(text));
            } else {
                prompt('Copy your result:', text + ' ' + url);
            }
        }

        downloadPDF() {
            window.print();
        }
    }

    window.app = new RavenApp();
    window.app.init();
})();
