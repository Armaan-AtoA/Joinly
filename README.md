# Joinly

Minimal Chrome extension: pick a platform, type the code, land straight in the game in a new tab.

Platforms: Kahoot!, Blooket, Wayground (formerly Quizizz), ClassPoint, Classkick.

## Install (unpacked, for testing)
1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**, select this folder
4. Pin the extension and click it

## How joining works
- **Kahoot, Blooket, Wayground** support a code directly in the URL, so the tab opens already pointed at your game (`kahoot.it/?pin=`, `play.blooket.com/play?id=`, `wayground.com/join?gc=`). You still pick a nickname on their page — that's required by the platforms themselves and can't be skipped.
- **ClassPoint and Classkick** don't publish a join-by-URL format, so for those two a small content script opens their join page and types the code into the class-code box for you automatically.

## Notes
- These are third-party sites; if they change their page layout, the auto-fill for ClassPoint/Classkick may need a selector tweak in `content/classpoint.js` or `content/classkick.js`.
- No data is collected or stored — the code you type is only used to build the URL / fill the field.
