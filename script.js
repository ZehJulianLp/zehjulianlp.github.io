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
age1.textContent = "Welcome to the webpage of Julian (he/they, "+ age + ").";

fetch("./projects/projects.json")
  .then((res) => res.json())
  .then((projects) => {
    const valid = projects.filter(p => !p.cancelled);
    const project = valid[Math.floor(Math.random() * valid.length)];

    document.getElementById("spotlight-image").src = project.image;
    document.getElementById("spotlight-image").alt = project.title;
    document.getElementById("spotlight-title").textContent = project.title;
    document.getElementById("spotlight-description").textContent = project.description;
    document.getElementById("spotlight-link").href = project.link;
  });


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
document.getElementById("random-quote").textContent = "“" + quote + "”";
