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

  // Teléfono: entre 8 y 13 números reales (espacios, guiones, paréntesis y + no cuentan)
  const TEL_MSG = 'Ingresá un teléfono válido, ej. 11 1234 5678';
  function telefonoValido(valor) {
    const n = String(valor || '').replace(/\D/g, '').length;
    return n >= 8 && n <= 13;
  }
  document.querySelectorAll('input[name="telefono"]').forEach(input => {
    input.addEventListener('input', () => input.setCustomValidity(telefonoValido(input.value) ? '' : TEL_MSG));
  });

  form.onsubmit = e => {
    e.preventDefault();
    const telInput = e.target.querySelector('input[name="telefono"]');
    if(telInput && !telefonoValido(telInput.value)){
      telInput.setCustomValidity(TEL_MSG);
      telInput.reportValidity();
      return;
    }
    const f = new FormData(form);
    // Conversiones: Lead (solo el formulario) + Contact una vez por visita + Google con el mismo ID que Meta.
    // "origen" distingue home, contacto y cada ficha.
    const tel = window.telefonoE164 ? telefonoE164(f.get('telefono')) : '';
    const leadEventId = window.trackMeta ? trackMeta('Lead', {
      content_name: f.get('origen'),
      content_category: f.get('producto') || 'Asesoramiento'
    }) : '';
    if(window.contactUnaVez) contactUnaVez(f.get('origen')); // el formulario termina en WhatsApp: cuenta como contacto, una sola vez por visita
    if(window.gtag && window.GADS_FORM){
      gtag('event', 'conversion', {send_to: window.GADS_FORM, transaction_id: leadEventId});
    }
    const lines = ['Hola Toldos Ludmila, quiero pedirles un presupuesto.',
      'Nombre: ' + f.get('nombre'), 'Teléfono: ' + f.get('telefono'), 'Zona: ' + f.get('zona'),
      'Producto: ' + (f.get('producto') || 'Necesito asesoramiento')];
    // Envía el lead a GHL sin frenar WhatsApp ni el /gracias
    if(GHL_WEBHOOK){
      const ls = k => { try { return localStorage.getItem(k) || ''; } catch(_) { return ''; } };
      const cookie = n => (document.cookie.split('; ').find(c => c.startsWith(n + '=')) || '').split('=')[1] || '';
      const nombre = String(f.get('nombre') || '').trim();
      const data = {
        full_name: nombre,
        first_name: nombre.split(' ')[0],
        last_name: nombre.split(' ').slice(1).join(' '),
        phone: tel || String(f.get('telefono') || '').trim(), // formato +549..., para unirlo con el chat de WhatsApp
        zona: f.get('zona') || '',
        producto: f.get('producto') || 'Necesito asesoramiento',
        origen: f.get('origen') || '',
        pagina: location.href,
        utm_source: ls('utm_source'), utm_medium: ls('utm_medium'), utm_campaign: ls('utm_campaign'),
        utm_content: ls('utm_content'), utm_term: ls('utm_term'), fbclid: ls('fbclid'),
        gclid: ls('gclid'), gbraid: ls('gbraid'), wbraid: ls('wbraid'),
        event_id: leadEventId,
        fbp: cookie('_fbp'),
        fbc: cookie('_fbc'),
        fecha: new Date().toISOString()
      };
      // Un solo envío "simple" (sin preflight CORS): formulario urlencoded, que GHL acepta
      try {
        fetch(GHL_WEBHOOK, {method: 'POST', mode: 'no-cors', keepalive: true, body: new URLSearchParams(data)}).catch(() => {});
      } catch(_) {}
    }
    const url = 'https://wa.me/5491156096890?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank');

    const nombre = String(f.get('nombre')).trim().split(' ')[0];
    thanks.innerHTML = '<h3>¡Gracias' + (nombre ? ', ' + nombre.replace(/[<>&"]/g, '') : '') + '!</h3>' +
      '<p>Se abrió WhatsApp con tu consulta lista. Enviala y te respondemos con la opción que conviene y el precio.</p>' +
      '<p><a class="btn" target="_blank" rel="noopener">Abrir WhatsApp de nuevo</a></p>' +
      '<button type="button" class="link">Hacer otra consulta</button>';
    thanks.querySelector('a').href = url;
    thanks.querySelector('a').dataset.ubicacion = 'gracias_reabrir'; // no vuelve a contar: ya se contó con el formulario
    thanks.querySelector('.link').onclick = () => history.back();
    card.classList.add('is-sent');
    form.reset();
    if(location.pathname !== '/gracias') history.pushState({gracias: true}, '', '/gracias');
    thanks.focus({preventScroll: true});
    card.scrollIntoView({behavior: 'smooth', block: 'center'});
  };

  addEventListener('popstate', () => { if(location.pathname !== '/gracias') reset(); });
})();
