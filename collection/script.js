function slugify(value) {
  if (window.buildSlug) return window.buildSlug(value);
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function indexById(rows) {
  var out = {};
  (rows || []).forEach(function (row) {
    if (row && row.id) out[row.id] = row;
  });
  return out;
}

function createImageViewer() {
  var overlay = document.createElement("div");
  overlay.className = "collection-viewer";
  overlay.setAttribute("aria-hidden", "true");

  var dialog = document.createElement("div");
  dialog.className = "collection-viewer-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", "Image viewer");

  var closeBtn = document.createElement("button");
  closeBtn.className = "collection-viewer-close";
  closeBtn.type = "button";
  closeBtn.textContent = "X";
  closeBtn.setAttribute("aria-label", "Close image viewer");

  var image = document.createElement("img");
  image.className = "collection-viewer-image";
  image.alt = "";

  var caption = document.createElement("p");
  caption.className = "collection-viewer-caption";

  dialog.appendChild(closeBtn);
  dialog.appendChild(image);
  dialog.appendChild(caption);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  function close() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("viewer-open");
  }

  function open(src, alt, captionText) {
    image.src = src;
    image.alt = alt || "";
    caption.textContent = captionText || "";
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("viewer-open");
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) close();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
  });

  return { open: open, close: close };
}

function makeItemCard(item, categoryMap, overCategoryMap, viewer) {
  var card = document.createElement("article");
  card.className = "collection-item";
  card.id = "collection-item-" + slugify(item.title);

  var title = document.createElement("h3");
  title.className = "collection-item-title";
  title.textContent = item.title || "Untitled";

  var meta = document.createElement("p");
  meta.className = "collection-item-meta";

  var category = categoryMap[item.category];
  var overCategory = overCategoryMap[item.overCategory];
  var categoryLabel = category ? category.label : "Uncategorized";
  var overCategoryLabel = overCategory ? overCategory.label : "Other";
  var status = item.status ? " - " + item.status : "";
  meta.textContent = overCategoryLabel + " / " + categoryLabel + status;

  if (item.image) {
    var thumbBtn = document.createElement("button");
    thumbBtn.type = "button";
    thumbBtn.className = "collection-thumb";
    thumbBtn.setAttribute("aria-label", "Open image for " + (item.title || "item"));

    var thumbImg = document.createElement("img");
    thumbImg.src = item.image;
    thumbImg.alt = item.imageAlt || item.title || "Collection item image";
    thumbImg.loading = "lazy";
    thumbImg.decoding = "async";

    thumbBtn.appendChild(thumbImg);
    thumbBtn.addEventListener("click", function () {
      viewer.open(
        item.image,
        item.imageAlt || item.title || "Collection item image",
        item.title || ""
      );
    });
    card.appendChild(thumbBtn);
  }

  card.appendChild(title);
  card.appendChild(meta);

  if (item.notes) {
    var notes = document.createElement("p");
    notes.className = "collection-item-notes";
    notes.textContent = item.notes;
    card.appendChild(notes);
  }

  if (item.link) {
    var link = document.createElement("a");
    link.className = "button";
    link.href = item.link;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open Link";
    card.appendChild(link);
  }

  return card;
}

function renderCollection(data) {
  var root = document.getElementById("collection-root");
  if (!root) return;
  var viewer = createImageViewer();

  var overCategories = Array.isArray(data.overCategories) ? data.overCategories : [];
  var categories = Array.isArray(data.categories) ? data.categories : [];
  var items = Array.isArray(data.items) ? data.items : [];

  var overCategoryMap = indexById(overCategories);
  var categoryMap = indexById(categories);

  root.innerHTML = "";

  overCategories.forEach(function (overCategory) {
    var section = document.createElement("section");
    section.className = "contentbox collection-overcategory";
    section.id = "collection-overcategory-" + slugify(overCategory.id);

    var header = document.createElement("h2");
    header.className = "collection-overcategory-title";
    header.textContent = overCategory.label;
    section.appendChild(header);

    if (overCategory.description) {
      var desc = document.createElement("p");
      desc.className = "normaltext collection-overcategory-description";
      desc.textContent = overCategory.description;
      section.appendChild(desc);
    }

    var categoryRows = categories.filter(function (cat) {
      return cat.overCategory === overCategory.id;
    });
    if (categoryRows.length > 0) {
      var categoryHint = document.createElement("p");
      categoryHint.className = "collection-categories-hint";
      categoryHint.textContent = "Categories: " + categoryRows.map(function (row) {
        return row.label;
      }).join(" · ");
      section.appendChild(categoryHint);
    }

    var cards = document.createElement("div");
    cards.className = "collection-grid";

    var overCategoryItems = items.filter(function (item) {
      return item.overCategory === overCategory.id;
    });

    if (overCategoryItems.length === 0) {
      var none = document.createElement("p");
      none.className = "normaltext";
      none.textContent = "No items in this overcategory yet.";
      section.appendChild(none);
    } else {
      overCategoryItems.forEach(function (item) {
        cards.appendChild(makeItemCard(item, categoryMap, overCategoryMap, viewer));
      });
      section.appendChild(cards);
    }

    root.appendChild(section);
  });

  if (window.applyHashTargetHighlight) {
    window.applyHashTargetHighlight();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("items.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load items.json");
      return res.json();
    })
    .then(renderCollection)
    .catch(function (error) {
      var root = document.getElementById("collection-root");
      if (root) {
        root.innerHTML = "<div class=\"contentbox\"><p class=\"normaltext\">Collection data could not be loaded.</p></div>";
      }
      console.error(error);
    });
});
