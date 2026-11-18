// Formulario de presupuesto (home, /contacto y fichas de producto)
(function(){
  // Webhook entrante del workflow de GoHighLevel (vacío = no envía)
  const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/Ly6sbtqfWRrUfWJV5IqL/webhook-trigger/1c90baba-a477-4988-a1a5-672c2cc1144c';
  const form = document.querySelector('#quote');
  if(!form) return;
  const card = form.parentElement;

  // Preselecciona el producto si viene en la URL: /contacto?producto=...
  const pre = new URLSearchParams(location.search).get('producto');
  if(pre) [...form.producto.options].forEach(o => { if(o.text===pre) o.selected = true; });

  // Mensaje de gracias en la misma página (la URL pasa a /gracias para medir en Meta)
  const thanks = document.createElement('div');
  thanks.className = 'gracias';
  thanks.setAttribute('tabindex', '-1');
  card.appendChild(thanks);
  const reset = () => card.classList.remove('is-sent');

  form.onsubmit = e => {
    e.preventDefault();
    const f = new FormData(form);
    // Eventos de conversión para Meta; "origen" distingue home, contacto y cada ficha
    if(window.fbq) fbq('track', 'Lead', {
      content_name: f.get('origen'),
      content_category: f.get('producto') || 'Asesoramiento'
    });
    if(window.fbq) fbq('track', 'Contact', {content_name: f.get('origen')});
    const lines = ['Hola Toldos Ludmila, quiero pedirles un presupuesto.',
      'Nombre: ' + f.get('nombre'), 'Teléfono: ' + f.get('telefono'), 'Zona: ' + f.get('zona'),
      'Producto: ' + (f.get('producto') || 'Necesito asesoramiento')];
    // Envía el lead a GHL sin frenar WhatsApp ni el /gracias
    if(GHL_WEBHOOK){
      const ls = k => { try { return localStorage.getItem(k) || ''; } catch(_) { return ''; } };
      const nombre = String(f.get('nombre') || '').trim();
      const data = {
        full_name: nombre,
        first_name: nombre.split(' ')[0],
        last_name: nombre.split(' ').slice(1).join(' '),
        phone: String(f.get('telefono') || '').trim(),
        zona: f.get('zona') || '',
        producto: f.get('producto') || 'Necesito asesoramiento',
        origen: f.get('origen') || '',
        pagina: location.href,
        utm_source: ls('utm_source'), utm_medium: ls('utm_medium'), utm_campaign: ls('utm_campaign'),
        utm_content: ls('utm_content'), utm_term: ls('utm_term'), fbclid: ls('fbclid'),
        fecha: new Date().toISOString()
      };
      // JSON primero; si el navegador lo bloquea (CORS), reintenta como formulario simple
      const asForm = () => fetch(GHL_WEBHOOK, {method: 'POST', mode: 'no-cors', keepalive: true,
        body: new URLSearchParams(data)}).catch(() => {});
      try {
        fetch(GHL_WEBHOOK, {method: 'POST', keepalive: true,
          headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}).catch(asForm);
      } catch(_) { asForm(); }
    }
    const url = 'https://wa.me/5491156096890?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank');

    const nombre = String(f.get('nombre')).trim().split(' ')[0];
    thanks.innerHTML = '<h3>¡Gracias' + (nombre ? ', ' + nombre.replace(/[<>&"]/g, '') : '') + '!</h3>' +
      '<p>Se abrió WhatsApp con tu consulta lista. Enviala y te respondemos con la opción que conviene y el precio.</p>' +
      '<p><a class="btn" target="_blank" rel="noopener">Abrir WhatsApp de nuevo</a></p>' +
      '<button type="button" class="link">Hacer otra consulta</button>';
    thanks.querySelector('a').href = url;
    thanks.querySelector('.link').onclick = () => history.back();
    card.classList.add('is-sent');
    form.reset();
    if(location.pathname !== '/gracias') history.pushState({gracias: true}, '', '/gracias');
    thanks.focus({preventScroll: true});
    card.scrollIntoView({behavior: 'smooth', block: 'center'});
  };

  addEventListener('popstate', () => { if(location.pathname !== '/gracias') reset(); });
})();
