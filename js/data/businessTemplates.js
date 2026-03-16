// ========== ШАБЛОНЫ БИЗНЕСОВ ==========
const BUSINESS_TEMPLATES = [
    { id: 0, name: "🚕 ТАКСОПАРК", baseIncome: 2000 / 60, baseUpgradeCost: 50000, upgradeTime: 30, maxLevel: 20, incomeMultiplier: 1.5, costMultiplier: 50 },
    { id: 1, name: "🍔 РЕСТОРАН", baseIncome: 20000 / 60, baseUpgradeCost: 500000, upgradeTime: 60, maxLevel: 20, incomeMultiplier: 1.5, costMultiplier: 50 },
    { id: 2, name: "⛽ ЗАПРАВКА", baseIncome: 200000 / 60, baseUpgradeCost: 50000000, upgradeTime: 120, maxLevel: 20, incomeMultiplier: 1.5, costMultiplier: 50 },
    { id: 3, name: "🏭 ЗАВОД", baseIncome: 2000000 / 60, baseUpgradeCost: 100000000, upgradeTime: 180, maxLevel: 20, incomeMultiplier: 1.5, costMultiplier: 50 },
    { id: 4, name: "🏨 ОТЕЛЬ", baseIncome: 20000000 / 60, baseUpgradeCost: 1000000000, upgradeTime: 300, maxLevel: 20, incomeMultiplier: 1.5, costMultiplier: 50 },
    { id: 5, name: "🎰 КАЗИНО", baseIncome: 40000000 / 60, baseUpgradeCost: 10000000000, upgradeTime: 600, maxLevel: 20, incomeMultiplier: 1.5, costMultiplier: 50 },
    { id: 6, name: "🏦 БАНК", baseIncome: 600000000 / 60, baseUpgradeCost: 40000000000, upgradeTime: 1200, maxLevel: 20, incomeMultiplier: 1.5, costMultiplier: 50 },
    { id: 7, name: "🏛️ ИМПЕРИЯ", baseIncome: 2000000000 / 60, baseUpgradeCost: 100000000000, upgradeTime: 2400, maxLevel: 20, incomeMultiplier: 1.5, costMultiplier: 50 }
];

window.BUSINESS_TEMPLATES = BUSINESS_TEMPLATES;