// ========== ХРАНЕНИЕ ДАННЫХ ==========
const Storage = {
    // Сохранение игры
    saveGame() {
        const gameState = window.gameState;
        if (!gameState) return;
        
        gameState.lastOnlineTime = Date.now();
        gameState.cryptoPrices = window.cryptoPrices;
        
        const saveData = {
            gameState: gameState,
            settings: gameState.settings,
            nickname: gameState.currentUser
        };
        
        localStorage.setItem('imperiaClickerSave_' + gameState.currentUserId, JSON.stringify(saveData));
    },
    
    // Загрузка игры
    loadGame() {
        const currentUserId = window.gameState?.currentUserId || Utils.getDeviceId();
        const saved = localStorage.getItem('imperiaClickerSave_' + currentUserId);
        
        if (saved) {
            try {
                const data = JSON.parse(saved);
                return {
                    success: true,
                    gameState: data.gameState,
                    settings: data.settings,
                    nickname: data.nickname
                };
            } catch(e) {
                console.error('Load error', e);
                return { success: false };
            }
        }
        return { success: false };
    },
    
    // Сброс игры
    resetGame() {
        const currentUserId = window.gameState?.currentUserId || Utils.getDeviceId();
        localStorage.removeItem('imperiaClickerSave_' + currentUserId);
        localStorage.removeItem('deviceId');
        location.reload();
    }
};

window.Storage = Storage;