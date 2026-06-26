// Save Path: static/js/trading.js
const Trading = {
    livePrice: 2600.00,

    init() {
        setInterval(() => this.tick(), 1000);
    },

    tick() {
        // Simple realistic tick simulation for Forex/Gold
        const volatility = this.livePrice * 0.0002;
        this.livePrice += (Math.random() - 0.49) * volatility;
        
        // Update UI
        const priceEl = document.getElementById('tp-price-display');
        if(priceEl) priceEl.textContent = this.livePrice.toFixed(2);

        // Update P&L
        State.data.openTrades.forEach(t => {
            const diff = this.livePrice - t.openPrice;
            const multiplier = t.pair.includes('JPY') ? 100 : 100; // Simplified for demo
            t.pnl = (t.type === 'BUY' ? diff : -diff) * (t.lot * multiplier);
        });

        UI.renderTradesList();
    },

    closeTrade(id) {
        const index = State.data.openTrades.findIndex(t => t.id === id);
        if (index > -1) {
            const t = State.data.openTrades.splice(index, 1)[0];
            State.data.balance += t.pnl;
            State.data.closedTrades.push(t);
            State.save();
            UI.refreshAll();
            UI.toast("Trade Closed");
        }
    }
};
Trading.init();
