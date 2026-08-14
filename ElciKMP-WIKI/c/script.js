// =============================================
// ELciKMP-DataPad – Tam Betik (v11.1 – Render Uyumlu)
// =============================================

/* ---------- Minecraft Biçimlendirme ---------- */
(function() {
  var favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/png';
  favicon.href = 'img/site/logo.png';

  var appleTouch = document.createElement('link');
  appleTouch.rel = 'apple-touch-icon';
  appleTouch.href = 'img/site/logo.png';

  document.head.appendChild(favicon);
  document.head.appendChild(appleTouch);
})();
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
    return 'img/' + parts.join('/') + '.png';
}

/* ---------- Video Yolu Çözümleyici ---------- */
function resolveVideoPath(raw) {
    if (!raw || !raw.startsWith('img.vid.')) return raw;
    const parts = raw.substring(4).split('.');
    return 'img/' + parts.join('/') + '.mp4';
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
                    <span id="videoTitle">Video</span>
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
            const content = line.substring(5).trim();
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
   VERİ OKUMA (Render uyumlu: ../ kaldırıldı)
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
        const res = await fetch(`${base}/${folder}/dat.txt`, { cache: 'no-store' });
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

async function fetchPlayerFolders() { return fetchList('players/playerList.txt'); }
async function fetchCountryFolders() { return fetchList('countries/countryList.txt'); }
async function fetchWarFolders() { return fetchList('wars/warList.txt'); }
async function fetchPlayerInfo(f) { return fetchDatInfo(f, 'player'); }
async function fetchCountryInfo(f) { return fetchDatInfo(f, 'country'); }
async function fetchWarInfo(f) { return fetchDatInfo(f, 'war'); }

async function loadContent(folder, type) {
    const info = await fetchDatInfo(folder, type);
    if (!info) throw new Error('Bilgi alınamadı');
    const base = type === 'player' ? 'players' : type === 'country' ? 'countries' : 'wars';
    const res = await fetch(`${base}/${folder}/all/${info.mainFile}`, { cache: 'no-store' });
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
            iconHtml = `<img src="img/flag/${item.flagImage}" class="xp-file-icon" alt="">`;
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
            previewHTML += `<img src="img/flag/${item.flagImage}" class="xp-preview-image" alt="">`;
        }

        if (item.previewFile) {
            try {
                const base = type === 'player' ? 'players' : type === 'country' ? 'countries' : 'wars';
                const res = await fetch(`${base}/${item.folder}/all/${item.previewFile}`, { cache: 'no-store' });
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
        const flag = c.flagImage ? `img/flag/${c.flagImage}` : '';
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
/* ===========================================
   CMD TERMİNAL SİSTEMİ (ELCIKMP DATAPAD)
   =========================================== */

async function fetchQA() {
    try {
        const res = await fetch('maintext/QA.txt', { cache: 'no-store' });
        if (!res.ok) throw new Error('QA.txt bulunamadı');
        return await res.text();
    } catch (e) {
        console.error(e);
        return '';
    }
}

function parseQAData(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const data = {
        maqs: [],
        reqs: []   // { command, response, admin }
    };
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        if (line.startsWith('<maq>')) {
            const question = line.substring(5).trim();
            i++;
            let answer = '';
            while (i < lines.length && !lines[i].startsWith('<maq/>')) {
                answer += lines[i] + '\n';
                i++;
            }
            i++; // skip <maq/>
            data.maqs.push({ question, answer: answer.trim() });
            continue;
        }

        if (line.startsWith('<REQ>')) {
            const command = line.substring(5).trim();
            i++;
            let response = '';
            let admin = false;
            while (i < lines.length && !lines[i].startsWith('<REQ/')) {
                response += lines[i] + '\n';
                i++;
            }
            if (i < lines.length && lines[i].startsWith('<REQ/')) {
                const closing = lines[i];
                admin = closing.includes('admin');
                i++; // skip <REQ/...>
            }
            data.reqs.push({ command, response: response.trim(), admin });
            continue;
        }
        i++;
    }
    return data;
}

const BOOT_TEXT = `
ELCIKMP - DATAPAD v4.00PG
Copyright (c) 2020-26, ElciKMP-DataPAD & the Sandeburg Legacy.
Firmware: KSI Foundation Build 1453 – "Ötüken's Ashes".
Patents: Zerdüşt Firewall, Göktürk Cache Coherency, WeakFatality-11 Immunity.

===============================================================================
CPU: Holy Sandeburg Empire – Pentium II MMX (Cenker's Forge Edition)
    Base Clock: 233 MHz (Overclockable to 266 MHz via Ragnarok Rune)
    L1 Cache: 16 KB (Legionary Cohort) ...................... [ PASSED ]
    L2 Cache: 256 KB (Praetorian – Alp Guard) ............... [ PASSED ]
    Microcode: MDS (Mongol Double-Spear) – patched by Sun Pala.
    FPU: Sasani Fire Co-Processor (Ahura Mazda v2.1) ........ [ ONLINE ]
    Thermal: 41°C – cooled by Siberian Permafrost (IBFI).

===============================================================================
RAM Test (Persepolis Memory Bank):
    Base Memory: 65,536 Drachmae (KSI Standard)
    Extended:   131,072 Drachmae (Sasani Treasury)
    Total:      196,608 KB – all Zerdüşt-certified.
    Shadow RAM: 64 KB (reserved for Oracle of Delphi – Uygar's visions).
    Conventional [0–640 KB] .................................. [ OK ]
    Upper [640–1024 KB] ...................................... [ OK ]
    XMS (Göktürk Steppe expansion) .......................... [ OK ]
    EMS (Xenian Punic banking) ............................... [ OK ]
    Cacheable ROM: mapped to Sun Pala archives.

===============================================================================
ROM BIOS Checksum: 0xDEADBEEF (EmiGrimes' signature) ......... [ PASSED ]
CMOS Battery: Nominal – powered by İnek Bayram's eternal flame.
System Date & Time (Gregorian / AUC / Byzantine):
    Current: 2026-08-14
    AUC (Ab Urbe Condita): 2779
    Byzantine Indiction: 5th cycle – "Era of the Seven Satraps".

>>> EASTER EGG – HISTORICAL CALENDAR TRIGGERS <<<
    If date == 15-MAR : "Beware the Ides of Göktürk!" – trigger Ötüken raid alarm.
    If date == 02-AUG : "Kudüs Savaşı anniversary" – load Persian steel drivers.
    If date == 29-MAY : "Fall of KSI" – display Theodosian wall screensaver.
    If date == 21-APR : "Foundation of İranshar" – show Cyrus cylinder animation.
    If date == 01-JAN : "New Consul of Floransa" – reset fiscal year.
    If date == 12-DEC : "Saturnalia of Ragnarok" – reverse byte order.
    If date == 17-DEC : "WeakFatality-11 outbreak" – enable anti‑virus quarantine.
    If date == 14-AUG : "Elci's birthday" – print "𐎠𐎼𐎫𐎠" in gold.

===============================================================================
IDE / SCSI Storage (Imperial Census of 2026):
    Primary Master   : NAZI ARASISTAN – "Blitzkrieg Granary" (6.4 GB)
        Cyl: 16383, Hd: 16, Sec: 63 – Cache: 256 KB (Gestapo buffer).
        Status: [ ONLINE ] – Mounted as C:\\ (Reichskanzlei)

    Primary Slave    : DEVLETI ALLIYE – "Sosyalist Silo" (2.1 GB)
        Punic War encryption disabled. Status: [ STANDBY ] (awaiting revolution).

    Secondary Master : GÖKTÜRK HOPLITE CD-ROM – "Kaan's Bow" (24x)
        Disk inserted: "Ötüken Chronicles – Director's Cut". [ READY ]

    Secondary Slave  : XENIAN FLOPPY – "Senatus Populusque" (720 KB)
        Augury: Unfavorable – no birds sighted. [ EMPTY ]

    SCSI Controller  : SASANI ROYAL ROAD (Achaemenid Bridge)
        Device 0: Hanging Gardens RAM-disk (2 GB) – [ ONLINE ]
        Device 1: Cyrus Cylinder Archive (Read‑Only) – [ MOUNTED ]

===============================================================================
PCI Local Bus (Via Appia – Sandeburg Edition):
    Bus 0, Dev 0: KSI NORTHBRIDGE – "Holy Forge"
        Rev: 0x02, AGP 4x (Ragnarok charge rate). Bandwidth: 1.06 GB/s.

    Bus 0, Dev 1: SOUTHBRIDGE – "Athenian Agora (Lourxz' design)"
        PIIX4E – Pericles Integrated I/O.
        USB 1.1: Centurion – [ DISABLED (security risk) ]
        SMBus: monitoring grain tributes.

    Bus 1, Dev 0: PUNIC WAR GRAPHICS – "Hannibal's Elephants" (4 MB SGRAM)
        IRQ: 11, I/O: 0xE000, Mem: 0xA0000.
        VESA 2.0 – Max res: 1024x768 (Roman Mosaic, Uygar edition).

    Bus 1, Dev 1: HOPLITE AUDIO – "AC'97 (Spartan Phalanx)"
        IRQ: 5, DMA: 1 – loaded with Greek tragedy samples.
        Surround: Colosseum ambience.

    Bus 2, Dev 0: AQUEDUCT LAN – "Legionary NIC" (10/100 Mbps)
        IRQ: 10, MAC: 00-AA-BB-CC-DD-EE (Forge of Vulcan).
        PXE: Disabled – barbarians at the gate.

    Bus 2, Dev 1: GOTHIC INVASION FIREWALL – "Visigothic Filter"
        State: [ ARMING ] – blocks all packets from 476 AD (Fall of Rome).

===============================================================================
System Memory Map (City Planning – İsfahan Model):
    0x00000000 – 0x0009FFFF : Plebeian District (DOS compatibility)
    0x000A0000 – 0x000BFFFF : VGA Frame Buffer (Senatorial Forums)
    0x000C0000 – 0x000C7FFF : Video ROM (Cyclops' eye)
    0x000C8000 – 0x000DFFFF : Option ROMs (Provincial outposts)
    0x000E0000 – 0x000FFFFF : BIOS Shadow (Vestal scrolls)
    0x00100000 – 0x0FFFFFFF : Barbarian territories (free men)
    0x10000000 – 0xFFFFFFFF : PCI/ISA MMI/O (Imperial palaces)

===============================================================================
Interrupt Request (IRQ) – Senatorial Seats:
    IRQ 0  : System Timer (Sundial of Augustus) ............ [ OK ]
    IRQ 1  : Keyboard (Stylus & wax tablet) ................ [ OK ]
    IRQ 2  : Cascade (Tribune of the Plebs) ................ [ OK ]
    IRQ 3  : COM2 – Pigeon Post ............................. [ OK ]
    IRQ 4  : COM1 – Carrier Pigeon .......................... [ OK ]
    IRQ 5  : Hoplite Sound .................................. [ OK ]
    IRQ 6  : Floppy – Etruscan rites ........................ [ OK ]
    IRQ 7  : LPT1 – Scroll Printer .......................... [ OK ]
    IRQ 8  : RTC – Clepsydra water clock .................... [ OK ]
    IRQ 9  : ACPI / SCI – Oracle's vision ................... [ OK ]
    IRQ 10 : Aqueduct LAN ................................... [ OK ]
    IRQ 11 : Punic War VGA .................................. [ OK ]
    IRQ 12 : PS/2 Mouse – Roman Dodecahedron ................ [ OK ]
    IRQ 13 : FPU – Greek Fire Co‑Processor .................. [ OK ]
    IRQ 14 : Primary IDE – Nazi Arasistan ................... [ OK ]
    IRQ 15 : Secondary IDE – Göktürk CD ..................... [ OK ]

===============================================================================
DMA Channels (Slaves of the State):
    Ch 0 : Memory refresh (Aqueduct maintenance) ............ [ OK ]
    Ch 1 : Sound – Hoplite DMA .............................. [ OK ]
    Ch 2 : Floppy – Etruscan divination ..................... [ OK ]
    Ch 3 : LPT1 – Senate decrees ............................ [ OK ]
    Ch 4 : Cascade – Proconsul .............................. [ OK ]
    Ch 5 : Reserved – Triumph processions ................... [ OK ]
    Ch 6 : Reserved – Gladiatorial combats .................. [ OK ]
    Ch 7 : Reserved – Chariot races ......................... [ OK ]

===============================================================================
MS-DOS 7.1 (Modus Operandi – Legions of DOS) Loader:
    Checking boot sector (Codex Justinianus) ................ [ PASSED ]
    System files from the Library of Celsus:
        KAĞAN.SYS    (IO.SYS) .............................. [ LOADED ]
        SHAH.SYS     (MSDOS.SYS) ........................... [ LOADED ]
        EMIR.COM     (COMMAND.COM) ......................... [ LOADED ]
        ZERDÜST.SYS  (HIMEM.SYS) ........................... [ LOADED ]
        AHURA.EXE    (EMM386.EXE) .......................... [ LOADED ]
        DBLSPACE.BIN (Carthaginian encryption – disabled)

    Parsing CONFIG.SYS (Twelve Tables of Law):
        DEVICE=C:\\WINDOWS\\SETVER.EXE ...................... [ EXECUTED ]
        DEVICE=C:\\DOS\\ANSI.SYS (Greek polytonic) .......... [ LOADED ]
        DEVICE=C:\\DOS\\DISPLAY.SYS CON=(EGA,437) ........... [ LOADED ]
        COUNTRY=039,850,C:\\DOS\\COUNTRY.SYS – Roman province.
        SHELL=C:\\EMIR.COM C:\\ /P /E:4096 – Senate decree.

    Creating virtual drives (Colonies):
        RAMDRIVE.SYS – 2 MB from Treasury of Delphi.
        Mounting D:\\ as "PROVINCIA_GALLIA".
        Mounting E:\\ as "PROVINCIA_AEGYPTUS" (Tameris).

===============================================================================
AUTOEXEC.BAT (Consular Orders – Elci's script):
    C:\\> ECHO OFF
    C:\\> PROMPT $P$G (Legionary standard)
    C:\\> PATH=C:\\;C:\\DOS;C:\\WINDOWS;C:\\TOOLS (Roman roads)
    C:\\> SET TEMP=C:\\TEMP (Temporary camp)
    C:\\> SET TMP=C:\\TEMP
    C:\\> SET COMSPEC=C:\\EMIR.COM
    C:\\> SET BLASTER=A220 I5 D1 H5 P330 T3 (Hoplite tune)
    C:\\> SET DIRCMD=/O:GEN (organise by generational cohorts)
    C:\\> DOSKEY /INSERT (Tacitus buffer) .................. [ LOADED ]
    C:\\> LH C:\\DOS\\MSCDEX.EXE /D:MSCD001 (Spartan CD) .... [ LOADED ]
    C:\\> LH C:\\DOS\\SMARTDRV.EXE /X (Roman census caching) [ LOADED ]
    C:\\> LH C:\\WINDOWS\\MOUSE.COM (Dodecahedron stylus) ... [ LOADED ]

===============================================================================
Loading Legionary Device Drivers (Auxiliaries – from Elci's kernel):
    SASSANID.SYS    (Persian fire – disk caching) ......... [ ACTIVE ]
    GOKTURK.SYS     (Steppe cavalry – network burst) ...... [ ACTIVE ]
    RAGNAROK.SYS    (Northern wolf – thermal management) .. [ ACTIVE ]
    DARKLOIG.SYS    (Collectivist – null device) .......... [ ACTIVE ]
    XP.SYS          (Xian – high‑speed DMA) ............... [ ACTIVE ]
    SUNPALA.SYS     (Great Wall – firewall extension) ..... [ ACTIVE ]
    IBFI.SYS        (Russian steppe – random number gen) .. [ ACTIVE ]
    FLORANSA.SYS    (Italian renaissance – GUI fallback) .. [ ACTIVE ]
    CATAPULT.SYS    (Siege engine – packet thrower) ....... [ ACTIVE ]
    TRIREME.SYS     (Naval stack – TCP/IP over galleys) ... [ ACTIVE ]

===============================================================================
Network Stack & Protocols (Roman Roads & Smoke Signals):
    Initializing TCP/IP via Milvian Bridge:
        DHCP request to Oracle of Delphi ...
        Response: "Know thyself" – IP: 192.168.1.10
        Mask: 255.255.255.0 (Praetorian perimeter)
        Gateway: 192.168.1.1 (Pons Sublicius)

    Binding protocols to Aqueduct NIC:
        IPX/SPX  (Inter‑Provincial Exchange) ............... [ BOUND ]
        NetBEUI  (Barbarian tribal NetBIOS) ................ [ BOUND ]
        Silk Road Protocol (SRP) ............................ [ ONLINE ]
        Red Cross Messaging (RCM) ........................... [ ONLINE ]

    Mounting SMB shares:
        \\\\KSI\\HOLY_GOTHBURG (Read‑only – KSI archives)
        \\\\RAGNAROK\\KANADA_COLONY (Disconnected – rebellion)

===============================================================================
Virtual Memory & Paging (Treasury Reserves):
    Allocating 256 MB paging file: C:\\PAGEFILE.SYS
    Memory blocks:
        0xFFFF0000 – 0xFFFFFFFF : Imperial Guard reserved.
        Kernel stack: 8192 Denarii (bytes).
        User stack:   4096 Denarii.
    Heap manager: Augustus – first‑fit algorithm.

===============================================================================
Plug and Play (Pax Romana) Auto‑Configuration:
    ISA legacy devices:
        Sound Blaster Pro – I/O 220, IRQ 5, DMA 1, HDMA 5.
        Joystick (Chariot controller) – I/O 201 [ NOT DETECTED ]
        MIDI (Lyre synthesizer) – I/O 330 [ DETECTED ]

    Peripheral Autodetect (Centurion scouts):
        Keyboard: PS/2 (Latin with macrons)
        Mouse: Serial (Roman Dodecahedron – 3 buttons)
        USB Mass Storage: Aegyptian obelisk flash – [ MOUNTED AS F: ]

===============================================================================
Deep Calendar Scan – Easter Egg Overdrive:
    Julian default, Gregorian bypass.
    Epoch drift since 1 AUC (753 BC) – recalculating...
    Zodiac alignment (Roman constellations) – loaded.
    If today == 15-MAR : "Et tu, Brute?" shutdown timer (60s).
    If today == 21-APR : Palatine Hill background image.
    If today == 01-MAY : Floralia – floral screensaver.
    If today == 21-JUN : Summer solstice – fan speed ++.
    If today == 01-AUG : Ara Pacis – defrag memory.
    If today == 02-SEP : Actium victory – naval fanfare.
    If today == 13-NOV : Festival of Jupiter – boost cache.
    If today == 17-DEC : Saturnalia – reverse endianness.

    Byzantine Indiction check:
        Current cycle: 5 (15‑year tax).
        Solar cycle: 11, Lunar: 8.
        Computus – Easter Sunday (Dionysius Exiguus): 2026‑04‑05.
        Loading Easter egg basket driver.

    Y2K38 (2038 problem) simulation:
        32‑bit time_t overflow on 19 Jan 2038, 03:14:07 UTC.
        Solution: migrate to 64‑bit Consular timekeeping.

===============================================================================
Graphics & Sound Subsystem Finalization:
    VBE 2.0 – Mode 0x118 (1024x768x16M – Roman Fresco).
    Gamma: 1.0 (natural marble lighting).
    Equalizer: Colosseum Surround (acoustic amphitheatre).
    Fonts: Latin Extended, Greek, Coptic, Runic.
    Palette: Tyrian purple and golden eagle motifs.

===============================================================================
File System Integrity Check (Censorship by the Senate):
    Scanning C:\\ (Nazi Arasistan) for lost fragments...
        Found 3 fragmented scrolls – defragmenting...
        Moving files to contiguous Roman roads...
        Rebuilding FAT32 (Palatine registry).
        Root directory: 512 entries (501 free).
    Scanning D:\\ (Gallic Province) for corrupted data...
        Gallic wars intact – Vercingetorix quarantined.
    Scanning E:\\ (Tameris) – verifying pyramid metadata ... [ OK ]

===============================================================================
Final Bootstrapping Sequence (Triumph Parade):
    Applying registry hives (Senate decrees) ...
    Loading user profile "CAESAR" (Administrator).
    Starting Windows GUI (optional) – bypassed for CLI.
    Starting DOS Shell (EMIR.COM).

    System initialization progress:
    ████████████████████████████████████████████████████ 100%

    All systems nominal. Pax Romana established.

    ==================================================
    ELCIKMP - DATAPAD v4.00PG
    Boot completed at: 14-Aug-2026 09:32:15 (AUC 2779)
    ==================================================

    Warning: The following outposts are offline:
        - Parthian Provinces (network timeout)
        - Britannia Hadrian's Wall (sector read error)
        - Sun Pala outpost – awaiting diplomatic resolution.
        Type "HELP" to display commands.

`;

/* Yardımcı: terminale typewriter satır yaz */
async function typewriterLine(terminal, text, speed = 1) {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'line';
    terminal.appendChild(lineDiv);
    terminal.scrollTop = terminal.scrollHeight;

    for (let char of text) {
        lineDiv.textContent += char;
        await new Promise(r => setTimeout(r, speed));
        terminal.scrollTop = terminal.scrollHeight;
    }
    return lineDiv;
}

/* Yardımcı: bloklu progress bar çiz ve doldur */
async function drawBlockBar(terminal, speed = 300) {
    const barLine = document.createElement('div');
    barLine.className = 'progress-line';
    terminal.appendChild(barLine);
    terminal.scrollTop = terminal.scrollHeight;

    const barSpan = document.createElement('span');
    barSpan.className = 'block-bar';
    barLine.appendChild(barSpan);

    const label = document.createElement('span');
    label.className = 'progress-label';
    barLine.appendChild(label);

    const totalBlocks = 10;
    const target = 100;
    for (let i = 0; i <= target; i++) {
        const filled = Math.round((i / target) * totalBlocks);
        barSpan.textContent = '▨'.repeat(filled) + '▩'.repeat(totalBlocks - filled);
        label.textContent = `${i}%`;
        await new Promise(r => setTimeout(r, speed / target));
        terminal.scrollTop = terminal.scrollHeight;
    }
}

/* Bilgisayar düşünme animasyonu */
async function showThinking(terminal) {
    const thinkDiv = document.createElement('div');
    thinkDiv.className = 'line';
    terminal.appendChild(thinkDiv);
    terminal.scrollTop = terminal.scrollHeight;

    const base = 'Düşünüyor';
    for (let i = 0; i < 4; i++) {
        thinkDiv.textContent = base + '.'.repeat(i % 4);
        await new Promise(r => setTimeout(r, 300));
        terminal.scrollTop = terminal.scrollHeight;
    }
    thinkDiv.textContent = '';
}

/* Aşamaları uygula */
async function applyAdminPhases() {
    const crtScreen = document.getElementById('crtScreen');
    const body = document.body;

    // T1: Flicker
    crtScreen.classList.add('phase-flicker');
    body.classList.add('red-theme');
    spawnRedParticles(20);
    await new Promise(r => setTimeout(r, 1000));
    crtScreen.classList.remove('phase-flicker');

    // T2: Karakter bozulması
    crtScreen.classList.add('phase-garble');
    await new Promise(r => setTimeout(r, 2000));
    crtScreen.classList.remove('phase-garble');

    // T3: UI parçalanması
    crtScreen.classList.add('phase-shatter');
    await new Promise(r => setTimeout(r, 2000));
    crtScreen.classList.remove('phase-shatter');

    // T4: Neredeyse okunmaz
    crtScreen.classList.add('phase-unreadable');
}

function spawnRedParticles(count) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (2 + Math.random() * 3) + 's';
        p.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 5000);
    }
}

