(function () {
  const root = document.documentElement;
  const THEME_KEY = "tm:theme";
  const FILTER_KEY = "tm:filters";

  // THEME SELECT
  const themeSelect = document.getElementById("themeSelect");

  if (themeSelect) {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (
        savedTheme === "dark" ||
        savedTheme === "light" ||
        savedTheme === "terminal"
      ) {
        root.setAttribute("data-theme", savedTheme);
        themeSelect.value = savedTheme;
      }
    } catch (e) {}

    themeSelect.addEventListener("change", () => {
      const value = themeSelect.value;
      root.setAttribute("data-theme", value);
      try {
        localStorage.setItem(THEME_KEY, value);
      } catch (e) {}
    });
  }

  // FILTER CHECKBOXES (HOME PAGE)
  const filterBoxes = Array.from(
    document.querySelectorAll(".filter-checkbox")
  );

  if (filterBoxes.length) {
    try {
      const savedFilters = JSON.parse(localStorage.getItem(FILTER_KEY));
      if (savedFilters && typeof savedFilters === "object") {
        filterBoxes.forEach((box) => {
          const key = box.dataset.key;
          if (key in savedFilters) {
            box.checked = !!savedFilters[key];
          }
        });
      }
    } catch (e) {}

    function saveFilters() {
      const state = {};
      filterBoxes.forEach((box) => {
        state[box.dataset.key] = box.checked;
      });
      try {
        localStorage.setItem(FILTER_KEY, JSON.stringify(state));
      } catch (e) {}
    }

    filterBoxes.forEach((box) => {
      box.addEventListener("change", saveFilters);
    });
  }

  // LATEST POST EXPAND/COLLAPSE (HOME)
  const latestBody = document.getElementById("latestBody");
  const expandBtn = document.getElementById("expandBtn");

  if (latestBody && expandBtn) {
    expandBtn.addEventListener("click", () => {
      const collapsed = latestBody.classList.toggle("collapsed");
      expandBtn.textContent = collapsed ? "click to expand down" : "collapse";
      expandBtn.setAttribute("aria-expanded", String(!collapsed));
    });
  }

  // ABOUT ACCORDIONS
  const aboutBlocks = Array.from(document.querySelectorAll(".about-block"));
  const aboutToggles = Array.from(document.querySelectorAll(".about-toggle"));

  if (aboutBlocks.length && aboutToggles.length) {
    // Helper: open a block by id (used on page load + hash)
    function openBlockById(id) {
      const block = aboutBlocks.find((b) => b.id === id);
      if (block) {
        block.classList.add("open");
      }
    }

    aboutToggles.forEach((btn) => {
      btn.addEventListener("click", () => {
        const block = btn.closest(".about-block");
        if (!block) return;

        const key = block.id;
        const alreadyOpen = block.classList.contains("open");

        // Toggle ONLY this block, leave others alone
        block.classList.toggle("open");

        // Update URL hash to the last toggled section (or clear if just closed)
        if (history.replaceState) {
          if (!alreadyOpen) {
            history.replaceState(null, "", "#" + key);
          } else {
            // Clear hash but keep path + query
            const url = location.pathname + location.search;
            history.replaceState(null, "", url);
          }
        }
      });
    });

    // On load: open the hashed section if present, otherwise open "who"
    const hash = location.hash.replace("#", "");
    if (hash) {
      openBlockById(hash);
    } else {
      openBlockById("who");
    }
  }


    // On load: open the hashed section if present, otherwise open "who"
    const hash = location.hash.replace("#", "");
    if (hash) {
      const target = aboutBlocks.find((block) => block.id === hash);
      if (target) {
        target.classList.add("open");
      }
    } else {
      const whoBlock = document.getElementById("who");
      if (whoBlock) {
        whoBlock.classList.add("open");
      }
    }
  }
