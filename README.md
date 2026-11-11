================================================================================
ELCIKMP-DATAPAD — README
================================================================================
A community-driven archive of Minecraft server history, presented as a retro
CRT terminal and Wikipedia-style knowledge base.

================================================================================
TABLE OF CONTENTS
================================================================================
1.  Overview
2.  Features
3.  Project Structure
4.  Getting Started
5.  Content Format Reference (dat.txt)
6.  Custom Syntax Reference (all/*.txt)
7.  HyperGlossary (hg.txt)
8.  Sources & References (srcr)
9.  Theme System
10. Terminal (cmd.html) & Admin Panel
11. Mobile Experience
12. Deployment
13. Contributing
14. Credits
15. License

================================================================================
1. OVERVIEW
================================================================================
ElciKMP-DataPad is a static, client-side wiki and archive documenting the
history of a Minecraft server community. It reproduces the feel of a legacy
computer terminal while offering a fully-featured knowledge base with:

- Player, country, war, and event articles
- Rich article syntax written in plain .txt files
- Automatic cross-referencing through a HyperGlossary system
- Retro CRT terminal for browsing "requests" and easter eggs
- Multi-theme engine (GitHub Dark, Half-Life, Windows XP, Matrix, etc.)

Everything runs in the browser without a backend — content is loaded directly
from text files, making the archive portable, git-friendly, and easy to
maintain.

================================================================================
2. FEATURES
================================================================================

CONTENT MANAGEMENT
------------------
- Folder-based organization — every player, country, war, or event is its own
  directory
- Plain text storage (dat.txt + all/*.txt) — no database, no build step
- Classman system — tag articles to automatically link related content
- HyperGlossary — auto-link recurring terms with hover previews
- Source/Reference badges — inline citations with image + click-to-scroll

USER INTERFACE
--------------
- CRT terminal aesthetic with scanlines, flicker, and VHS artifacts
- Wikipedia-style infoboxes with title, subtitle, flags, map, and rows
- Multiple themes (17 themes) — switchable from the "Görünüm" menu
- Zoom control (50% – 200%)
- Lightbox for images with VHS distortion
- Video modal with playback speed, seek, and download
- XP Explorer-style lists for players, countries, and wars

MOBILE READY
------------
- Responsive layout with FAB menu
- Bottom-sheet previews with pull-up gesture
- Touch-friendly toolbar and modals

EXTRAS
------
- CMD terminal (cmd.html) — full boot sequence, fake system, MAQ/REQ commands,
  easter eggs
- Admin panel (admin.html) — file explorer for the whole repo
- GOD IS DEAD easter egg — triggers a 4-phase glitch sequence and admin mode

================================================================================
3. PROJECT STRUCTURE
================================================================================
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

================================================================================
4. GETTING STARTED
================================================================================

REQUIREMENTS
------------
- Modern browser (Chrome, Firefox, Edge, Safari)
- A local HTTP server (content is loaded via fetch())

LOCAL DEVELOPMENT
-----------------
# Clone
git clone https://github.com/<user>/ElciKMP-WIKI.git
cd ElciKMP-WIKI

# Serve from the repository root (not from c/)
python3 -m http.server 8000

Open: http://localhost:8000/c/index.html

IMPORTANT: The server must be started from the repository root so that
fetch('players/...') works. The c/ folder is the deployed website root, but
it references sibling folders.

FOLDER SETUP FOR DEPLOYMENT
---------------------------
If deploying to Render, Netlify, Vercel, or GitHub Pages, move the content
folders inside c/:

c/
├── index.html
├── script.js
├── style.css
├── players/        ← move here
├── countries/
├── wars/
├── img/
├── maintext/
└── additional/

Then set the publish directory to c.

================================================================================
5. CONTENT FORMAT REFERENCE (dat.txt)
================================================================================

PLAYERS
-------
File: players/<id>/dat.txt
Example:
    Aras Muhammed MORKOÇ
    aras.txt
    >founders.legends

    Line 1     Display name
    Line 2     Main content file (inside all/)
    Line 3+    Optional classman line (> prefix)

COUNTRIES
---------
File: countries/<id>/dat.txt
Example:
    Xenian İmparatorluk Krallığı
    xenia.txt
    xue.png
    ancient
    -iran
    >latinoturko.eastwars

    Line 1     Display name
    Line 2     Main content file
    Line 3     Flag filename (inside img/flag/)
    Line 4     Country class / era
    Line 5     Previous-next relationship (prev-next or -next / prev-)
    Line 6+    Optional classman line

WARS
----
File: wars/<id>/dat.txt
Example:
    Kudüs Savaşı
    jerusalemwar.txt
    italy.darkloig.germany.poland
    iran.tameris.xian.bharat
    fallofdarkloig.europeanrise
    >crusades.eastwars

    Line 1     Display name
    Line 2     Main content file
    Line 3     Attackers (dot-separated folder names)
    Line 4     Defenders (dot-separated folder names)
    Line 5     Related events (dot-separated)
    Line 6+    Optional classman line

OPTIONAL PREVIEW LINE
---------------------
Add a preview line to any dat.txt:

    *img.flag.xue|preview.txt

    First part     Image path (img. syntax)
    Second part    Preview file name inside all/

This appears in the XP Explorer list preview and HyperGlossary tooltip.

================================================================================
6. CUSTOM SYNTAX REFERENCE (all/*.txt)
================================================================================

TEXT & HEADINGS
---------------
    This is the article title (line 1 becomes <h1>)
    This is the subtitle (line 2 becomes italic subtitle)

    <h1> Alternative title
    <h2> Section heading
    <h3> Subsection heading

MINECRAFT FORMATTING CODES
--------------------------
    §0  Black         §l  Bold
    §1  Dark Blue     §o  Italic
    §2  Dark Green    §n  Underline
    §3  Dark Cyan     §m  Strikethrough
    §4  Dark Red      §r  Reset
    §5  Dark Purple
    §6  Gold
    §7  Gray
    §8  Dark Gray
    §9  Blue
    §a  Green
    §b  Aqua
    §c  Red
    §d  Light Purple
    §e  Yellow
    §f  White

INFO BOX
--------
    <tablo>
        §l §6 Swealand Kapitalist İmparatorluğu
        §o Kejsardömet Swealand Imperia
        img.flag.SKI|img.coatofarms.SKI: Bayrak|Arma
        img.map.MCO1.SKI: Harita
        *Başkenti*              Stockholm
        *Resmî Dili*            İsveççeⁱ
        *Hükûmet*               Kapitalist Emperyal Monarşi
    <tablo /end>

    §l ...                          → title
    §o ...                          → subtitle
    img.*|img.*: Label|Label        → multiple images with labels
    img.*: Label                    → single wide image
    *Label* Value                   → data row

WAR INFO BOX
------------
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

IMAGES
------
    <img> img.flag.xue -. §l Xenia Bayrağı
    <img> img.flag.xue | Alternative caption

MAPS
----
    <map> img.map.MCO1.xue

QUOTES
------
    <alıntı karesi>
    "Bir savaş ya da herhangi bir planlamada Aras'ı orada görmemek imkansızdı."
    <alıntı karesi /end>

COLLAPSIBLE WINDOWS
-------------------
    <açılır kapanır pencere> Ünvanını Alma Sebebi
        Aras Muhammed MORKOÇ'un taşıdığı Swaführer ünvanı...
    </açılır kapanır pencere>

VIDEOS
------
    <vid> Sunucu Tarihinin İlk Harita Animasyonu | img.vid.latinoturkowar

CHRONOLOGY
----------
    <krono>
    Swenska*
    Swenska diktası
    Swealand İmperia*
    Büyük Swealand
    <krono /end>

    Lines ending with * are rendered bold.

RANDOM FUN FACT
---------------
    <randomfunfact>
    "Hayaletler gerçek değildir"
    <randomfunfact.right /end>

    Supports .left, .right, .mid positioning.

SOURCE REFERENCE
----------------
    <srcr> 1

    Renders an inline badge that links to source.html?anchor=<id>.

================================================================================
7. HYPERGLOSSARY (hg.txt)
================================================================================
Place an optional hg.txt inside any all/ folder to auto-link terms:

    <"KSI"> --ur:countries.SKI-exp<"Kutsal Sveriga İmparatorluğu">
    <"Sverige"> --ur:countries.Sverige-exp<"Kuzeyin Kapitalist İmparatorluğu">
    <"Sverige Feodalitesi"> --exp<"Sverige'nin feodal dönemi">
    <"Zerdüşt"> --exp<"Ateşe tapan kadim Pers inancı">

    --ur:players.X-exp<"...">   Hover → image + description,
                                click → navigates to page
    --exp<"...">                Hover → description only
    Longest match wins          Sverige Feodalitesi beats Sverige

The preview image is auto-detected from the target page (first img., <map>,
or <img> found). Falls back to dat.txt preview or flag.

================================================================================
8. SOURCES & REFERENCES (srcr)
================================================================================

additional/sourcerer/list.txt
-----------------------------
    1."Elçevi Müzesi"-img.portrait.elchevi-2.1
    2."Sverige Kayıtları"-img.portrait.sverige-3.1

    Format: <id>."<title>"-<image>-<anchor>

additional/sourcerer/source.txt
-------------------------------
Written in normal wiki syntax. Headings with leading numbers get auto IDs:

    <h3> §l 2.1 Elçevi Müzesi
    ...

    → id="anchor-2-1"

USAGE
-----
    <srcr> 1

Renders as an avatar badge that scrolls to #anchor-2-1 on source.html.

================================================================================
9. THEME SYSTEM
================================================================================
Themes are loaded from themes/*.css. Available themes:

    Theme              Accent
    -----------------  --------
    Datapad            Default (dynamic)
    Half-Life          #ff9c2e
    Matrix             #00ff41
    Windows XP         #0054e3
    Windows 11         #60cdff
    GitHub             #58a6ff
    Steam              #66c0f4
    Synthwave          #ff2e97
    Minecraft          #7cfc00
    Undertale          #ff0000
    Pip-Boy            #14fe17
    Cyberpunk          #fcee0a
    Tron               #00ffff
    SCP Foundation     #d10000
    Backrooms          #c9b458
    ATLA               #d4af37

Switch themes via Görünüm → Temalar. Selection is persisted in localStorage.

DYNAMIC ACCENT
--------------
By default, the accent color is derived from the article title's § color code.
Themes can override this.

ATLA ELEMENT SYSTEM
-------------------
The ATLA theme changes its visual identity based on the article's title color:

    Water     (blue/cyan/purple)
    Earth     (green/yellow)
    Fire      (red/orange)
    Air       (low-saturation)
    Avatar    (default / list pages)

================================================================================
10. TERMINAL (cmd.html) & ADMIN PANEL
================================================================================

TERMINAL FEATURES
-----------------
- Full boot sequence written in script.js (BOOT_TEXT constant)
- Typewriter animation, block progress bars, SKIP button
- Q&A panel driven by maintext/QA.txt
- Command system: HELP, CLS, VER, EXIT
- Admin easter egg: GOD IS DEAD

QA.TXT FORMAT
-------------
    <maq> Question text?
    > Answer text
    <maq/>

    <REQ> customcommand
    > Response text
    <REQ/.admin>

    <maq> blocks appear in the "?" panel
    <REQ> blocks become commands; .admin suffix hides them from HELP but
    reserves them for admin mode

GOD IS DEAD EASTER EGG
----------------------
Triggers a four-phase glitch (flicker → garble → shatter → unreadable), then
asks:

    > Tekrar hoşgeldiniz admin. Dosyaları görmek ister misiniz ........ Y/N?

    Y → Opens admin.html
    N → Restores normal state

ADMIN PANEL
-----------
admin.html uses the GitHub API to browse any public repository:

    const GITHUB_OWNER = 'your-username';
    const GITHUB_REPO  = 'ElciKMP-WIKI';
    const BRANCH       = 'main';

Commands: ls, cd <folder>, cd .., op <file>, clear, exit

WARNING: Unauthenticated GitHub API is limited to 60 requests/hour per IP.

================================================================================
11. MOBILE EXPERIENCE
================================================================================
- FAB button (☰) opens sidebar drawer
- Bottom sheet for player/country/war preview (pull-up via ⇑⇑)
- Touch-friendly toolbars with horizontal scroll
- Lightbox and video modals scale to viewport
- All themes adapted for max-width: 750px and max-width: 480px

================================================================================
12. DEPLOYMENT
================================================================================

RENDER (RECOMMENDED)
--------------------
1. Push repository to GitHub
2. New → Static Site
3. Root Directory: ElciKMP-WIKI/c (or wherever index.html lives after moving
   content)
4. Build Command: (empty)
5. Publish Directory: .

NETLIFY / VERCEL
----------------
- Build command: (empty)
- Publish directory: c

GITHUB PAGES
------------
Push the content of c/ (with sibling folders moved inside) to a gh-pages
branch.

================================================================================
13. CONTRIBUTING
================================================================================

ADDING A NEW PLAYER
-------------------
1. Create players/<player-id>/
2. Create dat.txt:
       Player Display Name
       player.txt
       >classman.tag
3. Create all/player.txt with content
4. Add folder to players/playerList.txt
5. (optional) Add all/hg.txt for glossary entries

ADDING A NEW COUNTRY
--------------------
1. Create countries/<country-id>/
2. Create dat.txt:
       Country Name
       country.txt
       flag.png
       era-class
       -nextcountry
       >classman
3. Add flag to img/flag/flag.png
4. Add folder to countries/countryList.txt

ADDING A NEW WAR
----------------
1. Create wars/<war-id>/
2. Create dat.txt with 5 mandatory lines
3. Add folder to wars/warList.txt

ADDING AN EASTER EGG
--------------------
1. Add <REQ> block to maintext/QA.txt
2. Use .admin suffix to keep it out of HELP

================================================================================
14. CREDITS
================================================================================
ElciKMP-DataPad is a community-driven archive.
All in-universe names, events, and content are fictional and created by the
Minecraft server community.

    Concept & Code:            Elcirashod
    Community Contributions:   The ElciKMP server family
    Inspired by:               Wikipedia, Windows XP Explorer, GitHub,
                               and terminal emulators

================================================================================
15. LICENSE
================================================================================
Content is © Elcirashod and community contributors.
Source code may be reused under the MIT License unless stated otherwise.

    "Bu platform, Minecraft evreninde şekillenen ortak bir hayalin, sayısız
     bloğun ve satır satır kodun bir araya gelmesiyle doğmuş bir komün
     çalışmasıdır."

================================================================================
END OF README
================================================================================
