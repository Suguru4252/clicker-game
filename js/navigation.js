// ========== НАВИГАЦИЯ ==========
function switchTab(tab) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'earn') renderEarn();
    else if (tab === 'calendar') renderCalendar();
    else if (tab === 'space') renderSpace();
    else if (tab === 'achievements') renderAchievements();
    else if (tab === 'investments') renderInvestments();
    else if (tab === 'business') renderBusiness();
    else if (tab === 'mining') renderMining();
    else if (tab === 'tax') renderTax();
    else if (tab === 'items') renderItems();
    else if (tab === 'profile') renderProfile();
}

function updateUI() {
    document.getElementById('balance').textContent = formatMoney(gameState.balance || 0);
    document.getElementById('balanceChange').innerHTML = '+ ' + formatMoney(gameState.totalEarned || 0) + ' за все время';
    document.getElementById('clickPower').textContent = formatMoney(BASE_CLICK_POWER * (gameState.level || 1));
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function closeNicknameModal() {
    document.getElementById('nicknameModal').classList.remove('active');
}

function closeAdminPasswordModal() {
    document.getElementById('adminPasswordModal').classList.remove('active');
}