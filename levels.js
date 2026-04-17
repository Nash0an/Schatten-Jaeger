const LEVELS = [
    { id: 1, name: "Einstieg", targetType: 'score', targetValue: 50, pillarRadius: 40, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 1.2, enemySpeedMax: 1.2, spawnRateStart: 120, spawnRateMax: 120, acceleration: 0, lightBehavior: 'stable' },
    { id: 2, name: "Beschleunigung", targetType: 'survival', targetValue: 20, pillarRadius: 35, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 1.0, enemySpeedMax: 2.5, spawnRateStart: 120, spawnRateMax: 60, acceleration: 0.05, lightBehavior: 'stable' },
    { id: 3, name: "Der Pazifist", targetType: 'pacifist', targetValue: 20, maxScore: 20, pillarRadius: 40, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 1.5, enemySpeedMax: 1.5, spawnRateStart: 80, spawnRateMax: 80, acceleration: 0, lightBehavior: 'stable' },
    { id: 4, name: "Wandernder Schatten", targetType: 'score', targetValue: 100, pillarRadius: 30, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 1.2, enemySpeedMax: 2.0, spawnRateStart: 100, spawnRateMax: 80, acceleration: 0.02, lightBehavior: 'stable' },
    { id: 5, name: "Schrumpfende Hoffnung", targetType: 'survival', targetValue: 30, pillarRadius: 60, pillarBehavior: 'shrinking', shadowKillRadius: null, enemySpeedStart: 1.5, enemySpeedMax: 1.5, spawnRateStart: 90, spawnRateMax: 90, acceleration: 0, lightBehavior: 'stable' },
    { id: 6, name: "Flackerndes Licht", targetType: 'score', targetValue: 150, pillarRadius: 40, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 1.2, enemySpeedMax: 2.0, spawnRateStart: 100, spawnRateMax: 60, acceleration: 0.03, lightBehavior: 'flickering' },
    { id: 7, name: "Schatten-Tanz", targetType: 'survival', targetValue: 40, pillarRadius: 35, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 1.3, enemySpeedMax: 2.0, spawnRateStart: 100, spawnRateMax: 70, acceleration: 0.04, lightBehavior: 'stable' },
    { id: 8, name: "Präzisionsarbeit", targetType: 'score', targetValue: 120, pillarRadius: 20, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 1.4, enemySpeedMax: 2.2, spawnRateStart: 90, spawnRateMax: 60, acceleration: 0.02, lightBehavior: 'stable' },
    { id: 9, name: "Sturmflut", targetType: 'survival', targetValue: 25, pillarRadius: 50, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 1.0, enemySpeedMax: 3.0, spawnRateStart: 60, spawnRateMax: 30, acceleration: 0.08, lightBehavior: 'stable' },
    { id: 10, name: "Pazifist II", targetType: 'pacifist', targetValue: 30, maxScore: 10, pillarRadius: 40, pillarBehavior: 'shrinking', shadowKillRadius: null, enemySpeedStart: 1.4, enemySpeedMax: 1.4, spawnRateStart: 80, spawnRateMax: 80, acceleration: 0, lightBehavior: 'stable' },
    { id: 11, name: "Disco-Inferno", targetType: 'score', targetValue: 200, pillarRadius: 45, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 1.2, enemySpeedMax: 1.8, spawnRateStart: 70, spawnRateMax: 50, acceleration: 0.03, lightBehavior: 'flickering' },
    { id: 12, name: "Minimalismus", targetType: 'score', targetValue: 80, pillarRadius: 15, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 1.5, enemySpeedMax: 2.5, spawnRateStart: 100, spawnRateMax: 70, acceleration: 0.04, lightBehavior: 'stable' },
    { id: 13, name: "Instabil", targetType: 'survival', targetValue: 35, pillarRadius: 40, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 1.6, enemySpeedMax: 2.4, spawnRateStart: 80, spawnRateMax: 60, acceleration: 0.05, lightBehavior: 'flickering' },
    { id: 14, name: "Geduldsprobe", targetType: 'pacifist', targetValue: 40, maxScore: 30, pillarRadius: 35, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 1.8, enemySpeedMax: 1.8, spawnRateStart: 60, spawnRateMax: 60, acceleration: 0, lightBehavior: 'stable' },
    { id: 15, name: "Fluchtweg", targetType: 'score', targetValue: 250, pillarRadius: 50, pillarBehavior: 'shrinking', shadowKillRadius: null, enemySpeedStart: 1.3, enemySpeedMax: 2.8, spawnRateStart: 80, spawnRateMax: 40, acceleration: 0.06, lightBehavior: 'stable' },
    { id: 16, name: "Irrlicht", targetType: 'survival', targetValue: 45, pillarRadius: 25, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 1.5, enemySpeedMax: 2.5, spawnRateStart: 100, spawnRateMax: 70, acceleration: 0.02, lightBehavior: 'flickering' },
    { id: 17, name: "Schatten-Wüste", targetType: 'score', targetValue: 150, pillarRadius: 15, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 1.4, enemySpeedMax: 2.2, spawnRateStart: 90, spawnRateMax: 70, acceleration: 0.03, lightBehavior: 'stable' },
    { id: 18, name: "Druckkammer", targetType: 'survival', targetValue: 30, pillarRadius: 40, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 2.0, enemySpeedMax: 4.0, spawnRateStart: 50, spawnRateMax: 20, acceleration: 0.1, lightBehavior: 'stable' },
    { id: 19, name: "Pazifist III", targetType: 'pacifist', targetValue: 50, maxScore: 0, pillarRadius: 45, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 1.5, enemySpeedMax: 1.5, spawnRateStart: 70, spawnRateMax: 70, acceleration: 0, lightBehavior: 'flickering' },
    { id: 20, name: "Mahlstrom", targetType: 'score', targetValue: 300, pillarRadius: 30, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 1.8, enemySpeedMax: 2.8, spawnRateStart: 60, spawnRateMax: 40, acceleration: 0.04, lightBehavior: 'stable' },
    { id: 21, name: "Kalte Asche", targetType: 'survival', targetValue: 50, pillarRadius: 20, pillarBehavior: 'shrinking', shadowKillRadius: null, enemySpeedStart: 2.0, enemySpeedMax: 3.0, spawnRateStart: 80, spawnRateMax: 50, acceleration: 0.05, lightBehavior: 'stable' },
    { id: 22, name: "Licht-Chaos", targetType: 'score', targetValue: 250, pillarRadius: 50, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 1.5, enemySpeedMax: 3.5, spawnRateStart: 100, spawnRateMax: 30, acceleration: 0.07, lightBehavior: 'flickering' },
    { id: 23, name: "Nadelöhr", targetType: 'score', targetValue: 120, pillarRadius: 10, pillarBehavior: 'static', shadowKillRadius: null, enemySpeedStart: 2.5, enemySpeedMax: 3.5, spawnRateStart: 70, spawnRateMax: 50, acceleration: 0.02, lightBehavior: 'stable' },
    { id: 24, name: "Endloser Schatten", targetType: 'survival', targetValue: 60, pillarRadius: 35, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 1.8, enemySpeedMax: 2.8, spawnRateStart: 90, spawnRateMax: 60, acceleration: 0.03, lightBehavior: 'stable' },
    { id: 25, name: "Pazifist IV", targetType: 'pacifist', targetValue: 60, maxScore: 50, pillarRadius: 25, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 2.2, enemySpeedMax: 2.2, spawnRateStart: 50, spawnRateMax: 50, acceleration: 0, lightBehavior: 'stable' },
    { id: 26, name: "Herzschlag", targetType: 'score', targetValue: 400, pillarRadius: 40, pillarBehavior: 'shrinking', shadowKillRadius: null, enemySpeedStart: 2.0, enemySpeedMax: 4.0, spawnRateStart: 60, spawnRateMax: 20, acceleration: 0.08, lightBehavior: 'flickering' },
    { id: 27, name: "Geisterstunde", targetType: 'survival', targetValue: 45, pillarRadius: 30, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 2.5, enemySpeedMax: 3.5, spawnRateStart: 80, spawnRateMax: 40, acceleration: 0.05, lightBehavior: 'flickering' },
    { id: 28, name: "Absolute Leere", targetType: 'score', targetValue: 200, pillarRadius: 15, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 3.0, enemySpeedMax: 4.5, spawnRateStart: 50, spawnRateMax: 30, acceleration: 0.1, lightBehavior: 'stable' },
    { id: 29, name: "Ultimative Prüfung", targetType: 'survival', targetValue: 70, pillarRadius: 25, pillarBehavior: 'shrinking', shadowKillRadius: null, enemySpeedStart: 2.8, enemySpeedMax: 5.0, spawnRateStart: 40, spawnRateMax: 15, acceleration: 0.15, lightBehavior: 'flickering' },
    { id: 30, name: "Schatten-Meister", targetType: 'score', targetValue: 1000, pillarRadius: 35, pillarBehavior: 'moving', shadowKillRadius: null, enemySpeedStart: 3.5, enemySpeedMax: 6.0, spawnRateStart: 30, spawnRateMax: 10, acceleration: 0.2, lightBehavior: 'flickering' },
    { id: 31, name: "Combo-Meister", targetType: 'score', targetValue: 500, pillarRadius: 35, pillarBehavior: 'static', shadowKillRadius: 180, enemySpeedStart: 1.5, enemySpeedMax: 2.5, spawnRateStart: 60, spawnRateMax: 40, acceleration: 0.03, lightBehavior: 'stable' },
    { id: 32, name: "Pulsierende Leere", targetType: 'score', targetValue: 200, pillarRadius: 40, pillarBehavior: 'pulsating', shadowKillRadius: null, enemySpeedStart: 1.5, enemySpeedMax: 2.5, spawnRateStart: 80, spawnRateMax: 50, acceleration: 0.04, lightBehavior: 'stable' },
    { id: 33, name: "Tanzender Riese", targetType: 'survival', targetValue: 40, pillarRadius: 35, pillarBehavior: 'moving pulsating', shadowKillRadius: null, enemySpeedStart: 1.8, enemySpeedMax: 2.8, spawnRateStart: 70, spawnRateMax: 40, acceleration: 0.05, lightBehavior: 'stable' },
    { id: 34, name: "Atemnot", targetType: 'score', targetValue: 300, pillarRadius: 50, pillarBehavior: 'shrinking pulsating', shadowKillRadius: null, enemySpeedStart: 1.6, enemySpeedMax: 3.0, spawnRateStart: 90, spawnRateMax: 30, acceleration: 0.06, lightBehavior: 'stable' },
    { id: 35, name: "Gewitter", targetType: 'survival', targetValue: 50, pillarRadius: 40, pillarBehavior: 'pulsating', shadowKillRadius: null, enemySpeedStart: 2.0, enemySpeedMax: 3.5, spawnRateStart: 60, spawnRateMax: 30, acceleration: 0.08, lightBehavior: 'flickering' },
    { id: 36, name: "Mückenstiche", targetType: 'score', targetValue: 150, pillarRadius: 40, pillarBehavior: 'static', shadowKillRadius: null, enemyRadius: 8, enemySpeedStart: 2.5, enemySpeedMax: 4.0, spawnRateStart: 100, spawnRateMax: 50, acceleration: 0.05, lightBehavior: 'stable' },
    { id: 37, name: "Hornissennest", targetType: 'survival', targetValue: 30, pillarRadius: 30, pillarBehavior: 'moving', shadowKillRadius: null, enemyRadius: 7, enemySpeedStart: 3.0, enemySpeedMax: 5.0, spawnRateStart: 60, spawnRateMax: 20, acceleration: 0.1, lightBehavior: 'stable' },
    { id: 38, name: "Die dicken Brocken", targetType: 'score', targetValue: 400, pillarRadius: 60, pillarBehavior: 'static', shadowKillRadius: null, enemyRadius: 22, enemySpeedStart: 1.0, enemySpeedMax: 1.8, spawnRateStart: 80, spawnRateMax: 40, acceleration: 0.03, lightBehavior: 'stable' },
    { id: 39, name: "Generationenkonflikt", targetType: 'score', targetValue: 350, pillarRadius: 35, pillarBehavior: 'pulsating', shadowKillRadius: null, enemyRadius: 15, enemySpeedStart: 1.5, enemySpeedMax: 3.0, spawnRateStart: 70, spawnRateMax: 30, acceleration: 0.05, lightBehavior: 'stable' },
    { id: 40, name: "Der Schwarm", targetType: 'survival', targetValue: 60, pillarRadius: 45, pillarBehavior: 'static', shadowKillRadius: null, enemyRadius: 6, enemySpeedStart: 2.2, enemySpeedMax: 4.5, spawnRateStart: 40, spawnRateMax: 10, acceleration: 0.12, lightBehavior: 'stable' },
    { id: 41, name: "Instabiler Kern", targetType: 'score', targetValue: 600, pillarRadius: 40, pillarBehavior: 'moving pulsating', shadowKillRadius: 200, enemyRadius: 12, enemySpeedStart: 2.0, enemySpeedMax: 3.5, spawnRateStart: 60, spawnRateMax: 25, acceleration: 0.06, lightBehavior: 'stable' },
    { id: 42, name: "Schatten-Kollaps", targetType: 'survival', targetValue: 45, pillarRadius: 55, pillarBehavior: 'shrinking pulsating', shadowKillRadius: null, enemyRadius: 10, enemySpeedStart: 2.5, enemySpeedMax: 4.0, spawnRateStart: 50, spawnRateMax: 20, acceleration: 0.08, lightBehavior: 'flickering' },
    { id: 43, name: "Pazifist V", targetType: 'pacifist', targetValue: 60, maxScore: 20, pillarRadius: 35, pillarBehavior: 'moving shrinking', shadowKillRadius: null, enemyRadius: 14, enemySpeedStart: 2.0, enemySpeedMax: 2.0, spawnRateStart: 60, spawnRateMax: 60, acceleration: 0, lightBehavior: 'stable' },
    { id: 44, name: "Vollmond-Wahnsinn", targetType: 'score', targetValue: 800, pillarRadius: 45, pillarBehavior: 'moving pulsating', shadowKillRadius: null, enemyRadius: 11, enemySpeedStart: 2.2, enemySpeedMax: 4.0, spawnRateStart: 50, spawnRateMax: 15, acceleration: 0.1, lightBehavior: 'flickering' },
    { id: 45, name: "Präzisions-Schwarm", targetType: 'score', targetValue: 500, pillarRadius: 20, pillarBehavior: 'moving', shadowKillRadius: 150, enemyRadius: 7, enemySpeedStart: 2.8, enemySpeedMax: 4.8, spawnRateStart: 70, spawnRateMax: 30, acceleration: 0.07, lightBehavior: 'stable' },
    { id: 46, name: "Überschall", targetType: 'survival', targetValue: 50, pillarRadius: 40, pillarBehavior: 'static', shadowKillRadius: null, enemyRadius: 9, enemySpeedStart: 4.0, enemySpeedMax: 7.0, spawnRateStart: 60, spawnRateMax: 20, acceleration: 0.15, lightBehavior: 'stable' },
    { id: 47, name: "Punktejagd im Chaos", targetType: 'score', targetValue: 1500, pillarRadius: 50, pillarBehavior: 'moving pulsating shrinking', shadowKillRadius: null, enemyRadius: 12, enemySpeedStart: 2.5, enemySpeedMax: 5.5, spawnRateStart: 40, spawnRateMax: 10, acceleration: 0.1, lightBehavior: 'flickering' },
    { id: 48, name: "Triple Threat", targetType: 'survival', targetValue: 80, pillarRadius: 35, pillarBehavior: 'moving pulsating shrinking', shadowKillRadius: null, enemyRadius: 10, enemySpeedStart: 3.0, enemySpeedMax: 5.0, spawnRateStart: 50, spawnRateMax: 15, acceleration: 0.08, lightBehavior: 'stable' },
    { id: 49, name: "Absolute Dunkelheit", targetType: 'survival', targetValue: 40, pillarRadius: 25, pillarBehavior: 'moving', shadowKillRadius: null, enemyRadius: 8, enemySpeedStart: 3.5, enemySpeedMax: 6.0, spawnRateStart: 30, spawnRateMax: 5, acceleration: 0.2, lightBehavior: 'flickering' },
    { id: 50, name: "Schatten-König", targetType: 'score', targetValue: 2500, pillarRadius: 45, pillarBehavior: 'moving pulsating shrinking', shadowKillRadius: 250, enemyRadius: 10, enemySpeedStart: 3.5, enemySpeedMax: 8.0, spawnRateStart: 30, spawnRateMax: 5, acceleration: 0.25, lightBehavior: 'flickering' }
];

const HEART_OBJECTIVE_LEVELS = {
    18: { delay: 3 },
    22: { delay: 3 },
    26: { delay: 3 },
    30: { delay: 2.5 },
    34: { delay: 2.5 },
    38: { delay: 2.5 },
    42: { delay: 2 },
    45: { delay: 2 },
    48: { delay: 2 },
    50: { delay: 1.5 }
};

LEVELS.forEach((lvl) => {
    const heartConfig = HEART_OBJECTIVE_LEVELS[lvl.id];
    if (!heartConfig) return;
    lvl.collectHearts = {
        count: 4,
        delay: heartConfig.delay
    };
});
