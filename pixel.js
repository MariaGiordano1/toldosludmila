// Meta Pixel de Toldos Ludmila. Se carga en el <head> de todas las páginas: una sola vez por página.
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1444719186983971');
fbq('track', 'PageView');

// Teléfono argentino a formato internacional (+549...), para el CRM
window.telefonoE164 = function (raw) {
  var d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.indexOf('549') === 0) return '+' + d;
  if (d.indexOf('54') === 0) d = d.slice(2);
  d = d.replace(/^0/, '');
  if (d.length === 12 && d.slice(2, 4) === '15') d = d.slice(0, 2) + d.slice(4); // 11 15 XXXX XXXX
  return d.length === 10 ? '+549' + d : '';
};

// Manda el evento al pixel con un ID único y devuelve ese ID (se reusa en Google y en el CRM).
// El envío por servidor lo hace la API de conversiones de Meta (ver punto 10): no agregar otro.
window.trackMeta = function (eventName, params) {
  var eventId = eventName + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  if (window.fbq) fbq('track', eventName, params || {}, { eventID: eventId });
  return eventId;
};

// Contact una sola vez por visita, venga del formulario o de cualquier botón de WhatsApp.
// Devuelve true si lo disparó y false si ya se había contado.
window.contactUnaVez = function (origen) {
  try {
    if (sessionStorage.getItem('tl_contact')) return false;
    sessionStorage.setItem('tl_contact', '1');
  } catch (e) {}
  trackMeta('Contact', { content_name: origen });
  return true;
};

// Clics a WhatsApp: Contact en Meta y conversión en Google, una sola vez por visita
document.addEventListener('click', function (e) {
  var link = e.target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
  if (!link) return;
  var ubicacion = link.dataset.ubicacion || 'whatsapp_sin_ubicacion';
  if (ubicacion === 'gracias_reabrir') return; // ya se contó con el formulario
  if (contactUnaVez(ubicacion) && window.gtag && window.GADS_WA) {
    gtag('event', 'conversion', { send_to: window.GADS_WA });
  }
});

// Origen del anuncio: guarda UTMs, fbclid e identificadores de Google para que sigan disponibles entre páginas (van al CRM)
(function () {
  try {
    var q = new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','gbraid','wbraid'].forEach(function (k) {
      if (q.get(k)) localStorage.setItem(k, q.get(k));
    });
  } catch (err) {}
})();

// Visita con interés: 20 segundos en la página y scroll hasta la mitad. No se usa para optimizar.
(function () {
  var tiempoOk = false, scrollOk = false, enviado = false;
  function revisar() {
    if (!enviado && tiempoOk && scrollOk && window.fbq) {
      enviado = true;
      fbq('trackCustom', 'VisitaInteresada', { pagina: location.pathname });
    }
  }
  setTimeout(function () { tiempoOk = true; revisar(); }, 20000);
  window.addEventListener('scroll', function () {
    var visto = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
    if (visto >= 0.5) { scrollOk = true; revisar(); }
  }, { passive: true });
})();
