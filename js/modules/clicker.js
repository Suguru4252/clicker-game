// ========== КЛИКЕР ==========
const Clicker = {
    // Обработка клика
    handleClick(event) {
        const gameState = window.gameState;
        const earned = CONSTANTS.BASE_CLICK_POWER * (gameState.level || 1);
        
        gameState.balance = (gameState.balance || 0) + earned;
        gameState.totalClicks = (gameState.totalClicks || 0) + 1;
        gameState.totalEarned = (gameState.totalEarned || 0) + earned;
        
        // Опыт
        gameState.exp = (gameState.exp || 0) + earned / 100;
        const expNeeded = (gameState.level || 1) * 1500;
        while (gameState.exp >= expNeeded && (gameState.level || 1) < CONSTANTS.MAX_PLAYER_LEVEL) {
            gameState.exp -= expNeeded;
            gameState.level = (gameState.level || 1) + 1;
            gameState.diamonds = (gameState.diamonds || 0) + 5;
        }
        
        // Боевой пропуск
        if (gameState.battlePass && gameState.battlePass.level < 200) {
            gameState.battlePass.exp += 100;
            BattlePass.checkLevel();
        }
        
        Utils.playClickSound();
        if (event) {
            Utils.createFloatingEffect(event.clientX || 200, event.clientY || 200, `+${Utils.formatNumber(earned)}💰`);
        }
        
        Achievements.checkAchievements();
        UI.updateHeader();
        Storage.saveGame();
    }
};

window.Clicker = Clicker;