// Save Path: static/js/ui.js
const UI = {
    init() {
        this.refreshAll();
        // Force initial chart load
        this.refreshCharts();
    },

    toast(msg) {
        const t = document.getElementById('toast');
        t.textContent = msg;
        t.style.opacity = '1';
        t.style.bottom = '100px';
        setTimeout(() => { t.style.opacity = '0'; }, 2000);
    },

    refreshAll() {
        document.getElementById('trader-name-display').textContent = State.data.traderName;
        document.getElementById('hero-balance').textContent = `$${State.data.balance.toLocaleString()}`;
        document.getElementById('home-open').textContent = State.data.openTrades.length;
        document.getElementById('paper-balance-display').textContent = `$${State.data.balance.toLocaleString()}`;
        document.getElementById('open-badge-display').textContent = `${State.data.openTrades.length} open`;
        this.renderTradesList();
    },

    renderTradesList() {
        const container = document.getElementById('trades-list-container');
        const trades = State.data.openTrades;
        
        if (trades.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--t3)">No open trades.</div>';
            return;
        }

        container.innerHTML = trades.map(t => `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:15px 0; border-bottom:1px solid var(--border)">
                <div>
                    <div style="font-weight:800; color:var(--t1)">${t.pair}</div>
                    <div style="font-size:11px; color:var(--t3)">${t.type} · ${t.lot} lots</div>
                </div>
                <div style="font-weight:800; color:${t.pnl >= 0 ? 'var(--green)' : 'var(--red)'}">
                    ${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(2)}
                </div>
                <button onclick="Trading.closeTrade(${t.id})" style="padding:6px 12px; border-radius:8px; border:none; background:var(--red-bg); color:var(--red); font-weight:700; font-size:10px">CLOSE</button>
            </div>
        `).join('');

        const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
        const floatPnl = document.getElementById('panel-floating-pnl');
        floatPnl.textContent = `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`;
        floatPnl.style.color = totalPnl >= 0 ? 'var(--green)' : 'var(--red)';
    },

    refreshCharts() {
        const pair = State.data.activePair;
        const provider = State.data.activeProvider;
        const theme = State.data.settings.theme;
        const symbol = `${provider}:${pair}`;
        
        const tvUrl = `https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=5&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&theme=${theme}&style=1&timezone=Etc%2FUTC`;
        
        const marketFrame = document.getElementById('tv-market');
        const aiFrame = document.getElementById('tv-ai');
        
        if(marketFrame) marketFrame.src = tvUrl;
        if(aiFrame) aiFrame.src = tvUrl;
    }
};