function startAdminQuake() {
    const glitchBand = document.getElementById('glitchBand');
    glitchBand.classList.add('active');
}

function stopAdminQuake() {
    const glitchBand = document.getElementById('glitchBand');
    glitchBand.classList.remove('active');
}

function startAdminFiles() {
    const mamiRadar = document.getElementById('mamiRadar');
    const adminPanel = document.getElementById('adminPanel');
    mamiRadar.classList.add('active');
    adminPanel.classList.add('active');
    const tree = document.getElementById('adminFileTree');
    tree.innerHTML = `
        <div class="file-node open">
            <span class="folder">📁 c</span>
            <div class="children">
                <div class="file-node"><span class="file">📄 index.html</span></div>
                <div class="file-node"><span class="file">📄 cmd.html</span></div>
                <div class="file-node"><span class="file">📄 players.html</span></div>
                <div class="file-node"><span class="file">📄 countries.html</span></div>
                <div class="file-node"><span class="file">📄 wars.html</span></div>
                <div class="file-node open">
                    <span class="folder">📁 players</span>
                    <div class="children">
                        <div class="file-node"><span class="file">📄 playerList.txt</span></div>
                    </div>
                </div>
                <div class="file-node open">
                    <span class="folder">📁 countries</span>
                    <div class="children">
                        <div class="file-node"><span class="file">📄 countryList.txt</span></div>
                    </div>
                </div>
                <div class="file-node open">
                    <span class="folder">📁 img</span>
                    <div class="children">
                        <div class="file-node"><span class="file">📄 site</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    tree.querySelectorAll('.folder').forEach(folder => {
        folder.addEventListener('click', () => {
            folder.parentElement.classList.toggle('open');
        });
    });
}

function stopAdminFiles() {
    document.getElementById('mamiRadar').classList.remove('active');
    document.getElementById('adminPanel').classList.remove('active');
}

async function initCmdPage() {
    const terminal = document.getElementById('terminalOutput');
    const commandLine = document.getElementById('commandLine');
    const commandInput = document.getElementById('commandInput');
    const qButton = document.getElementById('questionMarkBtn');
    const maqPanel = document.getElementById('maqPanel');
    const clockEl = document.getElementById('clock');
    const skipBtn = document.getElementById('skipBtn');

    if (!terminal || !commandLine || !commandInput) return;

    const skipRequested = { value: false };
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            skipRequested.value = true;
            skipBtn.style.display = 'none';
        });
    }

    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('tr-TR', { hour12: false });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Boot metnini satır satır işle
    const bootLines = BOOT_TEXT.split('\n');
    for (const line of bootLines) {
        if (skipRequested.value) break;
        await typewriterLine(terminal, line, 1);
        if (/\[.*\]/.test(line)) {
            await drawBlockBar(terminal, 300);
        }
    }

    if (skipBtn) skipBtn.style.display = 'none';

    commandLine.style.display = 'flex';
    commandInput.focus();

    const qaText = await fetchQA();
    const data = parseQAData(qaText);

    if (data.maqs.length > 0) {
        maqPanel.innerHTML = '';
        data.maqs.forEach((maq, index) => {
            const item = document.createElement('div');
            item.className = 'maq-item';
            item.innerHTML = `<span class="q-symbol">[?]</span> ${maq.question}`;
            item.addEventListener('click', async () => {
                await showThinking(terminal);
                await typewriterLine(terminal, '> ' + maq.question, 10);
                for (const ansLine of maq.answer.split('\n')) {
                    await typewriterLine(terminal, ansLine, 10);
                }
                commandInput.focus();
            });
            maqPanel.appendChild(item);
        });
    } else {
        maqPanel.innerHTML = '<div class="line">Soru bulunamadı.</div>';
    }

    qButton.addEventListener('click', () => {
        maqPanel.classList.toggle('visible');
    });

    let waitingForYN = false;
    let ynResolver = null;

    commandInput.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();

        const input = commandInput.textContent.trim();
        commandInput.textContent = '';

        // Y/N bekleniyorsa bunu işle
        if (waitingForYN) {
            if (input.toUpperCase() === 'Y' || input.toUpperCase() === 'N') {
                waitingForYN = false;
                commandInput.focus();
                if (ynResolver) ynResolver(input.toUpperCase());
            } else {
                await typewriterLine(terminal, 'Lütfen Y veya N girin.', 10);
                commandInput.focus();
            }
            return;
        }

        const cmdLine = document.createElement('div');
        cmdLine.className = 'line';
        terminal.appendChild(cmdLine);
        cmdLine.textContent = 'C:\\> ' + input;
        terminal.scrollTop = terminal.scrollHeight;

        const upperCmd = input.toUpperCase();

        if (upperCmd === 'HELP') {
            const helpLines = [
                'Mevcut komutlar:',
                '  HELP          - bu yardım listesini gösterir',
                '  CLS           - ekranı temizler',
                '  VER           - sürüm bilgisini gösterir',
                '  EXIT          - ana siteye döner'
            ];
            const publicReqs = data.reqs.filter(r => !r.admin);
            publicReqs.forEach(r => {
                helpLines.push('  ' + r.command.padEnd(12) + ' - özel komut');
            });
            for (const line of helpLines) {
                await typewriterLine(terminal, line, 10);
            }
        } else if (upperCmd === 'CLS') {
            terminal.innerHTML = '';
        } else if (upperCmd === 'VER') {
            await typewriterLine(terminal, 'ELCIKMP - DATAPAD v4.00PG', 10);
        } else if (upperCmd === 'EXIT') {
            window.location.href = 'index.html';
        } else if (upperCmd === 'GOD IS DEAD') {
            // Bozulma aşamalarını başlat
            await applyAdminPhases();
            startAdminQuake();

            await showThinking(terminal);
            await typewriterLine(terminal, '> Tekrar hoşgeldiniz admin. Dosyaları görmek ister misiniz ........ Y/N?', 10);
            commandInput.focus();

            // Y/N bekle
            waitingForYN = true;
            const answer = await new Promise(resolve => { ynResolver = resolve; });
            ynResolver = null;

            if (answer === 'Y') {
                stopAdminQuake();
                document.getElementById('crtScreen').classList.remove('phase-unreadable');
                document.body.classList.remove('red-theme');
                startAdminFiles();
                await typewriterLine(terminal, 'Dosyalar yüklendi. Hoşgeldin admin.', 10);
            } else {
                stopAdminQuake();
                document.getElementById('crtScreen').classList.remove('phase-unreadable');
                document.body.classList.remove('red-theme');
                await typewriterLine(terminal, 'Erişim iptal edildi. Sistem normale döndü.', 10);
            }
        } else {
            const req = data.reqs.find(r => r.command === input);
            if (req) {
                await showThinking(terminal);
                for (const line of req.response.split('\n')) {
                    await typewriterLine(terminal, line, 10);
                }
            } else {
                const maq = data.maqs.find(m => m.question.toLowerCase() === input.toLowerCase());
                if (maq) {
                    await showThinking(terminal);
                    for (const ansLine of maq.answer.split('\n')) {
                        await typewriterLine(terminal, ansLine, 10);
                    }
                } else {
                    await typewriterLine(terminal, 'Bilinmeyen komut. HELP yazın.', 10);
                }
            }
        }

        commandInput.focus();
        terminal.scrollTop = terminal.scrollHeight;
    });
}
