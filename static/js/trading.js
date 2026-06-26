// Save Path: static/js/trading.js
const Trading = {
    livePrice: 2000.00,
    priceTickInterval: null,

    init() {
        // Start live price simulation
        this.priceTickInterval = setInterval(() => {
            const volatility = this.livePrice * 0.0005;
            this.livePrice += (Math.random() - 0.49) * volatility;
            this.updateTrades();
            UI.updatePriceDisplay(this.livePrice);
        }, 1000);
    },

    updateTrades() {
        State.data.openTrades.forEach(trade => {
            const diff = this.livePrice - trade.openPrice;
            // P&L calculation: (Price Diff * Lots * Standard Multiplier)
            // Simulating Gold: 1 lot = $100 per $1 move
            const multiplier = trade.pair.includes('JPY') ? 10 : 100;
            trade.pnl = (trade.type === 'BUY' ? diff : -diff) * (trade.lot * multiplier);
        });
        UI.refreshTradingUI();
    },

    executeTrade(type, lot, sl, tp) {
        const trade = {
            id: Date.now(),
            pair: State.data.activePair,
            type: type,
            lot: lot,
            openPrice: this.livePrice,
            sl: sl || null,
            tp: tp || null,
            pnl: 0,
            time: new Date().toLocaleTimeString()
        };
        State.data.openTrades.push(trade);
        State.save();
        UI.toast(`✓ ${type} Executed at ${this.livePrice.toFixed(2)}`);
    },

    closeTrade(id) {
        const idx = State.data.openTrades.findIndex(t => t.id === id);
        if (idx > -1) {
            const trade = State.data.openTrades.splice(idx, 1)[0];
            trade.closePrice = this.livePrice;
            State.data.balance += trade.pnl;
            State.data.closedTrades.push(trade);
            State.save();
            UI.toast(`Trade Closed: ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}`);
        }
    }
};

Trading.init();
