(function () {
  const STORAGE_KEY = "FLATS_FILTER";
  const HIDE_TEXT = "Hide";
  const UNDO_TEXT = "Undo";
  const BTN_BG = "#fff";
  const BTN_ACTIVE_BG = "#f88";
  const BTN_COLOR = "#000";
  const BTN_ACTIVE_COLOR = "#666";
  const BTN_STYLE = {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    zIndex: "1337",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "bold",
    padding: "5px 10px",
    border: "1px solid black",
    borderRadius: "5px",
    backgroundColor: BTN_BG,
    color: BTN_COLOR,
  };

  function loadFilters() {
    try {
      const filters = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(filters) ? filters : [];
    } catch (_) {
      return [];
    }
  }

  function saveFilters(filters) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }

  // Some sites are doing some js magic, just wait for it to complete in random amount of time
  setTimeout(() => {
    if (location.hostname.endsWith("morizon.pl")) {
      initMorizon();
    } else if (location.hostname.endsWith("otodom.pl")) {
      initOtodom();
    } else if (location.hostname.endsWith("olx.pl")) {
      initOlx();
    }
  }, 500);

  function createFilterButton(filters, id) {
    let filtered = false;

    const btn = document.createElement("button");
    btn.innerText = HIDE_TEXT;

    for (let key in BTN_STYLE) {
      btn.style[key] = BTN_STYLE[key];
    }

    btn.addEventListener("mouseenter", () => {
      btn.style.color = BTN_ACTIVE_COLOR;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.color = BTN_COLOR;
    });

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      if (filtered) {
        filtered = false;
        filters.splice(filters.indexOf(id), 1);

        btn.innerText = HIDE_TEXT;
        btn.style.backgroundColor = BTN_BG;
      } else {
        filtered = true;
        filters.push(id);

        btn.innerText = UNDO_TEXT;
        btn.style.backgroundColor = BTN_ACTIVE_BG;
      }

      saveFilters(filters);
    });

    return btn;
  }

  function initMorizon() {
    try {
      // Clean up annoying elements
      document.querySelectorAll(".bb-list-slot").forEach((el) => el.remove());
      document.querySelector("#developerator").remove();
    } catch (_) {}

    const filters = loadFilters();
    const listings = document.querySelectorAll(
      ".propertyListingBox > section [data-id]"
    );

    const extractId = (el) => {
      return el.dataset.id;
    };

    listings.forEach((el) => {
      const id = extractId(el);

      if (filters.includes(id)) {
        el.remove();
        return;
      }

      // Remove all event listeners to prevent click hijacking
      const clone = el.cloneNode(true);
      el.replaceWith(clone);

      const btn = createFilterButton(filters, id);
      const container = clone.querySelector("div");
      container.style.position = "relative";
      container.appendChild(btn);
    });

    // Restore loaded images
    setTimeout(() => {
      document.querySelectorAll("img").forEach((img) => {
        if (img.classList.contains("lazy") && img.dataset.original) {
          img.src = img.dataset.original;
        }
      });
    }, 500);
  }

  function initOtodom() {
    const filters = loadFilters();
    const listings = document.querySelectorAll(
      '[data-cy="search.listing"] ul li a'
    );

    const extractId = (el) => {
      const segments = el.href.split("-");
      return segments[segments.length - 1];
    };

    listings.forEach((el) => {
      const id = extractId(el);

      if (filters.includes(id)) {
        el.remove();
        return;
      }

      const btn = createFilterButton(filters, id);
      el.style.position = "relative";
      el.appendChild(btn);
    });
  }

  function initOlx() {
    // Clean up annoying elements
    try {
      document
        .querySelectorAll("[data-testid=listing-grid] > div")
        .forEach((el) => {
          if (el.innerText.includes("Zapisz to wyszukiwanie")) {
            el.remove();
          }
        });
      document
        .querySelectorAll("[data-testid=qa-advert-slot]")
        .forEach((el) => el.remove());
    } catch (_) {}

    const filters = loadFilters();
    const listings = document.querySelectorAll(
      '[data-testid="listing-grid"] [data-cy=l-card]'
    );

    const extractId = (el) => {
      const segments = el.querySelector("a").href.split("-");
      return segments[segments.length - 1].split(".")[0];
    };

    listings.forEach((el) => {
      const id = extractId(el);

      if (filters.includes(id)) {
        el.remove();
        return;
      }

      const btn = createFilterButton(filters, id);
      el.style.position = "relative";
      el.appendChild(btn);
    });
  }
})();
