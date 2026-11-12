// Formulario de presupuesto (home, /contacto y fichas de producto)
(function(){
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
    if(f.get('mensaje')) lines.push(f.get('mensaje'));
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
