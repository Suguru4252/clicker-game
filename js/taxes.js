// ========== НАЛОГИ ==========

// Добавление налога
function addTaxItem(type, id, value) {
    if (!gameState.taxes) gameState.taxes = [];
    
    const existing = gameState.taxes.find(t => t.type === type && t.id === id);
    const totalAmount = Math.floor(value * TAX_RATE);
    
    if (existing) {
        existing.value = value;
        existing.totalAmount = totalAmount;
        existing.hourlyRate = totalAmount / 72;
        existing.paid = false;
        existing.accrued = 0;
        existing.dueDate = Date.now() + TAX_PERIOD;
        existing.lastUpdate = Date.now();
        existing.overdue = false;
        return;
    }
    
    gameState.taxes.push({
        type: type,
        id: id,
        value: value,
        totalAmount: totalAmount,
        hourlyRate: totalAmount / 72,
        accrued: 0,
        dueDate: Date.now() + TAX_PERIOD,
        paid: false,
        lastUpdate: Date.now(),
        overdue: false
    });
}

// Обновление налогов
function updateTaxes() {
    if (!gameState.taxes) return;
    const now = Date.now();
    
    gameState.taxes.forEach(tax => {
        if (!tax.paid) {
            const timePassed = Math.min(60 * 60 * 1000, now - (tax.lastUpdate || now));
            tax.accrued += (tax.hourlyRate * timePassed) / (60 * 60 * 1000);
            if (tax.accrued > tax.totalAmount) {
                tax.accrued = tax.totalAmount;
            }
            tax.lastUpdate = now;
            
            // Проверка просрочки
            const timeLeft = tax.dueDate - now;
            tax.overdue = timeLeft < 0;
        }
    });
}

// Проверка просроченных налогов
function checkOverdueTaxes() {
    if (!gameState.taxes) return;
    const now = Date.now();
    
    gameState.taxes.forEach(tax => {
        if (!tax.paid) {
            const timeLeft = tax.dueDate - now;
            tax.overdue = timeLeft < 0;
        }
    });
}

// Оплата налога
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
    
    // Удаляем оплаченный налог
    gameState.taxes.splice(index, 1);
    
    saveGame();
    updateUI();
    renderTax();
    alert(`✅ Налог оплачен: ${formatMoney(amountToPay)}`);
    return true;
}

// Получение статуса налога
function getTaxStatus(taxItem) {
    if (!taxItem) return 'none';
    if (taxItem.paid) return 'paid';
    if (taxItem.overdue) return 'overdue';
    const timeLeft = taxItem.dueDate - Date.now();
    if (timeLeft < 12 * 60 * 60 * 1000) return 'soon';
    return 'normal';
}

// Получение прогресса налога
function getTaxProgress(taxItem) {
    if (!taxItem) return 0;
    return (taxItem.accrued / taxItem.totalAmount) * 100;
}

// Получение оставшегося времени
function getTimeLeft(taxItem) {
    if (!taxItem) return 0;
    const timeLeft = taxItem.dueDate - Date.now();
    if (timeLeft < 0) return 0;
    return timeLeft;
}

