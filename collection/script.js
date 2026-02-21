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

  var prevBtn = document.createElement("button");
  prevBtn.className = "collection-viewer-arrow collection-viewer-prev";
  prevBtn.type = "button";
  prevBtn.textContent = "<";
  prevBtn.setAttribute("aria-label", "Previous image");

  var nextBtn = document.createElement("button");
  nextBtn.className = "collection-viewer-arrow collection-viewer-next";
  nextBtn.type = "button";
  nextBtn.textContent = ">";
  nextBtn.setAttribute("aria-label", "Next image");

  var caption = document.createElement("div");
  caption.className = "collection-viewer-caption";
  var captionTitle = document.createElement("p");
  captionTitle.className = "collection-viewer-caption-title";
  var captionMeta = document.createElement("p");
  captionMeta.className = "collection-viewer-caption-meta";
  var captionNotes = document.createElement("p");
  captionNotes.className = "collection-viewer-caption-notes";
  caption.appendChild(captionTitle);
  caption.appendChild(captionMeta);
  caption.appendChild(captionNotes);

  dialog.appendChild(closeBtn);
  dialog.appendChild(prevBtn);
  dialog.appendChild(image);
  dialog.appendChild(nextBtn);
  dialog.appendChild(caption);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  var galleryItems = [];
  var currentIndex = -1;

  function renderCurrent() {
    if (!galleryItems.length || currentIndex < 0) return;
    var item = galleryItems[currentIndex];
    image.src = item.src;
    image.alt = item.alt || "";
    captionTitle.textContent = item.title || "";
    captionMeta.textContent = item.meta || "";
    captionNotes.textContent = item.notes || "";
    captionNotes.style.display = item.notes ? "block" : "none";
    var showArrows = galleryItems.length > 1;
    prevBtn.style.display = showArrows ? "grid" : "none";
    nextBtn.style.display = showArrows ? "grid" : "none";
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("viewer-open");
  }

  function openIndex(index) {
    if (!galleryItems.length) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    renderCurrent();
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("viewer-open");
  }

  function openByKey(key) {
    var idx = galleryItems.findIndex(function (item) {
      return item.key === key;
    });
    if (idx === -1) return;
    openIndex(idx);
  }

  function setItems(items) {
    galleryItems = Array.isArray(items) ? items : [];
    currentIndex = -1;
    renderCurrent();
  }

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", function () {
    openIndex(currentIndex - 1);
  });
  nextBtn.addEventListener("click", function () {
    openIndex(currentIndex + 1);
  });
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) close();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
    if (!overlay.classList.contains("is-open")) return;
    if (event.key === "ArrowLeft") openIndex(currentIndex - 1);
    if (event.key === "ArrowRight") openIndex(currentIndex + 1);
  });

  return { setItems: setItems, openByKey: openByKey, close: close };
}

function makeItemCard(item, categoryMap, overCategoryMap, viewer, itemKey) {
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
      viewer.openByKey(itemKey);
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
  var viewerItems = [];

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
        var itemKey = "collection-item-" + slugify(item.title);
        if (item.image) {
          var category = categoryMap[item.category];
          var overCategory = overCategoryMap[item.overCategory];
          var categoryLabel = category ? category.label : "Uncategorized";
          var overCategoryLabel = overCategory ? overCategory.label : "Other";
          var status = item.status ? " - " + item.status : "";
          viewerItems.push({
            key: itemKey,
            src: item.image,
            alt: item.imageAlt || item.title || "Collection item image",
            title: item.title || "",
            meta: overCategoryLabel + " / " + categoryLabel + status,
            notes: item.notes || ""
          });
        }
        cards.appendChild(makeItemCard(item, categoryMap, overCategoryMap, viewer, itemKey));
      });
      section.appendChild(cards);
    }

    root.appendChild(section);
  });

  viewer.setItems(viewerItems);

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
