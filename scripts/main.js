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
  const aboutBlocks = document.querySelectorAll(".about-block");
  const aboutToggles = document.querySelectorAll(".about-toggle");

  if (aboutBlocks.length && aboutToggles.length) {
    // Attach simple toggle handlers
    aboutToggles.forEach((btn) => {
      btn.addEventListener("click", () => {
        const block = btn.closest(".about-block");
        if (!block) return;

        // Toggle only this block
        block.classList.toggle("open");
      });
    });

    // LOG SPEAKER HIGHLIGHTING
const logPres = document.querySelectorAll(".log-pre");

logPres.forEach((pre) => {
  let html = pre.innerHTML;

  // Normalize labels
  html = html.replace(
    /^You said:/gm,
    '<span class="speaker speaker-user">User said:</span>'
  );

  html = html.replace(
    /^ChatGPT said:/gm,
    '<span class="speaker speaker-gpt">ChatGPT said:</span>'
  );

  pre.innerHTML = html;
});

    // On load: open the hashed section if present, otherwise open "who"
    const hash = window.location.hash.slice(1);
    if (hash) {
      const target = document.getElementById(hash);
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
})();