// Рендер налогов
function renderTax() {
    checkOverdueTaxes();
    
    let totalTaxDue = 0;
    let overdueCount = 0;
    
    gameState.taxes.forEach(tax => {
        if (!tax.paid && tax.accrued > 0) {
            totalTaxDue += tax.accrued;
            if (tax.overdue) overdueCount++;
        }
    });
    
    let html = `
        <div class="tax-summary">
            <div class="tax-summary-title">💰 НАЛОГОВ К ОПЛАТЕ</div>
            <div class="tax-summary-value">${formatMoney(Math.floor(totalTaxDue))}</div>
            <div class="tax-summary-sub">
                ⚠️ Просрочено: ${overdueCount} | ⏱️ Всего налогов: ${gameState.taxes.length}
            </div>
        </div>
    `;
    
    if (gameState.taxes.length === 0) {
        html += '<div style="text-align:center; padding:30px; color:#8e8e98;">У вас нет активных налогов</div>';
        document.getElementById('content').innerHTML = html;
        return;
    }
    
    // БИЗНЕСЫ
    const businessTaxes = gameState.taxes.filter(t => t.type === 'business');
    if (businessTaxes.length > 0) {
        html += '<h4 style="color:#ffd700; margin:16px 0 8px;">💼 БИЗНЕСЫ</h4>';
        businessTaxes.forEach((tax, index) => {
            const business = gameState.myBusinesses.find(b => b.id === tax.id);
            if (!business) return;
            
            const status = getTaxStatus(tax);
            const progress = getTaxProgress(tax);
            const timeLeft = getTimeLeft(tax);
            const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            
            let statusText = '';
            let statusClass = '';
            let disabled = false;
            
            if (tax.overdue) {
                statusText = '⛔ ПРОСРОЧЕНО';
                statusClass = 'tax-overdue';
                disabled = true;
            } else if (hoursLeft < 12) {
                statusText = `⚠️ СКОРО: ${hoursLeft}ч ${minutesLeft}м`;
                statusClass = 'tax-soon';
            } else {
                statusText = `⏱️ Осталось: ${hoursLeft}ч ${minutesLeft}м`;
                statusClass = 'tax-normal';
            }
            
            html += `
                <div class="tax-item ${statusClass}">
                    <div class="tax-header">
                        <span class="tax-name">${business.name} ${tax.overdue ? '🔴' : ''}</span>
                        <span class="tax-amount">${formatMoney(Math.floor(tax.accrued))} / ${formatMoney(tax.totalAmount)}</span>
                    </div>
                    <div class="tax-price">💰 Инвестировано: ${formatMoney(tax.value)}</div>
                    <div class="tax-progress">
                        <div class="tax-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="tax-timer">${statusText}</div>
                    ${!tax.paid && tax.accrued > 0 && !tax.overdue ? 
                        `<button class="tax-btn" onclick="payTaxByIndex(${gameState.taxes.indexOf(tax)})">ОПЛАТИТЬ ${formatMoney(Math.floor(tax.accrued))}</button>` : ''}
                    ${tax.overdue ? '<div style="color:#ff4444; font-size:12px; margin-top:8px; font-weight:bold;">⚠️ БИЗНЕС НЕ РАБОТАЕТ ДО ОПЛАТЫ</div>' : ''}
                </div>
            `;
        });
    }
    
    // ДОМА
    const houseTaxes = gameState.taxes.filter(t => t.type === 'house');
    if (houseTaxes.length > 0) {
        html += '<h4 style="color:#ffd700; margin:16px 0 8px;">🏠 ДОМА</h4>';
        houseTaxes.forEach((tax, index) => {
            const house = gameState.houses.find(h => h.id === tax.id);
            if (!house) return;
            
            const status = getTaxStatus(tax);
            const progress = getTaxProgress(tax);
            const timeLeft = getTimeLeft(tax);
            const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
            
            let statusText = '';
            let statusClass = '';
            
            if (tax.overdue) {
                statusText = '⛔ ПРОСРОЧЕНО';
                statusClass = 'tax-overdue';
            } else {
                statusText = `⏱️ Осталось: ${hoursLeft}ч`;
                statusClass = 'tax-normal';
            }
            
            html += `
                <div class="tax-item ${statusClass}">
                    <div class="tax-header">
                        <span class="tax-name">${house.emoji} ${house.name} ${tax.overdue ? '🔴' : ''}</span>
                        <span class="tax-amount">${formatMoney(Math.floor(tax.accrued))} / ${formatMoney(tax.totalAmount)}</span>
                    </div>
                    <div class="tax-price">💰 Стоимость: ${formatMoney(tax.value)}</div>
                    <div class="tax-progress">
                        <div class="tax-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="tax-timer">${statusText}</div>
                    ${!tax.paid && tax.accrued > 0 && !tax.overdue ? 
                        `<button class="tax-btn" onclick="payTaxByIndex(${gameState.taxes.indexOf(tax)})">ОПЛАТИТЬ ${formatMoney(Math.floor(tax.accrued))}</button>` : ''}
                    ${tax.overdue ? '<div style="color:#ff4444; font-size:12px; margin-top:8px;">⚠️ ДОХОД ЗАБЛОКИРОВАН</div>' : ''}
                </div>
            `;
        });
    }
    
    // КРИПТА
    const cryptoTaxes = gameState.taxes.filter(t => t.type === 'crypto');
    if (cryptoTaxes.length > 0) {
        html += '<h4 style="color:#ffd700; margin:16px 0 8px;">📈 КРИПТА</h4>';
        cryptoTaxes.forEach((tax, index) => {
            const crypto = cryptoCurrencies.find(c => c.id === tax.id);
            if (!crypto) return;
            
            const userCrypto = gameState.crypto.find(c => c.id === tax.id);
            if (!userCrypto || userCrypto.owned === 0) return;
            
            const status = getTaxStatus(tax);
            const progress = getTaxProgress(tax);
            const timeLeft = getTimeLeft(tax);
            const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
            
            let statusText = '';
            let statusClass = '';
            
            if (tax.overdue) {
                statusText = '⛔ ПРОСРОЧЕНО';
                statusClass = 'tax-overdue';
            } else {
                statusText = `⏱️ Осталось: ${hoursLeft}ч`;
                statusClass = 'tax-normal';
            }
            
            html += `
                <div class="tax-item ${statusClass}">
                    <div class="tax-header">
                        <span class="tax-name">${crypto.emoji} ${crypto.name}</span>
                        <span class="tax-amount">${formatMoney(Math.floor(tax.accrued))} / ${formatMoney(tax.totalAmount)}</span>
                    </div>
                    <div class="tax-price">💰 Инвестиции: ${formatMoney(tax.value)}</div>
                    <div class="tax-progress">
                        <div class="tax-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="tax-timer">${statusText}</div>
                    <div style="font-size:11px; color:#8e8e98; margin-bottom:4px;">
                        Владею: ${formatFullNumber(userCrypto.owned)} шт
                    </div>
                    ${!tax.paid && tax.accrued > 0 && !tax.overdue ? 
                        `<button class="tax-btn" onclick="payTaxByIndex(${gameState.taxes.indexOf(tax)})">ОПЛАТИТЬ ${formatMoney(Math.floor(tax.accrued))}</button>` : ''}
                    ${tax.overdue ? '<div style="color:#ff4444; font-size:12px; margin-top:8px;">⚠️ ДОХОД ЗАБЛОКИРОВАН</div>' : ''}
                </div>
            `;
        });
    }
    
    // МАЙНИНГ
    const miningTaxes = gameState.taxes.filter(t => t.type === 'mining');
    if (miningTaxes.length > 0) {
        const totalMiningValue = miningTaxes.reduce((sum, t) => sum + t.value, 0);
        const totalMiningAccrued = miningTaxes.reduce((sum, t) => sum + t.accrued, 0);
        const totalMiningAmount = miningTaxes.reduce((sum, t) => sum + t.totalAmount, 0);
        const anyOverdue = miningTaxes.some(t => t.overdue);
        const progress = (totalMiningAccrued / totalMiningAmount) * 100;
        
        const timeLeft = Math.min(...miningTaxes.map(t => getTimeLeft(t)));
        const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
        
        html += '<h4 style="color:#ffd700; margin:16px 0 8px;">⛏️ МАЙНИНГ ФЕРМЫ</h4>';
        html += `
            <div class="tax-item ${anyOverdue ? 'tax-overdue' : 'tax-normal'}">
                <div class="tax-header">
                    <span class="tax-name">ВСЕ ФЕРМЫ (${miningTaxes.length} шт)</span>
                    <span class="tax-amount">${formatMoney(Math.floor(totalMiningAccrued))} / ${formatMoney(totalMiningAmount)}</span>
                </div>
                <div class="tax-price">💰 Инвестировано: ${formatMoney(totalMiningValue)}</div>
                <div class="tax-progress">
                    <div class="tax-progress-bar" style="width: ${progress}%"></div>
                </div>
                <div class="tax-timer">⏱️ Мин. осталось: ${hoursLeft}ч</div>
                ${!anyOverdue && totalMiningAccrued > 0 ? 
                    `<button class="tax-btn" onclick="payAllMiningTaxes()">ОПЛАТИТЬ ВСЁ ${formatMoney(Math.floor(totalMiningAccrued))}</button>` : ''}
                ${anyOverdue ? '<div style="color:#ff4444; font-size:12px; margin-top:8px; font-weight:bold;">⚠️ МАЙНИНГ НЕ РАБОТАЕТ ДО ОПЛАТЫ</div>' : ''}
            </div>
        `;
    }
    
    // ОСТРОВА
    const islandTaxes = gameState.taxes.filter(t => t.type === 'island');
    if (islandTaxes.length > 0) {
        html += '<h4 style="color:#ffd700; margin:16px 0 8px;">🏝️ ОСТРОВА</h4>';
        islandTaxes.forEach((tax, index) => {
            const island = gameState.islands.find(i => i.id === tax.id);
            if (!island) return;
            
            const status = getTaxStatus(tax);
            const progress = getTaxProgress(tax);
            const timeLeft = getTimeLeft(tax);
            const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
            
            let statusText = '';
            let statusClass = '';
            
            if (tax.overdue) {
                statusText = '⛔ ПРОСРОЧЕНО';
                statusClass = 'tax-overdue';
            } else {
                statusText = `⏱️ Осталось: ${hoursLeft}ч`;
                statusClass = 'tax-normal';
            }
            
            html += `
                <div class="tax-item ${statusClass}">
                    <div class="tax-header">
                        <span class="tax-name">${island.emoji} ${island.name}</span>
                        <span class="tax-amount">${formatMoney(Math.floor(tax.accrued))} / ${formatMoney(tax.totalAmount)}</span>
                    </div>
                    <div class="tax-price">💰 Стоимость: ${formatMoney(tax.value)}</div>
                    <div class="tax-progress">
                        <div class="tax-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="tax-timer">${statusText}</div>
                    ${!tax.paid && tax.accrued > 0 && !tax.overdue ? 
                        `<button class="tax-btn" onclick="payTaxByIndex(${gameState.taxes.indexOf(tax)})">ОПЛАТИТЬ ${formatMoney(Math.floor(tax.accrued))}</button>` : ''}
                    ${tax.overdue ? '<div style="color:#ff4444; font-size:12px; margin-top:8px;">⚠️ ДОХОД ЗАБЛОКИРОВАН</div>' : ''}
                </div>
            `;
        });
    }
    
    document.getElementById('content').innerHTML = html;
}

// Оплата всех майнинг налогов
function payAllMiningTaxes() {
    const miningTaxes = gameState.taxes.filter(t => t.type === 'mining' && !t.paid && t.accrued > 0 && !t.overdue);
    if (miningTaxes.length === 0) return;
    
    const totalAmount = miningTaxes.reduce((sum, t) => sum + Math.floor(t.accrued), 0);
    
    if (gameState.balance < totalAmount) {
        alert('❌ НЕДОСТАТОЧНО МОНЕТ!');
        return;
    }
    
    gameState.balance -= totalAmount;
    
    // Удаляем все оплаченные майнинг налоги
    gameState.taxes = gameState.taxes.filter(t => t.type !== 'mining' || t.paid || t.accrued <= 0 || t.overdue);
    
    saveGame();
    updateUI();
    renderTax();
    alert(`✅ Налоги на майнинг оплачены: ${formatMoney(totalAmount)}`);
}

// Оплата налога по индексу
function payTaxByIndex(index) {
    payTax(index);
}
