/* ===========================================
   ORTAK LAYOUT (Skeleton) SİSTEMİ
   ===========================================
   Kullanım:
     const layout = renderLayout({ title, activeTab, layoutType, showQA, sidebarTitle });
   Dönüş:
     { appWindow, mainContent, xpContainer, quickAccessList, sidebar, toolbar }
*/

const NAV_ITEMS = [
    { id: 'home',      label: 'Ana Sayfa', href: 'index.html' },
    { id: 'players',   label: 'Oyuncular', href: 'players.html' },
    { id: 'countries', label: 'Ülkeler',   href: 'countries.html' },
    { id: 'wars',      label: 'Savaşlar',  href: 'wars.html' },
    { id: 'events',    label: 'Olaylar',   href: '#' },
    { id: 'chrono',    label: 'Kronoloji', href: '#' }
];

const MENU_ITEMS = ['Dosya', 'Düzen', 'Görünüm', 'Yardım'];

function renderLayout(options = {}) {
    const {
        title       = 'ElciKMP-DataPad',
        activeTab   = '',
        layoutType  = 'detail',        // 'detail' | 'list' | 'simple'
        showQA      = false,
        sidebarTitle = 'Gezinti',
        statusLeft  = '© Elcirashod',
        statusRight = 'Arşiv v1.0'
    } = options;

    /* ---- Toolbar ---- */
    const toolbarHTML = NAV_ITEMS.map(item => {
        const cls = item.id === activeTab ? ' class="active"' : '';
        return `<a href="${item.href}"${cls}>${item.label}</a>`;
    }).join('');

    const qaHTML = showQA ? `<a href="cmd.html" class="qa-button">Q&amp;A</a>` : '';

    /* ---- Main Area ---- */
    let mainAreaHTML = '';
    if (layoutType === 'detail') {
        mainAreaHTML = `
            <div class="main-area">
                <div class="sidebar">
                    <div class="sidebar-title">${sidebarTitle}</div>
                    <ul id="quickAccessList"></ul>
                </div>
                <div class="content-pane" id="mainContent">Yükleniyor...</div>
            </div>`;
    } else if (layoutType === 'list') {
        mainAreaHTML = `
            <div class="main-area" id="xpContainer"></div>`;
    } else {
        mainAreaHTML = `
            <div class="main-area">
                <div class="sidebar">
                    <div class="sidebar-title">${sidebarTitle}</div>
                    <ul></ul>
                </div>
                <div class="content-pane" id="mainContent"></div>
            </div>`;
    }

    /* ---- Full Skeleton ---- */
    const html = `
        <div class="app-window">
            <div class="title-bar">
                <div class="title-bar-text">${title}</div>
                <div class="window-buttons"><span> </span><span> </span><span> </span></div>
            </div>
            <div class="menu-bar">
                ${MENU_ITEMS.map(m => `<span>${m}</span>`).join('')}
            </div>
            <div class="toolbar">
                ${toolbarHTML}
                ${qaHTML}
            </div>
            ${mainAreaHTML}
            <div class="status-bar">
                <span>${statusLeft}</span>
                <span>${statusRight}</span>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('afterbegin', html);

    /* ---- Referanslar ---- */
    return {
        appWindow:       document.querySelector('.app-window'),
        mainContent:     document.getElementById('mainContent'),
        xpContainer:     document.getElementById('xpContainer'),
        quickAccessList: document.getElementById('quickAccessList'),
        sidebar:         document.querySelector('.sidebar'),
        toolbar:         document.querySelector('.toolbar')
    };
}