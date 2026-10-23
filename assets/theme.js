/* Runs in <head> before paint. Uses its own attribute (data-zb-theme) so a hosting frame
   that sets data-theme cannot override the visitor's choice. window.name is a fallback
   for browsers or sandboxes where localStorage is blocked, so the theme survives page changes. */
(function () {
  var t = null;
  try { t = localStorage.getItem('zb-theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') { var m = /(?:^|;)zbtheme=(light|dark)/.exec(window.name || ''); if (m) t = m[1]; }
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-zb-theme', t);
})();
