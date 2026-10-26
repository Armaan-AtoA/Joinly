const BUILT_IN = [
  {
    key: "kahoot",
    name: "Kahoot!",
    brand: "#46178F",
    tint: "#efe7fa",
    logo: "https://www.google.com/s2/favicons?sz=128&domain=kahoot.com",
    buildUrl: (code) => `https://kahoot.it/?pin=${encodeURIComponent(code)}`,
  },
  {
    key: "blooket",
    name: "Blooket",
    brand: "#1AC0C0",
    tint: "#e4fafa",
    logo: "https://www.google.com/s2/favicons?sz=128&domain=blooket.com",
    buildUrl: (code) => `https://play.blooket.com/play?id=${encodeURIComponent(code)}`,
  },
  {
    key: "wayground",
    name: "Wayground",
    brand: "#7C4DFF",
    tint: "#f1ecff",
    logo: "https://www.google.com/s2/favicons?sz=128&domain=wayground.com",
    buildUrl: (code) => `https://wayground.com/join?gc=${encodeURIComponent(code)}`,
  },
  {
    key: "classpoint",
    name: "ClassPoint",
    brand: "#FF6B35",
    tint: "#ffece3",
    logo: "https://www.google.com/s2/favicons?sz=128&domain=classpoint.app",
    buildUrl: (code) => `https://www.classpoint.app/?joinlyCode=${encodeURIComponent(code)}`,
  },
  {
    key: "classkick",
    name: "Classkick",
    brand: "#FFC93C",
    tint: "#fff7e0",
    logo: "https://www.google.com/s2/favicons?sz=128&domain=classkick.com",
    buildUrl: (code) => `https://app.classkick.com/login/${encodeURIComponent(code)}`,
  },
];

const platformScreen = document.getElementById("platformScreen");
const codeScreen = document.getElementById("codeScreen");
const addScreen = document.getElementById("addScreen");
const platformGrid = document.getElementById("platformGrid");
const codeLabel = document.getElementById("codeLabel");
const codeForm = document.getElementById("codeForm");
const codeInput = document.getElementById("codeInput");
const platformBanner = document.getElementById("platformBanner");
const bannerLogo = document.getElementById("bannerLogo");
const addForm = document.getElementById("addForm");
const addName = document.getElementById("addName");
const addUrl = document.getElementById("addUrl");
const addLogo = document.getElementById("addLogo");
const backBtn = document.getElementById("backBtn");
const title = document.getElementById("title");
const themeBtn = document.getElementById("themeBtn");
const editBtn = document.getElementById("editBtn");

let customSites = [];
let currentTheme = "aurora";
let editMode = false;
let selected = null;
let activeScreen = "platformScreen";

function faviconFor(urlTemplate) {
  try {
    const host = new URL(urlTemplate.replace(":code:", "x")).hostname;
    return `https://www.google.com/s2/favicons?sz=128&domain=${host}`;
  } catch {
    return "";
  }
}

function allPlatforms() {
  const custom = customSites.map((s, customIndex) => ({
    key: `custom:${s.name}`,
    name: s.name,
    brand: "#111111",
    tint: "#f0f0f1",
    logo: s.logo || faviconFor(s.url),
    custom: true,
    customIndex,
    buildUrl: (code) => s.url.replaceAll(":code:", encodeURIComponent(code)),
  }));
  return [...BUILT_IN, ...custom];
}

function renderGrid() {
  platformGrid.innerHTML = "";
  allPlatforms().forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "platform-btn";
    btn.style.setProperty("--brand", p.brand);
    btn.style.setProperty("--brand-tint", p.tint);
    const initial = p.name.trim().charAt(0).toUpperCase() || "+";
    btn.innerHTML = `
      <span class="logo-chip"><img src="${p.logo}" alt="" /><span class="fallback-mark" hidden>${initial}</span></span>
      <span>${p.name}${p.custom ? '<br><span class="custom-badge">Custom</span>' : ""}</span>
      ${p.custom && editMode ? '<span class="remove-site" role="button" tabindex="0" aria-label="Remove custom site">×</span>' : ""}
    `;
    const logo = btn.querySelector("img");
    const fallback = btn.querySelector(".fallback-mark");
    logo.addEventListener("error", () => { logo.hidden = true; fallback.hidden = false; });
    const removeSite = () => {
      customSites.splice(p.customIndex, 1);
      chrome.storage.local.set({ customSites }, renderGrid);
    };
    const removeControl = btn.querySelector(".remove-site");
    if (removeControl) {
      removeControl.addEventListener("click", (event) => { event.stopPropagation(); removeSite(); });
      removeControl.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); removeSite(); }
      });
    }
    btn.addEventListener("click", () => { if (!editMode) showCodeScreen(p); });
    platformGrid.appendChild(btn);
  });

  const addBtn = document.createElement("button");
  addBtn.className = "platform-btn add-btn";
  addBtn.innerHTML = `
    <span class="logo-chip"><span class="plus">+</span></span>
    <span>Add site</span>
  `;
  addBtn.addEventListener("click", showAddScreen);
  platformGrid.appendChild(addBtn);
}

function show(screen) {
  platformScreen.hidden = screen !== "platformScreen";
  codeScreen.hidden = screen !== "codeScreen";
  addScreen.hidden = screen !== "addScreen";
  backBtn.hidden = screen === "platformScreen";
  activeScreen = screen;
}

function showPlatformScreen() {
  selected = null;
  title.innerHTML = '<img src="icons/joinly-mark.svg" alt="" />Joinly';
  show("platformScreen");
}

function showCodeScreen(platform) {
  selected = platform;
  title.textContent = platform.name;
  codeLabel.textContent = `Enter your ${platform.name} code`;
  bannerLogo.src = platform.logo;
  platformBanner.style.setProperty("--brand-tint", platform.tint);
  codeInput.value = "";
  show("codeScreen");
  requestAnimationFrame(() => codeInput.focus());
}

function showAddScreen() {
  title.textContent = "Add site";
  addName.value = "";
  addUrl.value = "";
  addLogo.value = "";
  show("addScreen");
  requestAnimationFrame(() => addName.focus());
}

backBtn.addEventListener("click", () => {
  if (activeScreen === "addScreen") {
    showPlatformScreen();
  } else {
    showPlatformScreen();
  }
});

codeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const code = codeInput.value.trim();
  if (!code || !selected) return;
  const url = selected.buildUrl(code);
  chrome.tabs.create({ url });
  window.close();
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = addName.value.trim();
  const url = addUrl.value.trim();
  const logo = addLogo.value.trim();
  if (!name || !url || !url.includes(":code:")) return;
  customSites.push({ name, url, logo });
  chrome.storage.local.set({ customSites }, () => {
    renderGrid();
    showPlatformScreen();
  });
});

function applyTheme(theme, persist = false) {
  currentTheme = theme;
  document.body.dataset.theme = theme === "aurora" ? "" : theme;
  if (persist) chrome.storage.local.set({ joinlyTheme: theme });
}

themeBtn.addEventListener("click", () => {
  const themes = ["aurora", "midnight", "sunrise"];
  applyTheme(themes[(themes.indexOf(currentTheme) + 1) % themes.length], true);
});

editBtn.addEventListener("click", () => {
  editMode = !editMode;
  editBtn.classList.toggle("is-active", editMode);
  editBtn.setAttribute("aria-pressed", String(editMode));
  renderGrid();
});

chrome.storage.local.get(["customSites", "joinlyTheme"], (res) => {
  customSites = res.customSites || [];
  applyTheme(res.joinlyTheme || "aurora");
  renderGrid();
});
