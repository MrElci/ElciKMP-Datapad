// =============================================
// ELciKMP-DataPad – Tam Betik (v11.0 – <vid> desteği)
// =============================================

/* ---------- Minecraft Biçimlendirme ---------- */
function applyMinecraftFormatting(text) {
    const colorMap = {
        '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
        '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
        '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
        'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF'
    };
    const styleMap = {
        'l': 'font-weight:bold;', 'o': 'font-style:italic;',
        'n': 'text-decoration:underline;', 'm': 'text-decoration:line-through;'
    };

    let output = '', spanStack = 0;
    function openSpan(style) { output += `<span style="${style}">`; spanStack++; }
    function closeAll() { for (let j = 0; j < spanStack; j++) output += '</span>'; spanStack = 0; }

    for (let i = 0; i < text.length; i++) {
        if (text[i] === '§' && i + 1 < text.length) {
            const code = text[i + 1];
            if (code === 'r') { closeAll(); i++; continue; }
            if (colorMap[code]) { closeAll(); openSpan(`color:${colorMap[code]};`); i++; continue; }
            if (styleMap[code]) { openSpan(styleMap[code]); i++; continue; }
        }
        output += text[i];
    }
    closeAll();
    return output;
}

/* ---------- Görsel Yolu ---------- */
function resolveImagePath(raw) {
    if (!raw || !raw.startsWith('img.')) return raw;
    const parts = raw.substring(4).split('.');
    return '../img/' + parts.join('/') + '.png';
}

/* ---------- Video Yolu Çözümleyici ---------- */
function resolveVideoPath(raw) {
    if (!raw || !raw.startsWith('img.vid.')) return raw;
    const parts = raw.substring(4).split('.'); // "vid.xxx" -> ["vid","xxx"]
    return '../img/' + parts.join('/') + '.mp4';
}

/* ---------- Lightbox (resimler için) ---------- */
function enableImageLightbox(container) {
    container.querySelectorAll('img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            let modal = document.getElementById('lightboxModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'lightboxModal';
                modal.className = 'lightbox-modal';
                modal.innerHTML = `
                    <div class="lightbox-window">
                        <div class="lightbox-title-bar">
                            <span>img</span>
                            <span class="lightbox-close">✕</span>
                        </div>
                        <div class="lightbox-content-wrapper">
                            <img class="lightbox-content" id="lightboxImg" src="" alt="">
                        </div>
                        <a class="lightbox-download" id="lightboxDownload" href="" download>↓</a>
                    </div>`;
                document.body.appendChild(modal);
                modal.querySelector('.lightbox-close').onclick = () => modal.classList.remove('active');
                modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
            }
            document.getElementById('lightboxImg').src = img.src;
            const dl = document.getElementById('lightboxDownload');
            dl.href = img.src;
            dl.download = img.src.split('/').pop() || 'gorsel.png';
            modal.classList.add('active');
        });
    });
}

