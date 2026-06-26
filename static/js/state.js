// Save Path: static/js/state.js
const State = {
    data: {
        page: 'home',
        prevPage: 'home',
        traderName: 'Trader',
        balance: 10000,
        activePair: 'XAUUSD',
        activeProvider: 'OANDA',
        openTrades: [],
        closedTrades: [],
        settings: {
            theme: 'light',
            masterBot: false,
            mode: 'normal',
            apiModel: 'google/gemini-2.0-flash',
            apiKey: '',
            threshold: 85
        }
    },

    init() {
        const saved = localStorage.getItem('vypervic_state');
        if (saved) {
            this.data = JSON.parse(saved);
        }
        this.save();
    },

    save() {
        localStorage.setItem('vypervic_state', JSON.stringify(this.data));
    },

    updateBalance(amount) {
        this.data.balance += amount;
        this.save();
    }
};

State.init();
