// ========== АВТОМАТИЧЕСКИЕ ОБНОВЛЕНИЯ ==========
const Updates = {
    // Запуск всех интервалов
    init() {
        // Минутный доход
        setInterval(() => {
            const gameState = window.gameState;
            if (!gameState) return;
            
            let income = 0;
            // ... расчет дохода
            
            if (income > 0) {
                gameState.balance = (gameState.balance || 0) + Math.floor(income);
                gameState.totalEarned = (gameState.totalEarned || 0) + Math.floor(income);
            }
            
            Taxes.updateTaxes();
            BattlePass.checkLevel();
            Achievements.checkAchievements();
            
            Renderer.updateHeader();
            Storage.saveGame();
        }, 60000);
        
        // Обновление цен крипты
        setInterval(() => {
            if (window.cryptoPrices) {
                // ... обновление цен
                if (window.currentTab === 'investments') {
                    Renderer.renderCurrentTab();
                }
            }
        }, 300000);
        
        // UI обновление каждые 0.25 секунды
        setInterval(() => {
            if (!window.gameState) return;
            
            Renderer.updateHeader();
            
            // Обновление прогресс-баров
            if (['business', 'tax', 'calendar', 'space'].includes(window.currentTab)) {
                Renderer.renderCurrentTab();
            }
            
            // Проверка завершения улучшений
            if (window.gameState.myBusinesses) {
                window.gameState.myBusinesses.forEach((b, index) => {
                    if (b.upgradeEnd && b.upgradeEnd <= Date.now()) {
                        Businesses.completeUpgrade(index);
                    }
                });
            }
        }, 250);
    }
};

window.Updates = Updates;