/* ---------- Video Modalı Aç ---------- */
function openVideoModal(src, title) {
    let modal = document.getElementById('videoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-window">
                <div class="video-title-bar">
                    <span>Video</span>
                    <span class="video-close">✕</span>
                </div>
                <div class="video-content-wrapper">
                    <video id="videoPlayer" controls></video>
                </div>
                <div class="video-controls">
                    <button id="videoBackward" title="10 saniye geri">-10s</button>
                    <button id="videoPlayPause" title="Oynat/Durdur">⏯</button>
                    <button id="videoForward" title="10 saniye ileri">+10s</button>
                    <button id="videoSpeedDown" title="Hızı azalt">-</button>
                    <span id="videoSpeedDisplay">1x</span>
                    <button id="videoSpeedUp" title="Hızı artır">+</button>
                    <a id="videoDownload" href="#" download>İndir</a>
                </div>
            </div>`;
        document.body.appendChild(modal);

        modal.querySelector('.video-close').onclick = () => modal.classList.remove('active');
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

        // Kontrol olayları
        const video = modal.querySelector('#videoPlayer');
        const playPauseBtn = modal.querySelector('#videoPlayPause');
        const backwardBtn = modal.querySelector('#videoBackward');
        const forwardBtn = modal.querySelector('#videoForward');
        const speedDownBtn = modal.querySelector('#videoSpeedDown');
        const speedUpBtn = modal.querySelector('#videoSpeedUp');
        const speedDisplay = modal.querySelector('#videoSpeedDisplay');

        playPauseBtn.addEventListener('click', () => {
            if (video.paused) video.play();
            else video.pause();
        });

        backwardBtn.addEventListener('click', () => {
            video.currentTime = Math.max(0, video.currentTime - 10);
        });

        forwardBtn.addEventListener('click', () => {
            video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 10);
        });

        speedDownBtn.addEventListener('click', () => {
            const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
            const idx = speeds.indexOf(video.playbackRate);
            if (idx > 0) {
                video.playbackRate = speeds[idx - 1];
                speedDisplay.textContent = video.playbackRate + 'x';
            }
        });

        speedUpBtn.addEventListener('click', () => {
            const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
            const idx = speeds.indexOf(video.playbackRate);
            if (idx !== -1 && idx < speeds.length - 1) {
                video.playbackRate = speeds[idx + 1];
                speedDisplay.textContent = video.playbackRate + 'x';
            }
        });

        video.addEventListener('play', () => playPauseBtn.textContent = '⏸');
        video.addEventListener('pause', () => playPauseBtn.textContent = '⏯');
    }

    const video = modal.querySelector('#videoPlayer');
    video.src = src;
    video.playbackRate = 1;
    modal.querySelector('#videoSpeedDisplay').textContent = '1x';
    modal.querySelector('#videoDownload').href = src;
    modal.querySelector('#videoTitle').textContent = title || 'Video';
    modal.classList.add('active');
    video.play();
}

/* ---------- Video Butonlarını Etkinleştir ---------- */
function enableVideoLinks(container) {
    container.querySelectorAll('.vid-button').forEach(btn => {
        btn.addEventListener('click', () => {
            openVideoModal(btn.dataset.src, btn.dataset.title);
        });
    });
}

/* ---------- Renk Kodu Bulucu ---------- */
function extractTitleColor(titleLine) {
    const match = titleLine.match(/§([0-9a-f])/);
    if (match) {
        const colorMap = {
            '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
            '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
            '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
            'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF'
        };
        return colorMap[match[1]] || '#2a3a5c';
    }
    return '#2a3a5c';
}

/* ---------- Bayrak Satırı Ayrıştırıcı ---------- */
function parseFlagLine(line) {
    if (!line || !line.startsWith('flag.img.')) return null;
    const rest = line.substring(5).trim();
    if (!rest) return null;
    const spaceIdx = rest.indexOf(' ');
    let imgPath, text;
    if (spaceIdx === -1) { imgPath = rest; text = ''; }
    else { imgPath = rest.substring(0, spaceIdx); text = rest.substring(spaceIdx + 1).trim(); }
    const src = resolveImagePath(imgPath);
    const flagHtml = src ? `<img src="${src}" class="war-flag-icon" alt="">` : '';
    return { flagHtml, text: text || '' };
}

/* ===========================================
   SAVAŞ BİLGİ KUTUSU PARSER
   =========================================== */
function parseWarInfobox(rawText, titleColor) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let html = `<table class="warinfobox"><tbody>`;
    let i = 0;

    if (i < lines.length) {
        const title = lines[i++];
        html += `<tr><th class="war-title" colspan="2" style="background-color:${titleColor};">${applyMinecraftFormatting(title)}</th></tr>`;
    }
    if (i < lines.length && lines[i].startsWith('"') && lines[i].endsWith('"')) {
        const subtitle = lines[i++].replace(/^"/, '').replace(/"$/, '');
        html += `<tr><td class="war-subtitle" colspan="2">${applyMinecraftFormatting(subtitle)}</td></tr>`;
    }
    if (i < lines.length && lines[i].startsWith('img.')) {
        const src = resolveImagePath(lines[i++]);
        html += `<tr><td class="war-image" colspan="2"><img src="${src}" alt=""></td></tr>`;
        if (i < lines.length && !lines[i].includes(':') && !lines[i].startsWith('§') && !lines[i].startsWith('flag.')) {
            html += `<tr><td class="war-image-caption" colspan="2">${applyMinecraftFormatting(lines[i++])}</td></tr>`;
        }
    }
    while (i < lines.length && lines[i].includes(':') && !lines[i].startsWith('§') && !lines[i].startsWith('flag.')) {
        const line = lines[i++];
        const idx = line.indexOf(':');
        const label = line.substring(0, idx).trim();
        const value = line.substring(idx + 1).trim();
        html += `<tr><td class="war-row-label">${applyMinecraftFormatting(label)}</td>
                     <td class="war-row-value">${applyMinecraftFormatting(value)}</td></tr>`;
    }

    while (i < lines.length) {
        const line = lines[i];
        if (line.includes('Cephesi') && line.endsWith(':')) {
            const theaterName = lines[i++].replace(':', '').trim();
            html += `<tr><td colspan="2" class="war-subsection"><div class="war-subsection-title">${applyMinecraftFormatting(theaterName)}</div>`;
            const result = parseTheaterBlock(lines, i);
            html += result.html;
            i = result.newIdx;
            html += `</td></tr>`;
            continue;
        }
        if (line.startsWith('§l')) {
            const sectionTitle = lines[i++].replace('§l', '').trim();
            html += `<tr><th class="war-section" colspan="2" style="background-color:${titleColor};">${applyMinecraftFormatting(sectionTitle)}</th></tr>`;
            const result = parseMainSection(lines, i);
            html += result.html;
            i = result.newIdx;
            continue;
        }
        break;
    }
    html += '</tbody></table>';
    return html;
}

function parseMainSection(lines, startIdx) {
    let html = '';
    let groups = [];
    let currentGroup = null;
    let i = startIdx;

    while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith('§l') || (line.includes('Cephesi') && line.endsWith(':'))) break;
        if (line === '') { i++; continue; }
        if (line === '-') { if (currentGroup) groups.push(currentGroup); currentGroup = null; i++; continue; }
        if (line.endsWith(':') && !line.startsWith('flag.')) {
            if (currentGroup) groups.push(currentGroup);
            currentGroup = { title: line.replace(':', '').trim(), items: [] };
            i++; continue;
        }
        if (line.startsWith('flag.')) {
            const parsed = parseFlagLine(line);
            if (!currentGroup) currentGroup = { title: '', items: [] };
            currentGroup.items.push({ flagHtml: parsed ? parsed.flagHtml : '', text: parsed ? parsed.text : line });
            i++; continue;
        }
        if (currentGroup) { currentGroup.items.push({ flagHtml: '', text: line }); }
        else { currentGroup = { title: '', items: [{ flagHtml: '', text: line }] }; }
        i++;
    }
    if (currentGroup) groups.push(currentGroup);

    if (groups.length > 0) {
        html += '<tr><td colspan="2"><div class="war-belligerents">';
        for (let g = 0; g < Math.min(groups.length, 2); g++) {
            html += '<div class="war-belligerent-col">';
            if (groups[g].title) html += `<div class="war-belligerent-title">${applyMinecraftFormatting(groups[g].title)}</div>`;
            groups[g].items.forEach(item => {
                html += `<div class="war-belligerent-item">${item.flagHtml} ${applyMinecraftFormatting(item.text)}</div>`;
            });
            html += '</div>';
        }
        html += '</div></td></tr>';
        for (let g = 2; g < groups.length; g++) {
            html += '<tr><td colspan="2"><div class="war-belligerent-col" style="border:none;">';
            if (groups[g].title) html += `<div class="war-belligerent-title">${applyMinecraftFormatting(groups[g].title)}</div>`;
            groups[g].items.forEach(item => {
                html += `<div class="war-belligerent-item">${item.flagHtml} ${applyMinecraftFormatting(item.text)}</div>`;
            });
            html += '</div></td></tr>';
        }
    }
    return { html, newIdx: i };
}

function parseTheaterBlock(lines, startIdx) {
    let html = '<div style="padding:6px;">';
    let i = startIdx;

    while (i < lines.length) {
        const line = lines[i];
        if ((line.includes('Cephesi') && line.endsWith(':')) || line.startsWith('§l')) break;
        if (line === '') { i++; continue; }
        if (line.startsWith('§l')) {
            const sectionTitle = lines[i++].replace('§l', '').trim();
            html += `<div class="war-belligerent-title" style="text-align:left; margin-top:4px;">${applyMinecraftFormatting(sectionTitle)}</div>`;
            while (i < lines.length) {
                const subLine = lines[i];
                if (subLine.startsWith('§l') || (subLine.includes('Cephesi') && subLine.endsWith(':')) || subLine === '') break;
                if (subLine === '-') { html += '<div style="margin: 4px 0; border-top: 1px dotted #555;"></div>'; i++; continue; }
                if (subLine.startsWith('flag.')) {
                    const parsed = parseFlagLine(subLine);
                    html += `<div class="war-belligerent-item">${parsed ? parsed.flagHtml : ''} ${applyMinecraftFormatting(parsed ? parsed.text : subLine)}</div>`;
                } else {
                    html += `<div class="war-belligerent-item">${applyMinecraftFormatting(subLine)}</div>`;
                }
                i++;
            }
            continue;
        }
        if (line.startsWith('flag.')) {
            const parsed = parseFlagLine(line);
            html += `<div class="war-belligerent-item">${parsed ? parsed.flagHtml : ''} ${applyMinecraftFormatting(parsed ? parsed.text : line)}</div>`;
        } else {
            html += `<div class="war-belligerent-item">${applyMinecraftFormatting(line)}</div>`;
        }
        i++;
    }
    html += '</div>';
    return { html, newIdx: i };
}

/* ===========================================
   ANA PARSE
   =========================================== */
function parseWikiText(raw) {
    const lines = raw.split('\n').map(l => l.trim());
    let html = '', infoboxHtml = '', mapHtml = '';
    let titleColor = '#2a3a5c';

    let idx = 0;
    if (idx < lines.length && !lines[idx].startsWith('<')) {
        titleColor = extractTitleColor(lines[idx]);
        html += `<h1 class="article-title">${applyMinecraftFormatting(lines[idx].replace(/<h1>/i, '').trim())}</h1>`;
        idx++;
    }
    if (idx < lines.length && lines[idx] && !lines[idx].startsWith('<') && !lines[idx].startsWith('§o')) {
        html += `<div class="article-subtitle">${applyMinecraftFormatting(lines[idx])}</div>`;
        idx++;
    }

    function isSpecialTag(l) {
        return l.startsWith('<h1>') || l.startsWith('<h2>') || l.startsWith('<h3>') ||
               l.startsWith('<tablo>') || l.startsWith('<tablowar>') || l.startsWith('<map>') ||
               l.startsWith('<img>') || l.startsWith('<alıntı') || l.startsWith('<açılır') ||
               l.startsWith('<krono>') || l.startsWith('<vid>') || l.startsWith('<randomfunfact>');
    }

    for (let i = idx; i < lines.length; i++) {
        const line = lines[i];
        if (line === '') continue;

        if (line.startsWith('<map>')) {
            const src = resolveImagePath(line.substring(5).trim());
            mapHtml = `<div class="map-container"><img src="${src}" alt="Harita"></div>`;
            continue;
        }

        if (line.startsWith('<img>')) {
            const content = line.substring(5).trim();
            let imgRaw, caption = '';
            const dashIndex = content.indexOf(' -.');
            if (dashIndex !== -1) {
                imgRaw = content.substring(0, dashIndex).trim();
                caption = content.substring(dashIndex + 3).trim();
            } else {
                const parts = content.split('|').map(s => s.trim());
                imgRaw = parts[0];
                caption = parts[1] || '';
            }
            const src = resolveImagePath(imgRaw);
            html += `<div class="wiki-thumb"><img src="${src}" alt="">`;
            if (caption) html += `<div class="thumb-caption">${applyMinecraftFormatting(caption)}</div>`;
            html += `</div>`;
            continue;
        }

        if (line.startsWith('<vid>')) {
            const content = line.substring(5).trim(); // "Açıklama | img.vid.xxx"
            let desc = '', videoRaw = '';
            const parts = content.split('|').map(s => s.trim());
            if (parts.length >= 2) {
                desc = parts[0];
                videoRaw = parts[1];
            } else {
                videoRaw = content;
            }
            const videoSrc = resolveVideoPath(videoRaw);
            html += `<button class="vid-button" data-src="${videoSrc}" data-title="${applyMinecraftFormatting(desc)}">▶ ${applyMinecraftFormatting(desc)}</button>`;
            continue;
        }

        if (line.includes('<h1>')) {
            html += `<h1 class="article-title">${applyMinecraftFormatting(line.replace(/<h1>/i, '').trim())}</h1>`;
            continue;
        }
        if (line.includes('<h2>')) {
            html += `<h2>${applyMinecraftFormatting(line.replace(/<h2>/i, '').trim())}</h2>`;
            continue;
        }
        if (line.includes('<h3>')) {
            html += `<h3>${applyMinecraftFormatting(line.replace(/<h3>/i, '').trim())}</h3>`;
            continue;
        }

        if (line.startsWith('<randomfunfact>')) {
            i++;
            let factText = '';
            if (i < lines.length) {
                factText = lines[i].replace(/^"/, '').replace(/"$/, '').trim();
                i++;
            }
            if (i < lines.length) {
                const closing = lines[i];
                let position = 'mid';
                if (closing.includes('.right')) position = 'right';
                else if (closing.includes('.left')) position = 'left';
                else if (closing.includes('.mid')) position = 'mid';
                i++;
                const cls = `rff-box rff-${position}`;
                html += `<div class="${cls}"><span class="rff-icon">ⓘ</span> <span>${applyMinecraftFormatting(factText)}</span></div>`;
            }
            continue;
        }

        if (line.startsWith('<tablo>')) {
            i++;
            let dataRows = '';
            let titleHtml = '';
            let subtitleHtml = '';
            let mediaRows = [];

            while (i < lines.length && !lines[i].startsWith('<tablo /end>')) {
                const row = lines[i];
                if (row === '') { i++; continue; }

                if (row.startsWith('§')) {
                    if (row.startsWith('§o')) {
                        subtitleHtml = applyMinecraftFormatting(row.replace('§o', '').trim());
                    } else {
                        titleHtml = applyMinecraftFormatting(row);
                    }
                    i++;
                    continue;
                }

                if (row.startsWith('img.') || row.includes('img.')) {
                    const colonIdx = row.indexOf(':');
                    let imgPart = row;
                    let labelPart = '';
                    if (colonIdx !== -1) {
                        imgPart = row.substring(0, colonIdx).trim();
                        labelPart = row.substring(colonIdx + 1).trim();
                    }

                    const imgTokens = imgPart.split('|').map(s => s.trim()).filter(s => s.startsWith('img.'));
                    const labelTokens = labelPart ? labelPart.split('|').map(s => s.trim()) : [];

                    const imgs = imgTokens.map((imgRaw, idx) => ({
                        src: resolveImagePath(imgRaw),
                        label: labelTokens[idx] || ''
                    }));

                    if (imgs.length === 1) {
                        mediaRows.push({ type: 'single', imgs });
                    } else if (imgs.length > 1) {
                        mediaRows.push({ type: 'multi', imgs });
                    }
                    i++;
                    continue;
                }

                const m = row.match(/^\*(.+?)\*\s+(.+)/);
                if (m) {
                    dataRows += `<div class="infobox-row"><span class="infobox-label">${m[1]}</span><span class="infobox-value">${m[2]}</span></div>`;
                }
                i++;
            }

            let ib = '<div class="infobox">';
            if (titleHtml) ib += `<div class="infobox-title">${titleHtml}</div>`;
            if (subtitleHtml) ib += `<div class="infobox-subtitle">${subtitleHtml}</div>`;

            mediaRows.forEach(mr => {
                if (mr.type === 'single') {
                    const img = mr.imgs[0];
                    ib += `<div class="infobox-map">
                        <img src="${img.src}" alt="${img.label}">
                        <span class="map-label">${img.label}</span>
                    </div>`;
                } else {
                    ib += '<div class="infobox-flags">';
                    mr.imgs.forEach(img => {
                        ib += `<div class="flag-box">
                            <img src="${img.src}" alt="${img.label}">
                            <span class="flag-label">${img.label}</span>
                        </div>`;
                    });
                    ib += '</div>';
                }
            });

            ib += dataRows + '</div>';
            infoboxHtml += ib;
            continue;
        }

        if (line.startsWith('<tablowar>')) {
            i++;
            let warRaw = '';
            while (i < lines.length && !lines[i].startsWith('<tablowar /end>')) {
                warRaw += lines[i] + '\n';
                i++;
            }
            infoboxHtml += parseWarInfobox(warRaw, titleColor);
            continue;
        }

        if (line.startsWith('<krono>')) {
            i++;
            let kronoItems = [];
            while (i < lines.length && !lines[i].startsWith('<krono /end>')) {
                const itemLine = lines[i];
                if (itemLine && itemLine !== '') {
                    const isStar = itemLine.endsWith('*');
                    const name = isStar ? itemLine.slice(0, -1).trim() : itemLine.trim();
                    kronoItems.push({ name, bold: isStar });
                }
                i++;
            }
            let kHTML = '<div class="krono-box">';
            kHTML += '<div class="krono-title">Kronoloji</div>';
            kHTML += '<ul class="krono-list">';
            kronoItems.forEach(item => {
                kHTML += `<li class="krono-item"><span class="krono-arrow">→</span><span class="krono-name ${item.bold ? 'krono-bold' : ''}">${applyMinecraftFormatting(item.name)}</span></li>`;
            });
            kHTML += '</ul></div>';
            infoboxHtml += kHTML;
            continue;
        }

        if (line.startsWith('<alıntı karesi>')) {
            i++;
            let quote = '';
            while (i < lines.length) {
                const nextLine = lines[i];
                if (nextLine === '<alıntı karesi /end>' || nextLine === '</alıntı karesi>') {
                    i++; break;
                }
                if (nextLine.startsWith('<h1>') || nextLine.startsWith('<h2>') || nextLine.startsWith('<h3>') ||
                    nextLine.startsWith('<tablo>') || nextLine.startsWith('<tablowar>') || nextLine.startsWith('<map>') ||
                    nextLine.startsWith('<img>') || nextLine.startsWith('<açılır') || nextLine.startsWith('<alıntı karesi>')) {
                    break;
                }
                if (nextLine !== '') quote += nextLine + ' ';
                i++;
            }
            html += `<blockquote><p>${applyMinecraftFormatting(quote.trim())}</p></blockquote>`;
            continue;
        }

        if (line.startsWith('<açılır')) {
            const title = applyMinecraftFormatting(line.replace(/<açılır kapanır pencere>/i, '').trim());
            i++;
            let det = '';
            while (i < lines.length) {
                const nextLine = lines[i];
                if (nextLine.startsWith('<h2>') || nextLine.startsWith('<h1>') || nextLine.startsWith('<h3>') ||
                    nextLine.startsWith('<tablo>') || nextLine.startsWith('<tablowar>') ||
                    nextLine.startsWith('<map>') || nextLine.startsWith('<img>') ||
                    nextLine.startsWith('<alıntı') || nextLine.startsWith('<açılır') || nextLine.startsWith('<use>')) {
                    break;
                }
                if (nextLine !== '') det += `<p>${applyMinecraftFormatting(nextLine)}</p>`;
                i++;
            }
            i--;
            html += `<details><summary>${title}</summary><div class="details-content">${det}</div></details>`;
            continue;
        }

        html += `<p>${applyMinecraftFormatting(line)}</p>`;
    }

    if (mapHtml) {
        const h1 = html.indexOf('<h1');
        if (h1 !== -1) {
            const close = html.indexOf('</h1>', h1);
            html = html.slice(0, close + 5) + mapHtml + html.slice(close + 5);
        } else html = mapHtml + html;
    }
    if (infoboxHtml) {
        const h1 = html.indexOf('<h1');
        if (h1 !== -1) {
            const close = html.indexOf('</h1>', h1);
            html = html.slice(0, close + 5) + infoboxHtml + html.slice(close + 5);
        } else html = infoboxHtml + html;
    }
    html = `<style>:root{--accent-color:${titleColor};--accent-glow:0 0 4px ${titleColor};}</style>` + html;
    return html;
}

/* ===========================================
   VERİ OKUMA
   =========================================== */
async function fetchList(path) {
    try {
        const res = await fetch(path, { cache: 'no-store' });
        if (!res.ok) throw new Error('Bulunamadı');
        return (await res.text()).split('\n').map(s => s.trim()).filter(s => s.length > 0);
    } catch (e) { console.error(e); return []; }
}

async function fetchDatInfo(folder, type) {
    const base = type === 'player' ? 'players' : type === 'country' ? 'countries' : 'wars';
    try {
        const res = await fetch(`../${base}/${folder}/dat.txt`, { cache: 'no-store' });
        if (!res.ok) return null;
        const text = await res.text();
        const allLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const classmans = allLines.filter(l => l.startsWith('>')).map(l => l.substring(1).split('.')).flat();
        const dataLines = allLines.filter(l => !l.startsWith('>'));
        if (dataLines.length < 2) return null;
        const info = { folder, displayName: dataLines[0], mainFile: dataLines[1], classmans };

        const previewLine = allLines.find(l => l.startsWith('*img.'));
        if (previewLine) {
            const match = previewLine.match(/^\*(img\..+)\|(.+)$/);
            if (match) {
                info.previewImage = resolveImagePath(match[1].trim());
                info.previewFile = match[2].trim();
            }
        }

        if (type === 'country' && dataLines.length >= 3) {
            if (!info.previewImage) info.flagImage = dataLines[2] || '';
            info.countryClass = dataLines[3] || '';
            info.prevNext = dataLines[4] || '';
        }
        if (type === 'war' && dataLines.length >= 5) {
            info.attackers = dataLines[2] ? dataLines[2].split('.') : [];
            info.defenders = dataLines[3] ? dataLines[3].split('.') : [];
            info.relatedEvents = dataLines[4] ? dataLines[4].split('.') : [];
        }
        return info;
    } catch { return null; }
}

async function fetchPlayerFolders() { return fetchList('../players/playerList.txt'); }
async function fetchCountryFolders() { return fetchList('../countries/countryList.txt'); }
async function fetchWarFolders() { return fetchList('../wars/warList.txt'); }
async function fetchPlayerInfo(f) { return fetchDatInfo(f, 'player'); }
async function fetchCountryInfo(f) { return fetchDatInfo(f, 'country'); }
async function fetchWarInfo(f) { return fetchDatInfo(f, 'war'); }

async function loadContent(folder, type) {
    const info = await fetchDatInfo(folder, type);
    if (!info) throw new Error('Bilgi alınamadı');
    const base = type === 'player' ? 'players' : type === 'country' ? 'countries' : 'wars';
    const res = await fetch(`../${base}/${folder}/all/${info.mainFile}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Dosya bulunamadı');
    return parseWikiText(await res.text());
}

const loadPlayerPageContent = f => loadContent(f, 'player');
const loadCountryPageContent = f => loadContent(f, 'country');
const loadWarPageContent = f => loadContent(f, 'war');

async function buildXPList(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let folders, infoFn, detailPageBase;
    if (type === 'player') {
        folders = await fetchPlayerFolders();
        infoFn = fetchPlayerInfo;
        detailPageBase = 'player.html?player=';
    } else if (type === 'country') {
        folders = await fetchCountryFolders();
        infoFn = fetchCountryInfo;
        detailPageBase = 'country.html?country=';
    } else if (type === 'war') {
        folders = await fetchWarFolders();
        infoFn = fetchWarInfo;
        detailPageBase = 'war.html?war=';
    }

    const items = [];
    for (const folder of folders) {
        const info = await infoFn(folder);
        if (info) items.push(info);
    }
    items.sort((a, b) => a.displayName.localeCompare(b.displayName, 'tr'));

    container.innerHTML = `
        <div class="xp-explorer">
            <div class="xp-tree">
                <div class="xp-tree-title">Klasörler</div>
                <div class="xp-tree-item active" data-type="${type}">
                    <span class="xp-tree-icon">»</span> ${type === 'player' ? 'Oyuncular' : type === 'country' ? 'Ülkeler' : 'Savaşlar'}
                </div>
            </div>
            <div class="xp-file-panel">
                <div class="xp-file-header">Ad</div>
                <ul class="xp-file-list" id="xpFileList"></ul>
            </div>
            <div class="xp-preview-pane" id="xpPreviewPane">
                <p style="color:#666;">Bir öğe seçin</p>
            </div>
        </div>
    `;

    const fileList = document.getElementById('xpFileList');
    const previewPane = document.getElementById('xpPreviewPane');

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'xp-file-item';
        li.dataset.index = index;
        let iconHtml = '';
        if (item.previewImage) {
            iconHtml = `<img src="${item.previewImage}" class="xp-file-icon" alt="">`;
        } else if (item.flagImage) {
            iconHtml = `<img src="../img/flag/${item.flagImage}" class="xp-file-icon" alt="">`;
        } else {
            iconHtml = `<span style="font-size:18px;">⌀</span>`;
        }
        li.innerHTML = `${iconHtml} ${item.displayName}`;
        li.addEventListener('click', () => selectItem(index));
        fileList.appendChild(li);
    });

    async function selectItem(index) {
        fileList.querySelectorAll('.xp-file-item').forEach(li => li.classList.remove('selected'));
        const selectedLi = fileList.querySelectorAll('.xp-file-item')[index];
        if (selectedLi) selectedLi.classList.add('selected');

        const item = items[index];
        if (!item) return;

        let previewHTML = '';
        if (item.previewImage) {
            previewHTML += `<img src="${item.previewImage}" class="xp-preview-image" alt="">`;
        } else if (item.flagImage) {
            previewHTML += `<img src="../img/flag/${item.flagImage}" class="xp-preview-image" alt="">`;
        }

        if (item.previewFile) {
            try {
                const base = type === 'player' ? 'players' : type === 'country' ? 'countries' : 'wars';
                const res = await fetch(`../${base}/${item.folder}/all/${item.previewFile}`, { cache: 'no-store' });
                if (res.ok) {
                    const text = await res.text();
                    previewHTML += `<div class="xp-preview-text">${text}</div>`;
                } else {
                    previewHTML += `<div class="xp-preview-text">Önizleme metni yüklenemedi.</div>`;
                }
            } catch (e) {
                previewHTML += `<div class="xp-preview-text">Hata: ${e.message}</div>`;
            }
        } else {
            previewHTML += `<div class="xp-preview-text"><strong>${item.displayName}</strong><br>`;
            if (type === 'country') previewHTML += `Sınıf: ${item.countryClass || '—'}`;
            if (type === 'war') previewHTML += `Saldıran: ${item.attackers.join(', ') || '—'}<br>Savunan: ${item.defenders.join(', ') || '—'}`;
            previewHTML += `</div>`;
        }

        previewHTML += `<p style="margin-top:12px;"><a href="${detailPageBase}${encodeURIComponent(item.folder)}">Wiki Sayfası</a></p>`;
        previewPane.innerHTML = previewHTML;
    }

    if (items.length > 0) selectItem(0);
}

