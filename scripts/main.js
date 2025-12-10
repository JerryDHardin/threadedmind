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
    function setOpen(key) {
      aboutBlocks.forEach((block) => {
        const isMatch = block.id === key;
        block.classList.toggle("open", isMatch);
      });
    }

    aboutToggles.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.key;
        const block = btn.closest(".about-block");
        const already = block.classList.contains("open");

        aboutBlocks.forEach((b) => b.classList.remove("open"));

        if (!already) {
          setOpen(key);
          if (history.replaceState) {
            history.replaceState(null, "", "#" + key);
          }
        } else if (history.replaceState) {
          history.replaceState(null, "", " ");
        }
      });
    });

    const hash = location.hash.replace("#", "");
    if (hash) {
      setOpen(hash);
    } else {
      setOpen("who");
    }
  }
})();
