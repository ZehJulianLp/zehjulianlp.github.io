document.addEventListener("DOMContentLoaded", function () {
  const socialsTarget = document.getElementById("socials-main");
  const friendsTarget = document.getElementById("friends-container");

  function getInitials(name) {
    const cleaned = name.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "FR";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function getDomain(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (_) {
      return url;
    }
  }

  function getFaviconCandidates(domain) {
    return [
      `https://www.google.com/s2/favicons?sz=64&domain=${domain}`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `https://${domain}/favicon.ico`
    ];
  }

  function tryFavicon(img, fallback, urls, index) {
    if (index >= urls.length) {
      img.style.opacity = "0";
      fallback.style.display = "grid";
      return;
    }

    const url = urls[index];
    let done = false;
    const timeout = setTimeout(() => {
      if (done) return;
      done = true;
      tryFavicon(img, fallback, urls, index + 1);
    }, 2500);

    img.onload = () => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      img.style.opacity = "1";
      fallback.style.display = "none";
    };

    img.onerror = () => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      tryFavicon(img, fallback, urls, index + 1);
    };

    img.src = url;
  }

  fetch("socials.json")
    .then(res => res.json())
    .then(data => {
      const socials = Array.isArray(data.socials) ? data.socials : [];
      const friends = Array.isArray(data.friends) ? data.friends : [];

      if (socialsTarget) {
        socials.forEach(social => {
          const box = document.createElement("div");
          box.classList.add("social-box");

          const icon = document.createElement("object");
          icon.setAttribute("data", social.image);
          icon.setAttribute("type", "image/svg+xml");
          icon.classList.add("social-icon");

          const text = document.createElement("div");
          text.classList.add("social-box-text");

          const title = document.createElement("h2");
          title.textContent = social.title;

          const desc = document.createElement("p");
          desc.textContent = social.description;

          const link = document.createElement("a");
          link.href = social.link;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = social.button;

          text.appendChild(title);
          text.appendChild(desc);
          box.appendChild(icon);
          box.appendChild(text);
          box.appendChild(link);

          socialsTarget.appendChild(box);
        });
      }

      if (friendsTarget) {
        friends.forEach(friend => {
          const friendName = friend.title;
          const friendUrl = friend.link;
          const domainName = getDomain(friendUrl);

          const card = document.createElement("article");
          card.className = "social-box friend-box";

          const badge = document.createElement("div");
          badge.className = "friend-badge";
          const initials = document.createElement("span");
          initials.className = "friend-initials";
          initials.textContent = getInitials(friendName);

          const favicon = document.createElement("img");
          favicon.className = "friend-favicon";
          favicon.alt = `${friendName} favicon`;
          favicon.loading = "eager";
          favicon.decoding = "async";

          badge.appendChild(initials);
          badge.appendChild(favicon);
          tryFavicon(favicon, initials, getFaviconCandidates(domainName), 0);

          const name = document.createElement("h3");
          name.className = "friend-name";
          name.textContent = friendName;

          const domain = document.createElement("p");
          domain.className = "friend-domain";
          domain.textContent = domainName;

          const link = document.createElement("a");
          link.href = friendUrl;
          link.target = "_blank";
          link.rel = "noopener";
          link.className = "button";
          link.textContent = "Visit";

          card.appendChild(badge);
          card.appendChild(name);
          card.appendChild(domain);
          card.appendChild(link);
          friendsTarget.appendChild(card);
        });
      }
    })
    .catch(err => console.error("Error loading socials.json:", err));
});
