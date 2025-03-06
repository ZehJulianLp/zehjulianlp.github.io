document.addEventListener("DOMContentLoaded", function () {
    fetch("socials.json")
        .then(response => response.json())
        .then(data => {
            const container = document.createElement("div");
            container.classList.add("social-container");

            data.forEach(social => {
                const socialBox = document.createElement("div");
                socialBox.classList.add("social-box");

                const icon = document.createElement("object");
                icon.setAttribute("data", social.image);
                icon.setAttribute("type", "image/svg+xml");
                icon.classList.add("social-icon");

                const textDiv = document.createElement("div");
                textDiv.classList.add("social-box-text");

                const title = document.createElement("h2");
                title.textContent = social.title;

                const description = document.createElement("p");
                description.textContent = social.description;

                textDiv.appendChild(title);
                textDiv.appendChild(description);

                const link = document.createElement("a");
                link.setAttribute("href", social.link);
                link.setAttribute("target", "_blank");
                link.textContent = social.button;

                socialBox.appendChild(icon);
                socialBox.appendChild(textDiv);
                socialBox.appendChild(link);

                container.appendChild(socialBox);
            });

            document.body.appendChild(container);
        })
        .catch(error => console.error("Error loading JSON:", error));
});
