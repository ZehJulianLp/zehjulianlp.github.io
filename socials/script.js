document.addEventListener("DOMContentLoaded", function () {
  // ===== Socials =====
  const socialsTarget = document.getElementById("socials-main"); // <div id="socials-main" class="social-container"></div>
  if (socialsTarget) {
    fetch("socials.json")
      .then(res => res.json())
      .then(data => {
        data.forEach(social => {
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
          link.textContent = social.button;

          text.appendChild(title);
          text.appendChild(desc);
          box.appendChild(icon);
          box.appendChild(text);
          box.appendChild(link);

          socialsTarget.appendChild(box);
        });
      })
      .catch(err => console.error("Error loading socials.json:", err));
  } else {
    console.warn("[Socials] #socials-main not found.");
  }

  // ===== Friends =====
  const friendsTarget = document.getElementById("friends-container"); // <div id="friends-container" class="social-container"></div>
  if (friendsTarget) {
    const friends = [
      { url: "https://scaliesne.st/", name: "Scalies' Nest" },
      { url: "https://wyndscale.carrd.co/", name: "dreki's website" },
      { url: "https://bluefi.re/", name: "Bluefire" },
      { url: "https://zwartice.com/", name: "Akir'scha" },
      { url: "https://bsky.app/profile/bluzu.bsky.social", name: "Bluzu" },
      { url: "https://jansel.dev/", name: "Jansel" },
      { url: "https://rhaeloth.tumblr.com/", name: "Rhaeloth" }
    ];

    friends.forEach(friend => {
      const favicon = `https://www.google.com/s2/favicons?sz=64&domain_url=${friend.url}`;
      const a = document.createElement("a");
      a.href = friend.url;
      a.target = "_blank";
      a.className = "friend-link";

      a.innerHTML = `
        <div class="friend-card">
          <img src="${favicon}" alt="${friend.name} favicon" class="social-icon">
          <span>${friend.name}</span>
        </div>
      `;

      friendsTarget.appendChild(a);
    });
  } else {
    console.warn("[Friends] #friends-container not found.");
  }
});
