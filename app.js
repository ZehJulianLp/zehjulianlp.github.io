(() => {
  "use strict";
  const base = new URL(".", document.currentScript.src);
  const page = document.body.dataset.page;
  const $ = selector => document.querySelector(selector);
  const href = path => new URL(path, base).href;
  const slug = value => String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const node = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  };
  const safeUrl = value => {
    if (!value) return null;
    try { const url = new URL(value, base); return ["https:", "http:"].includes(url.protocol) ? url.href : null; }
    catch (_) { return null; }
  };
  const link = (text, url, external = false, className = "") => {
    const el = node("a", className, text);
    el.href = safeUrl(url) || href("socials/");
    if (external) { el.target = "_blank"; el.rel = "noopener noreferrer"; }
    return el;
  };
  function windowBox(title, className = "") {
    const box = node("section", "window " + className);
    const bar = node("div", "titlebar");
    const icon = node("span", "window-icon", "▧");
    const decoration = node("span", "window-decoration", "─ □");
    icon.setAttribute("aria-hidden", "true");
    decoration.setAttribute("aria-hidden", "true");
    bar.append(icon, node("span", "", title), decoration);
    const body = node("div", "window-body");
    box.append(bar, body);
    return { box, body };
  }
  const requests = new Map();
  function load(name) {
    if (!requests.has(name)) requests.set(name, fetch(href("data/" + name + ".json")).then(res => {
      if (!res.ok) throw new Error("Could not load " + name);
      return res.json();
    }));
    return requests.get(name);
  }
  function reportError(container, message) {
    container.replaceChildren(node("p", "quiet", message));
    container.setAttribute("aria-busy", "false");
    const retry = node("button", "button", "Try again");
    retry.type = "button";
    retry.addEventListener("click", () => window.location.reload());
    container.append(retry);
  }
  const dateLabel = date => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date + "T12:00:00"));
  function jumpToHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ block: "start" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  const today = new Date();
  const age = today.getFullYear() - 2003 - (today.getMonth() < 8 || (today.getMonth() === 8 && today.getDate() < 16) ? 1 : 0);
  document.querySelectorAll("[data-age]").forEach(el => el.textContent = age);
  const clock = () => { $("#desktop-clock").textContent = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date()); };
  clock();
  setInterval(clock, 60000);
  const calmButton = $("#calm-mode");
  let calm = false;
  try { calm = localStorage.getItem("julian-indie.calm") === "true"; } catch (_) { /* Storage is optional. */ }
  function setCalm(value) {
    document.body.classList.toggle("calm", value);
    calmButton.setAttribute("aria-pressed", String(value));
    calmButton.textContent = value ? "✧ Calm mode on" : "✧ Calm mode";
  }
  setCalm(calm);
  calmButton.addEventListener("click", () => {
    calm = !calm; setCalm(calm);
    try { localStorage.setItem("julian-indie.calm", String(calm)); } catch (_) { /* Optional preference. */ }
  });
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !document.querySelector("dialog[open]")) {
      event.preventDefault();
      if (page === "search") $("#site-search").focus();
      else location.href = href("search/#site-search");
    }
  });

  function nowContent(now, compact = false) {
    const fragment = document.createDocumentFragment();
    const building = node("div", "now-item");
    building.append(node("span", "now-label", "Currently building"));
    if (now.building.length) now.building.forEach(item => {
      building.append(link(item.title, item.href), node("p", "quiet", item.text));
    });
    else building.append(node("p", "quiet", "No current note yet."));
    fragment.append(building);
    if (!compact) {
      for (const [key, label] of [["playing", "Currently playing"], ["reading", "Currently reading"], ["listening", "Currently listening"]]) {
        const section = node("div", "now-item");
        section.append(node("span", "now-label", label), node("p", now[key] ? "" : "quiet", now[key] || "No current note yet."));
        fragment.append(section);
      }
      fragment.append(node("p", "small quiet", "Last updated: " + dateLabel(now.updated)));
    }
    return fragment;
  }
  function updatesContent(updates, compact = false) {
    const fragment = document.createDocumentFragment();
    const sorted = updates.slice().sort((a, b) => b.date.localeCompare(a.date));
    (compact ? sorted.slice(0, 1) : sorted).forEach(item => {
      const entry = node("article", "log-entry");
      const time = node("time", "", dateLabel(item.date)); time.dateTime = item.date;
      const title = node(compact ? "h3" : "h2", "", item.title);
      entry.append(time, title, node("p", "", item.text));
      if (!compact && item.href) entry.append(link("Read more →", item.href));
      fragment.append(entry);
    });
    if (!sorted.length) fragment.append(node("p", "quiet", "No updates yet."));
    return fragment;
  }
  if (["home", "now", "updates"].includes(page)) load("site").then(site => {
    if (page === "home") {
      $("#home-now").replaceChildren(nowContent(site.now, true));
      $("#home-updates").replaceChildren(updatesContent(site.updates, true));
    }
    if (page === "now") $("#now-content").replaceChildren(nowContent(site.now));
    if (page === "updates") $("#updates-list").replaceChildren(updatesContent(site.updates));
  }).catch(() => {
    if (page === "now") reportError($("#now-content"), "My current note couldn't be loaded.");
    if (page === "updates") reportError($("#updates-list"), "The updates couldn't be loaded.");
  });
  if (page === "home") load("quotes").then(quotes => {
    let last = -1;
    const next = () => {
      if (!quotes.length) return;
      let index = Math.floor(Math.random() * quotes.length);
      if (index === last && quotes.length > 1) index = (index + 1) % quotes.length;
      last = index;
      $("#random-quote").textContent = "“" + quotes[index] + "”";
    };
    next(); $("#another-quote").addEventListener("click", next);
  }).catch(() => $("#another-quote").hidden = true);

  function projectCard(project) {
    const { box, body } = windowBox((project.featured ? "★ " : "▱ ") + project.category, "project-card");
    box.id = "project-" + slug(project.title);
    const heading = node("h2", "", project.title);
    body.append(heading);
    const meta = node("div", "project-meta");
    meta.append(node("span", "", project.status), node("span", "", project.ownership));
    body.append(meta, node("p", "", project.description));
    if (project.stack.length) {
      const tags = node("ul", "tags");
      tags.setAttribute("aria-label", "Technology and formats");
      project.stack.forEach(tech => tags.append(node("li", "", tech)));
      body.append(tags);
    }
    const details = node("details");
    details.append(node("summary", "", "Features & notes"));
    const list = node("ul");
    project.features.forEach(feature => list.append(node("li", "", feature)));
    details.append(list);
    if (project.planned?.length) {
      details.append(node("h3", "", "Planned"));
      const plans = node("ul");
      project.planned.forEach(item => plans.append(node("li", "", item)));
      details.append(plans);
    }
    if (project.related?.length) {
      details.append(node("h3", "", "Related projects"));
      const related = node("div", "ecosystem-links");
      project.related.forEach(name => related.append(link(name, "projects/#project-" + slug(name))));
      details.append(related);
    }
    if (safeUrl(project.screenshot)) {
      const image = node("img", "project-screenshot");
      image.src = safeUrl(project.screenshot); image.alt = project.screenshotAlt || project.title + " screenshot"; image.loading = "lazy";
      image.addEventListener("error", () => image.remove());
      details.append(image);
    }
    body.append(details);
    const links = node("div", "project-links");
    if (safeUrl(project.link)) links.append(link(project.cancelled ? "Old website ↗" : "Visit project ↗", project.link, true));
    else links.append(node("span", "quiet", project.status === "Local project" ? "Runs locally; no public website." : "No public link listed."));
    if (safeUrl(project.github)) links.append(link("GitHub ↗", project.github, true));
    if (safeUrl(project.communityLink)) links.append(link("Community ↗", project.communityLink, true));
    body.append(links);
    return box;
  }
  if (page === "projects") load("projects").then(projects => {
    const root = $("#projects"), input = $("#project-search"), filters = $("#project-filters");
    let category = "All";
    const categories = ["All", "Featured", ...new Set(projects.map(p => p.category))];
    function render() {
      const terms = input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
      const visible = projects.filter(p => {
        const categoryMatch = category === "All" || (category === "Featured" ? p.featured : p.category === category);
        const text = [p.title, p.category, p.description, p.ownership, ...p.features, ...p.stack, ...(p.aliases || [])].join(" ").toLocaleLowerCase();
        return categoryMatch && terms.every(term => text.includes(term));
      });
      root.replaceChildren(...visible.map(projectCard));
      if (!visible.length) {
        const { box, body } = windowBox("nothing found");
        body.append(node("p", "", "No projects match that search."));
        const clear = node("button", "button", "Clear filters"); clear.type = "button";
        clear.addEventListener("click", () => { input.value = ""; category = "All"; render(); input.focus(); });
        body.append(clear); root.append(box);
      }
      $("#project-status").textContent = visible.length + " of " + projects.length + " projects · " + category;
      filters.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === category)));
    }
    categories.forEach(name => {
      const button = node("button", "", name); button.type = "button"; button.dataset.category = name;
      button.setAttribute("aria-controls", "projects");
      button.addEventListener("click", () => { category = name; render(); });
      filters.append(button);
    });
    function reveal() {
      let id;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
      const project = projects.find(p => "project-" + slug(p.title) === id || (p.aliases || []).some(a => "project-" + slug(a) === id));
      if (!project) return;
      if (!document.getElementById("project-" + slug(project.title))) { category = "All"; input.value = ""; render(); }
      const target = document.getElementById("project-" + slug(project.title));
      target.scrollIntoView({ block: "start" }); target.tabIndex = -1; target.focus({ preventScroll: true });
    }
    input.addEventListener("input", render);
    window.addEventListener("hashchange", reveal);
    document.addEventListener("click", event => {
      const a = event.target.closest("a[href]");
      if (a && a.pathname === location.pathname && a.hash && a.hash === location.hash) { event.preventDefault(); reveal(); }
    });
    render(); root.setAttribute("aria-busy", "false"); requestAnimationFrame(reveal);
  }).catch(() => { $("#project-status").textContent = "Projects unavailable."; reportError($("#projects"), "The project list couldn't be loaded."); });

  function imageCredit(source) {
    const credit = node("div", "image-credit");
    if (!source) return credit;
    credit.append("Photo: ", link(source.label, source.url, true));
    if (source.license && safeUrl(source.licenseUrl)) credit.append(" · ", link(source.license, source.licenseUrl, true));
    if (source.note && source.note !== "Product photo; not my own device.") credit.append(node("p", "", source.note));
    return credit;
  }

  // Both galleries share a native dialog: focus stays inside, Escape closes it,
  // and the image has a fixed viewport-sized space, independent of its dimensions.
  function imageViewer(items) {
    const dialog = node("dialog", "image-viewer");
    dialog.setAttribute("aria-label", "Large image viewer");
    const toolbar = node("div", "viewer-toolbar");
    const counter = node("span");
    const close = node("button", "", "×"); close.type = "button"; close.setAttribute("aria-label", "Close image viewer");
    toolbar.append(counter, close);
    const stage = node("div", "viewer-stage");
    const prev = node("button", "image-arrow", "‹"), next = node("button", "image-arrow", "›");
    prev.type = next.type = "button";
    prev.setAttribute("aria-label", "Previous image"); next.setAttribute("aria-label", "Next image");
    const image = node("img");
    stage.append(prev, image, next);
    const caption = node("div", "viewer-caption"); caption.setAttribute("aria-live", "polite");
    dialog.append(toolbar, stage, caption); document.body.append(dialog);
    let index = 0, opener;
    function show(i) {
      index = (i + items.length) % items.length;
      const item = items[index];
      image.src = href(item.src); image.alt = item.alt || item.title || "";
      counter.textContent = (index + 1) + " / " + items.length;
      caption.replaceChildren();
      if (item.artist) caption.append(safeUrl(item.artistUrl) ? link("Artist: " + item.artist, item.artistUrl, true) : node("p", "", "Artist: " + item.artist));
      if (item.title) caption.append(node("p", "", item.title));
      if (item.alt || item.notes) caption.append(node("p", "", item.alt || item.notes));
      if (item.imageSource) caption.append(imageCredit(item.imageSource));
    }
    close.addEventListener("click", () => dialog.close());
    prev.addEventListener("click", () => show(index - 1)); next.addEventListener("click", () => show(index + 1));
    dialog.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); show(index + (event.key === "ArrowLeft" ? -1 : 1)); }
    });
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => { document.documentElement.classList.remove("viewer-open"); if (opener?.isConnected) opener.focus({ preventScroll: true }); });
    return { open(i, trigger) { if (!items.length) return; opener = trigger; show(i); dialog.showModal(); document.documentElement.classList.add("viewer-open"); close.focus(); } };
  }
  if (page === "dragon") load("gallery").then(images => {
    const thumbs = $("#gallery-thumbs"), image = $("#gallery-image"), caption = $("#gallery-caption");
    if (!images.length) throw new Error("Empty gallery");
    const viewer = imageViewer(images); let current = 0;
    function show(index) {
      current = (index + images.length) % images.length;
      const item = images[current]; image.src = href(item.src); image.alt = item.alt;
      caption.replaceChildren(node("span", "counter", (current + 1) + " / " + images.length));
      caption.append(safeUrl(item.artistUrl) ? link("Artist: " + item.artist, item.artistUrl, true) : node("span", "", item.artist));
      caption.append(node("p", "", item.alt));
      thumbs.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String(current === i)));
    }
    images.forEach((item, index) => {
      const button = node("button"); button.type = "button"; button.setAttribute("aria-label", "Show artwork " + (index + 1) + " by " + item.artist);
      const thumb = node("img"); thumb.src = href(item.src); thumb.alt = ""; thumb.loading = "lazy";
      button.append(thumb); button.addEventListener("click", () => show(index)); thumbs.append(button);
    });
    $("#gallery-prev").addEventListener("click", () => show(current - 1));
    $("#gallery-next").addEventListener("click", () => show(current + 1));
    $("#gallery-open").disabled = false;
    $("#gallery-open").addEventListener("click", event => viewer.open(current, event.currentTarget));
    $("#gallery-status").hidden = true;
    show(0); requestAnimationFrame(jumpToHash);
  }).catch(() => reportError($("#gallery-status"), "The artwork couldn't be loaded."));

  const audiobookId = book => "collection-audiobook-" + slug(book.id);
  const audiobookSeries = book => book.series ? book.series.title + " · " + (book.series.lastVolume ? "Volumes " + book.series.volume + "–" + book.series.lastVolume : "Volume " + book.series.volume) : "";
  // Deliberately whitelist book metadata. Listening/account data does not belong here
  // or in the search index, even if a future import contains additional fields.
  const audiobookText = book => [book.subtitle, ...book.authors, ...book.narrators, audiobookSeries(book), ...(book.contributors || []).map(c => c.name + " (" + c.role + ")")].filter(Boolean).join(" · ");
  function sortAudiobooks(books) {
    const collator = new Intl.Collator("de", { numeric: true, sensitivity: "base" });
    const sortName = book => (book.series?.title || book.title).replace(/^(der|die|das)\s+/i, "");
    return books.slice().sort((a, b) => collator.compare(sortName(a), sortName(b))
      || (a.series?.volume || 0) - (b.series?.volume || 0)
      || (a.series?.lastVolume || a.series?.volume || 0) - (b.series?.lastVolume || b.series?.volume || 0)
      || collator.compare(a.title, b.title));
  }
  if (page === "collection") load("audiobooks").then(data => {
    const root = $("#audiobooks-list"), navigation = $("#audiobook-groups");
    root.replaceChildren(); navigation.replaceChildren();
    $("#audiobook-count").textContent = data.books.length + " titles in my collection.";
    if (!data.books.length) root.append(node("p", "quiet", "No audiobooks listed yet."));
    data.groups.forEach(group => {
      const books = sortAudiobooks(data.books.filter(book => book.group === group.id));
      if (!books.length) return;
      const id = "audiobooks-" + slug(group.id);
      const navItem = node("li"); navItem.append(link(group.title, "collection/#" + id)); navigation.append(navItem);
      const { box, body } = windowBox("audiobooks / " + group.title.toLowerCase(), "audiobook-group");
      box.id = id;
      body.append(node("h3", "", group.title), node("p", "small quiet", books.length + " titles"));
      const list = node("div", "audiobook-grid");
      books.forEach(book => {
        const card = node("article", "audiobook-card"); card.id = audiobookId(book);
        const heading = node("h4", "", book.title); heading.lang = "de"; card.append(heading);
        if (book.subtitle) { const subtitle = node("p", "audiobook-subtitle", book.subtitle); subtitle.lang = "de"; card.append(subtitle); }
        const metadata = node("dl", "audiobook-metadata");
        const field = (label, value) => { if (value) metadata.append(node("dt", "", label), node("dd", "", value)); };
        field(book.authors.length > 1 ? "Authors" : "Author", book.authors.join(", "));
        field(book.narrators.length > 1 ? "Narrators" : "Narrator", book.narrators.join(", "));
        field("Series", audiobookSeries(book));
        const roles = [...new Set((book.contributors || []).map(c => c.role))];
        roles.forEach(role => field(role, book.contributors.filter(c => c.role === role).map(c => c.name).join(", ")));
        card.append(metadata); list.append(card);
      });
      body.append(list); root.append(box);
    });
    root.setAttribute("aria-busy", "false"); requestAnimationFrame(jumpToHash);
  }).catch(() => {
    $("#audiobook-count").textContent = "Audiobooks unavailable.";
    reportError($("#audiobooks-list"), "The audiobook list couldn't be loaded.");
  });

  const gameId = game => "collection-game-" + slug(game.id);
  function sortGames(games) {
    const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
    return games.slice().sort((a, b) => collator.compare(a.title, b.title));
  }
  // Explicitly whitelist public game metadata, never playtime or account fields.
  const gameSearchEntry = (game, groups = []) => ({ title: game.title, source: "Games", text: [game.description, game.genre, ...(game.modes || []), groups.find(group => group.id === game.group)?.title, ...(game.links || []).map(item => item.label)].filter(Boolean).join(" · "), url: "collection/#" + gameId(game) });
  if (page === "collection") load("games").then(data => {
    const root = $("#games-list"), navigation = $("#game-groups");
    root.replaceChildren(); navigation.replaceChildren();
    $("#game-count").textContent = data.games.length + " games in my collection.";
    const groups = [...(data.groups || [])];
    if (data.games.some(game => !groups.some(group => group.id === game.group))) groups.push({ id: "other", title: "Other games" });
    if (!data.games.length) root.append(node("p", "quiet", "No games listed yet."));
    groups.forEach(group => {
      const games = sortGames(data.games.filter(game => game.group === group.id || (group.id === "other" && !(data.groups || []).some(known => known.id === game.group))));
      if (!games.length) return;
      const id = "games-" + slug(group.id);
      const navItem = node("li"); navItem.append(link(group.title, "collection/#" + id)); navigation.append(navItem);
      const { box, body } = windowBox("games / " + group.title.toLowerCase(), "game-group"); box.id = id;
      body.append(node("h3", "", group.title), node("p", "small quiet", games.length + " games"));
      const list = node("ul", "game-list");
      games.forEach(game => {
        const item = node("li", "game-item"); item.id = gameId(game);
        item.append(node("h4", "", game.title));
        if (game.description) item.append(node("p", "game-description", game.description));
        const metadata = node("dl", "game-metadata");
        if (game.genre) metadata.append(node("dt", "", "Genre"), node("dd", "", game.genre));
        if (game.modes?.length) metadata.append(node("dt", "", "Play modes"), node("dd", "", game.modes.join(" · ")));
        item.append(metadata);
        if (game.links?.length) {
          const links = node("div", "game-links");
          game.links.forEach(source => {
            const url = safeUrl(source.url);
            if (url) links.append(link(source.label, url, new URL(url).origin !== location.origin));
          });
          item.append(links);
        }
        list.append(item);
      });
      body.append(list); root.append(box);
    });
    root.setAttribute("aria-busy", "false"); requestAnimationFrame(jumpToHash);
  }).catch(() => {
    $("#game-count").textContent = "Games unavailable.";
    reportError($("#games-list"), "The games couldn't be loaded.");
  });

  if (page === "collection") load("collection").then(data => {
    const root = $("#collection"); root.replaceChildren();
    const images = data.items.filter(i => i.image).map(i => ({ src: i.image, alt: i.imageAlt, title: i.title, notes: i.notes, imageSource: i.imageSource }));
    const viewer = imageViewer(images);
    data.overCategories.forEach(group => {
      const { box, body } = windowBox(group.label, "prose-window"); box.id = "collection-overcategory-" + slug(group.id);
      body.append(node("h2", "", group.label), node("p", "quiet", group.description));
      const grid = node("div", "collection-grid");
      const items = data.items.filter(i => i.overCategory === group.id);
      items.forEach(item => {
        const card = node("article", "collection-item"); card.id = "collection-item-" + slug(item.title);
        if (item.image) {
          const button = node("button", "collection-thumb"); button.type = "button"; button.setAttribute("aria-label", "Open image for " + item.title);
          const img = node("img"); img.src = href(item.image); img.alt = item.imageAlt || item.title; img.loading = "lazy";
          button.append(img); button.addEventListener("click", () => viewer.open(images.findIndex(i => i.title === item.title), button)); card.append(button);
        }
        const category = data.categories.find(c => c.id === item.category);
        card.append(node("h3", "", item.title), node("p", "collection-status", [category?.label, item.status].filter(Boolean).join(" · ")), node("p", "", item.notes));
        if (item.specs?.length) {
          const specs = node("ul", "collection-specs");
          item.specs.forEach(spec => specs.append(node("li", "", spec)));
          card.append(specs);
        }
        if (safeUrl(item.link)) card.append(link(item.linkLabel || "Open link ↗", item.link, new URL(safeUrl(item.link)).origin !== location.origin));
        if (item.imageSource) card.append(imageCredit(item.imageSource));
        grid.append(card);
      });
      if (!items.length) grid.append(node("p", "quiet", "No items in this category yet."));
      body.append(grid);
      if (group.id === "maker") {
        const note = node("p", "maker-note");
        note.append("The ", link("Raspberry Pi kiosk", "collection/#collection-item-raspberry-pi-4"), " belongs here too, along with assorted cables, adapters and project bits. No individual inventory of those yet.");
        body.append(note);
      }
      root.append(box);
    });
    const retired = data.items.filter(item => item.retired);
    if (retired.length) {
      const { box, body } = windowBox("the old shelf", "prose-window");
      body.append(node("h2", "", "Older gear"), node("p", "", "Previous daily drivers, a working backup, and one speaker that might still exist somewhere."));
      const list = node("ul");
      retired.forEach(item => { const row = node("li"); row.append(link(item.title, "collection/#collection-item-" + slug(item.title)), " · " + item.status); list.append(row); });
      body.append(list); root.append(box);
    }
    root.setAttribute("aria-busy", "false"); requestAnimationFrame(jumpToHash);
  }).catch(() => reportError($("#collection"), "The collection couldn't be loaded."));

  if (page === "socials") {
    const copyButton = $("#copy-linkback"), code = $("#linkback-code"), status = $("#linkback-status");
    copyButton.hidden = false;
    copyButton.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(code.value);
        status.textContent = "HTML copied. Remember to download the image too.";
      } catch (_) {
        code.focus(); code.select();
        status.textContent = "Automatic copying isn't available. The HTML is selected; copy it with your usual keyboard shortcut or menu.";
      }
    });
  }

  if (page === "socials") load("socials").then(data => {
    const root = $("#socials-main"); root.replaceChildren();
    data.socials.forEach(social => {
      const { box, body } = windowBox(social.title, "social-card"); box.id = "social-" + slug(social.title);
      const image = node("img", "social-icon"); image.src = href(social.image); image.alt = ""; image.width = image.height = 38;
      body.append(image, node("h3", "", social.title), node("p", "", social.description), link(social.button + " ↗", social.link, true));
      root.append(box);
    });
    const friends = $("#friends-container");
    data.friends.forEach(friend => {
      const card = node("article", "friend-card"); card.id = "friend-" + slug(friend.title);
      const initials = node("span", "friend-initials", friend.title.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase()); initials.setAttribute("aria-hidden", "true");
      const body = node("div"), heading = node("h3"); heading.append(link(friend.title + " ↗", friend.link, true));
      body.append(heading, node("small", "", new URL(friend.link).hostname)); card.append(initials, body); friends.append(card);
    });
    root.setAttribute("aria-busy", "false"); requestAnimationFrame(jumpToHash);
  }).catch(() => reportError($("#socials-main"), "The social links couldn't be loaded."));

  if (page === "guestbook") $("#load-guestbook").addEventListener("click", event => {
    const button = event.currentTarget; button.disabled = true;
    const script = document.createElement("script"); script.src = "https://giscus.app/client.js"; script.async = true; script.crossOrigin = "anonymous";
    const config = { repo: "ZehJulianLp/zehjulianlp.github.io", "repo-id": "R_kgDOHAxhiA", category: "Guestbook", "category-id": "DIC_kwDOHAxhiM4CuBBC", mapping: "specific", term: "/guestbook/", strict: "0", "reactions-enabled": "1", "emit-metadata": "0", "input-position": "bottom", theme: "dark", lang: "en" };
    Object.entries(config).forEach(([key, value]) => script.setAttribute("data-" + key, value));
    $("#guestbook-status").textContent = "Loading comments from GitHub…";
    script.onload = () => { button.hidden = true; $("#guestbook-status").textContent = "If the comments don't appear, you can open the discussions directly below."; };
    script.onerror = () => { button.disabled = false; script.remove(); $("#guestbook-status").textContent = "Comments couldn't be loaded. Try again or use the GitHub link below."; };
    $("#guestbook-comments").append(script);
  });

  async function searchIndex() {
    const entries = [];
    const loads = await Promise.allSettled([load("projects"), load("gallery"), load("collection"), load("socials"), load("site"), load("audiobooks"), load("games")]);
    const data = loads.map(r => r.status === "fulfilled" ? r.value : null);
    const [projects, gallery, collection, socials, site, audiobooks, games] = data;
    projects?.forEach(p => entries.push({ title: p.title, source: "Projects", text: [p.description, p.category, ...p.features, ...p.stack, ...(p.aliases || [])].join(" "), url: "projects/#project-" + slug(p.title) }));
    gallery?.forEach(p => entries.push({ title: "Artwork by " + p.artist, source: "Dragon gallery", text: p.alt, url: "dragon-stuff/#dragon-gallery" }));
    collection?.items.forEach(i => entries.push({ title: i.title, source: "Collection", text: [i.notes, i.status, i.category, ...(i.specs || [])].join(" "), url: "collection/#collection-item-" + slug(i.title) }));
    audiobooks?.books.forEach(book => entries.push({ title: book.title, source: "Audiobooks", text: audiobookText(book), url: "collection/#" + audiobookId(book) }));
    games?.games.forEach(game => entries.push(gameSearchEntry(game, games.groups)));
    socials?.socials.forEach(s => entries.push({ title: s.title, source: "Socials", text: s.description, url: "socials/#social-" + slug(s.title) }));
    socials?.friends.forEach(f => entries.push({ title: f.title, source: "Friends", text: f.link, url: "socials/#friend-" + slug(f.title) }));
    site?.updates.forEach(u => entries.push({ title: u.title, source: "Updates", text: u.date + " " + u.text, url: "updates/" }));
    const pages = ["about/", "dragon-stuff/", "guestbook/", "now/"];
    const html = await Promise.allSettled(pages.map(async path => {
      const response = await fetch(href(path)); if (!response.ok) throw new Error(path);
      const document = new DOMParser().parseFromString(await response.text(), "text/html");
      return [...document.querySelectorAll(".prose-window[id]")].map(section => ({ title: section.querySelector(".titlebar")?.textContent.replace(/[▧─□]/g, "").trim(), source: document.title.split(" · ")[0], text: section.querySelector(".window-body").textContent.replace(/\s+/g, " ").trim(), url: path + "#" + section.id }));
    }));
    html.forEach(result => { if (result.status === "fulfilled") entries.push(...result.value); });
    if (!entries.length) throw new Error("Search unavailable");
    return { entries, partial: loads.some(r => r.status === "rejected") || html.some(r => r.status === "rejected") };
  }
  if (page === "search") {
    const input = $("#site-search"), results = $("#search-results"), status = $("#search-status");
    input.value = new URLSearchParams(location.search).get("q") || "";
    // Carry the shortcut's focus intent across navigation, before the index loads.
    if (location.hash === "#site-search") input.focus();
    let index;
    const ready = searchIndex().then(value => index = value);
    async function search() {
      const query = input.value.trim(); results.replaceChildren();
      if (!query) { status.textContent = "Enter a search term."; return; }
      status.textContent = "Searching…";
      try {
        await ready;
        const terms = query.toLocaleLowerCase().split(/\s+/);
        const hits = index.entries.map(entry => {
          const title = entry.title.toLocaleLowerCase(), text = entry.text.toLocaleLowerCase();
          return { ...entry, score: terms.reduce((score, term) => score + (title.includes(term) ? 6 : 0) + (text.includes(term) ? 2 : 0), 0) };
        }).filter(e => e.score > 0).sort((a, b) => b.score - a.score);
        status.textContent = hits.length + " result(s) for “" + query + "”" + (index.partial ? " · Some pages couldn't be searched." : "");
        hits.slice(0, 60).forEach(hit => {
          const { box, body } = windowBox(hit.source, "search-result");
          const heading = node("h2"); heading.append(link(hit.title, hit.url));
          body.append(heading, node("p", "", hit.text.slice(0, 220) + (hit.text.length > 220 ? "…" : ""))); results.append(box);
        });
        if (!hits.length) results.append(node("p", "quiet", "Nothing matched. Try a project name or a shorter search term."));
      } catch (_) { reportError(results, "The search index couldn't be loaded."); status.textContent = "Search unavailable."; }
    }
    // Consume a failed initial load even when the visitor hasn't entered a query yet.
    ready.catch(() => { status.textContent = "Search unavailable. You can still browse the pages from the menu."; });
    $("#search-form").addEventListener("submit", event => { event.preventDefault(); const url = new URL(location.href); url.searchParams.set("q", input.value); history.replaceState(null, "", url); search(); });
    if (input.value) search();
  }
})();
