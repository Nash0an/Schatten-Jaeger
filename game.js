class SchattenJaeger {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.audioCtx = null;

        const saved = localStorage.getItem('sj_v2_data');
        this.saveData = saved ? JSON.parse(saved) : this.createFreshSaveData();
        this.masterModeActive = false;
        this.restoreProgressFromBests();

        this.state = 'MENU';
        this.gameMode = 'SOLO';
        this.currentMenuTab = 'CLASSIC';
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
        this.collectibleObjective = null;

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
        this.lastFrameTime = performance.now();
        this.setupRingForcePrototype();

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

    getFirstLevelId() {
        return LEVELS[0].id;
    }

    createFreshSaveData() {
        return { unlockedLevel: this.getFirstLevelId(), bests: {} };
    }

    getHighestCompletedLevel() {
        const completedIds = Object.keys(this.saveData.bests)
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id));
        if (completedIds.length === 0) return -1;
        return Math.max(...completedIds);
    }

    restoreProgressFromBests() {
        const firstLevelId = this.getFirstLevelId();
        const highestCompleted = this.getHighestCompletedLevel();
        const recoveredUnlockedLevel = highestCompleted < firstLevelId
            ? firstLevelId
            : Math.min(highestCompleted + 1, this.getLastLevelId());
        let needsSave = false;

        if (typeof this.saveData.unlockedLevel !== 'number' || Number.isNaN(this.saveData.unlockedLevel)) {
            this.saveData.unlockedLevel = firstLevelId;
            needsSave = true;
        }

        if (this.saveData.unlockedLevel < firstLevelId) {
            this.saveData.unlockedLevel = firstLevelId;
            needsSave = true;
        }

        if (this.saveData.unlockedLevel > recoveredUnlockedLevel) {
            this.saveData.unlockedLevel = recoveredUnlockedLevel;
            needsSave = true;
        }

        if (needsSave) {
            localStorage.setItem('sj_v2_data', JSON.stringify(this.saveData));
        }
    }

    getHighestSelectableLevel() {
        return this.getLastLevelId();
    }

    getSuggestedStartLevel() {
        const highestCompleted = this.getHighestCompletedLevel();
        if (highestCompleted < this.getFirstLevelId()) return this.getFirstLevelId();
        return Math.min(highestCompleted + 1, this.getLastLevelId());
    }

    getBasePlayerSpeedPerSecond() {
        return this.player.speed * 60;
    }

    isRingGameMode() {
        return this.gameMode === 'RING_SOLO' || this.gameMode === 'RING_DUO' || this.gameMode === 'RING_TRIO';
    }

    getRingPlayerCountForMode() {
        if (this.gameMode === 'RING_SOLO') return 1;
        if (this.gameMode === 'RING_TRIO') return 3;
        if (this.gameMode === 'RING_DUO') return 2;
        return 0;
    }

    getRingSpawnLayout(count, scale = 1) {
        const layouts = {
            1: [{ x: 0, y: 0 }],
            2: [{ x: -26, y: 0 }, { x: 26, y: 0 }],
            3: [{ x: -22, y: 16 }, { x: 22, y: 16 }, { x: 0, y: -24 }]
        };
        return (layouts[count] || layouts[2]).map((offset) => ({
            x: offset.x * scale,
            y: offset.y * scale
        }));
    }

    setupRingForcePrototype() {
        const baseSpeed = this.getBasePlayerSpeedPerSecond();
        this.ringForcePrototype = {
            name: 'Innenring-Prototyp',
            description: 'Spieler bewegen sich im Tempo des Hauptspiels und schieben den Ring nur ueber Innenwand-Kontakt.',
            radius: 170,
            thickness: 26,
            pushSpeedScale: baseSpeed * 0.75,
            maxRingSpeed: baseSpeed * 1.4,
            innerPadding: 1,
            contactThreshold: 0.5,
            carryDragBase: baseSpeed * 0.32,
            carryDragOppose: baseSpeed * 0.26,
            position: { x: this.canvas ? this.canvas.width / 2 : 0, y: this.canvas ? this.canvas.height / 2 : 0 },
            velocity: { x: 0, y: 0 },
            netForce: { x: 0, y: 0 },
            netSpeed: 0,
            carryDrag: 0,
            activePushers: 0,
            activePlayerCount: 2,
            players: [
                {
                    id: 1,
                    color: '#5ec8ff',
                    radius: 13,
                    speed: baseSpeed,
                    worldPos: { x: 0, y: 0 },
                    spawnOffset: { x: -55, y: 0 },
                    input: { x: 0, y: 0 },
                    pushing: false,
                    carried: false,
                    pushVector: { x: 0, y: 0 },
                    pushStrength: 0,
                    carryResistance: 0,
                    controlsLabel: 'P1 WASD'
                },
                {
                    id: 2,
                    color: '#ff8f5e',
                    radius: 13,
                    speed: baseSpeed,
                    worldPos: { x: 0, y: 0 },
                    spawnOffset: { x: 55, y: 0 },
                    input: { x: 0, y: 0 },
                    pushing: false,
                    carried: false,
                    pushVector: { x: 0, y: 0 },
                    pushStrength: 0,
                    carryResistance: 0,
                    controlsLabel: 'P2 Pfeile'
                },
                {
                    id: 3,
                    color: '#7dff8a',
                    radius: 13,
                    speed: baseSpeed,
                    worldPos: { x: 0, y: 0 },
                    spawnOffset: { x: 0, y: 55 },
                    input: { x: 0, y: 0 },
                    pushing: false,
                    carried: false,
                    pushVector: { x: 0, y: 0 },
                    pushStrength: 0,
                    carryResistance: 0,
                    controlsLabel: 'P3 HBNM'
                }
            ]
        };

        this.resetRingForceBody();
    }

    getActiveRingPlayers() {
        return this.ringForcePrototype.players.slice(0, this.ringForcePrototype.activePlayerCount);
    }

    setRingForcePlayerCount(count) {
        if (!this.ringForcePrototype) return;
        this.ringForcePrototype.activePlayerCount = Math.max(1, Math.min(3, count));
        this.resetRingForceBody();
    }

    resetRingForceBody() {
        if (!this.ringForcePrototype) return;

        this.ringForcePrototype.position.x = this.canvas.width / 2;
        this.ringForcePrototype.position.y = this.canvas.height / 2;
        this.ringForcePrototype.velocity.x = 0;
        this.ringForcePrototype.velocity.y = 0;
        this.ringForcePrototype.netForce.x = 0;
        this.ringForcePrototype.netForce.y = 0;
        this.ringForcePrototype.netSpeed = 0;
        this.ringForcePrototype.carryDrag = 0;
        this.ringForcePrototype.activePushers = 0;
        const activeOffsets = [
            [{ x: 0, y: 0 }],
            [{ x: -55, y: 0 }, { x: 55, y: 0 }],
            [{ x: -45, y: 18 }, { x: 45, y: 18 }, { x: 0, y: -48 }]
        ];
        this.ringForcePrototype.players.forEach((player, idx) => {
            const offsets = activeOffsets[this.ringForcePrototype.activePlayerCount - 1];
            const offset = offsets[Math.min(idx, offsets.length - 1)];
            player.spawnOffset.x = offset.x;
            player.spawnOffset.y = offset.y;
            player.worldPos.x = this.ringForcePrototype.position.x + offset.x;
            player.worldPos.y = this.ringForcePrototype.position.y + offset.y;
            player.input.x = 0;
            player.input.y = 0;
            player.pushing = false;
            player.carried = false;
            player.pushVector.x = 0;
            player.pushVector.y = 0;
            player.pushStrength = 0;
            player.carryResistance = 0;
        });
    }

    startRingForcePrototype() {
        this.resetRingForceBody();
        this.state = 'RING_FORCE';
        this.updateUI();
        this.configureTouchControls();
    }

    getRingForceInnerLimit(player) {
        return this.ringForcePrototype.radius - (this.ringForcePrototype.thickness / 2) - this.ringForcePrototype.innerPadding - player.radius;
    }

    getRingForcePlayerWorldPos(player) {
        return {
            x: player.worldPos.x,
            y: player.worldPos.y
        };
    }

    getRingForcePlayerRelativePos(player) {
        return {
            x: player.worldPos.x - this.ringForcePrototype.position.x,
            y: player.worldPos.y - this.ringForcePrototype.position.y
        };
    }

    constrainRingForcePlayerInside(player) {
        const relativePos = this.getRingForcePlayerRelativePos(player);
        const distance = Math.sqrt(relativePos.x * relativePos.x + relativePos.y * relativePos.y);
        const innerLimit = this.getRingForceInnerLimit(player);
        if (distance <= innerLimit || distance === 0) return false;

        const normalX = relativePos.x / distance;
        const normalY = relativePos.y / distance;
        player.worldPos.x = this.ringForcePrototype.position.x + normalX * innerLimit;
        player.worldPos.y = this.ringForcePrototype.position.y + normalY * innerLimit;
        return true;
    }

    handleRingForceHotkeys(e) {
        if (!this.ringForcePrototype) return false;

        if (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3') {
            e.preventDefault();
            this.setRingForcePlayerCount(Number(e.code.slice(-1)));
            this.updateRingForceHud();
            return true;
        }

        if (e.code === 'Escape') {
            e.preventDefault();
            this.showMenu();
            return true;
        }

        if (e.code === 'KeyR') {
            e.preventDefault();
            this.resetRingForceBody();
            this.updateRingForceHud();
            return true;
        }

        return false;
    }

    updateRingForceHud() {
        if (this.state !== 'RING_FORCE') return;

        const ring = this.ringForcePrototype;
        const hudLvl = document.getElementById('hud-level');
        const hudTarget = document.getElementById('hud-target');
        const hudTimer = document.getElementById('hud-timer');
        const hudScore = document.getElementById('hud-score');
        const activePlayers = this.getActiveRingPlayers();
        const playerSummary = activePlayers
            .map((player) => `P${player.id} Schub ${player.pushStrength.toFixed(0)} Drag ${player.carryResistance.toFixed(0)}`)
            .join(' | ');

        if (hudLvl) hudLvl.innerText = 'Ring-Force Innenraum';
        if (hudTarget) hudTarget.innerText = `Nur Innenwand-Kontakt uebertraegt Schub auf den Ring. Aktive Spieler: ${ring.activePlayerCount}`;
        if (hudTimer) hudTimer.innerText = `Ring v=(${ring.velocity.x.toFixed(1)}, ${ring.velocity.y.toFixed(1)}) | Speed ${ring.netSpeed.toFixed(0)} | Schieber: ${ring.activePushers}`;
        if (hudScore) hudScore.innerText = playerSummary;
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
        document.getElementById('mode-ring-solo').classList.toggle('selected', mode === 'RING_SOLO');
        document.getElementById('mode-ring-duo').classList.toggle('selected', mode === 'RING_DUO');
        document.getElementById('mode-ring-trio').classList.toggle('selected', mode === 'RING_TRIO');
        this.setMenuTab('CLASSIC');
    }

    setMenuTab(tab) {
        this.currentMenuTab = tab;

        const classicTab = document.getElementById('tab-classic');
        const labyrinthTab = document.getElementById('tab-labyrinth');
        const classicPanel = document.getElementById('panel-classic');
        const labyrinthPanel = document.getElementById('panel-labyrinth');

        if (classicTab) classicTab.classList.toggle('selected', tab === 'CLASSIC');
        if (labyrinthTab) labyrinthTab.classList.toggle('selected', tab === 'LABYRINTH');
        if (classicPanel) classicPanel.classList.toggle('active', tab === 'CLASSIC');
        if (labyrinthPanel) labyrinthPanel.classList.toggle('active', tab === 'LABYRINTH');
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('keydown', (e) => {
            if (this.state === 'RING_FORCE' && this.handleRingForceHotkeys(e)) {
                return;
            }

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
        const ringSoloCard = document.getElementById('mode-ring-solo');
        const ringDuoCard = document.getElementById('mode-ring-duo');
        const ringTrioCard = document.getElementById('mode-ring-trio');
        const classicTab = document.getElementById('tab-classic');
        const labyrinthTab = document.getElementById('tab-labyrinth');
        if (soloCard) soloCard.addEventListener('pointerup', () => this.setMode('SOLO'));
        if (coopCard) coopCard.addEventListener('pointerup', () => this.setMode('COOP'));
        if (ringSoloCard) ringSoloCard.addEventListener('pointerup', () => this.setMode('RING_SOLO'));
        if (ringDuoCard) ringDuoCard.addEventListener('pointerup', () => this.setMode('RING_DUO'));
        if (ringTrioCard) ringTrioCard.addEventListener('pointerup', () => this.setMode('RING_TRIO'));
        if (classicTab) classicTab.addEventListener('pointerup', () => this.setMenuTab('CLASSIC'));
        if (labyrinthTab) labyrinthTab.addEventListener('pointerup', () => this.setMenuTab('LABYRINTH'));

        // Globaler Touch-Listener zur Aktivierung der Touch-Steuerung
        window.addEventListener('touchstart', () => this.initTouch(), { once: true });
    }

    activateMasterMode() {
        this.masterModeActive = true;
        this.updateLevelSelect();

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
        if (this.ringForcePrototype && this.state !== 'RING_FORCE') {
            this.resetRingForceBody();
        }
        this.configureTouchControls();
    }

    updatePillarPos() {
        const lvl = LEVELS[this.currentLevelIdx];
        if (!lvl || lvl.pillarBehavior === 'static' || lvl.pillarBehavior === 'shrinking') {
            this.pillar.x = this.canvas.width / 2;
            this.pillar.y = this.canvas.height / 2;
        }
    }

    setupCollectibleObjective(lvl) {
        if (!lvl || !lvl.collectHearts) {
            this.collectibleObjective = null;
            return;
        }

        this.collectibleObjective = {
            delay: lvl.collectHearts.delay || 8,
            count: lvl.collectHearts.count || 4,
            spawned: false,
            items: [],
            collected: 0,
            announceTimer: 0
        };
    }

    getCollectibleStatusText() {
        const objective = this.collectibleObjective;
        if (!objective) return '';
        if (!objective.spawned) {
            const remaining = Math.max(0, Math.ceil(objective.delay - this.timer));
            return ` | Kirschen in ${remaining}s`;
        }
        if (objective.collected >= objective.items.length) {
            return ' | Kirschen komplett';
        }
        return ` | Kirschen ${objective.collected}/${objective.items.length}`;
    }

    updatePlayingHud() {
        const lvl = LEVELS[this.currentLevelIdx];
        if (!lvl || this.state !== 'PLAYING') return;

        const hudLvl = document.getElementById('hud-level');
        const hudTarget = document.getElementById('hud-target');
        const scoreHud = document.getElementById('hud-score');
        const timerHud = document.getElementById('hud-timer');

        if (hudLvl) hudLvl.innerText = `${lvl.id}: ${lvl.name}`;

        let targetText = "";
        if (lvl.targetType === 'score') targetText = `${lvl.targetValue} Pkt`;
        else if (lvl.targetType === 'survival') targetText = `${lvl.targetValue}s überleben`;
        else if (lvl.targetType === 'pacifist') targetText = `${lvl.targetValue}s (max ${lvl.maxScore} Pkt)`;
        if (hudTarget) hudTarget.innerText = `Ziel: ${targetText}${this.getCollectibleStatusText()}`;

        if (scoreHud) scoreHud.innerText = `Score: ${this.score}`;
        if (timerHud) {
            const mins = Math.floor(this.timer / 60);
            const secs = Math.floor(this.timer % 60);
            const tenths = Math.floor((this.timer * 10) % 10);
            timerHud.innerText = `Zeit: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
        }
    }

    getCollectibleSpawnPositions(count) {
        const offsetX = Math.max(70, this.canvas.width * 0.11);
        const offsetY = Math.max(70, this.canvas.height * 0.11);
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const positions = [
            { x: centerX - offsetX, y: centerY - offsetY },
            { x: centerX + offsetX, y: centerY - offsetY },
            { x: centerX - offsetX, y: centerY + offsetY },
            { x: centerX + offsetX, y: centerY + offsetY }
        ];

        return positions.slice(0, count);
    }

    spawnCollectibleObjective() {
        const objective = this.collectibleObjective;
        if (!objective || objective.spawned) return;

        objective.spawned = true;
        objective.announceTimer = 180;
        objective.items = this.getCollectibleSpawnPositions(objective.count).map((pos, idx) => ({
            id: idx,
            x: pos.x,
            y: pos.y,
            radius: 13,
            collected: false,
            phase: idx * 0.8
        }));
    }

    getActiveCollectors() {
        if (this.isRingGameMode()) {
            return this.getActiveRingPlayers().map((player) => ({
                x: player.worldPos.x,
                y: player.worldPos.y,
                radius: player.radius
            }));
        }

        return [{
            x: this.player.x,
            y: this.player.y,
            radius: this.player.radius
        }];
    }

    updateCollectibleObjective(dt) {
        const objective = this.collectibleObjective;
        if (!objective) return;

        if (!objective.spawned && this.timer >= objective.delay) {
            this.spawnCollectibleObjective();
        }
        if (!objective.spawned) return;

        if (objective.announceTimer > 0) {
            objective.announceTimer--;
        }

        const collectors = this.getActiveCollectors();
        objective.items.forEach((item) => {
            if (item.collected) return;
            for (const collector of collectors) {
                const dx = collector.x - item.x;
                const dy = collector.y - item.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= collector.radius + item.radius) {
                    item.collected = true;
                    objective.collected++;
                    for (let i = 0; i < 10; i++) {
                        this.particles.push({
                            x: item.x,
                            y: item.y,
                            vx: (Math.random() - 0.5) * 6,
                            vy: (Math.random() - 0.5) * 6,
                            life: 1.0,
                            color: '#ff6677',
                            size: 3 + Math.random() * 3
                        });
                    }
                    break;
                }
            }
        });
    }

    hasPendingCollectibleObjective() {
        const objective = this.collectibleObjective;
        if (!objective) return false;
        if (!objective.spawned) return true;
        return objective.collected < objective.items.length;
    }

    updateLevelSelect() {
        const container = document.getElementById('level-select');
        if (!container) return;
        container.innerHTML = '';
        LEVELS.forEach(lvl => {
            const btn = document.createElement('button');
            btn.innerText = lvl.id;
            const completed = this.saveData.bests[lvl.id] !== undefined;
            btn.className = `lvl-btn ${completed ? 'completed' : 'incomplete'}${lvl.id === suggestedStartLevel ? ' current-target' : ''}`;
            const best = this.saveData.bests[lvl.id];
            if (best !== undefined) {
                const bestSpan = document.createElement('span');
                bestSpan.className = 'best';
                bestSpan.innerText = lvl.targetType === 'score' ? best : best.toFixed(1) + 's';
                btn.appendChild(bestSpan);
            }
            btn.onclick = () => this.startLevel(lvl.id);
            container.appendChild(btn);
        });
    }

    showMenu() {
        this.state = 'MENU';
        this.updateUI();
        this.updateLevelSelect();
        this.configureTouchControls();
    }

    resetProgress() {
        const confirmed = window.confirm('Gesamten Fortschritt und alle Rekorde wirklich zurücksetzen?');
        if (!confirmed) return;

        localStorage.removeItem('sj_v2_data');
        this.saveData = this.createFreshSaveData();
        this.masterModeActive = false;
        this.currentLevelIdx = 0;
        this.showMenu();
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
        this.setupCollectibleObjective(lvl);
        this.updatePillarPos();
        if (this.isRingGameMode()) {
            this.ringForcePrototype.activePlayerCount = this.getRingPlayerCountForMode();
            this.ringForcePrototype.radius = 88;
            this.ringForcePrototype.thickness = 14;
            this.ringForcePrototype.innerPadding = 1;
            this.resetRingForceBody();
            this.ringForcePrototype.position.x = this.player.x;
            this.ringForcePrototype.position.y = this.player.y;
            const spawnLayout = this.getRingSpawnLayout(this.ringForcePrototype.activePlayerCount, 1);
            this.getActiveRingPlayers().forEach((player, idx) => {
                player.worldPos.x = this.ringForcePrototype.position.x + spawnLayout[idx].x;
                player.worldPos.y = this.ringForcePrototype.position.y + spawnLayout[idx].y;
            });
            this.player.x = this.ringForcePrototype.position.x;
            this.player.y = this.ringForcePrototype.position.y;
        }
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
    canSkipLevel() {
        return LEVELS[this.currentLevelIdx] && LEVELS[this.currentLevelIdx].id < this.getLastLevelId();
    }
    skipLevel() {
        if (!this.canSkipLevel()) {
            this.showMenu();
            return;
        }
        this.startLevel(LEVELS[this.currentLevelIdx].id + 1);
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
            this.updatePlayingHud();
        } else if (this.state === 'RING_FORCE') {
            this.updateRingForceHud();
        }

        const skipBtn = document.getElementById('skip-level-btn');
        if (skipBtn) {
            skipBtn.disabled = !this.canSkipLevel();
            skipBtn.style.display = this.state === 'LOSE' ? 'inline-block' : 'none';
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

    hitsActivePlayer(enemy) {
        const centerDist = Math.sqrt((this.player.x - enemy.x) ** 2 + (this.player.y - enemy.y) ** 2);
        if (centerDist < this.player.radius + enemy.radius) {
            return true;
        }

        if (!this.isRingGameMode()) return false;

        return this.getActiveRingPlayers().some((ringPlayer) => {
            const pos = this.getRingForcePlayerWorldPos(ringPlayer);
            const dist = Math.sqrt((pos.x - enemy.x) ** 2 + (pos.y - enemy.y) ** 2);
            return dist < ringPlayer.radius + enemy.radius;
        });
    }

    updateRingForce(dt) {
        const ring = this.ringForcePrototype;
        if (!ring) return;

        const controlMaps = [
            { left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS' },
            { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown' },
            { left: 'KeyH', right: 'KeyN', up: 'KeyB', down: 'KeyM' }
        ];
        let totalPushX = 0;
        let totalPushY = 0;
        let activePushers = 0;

        this.getActiveRingPlayers().forEach((player, idx) => {
            const controls = controlMaps[idx];
            let inputX = 0;
            let inputY = 0;
            if (this.keys[controls.left]) inputX -= 1;
            if (this.keys[controls.right]) inputX += 1;
            if (this.keys[controls.up]) inputY -= 1;
            if (this.keys[controls.down]) inputY += 1;

            const inputMagnitude = Math.sqrt(inputX * inputX + inputY * inputY);
            if (inputMagnitude > 0) {
                inputX /= inputMagnitude;
                inputY /= inputMagnitude;
            }

            player.input.x = inputX;
            player.input.y = inputY;
            player.pushing = false;
            player.carried = false;
            player.pushVector.x = 0;
            player.pushVector.y = 0;
            player.pushStrength = 0;
            player.carryResistance = 0;

            const desiredMoveX = inputX * player.speed * dt;
            const desiredMoveY = inputY * player.speed * dt;
            const relativePos = this.getRingForcePlayerRelativePos(player);
            const nextX = relativePos.x + desiredMoveX;
            const nextY = relativePos.y + desiredMoveY;
            const nextDistance = Math.sqrt(nextX * nextX + nextY * nextY);
            const innerLimit = this.getRingForceInnerLimit(player);

            if (nextDistance <= innerLimit || inputMagnitude === 0) {
                player.worldPos.x += desiredMoveX;
                player.worldPos.y += desiredMoveY;
                return;
            }

            const normalX = nextDistance > 0 ? nextX / nextDistance : 0;
            const normalY = nextDistance > 0 ? nextY / nextDistance : 0;
            player.worldPos.x = ring.position.x + normalX * innerLimit;
            player.worldPos.y = ring.position.y + normalY * innerLimit;

            const outwardIntent = inputX * normalX + inputY * normalY;
            const overflow = Math.max(0, nextDistance - innerLimit);
            if (overflow <= ring.contactThreshold || outwardIntent <= 0) return;

            const pushRatio = Math.min(1, overflow / Math.max(player.speed * dt, 0.0001)) * outwardIntent;
            const pushSpeed = pushRatio * ring.pushSpeedScale;
            player.pushing = true;
            player.pushVector.x = normalX * pushSpeed;
            player.pushVector.y = normalY * pushSpeed;
            player.pushStrength = pushSpeed;
            totalPushX += player.pushVector.x;
            totalPushY += player.pushVector.y;
            activePushers++;
        });

        let desiredVelX = totalPushX;
        let desiredVelY = totalPushY;
        let desiredMagnitude = Math.sqrt(desiredVelX * desiredVelX + desiredVelY * desiredVelY);
        let carryDrag = 0;

        if (desiredMagnitude > 0) {
            const dirX = desiredVelX / desiredMagnitude;
            const dirY = desiredVelY / desiredMagnitude;

            this.getActiveRingPlayers().forEach((player) => {
                if (player.pushing) return;

                const relativePos = this.getRingForcePlayerRelativePos(player);
                const predictedRelX = relativePos.x - desiredVelX * dt;
                const predictedRelY = relativePos.y - desiredVelY * dt;
                const predictedDistance = Math.sqrt(predictedRelX * predictedRelX + predictedRelY * predictedRelY);
                const innerLimit = this.getRingForceInnerLimit(player);
                if (predictedDistance <= innerLimit) return;

                player.carried = true;
                const support = Math.max(0, player.input.x * dirX + player.input.y * dirY);
                const oppose = Math.max(0, -(player.input.x * dirX + player.input.y * dirY));
                const drag = ring.carryDragBase * (1 - support) + ring.carryDragOppose * oppose;
                player.carryResistance = drag;
                carryDrag += drag;
            });

            desiredMagnitude = Math.max(0, desiredMagnitude - carryDrag);
            if (desiredMagnitude > ring.maxRingSpeed) {
                desiredMagnitude = ring.maxRingSpeed;
            }

            desiredVelX = dirX * desiredMagnitude;
            desiredVelY = dirY * desiredMagnitude;
        }

        ring.netForce.x = desiredVelX;
        ring.netForce.y = desiredVelY;
        ring.netSpeed = desiredMagnitude;
        ring.carryDrag = carryDrag;
        ring.activePushers = activePushers;
        ring.velocity.x = desiredVelX;
        ring.velocity.y = desiredVelY;

        ring.position.x += ring.velocity.x * dt;
        ring.position.y += ring.velocity.y * dt;

        this.getActiveRingPlayers().forEach((player) => {
            this.constrainRingForcePlayerInside(player);
        });

        const leftBound = ring.radius + 40;
        const rightBound = this.canvas.width - ring.radius - 40;
        const topBound = ring.radius + 40;
        const bottomBound = this.canvas.height - ring.radius - 40;

        if (ring.position.x < leftBound) {
            ring.position.x = leftBound;
            ring.velocity.x = 0;
        } else if (ring.position.x > rightBound) {
            ring.position.x = rightBound;
            ring.velocity.x = 0;
        }

        if (ring.position.y < topBound) {
            ring.position.y = topBound;
            ring.velocity.y = 0;
        } else if (ring.position.y > bottomBound) {
            ring.position.y = bottomBound;
            ring.velocity.y = 0;
        }

        this.updateRingForceHud();
    }

    updateRingLevelMovement(dt) {
        const ring = this.ringForcePrototype;
        if (!ring) return;

        this.updateRingForce(dt);
        this.player.x = ring.position.x;
        this.player.y = ring.position.y;
    }

    update(dt = 1 / 60) {
        if (this.state === 'RING_FORCE') {
            this.updateRingForce(dt);
            return;
        }

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

        if (this.isRingGameMode()) {
            this.updateRingLevelMovement(dt);
        } else if (this.gameMode === 'SOLO') {
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
        if (!this.isRingGameMode()) {
            this.player.x = Math.max(this.player.radius, Math.min(this.canvas.width - this.player.radius, this.player.x));
            this.player.y = Math.max(this.player.radius, Math.min(this.canvas.height - this.player.radius, this.player.y));
            const pdx=this.player.x-this.pillar.x, pdy=this.player.y-this.pillar.y, pdist=Math.sqrt(pdx*pdx+pdy*pdy);
            if (pdist < this.player.radius+this.pillar.radius){
                const ang=Math.atan2(pdy,pdx);
                this.player.x=this.pillar.x+Math.cos(ang)*(this.player.radius+this.pillar.radius);
                this.player.y=this.pillar.y+Math.sin(ang)*(this.player.radius+this.pillar.radius);
            }
        } else {
            const ringPadding = this.ringForcePrototype.radius + 10;
            this.ringForcePrototype.position.x = Math.max(ringPadding, Math.min(this.canvas.width - ringPadding, this.ringForcePrototype.position.x));
            this.ringForcePrototype.position.y = Math.max(ringPadding, Math.min(this.canvas.height - ringPadding, this.ringForcePrototype.position.y));
            const rdx = this.ringForcePrototype.position.x - this.pillar.x;
            const rdy = this.ringForcePrototype.position.y - this.pillar.y;
            const ringDist = Math.sqrt(rdx * rdx + rdy * rdy);
            const minDist = this.ringForcePrototype.radius + this.pillar.radius;
            if (ringDist < minDist) {
                const ang = Math.atan2(rdy, rdx);
                this.ringForcePrototype.position.x = this.pillar.x + Math.cos(ang) * minDist;
                this.ringForcePrototype.position.y = this.pillar.y + Math.sin(ang) * minDist;
                this.getActiveRingPlayers().forEach((player) => {
                    this.constrainRingForcePlayerInside(player);
                });
            }
            this.player.x = this.ringForcePrototype.position.x;
            this.player.y = this.ringForcePrototype.position.y;
        }
        this.updateCollectibleObjective(dt);
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
            if (this.hitsActivePlayer(e)) {
                this.lose("Die Dunkelheit hat dich eingeholt.");
                return;
            }
            if (edist > 0) {
                e.x += (edx/edist) * e.speed;
                e.y += (edy/edist) * e.speed;
            }
            if (this.hitsActivePlayer(e)) {
                this.lose("Die Dunkelheit hat dich eingeholt.");
                return;
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
        const targetReached = (lvl.targetType === 'score' && this.score >= lvl.targetValue)
            || ((lvl.targetType === 'survival' || lvl.targetType === 'pacifist') && this.timer >= lvl.targetValue);
        if (targetReached && !this.hasPendingCollectibleObjective()) this.win();
        this.updatePlayingHud();
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
        localStorage.setItem('sj_v2_data', JSON.stringify(this.saveData));
        this.updateUI();
        this.updateLevelSelect();
    }

    drawForceArrow(x, y, vx, vy, color, scale = 1) {
        const length = Math.sqrt(vx * vx + vy * vy);
        if (length < 0.001) return;

        const nx = vx / length;
        const ny = vy / length;
        const arrowLen = Math.min(90, length * scale);
        const endX = x + nx * arrowLen;
        const endY = y + ny * arrowLen;

        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        const headSize = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(endX - nx * headSize - ny * headSize * 0.7, endY - ny * headSize + nx * headSize * 0.7);
        this.ctx.lineTo(endX - nx * headSize + ny * headSize * 0.7, endY - ny * headSize - nx * headSize * 0.7);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawCherryMarker(x, y, size, glowAlpha = 0.35) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.shadowBlur = 18;
        this.ctx.shadowColor = `rgba(255, 70, 90, ${glowAlpha})`;
        this.ctx.strokeStyle = '#6bc15f';
        this.ctx.lineWidth = Math.max(2, size * 0.12);
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size * 1.1);
        this.ctx.quadraticCurveTo(-size * 0.2, -size * 1.9, -size * 0.75, -size * 1.7);
        this.ctx.moveTo(0, -size * 1.1);
        this.ctx.quadraticCurveTo(size * 0.2, -size * 1.9, size * 0.75, -size * 1.7);
        this.ctx.stroke();

        this.ctx.fillStyle = '#ff4d5f';
        this.ctx.beginPath();
        this.ctx.arc(-size * 0.5, size * 0.15, size * 0.58, 0, Math.PI * 2);
        this.ctx.arc(size * 0.5, size * 0.15, size * 0.58, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        this.ctx.beginPath();
        this.ctx.arc(-size * 0.72, -size * 0.08, size * 0.16, 0, Math.PI * 2);
        this.ctx.arc(size * 0.28, -size * 0.08, size * 0.16, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawCollectibleObjective() {
        const objective = this.collectibleObjective;
        if (!objective || !objective.spawned) return;

        objective.items.forEach((item) => {
            if (item.collected) return;
            const pulse = 1 + Math.sin(this.timer * 5 + item.phase) * 0.12;
            this.drawCherryMarker(item.x, item.y, item.radius * pulse);
        });

        if (objective.announceTimer > 0) {
            const opacity = Math.min(1, objective.announceTimer / 45);
            this.ctx.save();
            this.ctx.fillStyle = `rgba(255, 120, 140, ${opacity})`;
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 24px Segoe UI, sans-serif';
            this.ctx.fillText('Sammle die Kirschen ein!', this.canvas.width / 2, 64);
            this.ctx.restore();
        }
    }

    drawRingForce() {
        const ring = this.ringForcePrototype;
        if (!ring) return;
        const activePlayers = this.getActiveRingPlayers();
        const playerSummary = activePlayers
            .map((player) => `P${player.id} Schub ${player.pushStrength.toFixed(0)} Drag ${player.carryResistance.toFixed(0)}`)
            .join(' | ');

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 12, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.translate(ring.position.x, ring.position.y);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ring.radius - ring.thickness, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = ring.thickness;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.setLineDash([8, 8]);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.getRingForceInnerLimit(activePlayers[0]) + activePlayers[0].radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.restore();

        activePlayers.forEach((player) => {
            const pos = this.getRingForcePlayerWorldPos(player);
            this.ctx.fillStyle = player.color;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, player.radius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = player.pushing ? '#fff' : 'rgba(255,255,255,0.25)';
            this.ctx.lineWidth = player.pushing ? 2 : 1;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, player.radius + 5, 0, Math.PI * 2);
            this.ctx.stroke();

            this.drawForceArrow(pos.x, pos.y, player.input.x * 80, player.input.y * 80, player.color, 0.6);
            if (player.pushing) {
                this.drawForceArrow(pos.x, pos.y, player.pushVector.x, player.pushVector.y, '#ffffff', 0.2);
            }

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Segoe UI, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`P${player.id}`, pos.x, pos.y - 22);
            this.ctx.fillStyle = player.pushing ? '#fff' : player.carried ? '#ffcc88' : 'rgba(255,255,255,0.65)';
            const stateLabel = player.pushing
                ? `SCHUB ${player.pushStrength.toFixed(0)}`
                : player.carried
                    ? `DRAG ${player.carryResistance.toFixed(0)}`
                    : 'FREI';
            this.ctx.fillText(stateLabel, pos.x, pos.y + 30);
        });

        this.drawForceArrow(ring.position.x, ring.position.y, ring.netForce.x, ring.netForce.y, '#44ff44', 0.12);

        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'left';
        this.ctx.font = 'bold 24px Segoe UI, sans-serif';
        this.ctx.fillText('Ring-Force Prototyp', 24, this.canvas.height - 150);
        this.ctx.font = '15px Segoe UI, sans-serif';
        this.ctx.fillStyle = '#ccc';
        this.ctx.fillText(ring.description, 24, this.canvas.height - 120);
        this.ctx.fillText('P1: WASD | P2: Pfeile | P3: HBNM | Sandbox: 1/2/3 Spieler | R Reset | Esc Menue', 24, this.canvas.height - 92);
        this.ctx.fillText(playerSummary, 24, this.canvas.height - 64);
        this.ctx.fillText(`Netto-Speed ${ring.netSpeed.toFixed(0)} | Gesamt-Drag ${ring.carryDrag.toFixed(0)} | Ringposition: (${ring.position.x.toFixed(1)}, ${ring.position.y.toFixed(1)})`, 24, this.canvas.height - 36);
        this.ctx.fillText('Mitgeschleppte Spieler bremsen. Wer aktiv in Ringrichtung mitlaeuft, reduziert diesen Widerstand.', 24, this.canvas.height - 8);
    }

    drawRingForceInLevel() {
        const ring = this.ringForcePrototype;
        if (!ring || !this.isRingGameMode() || this.state !== 'PLAYING') return;

        this.ctx.save();
        this.ctx.translate(ring.position.x, ring.position.y);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ring.radius - ring.thickness, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        this.ctx.lineWidth = ring.thickness;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();

        this.getActiveRingPlayers().forEach((player) => {
            const pos = this.getRingForcePlayerWorldPos(player);
            this.ctx.fillStyle = player.color;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, player.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    draw() {
        if (this.state === 'RING_FORCE') {
            this.drawRingForce();
            return;
        }

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
        this.drawCollectibleObjective();
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
            if (this.gameMode === 'SOLO' || this.isRingGameMode()) {
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
        this.drawRingForceInLevel();
        
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
            if (lvl.collectHearts) {
                this.ctx.font = 'bold 18px Segoe UI, sans-serif';
                this.ctx.fillText(`FRUEH 4 KIRSCHEN EINSAMMELN`, this.canvas.width / 2, this.canvas.height / 2 - 118);
            }
            this.ctx.font = '16px Segoe UI, sans-serif';
            this.ctx.fillText(`${lvl.id}: ${lvl.name.toUpperCase()}`, this.canvas.width / 2, this.canvas.height / 2 - 190);
            this.ctx.restore();
        }
        this.ctx.restore();
    }

    loop() {
        const now = performance.now();
        const dt = Math.min(0.05, (now - this.lastFrameTime) / 1000 || 1 / 60);
        this.lastFrameTime = now;
        this.update(dt);
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// Initialisierung
const game = new SchattenJaeger();
