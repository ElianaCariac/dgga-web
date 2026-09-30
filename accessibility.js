/* ==========================================
   MÓDULO DE ACCESIBILIDAD
========================================== */

(function () {

  const STORAGE_KEY = "dgga-accessibility";

  const defaultSettings = {
    fontSize: 0,
    contrast: false,
    grayscale: false,
    underlineLinks: false,
    reduceMotion: false
  };


  let settings = loadSettings();


  /* ==========================================
     CREAR INTERFAZ
  ========================================== */

  const accessibility = document.createElement("div");

  accessibility.className = "accessibility";

  accessibility.innerHTML = `
    <button
      class="accessibility__toggle"
      type="button"
      aria-label="Abrir opciones de accesibilidad"
      aria-expanded="false"
      aria-controls="accessibility-panel"
      title="Accesibilidad"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm7 5H5a1 1 0 0 0 0 2h5v4.2L7.4 20a1 1 0 0 0 1.9.7L12 15.5l2.7 5.2a1 1 0 0 0 1.9-.7L14 13.2V9h5a1 1 0 0 0 0-2Z"/>
      </svg>
    </button>


    <div
      class="accessibility__panel"
      id="accessibility-panel"
      role="dialog"
      aria-labelledby="accessibility-title"
      hidden
    >

      <div class="accessibility__header">

        <h2 id="accessibility-title">
          Accesibilidad
        </h2>

        <button
          class="accessibility__close"
          type="button"
          aria-label="Cerrar opciones de accesibilidad"
        >
          ×
        </button>

      </div>


      <div class="accessibility__content">

        <div class="accessibility__group">

          <span class="accessibility__label">
            Tamaño del texto
          </span>

          <div class="accessibility__font-controls">

            <button
              class="accessibility__button"
              type="button"
              data-action="font-decrease"
              aria-label="Disminuir tamaño del texto"
            >
              A−
            </button>

            <button
              class="accessibility__button"
              type="button"
              data-action="font-default"
              aria-label="Restablecer tamaño del texto"
            >
              A
            </button>

            <button
              class="accessibility__button"
              type="button"
              data-action="font-increase"
              aria-label="Aumentar tamaño del texto"
            >
              A+
            </button>

          </div>

        </div>


        <div class="accessibility__group">

          <span class="accessibility__label">
            Visualización
          </span>

          <div class="accessibility__options">

            <button
              class="accessibility__button"
              type="button"
              data-setting="contrast"
              aria-pressed="false"
            >
              Alto contraste
            </button>

            <button
              class="accessibility__button"
              type="button"
              data-setting="grayscale"
              aria-pressed="false"
            >
              Escala de grises
            </button>

            <button
              class="accessibility__button"
              type="button"
              data-setting="underlineLinks"
              aria-pressed="false"
            >
              Subrayar enlaces
            </button>

            <button
              class="accessibility__button"
              type="button"
              data-setting="reduceMotion"
              aria-pressed="false"
            >
              Pausar animaciones
            </button>

          </div>

        </div>


        <button
          class="accessibility__button accessibility__reset"
          type="button"
          data-action="reset"
        >
          Restablecer ajustes
        </button>

      </div>

    </div>
  `;


  document.body.appendChild(accessibility);


  /* ==========================================
     ELEMENTOS
  ========================================== */

  const toggleButton =
    accessibility.querySelector(".accessibility__toggle");

  const panel =
    accessibility.querySelector(".accessibility__panel");

  const closeButton =
    accessibility.querySelector(".accessibility__close");

  const settingButtons =
    accessibility.querySelectorAll("[data-setting]");


  /* ==========================================
     ABRIR / CERRAR PANEL
  ========================================== */

  function openPanel() {

    panel.hidden = false;

    toggleButton.setAttribute(
      "aria-expanded",
      "true"
    );

    closeButton.focus();

  }


  function closePanel(returnFocus = true) {

    panel.hidden = true;

    toggleButton.setAttribute(
      "aria-expanded",
      "false"
    );

    if (returnFocus) {
      toggleButton.focus();
    }

  }


  toggleButton.addEventListener(
    "click",
    function () {

      if (panel.hidden) {
        openPanel();
      } else {
        closePanel();
      }

    }
  );


  closeButton.addEventListener(
    "click",
    function () {

      closePanel();

    }
  );


  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        !panel.hidden
      ) {

        closePanel();

      }

    }
  );


  /* ==========================================
     CONFIGURACIÓN
  ========================================== */

  function applySettings() {

    const root = document.documentElement;


    root.classList.remove(
      "accessibility-font-large",
      "accessibility-font-larger"
    );


    if (settings.fontSize === 1) {

      root.classList.add(
        "accessibility-font-large"
      );

    }


    if (settings.fontSize === 2) {

      root.classList.add(
        "accessibility-font-larger"
      );

    }


    root.classList.toggle(
      "accessibility-contrast",
      settings.contrast
    );


    root.classList.toggle(
      "accessibility-grayscale",
      settings.grayscale
    );


    root.classList.toggle(
      "accessibility-links",
      settings.underlineLinks
    );


    root.classList.toggle(
      "accessibility-reduce-motion",
      settings.reduceMotion
    );


    settingButtons.forEach(
      function (button) {

        const setting =
          button.dataset.setting;

        button.setAttribute(
          "aria-pressed",
          settings[setting]
            ? "true"
            : "false"
        );

      }
    );


    saveSettings();

  }


  /* ==========================================
     BOTONES
  ========================================== */

  accessibility.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest("button");

      if (!button) {
        return;
      }


      const setting =
        button.dataset.setting;


      if (setting) {

        settings[setting] =
          !settings[setting];

        applySettings();

        return;

      }


      const action =
        button.dataset.action;


      if (action === "font-increase") {

        settings.fontSize =
          Math.min(
            settings.fontSize + 1,
            2
          );

        applySettings();

      }


      if (action === "font-decrease") {

        settings.fontSize =
          Math.max(
            settings.fontSize - 1,
            0
          );

        applySettings();

      }


      if (action === "font-default") {

        settings.fontSize = 0;

        applySettings();

      }


      if (action === "reset") {

        settings = {
          ...defaultSettings
        };

        applySettings();

      }

    }
  );


  /* ==========================================
     LOCAL STORAGE
  ========================================== */

  function saveSettings() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );

    } catch (error) {

      /* El sitio continúa funcionando
         aunque localStorage no esté disponible */

    }

  }


  function loadSettings() {

    try {

      const storedSettings =
        localStorage.getItem(
          STORAGE_KEY
        );


      if (!storedSettings) {

        return {
          ...defaultSettings
        };

      }


      return {
        ...defaultSettings,
        ...JSON.parse(storedSettings)
      };


    } catch (error) {

      return {
        ...defaultSettings
      };

    }

  }


  /* ==========================================
     INICIAR
  ========================================== */

  applySettings();

})();