// ========== УТИЛИТЫ ==========
const Utils = {
    // Форматирование чисел
    formatNumber(num) {
        if (num === undefined || num === null || isNaN(num)) return "0";
        if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Qi';
        if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toString();
    },
    
    formatFullNumber(num) {
        if (num === undefined || num === null || isNaN(num)) return "0";
        return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    
    formatMoney(num) {
        if (num === undefined || num === null || isNaN(num)) return "$ 0";
        return '$ ' + this.formatFullNumber(num);
    },
    
    formatTime(ms) {
        if (ms < 0) return "00:00:00";
        const hours = Math.floor(ms / (60 * 60 * 1000));
        const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((ms % (60 * 1000)) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    formatTimeShort(ms) {
        if (ms < 0) return "00:00";
        const hours = Math.floor(ms / (60 * 60 * 1000));
        const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
        return `${hours}ч ${minutes}м`;
    },
    
    // Генерация уникального ID
    generateId() {
        return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Получение device ID
    getDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    },
    
    // Воспроизведение звука клика
    playClickSound() {
        const settings = window.gameState?.settings || { soundEnabled: true };
        if (!settings.soundEnabled) return;
        
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 523.25;
            gainNode.gain.value = 0.1;
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.05);
        } catch(e) {}
    },
    
    // Создание всплывающего эффекта
    createFloatingEffect(x, y, text) {
        const settings = window.gameState?.settings || { effectsEnabled: true };
        if (!settings.effectsEnabled) return;
        
        const el = document.createElement('div');
        el.className = 'floating-effect';
        el.textContent = text;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 800);
    }
};

window.Utils = Utils;