async function buildCountryGrid(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const folders = await fetchCountryFolders();
    const items = (await Promise.all(folders.map(f => fetchCountryInfo(f)))).filter(Boolean);
    items.sort((a, b) => a.displayName.localeCompare(b.displayName, 'tr'));
    el.innerHTML = '<div class="item-grid">' + items.map(c => {
        const flag = c.flagImage ? `../img/flag/${c.flagImage}` : '';
        return `<a href="country.html?country=${encodeURIComponent(c.folder)}" class="item-card">
            ${flag ? `<img src="${flag}" alt="">` : '<div style="width:64px;height:48px;background:#000;border:1px solid #444;"></div>'}
            <div class="item-name">${c.displayName}</div></a>`;
    }).join('') + '</div>';
}

async function buildWarGrid(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const folders = await fetchWarFolders();
    const items = (await Promise.all(folders.map(f => fetchWarInfo(f)))).filter(Boolean);
    items.sort((a, b) => a.displayName.localeCompare(b.displayName));
    el.innerHTML = `<table class="players-table"><thead><tr><th>Savaş</th><th>Saldıran</th><th>Savunan</th></tr></thead><tbody>
        ${items.map(w => `<tr><td><a href="war.html?war=${encodeURIComponent(w.folder)}">${w.displayName}</a></td>
            <td>${w.attackers.join(', ')}</td><td>${w.defenders.join(', ')}</td></tr>`).join('')}
    </tbody></table>`;
}

