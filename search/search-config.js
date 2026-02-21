window.SEARCH_CONFIG = {
  // Extend search by adding entries to htmlPages or jsonCollections.
  // htmlPages: index static sections by selector (requires ids for deep links).
  // jsonCollections: index dynamic sources and map titles/descriptions to anchors.
  maxResults: 40,
  htmlPages: [
    { url: "/", pageTitle: "Home", selectors: [".contentbox", ".contentbox-social"] },
    { url: "/about/", pageTitle: "About Me", selectors: [".contentbox"] },
    { url: "/collection/", pageTitle: "Collection", selectors: [".contentbox"] },
    { url: "/dragon-stuff/", pageTitle: "Dragon Stuff", selectors: [".contentbox"] },
    { url: "/guestbook/", pageTitle: "Guestbook", selectors: [".contentbox"] },
    { url: "/socials/", pageTitle: "Social Media", selectors: [".socials-block"] }
  ],
  jsonCollections: [
    {
      url: "/projects/projects.json",
      itemsPath: "$",
      baseUrl: "/projects/",
      sectionLabel: "Projects",
      titleField: "title",
      textFields: ["description"],
      anchorPrefix: "project-"
    },
    {
      url: "/socials/socials.json",
      itemsPath: "socials",
      baseUrl: "/socials/",
      sectionLabel: "Social Media",
      titleField: "title",
      textFields: ["description", "link"],
      anchorPrefix: "social-"
    },
    {
      url: "/socials/socials.json",
      itemsPath: "friends",
      baseUrl: "/socials/",
      sectionLabel: "Friend Links",
      titleField: "title",
      textFields: ["link"],
      anchorPrefix: "friend-"
    },
    {
      url: "/collection/items.json",
      itemsPath: "items",
      baseUrl: "/collection/",
      sectionLabel: "Collection",
      titleField: "title",
      textFields: ["notes", "status", "category", "overCategory"],
      anchorPrefix: "collection-item-"
    }
  ]
};
