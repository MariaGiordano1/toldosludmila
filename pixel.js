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

// Contact: cualquier clic en un link de WhatsApp, con su ubicación (data-ubicacion)
document.addEventListener('click', function (e) {
  var link = e.target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
  if (!link || typeof fbq !== 'function') return;
  fbq('track', 'Contact', {
    content_name: link.dataset.ubicacion || 'whatsapp_sin_ubicacion'
  });
});

// Origen del anuncio: guarda UTMs y fbclid para que sigan disponibles entre páginas (quedan listos para el CRM)
(function () {
  try {
    var q = new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].forEach(function (k) {
      if (q.get(k)) localStorage.setItem(k, q.get(k));
    });
  } catch (err) {}
})();
