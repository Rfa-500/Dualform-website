(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────────────────── */

  /** Find the outermost TwelveColumnLayout section that contains `text` */
  function findSectionByText(text) {
    var lc = text.toLowerCase();
    var wrappers = document.querySelectorAll(
      '.TwelveColumnLayout_wrapper__OBqeh, section[class*="TwelveColumnLayout_wrapper"]'
    );
    for (var i = 0; i < wrappers.length; i++) {
      if (wrappers[i].textContent.toLowerCase().indexOf(lc) !== -1) {
        return wrappers[i];
      }
    }
    return null;
  }

  function hideSection(el) {
    if (el) el.classList.add('df-hide-legacy');
  }

  function svgIcon(path, vb) {
    vb = vb || '0 0 24 24';
    return '<svg viewBox="' + vb + '"><' + 'g>' + path + '<\/g><\/svg>';
  }

  var ICON = {
    printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    layers:  '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    arrow:   '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'
  };

  /* ─────────────────────────────────────────────────────────
     1. DROPDOWN HOVER — JS reinforcement (CSS does most work)
  ───────────────────────────────────────────────────────── */
  function fixDropdowns() {
    var items = document.querySelectorAll('#df-header .df-nav-item');
    items.forEach(function (item) {
      var drop = item.querySelector('.df-dropdown');
      if (!drop) return;
      var t = null;
      function open()  { clearTimeout(t); drop.style.opacity='1'; drop.style.visibility='visible'; drop.style.pointerEvents='auto'; drop.style.transform='translateX(-50%) translateY(0)'; }
      function close() { t = setTimeout(function(){ drop.style.opacity=''; drop.style.visibility=''; drop.style.pointerEvents=''; drop.style.transform=''; }, 140); }
      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      drop.addEventListener('mouseenter', open);
      drop.addEventListener('mouseleave', close);
    });
  }

  /* ─────────────────────────────────────────────────────────
     2. HERO — Add Spanish title + translate buttons
  ───────────────────────────────────────────────────────── */
  function injectHeroTitle() {
    // Only run once
    if (document.getElementById('df-hero-title-injected')) return;
    var ctaWrapper = document.querySelector('.WhitePaperCta_wrapper__3qC_Y, .WhitePaperCta_layout__s91ex');
    if (!ctaWrapper) return;

    var titleEl = document.createElement('div');
    titleEl.id = 'df-hero-title-injected';
    titleEl.innerHTML = '<h1 style="font-family:var(--df-font-global,\'Proxima Nova\',\'Nunito Sans\',sans-serif);font-size:clamp(26px,3.5vw,48px);font-weight:800;color:#ffffff;text-align:center;line-height:1.15;letter-spacing:-0.03em;margin:0 0 28px;text-shadow:0 2px 24px rgba(0,0,0,0.25);max-width:820px;padding:0 20px;">Manufactura 3D e inyección plástica para empresas</h1>';

    // Insert before the CTA buttons wrapper
    var layout = document.querySelector('.WhitePaperCta_layout__s91ex');
    if (layout) {
      layout.insertBefore(titleEl, layout.firstChild);
    } else {
      ctaWrapper.parentNode.insertBefore(titleEl, ctaWrapper);
    }
  }

  function translateHeroButtons() {
    document.querySelectorAll('.WhitePaperCta_wrapper__3qC_Y a, .WhitePaperCta_layout__s91ex a').forEach(function (a) {
      var sp = a.querySelector('span');
      var txt = (sp || a).textContent.trim();
      if (/explore\s+3d\s+printers/i.test(txt)) {
        (sp || a).textContent = 'Explorar servicios'; a.href = 'servicios/index.html';
      } else if (/contact\s+sales/i.test(txt)) {
        (sp || a).textContent = 'Solicitar cotización'; a.href = 'contacto/index.html';
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     3. SECTOR CARDS — New 8-card uniform section
        Replaces legacy LinksSection tiles entirely
  ───────────────────────────────────────────────────────── */

  var SECTOR_CARDS = [
    { name: 'Ingeniería',          icon: '<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/>' },
    { name: 'Prototipado',         icon: '<path d="M12 2L2 7l10 5 10-5-10-5"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' },
    { name: 'Mantenimiento',       icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' },
    { name: 'Piezas funcionales',  icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/>' },
    { name: 'Fabricación',         icon: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>' },
    { name: 'Moldes',              icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
    { name: 'Desarrollo de producto', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
    { name: 'Producción',          icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>' }
  ];

  function injectSectorsSection() {
    if (document.getElementById('df-sectors-section')) return;

    // Find the #industries container — insert directly after it
    var industriesEl = document.getElementById('industries');
    if (!industriesEl) return;

    var cardsHTML = SECTOR_CARDS.map(function(s) {
      return '<div class="df-sector-card">'
        + '<div class="df-sector-icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' + s.icon + '</svg></div>'
        + '<div class="df-sector-name">' + s.name + '</div>'
        + '</div>';
    }).join('');

    var sec = document.createElement('div');
    sec.id = 'df-sectors-section';
    sec.innerHTML = '<div class="df-sectors-inner">'
      + '<div class="df-sectors-label">Sectores de aplicación</div>'
      + '<div class="df-sectors-grid">' + cardsHTML + '</div>'
      + '</div>';

    industriesEl.insertAdjacentElement('afterend', sec);
  }

  function deactivateIndustryCards() {
    document.querySelectorAll('.LinksSection_link__FcOz8, .LinksSection_tile__ctao0').forEach(function(el){
      el.style.setProperty('display','none','important');
    });
  }

  /* ─────────────────────────────────────────────────────────
     4. SERVICIOS SECTION — Premium horizontal showcase
  ───────────────────────────────────────────────────────── */
  function injectServiciosSection() {
    if (document.getElementById('df-servicios-section')) return;
    var anchor = document.getElementById('featured-products') || document.getElementById('industries');
    if (!anchor) return;

    var ARROW_R = '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>';

    var services = [
      {
        title: 'Impresión 3D',
        desc:  'Fabricación de piezas en plástico de alta precisión usando FDM, SLA y SLS. Ideal para prototipos y piezas funcionales.',
        href:  'impresion-3d/index.html',
        icon:  '<path d="M6 9V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><rect x="2" y="9" width="20" height="13" rx="2"/><line x1="12" y1="13" x2="12" y2="19"/>'
      },
      {
        title: 'Inyección de Plástico',
        desc:  'Producción de piezas plásticas en volúmenes medianos y altos con excelente acabado superficial y repetibilidad.',
        href:  'inyeccion-de-plastico/index.html',
        icon:  '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>'
      },
      {
        title: 'Diseño 3D',
        desc:  'Modelado CAD profesional y diseño orientado a manufactura (DFM). Del concepto al archivo listo para producción.',
        href:  'servicios/index.html',
        icon:  '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'
      },
      {
        title: 'Prototipado Rápido',
        desc:  'Del concepto al prototipo físico en horas. Validamos forma, ajuste y función antes de comprometerte con herramienta.',
        href:  'servicios/index.html',
        icon:  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
      },
      {
        title: 'Piezas Funcionales',
        desc:  'Producción de piezas listas para uso final con los materiales y procesos óptimos para cada aplicación industrial.',
        href:  'servicios/index.html',
        icon:  '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/>'
      },
      {
        title: 'Selección de Materiales',
        desc:  'Asesoría en la elección del material óptimo según requerimientos mecánicos, térmicos, químicos o estéticos.',
        href:  'servicios/index.html',
        icon:  '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
      }
    ];

    var cards = services.map(function(s, i) {
      var num = (i + 1 < 10 ? '0' : '') + (i + 1);
      return '<div class="df-serv-card">'
        + '<div class="df-serv-card-img">'
        + '<span class="df-serv-num">' + num + '</span>'
        + '<div class="df-serv-card-icon">'
        + svgIcon(s.icon)
        + '<span class="df-serv-placeholder-label">Imagen próximamente</span>'
        + '</div>'
        + '</div>'
        + '<div class="df-serv-card-body">'
        + '<h3>' + s.title + '</h3>'
        + '<p>' + s.desc + '</p>'
        + '<a class="df-serv-card-link" href="' + s.href + '">Ver más ' + ARROW_R + '</a>'
        + '</div>'
        + '</div>';
    }).join('');

    var dots = services.map(function(_, i) {
      return '<span class="df-serv-dot' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '"></span>';
    }).join('');

    var sec = document.createElement('div');
    sec.id = 'df-servicios-section';
    sec.innerHTML =
      '<div class="df-serv-inner">'
      + '<div class="df-serv-header">'
      + '<span class="df-serv-eyebrow">Nuestros servicios</span>'
      + '<h2>Servicios <span>principales</span></h2>'
      + '<p>Soluciones de manufactura aditiva e inyección para cada etapa de tu proyecto.</p>'
      + '</div>'
      + '<div class="df-serv-track-wrap">'
      + '<div class="df-serv-track" id="df-serv-track">' + cards + '</div>'
      + '</div>'
      + '<div class="df-serv-dots" id="df-serv-dots">' + dots + '</div>'
      + '</div>';

    anchor.insertAdjacentElement('afterend', sec);

    // ── Carousel auto-play (RAF-based, infinite loop) ──
    setTimeout(function() {
      var track = document.getElementById('df-serv-track');
      var dotsEl = document.getElementById('df-serv-dots');
      if (!track) return;

      // Double the cards for seamless infinite scroll
      track.innerHTML += track.innerHTML;

      var dotEls = dotsEl ? dotsEl.querySelectorAll('.df-serv-dot') : [];
      var total = services.length;
      var speed = 0.55;   // px per frame — slow & premium
      var isPaused = false;
      var isDragging = false;
      var dragStartX = 0;
      var dragScrollStart = 0;

      // Pause on hover
      track.addEventListener('mouseenter', function() { isPaused = true; });
      track.addEventListener('mouseleave', function() { if (!isDragging) isPaused = false; });

      // Pause on touch
      track.addEventListener('touchstart', function() { isPaused = true; }, { passive: true });
      track.addEventListener('touchend', function() {
        clearTimeout(track._resumeTouch);
        track._resumeTouch = setTimeout(function() { isPaused = false; }, 1800);
      }, { passive: true });

      // Mouse drag (desktop)
      track.addEventListener('mousedown', function(e) {
        isDragging = true;
        isPaused = true;
        dragStartX = e.pageX;
        dragScrollStart = track.scrollLeft;
        track.style.cursor = 'grabbing';
      });
      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        track.scrollLeft = dragScrollStart - (e.pageX - dragStartX);
      });
      document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
        clearTimeout(track._resumeDrag);
        track._resumeDrag = setTimeout(function() { isPaused = false; }, 1500);
      });

      // Dot sync helper
      function syncDots() {
        if (!dotEls.length) return;
        // Get card width (320px + 20px gap)
        var firstCard = track.querySelector('.df-serv-card');
        var cw = firstCard ? firstCard.offsetWidth + 20 : 340;
        var halfScroll = track.scrollWidth / 2;
        var pos = track.scrollLeft % halfScroll;
        var idx = Math.round(pos / cw) % total;
        dotEls.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
      }

      // RAF loop
      function frame() {
        if (!isPaused) {
          track.scrollLeft += speed;
          // When we've scrolled past the first copy, jump back silently
          if (track.scrollLeft >= track.scrollWidth / 2) {
            track.scrollLeft -= track.scrollWidth / 2;
          }
          syncDots();
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }, 500);
  }

  /* ─────────────────────────────────────────────────────────
     5. HIDE LEGACY SECTIONS (initial fast pass)
  ───────────────────────────────────────────────────────── */
  function hideLegacySections() {
    // Hide featured products and news by ID (fastest, safest)
    ['featured-products', 'us-featured-products', 'news', 'us-news',
     'localpromo', 'materials'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('df-hide-legacy');
    });

    // Hide legacy Formlabs nav elements (our header replaces them)
    document.querySelectorAll(
      'nav.global-styles--header, [class*="Header_header__WTZds"], ' +
      '[class*="Drawer_backdrop"], [class*="Drawer_drawer__rBp"]'
    ).forEach(function(el) { el.classList.add('df-hide-legacy'); });

    // Hide broken images — but NEVER touch images inside our own header/sections
    document.querySelectorAll('img:not(#df-header img):not(#df-sectors-section img):not(#df-servicios-section img)').forEach(function(img) {
      img.addEventListener('error', function() { this.style.display = 'none'; });
      if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
    });

    // Remove "Buy Now", "Shop All" link buttons
    document.querySelectorAll('a, button').forEach(function(el) {
      var txt = el.textContent.trim().toLowerCase();
      if (txt === 'buy now' || txt === 'shop all' || txt === 'shop now') {
        el.style.display = 'none';
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     6. INJECT — Tecnologías de fabricación  (dark, 2 cards)
  ───────────────────────────────────────────────────────── */
  function injectTecnologiasFab() {
    if (document.getElementById('df-tecnologias-fab')) return;
    var anchor = document.getElementById('df-servicios-section');

    var cards = [
      { title:'Impresión 3D', desc:'Fabricación de prototipos, piezas funcionales y componentes personalizados mediante tecnologías de impresión 3D de alta precisión.', adv:['Ideal para prototipado rápido','Bajo costo de entrada','Geometrías complejas sin molde','Producción flexible y personalizada'], icon:ICON.printer, href:'impresion-3d/index.html' },
      { title:'Inyección de Plástico', desc:'Producción de piezas plásticas para bajo o alto volumen mediante procesos de moldeo e inyección con acabados superiores.', adv:['Ideal para producción repetitiva','Excelente acabado superficial','Escalable para alto volumen','Compatible con múltiples materiales'], icon:ICON.layers, href:'inyeccion-de-plastico/index.html' }
    ];

    var cardsHTML = cards.map(function(c) {
      var advList = c.adv.map(function(a){ return '<li>'+a+'</li>'; }).join('');
      return '<div class="df-tf-card">'
        +'<div class="df-tf-img"><div class="df-tf-img-icon">'+svgIcon(c.icon)+'<span>Imagen próximamente</span></div></div>'
        +'<div class="df-tf-body"><h3>'+c.title+'</h3><p>'+c.desc+'</p>'
        +'<ul class="df-tf-advantages">'+advList+'</ul>'
        +'<a class="df-tf-btn" href="'+c.href+'">Ver tecnología '+svgIcon(ICON.arrow)+'</a>'
        +'</div></div>';
    }).join('');

    var sec = document.createElement('div');
    sec.id = 'df-tecnologias-fab';
    sec.innerHTML = '<div class="df-tf-inner">'
      +'<div class="df-tf-header"><h2>Tecnologías de <span>fabricación</span></h2>'
      +'<p>Dos procesos complementarios para cualquier volumen, geometría o material.</p></div>'
      +'<div class="df-tf-grid">'+cardsHTML+'</div></div>';
    if (anchor) anchor.insertAdjacentElement('afterend', sec);
    else document.body.appendChild(sec);
  }

  /* ─────────────────────────────────────────────────────────
     7. INJECT — Materiales y aplicaciones  (chip selector)
  ───────────────────────────────────────────────────────── */
  var matData = {
    'Rígidos':              { tag:'PP · ABS · PLA', title:'Materiales Rígidos', desc:'Piezas estructurales, carcasas y componentes que requieren alta rigidez y resistencia mecánica bajo cargas estáticas o dinámicas.', apps:['Carcasas y tapas de productos','Soportes estructurales','Conectores y fijaciones','Piezas de precisión dimensional'] },
    'Flexibles':            { tag:'TPU · TPE · Silicona', title:'Materiales Flexibles', desc:'Ideal para piezas que requieren elasticidad, absorción de impactos o sellado hermético en aplicaciones industriales o de consumo.', apps:['Juntas y sellos','Mangos ergonómicos','Piezas con ajuste a presión','Protectores de golpes'] },
    'Alta temperatura':     { tag:'PEEK · PPS · PC', title:'Alta Temperatura', desc:'Materiales que mantienen sus propiedades mecánicas y dimensionales a temperaturas superiores a 150°C en entornos exigentes.', apps:['Componentes automotrices','Piezas cerca de motores','Conectores eléctricos','Utillajes de producción'] },
    'Nylon':                { tag:'PA6 · PA12 · PA66', title:'Nylon (Poliamida)', desc:'Excelente combinación de resistencia mecánica, rigidez, tenacidad y resistencia química para piezas industriales de uso final.', apps:['Engranajes y poleas','Bujes y rodamientos','Piezas estructurales ligeras','Componentes de maquinaria'] },
    'Resinas técnicas':     { tag:'ABS · PC · POM', title:'Resinas Técnicas', desc:'Amplia familia de plásticos de ingeniería con propiedades específicas para cada aplicación funcional de mayor exigencia.', apps:['Prototipos funcionales de alta fidelidad','Piezas de precisión','Herramental liviano','Componentes ópticos'] },
    'Plásticos ingeniería': { tag:'PC · POM · PSU', title:'Plásticos de Ingeniería', desc:'Materiales avanzados con propiedades mecánicas, térmicas y eléctricas superiores para las aplicaciones más demandantes.', apps:['Piezas transparentes y ópticas','Componentes eléctricos','Piezas de alta carga','Estructuras críticas'] },
    'Prototipos':           { tag:'Prototipado rápido', title:'Prototipos y Concepto', desc:'Materiales y procesos optimizados para fabricar prototipos de validación rápida, diseño y presentación ante clientes.', apps:['Modelos de presentación','Prototipos de forma y ajuste','Pruebas ergonómicas','Validación dimensional'] },
    'Piezas funcionales':   { tag:'Uso final', title:'Piezas Funcionales', desc:'Piezas terminadas listas para instalarse en ensamblajes finales, bajo los mismos estándares que una pieza inyectada.', apps:['Piezas de reemplazo','Componentes de ensamblaje final','Series cortas de producción','Piezas certificadas'] },
    'Moldes':               { tag:'Molde · Inserto · Utillaje', title:'Moldes y Utillaje', desc:'Fabricación de moldes prototipo, insertos de inyección y utillaje productivo a tiempos y costos muy inferiores al acero convencional.', apps:['Moldes de inyección prototipo','Insertos intercambiables','Utillajes de ensamblaje','Patrones de fundición'] },
    'Bajo volumen':         { tag:'1 – 5,000 piezas', title:'Bajo Volumen', desc:'Estrategias de fabricación optimizadas para series pequeñas donde los costos de herramental tradicional no son justificables.', apps:['Series de 1 a 100 piezas','Piezas para proyectos piloto','Validaciones previas a producción','Piezas de repuesto exclusivas'] }
  };

  function injectMateriales() {
    if (document.getElementById('df-materiales')) return;
    var anchor = document.getElementById('df-tecnologias-fab');

    var chips = Object.keys(matData).map(function(k,i) {
      return '<button class="df-chip'+(i===0?' df-chip-active':'')+'" data-mat="'+k+'">'+k+'</button>';
    }).join('');

    var firstKey = Object.keys(matData)[0];
    var fd = matData[firstKey];
    var panelHTML = buildMatPanel(fd);

    var sec = document.createElement('div');
    sec.id = 'df-materiales';
    sec.innerHTML = '<div class="df-mat-inner">'
      +'<div class="df-mat-header"><h2>Materiales y <span>aplicaciones reales</span></h2>'
      +'<p>Selecciona una categoría para explorar materiales y ejemplos de uso en impresión 3D e inyección plástica.</p></div>'
      +'<div class="df-chip-bar">'+chips+'</div>'
      +'<div class="df-mat-panel" id="df-mat-panel">'+panelHTML+'</div>'
      +'</div>';
    if (anchor) anchor.insertAdjacentElement('afterend', sec);
    else document.body.appendChild(sec);

    // Wire up chip clicks
    sec.querySelectorAll('.df-chip').forEach(function(btn) {
      btn.addEventListener('click', function() {
        sec.querySelectorAll('.df-chip').forEach(function(b){ b.classList.remove('df-chip-active'); });
        btn.classList.add('df-chip-active');
        var panel = document.getElementById('df-mat-panel');
        panel.classList.add('df-fading');
        setTimeout(function(){
          panel.innerHTML = buildMatPanel(matData[btn.getAttribute('data-mat')]);
          panel.classList.remove('df-fading');
        }, 180);
      });
    });
  }

  function buildMatPanel(d) {
    var apps = d.apps.map(function(a){ return '<li>'+a+'</li>'; }).join('');
    return '<div class="df-mat-left">'
      +'<div class="df-mat-img"><span class="df-mat-img-label">Imagen próximamente</span></div>'
      +'</div>'
      +'<div class="df-mat-right">'
      +'<span class="df-mat-tag">'+d.tag+'</span>'
      +'<div class="df-mat-title">'+d.title+'</div>'
      +'<p class="df-mat-desc">'+d.desc+'</p>'
      +'<ul class="df-mat-apps">'+apps+'</ul>'
      +'</div>';
  }

  /* ─────────────────────────────────────────────────────────
     8. INJECT — Clientes y proyectos (logo carousel)
  ───────────────────────────────────────────────────────── */
  function injectNuestrasTecnologias() {
    if (document.getElementById('df-nuestras-tech')) return;
    var anchor = document.getElementById('df-materiales');

    var LOGOS = [
      { name: 'Diseño MX',        initials: 'DM', color: '#0f1f3d' },
      { name: 'Grupo Manufactura', initials: 'GM', color: '#1a3a5c' },
      { name: 'Tech Parts Co.',   initials: 'TP', color: '#2a1040' },
      { name: 'Plásticos Norte',  initials: 'PN', color: '#1a2010' },
      { name: 'Innovación 3D',    initials: 'I3', color: '#3a1818' },
      { name: 'Moldes Precisión', initials: 'MP', color: '#0a2030' },
    ];

    // Double for infinite loop
    function logoCard(l) {
      return '<div class="df-logo-card">'
        + '<div class="df-logo-placeholder" style="background:linear-gradient(135deg,' + l.color + ' 0%,#555 100%)">' + l.initials + '</div>'
        + '<span class="df-logo-name">' + l.name + '</span>'
        + '</div>';
    }
    var logosHTML = LOGOS.concat(LOGOS).map(logoCard).join('');

    var sec = document.createElement('div');
    sec.id = 'df-nuestras-tech';
    sec.innerHTML =
      '<div class="df-clientes-inner">'
      + '<div class="df-clientes-header">'
      + '<span class="df-clientes-eyebrow">Clientes y proyectos</span>'
      + '<h2>Empresas y proyectos que <span>confían en Dualform</span></h2>'
      + '</div>'
      + '<div class="df-logos-track-wrap">'
      + '<div class="df-logos-track" id="df-logos-track">' + logosHTML + '</div>'
      + '</div>'
      + '</div>';

    if (anchor) anchor.insertAdjacentElement('afterend', sec);
    else document.body.appendChild(sec);

    // Auto-scroll logos
    setTimeout(function() {
      var track = document.getElementById('df-logos-track');
      if (!track) return;
      var isPaused = false;
      track.addEventListener('mouseenter', function() { isPaused = true; });
      track.addEventListener('mouseleave', function() { isPaused = false; });
      function scrollLogos() {
        if (!isPaused) {
          track.scrollLeft += 0.5;
          if (track.scrollLeft >= track.scrollWidth / 2) {
            track.scrollLeft -= track.scrollWidth / 2;
          }
        }
        requestAnimationFrame(scrollLogos);
      }
      requestAnimationFrame(scrollLogos);
    }, 700);
  }

  /* ─────────────────────────────────────────────────────────
     9. INJECT — CTA Contacto (dark)
  ───────────────────────────────────────────────────────── */
  function injectCTA() {
    if (document.getElementById('df-cta-contact')) return;
    var anchor = document.getElementById('df-nuestras-tech');

    // Build root-relative CTA link path
    var ctaHref = (function(){
      var p = window.location.pathname.split('/');
      var fi = p.indexOf('formlabs.com');
      var d = fi !== -1 ? p.length - fi - 2 : 0;
      var pfx = ''; for(var i=0;i<d;i++) pfx+='../';
      return (pfx||'') + 'contacto/index.html';
    })();

    var sec = document.createElement('div');
    sec.id = 'df-cta-contact';
    sec.innerHTML = '<div class="df-cta-inner">'
      +'<span class="df-cta-eyebrow">Cotización sin costo</span>'
      +'<h2>¿Tienes una pieza o proyecto en mente?</h2>'
      +'<p>Podemos ayudarte a convertir una idea, plano o muestra física en una pieza fabricada mediante impresión 3D o inyección plástica.</p>'
      +'<a class="df-cta-btn" href="'+ctaHref+'">Solicitar cotización '+svgIcon(ICON.arrow)+'</a>'
      +'</div>';
    if (anchor) anchor.insertAdjacentElement('afterend', sec);
    else document.body.appendChild(sec);
  }

  /* ─────────────────────────────────────────────────────────
     10. REPLACE FOOTER
  ───────────────────────────────────────────────────────── */
  function replaceFooter() {
    if (document.getElementById('df-footer')) return;

    // Hide old footer
    document.querySelectorAll('footer:not(#df-footer), [class*="Footer_footer"]:not(#df-footer)').forEach(function(f){
      f.classList.add('df-hide-legacy');
    });

    // Build root-relative footer link prefix
    var ftPfx = (function(){
      var p = window.location.pathname.split('/');
      var fi = p.indexOf('formlabs.com');
      var d = fi !== -1 ? p.length - fi - 2 : 0;
      var pfx = ''; for(var i=0;i<d;i++) pfx+='../';
      return pfx;
    })();

    var yr = new Date().getFullYear();
    var footer = document.createElement('footer');
    footer.id = 'df-footer';
    footer.innerHTML = '<div class="df-ft-inner">'    
      +'<div class="df-ft-top">'
        +'<div class="df-ft-brand">'
          +'<a class="df-ft-logo" href="'+ftPfx+'index.html">'
            +'<div class="df-ft-logo-icon">'+svgIcon('<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>')+'</div>'
            +'<span class="df-ft-logo-text">Dual<span>form</span></span>'
          +'</a>'
          +'<p class="df-ft-tagline">Manufactura avanzada en impresión 3D e inyección plástica para industria y diseño.</p>'
        +'</div>'
        +'<div class="df-ft-col"><h4>Servicios</h4><ul>'
          +'<li><a href="'+ftPfx+'impresion-3d/index.html">Impresión 3D</a></li>'
          +'<li><a href="'+ftPfx+'inyeccion-de-plastico/index.html">Inyección de plástico</a></li>'
          +'<li><a href="'+ftPfx+'servicios/index.html">Diseño 3D</a></li>'
          +'<li><a href="'+ftPfx+'servicios/index.html">Prototipado rápido</a></li>'
        +'</ul></div>'
        +'<div class="df-ft-col"><h4>Aplicaciones</h4><ul>'
          +'<li><a href="'+ftPfx+'aplicaciones/index.html">Prototipado rápido</a></li>'
          +'<li><a href="'+ftPfx+'aplicaciones/index.html">Piezas de uso final</a></li>'
          +'<li><a href="'+ftPfx+'industria/index.html">Ingeniería</a></li>'
          +'<li><a href="'+ftPfx+'industria/index.html">Fabricación</a></li>'
        +'</ul></div>'
        +'<div class="df-ft-col"><h4>Contacto</h4><ul>'
          +'<li><a href="'+ftPfx+'contacto/index.html">Solicitar cotización</a></li>'
          +'<li><a href="'+ftPfx+'contacto/index.html">Soporte técnico</a></li>'
          +'<li><span>contacto@dualform.mx</span></li>'
          +'<li><span>+52 (55) 0000-0000</span></li>'
        +'</ul></div>'
      +'</div>'
      +'<hr class="df-ft-divider">'
      +'<div class="df-ft-bottom">'
        +'<span class="df-ft-copy">&copy; '+yr+' Dualform. Todos los derechos reservados.</span>'
        +'<div class="df-ft-legal">'
          +'<a href="#">Privacidad</a>'
          +'<a href="#">Términos de uso</a>'
        +'</div>'
      +'</div>'
    +'</div>';

    // Insert after CTA or before end of body
    var ctaSec = document.getElementById('df-cta-contact');
    if (ctaSec) ctaSec.insertAdjacentElement('afterend', footer);
    else document.body.appendChild(footer);
  }

  /* ─────────────────────────────────────────────────────────
     SURGICAL LEGACY HIDE — only specific known sections
  ───────────────────────────────────────────────────────── */

  // IDs of known legacy Formlabs sections to always hide
  var LEGACY_SECTION_IDS = [
    'news', 'us-news', 'eu-uk-global-news', 'de-ch-news', 'fr-news',
    'it-news', 'es-latam-news', 'cn-news', 'jp-news', 'kr-news',
    'us-featured-products', 'eu-featured-products', 'uk-featured-products',
    'de-featured-products', 'ch-featured-products', 'fr-featured-products',
    'it-featured-products', 'es-featured-products', 'global-latam-apac-featured-products',
    'localpromo', 'materials'
  ];

  function sweepLegacy() {
    // ── 1. Hide specific known legacy section IDs ──────────────────────────
    LEGACY_SECTION_IDS.forEach(function(id) {
      var el = document.getElementById(id);
      if (el && (!el.id || el.id.indexOf('df-') !== 0)) {
        el.classList.add('df-hide-legacy');
      }
    });

    // ── 2. Hide by known Formlabs class names (section-level only) ─────────
    var SECTION_SELECTORS = [
      '[class*="NewsSection_main"]',
      '[class*="ProductsSection_wrapper"]',
      '[class*="IndustrySection_wrapper"]',
      '[class*="GetInTouchSection_wrapper"]',
      '[class*="MediaTextSection_section-wrapper"]',
      '[class*="IndustrySection_wrapper"]',
      'section[data-sticky-menu-theme][class*="IndustrySection"]',
      'section[data-sticky-menu-theme][class*="GetInTouch"]'
    ];
    SECTION_SELECTORS.forEach(function(sel) {
      try {
        document.querySelectorAll(sel).forEach(function(el) {
          if (el.id && el.id.indexOf('df-') === 0) return;
          if (el.closest && el.closest('#df-footer, #df-servicios-section, #df-tecnologias-fab, #df-materiales, #df-nuestras-tech, #df-cta-contact, #df-sectors-section')) return;
          el.classList.add('df-hide-legacy');
        });
      } catch(e) {}
    });

    // ── 3. Hide old Formlabs footer ────────────────────────────────────────
    document.querySelectorAll('footer:not(#df-footer)').forEach(function(f) {
      f.classList.add('df-hide-legacy');
    });
    document.querySelectorAll('[class*="GlobalFooter"], [class*="Footer_footer__vpzPu"]').forEach(function(f) {
      if (f.id !== 'df-footer' && !f.closest('#df-footer')) f.classList.add('df-hide-legacy');
    });

    // ── 4. Hide legacy hero buttons / buy links ────────────────────────────
    document.querySelectorAll('a').forEach(function(a) {
      var t = a.textContent.trim().toLowerCase();
      if (t === 'buy now' || t === 'shop all' || t === 'shop now' ||
          t === 'contact sales' || t === 'explore 3d printers') {
        a.style.display = 'none';
      }
    });

    // ── 5. Hide broken images ──────────────────────────────────────────────
    document.querySelectorAll('img').forEach(function(img) {
      if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
      if (!img._dfErrBound) {
        img._dfErrBound = true;
        img.addEventListener('error', function() { img.style.display = 'none'; });
      }
    });

    // ── 6. Hide featured products wrapper (has Buy Now cards) ─────────────
    var fp = document.getElementById('featured-products');
    if (fp) fp.classList.add('df-hide-legacy');

    // ── 7. Hide legacy nav from Formlabs (our header replaces it) ─────────
    document.querySelectorAll(
      '[class*="Header_header__WTZds"], [class*="Drawer_drawer"], [class*="Drawer_backdrop"]'
    ).forEach(function(el) {
      el.classList.add('df-hide-legacy');
    });
  }


  /* ─────────────────────────────────────────────────────────
     RUN
  ───────────────────────────────────────────────────────── */
  function run() {
    fixDropdowns();
    injectHeroTitle();
    translateHeroButtons();
    deactivateIndustryCards();
    injectSectorsSection();
    hideLegacySections();
    sweepLegacy();
    injectServiciosSection();
    injectTecnologiasFab();
    injectMateriales();
    injectNuestrasTecnologias();
    injectCTA();
    replaceFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // Re-sweep after Next.js hydration renders late content
  [300, 800, 1500, 3000].forEach(function(ms) {
    setTimeout(function() {
      sweepLegacy();
      injectHeroTitle();
      translateHeroButtons();
      injectSectorsSection();
    }, ms);
  });

  // MutationObserver: catch any section added dynamically after load
  var observer = new MutationObserver(function(mutations) {
    var needsSweep = false;
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(n) {
        if (n.nodeType === 1) needsSweep = true;
      });
    });
    if (needsSweep) sweepLegacy();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Stop observing after 10 seconds (page is stable by then)
  setTimeout(function() { observer.disconnect(); }, 10000);

})();
