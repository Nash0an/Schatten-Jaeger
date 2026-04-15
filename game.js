class SchattenJaeger {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.audioCtx = null;

        const saved = localStorage.getItem('sj_v2_data');
        this.saveData = saved ? JSON.parse(saved) : { unlockedLevel: 0, bests: {} };
        this.masterModeActive = false;
        this.restoreProgressFromBests();

        this.state = 'MENU';
        this.gameMode = 'SOLO';
        this.currentLevelIdx = 0;
        this.score = 0;
        this.timer = 0;
        this.enemies = [];
        this.particles = [];
        this.comboGroups = [];
        this.keys = {};
        this.keyBuffer = ""; // Für das Passwort
        this.shake = 0;
        this.spawnTimer = 0;
        this.missionSplashTimer = 0;

        // Touch Data
        this.isTouchDevice = false; // Startet immer als false
        this.touchInitialized = false;
        this.joystickData = {
            left: { visible: false, active: false, id: null, centerX: 0, centerY: 0, vectorX: 0, vectorY: 0 },
            right: { visible: false, active: false, id: null, centerX: 0, centerY: 0, vectorX: 0, vectorY: 0 }
        };

        this.player = { x: 0, y: 0, radius: 10, speed: 5 };
        this.pillar = { x: 0, y: 0, radius: 40, baseRadius: 40, angle: 0 };
        
        this.isLightOn = true;
        this.lightAngle = 0;
        this.lightSpread = Math.PI / 3;
        this.rotationSpeed = 0.08;

        this.bindEvents();
        this.resize();
        this.updateLevelSelect();
        this.loop();
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            document.getElementById('audio-init-btn').style.display = 'none';
        }
    }

    getLastLevelId() {
        return LEVELS[LEVELS.length - 1].id;
    }

    getHighestCompletedLevel() {
        const completedIds = Object.keys(this.saveData.bests)
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id));
        if (completedIds.length === 0) return -1;
        return Math.max(...completedIds);
    }

    restoreProgressFromBests() {
        const highestCompleted = this.getHighestCompletedLevel();
        const recoveredUnlockedLevel = Math.min(highestCompleted + 1, this.getLastLevelId());

        if (typeof this.saveData.unlockedLevel !== 'number' || Number.isNaN(this.saveData.unlockedLevel)) {
            this.saveData.unlockedLevel = 0;
        }

        if (this.saveData.unlockedLevel > recoveredUnlockedLevel) {
            this.saveData.unlockedLevel = recoveredUnlockedLevel;
            localStorage.setItem('sj_v2_data', JSON.stringify(this.saveData));
        }
    }

    getHighestSelectableLevel() {
        return this.masterModeActive ? this.getLastLevelId() : Math.min(this.saveData.unlockedLevel, this.getLastLevelId());
    }

    initTouch() {
        if (this.touchInitialized) return;
        this.isTouchDevice = true;
        this.touchInitialized = true;
        
        window.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: false });
        window.addEventListener('touchend', (e) => this.handleTouch(e), { passive: false });
        window.addEventListener('touchcancel', (e) => this.handleTouch(e), { passive: false });
        
        this.configureTouchControls();
    }
    playKillSound() {
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        const variation = 0.95 + Math.random() * 0.1; // +/- 5% Pitch
        const frequencies = [659.25 * variation, 1318.51 * variation]; 

        frequencies.forEach((freq, i) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.005); // Minimales Arpeggio
            gain.gain.setValueAtTime(0.08, now + i * 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.005 + 0.15);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now + i * 0.005);
            osc.stop(now + i * 0.005 + 0.15);
        });
    }


    playWinSound() {
        if (!this.audioCtx) return;
        const notes = [440, 554, 659, 880];
        notes.forEach((f, i) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.frequency.setValueAtTime(f, this.audioCtx.currentTime + i * 0.1);
            gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + i * 0.1 + 0.3);
            osc.connect(gain); gain.connect(this.audioCtx.destination);
            osc.start(this.audioCtx.currentTime + i * 0.1);
            osc.stop(this.audioCtx.currentTime + i * 0.1 + 0.3);
        });
    }

    playLoseSound() {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, this.audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
        osc.connect(gain); gain.connect(this.audioCtx.destination);
        osc.start(); osc.stop(this.audioCtx.currentTime + 0.5);
    }

    setMode(mode) {
        this.gameMode = mode;
        document.getElementById('mode-solo').classList.toggle('selected', mode === 'SOLO');
        document.getElementById('mode-coop').classList.toggle('selected', mode === 'COOP');
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Passwort-Erkennung (nur im Menü)
            if (this.state === 'MENU') {
                this.keyBuffer += e.key.toLowerCase();
                if (this.keyBuffer.length > 20) this.keyBuffer = this.keyBuffer.substring(1);
                
                if (this.keyBuffer.endsWith("angimylove")) {
                    this.activateMasterMode();
                    this.keyBuffer = "";
                } else if (this.keyBuffer.endsWith("exit")) {
                    this.deactivateMasterMode();
                    this.keyBuffer = "";
                }
            }
        });
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        const soloCard = document.getElementById('mode-solo');
        const coopCard = document.getElementById('mode-coop');
        if (soloCard) soloCard.addEventListener('pointerup', () => this.setMode('SOLO'));
        if (coopCard) coopCard.addEventListener('pointerup', () => this.setMode('COOP'));

        // Globaler Touch-Listener zur Aktivierung der Touch-Steuerung
        window.addEventListener('touchstart', () => this.initTouch(), { once: true });
    }

    activateMasterMode() {
        this.masterModeActive = true;
        this.updateLevelSelect();
        
        // Visuelles Feedback
        const startBtn = document.getElementById('main-start-btn');
        if (startBtn) {
            startBtn.innerText = "MEISTER-MODUS AKTIVIERT!";
            startBtn.style.background = "#44ff44";
            setTimeout(() => {
                startBtn.style.background = "";
                this.updateLevelSelect();
            }, 2000);
        }
        
        // Kurzer Bestätigungssound
        if (this.audioCtx) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
            osc.connect(gain); gain.connect(this.audioCtx.destination);
            osc.start(); osc.stop(this.audioCtx.currentTime + 0.5);
        }
    }

    deactivateMasterMode() {
        if (!this.masterModeActive) return;

        this.masterModeActive = false;
        this.updateLevelSelect();

        const startBtn = document.getElementById('main-start-btn');
        if (startBtn) {
            startBtn.innerText = "MEISTER-MODUS BEENDET";
            startBtn.style.background = "#444";
            setTimeout(() => {
                startBtn.style.background = "";
                this.updateLevelSelect();
            }, 1500);
        }
    }


    getJoystickCenter(side) {
        const horizontalOffset = 110;
        const bottomOffset = 110;
        return {
            x: side === 'left' ? horizontalOffset : this.canvas.width - horizontalOffset,
            y: this.canvas.height - bottomOffset
        };
    }

    configureTouchControls() {
        if (!this.isTouchDevice) return;

        const showRight = this.state === 'PLAYING' && this.gameMode === 'COOP';
        const showLeft = this.state === 'PLAYING';

        ['left', 'right'].forEach(side => {
            const data = this.joystickData[side];
            const center = this.getJoystickCenter(side);
            data.centerX = center.x;
            data.centerY = center.y;
            data.visible = side === 'left' ? showLeft : showRight;

            if (!data.visible) {
                data.active = false;
                data.id = null;
                data.vectorX = 0;
                data.vectorY = 0;
            }

            this.updateJoystickUI(side);
        });
    }

    getJoystickTouchSide(x, y) {
        const activationRadius = 70;

        for (const side of ['left', 'right']) {
            const data = this.joystickData[side];
            if (!data.visible || data.active) continue;

            const dx = x - data.centerX;
            const dy = y - data.centerY;
            if (Math.sqrt(dx * dx + dy * dy) <= activationRadius) {
                return side;
            }
        }

        return null;
    }

    updateJoystickVector(side, x, y) {
        const data = this.joystickData[side];
        const maxRadius = 40;
        const dx = x - data.centerX;
        const dy = y - data.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            const limitedDist = Math.min(dist, maxRadius);
            data.vectorX = (dx / dist) * (limitedDist / maxRadius);
            data.vectorY = (dy / dist) * (limitedDist / maxRadius);
        } else {
            data.vectorX = 0;
            data.vectorY = 0;
        }

        this.updateJoystickUI(side);
    }

    releaseJoystick(side) {
        const data = this.joystickData[side];
        data.active = false;
        data.id = null;
        data.vectorX = 0;
        data.vectorY = 0;
        this.updateJoystickUI(side);
    }

    handleTouch(e) {
        if (this.state !== 'PLAYING') return;
        e.preventDefault();

        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const tx = touch.clientX;
            const ty = touch.clientY;

            if (e.type === 'touchstart') {
                const side = this.getJoystickTouchSide(tx, ty);
                if (side) {
                    const data = this.joystickData[side];
                    data.active = true;
                    data.id = touch.identifier;
                    this.updateJoystickVector(side, tx, ty);
                }
            } else if (e.type === 'touchmove') {
                for (const side in this.joystickData) {
                    const data = this.joystickData[side];
                    if (data.active && data.id === touch.identifier) {
                        this.updateJoystickVector(side, tx, ty);
                    }
                }
            } else if (e.type === 'touchend' || e.type === 'touchcancel') {
                for (const side in this.joystickData) {
                    const data = this.joystickData[side];
                    if (data.active && data.id === touch.identifier) {
                        this.releaseJoystick(side);
                    }
                }
            }
        }
    }

    updateJoystickUI(side) {
        const data = this.joystickData[side];
        const container = document.getElementById(`joystick-${side}`);
        if (!container) return;

        if (!data.visible) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        container.style.left = `${data.centerX}px`;
        container.style.top = `${data.centerY}px`;

        const thumb = container.querySelector('.joystick-thumb');
        const maxRadius = 40;
        const tx = (data.active ? data.vectorX : 0) * maxRadius;
        const ty = (data.active ? data.vectorY : 0) * maxRadius;
        thumb.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px)`;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.updatePillarPos();
        this.configureTouchControls();
    }

    updatePillarPos() {
        const lvl = LEVELS[this.currentLevelIdx];
        if (!lvl || lvl.pillarBehavior === 'static' || lvl.pillarBehavior === 'shrinking') {
            this.pillar.x = this.canvas.width / 2;
            this.pillar.y = this.canvas.height / 2;
        }
    }

    updateLevelSelect() {
        const container = document.getElementById('level-select');
        if (!container) return;
        const highestSelectableLevel = this.getHighestSelectableLevel();
        container.innerHTML = '';
        LEVELS.forEach(lvl => {
            const btn = document.createElement('button');
            btn.innerText = lvl.id;
            btn.className = 'lvl-btn' + (lvl.id > highestSelectableLevel ? ' locked' : '');
            const best = this.saveData.bests[lvl.id];
            if (best !== undefined) {
                const bestSpan = document.createElement('span');
                bestSpan.className = 'best';
                bestSpan.innerText = lvl.targetType === 'score' ? best : best.toFixed(1) + 's';
                btn.appendChild(bestSpan);
            }
            btn.onclick = () => { if (lvl.id <= highestSelectableLevel) this.startLevel(lvl.id); };
            container.appendChild(btn);
        });
        const startBtn = document.getElementById('main-start-btn');
        if (startBtn) {
            const prefix = this.masterModeActive ? "MEISTER: " : "";
            startBtn.innerText = `${prefix}LEVEL ${highestSelectableLevel} STARTEN`;
        }
    }

    showMenu() {
        this.state = 'MENU';
        this.updateUI();
        this.updateLevelSelect();
        this.configureTouchControls();
    }

    startLevel(id) {
        this.initAudio();
        const lvl = LEVELS.find(l => l.id === id);
        this.currentLevelIdx = LEVELS.indexOf(lvl);
        this.score = 0;
        this.timer = 0;
        this.enemies = [];
        this.particles = [];
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2 - 80;
        this.spawnTimer = 60;
        this.missionSplashTimer = 180; // 3 Sekunden für bessere Lesbarkeit
        this.pillar.radius = lvl.pillarRadius;
        this.pillar.baseRadius = lvl.pillarRadius;
        this.pillar.angle = 0;
        this.isLightOn = true;
        this.updatePillarPos();
        this.state = 'PLAYING';
        this.updateUI();
        this.configureTouchControls();
    }

    retry() { this.startLevel(LEVELS[this.currentLevelIdx].id); }
    nextLevel() {
        const nextId = LEVELS[this.currentLevelIdx].id + 1;
        if (nextId <= LEVELS.length) this.startLevel(nextId);
        else this.showMenu();
    }

    updateUI() {
        const menu = document.getElementById('menu-overlay');
        const win = document.getElementById('win-overlay');
        const lose = document.getElementById('lose-overlay');
        const hud = document.getElementById('hud');

        if (menu) menu.classList.toggle('hidden', this.state !== 'MENU');
        if (win) win.classList.toggle('hidden', this.state !== 'WIN');
        if (lose) lose.classList.toggle('hidden', this.state !== 'LOSE');
        if (hud) hud.classList.toggle('hidden', this.state === 'MENU');

        if (this.state === 'PLAYING') {
            const lvl = LEVELS[this.currentLevelIdx];
            const hudLvl = document.getElementById('hud-level');
            const hudTarget = document.getElementById('hud-target');
            if (hudLvl) hudLvl.innerText = `${lvl.id}: ${lvl.name}`;
            
            let targetText = "";
            if (lvl.targetType === 'score') targetText = `${lvl.targetValue} Pkt`;
            else if (lvl.targetType === 'survival') targetText = `${lvl.targetValue}s überleben`;
            else if (lvl.targetType === 'pacifist') targetText = `${lvl.targetValue}s (max ${lvl.maxScore} Pkt)`;
            if (hudTarget) hudTarget.innerText = `Ziel: ${targetText}`;
        }
    }

    calcComboPoints(groupSize) {
        return 10 * Math.pow(2, groupSize - 1);
    }

    getComboColor(groupSize) {
        if (groupSize === 1) return '#ff4444';
        if (groupSize === 2) return '#ff8844';
        if (groupSize === 3) return '#ffcc44';
        return '#44ff44';
    }

    getComboGroupSize(enemy) {
        for (const group of this.comboGroups) {
            if (group.includes(enemy)) return group.length;
        }
        return 1;
    }

    findOrCreateComboGroup(newEnemy) {
        let mergedGroups = [];
        let groupIndex = -1;

        for (let i = 0; i < this.comboGroups.length; i++) {
            const group = this.comboGroups[i];
            for (const e of group) {
                const dist = Math.sqrt((newEnemy.x - e.x) ** 2 + (newEnemy.y - e.y) ** 2);
                if (dist < newEnemy.radius + e.radius) {
                    if (groupIndex === -1) groupIndex = i;
                    mergedGroups.push(i);
                    break;
                }
            }
        }

        if (mergedGroups.length > 0) {
            let allEnemies = [];
            for (const gi of mergedGroups) {
                allEnemies = allEnemies.concat(this.comboGroups[gi]);
            }
            allEnemies.push(newEnemy);
            
            // Entferne Gruppen von hinten nach vorne
            const sortedMerged = mergedGroups.sort((a,b) => b-a);
            for (const gi of sortedMerged) {
                this.comboGroups.splice(gi, 1);
            }
            this.comboGroups.push(allEnemies);
            
            for (const e of allEnemies) {
                e.comboSize = allEnemies.length;
            }
            return;
        }

        this.comboGroups.push([newEnemy]);
        newEnemy.comboSize = 1;
    }

    removeFromComboGroups(enemy) {
        for (let i = this.comboGroups.length - 1; i >= 0; i--) {
            const group = this.comboGroups[i];
            const pos = group.indexOf(enemy);
            if (pos !== -1) {
                group.splice(pos, 1);
                for (const e of group) {
                    e.comboSize = group.length;
                }
                if (group.length <= 1) {
                    if (group.length === 1) group[0].comboSize = 1;
                    this.comboGroups.splice(i, 1);
                }
            }
        }
    }


    getShadowPoly() {
        if (!this.isLightOn) return null;
        const px=this.player.x, py=this.player.y, cx=this.pillar.x, cy=this.pillar.y, r=this.pillar.radius;
        const dx=cx-px, dy=cy-py, d=Math.sqrt(dx*dx+dy*dy);
        if (d <= r) return null;
        if (this.gameMode === 'COOP') {
            let angleToPillar = Math.atan2(dy, dx);
            let diff = angleToPillar - this.lightAngle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            const pillarWidthAngle = Math.atan2(r, d);
            if (Math.abs(diff) > (this.lightSpread/2 + pillarWidthAngle)) return null;
        }
        const ang=Math.atan2(dy, dx), tang=Math.asin(r/d);
        const a1=ang+tang+Math.PI/2, a2=ang-tang-Math.PI/2;
        const t1x=cx+Math.cos(a1)*r, t1y=cy+Math.sin(a1)*r, t2x=cx+Math.cos(a2)*r, t2y=cy+Math.sin(a2)*r;
        const pr=4000;
        return [{x:t1x, y:t1y}, {x:t2x, y:t2y}, {x:t2x+(t2x-px)*pr, y:t2y+(t2y-py)*pr}, {x:t1x+(t1x-px)*pr, y:t1y+(t1y-py)*pr}];
    }

    isPointInPoly(p, poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            if (((poly[i].y > p.y) !== (poly[j].y > p.y)) && (p.x < (poly[j].x - poly[i].x) * (p.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)) inside = !inside;
        }
        return inside;
    }

    update() {
        if (this.state !== 'PLAYING') return;
        if (this.spawnTimer > 0) this.spawnTimer--;
        if (this.missionSplashTimer > 0) this.missionSplashTimer--;

        const lvl = LEVELS[this.currentLevelIdx];
        this.timer += 1/60;
        const currentEnemySpeed = lvl.enemySpeedStart + (lvl.enemySpeedMax - lvl.enemySpeedStart) * Math.min(1, this.timer * lvl.acceleration);
        const currentSpawnRate = lvl.spawnRateStart - (lvl.spawnRateStart - lvl.spawnRateMax) * Math.min(1, this.timer * lvl.acceleration);
        
        // Pillar Behavior (Unterstützt jetzt mehrere Effekte)
        const behavior = lvl.pillarBehavior || "";
        if (behavior.includes('moving')) {
            this.pillar.angle += 0.02;
            this.pillar.x = this.canvas.width / 2 + Math.cos(this.pillar.angle) * 150;
            this.pillar.y = this.canvas.height / 2 + Math.sin(this.pillar.angle * 1.5) * 100;
        }
        if (behavior.includes('shrinking')) {
            this.pillar.radius = Math.max(10, this.pillar.baseRadius - this.timer * 0.8);
        }
        if (behavior.includes('pulsating')) {
            const pulse = Math.sin(this.timer * 3) * 15;
            this.pillar.radius = Math.max(5, this.pillar.baseRadius + pulse);
        }

        // Light Behavior
        if (lvl.lightBehavior === 'flickering') { 
            if (Math.random() < 0.02) this.isLightOn = !this.isLightOn; 
        } else { 
            this.isLightOn = true; 
        }
        
        // Movement Vektor initialisieren
        let dx = 0, dy = 0;

        if (this.gameMode === 'SOLO') {
            // Solo: WASD + Pfeile steuern die Bewegung
            if (this.keys['ArrowUp'] || this.keys['KeyW']) dy -= 1;
            if (this.keys['ArrowDown'] || this.keys['KeyS']) dy += 1;
            if (this.keys['ArrowLeft'] || this.keys['KeyA']) dx -= 1;
            if (this.keys['ArrowRight'] || this.keys['KeyD']) dx += 1;
            
            // Linker Joystick (oder einziger im Solo) zur Bewegung hinzufügen
            dx += this.joystickData.left.vectorX;
            dy += this.joystickData.left.vectorY;

            const mag = Math.sqrt(dx*dx + dy*dy);
            if (mag > 0) {
                const speedMult = Math.min(1, mag);
                this.player.x += (dx/mag) * this.player.speed * speedMult;
                this.player.y += (dy/mag) * this.player.speed * speedMult;
            }
        } else {
            // Koop: Nur WASD steuert P1 Bewegung
            if (this.keys['KeyW']) dy -= 1;
            if (this.keys['KeyS']) dy += 1;
            if (this.keys['KeyA']) dx -= 1;
            if (this.keys['KeyD']) dx += 1;
            
            // Linker Joystick für P1 Bewegung
            dx += this.joystickData.left.vectorX;
            dy += this.joystickData.left.vectorY;

            const mag = Math.sqrt(dx*dx + dy*dy);
            if (mag > 0) {
                const speedMult = Math.min(1, mag);
                this.player.x += (dx/mag) * this.player.speed * speedMult;
                this.player.y += (dy/mag) * this.player.speed * speedMult;
            }

            // Koop: Nur Pfeile steuern P2 Lichtrotation
            if (this.keys['ArrowLeft']) this.lightAngle -= this.rotationSpeed;
            if (this.keys['ArrowRight']) this.lightAngle += this.rotationSpeed;
            
            // Rechter Joystick für P2 Lichtrotation
            if (this.joystickData.right.active) {
                this.lightAngle += this.joystickData.right.vectorX * this.rotationSpeed * 1.5;
            }
        }
        this.player.x = Math.max(this.player.radius, Math.min(this.canvas.width - this.player.radius, this.player.x));
        this.player.y = Math.max(this.player.radius, Math.min(this.canvas.height - this.player.radius, this.player.y));
        const pdx=this.player.x-this.pillar.x, pdy=this.player.y-this.pillar.y, pdist=Math.sqrt(pdx*pdx+pdy*pdy);
        if (pdist < this.player.radius+this.pillar.radius){
            const ang=Math.atan2(pdy,pdx);
            this.player.x=this.pillar.x+Math.cos(ang)*(this.player.radius+this.pillar.radius);
            this.player.y=this.pillar.y+Math.sin(ang)*(this.player.radius+this.pillar.radius);
        }
        const shadow = this.getShadowPoly();
        if (Math.random() < 1/currentSpawnRate) {
            const side = Math.floor(Math.random()*4);
            let ex, ey;
            if(side===0){ex=Math.random()*this.canvas.width; ey=-20;}
            else if(side===1){ex=this.canvas.width+20; ey=Math.random()*this.canvas.height;}
            else if(side===2){ex=Math.random()*this.canvas.width; ey=this.canvas.height+20;}
            else {ex=-20; ey=Math.random()*this.canvas.height;}
            const enemyRadius = lvl.enemyRadius || 12;
            const newEnemy = { x: ex, y: ey, radius: enemyRadius, speed: currentEnemySpeed };
            this.enemies.push(newEnemy);
            this.findOrCreateComboGroup(newEnemy);
        }
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            const edx = this.player.x - e.x, edy = this.player.y - e.y, edist = Math.sqrt(edx*edx + edy*edy);
            if (edist < this.player.radius + e.radius) {
                this.lose("Die Dunkelheit hat dich eingeholt.");
                return;
            }
            if (edist > 0) {
                e.x += (edx/edist) * e.speed;
                e.y += (edy/edist) * e.speed;
            }
            if (shadow && this.isPointInPoly(e, shadow)) {
                const distToPillar = Math.sqrt((e.x - this.pillar.x) ** 2 + (e.y - this.pillar.y) ** 2);
                const withinKillRadius = lvl.shadowKillRadius === undefined || lvl.shadowKillRadius === null || distToPillar <= lvl.shadowKillRadius;
                
                if (withinKillRadius) {
                    const comboSize = this.getComboGroupSize(e);
                    const points = this.calcComboPoints(comboSize);
                    this.score += points;
                    this.shake = 8 + comboSize * 4; // Stärkerer Shake bei Combos
                    this.playKillSound();
                    
                    const pColor = this.getComboColor(comboSize);
                    for (let j = 0; j < 12; j++) {
                        this.particles.push({ 
                            x: e.x, y: e.y, 
                            vx: (Math.random() - 0.5) * 12, 
                            vy: (Math.random() - 0.5) * 12, 
                            life: 1.0,
                            color: pColor,
                            size: 2 + Math.random() * 3
                        });
                    }
                    this.removeFromComboGroups(e);
                    this.enemies.splice(i, 1);
                    if (lvl.targetType === 'pacifist' && this.score > lvl.maxScore) {
                        this.lose("Pazifist-Ziel gescheitert!");
                        return;
                    }
                }
            }
        }
        for (let i=this.particles.length-1; i>=0; i--) {
            const p = this.particles[i]; 
            p.x += p.vx; p.y += p.vy; 
            p.vx *= 0.95; p.vy *= 0.95; // Reibung
            p.life -= 0.025;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
        if (this.shake > 0) this.shake *= 0.9;
        if (this.state !== 'PLAYING') return;
        if (lvl.targetType === 'score' && this.score >= lvl.targetValue) this.win();
        if ((lvl.targetType === 'survival' || lvl.targetType === 'pacifist') && this.timer >= lvl.targetValue) this.win();
        const scoreHud = document.getElementById('hud-score');
        if (scoreHud) scoreHud.innerText = `Score: ${this.score}`;
        
        const timerHud = document.getElementById('hud-timer');
        if (timerHud) {
            const mins = Math.floor(this.timer / 60);
            const secs = Math.floor(this.timer % 60);
            const tenths = Math.floor((this.timer * 10) % 10);
            timerHud.innerText = `Zeit: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
        }
    }

    lose(msg) { 
        this.state = 'LOSE'; 
        this.playLoseSound(); 
        this.configureTouchControls();

        const loseMsg = document.getElementById('lose-msg');
        if (loseMsg) loseMsg.innerText = msg; 
        this.updateUI(); 
    }

    win() {
        this.state = 'WIN'; this.playWinSound();
        this.configureTouchControls();

        const lvl = LEVELS[this.currentLevelIdx];
        const currentVal = lvl.targetType === 'score' ? this.score : this.timer;
        const oldBest = this.saveData.bests[lvl.id];
        let isNewBest = false;
        if (oldBest === undefined || (lvl.targetType === 'score' && currentVal > oldBest) || (lvl.targetType !== 'score' && currentVal > oldBest)) {
            this.saveData.bests[lvl.id] = currentVal; isNewBest = true;
        }
        const winBestMsg = document.getElementById('win-best-msg');
        if (winBestMsg) winBestMsg.innerText = isNewBest ? "NEUER REKORD!" : "";
        if (lvl.id === this.saveData.unlockedLevel && this.saveData.unlockedLevel < this.getLastLevelId()) {
            this.saveData.unlockedLevel++;
        }
        localStorage.setItem('sj_v2_data', JSON.stringify(this.saveData));
        this.updateUI();
    }

    draw() {
        const lvl = LEVELS[this.currentLevelIdx];

        this.ctx.save();
        if (this.shake > 0.5) this.ctx.translate((Math.random()-0.5)*this.shake, (Math.random()-0.5)*this.shake);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#050505'; this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
        const poly = this.getShadowPoly();
        if (poly) { this.ctx.fillStyle = 'rgba(35, 35, 35, 0.8)'; this.ctx.beginPath(); this.ctx.moveTo(poly[0].x, poly[0].y); poly.forEach(pt => this.ctx.lineTo(pt.x, pt.y)); this.ctx.fill(); }
        this.ctx.fillStyle = '#111'; this.ctx.beginPath(); this.ctx.arc(this.pillar.x, this.pillar.y, this.pillar.radius, 0, Math.PI*2); this.ctx.fill(); this.ctx.strokeStyle = '#333'; this.ctx.stroke();
        
        this.particles.forEach(p => { 
            this.ctx.fillStyle = p.color || `rgba(255, 100, 100, ${p.life})`; 
            const s = (p.size || 2) * p.life;
            this.ctx.fillRect(p.x - s/2, p.y - s/2, s, s); 
        });
        this.enemies.forEach(e => { 
            const comboSize = e.comboSize || 1;
            const color = this.getComboColor(comboSize);
            this.ctx.fillStyle = color; 
            
            if (comboSize > 1) {
                const glowIntensity = 10 + (comboSize - 1) * 5;
                this.ctx.shadowBlur = glowIntensity; 
                this.ctx.shadowColor = color; 
            }

            this.ctx.beginPath(); 
            this.ctx.arc(e.x, e.y, e.radius, 0, Math.PI*2); 
            this.ctx.fill(); 
            this.ctx.shadowBlur = 0; 
        });
        if (this.isLightOn) {
            if (this.gameMode === 'SOLO') {
                const grad = this.ctx.createRadialGradient(this.player.x, this.player.y, 0, this.player.x, this.player.y, 350);
                grad.addColorStop(0, 'rgba(255,255,255,0.15)'); grad.addColorStop(1, 'transparent');
                this.ctx.fillStyle = grad; this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
            } else {
                this.ctx.save(); this.ctx.translate(this.player.x, this.player.y); this.ctx.rotate(this.lightAngle);
                const grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 500);
                grad.addColorStop(0, 'rgba(255,255,255,0.25)'); grad.addColorStop(1, 'transparent');
                this.ctx.fillStyle = grad; this.ctx.beginPath(); this.ctx.moveTo(0,0); this.ctx.arc(0,0, 500, -this.lightSpread/2, this.lightSpread/2); this.ctx.closePath(); this.ctx.fill(); this.ctx.restore();
            }
        }
        this.ctx.fillStyle = '#fff'; this.ctx.shadowBlur = 20; this.ctx.shadowColor = '#fff'; this.ctx.beginPath(); this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI*2); this.ctx.fill(); this.ctx.shadowBlur = 0;
        
        // Spawn-Effekt (Arc-Drop: Konzentrische Bögen springen ins Bild)
        if (this.spawnTimer > 0) {
            const t = 1 - (this.spawnTimer / 60);
            // Elastic Easing für "Einschlag"-Gefühl
            const ease = 1 - Math.pow(1 - t, 3); 
            
            this.ctx.save();
            this.ctx.translate(this.player.x, this.player.y);
            
            for (let i = 0; i < 3; i++) {
                const startRadius = 200 + i * 50;
                const targetRadius = this.player.radius + i * 8;
                const currentRadius = startRadius - (startRadius - targetRadius) * ease;
                const opacity = Math.min(1, this.spawnTimer / 30);
                
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.lineWidth = 3 - i;
                this.ctx.beginPath();
                // Bögen rotieren leicht beim Fallen
                const rotation = (1 - ease) * Math.PI;
                this.ctx.arc(0, 0, currentRadius, rotation + i * Math.PI/2, rotation + i * Math.PI/2 + Math.PI/2);
                this.ctx.stroke();
            }
            this.ctx.restore();
        }

        // Mission-Splash (Großer Auftragstext)
        if (this.missionSplashTimer > 0) {
            let opacity = 1;
            if (this.missionSplashTimer < 60) opacity = this.missionSplashTimer / 60;

            this.ctx.save();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 32px Segoe UI, sans-serif';
            
            let targetText = "";
            if (lvl.targetType === 'score') targetText = `ZIEL: ${lvl.targetValue} PUNKTE`;
            else if (lvl.targetType === 'survival') targetText = `ÜBERLEBE ${lvl.targetValue} SEKUNDEN`;
            else if (lvl.targetType === 'pacifist') targetText = `PAZIFIST: ${lvl.targetValue}s (MAX ${lvl.maxScore} PKT)`;
            
            this.ctx.fillText(targetText, this.canvas.width / 2, this.canvas.height / 2 - 150);
            this.ctx.font = '16px Segoe UI, sans-serif';
            this.ctx.fillText(`${lvl.id}: ${lvl.name.toUpperCase()}`, this.canvas.width / 2, this.canvas.height / 2 - 190);
            this.ctx.restore();
        }

        // Tutorial-Hinweise (nur in Level 0)
        if (lvl.isTutorial && this.state === 'PLAYING') {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.textAlign = 'center';
            this.ctx.font = '16px Segoe UI, sans-serif';
            
            let tip = "BEWEGE DICH MIT WASD ODER PFEILTASTEN";
            if (this.score > 0) tip = "GUT GEMACHT! VERNICHTE WEITERE GEGNER";
            else if (this.enemies.length > 0) tip = "LOCKE DEN GEGNER IN DEN SCHATTEN DER SÄULE";
            
            this.ctx.fillText(tip, this.canvas.width / 2, this.canvas.height - 150);
            this.ctx.restore();
        }

        this.ctx.restore();
    }

    loop() { this.update(); this.draw(); requestAnimationFrame(() => this.loop()); }
}

// Initialisierung
const game = new SchattenJaeger();
