/* Ana Beatriz Manso · portfólio
   Idiomas (PT/EN), menu, animações, vídeos e ampliação de imagens. */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "abm-lang";

  function save(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* armazenamento indisponível, o idioma vale só nesta página */
    }
  }

  /* ---------- Idiomas ---------- */
  function applyLang(lang, persist) {
    var en = lang === "en";
    root.dataset.lang = lang;
    root.lang = en ? "en" : "pt-BR";

    var docTitle = en ? root.dataset.docTitleEn : root.dataset.docTitlePt;
    if (docTitle) document.title = docTitle;

    var meta = document.querySelector('meta[name="description"]');
    if (meta && meta.dataset.en) {
      meta.setAttribute("content", en ? meta.dataset.en : meta.dataset.pt);
    }

    document.querySelectorAll("[data-alt-pt]").forEach(function (el) {
      el.alt = en ? el.dataset.altEn || el.dataset.altPt : el.dataset.altPt;
    });
    document.querySelectorAll("[data-label-pt]").forEach(function (el) {
      el.setAttribute("aria-label", en ? el.dataset.labelEn : el.dataset.labelPt);
    });
    document.querySelectorAll("[data-title-pt]").forEach(function (el) {
      el.setAttribute("title", en ? el.dataset.titleEn : el.dataset.titlePt);
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.setLang === lang));
    });

    var menuBtn = document.querySelector(".menu-btn");
    if (menuBtn) setMenuLabel(menuBtn);

    if (persist) {
      save(lang);
      try {
        var url = new URL(location.href);
        if (url.searchParams.has("lang")) {
          url.searchParams.set("lang", lang);
          history.replaceState(null, "", url);
        }
      } catch (e) {}
    }
  }

  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.dataset.setLang, true);
    });
  });

  applyLang(root.dataset.lang === "en" ? "en" : "pt", false);

  /* ---------- Cabeçalho ---------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Menu no celular ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var menu = document.getElementById("mobile-menu");

  function setMenuLabel(btn) {
    var open = btn.getAttribute("aria-expanded") === "true";
    var en = root.dataset.lang === "en";
    btn.textContent = open ? (en ? "Close" : "Fechar") : "Menu";
  }

  function toggleMenu(force) {
    if (!menuBtn || !menu) return;
    var open = typeof force === "boolean" ? force : menu.hidden;
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    root.style.overflow = open ? "hidden" : "";
    setMenuLabel(menuBtn);
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      toggleMenu();
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggleMenu(false);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        toggleMenu(false);
        menuBtn.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && !menu.hidden) toggleMenu(false);
    });
  }

  /* ---------- Revelação ao rolar ---------- */
  var revealables = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* ---------- Vídeos (MP4 hospedados no próprio site) ---------- */
  document.querySelectorAll(".clip").forEach(function (fig) {
    var video = fig.querySelector("video");
    var btn = fig.querySelector(".clip-play");
    if (!video) return;

    var fail = function () {
      fig.classList.add("has-error");
    };
    video.addEventListener("error", fail);
    var source = video.querySelector("source");
    if (source) source.addEventListener("error", fail);

    video.addEventListener("play", function () {
      fig.classList.add("is-playing");
      video.controls = true;
    });

    if (btn) {
      // Controles nativos só depois do play, para não brigar com a capa
      video.controls = false;
      btn.addEventListener("click", function () {
        fig.classList.add("is-playing");
        video.controls = true;
        video.preload = "auto";
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
        video.focus();
      });
    }
  });

  // Só um vídeo toca por vez
  document.addEventListener(
    "play",
    function (e) {
      if (e.target.tagName !== "VIDEO") return;
      document.querySelectorAll("video").forEach(function (v) {
        if (v !== e.target) v.pause();
      });
    },
    true
  );

  /* ---------- Ampliação de recortes ---------- */
  var dialog = document.querySelector(".lightbox");
  if (dialog && typeof dialog.showModal === "function") {
    var big = dialog.querySelector("img");
    var cap = dialog.querySelector(".lightbox-cap");
    document.querySelectorAll("[data-zoom]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var thumb = trigger.querySelector("img");
        var fig = trigger.closest("figure");
        var fc = fig && (fig.querySelector("[data-cap]") || fig.querySelector("figcaption"));
        big.src = trigger.dataset.zoom;
        big.alt = thumb ? thumb.alt : "";
        cap.textContent = fc ? fc.innerText.trim() : "";
        dialog.showModal();
      });
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
    });
    dialog.addEventListener("close", function () {
      big.removeAttribute("src");
    });
  } else {
    // Sem suporte a <dialog>, abre a imagem em nova aba
    document.querySelectorAll("[data-zoom]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        window.open(trigger.dataset.zoom, "_blank", "noopener");
      });
    });
  }

  /* ---------- Abas (respostas das IAs) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        select(tab, false);
      });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) {
          e.preventDefault();
          select(next, true);
        }
      });
    });
    select(tabs.filter(function (t) {
      return t.getAttribute("aria-selected") === "true";
    })[0] || tabs[0], false);
  });

  /* ---------- Números que contam ao aparecer ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
    var pad = function (n, width) {
      var str = String(n);
      while (str.length < width) str = "0" + str;
      return str;
    };
    var co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var end = parseInt(el.dataset.count, 10);
          var width = el.dataset.count.length;
          var t0 = null;
          co.unobserve(el);
          var step = function (ts) {
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / 1200, 1);
            el.textContent = pad(Math.round(end * (1 - Math.pow(1 - p, 3))), width);
            if (p < 1) window.requestAnimationFrame(step);
          };
          window.requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) {
      el.textContent = pad(0, el.dataset.count.length);
      co.observe(el);
    });
  }

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
