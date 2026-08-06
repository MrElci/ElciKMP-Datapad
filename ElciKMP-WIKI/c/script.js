// script.js – Ortak fonksiyonlar (war, lightbox, map)

/* =============================================
   Minecraft Renk ve Biçim Kodlarını HTML'ye Çevirir
   ============================================= */
function applyMinecraftFormatting(text) {
    const colorMap = {
        '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
        '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
        '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
        'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF'
    };
    const styleMap = {
        'l': 'font-weight:bold;', 'o': 'font-style:italic;',
        'n': 'text-decoration:underline;', 'm': 'text-decoration:line-through;',
        'k': ''
    };

    let output = '';
    let i = 0;
    let spanStack = 0;

    function openSpan(style) {
        output += `<span style="${style}">`;
        spanStack++;
    }
    function closeSpans(count) {
        for (let j = 0; j < count; j++) output += '</span>';
        spanStack -= count;
    }

    while (i < text.length) {
        if (text[i] === '§' && i + 1 < text.length) {
            const code = text[i + 1];
            if (code === 'r') {
                if (spanStack > 0) closeSpans(spanStack);
                i += 2; continue;
            }
            if (colorMap.hasOwnProperty(code)) {
                openSpan(`color:${colorMap[code]};`);
                i += 2; continue;
            }
            if (styleMap.hasOwnProperty(code)) {
                const style = styleMap[code];
                if (style) openSpan(style);
                i += 2; continue;
            }
            i += 2; continue;
        }
        output += text[i];
        i++;
    }
    if (spanStack > 0) closeSpans(spanStack);
    return output;
}


/* =============================================
   Dosya Okuma Fonksiyonları (Oyuncular)
   ============================================= */
async function fetchPlayerFolders() {
    try {
        const res = await fetch('../players/playerList.txt', { cache: 'no-store' });
        if (!res.ok) throw new Error('playerList.txt bulunamadı');
        const text = await res.text();
        return text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function fetchPlayerInfo(folder) {
    try {
        const res = await fetch(`../players/${folder}/dat.txt`, { cache: 'no-store' });
        if (!res.ok) return null;
        const text = await res.text();
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) return null;
        return { folder, displayName: lines[0], mainFile: lines[1] };
    } catch { return null; }
}


/* =============================================
   Görsel Yolu Çözümleyici
   img.xxx.yyy -> ../img/xxx/yyy.png
   ============================================= */
function resolveImagePath(raw) {
    if (!raw || !raw.startsWith('img.')) return raw;
    const pathPart = raw.substring(4);
    const parts = pathPart.split('.');
    return '../img/' + parts.join('/') + '.png';
}


/* =============================================
   LIGHTBOX (Resimleri büyütme / indirme)
   ============================================= */
function enableImageLightbox(container) {
    // container içindeki tüm resimlere tıklama ekle (map, infobox, thumb)
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            let modal = document.getElementById('lightboxModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'lightboxModal';
                modal.className = 'lightbox-modal';
                modal.innerHTML = `
                    <span class="lightbox-close">&times;</span>
                    <img class="lightbox-content" id="lightboxImg" src="" alt="">
                    <a class="lightbox-download" id="lightboxDownload" href="" download>İndir</a>
                `;
                document.body.appendChild(modal);
                modal.querySelector('.lightbox-close').addEventListener('click', () => {
                    modal.classList.remove('active');
                });
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.classList.remove('active');
                });
            }
            const lightboxImg = document.getElementById('lightboxImg');
            const lightboxDownload = document.getElementById('lightboxDownload');
            lightboxImg.src = img.src;
            lightboxDownload.href = img.src;
            lightboxDownload.download = img.src.split('/').pop();
            modal.classList.add('active');
        });
    });
}


/* =============================================
   Ana Parse Fonksiyonu (map desteği ile)
   ============================================= */
