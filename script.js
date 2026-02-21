function calculateAge(birthday) {
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    if(today.getMonth() < birthDate.getMonth() || (today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

var birthday = '2003-09-16';
var age = calculateAge(birthday);

var age1 = document.getElementById('age');
if (age1) {
    age1.textContent = "Welcome to the webpage of Julian (he/they, "+ age + ").";
}

function buildSlug(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getHashTarget() {
    var hash = window.location.hash || "";
    if (!hash.startsWith("#")) return null;
    var id = decodeURIComponent(hash.slice(1));
    if (!id) return null;
    return document.getElementById(id);
}

function applyHashTargetHighlight() {
    var target = getHashTarget();
    if (!target) return;

    target.classList.add("hash-target");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(function () {
        target.classList.remove("hash-target");
    }, 2200);
}

function addNavbarSearch() {
    var navbar = document.querySelector(".navbar");
    if (!navbar || navbar.querySelector(".site-search")) return;

    var form = document.createElement("form");
    form.className = "site-search";
    form.action = "/search/";
    form.method = "get";
    form.setAttribute("role", "search");

    var input = document.createElement("input");
    input.type = "search";
    input.name = "q";
    input.placeholder = "Search website...";
    input.setAttribute("aria-label", "Search website");

    var button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Search";

    form.appendChild(input);
    form.appendChild(button);
    navbar.appendChild(form);
}

function initMobileNavbar() {
    var navbar = document.querySelector(".navbar");
    if (!navbar || navbar.querySelector(".navbar-toggle")) return;

    var navContainer = navbar.querySelector(".nav, .nav-items");
    if (!navContainer) return;

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "navbar-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "site-main-nav");
    toggle.setAttribute("aria-label", "Toggle navigation");
    toggle.innerHTML = "<span></span><span></span><span></span>";

    navContainer.id = "site-main-nav";

    var logo = navbar.querySelector(".logo");
    if (logo && logo.nextSibling) {
        navbar.insertBefore(toggle, logo.nextSibling);
    } else {
        navbar.appendChild(toggle);
    }

    function closeMenu() {
        navbar.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
        var isOpen = navbar.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navbar.querySelectorAll(".navitem a").forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.matchMedia("(max-width: 767px)").matches) closeMenu();
        });
    });

    window.addEventListener("resize", function () {
        if (!window.matchMedia("(max-width: 767px)").matches) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
    });
}

function focusSearchInput() {
    var searchInput = document.querySelector(".site-search input[name='q']");
    if (!searchInput) return false;

    var navbar = document.querySelector(".navbar");
    if (navbar && window.matchMedia("(max-width: 767px)").matches && !navbar.classList.contains("is-open")) {
        navbar.classList.add("is-open");
        var toggle = navbar.querySelector(".navbar-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "true");
    }

    searchInput.focus();
    searchInput.select();
    return true;
}

function initSearchShortcut() {
    document.addEventListener("keydown", function (event) {
        var isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
        if (!isShortcut) return;
        event.preventDefault();
        focusSearchInput();
    });
}

window.applyHashTargetHighlight = applyHashTargetHighlight;
window.buildSlug = buildSlug;

document.addEventListener("DOMContentLoaded", function () {
    addNavbarSearch();
    initMobileNavbar();
    initSearchShortcut();
    window.setTimeout(applyHashTargetHighlight, 100);
});

const spotlightImage = document.getElementById("spotlight-image");
const spotlightTitle = document.getElementById("spotlight-title");
const spotlightDescription = document.getElementById("spotlight-description");
const spotlightLink = document.getElementById("spotlight-link");

if (spotlightImage && spotlightTitle && spotlightDescription && spotlightLink) {
  fetch("./projects/projects.json")
    .then((res) => res.json())
    .then((projects) => {
      const valid = projects.filter(p => !p.cancelled);
      const project = valid[Math.floor(Math.random() * valid.length)];

      spotlightImage.src = project.image;
      spotlightImage.alt = project.title;
      spotlightTitle.textContent = project.title;
      spotlightDescription.textContent = project.description;
      spotlightLink.href = project.link;
    });
}


const quotes = [
  "Redstone doesn't lie. People just forget what they built.",
  "A system is only as smart as the chaos it can handle.",
  "If it works, automate it. If it doesn’t, debug it. If it breaks, document it.",
  "I don't write code. I build stories that compile.",
  "Clean code is like clean tracks. Both keep things moving.",
  "Sometimes, fixing a bug means redesigning the whole city.",
  "Accessibility is not optional. It's how you show respect to users you’ve never met.",
  "Every function tells a story. Sometimes it’s a horror story.",
  "I’ve spent more time naming variables than naming pets.",
  "Front-end without structure is like Redstone without logic gates.",
  "Minecraft is my whiteboard. Redstone is my ink.",
  "Rails are just another way to express control in chaos.",
  "Stations are more than stops. They're opportunities for connection.",
  "If your subway network doesn’t make you smile, it’s not done yet.",
  "Accessibility ramps? Always. Even in block worlds.",
  "Planning fictional infrastructure teaches you real-world patience.",
  "Redstone & Rails isn’t a map. It’s a mindset.",
  "I’m not roleplaying a dragon. I just stopped pretending to be human.",
  "SeaWings feel like me. Calm. Deep. Watching everything.",
  "Wings aren't always visible. Sometimes they're just emotional.",
  "Being a dragon isn't escapism. It's coming home.",
  "Meditating in my inner world feels more real than most cities I've seen.",
  "When I dream, I fly without doubting it.",
  "Some people have alter egos. I have scales.",
  "My music is a love letter to synths and starlight.",
  "EDM and ambient? I call it spacewave for the soul.",
  "Sometimes I write music for levels that don’t exist yet.",
  "Sound design is just storytelling with waveforms.",
  "If my brain could sing, it’d sound like a broken VHS synthwave loop.",
  "I collect oddly specific Discord messages like trophies.",
  "I trust Wikipedia rabbit holes more than most news outlets.",
  "Being cringe is a form of digital self-expression.",
  "British humour shaped my soul and ruined my spelling.",
  "Yes, I name my Minecraft stations. No, I’m not sorry.",
  "You don’t need lore if your worldbuilding slaps hard enough.",
  "My hobbies include making fake websites for real fictional companies.",
  "I find peace in schedules and chaos in silence.",
  "Known places give me safety. Unknown bugs give me headaches.",
  "My flow state starts with a terminal and ends with forgotten time.",
  "Some people chase productivity. I chase coherence.",
  "It’s not a meltdown. It’s a system overload.",
  "Planning isn’t control. It’s compassion for your future self.",
  "Overwhelm isn’t weakness. It’s unmet structure.",
  "I don’t dream of being different. I just remember who I was.",
  "The most real things in my life exist in fictional spaces.",
  "A dragon’s identity is built, not born — but it still feels ancient.",
  "Weird is just what happens when you stop hiding.",
  "Every world I build is a piece of myself I couldn’t say out loud.",
  "Rituals aren’t routines. They’re anchors in a sea of unpredictability.",
  "You don’t need to make sense to everyone. Just to yourself.",
  "The surface is a place to judge – depth is a place to understand."
];
const quote = quotes[Math.floor(Math.random() * quotes.length)];
const randomQuote = document.getElementById("random-quote");
if (randomQuote) {
  randomQuote.textContent = "“" + quote + "”";
}
