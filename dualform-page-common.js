/* dualform-page-common.js — shared logic for all internal pages */
(function() {
  function buildFooter() {
    var f = document.getElementById('df-footer');
    if (!f) return;
    var yr = new Date().getFullYear();
    // Detect depth: pages are one level deep inside formlabs.com/
    var pfx = '../';
    f.outerHTML = '<footer id="df-footer" style="background:#0d0d0d;color:#fff;padding:56px 24px 28px;font-family:Inter,sans-serif;">' +
      '<div style="max-width:1200px;margin:0 auto;">' +
        '<div style="display:flex;flex-wrap:wrap;gap:48px;justify-content:space-between;margin-bottom:48px;">' +
          '<div style="max-width:280px;">' +
            '<a href="' + pfx + 'index.html" style="font-size:1.3rem;font-weight:800;color:#fff;text-decoration:none;">Dual<span style="color:#E8521A">form</span></a>' +
            '<p style="color:#555;margin-top:14px;font-size:0.87rem;line-height:1.65;">Manufactura avanzada en impresión 3D e inyección plástica para industria y diseño.</p>' +
          '</div>' +
          '<div><h4 style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#444;margin-bottom:16px;">Servicios</h4>' +
            '<ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">' +
              '<li><a href="' + pfx + 'impresion-3d/index.html" style="color:#888;font-size:0.87rem;text-decoration:none;">Impresión 3D</a></li>' +
              '<li><a href="' + pfx + 'inyeccion-de-plastico/index.html" style="color:#888;font-size:0.87rem;text-decoration:none;">Inyección de plástico</a></li>' +
              '<li><a href="' + pfx + 'servicios/index.html" style="color:#888;font-size:0.87rem;text-decoration:none;">Diseño 3D</a></li>' +
              '<li><a href="' + pfx + 'servicios/index.html" style="color:#888;font-size:0.87rem;text-decoration:none;">Prototipado rápido</a></li>' +
            '</ul></div>' +
          '<div><h4 style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#444;margin-bottom:16px;">Páginas</h4>' +
            '<ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">' +
              '<li><a href="' + pfx + 'aplicaciones/index.html" style="color:#888;font-size:0.87rem;text-decoration:none;">Aplicaciones</a></li>' +
              '<li><a href="' + pfx + 'industria/index.html" style="color:#888;font-size:0.87rem;text-decoration:none;">Industria</a></li>' +
              '<li><a href="' + pfx + 'materiales/index.html" style="color:#888;font-size:0.87rem;text-decoration:none;">Materiales</a></li>' +
              '<li><a href="' + pfx + 'contacto/index.html" style="color:#888;font-size:0.87rem;text-decoration:none;">Contacto</a></li>' +
            '</ul></div>' +
          '<div><h4 style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#444;margin-bottom:16px;">Contacto</h4>' +
            '<ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">' +
              '<li><a href="' + pfx + 'contacto/index.html" style="color:#888;font-size:0.87rem;text-decoration:none;">Solicitar cotización</a></li>' +
              '<li><span style="color:#888;font-size:0.87rem;">contacto@dualform.mx</span></li>' +
              '<li><span style="color:#888;font-size:0.87rem;">+52 (55) 0000-0000</span></li>' +
            '</ul></div>' +
        '</div>' +
        '<div style="border-top:1px solid #1c1c1c;padding-top:22px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">' +
          '<span style="color:#3a3a3a;font-size:0.8rem;">&copy; ' + yr + ' Dualform. Todos los derechos reservados.</span>' +
          '<div style="display:flex;gap:20px;"><a href="#" style="color:#3a3a3a;font-size:0.8rem;text-decoration:none;">Privacidad</a><a href="#" style="color:#3a3a3a;font-size:0.8rem;text-decoration:none;">Términos de uso</a></div>' +
        '</div>' +
      '</div></footer>';
  }

  /* Chip selector helper */
  window.dfChips = function(barId, panelId, data) {
    var keys = Object.keys(data);
    var active = keys[0];
    var bar = document.getElementById(barId);
    var panel = document.getElementById(panelId);
    if (!bar || !panel) return;

    bar.innerHTML = keys.map(function(k) {
      return '<button class="df-chip' + (k === active ? ' active' : '') + '" data-key="' + k + '">' + k + '</button>';
    }).join('');

    bar.querySelectorAll('.df-chip').forEach(function(btn) {
      btn.addEventListener('click', function() {
        active = btn.getAttribute('data-key');
        bar.querySelectorAll('.df-chip').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        render();
      });
    });

    function render() {
      var d = data[active];
      panel.classList.add('fading');
      setTimeout(function() {
        var uses = (d.uses || []).map(function(u) { return '<li>' + u + '</li>'; }).join('');
        var adv  = (d.adv  || []).map(function(u) { return '<li>' + u + '</li>'; }).join('');
        panel.innerHTML =
          '<div class="df-mat-panel-info">' +
            '<span class="df-mat-tag">' + (d.tag || '') + '</span>' +
            '<div class="df-mat-title">' + (d.title || active) + '</div>' +
            '<p class="df-mat-desc">' + (d.desc || '') + '</p>' +
            (adv ? '<h4 style="font-size:0.8rem;color:#E8521A;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;margin-top:16px;">Ventajas</h4><ul class="df-mat-list">' + adv + '</ul>' : '') +
            (uses ? '<h4 style="font-size:0.8rem;color:#E8521A;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;margin-top:16px;">Usos recomendados</h4><ul class="df-mat-list">' + uses + '</ul>' : '') +
          '</div>' +
          '<div class="df-placeholder df-placeholder--light" style="min-height:280px;">' +
            '<div class="df-placeholder-icon"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></div>' +
            '<span class="df-placeholder-label">Imagen — ' + active + '</span>' +
          '</div>';
        panel.classList.remove('fading');
      }, 160);
    }

    render();
  };

  document.addEventListener('DOMContentLoaded', function() {
    buildFooter();
    if (typeof window.dfPageInit === 'function') window.dfPageInit();
  });
})();
