// Save Path: static/js/ui.js
const UI = {
    toast(msg) {
        const t = document.getElementById('toast');
        t.textContent = msg;
        t.style.opacity = '1';
        setTimeout(() => t.style.opacity = '0', 2500);
    },

    updateHeaderPill(page) {
        const pill = document.getElementById('hdr-pill');
        const ana = document.getElementById('hdr-analyse');
        if (page === 'home' || page === 'markets') {
            pill.style.display = 'block';
            pill.textContent = '● Live';
            pill.className = 'hdr-pill';
        } else if (page === 'stats') {
            pill.style.display = 'block';
            pill.textContent = 'Stats';
        } else {
            pill.style.display = 'none';
        }
        ana.classList.toggle('show', page === 'ai');
    },

    refreshAll() {
        // Home Stats
        document.getElementById('trader-name-display').textContent = State.data.traderName;
        document.getElementById('hero-balance').textContent = `$${State.data.balance.toLocaleString()}`;
        document.getElementById('home-open').textContent = State.data.openTrades.length;
        
        // Markets Paper Bar
        document.getElementById('paper-balance-display').textContent = `$${State.data.balance.toLocaleString()}`;
        document.getElementById('open-badge-display').textContent = `${State.data.openTrades.length} open`;
        
        this.renderTradesList();
    },

    renderTradesList() {
        const container = document.getElementById('trades-list-container');
        if (State.data.openTrades.length === 0) {
            container.innerHTML = '<div class="panel-empty">No open trades.</div>';
            return;
        }

        container.innerHTML = State.data.openTrades.map(t => `
            <div class="trade-row">
                <div class="trade-info">
                    <div class="trade-pair">${t.pair}</div>
                    <div class="trade-detail">${t.type} · ${t.lot} lots</div>
                </div>
                <div class="trade-pnl ${t.pnl >= 0 ? 'pos' : 'neg'}">
                    ${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(2)}
                </div>
                <button class="btn-close-trade" onclick="Trading.closeTrade(${t.id})">CLOSE</button>
            </div>
        `).join('');

        // Update Floating P&L
        const totalPnl = State.data.openTrades.reduce((s, t) => s + t.pnl, 0);
        const floatEl = document.getElementById('panel-floating-pnl');
        floatEl.textContent = `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`;
        floatEl.style.color = totalPnl >= 0 ? 'var(--green)' : 'var(--red)';
    },

    updatePriceDisplay(price) {
        const el = document.getElementById('tp-price-display');
        if (el) el.textContent = price.toFixed(2);
    },

    toggleTradesPanel(show) {
        document.getElementById('trades-panel').classList.toggle('on', show);
    },

    setTheme(theme) {
        State.data.settings.theme = theme;
        document.body.classList.toggle('dark', theme === 'dark');
        document.getElementById('theme-label').textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
        document.getElementById('seg-light').classList.toggle('on', theme === 'light');
        document.getElementById('seg-dark').classList.toggle('on', theme === 'dark');
        
        // Update Chart Themes
        const themeStr = theme === 'dark' ? 'dark' : 'light';
        ['tv-market', 'tv-ai'].forEach(id => {
            const iframe = document.getElementById(id);
            if (iframe.src) iframe.src = iframe.src.replace(/theme=[^&]+/, `theme=${themeStr}`);
        });
        State.save();
    },

    refreshCharts() {
        const symbol = `${State.data.activeProvider}:${State.data.activePair}`;
        const theme = State.data.settings.theme;
        const url = `https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=5&theme=${theme}&style=1&timezone=Etc%2FUTC`;
        
        document.getElementById('tv-market').src = url;
        document.getElementById('tv-ai').src = url;
    }
};
