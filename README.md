
# ElciKMP-Datapad — README

> A community-driven archive of Minecraft server history, presented as a retro CRT terminal and Wikipedia-style knowledge base.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Features](#2-features)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [Content Format Reference (dat.txt)](#5-content-format-reference-dattxt)
6. [Custom Syntax Reference (all/*.txt)](#6-custom-syntax-reference-alltxt)
7. [HyperGlossary (hg.txt)](#7-hyperglossary-hgtxt)
8. [Sources & References (srcr)](#8-sources--references-srcr)
9. [Theme System](#9-theme-system)
10. [Terminal (cmd.html) & Admin Panel](#10-terminal-cmdhtml--admin-panel)
11. [Mobile Experience](#11-mobile-experience)
12. [Deployment](#12-deployment)
13. [Contributing](#13-contributing)
14. [Credits](#14-credits)
15. [License](#15-license)

---

## 1. Overview

ElciKMP-DataPad is a static, client-side wiki and archive documenting the history of a Minecraft server community. It reproduces the feel of a legacy computer terminal while offering a fully-featured knowledge base with:

- Player, country, war, and event articles
- Rich article syntax written in plain `.txt` files
- Automatic cross-referencing through a HyperGlossary system
- Retro CRT terminal for browsing "requests" and easter eggs
- Multi-theme engine (GitHub Dark, Half-Life, Windows XP, Matrix, etc.)

Everything runs in the browser without a backend — content is loaded directly from text files, making the archive portable, git-friendly, and easy to maintain.

---

## 2. Features

### Content Management
- **Folder-based organization** — every player, country, war, or event is its own directory.
- **Plain text storage** (`dat.txt` + `all/*.txt`) — no database, no build step.
- **Classman system** — tag articles to automatically link related content.
- **HyperGlossary** — auto-link recurring terms with hover previews.
- **Source/Reference badges** — inline citations with image + click-to-scroll.

### User Interface
- CRT terminal aesthetic with scanlines, flicker, and VHS artifacts.
- Wikipedia-style infoboxes with title, subtitle, flags, map, and rows.
- Multiple themes (17 themes) — switchable from the "Görünüm" menu.
- Zoom control (50% – 200%).
- Lightbox for images with VHS distortion.
- Video modal with playback speed, seek, and download.
- XP Explorer-style lists for players, countries, and wars.

### Mobile Ready
- Responsive layout with FAB menu.
- Bottom-sheet previews with pull-up gesture.
- Touch-friendly toolbar and modals.

### Extras
- **CMD terminal** (`cmd.html`) — full boot sequence, fake system, MAQ/REQ commands, easter eggs.
- **Admin panel** (`admin.html`) — file explorer for the whole repo.
- **GOD IS DEAD easter egg** — triggers a 4-phase glitch sequence and admin mode.

---

## 3. Project Structure

```text
ElciKMP-WIKI/
├── c/                          Website root (deploy this folder)
│   ├── index.html              Home page
│   ├── players.html            Player list
│   ├── player.html             Player detail
│   ├── countries.html          Country list
│   ├── country.html            Country detail
│   ├── wars.html               War list
│   ├── war.html                War detail
│   ├── material.html           Materials / assets
│   ├── source.html             Source reference page
│   ├── cmd.html                CRT terminal
│   ├── admin.html              Admin file explorer
│   ├── style.css               Global styles
│   ├── script.js               Main logic
│   ├── menu-fix.js             Theme + zoom menu
│   └── themes/                 External theme files
│       ├── halflife.css
│       ├── matrix.css
│       ├── winxp.css
│       └── ...
├── players/
│   └── <player-id>/
│       ├── dat.txt
│       └── all/
│           ├── <main>.txt
│           └── hg.txt          (optional glossary)
├── countries/
│   └── <country-id>/
│       ├── dat.txt
│       └── all/
│           ├── <main>.txt
│           └── hg.txt
├── wars/
│   └── <war-id>/
│       ├── dat.txt
│       └── all/
│           ├── <main>.txt
│           └── hg.txt
├── maintext/
│   └── QA.txt                  Terminal Q&A + easter eggs
├── additional/
│   └── sourcerer/
│       ├── list.txt            Source registry
│       └── source.txt          Full source bibliography
├── img/
│   ├── flag/
│   ├── coatofarms/
│   ├── map/
│   ├── portrait/
│   ├── vid/
│   └── site/
└── README.txt
```

---

## 4. Getting Started

### Requirements
- Modern browser (Chrome, Firefox, Edge, Safari)
- A local HTTP server (content is loaded via `fetch()`)

### Local Development

```bash
# Clone
git clone https://github.com/<user>/ElciKMP-WIKI.git
cd ElciKMP-WIKI

# Serve from the repository root (not from c/)
python3 -m http.server 8000
```

Open: `http://localhost:8000/c/index.html`

> **IMPORTANT:** The server must be started from the repository root so that `fetch('players/...')` works. The `c/` folder is the deployed website root, but it references sibling folders.

### Folder Setup for Deployment
If deploying to Render, Netlify, Vercel, or GitHub Pages, move the content folders inside `c/`:

```text
c/
├── index.html
├── script.js
├── style.css
├── players/        <-- move here
├── countries/
├── wars/
├── img/
├── maintext/
└── additional/
```
Then set the publish directory to `c`.

---

## 5. Content Format Reference (`dat.txt`)

### Players
**File:** `players/<id>/dat.txt`
```text
Aras Muhammed MORKOÇ
aras.txt
>founders.legends
```
- **Line 1:** Display name
- **Line 2:** Main content file (inside `all/`)
- **Line 3+:** Optional classman line (`>` prefix)

### Countries
**File:** `countries/<id>/dat.txt`
```text
Xenian İmparatorluk Krallığı
xenia.txt
xue.png
ancient
-iran
>latinoturko.eastwars
```
- **Line 1:** Display name
- **Line 2:** Main content file
- **Line 3:** Flag filename (inside `img/flag/`)
- **Line 4:** Country class / era
- **Line 5:** Previous-next relationship (`prev-next` or `-next` / `prev-`)
- **Line 6+:** Optional classman line

### Wars
**File:** `wars/<id>/dat.txt`
```text
Kudüs Savaşı
jerusalemwar.txt
italy.darkloig.germany.poland
iran.tameris.xian.bharat
fallofdarkloig.europeanrise
>crusades.eastwars
```
- **Line 1:** Display name
- **Line 2:** Main content file
- **Line 3:** Attackers (dot-separated folder names)
- **Line 4:** Defenders (dot-separated)
- **Line 5:** Related events (dot-separated)
- **Line 6+:** Optional classman line

### Optional Preview Line
Add a preview line to any `dat.txt`:
```text
*img.flag.xue|preview.txt
```
- **First part:** Image path (`img.` syntax)
- **Second part:** Preview file name inside `all/`

This appears in the XP Explorer list preview and HyperGlossary tooltip.

---

## 6. Custom Syntax Reference (`all/*.txt`)

### Text & Headings
```text
This is the article title (line 1 becomes <h1>)
This is the subtitle (line 2 becomes italic subtitle)

<h1> Alternative title
<h2> Section heading
<h3> Subsection heading
```

### Minecraft Formatting Codes
| Code | Color | Code | Style |
| :--- | :--- | :--- | :--- |
| `§0` | Black | `§l` | Bold |
| `§1` | Dark Blue | `§o` | Italic |
| `§2` | Dark Green | `§n` | Underline |
| `§3` | Dark Cyan | `§m` | Strikethrough |
| `§4` | Dark Red | `§r` | Reset |
| `§5` | Dark Purple | | |
| `§6` | Gold | | |
| `§7` | Gray | | |
| `§8` | Dark Gray | | |
| `§9` | Blue | | |
| `§a` | Green | | |
| `§b` | Aqua | | |
| `§c` | Red | | |
| `§d` | Light Purple | | |
| `§e` | Yellow | | |
| `§f` | White | | |

### Info Box
```text
<tablo>
    §l §6 Swealand Kapitalist İmparatorluğu
    §o Kejsardömet Swealand Imperia
    img.flag.SKI|img.coatofarms.SKI: Bayrak|Arma
    img.map.MCO1.SKI: Harita
    *Başkenti*              Stockholm
    *Resmî Dili*            İsveççeⁱ
    *Hükûmet*               Kapitalist Emperyal Monarşi
<tablo /end>
```
- `§l ...` → Title
- `§o ...` → Subtitle
- `img.*|img.*: Label|Label` → Multiple images with labels
- `img.*: Label` → Single wide image
- `*Label* Value` → Data row

### War Info Box
```text
<tablowar>
    Büyük Latina Türk Savaşı
    "Bu evrenin gördüğü ilk büyük savaş"
    img.map.war.latinnoturko
    Tarih: MC.O. 90
    Konum: Tüm Ortadoğu
    Sonuç: Ezici Latin zaferi

    §l Taraflar:
    Türk Güçleri:
    flag.img.flag.naziturkey Nazi Türkiyesi
    -
    Latin Güçleri:
    flag.img.flag.atillaroma Atilla Roması
<tablowar /end>
```

### Images & Maps
```text
<img> img.flag.xue -. §l Xenia Bayrağı
<img> img.flag.xue | Alternative caption

<map> img.map.MCO1.xue
```

### Quotes & Collapsibles
```text
<alıntı karesi>
"Bir savaş ya da herhangi bir planlamada Aras'ı orada görmemek imkansızdı."
<alıntı karesi /end>

<açılır kapanır pencere> Ünvanını Alma Sebebi
    Aras Muhammed MORKOÇ'un taşıdığı Swaf
