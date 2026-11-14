const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll("[data-reveal]");

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}


const projectSearch = document.querySelector("#project-search");
const archiveGrid = document.querySelector("#archive-grid");
const visibleProjectCount = document.querySelector("#visible-project-count");
const archiveEmpty = document.querySelector("#archive-empty");

if (projectSearch && archiveGrid && visibleProjectCount && archiveEmpty) {
  const archiveCards = [...archiveGrid.querySelectorAll(".archive-card")];
  const filterButtons = [...document.querySelectorAll(".filter-button[data-filter]")];
  let activeCategory = "all";

  const updateArchive = () => {
    const query = projectSearch.value.trim().toLowerCase();
    let visible = 0;

    archiveCards.forEach((card) => {
      const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      const searchable = `${card.dataset.search || ""} ${card.textContent}`.toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      card.hidden = !(matchesCategory && matchesSearch);
      if (!card.hidden) visible += 1;
    });

    visibleProjectCount.textContent = String(visible);
    archiveEmpty.hidden = visible > 0;
  };

  projectSearch.addEventListener("input", updateArchive);
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      updateArchive();
    });
  });
}