function parseWikiText(raw) {
    const lines = raw.split('\n');
    let html = '';
    let infoboxHtml = '';
    let infoboxImages = [];
    let mapHtml = '';

    const cleanLines = [];
    for (let line of lines) cleanLines.push(line.trim());

    let startIndex = 0;
    let titleLine = cleanLines.length > 0 ? cleanLines[0] : '';
    let subtitleLine = cleanLines.length > 1 ? cleanLines[1] : '';

    if (titleLine) {
        let title = titleLine.replace(/<h1>/i, '').trim();
        title = applyMinecraftFormatting(title);
        html += `<h1 class="article-title">${title}</h1>`;
    }
    if (subtitleLine) {
        let subtitle = applyMinecraftFormatting(subtitleLine);
        html += `<div class="article-subtitle">${subtitle}</div>`;
    }
    startIndex = 2;

    function isSpecialTag(line) {
        const trimmed = line.trim();
        return trimmed.startsWith('<h1>') || trimmed.startsWith('<h2>') ||
               trimmed.startsWith('<tablo>') || trimmed.startsWith('<tablo /end>') ||
               trimmed.startsWith('<alıntı karesi>') || trimmed.startsWith('</alıntı karesi>') ||
               trimmed.startsWith('<açılır kapanır pencere>') || trimmed.startsWith('<img>') ||
               trimmed.startsWith('<map>');
    }

    let i = startIndex;
    while (i < cleanLines.length) {
        let line = cleanLines[i];
        if (line === '') { i++; continue; }

        // ---- <map> (harita) ----
        if (line.startsWith('<map>')) {
            const mapRaw = line.substring(5).trim();
            if (mapRaw.startsWith('img.')) {
                const mapSrc = resolveImagePath(mapRaw);
                mapHtml = `<div class="map-container">
                    <img src="${mapSrc}" alt="Harita">
                    <div class="map-caption">Savaş haritası (büyütmek için tıklayın)</div>
                </div>`;
            }
            i++; continue;
        }

        // ---- <img> (thumbnail) ----
        if (line.startsWith('<img>')) {
            const content = line.substring(5).trim();
            const parts = content.split('|').map(s => s.trim());
            const imgRaw = parts[0] || '';
            const caption = parts[1] || '';
            const imgSrc = resolveImagePath(imgRaw);
            html += `<div class="wiki-thumb"><img src="${imgSrc}" alt="${caption}">`;
            if (caption) {
                html += `<div class="thumb-caption">${applyMinecraftFormatting(caption)}</div>`;
            }
            html += `</div>`;
            i++; continue;
        }

        // ---- <h1> ----
        if (line.includes('<h1>')) {
            let title = line.replace(/<h1>/i, '').trim();
            title = applyMinecraftFormatting(title);
            html += `<h1 class="article-title">${title}</h1>`;
            i++;
            if (i < cleanLines.length && cleanLines[i].startsWith('§o')) {
                let subtitle = applyMinecraftFormatting(cleanLines[i]);
                html += `<div class="article-subtitle">${subtitle}</div>`;
                i++;
            }
            continue;
        }

        // ---- <h2> ----
        if (line.includes('<h2>')) {
            let title = line.replace(/<h2>/i, '').trim();
            title = applyMinecraftFormatting(title);
            html += `<h2>${title}</h2>`;
            i++; continue;
        }

        // ---- <tablo> ... <tablo /end> ----
        if (line.startsWith('<tablo>')) {
            i++;
            let infoboxRows = '';
            while (i < cleanLines.length && !cleanLines[i].startsWith('<tablo /end>')) {
                const row = cleanLines[i];
                if (row !== '') {
                    if (row.startsWith('img.') || row.includes('img.')) {
                        const imageParts = row.split('-').map(s => s.trim()).filter(s => s.startsWith('img.'));
                        if (imageParts.length > 0) {
                            const images = imageParts.map(p => resolveImagePath(p));
                            infoboxImages.push({ images });
                        }
                        i++; continue;
                    }
                    const match = row.match(/^\*(.+?)\*\s+(.+)/);
                    if (match) {
                        let value = match[2];
                        if (value.startsWith('img.')) {
                            infoboxImages.push({ images: [resolveImagePath(value)] });
                        } else {
                            infoboxRows += `<div class="infobox-row">
                                <span class="infobox-label">${match[1]}</span>
                                <span class="infobox-value">${value}</span>
                            </div>`;
                        }
                    }
                }
                i++;
            }
            infoboxHtml = `<div class="infobox">`;
            if (infoboxImages.length > 0) {
                infoboxHtml += `<div class="infobox-image">`;
                infoboxImages.forEach(imgGroup => {
                    if (imgGroup.images.length === 1) {
                        infoboxHtml += `<div class="image-row single"><img src="${imgGroup.images[0]}" alt=""></div>`;
                    } else {
                        infoboxHtml += `<div class="image-row multiple">`;
                        imgGroup.images.forEach(img => {
                            infoboxHtml += `<img src="${img}" alt="">`;
                        });
                        infoboxHtml += `</div>`;
                    }
                });
                infoboxHtml += `</div>`;
            } else {
                infoboxHtml += `<div class="infobox-image"><span>img</span></div>`;
            }
            infoboxHtml += infoboxRows + `</div>`;
            i++;
            continue;
        }

        // ---- <alıntı karesi> ----
        if (line.startsWith('<alıntı karesi>')) {
            i++;
            let quoteLines = [];
            while (i < cleanLines.length) {
                const nextLine = cleanLines[i];
                if (isSpecialTag(nextLine)) {
                    if (nextLine.startsWith('</alıntı karesi>')) i++;
                    break;
                }
                if (nextLine !== '') quoteLines.push(nextLine);
                i++;
            }
            let quoteText = quoteLines.join(' ');
            quoteText = applyMinecraftFormatting(quoteText);
            html += `<blockquote><p>${quoteText}</p></blockquote>`;
            continue;
        }

        // ---- <açılır kapanır pencere> ----
        if (line.startsWith('<açılır kapanır pencere>')) {
            let title = line.replace(/<açılır kapanır pencere>/i, '').trim();
            title = applyMinecraftFormatting(title);
            i++;
            let detailsContent = '';
            while (i < cleanLines.length) {
                const nextLine = cleanLines[i];
                if (nextLine.startsWith('<açılır kapanır pencere>') ||
                    nextLine.startsWith('<h2>') || nextLine.startsWith('<h1>') ||
                    nextLine.startsWith('<tablo>') || nextLine.startsWith('<alıntı karesi>') ||
                    nextLine.startsWith('<img>') || nextLine.startsWith('<map>')) break;
                if (nextLine !== '') {
                    if (nextLine.startsWith('<alıntı karesi>')) {
                        i++;
                        let innerQuote = [];
                        while (i < cleanLines.length) {
                            const innerLine = cleanLines[i];
                            if (isSpecialTag(innerLine)) {
                                if (innerLine.startsWith('</alıntı karesi>')) i++;
                                break;
                            }
                            if (innerLine !== '') innerQuote.push(innerLine);
                            i++;
                        }
                        let innerText = innerQuote.join(' ');
                        innerText = applyMinecraftFormatting(innerText);
                        detailsContent += `<blockquote><p>${innerText}</p></blockquote>`;
                        continue;
                    }
                    detailsContent += `<p>${applyMinecraftFormatting(nextLine)}</p>`;
                }
                i++;
            }
            html += `<details><summary>${title}</summary><div class="details-content">${detailsContent}</div></details>`;
            continue;
        }

        // ---- Normal paragraf ----
        html += `<p>${applyMinecraftFormatting(line)}</p>`;
        i++;
    }

    // Harita varsa en başa ekle (başlıktan sonra)
    if (mapHtml) {
        const h1Index = html.indexOf('<h1');
        if (h1Index !== -1) {
            const h1Close = html.indexOf('</h1>', h1Index);
            if (h1Close !== -1) {
                html = html.slice(0, h1Close + 5) + mapHtml + html.slice(h1Close + 5);
            } else {
                html = mapHtml + html;
            }
        } else {
            html = mapHtml + html;
        }
    }

    // Infobox'ı ilk h1'den sonra yerleştir
    if (infoboxHtml) {
        const h1Index = html.indexOf('<h1');
        if (h1Index !== -1) {
            const h1Close = html.indexOf('</h1>', h1Index);
            if (h1Close !== -1) {
                html = html.slice(0, h1Close + 5) + infoboxHtml + html.slice(h1Close + 5);
            } else {
                html = infoboxHtml + html;
            }
        } else {
            html = infoboxHtml + html;
        }
    }

    return html;
}