async function getRelatedItemsByClassmans(classmans, excludeFolder) {
    if (!classmans.length) return [];
    const all = [];
    const add = async (folder, type) => {
        if (folder === excludeFolder) return;
        const info = await fetchDatInfo(folder, type);
        if (info && info.classmans.some(c => classmans.includes(c))) {
            all.push({ type, folder, displayName: info.displayName });
        }
    };
    for (const f of await fetchCountryFolders()) await add(f, 'country');
    for (const f of await fetchWarFolders()) await add(f, 'war');
    for (const f of await fetchPlayerFolders()) await add(f, 'player');
    return all;
}

function renderRelatedItems(items) {
    if (!items.length) return '';
    return `<div class="related-section"><h3>İlgili Makaleler</h3><ul class="related-links">${items.map(i => {
        const href = i.type === 'country' ? `country.html?country=${encodeURIComponent(i.folder)}` :
                     i.type === 'war' ? `war.html?war=${encodeURIComponent(i.folder)}` :
                     `player.html?player=${encodeURIComponent(i.folder)}`;
        return `<li><a href="${href}">${i.displayName} (${i.type})</a></li>`;
    }).join('')}</ul></div>`;
}

function buildQuickAccess() {
    const list = document.getElementById('quickAccessList');
    if (!list) return;
    list.innerHTML = '';
    const contentPane = document.querySelector('.content-pane');
    if (!contentPane) return;
    const headings = contentPane.querySelectorAll('h1, h2, h3');
    headings.forEach((heading, index) => {
        if (!heading.id) heading.id = `section-${index}`;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        if (heading.tagName === 'H2') li.style.paddingLeft = '15px';
        else if (heading.tagName === 'H3') li.style.paddingLeft = '30px';
        li.appendChild(a);
        li.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(heading.id).scrollIntoView({ behavior: 'smooth' });
        });
        list.appendChild(li);
    });
}

function applyAccentColor() {
    const h1 = document.querySelector('h1.article-title');
    if (!h1) return;
    let color = window.getComputedStyle(h1).color;
    const span = h1.querySelector('span');
    if (span) color = window.getComputedStyle(span).color;
    if (color) {
        document.documentElement.style.setProperty('--accent-color', color);
        document.documentElement.style.setProperty('--accent-glow', `0 0 4px ${color}`);
    }
}