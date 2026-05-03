(function () {
  'use strict';

  /* ── Build the header HTML ─────────────────────────────── */
  function buildHeader() {
    var h = document.createElement('header');
    h.id = 'df-header';
    h.setAttribute('role', 'banner');

    /* Determine the root-relative prefix so links work from any subdirectory.
       Works for: file:// local browsing at any depth. */
    var pathParts = window.location.pathname.split('/');
    // Find the index of 'formlabs.com' in path
    var fcIdx = pathParts.indexOf('formlabs.com');
    var depth = fcIdx !== -1 ? pathParts.length - fcIdx - 2 : 0;
    var prefix = '';
    for (var i = 0; i < depth; i++) prefix += '../';

    var root = prefix || './';

    h.innerHTML = '\
<div class="df-inner">\
  <a class="df-logo" href="' + root + 'index.html" id="df-logo-link" title="Dualform">\
    <img src="' + root + 'Resources-Img-Vid/Dualform_logo_background_removed.png"\
         alt="Dualform"\
         class="df-logo-img"\
         draggable="false"\
    />\
    <span class="df-logo-text">Dualform</span>\
  </a>\
\
  <nav aria-label="Menú principal">\
    <ul class="df-nav" id="df-main-nav">\
\
      <!-- 1. Impresión 3D -->\
      <li class="df-nav-item">\
        <a class="df-nav-link" href="' + root + 'impresion-3d/index.html" id="nav-impresion">\
          Impresión 3D\
          <svg class="df-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>\
        </a>\
        <div class="df-dropdown" role="menu">\
          <a href="' + root + 'impresion-3d/index.html" role="menuitem">Impresión FDM</a>\
          <a href="' + root + 'impresion-3d/index.html" role="menuitem">Diseño 3D</a>\
          <div class="df-drop-divider"></div>\
          <a href="' + root + 'materiales/index.html" role="menuitem">Materiales para impresión</a>\
          <a href="' + root + 'software/index.html" role="menuitem">Software relacionado</a>\
        </div>\
      </li>\
\
      <!-- 2. Inyección de Plástico -->\
      <li class="df-nav-item">\
        <a class="df-nav-link" href="' + root + 'inyeccion-de-plastico/index.html" id="nav-inyeccion">\
          Inyección de Plástico\
          <svg class="df-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>\
        </a>\
        <div class="df-dropdown" role="menu">\
          <a href="' + root + 'inyeccion-de-plastico/index.html" role="menuitem">Inyección de alto volumen</a>\
          <a href="' + root + 'inyeccion-de-plastico/index.html" role="menuitem">Inyección de bajo volumen</a>\
        </div>\
      </li>\
\
      <!-- 3. Aplicaciones -->\
      <li class="df-nav-item">\
        <a class="df-nav-link" href="' + root + 'aplicaciones/index.html" id="nav-aplicaciones">\
          Aplicaciones\
          <svg class="df-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>\
        </a>\
        <div class="df-dropdown" role="menu">\
          <a href="' + root + 'aplicaciones/index.html" role="menuitem">Creación rápida de prototipos</a>\
          <a href="' + root + 'aplicaciones/index.html" role="menuitem">Fabricación de piezas de uso final</a>\
        </div>\
      </li>\
\
      <!-- 4. Industria -->\
      <li class="df-nav-item">\
        <a class="df-nav-link" href="' + root + 'industria/index.html" id="nav-industria">\
          Industria\
          <svg class="df-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>\
        </a>\
        <div class="df-dropdown" role="menu">\
          <a href="' + root + 'industria/index.html" role="menuitem">Ingeniería</a>\
          <a href="' + root + 'industria/index.html" role="menuitem">Fabricación</a>\
        </div>\
      </li>\
\
      <!-- 5. Servicios -->\
      <li class="df-nav-item">\
        <a class="df-nav-link" href="' + root + 'servicios/index.html" id="nav-servicios">\
          Servicios\
          <svg class="df-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>\
        </a>\
        <div class="df-dropdown" role="menu">\
          <a href="' + root + 'servicios/index.html" role="menuitem">Prototipado rápido</a>\
          <a href="' + root + 'servicios/index.html" role="menuitem">Fabricación de piezas funcionales</a>\
          <a href="' + root + 'servicios/index.html" role="menuitem">Asesoría técnica</a>\
          <div class="df-drop-divider"></div>\
          <a href="' + root + 'contacto/index.html" role="menuitem">Solicitar cotización</a>\
        </div>\
      </li>\
\
      <!-- 6. Contacto -->\
      <li class="df-nav-item df-nav-direct">\
        <a class="df-nav-link" href="' + root + 'contacto/index.html" id="nav-contacto">Contacto</a>\
      </li>\
\
    </ul>\
  </nav>\
\
  <div class="df-cta">\
    <a class="df-cta-btn" href="' + root + 'contacto/index.html" id="df-cta-main">\
      <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.5 1.23 2 2 0 012.48 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>\
      Solicitar cotización\
    </a>\
  </div>\
\
  <button class="df-hamburger" id="df-hamburger-btn" aria-label="Abrir menú" aria-expanded="false" aria-controls="df-mobile-drawer">\
    <svg class="df-menu-icon" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>\
    <svg class="df-close-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>\
  </button>\
</div>';

    return { header: h, root: root };
  }

  /* ── Build mobile drawer ───────────────────────────────── */
  function buildDrawer(root) {
    var d = document.createElement('div');
    d.id = 'df-mobile-drawer';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'false');
    d.setAttribute('aria-label', 'Menú de navegación');

    var items = [
      {
        label: 'Impresión 3D',
        href: root + 'impresion-3d/index.html',
        sub: [
          { label: 'Impresión FDM', href: root + 'impresion-3d/index.html' },
          { label: 'Diseño 3D', href: root + 'impresion-3d/index.html' },
          { label: 'Materiales para impresión', href: root + 'materiales/index.html' },
          { label: 'Software relacionado', href: root + 'software/index.html' }
        ]
      },
      {
        label: 'Inyección de Plástico',
        href: root + 'inyeccion-de-plastico/index.html',
        sub: [
          { label: 'Inyección de alto volumen', href: root + 'inyeccion-de-plastico/index.html' },
          { label: 'Inyección de bajo volumen', href: root + 'inyeccion-de-plastico/index.html' }
        ]
      },
      {
        label: 'Aplicaciones',
        href: root + 'aplicaciones/index.html',
        sub: [
          { label: 'Creación rápida de prototipos', href: root + 'aplicaciones/index.html' },
          { label: 'Fabricación de piezas de uso final', href: root + 'aplicaciones/index.html' }
        ]
      },
      {
        label: 'Industria',
        href: root + 'industria/index.html',
        sub: [
          { label: 'Ingeniería', href: root + 'industria/index.html' },
          { label: 'Fabricación', href: root + 'industria/index.html' }
        ]
      },
      {
        label: 'Servicios',
        href: root + 'servicios/index.html',
        sub: [
          { label: 'Prototipado rápido', href: root + 'servicios/index.html' },
          { label: 'Fabricación de piezas funcionales', href: root + 'servicios/index.html' },
          { label: 'Asesoría técnica', href: root + 'servicios/index.html' },
          { label: 'Solicitar cotización', href: root + 'contacto/index.html' }
        ]
      },
      {
        label: 'Contacto',
        href: root + 'contacto/index.html',
        sub: null
      }
    ];

    var html = '';

    items.forEach(function (item, idx) {
      if (item.sub) {
        html += '<div class="df-mob-item" id="df-mob-item-' + idx + '">';
        html += '<button class="df-mob-trigger" aria-expanded="false" aria-controls="df-mob-sub-' + idx + '">';
        html += item.label;
        html += '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>';
        html += '</button>';
        html += '<div class="df-mob-sub" id="df-mob-sub-' + idx + '" role="menu">';
        item.sub.forEach(function (s) {
          html += '<a href="' + s.href + '" role="menuitem">' + s.label + '</a>';
        });
        html += '</div></div>';
      } else {
        html += '<div class="df-mob-item df-mob-direct">';
        html += '<a href="' + item.href + '">' + item.label + '</a>';
        html += '</div>';
      }
    });

    html += '<div class="df-mob-cta"><a href="' + root + 'contacto/index.html">Solicitar cotización</a></div>';

    d.innerHTML = html;
    return d;
  }

  /* ── Wire up mobile accordion ──────────────────────────── */
  function initMobileAccordion(drawer) {
    var triggers = drawer.querySelectorAll('.df-mob-trigger');
    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.df-mob-item');
        var isOpen = item.classList.contains('df-mob-open');

        // Close all
        drawer.querySelectorAll('.df-mob-item.df-mob-open').forEach(function (el) {
          el.classList.remove('df-mob-open');
          el.querySelector('.df-mob-trigger').setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked
        if (!isOpen) {
          item.classList.add('df-mob-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── Wire up hamburger toggle ──────────────────────────── */
  function initHamburger(headerEl, drawer) {
    var btn = headerEl.querySelector('#df-hamburger-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isOpen = drawer.classList.contains('df-drawer-open');

      if (isOpen) {
        drawer.classList.remove('df-drawer-open');
        headerEl.classList.remove('df-mobile-open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        drawer.classList.add('df-drawer-open');
        headerEl.classList.add('df-mobile-open');
        btn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!headerEl.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('df-drawer-open');
        headerEl.classList.remove('df-mobile-open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Hide old Formlabs header ──────────────────────────── */
  function hideOldHeader() {
    /* The original Formlabs nav has class "Header_header__WTZds" and the
       drawer has class "Drawer_drawer__rBp_q". We hide both without deleting
       so the page layout doesn't break unexpectedly. */
    var selectors = [
      'nav.global-styles--header',
      '.Drawer_backdrop__C2jT4',
      '.Drawer_drawer__rBp_q',
      '[class*="Header_header"]',
      '[class*="SiteSwitcher_switcher"]'
    ];

    selectors.forEach(function (sel) {
      try {
        document.querySelectorAll(sel).forEach(function (el) {
          el.style.setProperty('display', 'none', 'important');
          el.setAttribute('aria-hidden', 'true');
        });
      } catch (e) { /* selector might not exist */ }
    });
  }

  /* ── Main init ─────────────────────────────────────────── */
  function init() {
    // Inject CSS link if not already present
    if (!document.getElementById('df-header-css')) {
      /* Figure out path to dualform-header.css relative to the current page */
      var cssPath = window.location.pathname;
      var parts   = cssPath.split('/');
      var fcIdx   = parts.indexOf('formlabs.com');
      var depth   = fcIdx !== -1 ? parts.length - fcIdx - 2 : 0;
      var pfx     = '';
      for (var i = 0; i < depth; i++) pfx += '../';

      var link    = document.createElement('link');
      link.id     = 'df-header-css';
      link.rel    = 'stylesheet';
      link.href   = pfx + 'dualform-header.css';
      document.head.insertBefore(link, document.head.firstChild);
    }

    // Determine prefix for links
    var cssPath2 = window.location.pathname;
    var parts2   = cssPath2.split('/');
    var fcIdx2   = parts2.indexOf('formlabs.com');
    var depth2   = fcIdx2 !== -1 ? parts2.length - fcIdx2 - 2 : 0;
    var pfx2     = '';
    for (var j = 0; j < depth2; j++) pfx2 += '../';
    var root2    = pfx2 || './';

    var built  = buildHeader();
    var header = built.header;
    var drawer = buildDrawer(built.root);

    // Insert before any existing content
    var body = document.body;
    body.insertBefore(drawer, body.firstChild);
    body.insertBefore(header, body.firstChild);

    // Offset body
    body.classList.add('df-header-active');

    // Hide old Formlabs navbar
    hideOldHeader();

    // Events
    initMobileAccordion(drawer);
    initHamburger(header, drawer);

    // Keyboard: ESC closes drawer
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        drawer.classList.remove('df-drawer-open');
        header.classList.remove('df-mobile-open');
        var btn2 = header.querySelector('#df-hamburger-btn');
        if (btn2) btn2.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