/* =============================================
   Oyuncu Sayfası İçeriğini Getir
   ============================================= */
async function loadPlayerPageContent(folder) {
    const info = await fetchPlayerInfo(folder);
    if (!info) throw new Error('Oyuncu bilgisi alınamadı.');
    const url = `../players/${folder}/all/${info.mainFile}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('İçerik dosyası bulunamadı.');
    const raw = await res.text();
    return parseWikiText(raw);
}


/* =============================================
   ÜLKE FONKSİYONLARI
   ============================================= */
async function fetchCountryFolders() {
    try {
        const res = await fetch('../countries/countryList.txt', { cache: 'no-store' });
        if (!res.ok) throw new Error('countryList.txt bulunamadı');
        const text = await res.text();
        return text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    } catch (err) { console.error(err); return []; }
}

async function fetchCountryInfo(folder) {
    try {
        const res = await fetch(`../countries/${folder}/dat.txt`, { cache: 'no-store' });
        if (!res.ok) return null;
        const text = await res.text();
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 3) return null;
        return {
            folder, displayName: lines[0], mainFile: lines[1],
            flagImage: lines[2] || '', countryClass: lines[3] || '',
            prevNext: lines[4] || ''
        };
    } catch { return null; }
}

async function getCountriesByClass(targetClass) {
    const folders = await fetchCountryFolders();
    const result = [];
    for (const folder of folders) {
        const info = await fetchCountryInfo(folder);
        if (info && info.countryClass === targetClass) result.push(info);
    }
    return result;
}

// script.js – (önceki tam script, sadece buildCountryGrid'de item-card yapısı)
// ... (önceki script.js içeriğiniz aynen, ama buildCountryGrid şöyle olacak:)

async function buildCountryGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const folders = await fetchCountryFolders();
    const countries = [];
    for (const folder of folders) {
        const info = await fetchCountryInfo(folder);
        if (info) countries.push(info);
    }
    countries.sort((a, b) => a.displayName.localeCompare(b.displayName, 'tr'));

    let html = '<div class="item-grid">';
    for (const c of countries) {
        const flagSrc = c.flagImage ? `../img/flag/${c.flagImage}` : '';
        html += `
            <a href="country.html?country=${encodeURIComponent(c.folder)}" class="item-card">
                ${flagSrc ? `<img src="${flagSrc}" alt="${c.displayName}">` : '<div style="width:64px;height:48px;background:#000;border:1px solid #444;"></div>'}
                <div class="item-name">${c.displayName}</div>
            </a>`;
    }
    html += '</div>';
    container.innerHTML = html;
}
// Aynı şekilde buildWarGrid içinde data-table kullanılabilir.
async function loadCountryPageContent(folder) {
    const info = await fetchCountryInfo(folder);
    if (!info) throw new Error('Ülke bilgisi alınamadı.');
    const url = `../countries/${folder}/all/${info.mainFile}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('İçerik dosyası bulunamadı.');
    const raw = await res.text();
    return parseWikiText(raw);
}


