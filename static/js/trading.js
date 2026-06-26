// Save Path: static/js/trading.js
const Trading = {
    livePrice: 0,
    
    async init() {
        this.fetchRealPrice();
        setInterval(() => this.fetchRealPrice(), 2000);
        
        // Background P&L loop
        setInterval(() => this.calculatePnL(), 1000);
    },

    async fetchRealPrice() {
        const pair = State.data.activePair;
        
        try {
            // If it's a Binance crypto pair
            if (pair.endsWith('USDT')) {
                const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
                const data = await res.json();
                this.livePrice = parseFloat(data.price);
            } else {
                // For Forex/Indices (OANDA), since there is no free CORS-enabled API, 
                // we simulate realistic movement based on the last known TV price.
                if (this.livePrice === 0) this.livePrice = pair.includes('XAU') ? 2000 : 1.1000;
                this.livePrice += (Math.random() - 0.5) * (this.livePrice * 0.0001);
            }
            UI.updatePriceDisplay(this.livePrice);
        } catch (e) {
            console.error("Price fetch error", e);
        }
    },

    calculatePnL() {
        if (State.data.openTrades.length === 0) return;

        State.data.openTrades.forEach(t => {
            const diff = this.livePrice - t.openPrice;
            // Standard multiplier: Forex (100k), Gold (100)
            const mult = t.pair.includes('XAU') ? 100 : 100000;
            t.pnl = (t.type === 'BUY' ? diff : -diff) * t.lot * (mult / 100);
        });
        
        UI.renderTradesList();
    },

    executeTrade(type, lot) {
        const trade = {
            id: Date.now(),
            pair: State.data.activePair,
            type: type,
            lot: lot,
            openPrice: this.livePrice,
            pnl: 0,
            time: new Date().toLocaleTimeString()
        };
        State.data.openTrades.push(trade);
        State.save();
        UI.refreshAll();
        UI.toast(`Trade Placed: ${type} ${lot} ${trade.pair}`);
    },

    closeTrade(id) {
        const idx = State.data.openTrades.findIndex(t => t.id === id);
        if (idx > -1) {
            const t = State.data.openTrades.splice(idx, 1)[0];
            State.data.balance += t.pnl;
            State.data.closedTrades.push(t);
            State.save();
            UI.refreshAll();
            UI.toast(`Closed: ${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(2)}`);
        }
    },

    closeAll() {
        if (State.data.openTrades.length === 0) return;
        while(State.data.openTrades.length > 0) {
            this.closeTrade(State.data.openTrades[0].id);
        }
        UI.toggleTradesPanel(false);
    }
};

Trading.init();
