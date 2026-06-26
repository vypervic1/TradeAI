// Save Path: static/js/app.js
const App = {
    init() {
        this.bindEvents();
        this.navigate(State.data.page);
        UI.refreshAll();
    },

    bindEvents() {
        // Nav Items
        document.querySelectorAll('.nav-item, .quick-card').forEach(el => {
            el.addEventListener('click', () => this.navigate(el.dataset.nav));
        });

        // Back Button
        document.getElementById('global-back-btn').addEventListener('click', () => this.goBack());

        // Trade Execution
        document.getElementById('market-buy-btn')?.addEventListener('click', () => this.openTradePanel('BUY'));
        document.getElementById('market-sell-btn')?.addEventListener('click', () => this.openTradePanel('SELL'));
        
        document.getElementById('tp-execute-btn')?.addEventListener('click', () => {
            const lot = parseFloat(document.getElementById('lot-input').value);
            const type = document.getElementById('tp-execute-btn').dataset.type;
            Trading.executeTrade(type, lot);
            this.navigate('markets');
        });

        // Theme
        document.getElementById('seg-light').onclick = () => UI.setTheme('light');
        document.getElementById('seg-dark').onclick = () => UI.setTheme('dark');

        // Overlays
        document.getElementById('open-badge-display').onclick = () => UI.toggleTradesPanel(true);
        document.getElementById('trades-panel').onclick = (e) => {
            if(e.target.id === 'trades-panel') UI.toggleTradesPanel(false);
        };
    },

    navigate(pageId, subTitle = "") {
        if (!pageId) return;
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
        
        const target = document.getElementById(`page-${pageId}`);
        if (target) {
            target.classList.add('on');
            State.data.prevPage = State.data.page;
            State.data.page = pageId;
            
            // Sub-header logic
            const subHeader = document.getElementById('sub-header');
            if (subTitle) {
                subHeader.classList.add('on');
                document.getElementById('sub-title').innerText = subTitle;
            } else {
                subHeader.classList.remove('on');
            }
        }
        
        // Update Bottom Nav
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.toggle('on', nav.dataset.nav === pageId);
        });

        UI.updateHeaderPill(pageId);
    },

    goBack() {
        this.navigate(State.data.prevPage);
    },

    openTradePanel(type) {
        const btn = document.getElementById('tp-execute-btn');
        btn.innerText = `EXECUTE ${type}`;
        btn.className = `execute-btn ${type.toLowerCase()}`;
        btn.dataset.type = type;
        document.getElementById('tp-title').innerText = `Place ${type} Trade`;
        document.getElementById('tp-pair-display').innerText = State.data.activePair;
        this.navigate('trade-panel', 'Trade Configuration');
    }
};

window.onload = () => App.init();