/* =============================================
   SAVAŞ (WAR) FONKSİYONLARI
   ============================================= */
async function fetchWarFolders() {
    try {
        const res = await fetch('../wars/warList.txt', { cache: 'no-store' });
        if (!res.ok) throw new Error('warList.txt bulunamadı');
        const text = await res.text();
        return text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    } catch (err) { console.error(err); return []; }
}

async function fetchWarInfo(folder) {
    try {
        const res = await fetch(`../wars/${folder}/dat.txt`, { cache: 'no-store' });
        if (!res.ok) return null;
        const text = await res.text();
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 5) return null;
        return {
            folder,
            displayName: lines[0],
            mainFile: lines[1],
            attackers: lines[2] ? lines[2].split('.') : [],
            defenders: lines[3] ? lines[3].split('.') : [],
            relatedEvents: lines[4] ? lines[4].split('.') : []
        };
    } catch { return null; }
}

async function buildWarGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const folders = await fetchWarFolders();
    const wars = [];
    for (const folder of folders) {
        const info = await fetchWarInfo(folder);
        if (info) wars.push(info);
    }
    wars.sort((a, b) => a.displayName.localeCompare(b.displayName));

    let html = '<table class="players-table"><thead><tr><th>Savaş Adı</th><th>Saldıran</th><th>Savunan</th></tr></thead><tbody>';
    wars.forEach(w => {
        html += `<tr>
            <td><a href="war.html?war=${encodeURIComponent(w.folder)}">${w.displayName}</a></td>
            <td>${w.attackers.join(', ')}</td>
            <td>${w.defenders.join(', ')}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}



async function loadWarPageContent(folder) {
    const info = await fetchWarInfo(folder);
    if (!info) throw new Error('Savaş bilgisi alınamadı.');
    const url = `../wars/${folder}/all/${info.mainFile}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('İçerik dosyası bulunamadı.');
    const raw = await res.text();
    return parseWikiText(raw);
}