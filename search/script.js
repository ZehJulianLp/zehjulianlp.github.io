function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readPath(obj, path) {
  if (path === "$") return Array.isArray(obj) ? obj : [];
  return path.split(".").reduce(function (acc, part) {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj);
}

function getSearchQuery() {
  var params = new URLSearchParams(window.location.search);
  return (params.get("q") || "").trim();
}

function buildSnippet(text, terms) {
  var clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";

  var lower = normalizeText(clean);
  var hitIndex = -1;
  for (var i = 0; i < terms.length; i++) {
    var idx = lower.indexOf(terms[i]);
    if (idx !== -1 && (hitIndex === -1 || idx < hitIndex)) hitIndex = idx;
  }

  if (hitIndex === -1) return clean.slice(0, 180) + (clean.length > 180 ? "..." : "");
  var start = Math.max(0, hitIndex - 70);
  var end = Math.min(clean.length, hitIndex + 110);
  var snippet = clean.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < clean.length) snippet += "...";
  return snippet;
}

function scoreDocument(doc, terms) {
  var title = normalizeText(doc.title);
  var body = normalizeText(doc.text);
  var score = 0;

  for (var i = 0; i < terms.length; i++) {
    var term = terms[i];
    if (title.indexOf(term) !== -1) score += 6;
    if (body.indexOf(term) !== -1) score += 2;
  }

  return score;
}

async function loadHtmlPageDocs(page) {
  var response = await fetch(page.url, { cache: "no-store" });
  if (!response.ok) return [];

  var html = await response.text();
  var doc = new DOMParser().parseFromString(html, "text/html");
  var selector = (page.selectors || []).join(",");
  var sections = selector ? doc.querySelectorAll(selector) : [];
  var items = [];

  sections.forEach(function (section) {
    var id = section.id;
    if (!id) return;

    var heading = section.querySelector("h1, h2, h3, h4");
    var title = heading ? heading.textContent.trim() : page.pageTitle;
    var text = section.textContent.replace(/\s+/g, " ").trim();
    if (!text) return;

    items.push({
      source: page.pageTitle,
      title: title || page.pageTitle,
      text: text,
      url: page.url + "#" + id
    });
  });

  return items;
}

async function loadJsonDocs(collection) {
  var response = await fetch(collection.url, { cache: "no-store" });
  if (!response.ok) return [];

  var payload = await response.json();
  var rows = readPath(payload, collection.itemsPath);
  if (!Array.isArray(rows)) return [];

  return rows.map(function (item) {
    var title = item[collection.titleField] || "Untitled";
    var extraText = (collection.textFields || [])
      .map(function (field) { return item[field] || ""; })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      source: collection.sectionLabel,
      title: title,
      text: extraText,
      url: collection.baseUrl + "#" + collection.anchorPrefix + slugify(title)
    };
  });
}

async function buildSearchIndex() {
  var cfg = window.SEARCH_CONFIG || {};
  var htmlPromises = (cfg.htmlPages || []).map(loadHtmlPageDocs);
  var jsonPromises = (cfg.jsonCollections || []).map(loadJsonDocs);
  var groups = await Promise.all(htmlPromises.concat(jsonPromises));
  return groups.flat();
}

function renderResults(query, documents) {
  var status = document.getElementById("search-status");
  var resultsEl = document.getElementById("search-results");
  if (!status || !resultsEl) return;

  var terms = normalizeText(query).split(" ").filter(Boolean);
  if (terms.length === 0) {
    status.textContent = "Enter a search term to start.";
    resultsEl.innerHTML = "";
    return;
  }

  var hits = documents
    .map(function (doc) {
      return { doc: doc, score: scoreDocument(doc, terms) };
    })
    .filter(function (entry) { return entry.score > 0; })
    .sort(function (a, b) { return b.score - a.score; });

  var maxResults = (window.SEARCH_CONFIG && window.SEARCH_CONFIG.maxResults) || 40;
  var shown = hits.slice(0, maxResults);
  status.textContent = shown.length + " result(s) for \"" + query + "\"";
  resultsEl.innerHTML = "";

  if (shown.length === 0) {
    resultsEl.innerHTML = "<p class=\"normaltext\">No matches found.</p>";
    return;
  }

  shown.forEach(function (entry) {
    var item = document.createElement("article");
    item.className = "search-result-item";

    var source = document.createElement("p");
    source.className = "search-result-source";
    source.textContent = entry.doc.source;

    var link = document.createElement("a");
    link.className = "search-result-title";
    link.href = entry.doc.url;
    link.textContent = entry.doc.title;

    var snippet = document.createElement("p");
    snippet.className = "search-result-snippet";
    snippet.textContent = buildSnippet(entry.doc.text, terms);

    item.appendChild(source);
    item.appendChild(link);
    item.appendChild(snippet);
    resultsEl.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  var input = document.getElementById("search-query");
  var status = document.getElementById("search-status");
  if (!input || !status) return;

  var q = getSearchQuery();
  input.value = q;
  status.textContent = "Indexing content...";

  try {
    var index = await buildSearchIndex();
    renderResults(q, index);
  } catch (error) {
    status.textContent = "Search index could not be loaded.";
    console.error(error);
  }
});
