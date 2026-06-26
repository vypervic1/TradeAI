// Save Path: static/js/app.js
const App = {
    init() {
        this.bindEvents();
        UI.setTheme(State.data.settings.theme);
        UI.refreshAll();
        UI.refreshCharts();
        
        // Initial Navigation
        this.navigate('home');
    },

    bindEvents() {
        // Main Navigation
        document.querySelectorAll('[data-nav]').forEach(el => {
            el.onclick = () => this.navigate(el.dataset.nav);
        });

        // Subpages Navigation
        document.querySelectorAll('[data-sub]').forEach(el => {
            el.onclick = () => this.navigate(el.dataset.sub, el.dataset.title);
        });

        // Back Button
        document.getElementById('global-back-btn').onclick = () => this.goBack();

        // Trading Actions
        document.getElementById('market-buy-btn').onclick = () => this.openTradePanel('BUY');
        document.getElementById('market-sell-btn').onclick = () => this.openTradePanel('SELL');
        
        document.getElementById('tp-execute-btn').onclick = () => {
            const lot = parseFloat(document.getElementById('lot-input').value);
            Trading.executeTrade(document.getElementById('tp-execute-btn').dataset.type, lot);
            this.navigate('markets');
        };

        // Lot Adjustments
        document.getElementById('lot-plus').onclick = () => this.adjLot(0.01);
        document.getElementById('lot-minus').onclick = () => this.adjLot(-0.01);
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.onclick = () => document.getElementById('lot-input').value = btn.dataset.val;
        });

        // Close All
        document.getElementById('close-all-trades-btn').onclick = () => Trading.closeAll();
    },

    navigate(pageId, subTitle = "") {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
        const target = document.getElementById(`page-${pageId}`);
        if (!target) return;

        target.classList.add('on');
        State.data.prevPage = State.data.page;
        State.data.page = pageId;

        const subHeader = document.getElementById('sub-header');
        if (subTitle) {
            subHeader.classList.add('on');
            document.getElementById('sub-title').textContent = subTitle;
        } else {
            subHeader.classList.remove('on');
        }

        UI.updateHeaderPill(pageId);
    },

    goBack() {
        const p = State.data.prevPage;
        // Logic to return to parent categories
        if (['ai-mode-switch', 'api-config', 'threshold'].includes(State.data.page)) {
            this.navigate('settings');
        } else {
            this.navigate('home');
        }
    },

    openTradePanel(type) {
        const btn = document.getElementById('tp-execute-btn');
        btn.dataset.type = type;
        btn.textContent = `EXECUTE ${type}`;
        btn.className = `execute-btn ${type.toLowerCase()}`;
        document.getElementById('tp-title').textContent = `Place ${type} Trade`;
        document.getElementById('tp-pair-display').textContent = State.data.activePair;
        this.navigate('trade-panel', 'Trade Configuration');
    },

    adjLot(val) {
        const input = document.getElementById('lot-input');
        let current = parseFloat(input.value);
        input.value = Math.max(0.01, current + val).toFixed(2);
    }
};

window.onload = () => App.init();
