// ========== НАЛОГИ (ИСПРАВЛЕНО) ==========

function payTax(index) {
    const tax = gameState.taxes[index];
    if (!tax) return false;
    
    const amountToPay = Math.floor(tax.accrued);
    
    if (amountToPay <= 0) {
        alert('❌ НЕТ НАЧИСЛЕННЫХ НАЛОГОВ!');
        return false;
    }
    
    if (gameState.balance < amountToPay) {
        alert('❌ НЕДОСТАТОЧНО МОНЕТ ДЛЯ УПЛАТЫ НАЛОГА!');
        return false;
    }
    
    gameState.balance -= amountToPay;
    
    // НАЛОГ ОПЛАЧЕН - УДАЛЯЕМ
    gameState.taxes.splice(index, 1);
    
    saveGame();
    updateUI();
    renderTax();
    alert(`✅ Налог оплачен: ${formatMoney(amountToPay)}`);
    return true;
}
